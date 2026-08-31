import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sitesDir = path.join(root, "sites");
const templates = new Set(["trust-blue", "warm-care", "premium-navy", "clean-minimal", "local-friendly"]);
const fonts = new Set(["pretendard", "noto-serif-kr"]);
const statuses = new Set(["draft", "published"]);
const domainOwners = new Map();
const seoTitles = new Map();
const errors = [];
const warnings = [];
const normalizeDomain = (value) => String(value ?? "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
const isUrl = (value) => {
  if (!value) return true;
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol); } catch { return false; }
};

function required(value, label, siteId) {
  if (value === undefined || value === null || String(value).trim() === "") errors.push(`[${siteId}] 필수값 누락: ${label}`);
}

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
  if (id !== entry.name) errors.push(`[${id}] 폴더명과 site.id가 다릅니다: ${entry.name}`);
  if (!/^[a-z0-9][a-z0-9-]{1,62}$/.test(id)) errors.push(`[${id}] site.id는 영문 소문자·숫자·하이픈만 사용할 수 있습니다.`);
  if (!statuses.has(site.status)) errors.push(`[${id}] status는 draft 또는 published여야 합니다.`);
  if (!templates.has(site.template)) errors.push(`[${id}] 알 수 없는 template: ${site.template}`);
  if (!fonts.has(site.headingFont)) errors.push(`[${id}] 알 수 없는 headingFont: ${site.headingFont}`);
  if (site.accentColor && !/^#[0-9a-fA-F]{6}$/.test(site.accentColor)) errors.push(`[${id}] accentColor는 #RRGGBB 형식이어야 합니다.`);

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
  if (site.sections?.faq && (site.faqs ?? []).length < 2) errors.push(`[${id}] FAQ 표시 시 최소 2개가 필요합니다.`);
  if (!isUrl(site.contact?.kakaoUrl)) errors.push(`[${id}] kakaoUrl 형식이 올바르지 않습니다.`);
  if (!isUrl(site.contact?.mapUrl)) errors.push(`[${id}] mapUrl 형식이 올바르지 않습니다.`);

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
