import type { SiteConfig, TemplateId, PaletteId } from '../types.js';
import { escapeHtml as e } from '../utils/html.js';
import { directEmailHref, directPhoneHref, openChatUrl } from '../utils/contact-links.js';
import { TEMPLATE_META, PALETTES, paletteId, getDesign } from './design-system.js';

export const arrow = '<span aria-hidden="true">↗</span>';
const phoneIcon = '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" focusable="false"><path d="M5 3h4l2 5-3 2c1.5 3 3 4.5 6 6l2-3 5 2v4c0 1-1 2-2 2C10 21 3 14 3 5c0-1 1-2 2-2Z"/></svg>';
const chatIcon = '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" focusable="false"><path d="M21 11c0 5-4 8-9 8H9l-5 3 1-6c-1-1-2-3-2-5 0-5 4-8 9-8s9 3 9 8Z"/><path d="M7 10h10M7 14h6"/></svg>';

export function renderContactButtons(site: SiteConfig, compact = false): string {
  const phone = directPhoneHref(site.contact.phone);
  const kakao = openChatUrl(site.contact.kakaoUrl);
  return `<div class="direct-contact-actions${compact ? ' contact-compact' : ''}">${phone ? `<a class="button direct-phone" data-contact-link="phone" href="${e(phone)}" aria-label="${e(site.agent.name || '담당자')}에게 전화하기">${phoneIcon}<span>${compact ? '전화' : '전화로 문의하기'}</span></a>` : ''}${kakao ? `<a class="button direct-kakao" data-contact-link="kakao" href="${e(kakao)}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer" aria-label="카카오톡 오픈채팅 열기 (새 창)">${chatIcon}<span>${compact ? '오픈채팅' : '카카오톡 오픈채팅'}</span></a>` : ''}${!phone && !kakao ? '<p class="support-note">연락처 확인 후 연결 버튼이 표시됩니다.</p>' : ''}</div>`;
}

export function renderHeader(site: SiteConfig): string {
  const hidden = getDesign(site).hiddenSections;
  const links = `${!hidden.includes('about') ? '<a href="#about">담당자 소개</a>' : ''}${!hidden.includes('services') ? '<a href="#specialties">상담 분야</a>' : ''}${site.sections.faq && !hidden.includes('faq') ? '<a href="#faq">자주 묻는 질문</a>' : ''}<a href="${hidden.includes('contact') ? '#footer' : '#contact'}">연락 방법</a>`;
  return `<header class="site-header"><div class="container header-inner"><a class="brand" href="/" aria-label="${e(site.agent.name)} 보험상담 홈">${site.agent.logoImage ? `<img class="brand-logo" src="${e(site.agent.logoImage)}" alt="${e(site.agent.company)} 로고" width="44" height="44">` : ''}<span><strong>${e(site.agent.name || '담당자 이름')} <span class="brand-service">보험상담</span></strong><span class="brand-sub">${e(site.agent.company)}</span></span></a><nav class="desktop-nav" aria-label="주요 메뉴">${links}</nav><div class="header-tools">${renderContactButtons(site, true)}<details class="mobile-menu"><summary>메뉴</summary><nav aria-label="모바일 메뉴">${links}</nav></details></div></div></header>`;
}

/**
 * 예시 페이지 위에만 올라가는 안내 줄입니다. 고객이 읽을 문장만 남기고,
 * 디자인을 바꿔 보는 선택은 접어 둡니다. 제작 화면은 이 버튼 하나로만 들어가고
 * 나올 때는 항상 이 메인 화면으로 돌아옵니다.
 */
export function renderDemoSwitcher(site: SiteConfig): string {
  if (!site.demo?.enabled || !site.demo.allowTemplateSwitch) return '';
  return `<aside class="sample-bar" aria-label="예시 페이지 안내"><div class="container sample-inner"><span class="sample-label">보험 상담 페이지 예시입니다. 전화와 카카오톡 버튼은 표시된 담당자에게 실제로 연결됩니다.</span><div class="sample-actions"><details class="sample-settings"><summary>디자인 바꿔 보기</summary><form class="design-controls" action="/" method="get" data-design-controls><div><label for="sample-theme">화면 구성</label><select id="sample-theme" name="theme">${(Object.entries(TEMPLATE_META) as [TemplateId, typeof TEMPLATE_META[TemplateId]][]).map(([id, m]) => `<option value="${id}"${site.template === id ? ' selected' : ''}>${e(m.name)}</option>`).join('')}</select></div><div><label for="sample-palette">색상</label><select id="sample-palette" name="palette">${(Object.entries(PALETTES) as [PaletteId, typeof PALETTES[PaletteId]][]).map(([id, p]) => `<option value="${id}"${paletteId(site) === id ? ' selected' : ''}>${e(p.name)}</option>`).join('')}</select></div><button class="button button-small" type="submit">이 조합 보기</button><a href="/templates">한눈에 비교 ${arrow}</a></form></details><a class="studio-start button button-small" href="/studio" data-studio-entry>내 페이지 만들기 ${arrow}</a></div></div></aside>`;
}

