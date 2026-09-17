import { directPhoneHref, openChatUrl } from '../utils/contact-links.js';
import { DESIGN_SECTION_IDS, HEADING_FONT_IDS, PALETTE_IDS, TEMPLATE_IDS, type DesignSectionId, type SiteConfig } from "../types.js";
import { COPY_LIBRARY } from '../content/copy-library.js';
import { DESIGN_VERSION } from '../render/design-system.js';

export const PROJECT_FORMAT = "insurance-web-factory/diy" as const;
export const PROJECT_VERSION = 2 as const;
export const LEGACY_PROJECT_VERSION = 1 as const;
export const COPY_LIBRARY_VERSION = "clear-human-copy-v1" as const;
export const EXPORT_PROFILE = "a4-review-v1" as const;
export const MAX_PROJECT_BYTES = 8 * 1024 * 1024;
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const COPY_GROUP_IDS = ['heroes', 'intros', 'services', 'processes', 'faqs', 'footers'] as const;
export type CopyGroupId = (typeof COPY_GROUP_IDS)[number];
export interface SelectedCopy {
  heroes: string | null; intros: string | null; services: string[];
  processes: string | null; faqs: string[]; footers: string | null;
}
export interface StudioProjectV1 { format: typeof PROJECT_FORMAT; version: typeof LEGACY_PROJECT_VERSION; savedAt: string; site: SiteConfig; }
export interface StudioProject {
  format: typeof PROJECT_FORMAT;
  version: typeof PROJECT_VERSION;
  savedAt: string;
  site: SiteConfig;
  editor: {
    copyLibraryVersion: typeof COPY_LIBRARY_VERSION;
    purposeId: string | null;
    selectedCopy: SelectedCopy;
    customGroups: CopyGroupId[];
    source: 'new' | 'demo' | 'imported';
  };
  handoff: {
    draftId: string;
    designVersion: string;
    exportProfile: typeof EXPORT_PROFILE;
    requestedDomain: string | null;
  };
}
export interface CreateProjectOptions {
  savedAt?: string;
  draftId?: string;
  purposeId?: string | null;
  requestedDomain?: string | null;
  source?: StudioProject['editor']['source'];
}

export const DESIGN_OPTIONS = {
  hero: ["portrait", "editorial", "statement"], services: ["cards", "list", "split"],
  about: ["editorial", "profile", "quote"], process: ["steps", "timeline"],
  faq: ["accordion", "columns"], footer: ["classic", "columns", "minimal"],
  ornament: ["line", "grid", "none"], density: ["airy", "compact"],
} as const;

type Rule = {
  type: "string" | "number" | "boolean" | "array" | "object";
  optional?: boolean; nullable?: boolean; max?: number; min?: number; values?: readonly string[];
  properties?: Record<string, Rule>; items?: Rule; unique?: boolean;
  check?: (value: string) => string | undefined;
};
const text = (max = 160, optional = false, min = optional ? 0 : 1): Rule => ({ type: "string", max, min, optional });
const choice = (values: readonly string[], optional = false): Rule => ({ type: "string", values, optional, max: 100 });
const bool = (optional = false): Rule => ({ type: "boolean", optional });
const list = (items: Rule, min = 0, max = 12, optional = false, unique = false): Rule => ({ type: "array", items, min, max, optional, unique });
const object = (properties: Record<string, Rule>, optional = false): Rule => ({ type: "object", properties, optional });
const domainRule = { ...text(253), check: (value: string) => /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(value) ? undefined : "프로토콜과 경로를 제외한 도메인을 입력하세요." };
const urlRule = (optional = true): Rule => ({ ...text(2048, optional), check: value => {
  if (!value && optional) return;
  try { const url = new URL(value); if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password && !/[\u0000-\u0020<>]/.test(value)) return; } catch { /* invalid URL */ }
  return "http 또는 https 주소를 입력하세요.";
} });
const emailRule = { ...text(254, true), check: (value: string) => !value || /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) ? undefined : "이메일 주소를 확인하세요." };

