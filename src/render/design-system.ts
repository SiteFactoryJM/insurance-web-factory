import { DESIGN_SECTION_IDS, PALETTE_IDS, TEMPLATE_IDS, type PaletteId, type SiteConfig, type SiteDesign, type TemplateId } from "../types.js";

export const DESIGN_VERSION = "clear-human-v1";
export const TEMPLATE_META: Record<TemplateId, { name: string; purpose: string; description: string; palette: PaletteId }> = {
  "trust-blue": { name: "신뢰의 기준", purpose: "기업형", description: "담당자와 상담 분야를 먼저 확인합니다. 정돈된 항목과 설명으로 필요한 정보를 차례로 살펴봅니다.", palette: "navy" },
  "warm-care": { name: "사람과 대화", purpose: "소개 중심형", description: "사진과 상담 원칙에서 시작합니다. 상담 철학과 준비할 내용을 깊이 있게 전달합니다.", palette: "forest" },
  "premium-navy": { name: "선택의 기준", purpose: "가입 점검형", description: "가입 전 점검할 기준을 먼저 제시합니다. 보장·예산·유지 조건을 확인하고 상담을 준비합니다.", palette: "slate" },
  "clean-minimal": { name: "한 장의 정리", purpose: "리포트형", description: "요약, 점검 항목, 진행 순서를 보고서처럼 정리합니다. 후기 없이 필요한 정보에 집중합니다.", palette: "charcoal" },
  "local-friendly": { name: "바로 묻는 상담", purpose: "상담 메뉴형", description: "전화와 오픈채팅 연락 방법을 먼저 확인합니다. 소개받은 고객이 쉽게 연락하는 구성입니다.", palette: "teal" },
};
export const PALETTES: Record<PaletteId, { name: string; accent: string; hover: string; ink: string; muted: string; paper: string; tint: string; line: string; input: string; dark: string; detail: string }> = {
  navy: { name: "미드나이트 네이비", accent: "#2D4864", hover: "#1D3249", ink: "#172A3D", muted: "#526170", paper: "#F8F7F3", tint: "#E8EDF3", line: "#CDD6E0", input: "#788696", dark: "#172A3D", detail: "#CDD6E0" },
  forest: { name: "포레스트 그린", accent: "#2B5544", hover: "#1F4334", ink: "#142A20", muted: "#52695B", paper: "#F5F8F5", tint: "#EAF3ED", line: "#D1DED5", input: "#607768", dark: "#142A20", detail: "#D1DED5" },
  teal: { name: "딥 틸", accent: "#235B63", hover: "#184850", ink: "#112B30", muted: "#4C676D", paper: "#F4F8F9", tint: "#E7F2F3", line: "#CDDDE0", input: "#5F777D", dark: "#112B30", detail: "#CDDDE0" },
  charcoal: { name: "차콜 그레이", accent: "#41464E", hover: "#2D333B", ink: "#1D2127", muted: "#59616E", paper: "#F7F8FA", tint: "#ECEFF3", line: "#D7DDE5", input: "#6A7482", dark: "#1D2127", detail: "#D7DDE5" },
  stone: { name: "웜 스톤", accent: "#605744", hover: "#49412F", ink: "#302C25", muted: "#6D6555", paper: "#FAF8F3", tint: "#F2EDE2", line: "#DDD6C9", input: "#7C7464", dark: "#302C25", detail: "#DDD6C9" },
  slate: { name: "스틸 슬레이트", accent: "#485868", hover: "#303F4E", ink: "#24323F", muted: "#566370", paper: "#F6F6F2", tint: "#E5E9ED", line: "#CDD4DB", input: "#768390", dark: "#24323F", detail: "#CDD4DB" },
};
export function paletteId(site: SiteConfig): PaletteId {
  return PALETTE_IDS.includes(site.palette as PaletteId) ? site.palette! : TEMPLATE_META[site.template].palette;
}
export function paletteStyle(id: PaletteId): string {
  const p = PALETTES[id];
  return `--accent:${p.accent};--accent-hover:${p.hover};--ink:${p.ink};--muted:${p.muted};--paper:${p.paper};--tint:${p.tint};--line:${p.line};--input:${p.input};--dark:${p.dark};--detail:${p.detail}`;
}
export function getDesign(site: SiteConfig): Required<SiteDesign> {
  const orders: Record<TemplateId, Required<SiteDesign>['sectionOrder']> = {
    'trust-blue': ['services','about','process','reviews','faq','contact'],
    'warm-care': ['about','services','reviews','faq','process','contact'],
    'premium-navy': ['services','process','about','faq','contact','reviews'],
    'clean-minimal': ['services','process','faq','about','contact','reviews'],
    'local-friendly': ['services','contact','faq','about','process','reviews'],
  };
  const supplied = site.design || {};
  const order = supplied.sectionOrder?.filter((key, i, all) => DESIGN_SECTION_IDS.includes(key) && all.indexOf(key) === i);
  return {
    hero: ['trust-blue','warm-care'].includes(site.template) ? 'portrait' : ['premium-navy','clean-minimal'].includes(site.template) ? 'statement' : 'editorial',
    services: site.template === 'trust-blue' ? 'list' : site.template === 'premium-navy' ? 'split' : 'cards',
    about: site.template === 'warm-care' ? 'profile' : 'editorial',
    process: site.template === 'clean-minimal' ? 'steps' : 'timeline',
    faq: 'accordion', footer: 'classic', ornament: 'line', density: 'airy',
    ...supplied,
    sectionOrder: order?.length ? [...order, ...DESIGN_SECTION_IDS.filter(key => !order.includes(key))] : orders[site.template],
    hiddenSections: (supplied.hiddenSections || []).filter(key => DESIGN_SECTION_IDS.includes(key)),
  };
}
export function resolveDesign(raw: SiteConfig, request: Request): SiteConfig {
  const query = new URL(request.url).searchParams;
  const preview = raw.demo?.enabled && raw.demo.allowTemplateSwitch;
  const requested = query.get("theme");
  const template = preview && TEMPLATE_IDS.includes(requested as TemplateId) ? requested as TemplateId : raw.template;
  const requestedPalette = query.get("palette");
  const palette = preview && PALETTE_IDS.includes(requestedPalette as PaletteId)
    ? requestedPalette as PaletteId
    : template !== raw.template ? TEMPLATE_META[template].palette : paletteId(raw);
  const content = raw.templateContent?.[template];
  return { ...raw, template, palette,
    hero: { ...raw.hero, ...(content?.headline ? { headline: content.headline } : {}), ...(content?.subheadline ? { subheadline: content.subheadline } : {}), ...(content?.eyebrow ? { eyebrow: content.eyebrow } : {}), ...(content?.mobileHeadline || content?.headline ? { mobileHeadline: content.mobileHeadline } : {}), ...(content?.mobileSubheadline || content?.subheadline ? { mobileSubheadline: content.mobileSubheadline } : {}) },
    specialties: content?.specialties ?? raw.specialties,
    process: content?.process ?? raw.process,
    faqs: content?.faqs ?? raw.faqs,
  };
}
export const DEFAULT_TOPICS = ["생명보험", "실손·건강보험", "암·질병보험", "자동차보험", "연금·저축보험", "어린이·태아보험", "기타 / 아직 잘 모르겠어요"];
