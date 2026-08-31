import type { SiteConfig, TemplateId } from "../types.js";
import { escapeHtml, phoneHref, safeUrl } from "../utils/html.js";
import { icon } from "../utils/icons.js";

const THEME_LABELS: Record<TemplateId, string> = {
  "trust-blue": "인스티튜셔널",
  "warm-care": "휴먼 에디토리얼",
  "premium-navy": "프라이빗 컨설팅",
  "clean-minimal": "리포트 미니멀",
  "local-friendly": "모바일 컨시어지",
};

function instagramHandle(value: string | undefined): string {
  const url = safeUrl(value);
  if (!url) return "인스타그램 보기";
  try { const handle = new URL(url).pathname.split("/").filter(Boolean)[0]; return handle ? `@${handle}` : "인스타그램 보기"; }
  catch { return "인스타그램 보기"; }
}

export function renderHeader(site: SiteConfig): string {
  return `<header class="site-header" data-header><div class="container header-inner">
    <a class="brand" href="#home" aria-label="홈으로 이동">${site.agent.logoImage ? `<img src="${escapeHtml(site.agent.logoImage)}" alt="" width="34" height="34">` : `<span class="brand-mark">${escapeHtml(site.agent.name.slice(0, 1))}</span>`}<span class="brand-copy"><strong>${escapeHtml(site.agent.name)}</strong><small>${escapeHtml(site.agent.title)} · ${escapeHtml(site.agent.company)}</small></span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" data-nav-toggle><span class="sr-only">메뉴 열기</span>${icon("menu")}</button>
    <nav class="main-nav" id="main-nav" aria-label="주요 메뉴" data-nav><a href="#about">소개</a><a href="#specialties">상담 분야</a>${site.sections.reviews ? '<a href="#reviews">고객 후기</a>' : ""}${site.sections.faq ? '<a href="#faq">자주 묻는 질문</a>' : ""}<a class="nav-cta" href="#contact">상담 문의</a></nav>
  </div></header>`;
}

export function renderSocialLinks(site: SiteConfig, className = "social-links"): string {
  const kakaoUrl = safeUrl(site.contact.kakaoUrl);
  const instagramUrl = safeUrl(site.contact.instagramUrl);
  return `<div class="${escapeHtml(className)}" aria-label="빠른 상담 연결">
    <a class="social-link social-phone" href="${phoneHref(site.contact.phone)}"><span class="social-emoji" aria-hidden="true">📞</span><span><small>전화 상담</small><strong>${escapeHtml(site.contact.phone)}</strong></span></a>
    ${kakaoUrl ? `<a class="social-link social-kakao" href="${escapeHtml(kakaoUrl)}" target="_blank" rel="noopener noreferrer"><span class="social-emoji" aria-hidden="true">💬</span><span><small>카카오톡</small><strong>오픈채팅 연결</strong></span></a>` : ""}
    ${instagramUrl ? `<a class="social-link social-instagram" href="${escapeHtml(instagramUrl)}" target="_blank" rel="noopener noreferrer"><span class="social-emoji" aria-hidden="true">📷</span><span><small>인스타그램</small><strong>${escapeHtml(instagramHandle(instagramUrl))}</strong></span></a>` : ""}
  </div>`;
}

export function renderContactForm(site: SiteConfig, modifier = ""): string {
  const formEmail = site.contact.formEmail || site.contact.email || "";
  const requestedMode = site.demo?.submissionMode ?? "store";
  const submissionMode = requestedMode === "mailto" && !formEmail ? "discard" : requestedMode;
  return `<form class="contact-form ${escapeHtml(modifier)}" data-contact-form data-form-email="${escapeHtml(formEmail)}" data-submission-mode="${escapeHtml(submissionMode)}" novalidate>
    <div class="form-heading"><p>CONSULTATION NOTE</p><h3>상담 내용을 남겨주세요.</h3><span>확인 후 편한 연락 방법으로 안내드립니다.</span></div>
    <input type="hidden" name="siteId" value="${escapeHtml(site.id)}"><label class="honeypot" aria-hidden="true">회사명<input name="companyWebsite" tabindex="-1" autocomplete="off"></label>
    <div class="form-row"><label><span>이름</span><input type="text" name="name" autocomplete="name" required maxlength="30" placeholder="성함을 입력해 주세요"></label><label><span>연락처</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" required maxlength="15" placeholder="010-0000-0000"></label></div>
    <label><span>상담 희망 내용</span><textarea name="message" rows="5" maxlength="500" placeholder="현재 궁금한 점과 편한 연락 시간을 적어 주세요."></textarea></label>
    <label class="consent"><input type="checkbox" name="privacyConsent" value="true" required><span>개인정보 수집·이용에 동의합니다. <a href="/privacy" target="_blank">내용 보기</a></span></label>
    <button class="form-submit" type="submit"><span>${submissionMode === "mailto" ? "이메일로 상담 내용 보내기" : "상담 내용 보내기"}</span>${icon("arrow", 19)}</button>
    <p class="form-status" role="status" aria-live="polite" data-form-status>${site.demo?.enabled ? "예시 페이지에서는 입력 내용이 저장되지 않습니다. 담당 이메일이 등록되면 작성 내용을 이메일 앱으로 넘길 수 있습니다." : ""}</p>
  </form>`;
}

