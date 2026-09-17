import { PALETTE_IDS, TEMPLATE_IDS, type PaletteId, type SiteConfig, type TemplateId } from '../types.js';
import { escapeHtml as e, jsonForHtml, safeUrl } from '../utils/html.js';
import { clientScript } from './client-script.js';
import { renderDemoSwitcher, renderFooter, renderHeader, renderMobileCta } from './shared.js';
import { styles } from './styles.js';
import { premiumStyles } from './premium-styles.js';
import { directContactStyles } from './direct-contact-styles.js';
import { clearHumanStyles } from './clear-human-styles.js';
import { fontStylesheetLinks, headingFontStyle } from './fonts.js';
import { renderThemePage } from './templates/index.js';
import { DESIGN_VERSION, TEMPLATE_META, PALETTES, paletteId, paletteStyle, resolveDesign, getDesign } from './design-system.js';
/** `clearHumanStyles` is last: it carries the Figma component measurements. */
const pageStyles = () => `<style>${styles}${premiumStyles}${directContactStyles}${clearHumanStyles}</style>`;
function renderHead(site: SiteConfig, request: Request): string {
  const url = new URL(request.url);
  const canonical = `${site.domains[0] ? `https://${site.domains[0]}` : url.origin}${url.pathname}`;
  const og = site.seo.ogImage ? new URL(site.seo.ogImage, url.origin).toString() : '';
  const robots = site.seo.noIndex || site.status !== 'published' || url.pathname !== '/' ? 'noindex,nofollow' : 'index,follow,max-image-preview:large';
  const instagram = safeUrl(site.contact.instagramUrl);
  const data = {'@context':'https://schema.org','@type':'Person',name:site.agent.name,jobTitle:site.agent.title,worksFor:{'@type':'Organization',name:site.agent.company},telephone:site.contact.phone,email:site.contact.email||undefined,sameAs:instagram?[instagram]:undefined,areaServed:site.agent.regions,url:canonical};
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${e(url.pathname === '/privacy' ? `개인정보·외부 연결 안내 | ${site.agent.name}` : site.seo.title)}</title><meta name="description" content="${e(site.seo.description)}"><meta name="robots" content="${robots}"><link rel="canonical" href="${e(canonical)}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><meta name="theme-color" content="${PALETTES[paletteId(site)].accent}"><meta property="og:type" content="website"><meta property="og:locale" content="ko_KR"><meta property="og:title" content="${e(site.seo.title)}"><meta property="og:description" content="${e(site.seo.description)}"><meta property="og:url" content="${e(canonical)}">${og ? `<meta property="og:image" content="${e(og)}">` : ''}<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>${fontStylesheetLinks([site.headingFont])}<script type="application/ld+json">${jsonForHtml(data)}</script>`;
}
export function renderSitePage(rawSite: SiteConfig, request: Request, options: {studioPreview?: boolean} = {}): string {
  const site = resolveDesign(rawSite,request), palette = paletteId(site);
  return `<!doctype html><html lang="ko"${options.studioPreview ? ' style="scroll-behavior:auto"' : ''}><head>${renderHead(site,request)}${pageStyles()}</head><body data-design-version="${DESIGN_VERSION}" data-contact-version="direct-v1" data-layout="${site.template}" data-palette="${palette}" data-heading-font="${site.headingFont}" data-studio-preview="${Boolean(options.studioPreview)}" class="premium-page theme-${site.template} palette-${palette} font-${site.headingFont || 'pretendard'}" style="${paletteStyle(palette)};${e(headingFontStyle(site.headingFont))}"><a class="skip-link" href="#main">본문으로 바로가기</a>${options.studioPreview ? '' : renderDemoSwitcher(site)}${renderHeader(site)}${renderThemePage(site)}${renderFooter(site)}${options.studioPreview ? '' : renderMobileCta(site)}<script>${clientScript}</script></body></html>`;
}
function renderTemplatePreview(id: TemplateId, site: SiteConfig): string {
  const headline = site.templateContent?.[id]?.headline || site.hero.headline;
  const labels = {services:'상담 분야',about:'담당자 소개',process:'상담 과정',reviews:'고객 후기',faq:'FAQ',contact:'연락 방법'};
  const order = getDesign({...site,template:id,design:undefined}).sectionOrder.filter(key => key !== 'reviews');
  return `<div class="template-preview preview-${id}" aria-hidden="true"><div class="preview-words"><p>${e(TEMPLATE_META[id].purpose)}</p><strong>${e(headline).replace(/\n/g,'<br>')}</strong><span></span></div><img src="${e(site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="" loading="lazy" width="240" height="320"><div class="preview-modules"><i></i><i></i><i></i></div></div><p class="palette-caption">구성 안내도 · 실제 화면은 아래 버튼에서 확인</p><p class="palette-caption">${order.map(key => labels[key]).join(' → ')}</p>`;
}
export function renderTemplateGallery(rawSite: SiteConfig, request: Request): string {
  const site = resolveDesign(rawSite,request), requested = new URL(request.url).searchParams.get('palette');
  const selected = site.demo?.enabled && site.demo.allowTemplateSwitch && PALETTE_IDS.includes(requested as PaletteId) ? requested as PaletteId : null;
  const colors = Object.entries(PALETTES).map(([id,p]) => `<button type="submit" name="palette" value="${id}" class="palette-choice" aria-pressed="${selected === id}"><span class="swatch" style="background:${p.accent}" aria-hidden="true"></span>${e(p.name)}</button>`).join('');
  const cards = TEMPLATE_IDS.map((id,index) => { const meta = TEMPLATE_META[id], palette = selected || meta.palette, href = `/?theme=${id}${selected ? '&palette='+selected : ''}`;
    return `<article class="template-tile" data-layout="${id}" data-palette="${palette}" style="${paletteStyle(palette)}">${renderTemplatePreview(id,site)}<div class="template-copy"><span class="badge">0${index+1} · ${e(meta.purpose)}</span><h2>${e(meta.name)}</h2><p>${e(meta.description)}</p><p class="palette-caption"><span class="swatch" style="background:${PALETTES[palette].accent}" aria-hidden="true"></span>${e(PALETTES[palette].name)}</p><a class="button" href="${e(href)}">이 조합 보기 <span aria-hidden="true">↗</span></a></div></article>`;
  }).join('');
  return `<!doctype html><html lang="ko"><head>${renderHead(site,request)}${pageStyles()}</head><body data-design-version="${DESIGN_VERSION}" class="premium-page gallery-page font-${site.headingFont}" style="${paletteStyle(paletteId(site))};${e(headingFontStyle(site.headingFont))}"><main class="container" id="main"><header class="simple-header gallery-header"><a href="/">← 메인으로</a><p class="eyebrow">목적에 따라 달라지는 화면</p><h1>어떤 정보를<br>먼저 보여줄까요?</h1><p>색상만 고르지 말고, 고객에게 먼저 보여 줄 내용을 골라 보세요. 5가지 구성과 6가지 색상을 섞어 볼 수 있습니다.</p><p><a class="button" href="/studio" data-studio-entry>내 페이지 만들기 ↗</a></p></header><form class="palette-picker" action="/templates" method="get"><fieldset><legend>색상 고르기</legend><div class="palette-options"><button class="palette-choice" type="submit" name="palette" value="recommended" aria-pressed="${!selected}">구성에 어울리는 색상</button>${colors}</div></fieldset></form><section class="template-gallery" aria-label="화면 구성 5가지">${cards}</section></main>${renderFooter(site)}</body></html>`;
}
export function renderPrivacyPage(site: SiteConfig, request: Request): string {
  return `<!doctype html><html lang="ko"><head>${renderHead(site,request)}${pageStyles()}</head><body class="premium-page policy-body font-pretendard" style="${paletteStyle(paletteId(site))};${e(headingFontStyle(site.headingFont))}"><main class="privacy-page" id="main"><div class="container"><header class="simple-header"><a href="/">홈페이지로 돌아가기</a><h1>개인정보·외부 연결 안내</h1><p>고객용 상담 입력란이나 온라인 접수 기능을 제공하지 않습니다.</p></header><article class="policy-card"><h2>1. 전화와 카카오톡 연결</h2><p>전화 버튼은 기기의 전화 앱으로, 카카오톡 버튼은 설정된 오픈채팅 주소로 연결됩니다. 이 페이지가 메시지를 작성하거나 자동 발송하지 않습니다.</p><h2>2. 이 페이지의 상담 정보 처리</h2><p>고객의 이름·전화번호·상담 내용을 입력받아 저장하거나 전송하는 기능이 없습니다. 서비스 제공 과정의 접속 기록 등은 실제 호스팅 운영 정책에 따라 별도로 확인해야 합니다.</p><h2>3. 외부 서비스 이용</h2><p>전화나 카카오톡으로 이동한 뒤 제공하는 정보에는 해당 서비스와 상담 담당자의 처리 기준이 적용됩니다. 공개 대화방에는 주민등록번호·병력·계약서 원본을 남기지 마세요.</p>${site.demo?.enabled ? '<h2>4. 제작 화면의 임시 보관</h2><p>페이지를 만드는 화면은 만든 사람이 직접 켰을 때에만 그 브라우저에 작업 내용을 임시로 보관합니다. 보관한 내용에는 입력한 이름·연락처·사진이 들어갈 수 있고, 같은 화면에서 지울 수 있습니다. 파일로 내보내기는 본인 기기로 내려받는 동작입니다.</p>' : ''}<h2>문의 담당</h2><p>${e(site.compliance.privacyOfficer)}</p><p>실제 게시 전에는 운영 주체의 개인정보 안내와 외부 서비스 이용 기준을 확인해야 합니다.</p></article></div></main>${renderFooter(site)}</body></html>`;
}
export function renderNotFoundPage(): string {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>사이트를 찾을 수 없습니다</title>${pageStyles()}</head><body class="policy-body"><main class="not-found-page"><div class="container"><header class="simple-header"><p>404</p><h1>연결된 홈페이지를<br>찾을 수 없습니다.</h1><span>도메인 설정 또는 사이트 게시 상태를 확인해 주세요.</span></header></div></main></body></html>`;
}
