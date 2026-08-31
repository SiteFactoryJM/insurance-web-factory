import ExcelJS from "exceljs";
import { copyFile, mkdir, readdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fieldSpec = JSON.parse(await readFile(path.join(root, "config", "intake-fields.json"), "utf8"));
const fieldByKey = new Map(fieldSpec.fields.map((field) => [field.key, field]));
const allowedTemplates = new Set(["trust-blue", "warm-care", "premium-navy", "clean-minimal", "local-friendly"]);

function parseArgs(argv) {
  const args = { file: "", dir: "", overwrite: false, move: false, dryRun: false };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--file") args.file = argv[++index] ?? "";
    else if (value === "--dir") args.dir = argv[++index] ?? "";
    else if (value === "--overwrite") args.overwrite = true;
    else if (value === "--move") args.move = true;
    else if (value === "--dry-run") args.dryRun = true;
    else if (["-h", "--help"].includes(value)) {
      console.log("Usage: npm run intake:import -- --file form.xlsx [--overwrite] [--move] [--dry-run]\n       npm run intake:import -- --dir incoming [--overwrite] [--move]");
      process.exit(0);
    }
  }
  return args;
}

const yes = (value) => ["예", "yes", "y", "true", "1"].includes(String(value ?? "").trim().toLowerCase());
const stringValue = (value) => value === null || value === undefined ? "" : String(value).trim();
const splitValues = (value) => stringValue(value).split(/[,/\n]/).map((item) => item.trim()).filter(Boolean);
const normalizeDomain = (value) => stringValue(value).toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

function slugifyKoreanName(name) {
  const ascii = stringValue(name).toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, "");
  if (/^[a-z0-9][a-z0-9-]+$/.test(ascii)) return ascii;
  return `agent-${Date.now().toString(36)}`;
}

function collectPairs(values, titlePrefix, bodyPrefix, count) {
  const result = [];
  for (let index = 1; index <= count; index += 1) {
    const title = stringValue(values[`${titlePrefix}_${index}_title`]);
    const body = stringValue(values[`${bodyPrefix}_${index}_body`]);
    if (title && body) result.push({ title, body });
  }
  return result;
}

function collectFaqs(values, count) {
  const result = [];
  for (let index = 1; index <= count; index += 1) {
    const question = stringValue(values[`faq_${index}_question`]);
    const answer = stringValue(values[`faq_${index}_answer`]);
    if (question && answer) result.push({ question, answer });
  }
  return result;
}

async function readWorkbook(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet(fieldSpec.sheetName);
  if (!sheet) throw new Error(`시트 '${fieldSpec.sheetName}'를 찾을 수 없습니다.`);
  const values = {};
  sheet.eachRow((row) => {
    const key = stringValue(row.getCell(fieldSpec.keyColumn).value);
    if (!fieldByKey.has(key)) return;
    let value = row.getCell(fieldSpec.valueColumn).value;
    if (value && typeof value === "object" && "text" in value) value = value.text;
    values[key] = stringValue(value);
  });
  for (const field of fieldSpec.fields) if (!values[field.key] && field.default !== undefined) values[field.key] = field.default;
  return values;
}

function validateInput(values, sourceName) {
  const errors = [];
  for (const field of fieldSpec.fields) {
    if (field.required && !stringValue(values[field.key])) errors.push(`${field.label} 값이 비어 있습니다.`);
    if (field.options && stringValue(values[field.key]) && !field.options.includes(stringValue(values[field.key]))) errors.push(`${field.label} 선택값이 올바르지 않습니다: ${values[field.key]}`);
  }
  if (!allowedTemplates.has(values.template)) errors.push(`템플릿 값이 올바르지 않습니다: ${values.template}`);
  if (values.publish_status === "published") {
    if (!normalizeDomain(values.primary_domain)) errors.push("published 상태에는 대표 도메인이 필요합니다.");
    if (!yes(values.content_truth_confirmed) || !yes(values.photo_use_confirmed) || !yes(values.publication_confirmed)) errors.push("published 상태에는 사실 확인·사용권 확인·게시 동의가 모두 필요합니다.");
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(values.accent_color || "#1E5AA8")) errors.push("포인트 색상은 #RRGGBB 형식이어야 합니다.");
  if (errors.length) throw new Error(`${sourceName}\n- ${errors.join("\n- ")}`);
}

