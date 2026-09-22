import { constants as fsConstants } from "node:fs";
import { createHash } from "node:crypto";
import { access, copyFile, link, mkdir, readFile, readdir, realpath, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { domainToASCII, fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import ExcelJS from "exceljs";
import { validateContentLengths, validateDesignConfiguration, validateSectionContent } from "./validate-sites.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseSite = JSON.parse(await readFile(path.join(repositoryRoot, "sites", "demo-agent", "site.json"), "utf8"));
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const labelToField = new Map([
  ["이름", "name"],
  ["휴대폰 번호", "phone"],
  ["휴대폰번호", "phone"],
  ["연락처", "phone"],
  ["전화번호", "phone"],
  ["팩스번호", "fax"],
  ["이메일", "email"],
  ["소속", "company"],
  ["소속/회사명", "company"],
  ["상담시간", "availableHours"],
  ["인스타그램 주소", "instagramUrl"],
  ["인스타그램주소", "instagramUrl"],
  ["오픈카카오톡주소", "kakaoUrl"],
  ["오픈카카오톡 주소", "kakaoUrl"],
  ["카카오톡 주소", "kakaoUrl"],
  ["직함", "title"],
  ["주소", "officeAddress"],
  ["사진 파일명", "photoFileName"],
  ["사진파일명", "photoFileName"],
  ["희망도메인", "requestedDomain"],
  ["희망 도메인", "requestedDomain"],
]);

const ignoredLabels = new Set(["수정 요청사항", "수정할 내용", "가비아 아이디", "가비아 비밀번호"]);
const exampleValues = new Map([
  ["phone", new Set(["010-1234-1234"])],
  ["fax", new Set(["0504-1234-1234"])],
  ["email", new Set(["abc@naver.com"])],
  ["photoFileName", new Set(["홍길동.jpg", "홍길동_프로필.jpg"])],
]);

const text = value => {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    if ("text" in value) return String(value.text ?? "").trim();
    if ("result" in value) return String(value.result ?? "").trim();
  }
  return String(value).trim();
};

const cleanLabel = value => text(value).replace(/\s*\*+\s*$/, "").trim();

function cleanFieldValue(field, value) {
  const result = text(value);
  if (!result || /^ex\s*[):]/i.test(result) || /^예\s*[:)]/.test(result)) return "";
  if (exampleValues.get(field)?.has(result)) return "";
  if (field === "requestedDomain" && /^홍길동\.kr(?:\s|$)/i.test(result)) return "";
  return result;
}

export async function readBasicWorkbook(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.getWorksheet("기본정보") ?? workbook.worksheets[0];
  if (!sheet) throw new Error("'기본정보' 시트를 찾을 수 없습니다.");

  const raw = {};
  const ignored = new Set();
  sheet.eachRow(row => {
    const label = cleanLabel(row.getCell(1).value);
    if (!label) return;
    if (ignoredLabels.has(label)) {
      if (text(row.getCell(2).value)) ignored.add(label);
      return;
    }
    const field = labelToField.get(label);
    if (field) raw[field] = cleanFieldValue(field, row.getCell(2).value);
  });
  return { values: raw, ignored: [...ignored] };
}

const compactName = value => text(value).normalize("NFC").replace(/[\s_-]+/g, "").toLowerCase();

export function siteIdFor(values) {
  const digest = createHash("sha256").update(`${text(values.name).normalize("NFC")}\0${text(values.phone)}`).digest("hex").slice(0, 12);
  return `agent-${digest}`;
}

export function normalizeRequestedDomain(value) {
  const input = text(value);
  if (!input) return [];
  let url;
  try { url = new URL(input.includes("://") ? input : `https://${input}`); }
  catch { throw new Error(`희망도메인 형식이 올바르지 않습니다: ${input}`); }
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash || !["", "/"].includes(url.pathname)) throw new Error(`희망도메인에는 도메인 이름만 입력해 주세요: ${input}`);
  const unicodeHost = url.hostname.toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
  const host = domainToASCII(unicodeHost);
  if (!host || host.length > 253 || !host.includes(".") || host.split(".").some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) throw new Error(`희망도메인 형식이 올바르지 않습니다: ${input}`);
  return [host, `www.${host}`];
}