export function renderReviewNotice(site: SiteConfig): string {
  const hasExamples = (site.reviews ?? []).some((review) => review.isExample);
  return hasExamples ? `<p class="review-notice">현재 후기는 디자인 확인을 위한 예시 문구입니다. 실제 공개 시 고객 동의와 사실 확인을 거친 후기만 게시합니다.</p>` : "";
}

export function renderCustomizationBand(site: SiteConfig): string {
  if (!site.demo?.enabled) return "";
  return `<aside class="customization-band"><div class="container"><div><span>DEMO</span><strong>레이아웃·문구·사진·노출 항목은 설계사별로 변경할 수 있습니다.</strong></div><a href="/templates">5가지 레이아웃 비교 ${icon("arrow", 18)}</a></div></aside>`;
}

export function renderFooter(site: SiteConfig): string {
  const instagramUrl = safeUrl(site.contact.instagramUrl); const kakaoUrl = safeUrl(site.contact.kakaoUrl);
  return `<footer class="site-footer"><div class="container footer-main"><div class="footer-brand"><strong>${escapeHtml(site.agent.name)}</strong><span>${escapeHtml(site.agent.title)} · ${escapeHtml(site.agent.company)}</span></div><div class="footer-links"><a href="/privacy">개인정보처리방침</a><a href="${phoneHref(site.contact.phone)}">전화 상담</a>${kakaoUrl ? `<a href="${escapeHtml(kakaoUrl)}" target="_blank" rel="noopener noreferrer">카카오톡</a>` : ""}${instagramUrl ? `<a href="${escapeHtml(instagramUrl)}" target="_blank" rel="noopener noreferrer">인스타그램</a>` : ""}</div></div><div class="container footer-legal"><p>${escapeHtml(site.compliance.footerDisclaimer)}</p>${site.compliance.advertisingReviewNumber ? `<p>${escapeHtml(site.compliance.advertisingReviewNumber)}${site.compliance.advertisingReviewExpiresAt ? ` · 유효기간 ${escapeHtml(site.compliance.advertisingReviewExpiresAt)}` : ""}</p>` : ""}<p>© ${new Date().getUTCFullYear()} ${escapeHtml(site.agent.name)}. All rights reserved.</p></div></footer>`;
}

export function renderMobileCta(site: SiteConfig): string {
  const kakaoUrl = safeUrl(site.contact.kakaoUrl); const instagramUrl = safeUrl(site.contact.instagramUrl);
  return `<nav class="mobile-cta" aria-label="모바일 빠른 연락"><a href="${phoneHref(site.contact.phone)}"><span aria-hidden="true">📞</span><strong>전화</strong></a>${kakaoUrl ? `<a href="${escapeHtml(kakaoUrl)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">💬</span><strong>카카오톡</strong></a>` : ""}${instagramUrl ? `<a href="${escapeHtml(instagramUrl)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">📷</span><strong>인스타그램</strong></a>` : ""}</nav>`;
}

export function renderDemoSwitcher(site: SiteConfig): string {
  if (!site.demo?.enabled || !site.demo.allowTemplateSwitch) return "";
  const options = (Object.entries(THEME_LABELS) as Array<[TemplateId, string]>).map(([id, label]) => `<option value="${id}"${site.template === id ? " selected" : ""}>${label}</option>`).join("");
  return `<aside class="demo-switcher" data-demo-switcher><div><small>레이아웃 미리보기</small><select aria-label="테마 선택" data-template-select>${options}</select></div><button type="button" aria-label="미리보기 선택기 닫기" data-switcher-close>${icon("close", 17)}</button></aside>`;
}
export function formatIndex(index: number): string { return String(index + 1).padStart(2, "0"); }