/** Only raster uploads are accepted. The shipped SVG files are trusted static assets. */
export function validateImageSource(value: string): string | undefined {
  if (!value) return;
  const data = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);
  if (data) {
    const encoded = data[2];
    const bytes = encoded.length * 3 / 4 - (encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0);
    if (encoded.length % 4 || bytes > MAX_IMAGE_BYTES) return "이미지는 파일당 3MB 이하여야 합니다.";
    let header = "";
    try { header = atob(encoded.slice(0, Math.min(encoded.length, 32))); } catch { return "이미지 파일 형식이 올바르지 않습니다."; }
    const valid = data[1] === "png" ? header.startsWith("\x89PNG\r\n\x1a\n")
      : data[1] === "jpeg" ? header.startsWith("\xff\xd8\xff")
      : header.startsWith("RIFF") && header.slice(8, 12) === "WEBP";
    return valid ? undefined : "파일 내용과 이미지 형식이 일치하지 않습니다.";
  }
  if (["/assets/profile-placeholder.svg", "/assets/og-demo.svg", "/assets/logo-mark.svg", "/assets/favicon.svg"].includes(value)) return;
  if (/^\/(?:sites|assets)\/[a-zA-Z0-9_./-]+\.(?:png|jpe?g|webp)$/.test(value) && !value.split("/").some(part => part === "." || part === "..") && !value.includes("//")) return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" && !url.username && !url.password && /\.(png|jpe?g|webp)$/i.test(url.pathname) && !/[\u0000-\u0020<>]/.test(value)) return;
  } catch { /* invalid path */ }
  return "JPG·PNG·WebP 이미지 또는 안전한 이미지 경로를 사용하세요. SVG·HTML 파일은 가져올 수 없습니다.";
}
const imageRule = (optional = false): Rule => ({ ...text(Math.ceil(MAX_IMAGE_BYTES * 4 / 3) + 64, optional), check: validateImageSource });
const cardRule = object({ title: text(60), body: text(120), mobileBody: text(48, true, 1) });
const faqRule = object({ question: text(100), answer: text(240), mobileAnswer: text(80, true, 1) });
const templateRule = object({
  headline: text(40, true, 1), subheadline: text(120, true, 1), mobileHeadline: text(24, true, 1), mobileSubheadline: text(60, true, 1),
  eyebrow: text(80, true, 1), specialties: list(cardRule, 3, 12, true), process: list(cardRule, 3, 12, true), faqs: list(faqRule, 2, 12, true),
  focusTitle: text(80, true, 1), focus: list(cardRule, 1, 12, true),
}, true);
const designRule = object({
  ...Object.fromEntries(Object.entries(DESIGN_OPTIONS).map(([key, values]) => [key, choice(values, true)])),
  sectionOrder: list(choice(DESIGN_SECTION_IDS), 0, 6, true, true), hiddenSections: list(choice(DESIGN_SECTION_IDS), 0, 6, true, true),
}, true);
const siteRule = object({
  id: { ...text(63), check: value => /^[a-z0-9][a-z0-9-]{1,62}$/.test(value) ? undefined : "사이트 ID는 영문 소문자·숫자·하이픈으로 2~63자여야 합니다." },
  status: choice(["draft", "published"]), domains: list(domainRule, 0, 40, false, true), template: choice(TEMPLATE_IDS),
  accentColor: { ...text(7, true), check: value => /^#[0-9a-f]{6}$/i.test(value) ? undefined : "색상은 #RRGGBB 형식이어야 합니다." },
  headingFont: choice(HEADING_FONT_IDS), palette: choice(PALETTE_IDS, true), design: designRule,
  footer: object({ heading: text(80, true), note: text(400, true) }, true),
  templateContent: object(Object.fromEntries(TEMPLATE_IDS.map(id => [id, templateRule])), true),
  contentBrief: object({ purpose: text(100, true, 1), targetAudience: text(80, true, 1), primaryAction: text(60, true, 1) }, true),
  agent: object({ name: text(60), title: text(80), company: text(120), branch: text(120, true), registrationNumber: text(80, true), businessNumber: text(80, true),
    careerYears: { type: "number", min: 0, max: 100, optional: true }, regions: list(text(80), 0, 12), profileImage: imageRule(), logoImage: imageRule(true) }),
  hero: object({ eyebrow: text(80, true), headline: text(40), subheadline: text(120), mobileHeadline: text(24, true, 1), mobileSubheadline: text(60, true, 1),
    primaryCtaLabel: text(24), secondaryCtaLabel: text(24), trustNote: text(240, true), image: imageRule(true) }),
  intro: object({ title: text(40), body: text(400), mobileTitle: text(24, true, 1), mobileBody: text(100, true, 1), philosophy: text(160, true) }),
  specialties: list(cardRule, 3), process: list(cardRule), career: list(text(160), 0, 20),
  reviews: list(object({ quote: text(400), author: text(80), context: text(120, true), isExample: bool(true) }), 0, 12, true), faqs: list(faqRule),
  consultation: object({ topics: list(text(60), 1, 12, false, true) }, true),
  contact: object({ phone: { ...text(32), check: value => directPhoneHref(value) ? undefined : "연결 가능한 전화번호를 숫자와 +, -, 괄호로 입력하세요." },
    kakaoUrl: urlRule(), instagramUrl: urlRule(), email: emailRule, formEmail: emailRule, officeAddress: text(240, true), mapUrl: urlRule(), availableHours: text(100) }),
  sections: object({ career: bool(), process: bool(), reviews: bool(true), faq: bool(), location: bool(), contactForm: bool() }),
  seo: object({ title: text(120), description: text(300), ogImage: imageRule(true), noIndex: bool(true) }),
  compliance: object({ advertisingReviewStatus: choice(["pending", "approved", "not-required"]), advertisingReviewNumber: text(120, true), advertisingReviewExpiresAt: text(40, true),
    footerDisclaimer: text(2000), privacyOfficer: text(120), privacyRetentionPeriod: text(500), contentTruthConfirmed: bool(), photoUseConfirmed: bool(), publicationConfirmed: bool() }),
  demo: object({ enabled: bool(), allowTemplateSwitch: bool(true), submissionMode: choice(["discard", "store", "mailto"], true) }, true),
});

/** Shared editor/save visibility: hidden drafts remain editable when re-enabled. */
export function isSectionEnabled(site: Pick<SiteConfig, "design" | "sections">, id: DesignSectionId): boolean {
  if (Array.isArray(site.design?.hiddenSections) && site.design.hiddenSections.includes(id)) return false;
  if (id === "reviews") return site.sections?.reviews === true;
  if (id === "process" || id === "faq") return site.sections?.[id] !== false;
  return true;
}

function draftContentRule(rule: Rule, allowMissing = true): Rule {
  if (rule.type === "string") return { ...rule, min: 0, optional: allowMissing || rule.optional };
  if (rule.type === "array") return { ...rule, min: 0, items: draftContentRule(rule.items!, false) };
  if (rule.type === "object") return { ...rule, properties: Object.fromEntries(Object.entries(rule.properties!).map(([key, child]) => [key, draftContentRule(child)])) };
  return rule;
}

function sectionAwareSiteRule(input: unknown): Rule {
  const site = input && typeof input === "object" ? input as SiteConfig : {} as SiteConfig;
  const properties = { ...siteRule.properties! };
  const sectionFields: Partial<Record<DesignSectionId, string[]>> = { about: ["intro", "career"], services: ["specialties"], process: ["process"], faq: ["faqs"], reviews: ["reviews"], contact: ["consultation"] };
  for (const [section, fields] of Object.entries(sectionFields)) {
    if (!isSectionEnabled(site, section as DesignSectionId)) for (const field of fields) properties[field] = draftContentRule(properties[field]);
  }
  return { ...siteRule, properties };
}

function inspect(value: unknown, rule: Rule, path: string, errors: string[]): void {
  if (errors.length >= 40) return;
  if (value === null && rule.nullable) return;
  if (value === undefined && rule.optional) return;
  if (value === undefined) { errors.push(`${path}: 필수 항목을 입력하세요.`); return; }
  if (rule.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) { errors.push(`${path}: 올바른 설정 객체가 필요합니다.`); return; }
    const record = value as Record<string, unknown>;
    for (const key of Object.keys(record)) {
      if (["__proto__", "constructor", "prototype"].includes(key) || !Object.hasOwn(rule.properties!, key)) errors.push(`${path}.${key}: 지원하지 않는 항목입니다.`);
      if (errors.length >= 40) return;
    }
    for (const [key, child] of Object.entries(rule.properties!)) inspect(Object.hasOwn(record, key) ? record[key] : undefined, child, `${path}.${key}`, errors);
  } else if (rule.type === "array") {
    if (!Array.isArray(value)) { errors.push(`${path}: 목록이 필요합니다.`); return; }
    if (value.length < (rule.min ?? 0) || value.length > (rule.max ?? 12)) { errors.push(`${path}: ${rule.min ?? 0}~${rule.max ?? 12}개 항목으로 작성하세요.`); return; }
    if (rule.unique && new Set(value).size !== value.length) errors.push(`${path}: 중복 항목을 제거하세요.`);
    for (const [index, item] of value.entries()) inspect(item, rule.items!, `${path}[${index + 1}]`, errors);
  } else if (typeof value !== rule.type) errors.push(`${path}: ${rule.type === "string" ? "문자" : rule.type === "boolean" ? "참/거짓" : "숫자"} 형식이어야 합니다.`);
  else if (typeof value === "string") {
    // Uploaded base64 is ASCII and may contain four million characters; avoid
    // allocating one array element per character just to count its length.
    const length = /[\uD800-\uDBFF]/.test(value) ? Array.from(value).length : value.length;
    if (length < (rule.min ?? 0) || ((rule.min ?? 0) > 0 && !value.trim())) errors.push(`${path}: 필수 문구를 입력하세요.`);
    if (length > (rule.max ?? Infinity)) errors.push(`${path}: 공백 포함 ${rule.max}자 이내로 작성하세요. 현재 ${length}자입니다.`);
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) errors.push(`${path}: 지원하지 않는 제어 문자가 있습니다.`);
    if (rule.values && !rule.values.includes(value)) errors.push(`${path}: 지원하지 않는 선택값입니다.`);
    const message = rule.check?.(value); if (message) errors.push(`${path}: ${message}`);
  } else if (typeof value === "number" && (!Number.isInteger(value) || value < (rule.min ?? -Infinity) || value > (rule.max ?? Infinity))) errors.push(`${path}: ${rule.min}~${rule.max} 사이의 정수가 필요합니다.`);
}