const isPhone = value => /^[+\d][\d ()-]{5,31}$/.test(value) && /^\+?\d{7,15}$/.test(value.replace(/[ ()-]/g, ""));
const isEmail = value => {
  if (!value) return true;
  if (value.length > 254 || /[\r\n?#]/.test(value)) return false;
  const match = /^([A-Za-z0-9.!#$%&'*+/=^_`{|}~-]+)@([A-Za-z0-9.-]+)$/.exec(value);
  if (!match || match[1].length > 64 || match[1].startsWith(".") || match[1].endsWith(".") || match[1].includes("..")) return false;
  return match[2].split(".").length >= 2 && match[2].split(".").every(label => label.length <= 63 && /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label));
};

const isInstagramUrl = value => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["instagram.com", "www.instagram.com"].includes(url.hostname) && !url.port && !url.username && !url.password && !url.search && !url.hash && /^\/[A-Za-z0-9._]{1,30}\/?$/.test(url.pathname);
  } catch { return false; }
};

const isKakaoUrl = value => !value || /^https:\/\/open\.kakao\.com\/o\/[A-Za-z0-9_-]+\/?$/.test(value);

function validateBasicValues(values, sourceName) {
  const errors = [];
  for (const [field, label] of [["name", "이름"], ["phone", "휴대폰 번호"], ["company", "소속"], ["photoFileName", "사진 파일명"]]) {
    if (!text(values[field])) errors.push(`${label}을(를) 작성해 주세요.`);
  }
  if (values.phone && !isPhone(values.phone)) errors.push("휴대폰 번호 형식이 올바르지 않습니다.");
  if (values.fax && !isPhone(values.fax)) errors.push("팩스번호 형식이 올바르지 않습니다.");
  if (!isEmail(values.email)) errors.push("이메일 형식이 올바르지 않습니다.");
  if (!isInstagramUrl(values.instagramUrl)) errors.push("인스타그램 주소는 https://instagram.com/사용자명 형식이어야 합니다.");
  if (!isKakaoUrl(values.kakaoUrl)) errors.push("오픈카카오톡주소는 https://open.kakao.com/o/초대코드 형식이어야 합니다.");
  const photoName = path.basename(text(values.photoFileName));
  if (values.photoFileName && photoName !== values.photoFileName) errors.push("사진 파일명에는 폴더 경로를 넣지 말고 파일명만 입력해 주세요.");
  if (photoName && path.extname(photoName) && !imageExtensions.has(path.extname(photoName).toLowerCase())) errors.push("사진은 JPG, PNG 또는 WebP 파일만 사용할 수 있습니다.");
  if (values.name && photoName && !compactName(path.parse(photoName).name).includes(compactName(values.name))) errors.push("사진 파일명에는 반드시 본인 이름을 포함해 주세요.");
  if (errors.length) throw new Error(`${sourceName}\n- ${errors.join("\n- ")}`);
}

async function assertRasterImage(filePath) {
  const file = await readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const valid = extension === ".png"
    ? file.length >= 8 && file.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]))
    : [".jpg", ".jpeg"].includes(extension)
      ? file.length >= 3 && file[0] === 0xff && file[1] === 0xd8 && file[2] === 0xff
      : extension === ".webp" && file.length >= 12 && file.subarray(0, 4).toString("ascii") === "RIFF" && file.subarray(8, 12).toString("ascii") === "WEBP";
  if (!valid) throw new Error(`사진 파일의 실제 형식이 확장자와 다릅니다: ${path.basename(filePath)}`);
}