function toSiteConfig(values, assetPaths) {
  const id = stringValue(values.site_id) || slugifyKoreanName(values.agent_name);
  const domains = [normalizeDomain(values.primary_domain), ...splitValues(values.additional_domains).map(normalizeDomain)].filter(Boolean);
  const career = Array.from({ length: 5 }, (_, index) => stringValue(values[`career_${index + 1}`])).filter(Boolean);
  const profileImage = assetPaths.profile || "/assets/profile-placeholder.svg";
  return {
    id,
    status: values.publish_status === "published" ? "published" : "draft",
    domains,
    template: values.template,
    accentColor: values.accent_color || "#1E5AA8",
    headingFont: values.heading_font || "pretendard",
    agent: {
      name: values.agent_name,
      title: values.agent_title,
      company: values.company_name,
      branch: values.branch_name,
      registrationNumber: values.registration_number,
      careerYears: Number(values.career_years) || undefined,
      regions: splitValues(values.service_regions),
      profileImage,
      logoImage: assetPaths.logo || undefined,
    },
    hero: {
      eyebrow: values.eyebrow,
      headline: values.headline,
      subheadline: values.subheadline,
      primaryCtaLabel: values.primary_cta_label,
      secondaryCtaLabel: values.secondary_cta_label,
      trustNote: values.trust_note,
    },
    intro: { title: values.intro_title, body: values.intro_body, philosophy: values.consultation_philosophy },
    specialties: collectPairs(values, "specialty", "specialty", 4),
    process: collectPairs(values, "process", "process", 4),
    career,
    faqs: collectFaqs(values, 4),
    contact: {
      phone: values.phone,
      kakaoUrl: values.kakao_url,
      email: values.email,
      officeAddress: values.office_address,
      mapUrl: values.map_url,
      availableHours: values.available_hours,
    },
    sections: {
      career: yes(values.show_career), process: yes(values.show_process), faq: yes(values.show_faq),
      location: yes(values.show_location), contactForm: yes(values.show_contact_form),
    },
    seo: { title: values.seo_title, description: values.seo_description, ogImage: assetPaths.og || undefined, noIndex: values.publish_status !== "published" },
    compliance: {
      advertisingReviewStatus: values.advertising_review_status,
      advertisingReviewNumber: values.advertising_review_number,
      advertisingReviewExpiresAt: values.advertising_review_expires_at,
      footerDisclaimer: values.footer_disclaimer,
      privacyOfficer: values.privacy_officer,
      privacyRetentionPeriod: values.privacy_retention_period,
      contentTruthConfirmed: yes(values.content_truth_confirmed),
      photoUseConfirmed: yes(values.photo_use_confirmed),
      publicationConfirmed: yes(values.publication_confirmed),
    },
  };
}

async function ensureAsset(sourceDir, fileName, siteId, role, dryRun) {
  const name = stringValue(fileName);
  if (!name) return "";
  const source = path.resolve(sourceDir, name);
  try { if (!(await stat(source)).isFile()) throw new Error(); }
  catch { throw new Error(`첨부 파일을 찾을 수 없습니다: ${name}`); }
  const safeExtension = path.extname(name).toLowerCase();
  if (!new Set([".jpg", ".jpeg", ".png", ".webp", ".svg"]).has(safeExtension)) throw new Error(`지원하지 않는 이미지 형식입니다: ${name}`);
  const targetDir = path.join(root, "public", "sites", siteId);
  const targetName = `${role}${safeExtension === ".jpeg" ? ".jpg" : safeExtension}`;
  if (!dryRun) { await mkdir(targetDir, { recursive: true }); await copyFile(source, path.join(targetDir, targetName)); }
  return `/sites/${siteId}/${targetName}`;
}

async function importOne(filePath, args) {
  const absolute = path.resolve(filePath);
  const values = await readWorkbook(absolute);
  validateInput(values, path.basename(absolute));
  const siteId = stringValue(values.site_id) || slugifyKoreanName(values.agent_name);
  values.site_id = siteId;
  const sourceDir = path.dirname(absolute);
  const assetPaths = {
    profile: await ensureAsset(sourceDir, values.profile_photo_filename, siteId, "profile", args.dryRun),
    logo: await ensureAsset(sourceDir, values.logo_filename, siteId, "logo", args.dryRun),
    og: await ensureAsset(sourceDir, values.og_image_filename, siteId, "og", args.dryRun),
  };
  const site = toSiteConfig(values, assetPaths);
  const targetDir = path.join(root, "sites", siteId);
  const targetFile = path.join(targetDir, "site.json");
  try { await accessExisting(targetFile); if (!args.overwrite) throw new Error(`이미 존재하는 사이트입니다: ${siteId}. 덮어쓰려면 --overwrite를 사용하세요.`); } catch (error) { if (error?.code !== "ENOENT" && !String(error?.message).startsWith("이미 존재")) throw error; if (String(error?.message).startsWith("이미 존재")) throw error; }
  if (!args.dryRun) { await mkdir(targetDir, { recursive: true }); await writeFile(targetFile, `${JSON.stringify(site, null, 2)}\n`, "utf8"); }
  console.log(`${args.dryRun ? "[DRY RUN] " : ""}Imported ${path.basename(absolute)} -> sites/${siteId}/site.json`);
  if (args.move && !args.dryRun) { const processed = path.join(root, "processed"); await mkdir(processed, { recursive: true }); await rename(absolute, path.join(processed, path.basename(absolute))); }
}

async function accessExisting(filePath) { await stat(filePath); }

const args = parseArgs(process.argv.slice(2));
let files = [];
if (args.file) files = [args.file];
else if (args.dir) {
  const dir = path.resolve(args.dir);
  files = (await readdir(dir)).filter((name) => /\.xlsx$/i.test(name) && !name.startsWith("~$")).sort().map((name) => path.join(dir, name));
} else throw new Error("--file 또는 --dir 옵션이 필요합니다. --help로 사용법을 확인하세요.");
if (!files.length) throw new Error("가져올 .xlsx 파일이 없습니다.");
for (const file of files) await importOne(file, args);
if (!args.dryRun) {
  const result = spawnSync(process.execPath, [path.join(root, "scripts", "generate-registry.mjs")], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