export function renderSocialLinks(site: SiteConfig): string { return renderContactButtons(site); }

/**
 * 연락 패널. 고객이 읽을 이유가 있는 문장만 남깁니다. 동작 설명(자동 발송 없음,
 * 새 창에서 열림 같은 것)은 고객에게 필요 없는 내부 사정이라 뺐습니다.
 * 공개 대화방에 민감한 정보를 남기지 말라는 안내는 고객을 보호하는 내용이라
 * 유지합니다. 보험 고지는 첫 화면과 맨 아래에 그대로 있습니다.
 * (함수 이름은 예전 호출부와의 호환을 위해 남겨 둔 것으로, 입력 폼이 아닙니다.)
 */
export function renderContactForm(site: SiteConfig): string {
  const email = directEmailHref(site.contact.email);
  const optional = `${email ? `<div><dt>이메일</dt><dd><a data-email-link href="${e(email)}">${e(site.contact.email!)}</a></dd></div>` : ''}${site.contact.fax?.trim() ? `<div><dt>팩스</dt><dd>${e(site.contact.fax)}</dd></div>` : ''}`;
  return `<div class="direct-contact-panel" data-direct-contact><p class="eyebrow">담당자에게 직접 문의</p><h3>신청서 없이, 편한 방법으로 연락하세요.</h3>${renderContactButtons(site)}<dl class="direct-contact-details"><div><dt>전화번호</dt><dd>${e(site.contact.phone || '미입력')}</dd></div><div><dt>상담 시간</dt><dd>${e(site.contact.availableHours || '담당자에게 확인')}</dd></div>${optional}</dl><p class="support-note">공개 대화방에는 주민등록번호·병력·계약서 원본을 남기지 마세요.</p>${site.demo?.enabled ? '<p class="demo-contact-notice">디자인 예시입니다. 이 페이지의 연락 버튼은 표시된 담당자에게 실제로 연결됩니다.</p>' : ''}</div>`;
}

export function renderFooter(site: SiteConfig): string {
  const pattern = getDesign(site).footer;
  const email = directEmailHref(site.contact.email);
  const business = `<p>${e(site.agent.company || '소속 확인 필요')}${site.agent.branch ? ` · ${e(site.agent.branch)}` : ''}${site.agent.businessNumber ? ` · 사업자등록번호 ${e(site.agent.businessNumber)}` : ''}</p>${site.agent.registrationNumber ? `<p>설계사 등록번호 ${e(site.agent.registrationNumber)}</p>` : ''}${site.contact.officeAddress ? `<p>${e(site.contact.officeAddress)}</p>` : ''}`;
  const note = site.footer?.note ? `<p class="footer-note">${e(site.footer.note)}</p>` : '';
  return `<footer class="site-footer footer-${pattern}" id="footer" data-pattern="footer-${pattern}"><div class="container"><div class="footer-top"><div class="footer-identity"><h2>${e(site.footer?.heading || `${site.agent.name || '담당자'} 보험상담`)}</h2>${pattern === 'columns' ? note : business + note}</div>${pattern === 'columns' ? `<div class="footer-business">${business}</div>` : ''}<div class="footer-contact"><p>${e(site.contact.phone)}${email ? `<br><a data-email-link href="${e(email)}">${e(site.contact.email!)}</a>` : ''}${site.contact.fax?.trim() ? `<br>팩스 ${e(site.contact.fax)}` : ''}<br>상담 시간 ${e(site.contact.availableHours)}</p>${renderContactButtons(site, true)}</div></div><div class="footer-legal"><p>${e(site.compliance.footerDisclaimer)}</p>${site.compliance.advertisingReviewNumber ? `<p>${e(site.compliance.advertisingReviewNumber)}${site.compliance.advertisingReviewExpiresAt ? ` · 유효기간 ${e(site.compliance.advertisingReviewExpiresAt)}` : ''}</p>` : ''}<p>상담 요청은 보험 가입 신청이 아닙니다. 계약 전 상품설명서와 약관을 확인해 주세요.</p><div class="footer-bottom"><p>© ${new Date().getUTCFullYear()} ${e(site.agent.name)} · ${site.demo?.enabled ? '디자인 예시' : '보험 상담 안내'}</p><a href="/privacy">개인정보·외부 연결 안내</a></div></div></div></footer>`;
}

export function renderMobileCta(site: SiteConfig): string {
  if (!directPhoneHref(site.contact.phone) && !openChatUrl(site.contact.kakaoUrl)) return '';
  return `<div class="mobile-cta direct-mobile-cta" data-mobile-cta aria-label="바로 연락하기">${renderContactButtons(site, true)}</div>`;
}
export function formatIndex(index: number): string { return String(index + 1).padStart(2, '0'); }
export function renderReviewNotice(): string { return '<p class="review-notice">게시 동의와 사실 확인을 마친 후기만 제공합니다.</p>'; }