export function validateProjectSite(site: unknown): string[] {
  const errors: string[] = [];
  inspect(site, sectionAwareSiteRule(site), "site", errors);
  if (!errors.length) {
    const config = site as SiteConfig;
    if (config.contact.kakaoUrl?.trim() && !openChatUrl(config.contact.kakaoUrl)) errors.push("contact.kakaoUrl: https://open.kakao.com/o/ 형식의 오픈채팅 초대 주소가 필요합니다.");
    if (isSectionEnabled(config, "process") && config.process.length < 3) errors.push("site.process: 진행 과정을 표시하려면 3개 이상 필요합니다.");
    if (isSectionEnabled(config, "faq") && config.faqs.length < 2) errors.push("site.faqs: FAQ를 표시하려면 2개 이상 필요합니다.");
    if (isSectionEnabled(config, "reviews") && !config.reviews?.length) errors.push("site.reviews: 후기를 표시하려면 1개 이상 필요합니다.");
    if (new TextEncoder().encode(JSON.stringify(site)).byteLength > MAX_PROJECT_BYTES - 256) errors.push("제작 파일은 전체 8MB 이하여야 합니다. 이미지 크기를 줄여 주세요.");
  }
  return errors;
}

function draftCopy(site: SiteConfig): SiteConfig {
  const copy: SiteConfig = JSON.parse(JSON.stringify(site));
  copy.status = "draft";
  copy.domains = [];
  copy.seo.noIndex = true;
  copy.sections.contactForm = false;
  copy.demo = { enabled: true, allowTemplateSwitch: false, submissionMode: "discard" };
  copy.compliance.contentTruthConfirmed = false;
  copy.compliance.photoUseConfirmed = false;
  copy.compliance.publicationConfirmed = false;
  copy.compliance.advertisingReviewStatus = "pending";
  copy.compliance.advertisingReviewNumber = "";
  copy.compliance.advertisingReviewExpiresAt = "";
  return copy;
}

