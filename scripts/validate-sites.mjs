import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitesDir = path.join(root, "sites");
const templates = new Set(["trust-blue", "warm-care", "premium-navy", "clean-minimal", "local-friendly"]);
const palettes = new Set(["navy", "forest", "slate", "charcoal", "teal", "stone"]);
const fonts = new Set(["pretendard", "noto-serif-kr"]);
const statuses = new Set(["draft", "published"]);
const submissionModes = new Set(["discard", "store", "mailto"]);
const domainOwners = new Map();
const seoTitles = new Map();
const errors = [];
const warnings = [];
const normalizeDomain = (value) => String(value ?? "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
const isUrl = (value) => {
  if (!value) return true;
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol); } catch { return false; }
};
const isEmail = (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));

function required(value, label, siteId) {
  if (value === undefined || value === null || String(value).trim() === "") errors.push(`[${siteId}] 필수값 누락: ${label}`);
}

// Lengths count Unicode code points, including spaces and line breaks.
// Optional mobile copy falls back to the PC original in the renderer.
export function validateContentLengths(site) {
  const issues = [];
  const check = (value, label, maxLength) => {
    if (value === undefined) return;
    if (typeof value !== "string" || !value.trim()) {
      issues.push(`${label}는 비어 있지 않은 문자열이어야 합니다.`);
      return;
    }
    const length = Array.from(value).length;
    if (length > maxLength) issues.push(`${label}: 공백 포함 ${maxLength}자 이내여야 합니다. 현재 ${length}자입니다.`);
  };
  const checkObject = (object, prefix, limits) => {
    for (const [key, limit] of Object.entries(limits)) check(object?.[key], `${prefix}.${key}`, limit);
  };
  const headlineLimits = { headline: 40, subheadline: 120, mobileHeadline: 24, mobileSubheadline: 60 };
  const cards = (items, prefix) => {
    if (Array.isArray(items)) items.forEach((item, index) => checkObject(item, `${prefix}[${index}]`, { body: 120, mobileBody: 48 }));
  };
  const faqs = (items, prefix) => {
    if (Array.isArray(items)) items.forEach((item, index) => checkObject(item, `${prefix}[${index}]`, { answer: 240, mobileAnswer: 80 }));
  };
  checkObject(site.hero, "hero", headlineLimits);
  checkObject(site.intro, "intro", { title: 40, body: 400, mobileTitle: 24, mobileBody: 100 });
  checkObject(site.contentBrief, "contentBrief", { purpose: 100, targetAudience: 80, primaryAction: 60 });
  cards(site.specialties, "specialties");
  cards(site.process, "process");
  faqs(site.faqs, "faqs");
  for (const [template, content] of Object.entries(site.templateContent ?? {})) {
    checkObject(content, `templateContent.${template}`, headlineLimits);
    for (const key of ["specialties", "process", "focus"]) cards(content?.[key], `templateContent.${template}.${key}`);
    faqs(content?.faqs, `templateContent.${template}.faqs`);
  }
  return issues;
}

