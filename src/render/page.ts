import { TEMPLATE_IDS, type SiteConfig, type TemplateId } from "../types.js";
import { escapeHtml, jsonForHtml, safeHexColor } from "../utils/html.js";
import { icon } from "../utils/icons.js";
import { clientScript } from "./client-script.js";
import {
  renderActions,
  renderCareer,
  renderContact,
  renderCustomizationBand,
  renderDemoSwitcher,
  renderFaq,
  renderFooter,
  renderHeader,
  renderIntro,
  renderLocation,
  renderMobileCta,
  renderProcess,
  renderProfile,
  renderSpecialties,
} from "./shared.js";
import { styles } from "./styles.js";
import { renderHero } from "./templates/index.js";

const THEME_ACCENTS: Record<TemplateId, string> = {
  "trust-blue": "#1E5AA8",
  "warm-care": "#557A62",
  "premium-navy": "#B6924E",
  "clean-minimal": "#222222",
  "local-friendly": "#158273",
};

function cloneWithPreviewTheme(site: SiteConfig, request: Request): SiteConfig {
  if (!site.demo?.allowTemplateSwitch) return site;
  const requested = new URL(request.url).searchParams.get("theme");
  if (!requested || !TEMPLATE_IDS.includes(requested as TemplateId)) return site;
  const template = requested as TemplateId;
  return { ...site, template, accentColor: THEME_ACCENTS[template] };
}

function renderHead(site: SiteConfig, request: Request): string {
  const url = new URL(request.url);
  const canonical = site.domains[0] ? `https://${site.domains[0]}/` : `${url.origin}/`;
  const ogImage = site.seo.ogImage ? new URL(site.seo.ogImage, url.origin).toString() : "";
  const robots = site.seo.noIndex || site.status !== "published" ? "noindex,nofollow" : "index,follow,max-image-preview:large";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.agent.name,
    jobTitle: site.agent.title,
    worksFor: { "@type": "Organization", name: site.agent.company },
    telephone: site.contact.phone,
    email: site.contact.email || undefined,
    areaServed: site.agent.regions,
    url: canonical,
  };
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <title>${escapeHtml(site.seo.title)}</title>
    <meta name="description" content="${escapeHtml(site.seo.description)}"><meta name="robots" content="${robots}">
    <link rel="canonical" href="${escapeHtml(canonical)}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
    <meta name="theme-color" content="${safeHexColor(site.accentColor, THEME_ACCENTS[site.template])}">
    <meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="${escapeHtml(site.seo.title)}"><meta property="og:description" content="${escapeHtml(site.seo.description)}"><meta property="og:url" content="${escapeHtml(canonical)}">${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}">` : ""}
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;600;700&display=swap">
    <script type="application/ld+json">${jsonForHtml(structuredData)}</script>`;
}

export function renderSitePage(rawSite: SiteConfig, request: Request): string {
  const site = cloneWithPreviewTheme(rawSite, request);
  const accent = safeHexColor(site.accentColor, THEME_ACCENTS[site.template]);
  const fontClass = site.headingFont === "noto-serif-kr" ? "font-noto-serif-kr" : "font-pretendard";
  return `<!doctype html><html lang="ko"><head>${renderHead(site, request)}<style>${styles}</style></head><body class="theme-${site.template} ${fontClass}" style="--accent:${accent}">
    ${renderHeader(site)}
    <main>${renderHero(site, renderActions(site), renderProfile(site))}${renderIntro(site)}${renderSpecialties(site)}${renderProcess(site)}${renderCareer(site)}${renderFaq(site)}${renderLocation(site)}${renderContact(site)}</main>
    ${renderCustomizationBand(site)}${renderFooter(site)}${renderMobileCta(site)}${renderDemoSwitcher(site)}
    <script>${clientScript}</script>
  </body></html>`;
}

export function renderTemplateGallery(site: SiteConfig, request: Request): string {
  const current = new URL(request.url);
  const templates: Array<[TemplateId, string, string]> = [
    ["trust-blue", "신뢰 블루", "정돈된 블루 톤과 프로필 중심 구성. 가장 범용적인 전문 상담형입니다."],
    ["warm-care", "따뜻한 케어", "베이지와 그린을 사용한 부드럽고 친근한 상담 이미지입니다."],
    ["premium-navy", "프리미엄 네이비", "네이비와 골드 포인트로 경력과 전문성을 강조합니다."],
    ["clean-minimal", "클린 미니멀", "군더더기 없는 에디토리얼 구성이며 문구와 사진을 선명하게 보여줍니다."],
    ["local-friendly", "지역 친화", "지역명과 쉬운 연락 방법을 앞세운 친근한 생활 밀착형입니다."],
  ];
  const cards = templates.map(([id, name, description]) => {
    const preview = new URL("/", current.origin); preview.searchParams.set("theme", id);
    return `<article class="template-tile"><div class="template-swatch ${id}" aria-hidden="true"></div><div><h2>${name}</h2><p>${description}</p></div><a href="${escapeHtml(preview.pathname + preview.search)}">이 디자인으로 보기 ${icon("arrow", 17)}</a></article>`;
  }).join("");
  return `<!doctype html><html lang="ko"><head>${renderHead(site, request)}<style>${styles}</style></head><body class="font-pretendard" style="--accent:${safeHexColor(site.accentColor, "#1E5AA8")}"><main class="template-page"><div class="container"><header class="simple-header"><a href="/">${icon("chevron", 18)} 예시 페이지로 돌아가기</a><h1>다섯 가지 디자인 중<br>목적에 맞게 선택하세요.</h1><p>사진·문구·색상·노출 영역은 모두 설계사별로 조정할 수 있습니다. 모바일에서도 상담 버튼과 핵심 정보가 먼저 보이도록 설계했습니다.</p></header><section class="template-gallery">${cards}</section></div></main></body></html>`;
}