function exactHero(site: SiteConfig): string | null {
  return COPY_LIBRARY.heroes.find(item => item.headline === site.hero.headline && item.subheadline === site.hero.subheadline
    && (item.mobileHeadline || '') === (site.hero.mobileHeadline || '') && (item.mobileSubheadline || '') === (site.hero.mobileSubheadline || '')
    && (item.eyebrow || '') === (site.hero.eyebrow || ''))?.id || null;
}
function exactIntro(site: SiteConfig): string | null {
  return COPY_LIBRARY.intros.find(item => item.title === site.intro.title && item.body === site.intro.body
    && (item.mobileTitle || '') === (site.intro.mobileTitle || '') && (item.mobileBody || '') === (site.intro.mobileBody || '')
    && (item.philosophy || '') === (site.intro.philosophy || ''))?.id || null;
}
function exactCards<T extends {id:string;title:string;body:string;mobileBody?:string}>(source: T[], values: SiteConfig['specialties']): string[] | null {
  const result = values.map(value => source.find(item => item.title === value.title && item.body === value.body && (item.mobileBody || '') === (value.mobileBody || ''))?.id);
  return result.every(Boolean) ? result as string[] : null;
}
function exactFaqs(site: SiteConfig): string[] | null {
  const result = site.faqs.map(value => COPY_LIBRARY.faqs.find(item => item.question === value.question && item.answer === value.answer && (item.mobileAnswer || '') === (value.mobileAnswer || ''))?.id);
  return result.every(Boolean) ? result as string[] : null;
}
export function inferCopySelection(site: SiteConfig): {selectedCopy: SelectedCopy; customGroups: CopyGroupId[]} {
  const services = exactCards(COPY_LIBRARY.services, site.specialties);
  const faqs = exactFaqs(site);
  const process = COPY_LIBRARY.processes.find(item => JSON.stringify(item.items) === JSON.stringify(site.process))?.id || null;
  const selectedCopy: SelectedCopy = {
    heroes: exactHero(site), intros: exactIntro(site), services: services || [], processes: process,
    faqs: faqs || [], footers: COPY_LIBRARY.footers.find(item => item.text === site.footer?.note)?.id || null,
  };
  const customGroups = COPY_GROUP_IDS.filter(group => group === 'services' ? !services : group === 'faqs' ? !faqs : !selectedCopy[group]);
  return { selectedCopy, customGroups };
}

