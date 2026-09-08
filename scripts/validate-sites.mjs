import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitesDir = path.join(root, "sites");
const templates = new Set(["trust-blue", "warm-care", "premium-navy", "clean-minimal", "local-friendly"]);
const palettes = new Set(["navy", "forest", "slate", "charcoal", "teal", "stone"]);
const fonts = new Set(["pretendard", "noto-serif-kr", "noto-sans-kr", "nanum-gothic", "nanum-myeongjo", "gowun-batang"]);
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

// Mirrors the browser helper without depending on an already-compiled build.
export function isSectionEnabled(site, id) {
  if (Array.isArray(site.design?.hiddenSections) && site.design.hiddenSections.includes(id)) return false;
  if (id === "reviews") return site.sections?.reviews === true;
  if (id === "process" || id === "faq") return site.sections?.[id] !== false;
  return true;
}

export function validateSectionContent(site) {
  const issues = [];
  const checkText = (value, label, active, required = true) => {
    if (value === undefined && (!active || !required)) return;
    if (typeof value !== "string" || (active && !value.trim())) issues.push(`${label}: ${active ? "비어 있지 않은" : "올바른"} 문자열이어야 합니다.`);
  };
  if (!site.intro || typeof site.intro !== "object" || Array.isArray(site.intro)) issues.push("intro는 소개 설정 객체여야 합니다.");
  else for (const key of ["title", "body", "mobileTitle", "mobileBody", "philosophy"]) checkText(site.intro[key], `intro.${key}`, isSectionEnabled(site, "about") && key !== "philosophy", ["title", "body"].includes(key));
  for (const [field, section, min, fields, optionalFields] of [
    ["specialties", "services", 3, ["title", "body"], ["mobileBody"]],
    ["process", "process", 3, ["title", "body"], ["mobileBody"]],
    ["faqs", "faq", 2, ["question", "answer"], ["mobileAnswer"]],
    ["reviews", "reviews", 1, ["quote", "author"], ["context"]],
  ]) {
    const active = isSectionEnabled(site, section);
    const items = site[field];
    if (field === "reviews" && items === undefined && !active) continue;
    if (!Array.isArray(items)) { issues.push(`${field}는 목록이어야 합니다.`); continue; }
    if ((active && items.length < min) || items.length > 12) issues.push(`${field}: ${active ? min : 0}~12개 항목이 필요합니다.`);
    items.forEach((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) { issues.push(`${field}[${index}]: 설정 객체가 필요합니다.`); return; }
      for (const key of fields) checkText(item[key], `${field}[${index}].${key}`, active);
      for (const key of optionalFields) checkText(item[key], `${field}[${index}].${key}`, active && key !== "context", false);
      for (const key of Object.keys(item)) if (![...fields, ...optionalFields, ...(field === "reviews" ? ["isExample"] : [])].includes(key)) issues.push(`${field}[${index}].${key}: 지원하지 않는 항목입니다.`);
      if (field === "reviews" && item.isExample !== undefined && typeof item.isExample !== "boolean") issues.push(`${field}[${index}].isExample: 참/거짓 값이 필요합니다.`);
    });
  }
  return issues;
}

export function validateDesignConfiguration(site) {
  const issues = [];
  const options = {
    hero: ["portrait", "editorial", "statement"], services: ["cards", "list", "split"], about: ["editorial", "profile", "quote"],
    process: ["steps", "timeline"], faq: ["accordion", "columns"], footer: ["classic", "columns", "minimal"],
    ornament: ["line", "grid", "none"], density: ["airy", "compact"],
  };
  const sectionIds = ["services", "about", "process", "reviews", "faq", "contact"];
  if (site.design !== undefined) {
    if (!site.design || typeof site.design !== "object" || Array.isArray(site.design)) issues.push("design은 패턴 설정 객체여야 합니다.");
    else for (const [key, value] of Object.entries(site.design)) {
      if (["sectionOrder", "hiddenSections"].includes(key)) {
        if (!Array.isArray(value) || value.length > 6 || value.some(item => !sectionIds.includes(item)) || new Set(value).size !== value.length) issues.push(`design.${key}: 중복 없는 유효한 섹션 목록이 필요합니다.`);
      } else if (!Object.hasOwn(options, key) || !options[key].includes(value)) issues.push(`design.${key}: 지원하지 않는 패턴입니다.`);
    }
  }
  if (site.footer !== undefined) {
    if (!site.footer || typeof site.footer !== "object" || Array.isArray(site.footer)) issues.push("footer는 하단입력 설정 객체여야 합니다.");
    else for (const [key, value] of Object.entries(site.footer)) {
      const limit = key === "heading" ? 80 : key === "note" ? 400 : 0;
      if (!limit || typeof value !== "string" || Array.from(value).length > limit) issues.push(`footer.${key}: ${limit || "지원되는"}자 이내의 문구를 입력하세요.`);
    }
  }
  if (site.agent?.businessNumber !== undefined && (typeof site.agent.businessNumber !== "string" || Array.from(site.agent.businessNumber).length > 80)) issues.push("agent.businessNumber는 80자 이내여야 합니다.");
  if (site.hero?.image !== undefined && typeof site.hero.image !== "string") issues.push("hero.image는 이미지 경로 문자열이어야 합니다.");
  return issues;
}