export function renderPrivacyPage(site: SiteConfig, request: Request): string {
  return `<!doctype html><html lang="ko"><head>${renderHead(site, request)}<style>${styles}</style></head><body class="font-pretendard" style="--accent:${safeHexColor(site.accentColor, "#1E5AA8")}"><main class="privacy-page"><div class="container"><header class="simple-header"><a href="/">${icon("chevron", 18)} 홈페이지로 돌아가기</a><h1>개인정보처리방침</h1><p>상담 신청 시 수집되는 정보와 이용 목적을 안내합니다.</p></header><article class="policy-card"><h2>1. 수집 항목</h2><p>이름, 연락처, 상담 희망 내용, 개인정보 수집·이용 동의 여부를 수집할 수 있습니다.</p><h2>2. 이용 목적</h2><p>상담 요청 확인, 연락, 일정 조율 및 상담 관련 안내에만 이용합니다.</p><h2>3. 보유 기간</h2><p>${escapeHtml(site.compliance.privacyRetentionPeriod)}</p><h2>4. 동의 거부 권리</h2><p>개인정보 제공에 동의하지 않을 수 있으나 상담 신청 기능 이용이 제한될 수 있습니다.</p><h2>5. 개인정보 담당</h2><p>${escapeHtml(site.compliance.privacyOfficer)}</p>${site.demo?.enabled ? "<h2>데모 안내</h2><p>현재 예시 페이지의 상담 신청 내용은 저장되지 않습니다.</p>" : ""}</article></div></main></body></html>`;
}

export function renderNotFoundPage(): string {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>사이트를 찾을 수 없습니다</title><style>${styles}</style></head><body><main class="not-found-page"><div class="container"><header class="simple-header"><h1>연결된 홈페이지를<br>찾을 수 없습니다.</h1><p>도메인 설정 또는 사이트 게시 상태를 확인해 주세요.</p></header></div></main></body></html>`;
}