function makeDraftId(siteId: string, savedAt: string): string {
  const random = globalThis.crypto?.randomUUID?.().replace(/-/g, '').slice(0, 10) || Math.random().toString(36).slice(2, 12);
  return `draft-${siteId}-${savedAt.replace(/\D/g, '').slice(0, 14)}-${random}`.slice(0, 100);
}

/** Resolve per-template examples once, so later DIY edits stay authoritative. */
export function createStudioExample(rawSite: SiteConfig): SiteConfig {
  const issues = validateProjectSite(rawSite);
  if (issues.length) throw new Error(issues.join("\n"));
  const site = draftCopy(rawSite);
  const override = site.templateContent?.[site.template];
  if (override) {
    for (const key of ["headline", "subheadline", "mobileHeadline", "mobileSubheadline", "eyebrow"] as const) if (override[key] !== undefined) site.hero[key] = override[key]!;
    if (override.specialties) site.specialties = override.specialties;
    if (override.process) site.process = override.process;
    if (override.faqs) site.faqs = override.faqs;
  }
  delete site.templateContent;
  return site;
}

export function createProject(site: SiteConfig, options: CreateProjectOptions = {}): StudioProject {
  const issues = validateProjectSite(site);
  if (issues.length) throw new Error(issues.join("\n"));
  const savedAt = options.savedAt || new Date().toISOString();
  const inferred = inferCopySelection(site);
  const project: StudioProject = {
    format: PROJECT_FORMAT,
    version: PROJECT_VERSION,
    savedAt,
    site: draftCopy(site),
    editor: {
      copyLibraryVersion: COPY_LIBRARY_VERSION,
      purposeId: options.purposeId ?? null,
      selectedCopy: inferred.selectedCopy,
      customGroups: inferred.customGroups,
      source: options.source || 'new',
    },
    handoff: {
      draftId: options.draftId || makeDraftId(site.id, savedAt),
      designVersion: DESIGN_VERSION,
      exportProfile: EXPORT_PROFILE,
      requestedDomain: options.requestedDomain?.trim() || null,
    },
  };
  // The editor downloads indented JSON. Measure that exact representation so
  // every file we let it save can pass the import file-size limit later.
  if (new TextEncoder().encode(JSON.stringify(project, null, 2)).byteLength > MAX_PROJECT_BYTES) throw new Error("제작 파일은 전체 8MB 이하여야 합니다. 이미지 크기를 줄여 주세요.");
  return project;
}

