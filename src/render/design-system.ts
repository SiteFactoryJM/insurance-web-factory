import { PALETTE_IDS, TEMPLATE_IDS, type PaletteId, type SiteConfig, type TemplateId } from "../types.js";

export const DESIGN_VERSION = "calm-trust-v6";
export const TEMPLATE_META: Record<TemplateId, { name: string; purpose: string; description: string; palette: PaletteId }> = {
  "trust-blue": { name: "신뢰의 기준", purpose: "기업형", description: "담당자와 상담 분야를 먼저 확인합니다. 정돈된 항목과 설명으로 필요한 정보를 차례로 살펴봅니다.", palette: "navy" },
  "warm-care": { name: "사람과 대화", purpose: "소개 중심형", description: "사진과 상담 원칙에서 시작합니다. 상담 철학과 준비할 내용을 깊이 있게 전달합니다.", palette: "forest" },
  "premium-navy": { name: "선택의 기준", purpose: "가입 점검형", description: "가입 전 점검할 기준을 먼저 제시합니다. 보장·예산·유지 조건을 확인하고 상담을 준비합니다.", palette: "slate" },
  "clean-minimal": { name: "한 장의 정리", purpose: "리포트형", description: "요약, 점검 항목, 진행 순서를 보고서처럼 정리합니다. 후기 없이 필요한 정보에 집중합니다.", palette: "charcoal" },
  "local-friendly": { name: "바로 묻는 상담", purpose: "상담 메뉴형", description: "궁금한 주제를 먼저 고릅니다. 짧은 안내를 읽고 바로 상담 신청 화면을 체험합니다.", palette: "teal" },
};
export const PALETTES: Record<PaletteId, { name: string; accent: string; hover: string; ink: string; muted: string; paper: string; tint: string; line: string; input: string; dark: string; detail: string }> = {
  navy: { name: "미드나이트 네이비", accent: "#2D4864", hover: "#1D3249", ink: "#172A3D", muted: "#526170", paper: "#F5F6F8", tint: "#E8EDF3", line: "#CDD6E0", input: "#788696", dark: "#142131", detail: "#D8BC88" },
  forest: { name: "포레스트 그린", accent: "#2B5544", hover: "#1A3B2D", ink: "#20382D", muted: "#54635A", paper: "#F5F6F2", tint: "#E7EDE6", line: "#CBD6CB", input: "#76867A", dark: "#142A20", detail: "#D6C3A0" },
  slate: { name: "스틸 슬레이트", accent: "#485868", hover: "#303F4E", ink: "#24323F", muted: "#566370", paper: "#F3F5F6", tint: "#E5E9ED", line: "#CDD4DB", input: "#768390", dark: "#202C39", detail: "#CED5DC" },
  stone: { name: "웜스톤", accent: "#605744", hover: "#443D30", ink: "#302C25", muted: "#665F52", paper: "#F5F3EE", tint: "#EAE6DC", line: "#D6D0C2", input: "#898170", dark: "#302C25", detail: "#DFCEAA" },
  charcoal: { name: "차콜 그레이", accent: "#41464E", hover: "#292E35", ink: "#242A31", muted: "#5D636B", paper: "#F5F5F4", tint: "#E9EAEA", line: "#D1D3D5", input: "#81858A", dark: "#1D2127", detail: "#CEBE9B" },
  teal: { name: "딥 틸", accent: "#235B63", hover: "#16424A", ink: "#19363B", muted: "#52676A", paper: "#F2F6F5", tint: "#E3EDEE", line: "#C8D8DA", input: "#738B8F", dark: "#112B30", detail: "#D7C6A0" },
};
export function paletteId(site: SiteConfig): PaletteId {
  return PALETTE_IDS.includes(site.palette as PaletteId) ? site.palette! : TEMPLATE_META[site.template].palette;
}
export function paletteStyle(id: PaletteId): string {
  const p = PALETTES[id];
  return `--accent:${p.accent};--accent-hover:${p.hover};--ink:${p.ink};--muted:${p.muted};--paper:${p.paper};--tint:${p.tint};--line:${p.line};--input:${p.input};--dark:${p.dark};--detail:${p.detail}`;
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