async function main() {
const entries = await readdir(sitesDir, { withFileTypes: true });
let count = 0;
for (const entry of entries) {
  if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
  count += 1;
  const file = path.join(sitesDir, entry.name, "site.json");
  let site;
  try { site = JSON.parse(await readFile(file, "utf8")); }
  catch (error) { errors.push(`[${entry.name}] JSON 오류: ${error instanceof Error ? error.message : error}`); continue; }

  const id = String(site.id ?? entry.name);
  errors.push(...validateContentLengths(site).map(message => `[${id}] ${message}`));
  if (id !== entry.name) errors.push(`[${id}] 폴더명과 site.id가 다릅니다: ${entry.name}`);
  if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(id)) errors.push(`[${id}] site.id는 영문 소문자·숫자·하이픈만 사용할 수 있습니다.`);
  if (!statuses.has(site.status)) errors.push(`[${id}] status는 draft 또는 published여야 합니다.`);
  if (!templates.has(site.template)) errors.push(`[${id}] 알 수 없는 template: ${site.template}`);
  if (!fonts.has(site.headingFont)) errors.push(`[${id}] 알 수 없는 headingFont: ${site.headingFont}`);
  if (site.accentColor && !/^#[0-9a-fA-F]{6}$/.test(site.accentColor)) errors.push(`[${id}] accentColor는 #RRGGBB 형식이어야 합니다.`);

  if (site.palette !== undefined && !palettes.has(site.palette)) errors.push(`[${id}] 알 수 없는 palette: ${site.palette}`);
  if (site.templateContent !== undefined) {
    if (!site.templateContent || typeof site.templateContent !== "object" || Array.isArray(site.templateContent)) errors.push(`[${id}] templateContent는 배치별 설정 객체여야 합니다.`);
    else for (const [template, content] of Object.entries(site.templateContent)) {
      if (!templates.has(template)) errors.push(`[${id}] 알 수 없는 templateContent 키: ${template}`);
      if (!content || typeof content !== "object" || Array.isArray(content)) { errors.push(`[${id}] ${template} 설정은 객체여야 합니다.`); continue; }
      const textFields = ["headline", "subheadline", "mobileHeadline", "mobileSubheadline", "eyebrow", "focusTitle"];
      const arrayFields = ["specialties", "process", "faqs", "focus"];
      for (const key of Object.keys(content)) if (![...textFields, ...arrayFields].includes(key)) errors.push(`[${id}] 알 수 없는 ${template} 필드: ${key}`);
      for (const key of textFields) if (content[key] !== undefined && (typeof content[key] !== "string" || !content[key].trim())) errors.push(`[${id}] ${template}.${key}는 비어 있지 않은 문자열이어야 합니다.`);
      for (const key of arrayFields) if (content[key] !== undefined) {
        const min = key === "focus" ? 1 : key === "faqs" ? 2 : 3;
        const fields = key === "faqs" ? ["question", "answer"] : ["title", "body"];
        const items = content[key];
        if (!Array.isArray(items) || items.length < min || items.length > 12 || items.some(item => !item || fields.some(field => typeof item[field] !== "string" || !item[field].trim()))) errors.push(`[${id}] ${template}.${key}는 유효한 ${min}~12개 항목이어야 합니다.`);
      }
    }
  }

  required(site.agent?.name, "agent.name", id);
  required(site.agent?.title, "agent.title", id);
  required(site.agent?.company, "agent.company", id);
  required(site.agent?.profileImage, "agent.profileImage", id);
  required(site.hero?.headline, "hero.headline", id);
  required(site.hero?.subheadline, "hero.subheadline", id);
  required(site.intro?.title, "intro.title", id);
  required(site.intro?.body, "intro.body", id);
  required(site.contact?.phone, "contact.phone", id);
  required(site.contact?.availableHours, "contact.availableHours", id);
  required(site.seo?.title, "seo.title", id);
  required(site.seo?.description, "seo.description", id);
  required(site.compliance?.footerDisclaimer, "compliance.footerDisclaimer", id);
  required(site.compliance?.privacyOfficer, "compliance.privacyOfficer", id);
  required(site.compliance?.privacyRetentionPeriod, "compliance.privacyRetentionPeriod", id);

  if ((site.specialties ?? []).length < 3) errors.push(`[${id}] specialties는 최소 3개가 필요합니다.`);
  if (site.sections?.process && (site.process ?? []).length < 3) errors.push(`[${id}] process 표시 시 최소 3개 단계가 필요합니다.`);
  if (site.sections?.reviews && (site.reviews ?? []).length < 1) errors.push(`[${id}] 고객 후기 표시 시 reviews가 최소 1개 필요합니다.`);
  if (site.sections?.faq && (site.faqs ?? []).length < 2) errors.push(`[${id}] FAQ 표시 시 최소 2개가 필요합니다.`);
  if (!isUrl(site.contact?.kakaoUrl)) errors.push(`[${id}] kakaoUrl 형식이 올바르지 않습니다.`);
  if (!isUrl(site.contact?.instagramUrl)) errors.push(`[${id}] instagramUrl 형식이 올바르지 않습니다.`);
  if (!isUrl(site.contact?.mapUrl)) errors.push(`[${id}] mapUrl 형식이 올바르지 않습니다.`);
  if (!isEmail(site.contact?.email)) errors.push(`[${id}] email 형식이 올바르지 않습니다.`);
  if (!isEmail(site.contact?.formEmail)) errors.push(`[${id}] formEmail 형식이 올바르지 않습니다.`);
  if (site.demo?.submissionMode && !submissionModes.has(site.demo.submissionMode)) errors.push(`[${id}] demo.submissionMode 값이 올바르지 않습니다.`);
  if (site.demo?.submissionMode === "mailto" && !site.contact?.formEmail && !site.contact?.email) errors.push(`[${id}] mailto 제출 방식에는 contact.formEmail 또는 contact.email이 필요합니다.`);

  if (site.consultation?.topics !== undefined) {
    const topics = site.consultation.topics;
    if (!Array.isArray(topics) || topics.length < 1 || topics.length > 12 || topics.some(value => typeof value !== "string" || !value.trim() || value.length > 60) || new Set(topics).size !== topics.length) errors.push(`[${id}] consultation.topics는 중복 없는 1~12개의 짧은 문자열이어야 합니다.`);
  }

  for (const [index, review] of (site.reviews ?? []).entries()) {
    required(review?.quote, `reviews[${index}].quote`, id);
    required(review?.author, `reviews[${index}].author`, id);
    if (review?.isExample !== true && site.demo?.enabled) warnings.push(`[${id}] 데모 후기는 isExample: true 표기를 권장합니다.`);
  }

  for (const domainValue of site.domains ?? []) {
    const domain = normalizeDomain(domainValue);
    if (!domain || !domain.includes(".") || /\s/.test(domain)) errors.push(`[${id}] 도메인 형식이 올바르지 않습니다: ${domainValue}`);
    else if (domainOwners.has(domain)) errors.push(`[${id}] 도메인이 ${domainOwners.get(domain)}와 중복됩니다: ${domain}`);
    else domainOwners.set(domain, id);
  }

  if (site.status === "published" && !site.demo?.enabled) {
    if (!(site.domains ?? []).length) errors.push(`[${id}] published 사이트에는 domains가 필요합니다.`);
    if (!site.compliance?.contentTruthConfirmed) errors.push(`[${id}] 게시 전 기재 내용 사실 확인이 필요합니다.`);
    if (!site.compliance?.photoUseConfirmed) errors.push(`[${id}] 게시 전 사진/로고 사용권 확인이 필요합니다.`);
    if (!site.compliance?.publicationConfirmed) errors.push(`[${id}] 게시 동의가 필요합니다.`);
    if (site.compliance?.advertisingReviewStatus === "pending") warnings.push(`[${id}] 광고심의 상태가 pending입니다. 실제 공개 전 소속 회사 기준을 확인하세요.`);
  }

  if (site.seo?.title) {
    if (seoTitles.has(site.seo.title)) warnings.push(`[${id}] SEO 제목이 ${seoTitles.get(site.seo.title)}와 동일합니다.`);
    else seoTitles.set(site.seo.title, id);
  }

  for (const asset of [site.agent?.profileImage, site.agent?.logoImage, site.seo?.ogImage].filter(Boolean)) {
    if (!String(asset).startsWith("/")) { warnings.push(`[${id}] 내부 이미지 경로는 /로 시작하는 것을 권장합니다: ${asset}`); continue; }
    try { await access(path.join(root, "public", String(asset).replace(/^\//, ""))); }
    catch { errors.push(`[${id}] 이미지 파일을 찾을 수 없습니다: ${asset}`); }
  }
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`ERROR ${error}`);
console.log(`Validated ${count} site(s): ${errors.length} error(s), ${warnings.length} warning(s)`);
if (errors.length) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