/** Accept JSON text as well as a decoded file; no code, HTML, or unknown fields execute. */
export function parseProject(input: unknown): StudioProject {
  if (typeof input === "string") {
    if (new TextEncoder().encode(input).byteLength > MAX_PROJECT_BYTES) throw new Error("제작 파일은 전체 8MB 이하여야 합니다.");
    try { input = JSON.parse(input); } catch { throw new Error("JSON 제작 파일을 읽을 수 없습니다. 저장한 .json 파일을 선택해 주세요."); }
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('제작 파일을 확인해 주세요.');
  const version = (input as Record<string, unknown>).version;
  if (version !== LEGACY_PROJECT_VERSION && version !== PROJECT_VERSION) throw new Error('이 제작 파일은 현재 편집기보다 새로운 형식입니다. 최신 편집기에서 불러와 주세요.');
  const savedAtRule = { ...text(40), check: (value: string) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) ? undefined : "저장 날짜 형식이 올바르지 않습니다." };
  const siteInput = (input as Record<string, unknown>).site;
  const selectedRule = object({
    heroes: {...choice(COPY_LIBRARY.heroes.map(item => item.id)), nullable: true},
    intros: {...choice(COPY_LIBRARY.intros.map(item => item.id)), nullable: true},
    services: list(choice(COPY_LIBRARY.services.map(item => item.id)), 0, 24, false, true),
    processes: {...choice(COPY_LIBRARY.processes.map(item => item.id)), nullable: true},
    faqs: list(choice(COPY_LIBRARY.faqs.map(item => item.id)), 0, 30, false, true),
    footers: {...choice(COPY_LIBRARY.footers.map(item => item.id)), nullable: true},
  });
  const v1Rule = object({ format: choice([PROJECT_FORMAT]), version: { type: 'number', min: 1, max: 1 }, savedAt: savedAtRule, site: sectionAwareSiteRule(siteInput) });
  const v2Rule = object({
    format: choice([PROJECT_FORMAT]), version: { type: 'number', min: 2, max: 2 }, savedAt: savedAtRule, site: sectionAwareSiteRule(siteInput),
    editor: object({ copyLibraryVersion: choice([COPY_LIBRARY_VERSION]), purposeId: {...choice(COPY_LIBRARY.presets.map(item => item.id)), nullable: true}, selectedCopy: selectedRule, customGroups: list(choice(COPY_GROUP_IDS), 0, 6, false, true), source: choice(['new','demo','imported']) }),
    handoff: object({ draftId: {...text(100), check: value => /^[a-z0-9-]+$/i.test(value) ? undefined : '초안 ID 형식이 올바르지 않습니다.'}, designVersion: text(80), exportProfile: choice([EXPORT_PROFILE]), requestedDomain: {...domainRule, nullable: true} }),
  });
  const errors: string[] = [];
  inspect(input, version === LEGACY_PROJECT_VERSION ? v1Rule : v2Rule, "project", errors);
  if (errors.length) throw new Error(`제작 파일을 확인해 주세요.\n${errors.join("\n")}`);
  const project = input as StudioProject | StudioProjectV1;
  const issues = validateProjectSite(project.site);
  if (issues.length) throw new Error(issues.join("\n"));
  if (new TextEncoder().encode(JSON.stringify(project)).byteLength > MAX_PROJECT_BYTES) throw new Error("제작 파일은 전체 8MB 이하여야 합니다.");
  if (project.version === LEGACY_PROJECT_VERSION) return createProject(draftCopy(project.site), { savedAt: project.savedAt, source: 'imported', draftId: `legacy-${project.site.id}-${project.savedAt.replace(/\D/g, '').slice(0, 14)}` });
  const inferred = inferCopySelection(project.site);
  const custom = new Set(project.editor.customGroups);
  for (const group of inferred.customGroups) custom.add(group);
  return {
    ...project,
    site: draftCopy(project.site),
    editor: { ...project.editor, selectedCopy: inferred.selectedCopy, customGroups: [...custom] },
    handoff: { ...project.handoff, requestedDomain: project.handoff.requestedDomain?.trim() || null },
  };
}