function createSite(values, id, profileImage, domains) {
  const site = structuredClone(baseSite);
  site.id = id;
  site.status = "draft";
  site.domains = domains;
  site.template = "warm-care";
  site.palette = "charcoal";
  site.headingFont = "noto-sans-kr";
  delete site.templateContent;
  delete site.contentBrief;
  delete site.demo;
  site.agent = {
    name: values.name,
    title: values.title || "보험설계사",
    company: values.company,
    branch: "",
    registrationNumber: "",
    regions: [],
    profileImage,
    logoImage: "/assets/haeon-logo-horizontal.svg",
    logoMarkImage: "/assets/haeon-logo-stacked.svg",
  };
  site.career = [];
  site.reviews = [];
  site.sections = {
    career: false,
    process: true,
    reviews: false,
    faq: true,
    location: Boolean(values.officeAddress),
    contactForm: false,
    recruitment: false,
  };
  site.contact = {
    phone: values.phone,
    kakaoUrl: values.kakaoUrl || "",
    instagramUrl: values.instagramUrl || "",
    email: values.email || "",
    fax: values.fax || "",
    formEmail: "",
    officeAddress: values.officeAddress || "",
    mapUrl: "",
    availableHours: values.availableHours || "상담 시간은 연락 후 협의",
  };
  site.seo = {
    title: `${values.name} ${site.agent.title} | ${values.company}`,
    description: `${values.name} ${site.agent.title}의 소개와 상담 분야, 전화·오픈채팅 연락 방법을 확인하세요.`,
    ogImage: profileImage,
    noIndex: true,
  };
  site.compliance = {
    advertisingReviewStatus: "pending",
    advertisingReviewNumber: "",
    advertisingReviewExpiresAt: "",
    footerDisclaimer: "본 페이지는 담당자 소개와 연락 방법을 안내합니다. 구체적인 취급 범위와 상품 내용은 담당자에게 확인하고, 계약 전 상품설명서와 약관을 확인하시기 바랍니다. 기존 계약을 해지하고 새 계약을 체결하면 가입 거절, 보험료 인상, 보장 변경 등의 불이익이 생길 수 있습니다.",
    privacyOfficer: values.name,
    privacyRetentionPeriod: "고객용 신청 입력란을 제공하지 않으며 상담 입력값을 수집하거나 전송하지 않습니다.",
    contentTruthConfirmed: false,
    photoUseConfirmed: false,
    publicationConfirmed: false,
  };
  site.footer = { heading: `${values.name} 보험상담`, note: "보험의 선택은 충분한 이해에서 시작합니다." };
  return site;
}

async function listFiles(directory, extensionPattern) {
  const entries = await readdir(directory, { withFileTypes: true });
  return entries.filter(entry => entry.isFile() && extensionPattern.test(entry.name) && !entry.name.startsWith("~$")).map(entry => path.join(directory, entry.name)).sort((a, b) => a.localeCompare(b, "ko"));
}