function required(value, label, siteId) {
  if (value === undefined || value === null || String(value).trim() === "") errors.push(`[${siteId}] 필수값 누락: ${label}`);
}

// Lengths count Unicode code points, including spaces and line breaks.
// Optional mobile copy falls back to the PC original in the renderer.
export function validateContentLengths(site) {
  const issues = [];
  const check = (value, label, maxLength) => {
    if (value === undefined) return;
    const section = label.startsWith("intro.") ? "about" : label.startsWith("specialties[") ? "services" : label.startsWith("process[") ? "process" : label.startsWith("faqs[") ? "faq" : undefined;
    const allowEmpty = section && !isSectionEnabled(site, section);
    if (typeof value !== "string" || (!allowEmpty && !value.trim())) {
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
    if (Array.isArray(items)) items.forEach((item, index) => checkObject(item, `${prefix}[${index}]`, { title: 60, body: 120, mobileBody: 48 }));
  };
  const faqs = (items, prefix) => {
    if (Array.isArray(items)) items.forEach((item, index) => checkObject(item, `${prefix}[${index}]`, { question: 100, answer: 240, mobileAnswer: 80 }));
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
  errors.push(...validateDesignConfiguration(site).map(message => `[${id}] ${message}`));
  errors.push(...validateContentLengths(site).map(message => `[${id}] ${message}`));
  errors.push(...validateSectionContent(site).map(message => `[${id}] ${message}`));
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
  required(site.contact?.phone, "contact.phone", id);
  required(site.contact?.availableHours, "contact.availableHours", id);
  required(site.seo?.title, "seo.title", id);
  required(site.seo?.description, "seo.description", id);
  required(site.compliance?.footerDisclaimer, "compliance.footerDisclaimer", id);
  required(site.compliance?.privacyOfficer, "compliance.privacyOfficer", id);
  required(site.compliance?.privacyRetentionPeriod, "compliance.privacyRetentionPeriod", id);

  if (!isUrl(site.contact?.kakaoUrl)) errors.push(`[${id}] kakaoUrl 형식이 올바르지 않습니다.`);
  if (!isUrl(site.contact?.instagramUrl)) errors.push(`[${id}] instagramUrl 형식이 올바르지 않습니다.`);
  if (!isUrl(site.contact?.mapUrl)) errors.push(`[${id}] mapUrl 형식이 올바르지 않습니다.`);
  if (!isEmail(site.contact?.email)) errors.push(`[${id}] email 형식이 올바르지 않습니다.`);
  if (!isEmail(site.contact?.formEmail)) errors.push(`[${id}] formEmail 형식이 올바르지 않습니다.`);
  if (site.demo?.submissionMode && !submissionModes.has(site.demo.submissionMode)) errors.push(`[${id}] demo.submissionMode 값이 올바르지 않습니다.`);
  if (site.demo?.submissionMode === "mailto" && !site.contact?.formEmail && !site.contact?.email) errors.push(`[${id}] mailto 제출 방식에는 contact.formEmail 또는 contact.email이 필요합니다.`);

  if (site.consultation?.topics !== undefined) {
    const topics = site.consultation.topics;
    const active = isSectionEnabled(site, "contact");
    if (!Array.isArray(topics) || topics.length < (active ? 1 : 0) || topics.length > 12 || topics.some(value => typeof value !== "string" || (active && !value.trim()) || Array.from(value).length > 60) || new Set(topics).size !== topics.length) errors.push(`[${id}] consultation.topics는 중복 없는 ${active ? 1 : 0}~12개의 짧은 문자열이어야 합니다.`);
  }

  for (const [index, review] of (site.reviews ?? []).entries()) {
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

  for (const asset of [site.agent?.profileImage, site.agent?.logoImage, site.hero?.image, site.seo?.ogImage].filter(Boolean)) {
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