async function existingDomainOwners(rootDir) {
  const owners = new Map();
  const entries = await readdir(path.join(rootDir, "sites"), { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const file = path.join(rootDir, "sites", entry.name, "site.json");
    try {
      const site = JSON.parse(await readFile(file, "utf8"));
      for (const domain of site.domains ?? []) owners.set(String(domain).toLowerCase().replace(/^www\./, ""), site.id ?? entry.name);
    } catch { /* The repository validator reports malformed existing sites. */ }
  }
  return owners;
}

const isSameOrWithin = (parent, candidate) => {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
};

async function assertMissing(file, label) {
  try { await access(file); throw new Error(`${label}에 같은 이름의 파일이 이미 있습니다: ${file}`); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
}

function selectPhoto(values, photos, sourceName) {
  const requested = text(values.photoFileName);
  const exact = photos.get(requested.toLowerCase());
  if (exact) return exact;
  const nameKey = compactName(values.name);
  const matches = [...photos.values()].filter(file => compactName(path.parse(file).name).includes(nameKey));
  if (matches.length === 1) return matches[0];
  if (!matches.length) throw new Error(`${sourceName}\n- 사진 폴더에서 본인 이름이 포함된 사진을 찾을 수 없습니다: ${values.name}`);
  throw new Error(`${sourceName}\n- 본인 이름이 포함된 사진이 여러 개입니다. 사진 파일명 칸에 확장자를 포함한 정확한 파일명을 적어 주세요: ${matches.map(file => path.basename(file)).join(", ")}`);
}

export async function planBasicImport({ excelDir, photoDir, completedDir, rootDir = repositoryRoot }) {
  rootDir = await realpath(path.resolve(rootDir));
  excelDir = await realpath(path.resolve(excelDir));
  photoDir = await realpath(path.resolve(photoDir));
  completedDir = completedDir ? path.resolve(completedDir) : "";
  if (!(await stat(excelDir)).isDirectory()) throw new Error("엑셀 경로는 폴더여야 합니다.");
  if (!(await stat(photoDir)).isDirectory()) throw new Error("사진 경로는 폴더여야 합니다.");
  if (completedDir && (isSameOrWithin(excelDir, completedDir) || isSameOrWithin(photoDir, completedDir))) throw new Error("완료 폴더는 진행 전 엑셀/사진 폴더 밖에 지정해 주세요.");

  const excelFiles = await listFiles(excelDir, /\.xlsx$/i);
  if (!excelFiles.length) throw new Error("엑셀 폴더에 .xlsx 파일이 없습니다.");
  const photoFiles = await listFiles(photoDir, /\.(?:jpe?g|png|webp)$/i);
  const photos = new Map();
  for (const file of photoFiles) {
    const key = path.basename(file).toLowerCase();
    if (photos.has(key)) throw new Error(`대소문자만 다른 사진 파일명이 중복됩니다: ${path.basename(file)}`);
    photos.set(key, file);
  }

  const domainOwners = await existingDomainOwners(rootDir);
  const ids = new Set();
  const plans = [];
  for (const excelFile of excelFiles) {
    const { values, ignored } = await readBasicWorkbook(excelFile);
    const sourceName = path.basename(excelFile);
    validateBasicValues(values, sourceName);
    const id = siteIdFor(values);
    if (ids.has(id)) throw new Error(`같은 이름과 휴대폰 번호가 중복되었습니다: ${sourceName}`);
    ids.add(id);
    const targetSite = path.join(rootDir, "sites", id, "site.json");
    try { await access(targetSite); throw new Error(`이미 등록된 사이트입니다: ${id} (${sourceName})`); }
    catch (error) { if (error.code !== "ENOENT") throw error; }

    const photoSource = selectPhoto(values, photos, sourceName);
    if (!compactName(path.parse(photoSource).name).includes(compactName(values.name))) throw new Error(`${sourceName}\n- 실제 사진 파일명에는 반드시 본인 이름을 포함해 주세요: ${path.basename(photoSource)}`);
    await assertRasterImage(photoSource);
    const extension = path.extname(photoSource).toLowerCase() === ".jpeg" ? ".jpg" : path.extname(photoSource).toLowerCase();
    const profileImage = `/sites/${id}/profile${extension}`;
    const domains = normalizeRequestedDomain(values.requestedDomain);
    for (const domain of domains) {
      const canonical = domain.replace(/^www\./, "");
      const owner = domainOwners.get(canonical);
      if (owner && owner !== id) throw new Error(`${sourceName}\n- 희망도메인이 기존 사이트 ${owner}와 중복됩니다: ${canonical}`);
      domainOwners.set(canonical, id);
    }
    const site = createSite(values, id, profileImage, domains);
    const issues = [...validateDesignConfiguration(site), ...validateContentLengths(site), ...validateSectionContent(site)];
    if (issues.length) throw new Error(`${sourceName}\n- ${issues.join("\n- ")}`);
    const completedExcel = completedDir ? path.join(completedDir, "2. 양식", sourceName) : "";
    const completedPhoto = completedDir ? path.join(completedDir, "1. 이미지", path.basename(photoSource)) : "";
    if (completedExcel) await assertMissing(completedExcel, "완료 양식 폴더");
    if (completedPhoto) await assertMissing(completedPhoto, "완료 이미지 폴더");
    plans.push({ id, sourceName, excelFile, photoSource, targetSite, targetPhoto: path.join(rootDir, "public", profileImage.slice(1)), completedExcel, completedPhoto, site, ignored });
  }
  return plans;
}

async function writePlan(plan) {
  await mkdir(path.dirname(plan.targetSite), { recursive: true });
  await mkdir(path.dirname(plan.targetPhoto), { recursive: true });
  const token = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const tempPhoto = `${plan.targetPhoto}.${token}.tmp`;
  const tempSite = `${plan.targetSite}.${token}.tmp`;
  let createdPhoto = false;
  try {
    await copyFile(plan.photoSource, tempPhoto, fsConstants.COPYFILE_EXCL);
    await link(tempPhoto, plan.targetPhoto);
    createdPhoto = true;
    await unlink(tempPhoto);
    await writeFile(tempSite, `${JSON.stringify(plan.site, null, 2)}\n`, { flag: "wx" });
    await link(tempSite, plan.targetSite);
    await unlink(tempSite);
  } catch (error) {
    await unlink(tempPhoto).catch(() => {});
    await unlink(tempSite).catch(() => {});
    if (createdPhoto) await unlink(plan.targetPhoto).catch(() => {});
    throw error;
  }
}

function runNodeScript(rootDir, script) {
  const result = spawnSync(process.execPath, [path.join(rootDir, "scripts", script)], { cwd: rootDir, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`${script} 실행에 실패했습니다.`);
}

export async function moveCompletedSources(plans, completedDir) {
  if (!completedDir) return [];
  const moves = [];
  const seen = new Set();
  for (const plan of plans) {
    for (const [source, destination] of [[plan.excelFile, plan.completedExcel], [plan.photoSource, plan.completedPhoto]]) {
      const key = path.resolve(source).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      moves.push({ source, destination });
    }
  }
  for (const move of moves) await assertMissing(move.destination, "완료 폴더");
  await Promise.all([
    mkdir(path.join(completedDir, "1. 이미지"), { recursive: true }),
    mkdir(path.join(completedDir, "2. 양식"), { recursive: true }),
  ]);
  const completed = [];
  try {
    for (const move of moves) {
      await rename(move.source, move.destination);
      completed.push(move);
    }
  } catch (error) {
    for (const move of completed.reverse()) await rename(move.destination, move.source).catch(() => {});
    if (error?.code === "EXDEV") throw new Error("진행 전 폴더와 완료 폴더는 같은 드라이브에 두어야 합니다.");
    throw error;
  }
  return moves;
}

export async function importBasicBatch(options) {
  const rootDir = options.rootDir ? await realpath(path.resolve(options.rootDir)) : repositoryRoot;
  const completedDir = options.completedDir ? path.resolve(options.completedDir) : "";
  const plans = await planBasicImport({ ...options, rootDir, completedDir });
  if (!options.dryRun) {
    for (const plan of plans) await writePlan(plan);
    runNodeScript(rootDir, "generate-registry.mjs");
    runNodeScript(rootDir, "validate-sites.mjs");
    await moveCompletedSources(plans, completedDir);
  }
  return plans;
}

function parseArgs(argv) {
  const args = { excelDir: "", photoDir: "", completedDir: "", dryRun: false };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (["--excel-dir", "--xlsx-dir"].includes(value)) args.excelDir = argv[++index] ?? "";
    else if (["--photo-dir", "--image-dir"].includes(value)) args.photoDir = argv[++index] ?? "";
    else if (["--completed-dir", "--done-dir"].includes(value)) args.completedDir = argv[++index] ?? "";
    else if (["--dry-run", "dry-run"].includes(value)) args.dryRun = true;
    else if (["--help", "-h"].includes(value)) args.help = true;
    else if (!value.startsWith("-") && !args.excelDir) args.excelDir = value;
    else if (!value.startsWith("-") && !args.photoDir) args.photoDir = value;
    else if (!value.startsWith("-") && !args.completedDir) args.completedDir = value;
    else throw new Error(`알 수 없는 옵션입니다: ${value}`);
  }
  return args;
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    console.log("npm run basic:import -- <엑셀 폴더> <사진 폴더> <완료 폴더> [dry-run]\nnode scripts/import-basic-intake.mjs --excel-dir <엑셀 폴더> --photo-dir <사진 폴더> --completed-dir <완료 폴더> [--dry-run]\n\n수정 요청사항과 가비아 계정 정보는 읽지 않습니다. 생성 사이트는 draft/noindex로 등록되며 성공한 원본은 완료 폴더의 1. 이미지/2. 양식으로 이동합니다.");
    return;
  }
  if (!args.excelDir || !args.photoDir || !args.completedDir) throw new Error("엑셀 폴더, 사진 폴더, 완료 폴더를 모두 지정하세요.");
  const plans = await importBasicBatch(args);
  for (const plan of plans) {
    console.log(`${args.dryRun ? "[DRY RUN] " : ""}${plan.sourceName} -> ${plan.id} (${path.basename(plan.photoSource)})`);
    console.log(`  완료 양식: ${plan.completedExcel}`);
    console.log(`  완료 사진: ${plan.completedPhoto}`);
  }
  console.log(`${args.dryRun ? "검사" : "등록"} 완료: ${plans.length}개 사이트 · draft / noindex`);
  if (plans.some(plan => plan.ignored.length)) console.log("수정 요청사항과 가비아 계정 정보는 자동 등록에서 제외했습니다.");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await main(process.argv.slice(2)); }
  catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}
