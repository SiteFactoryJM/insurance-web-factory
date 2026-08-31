import type { SiteConfig } from "../types.js";
import { escapeHtml, nl2br, phoneHref, safeUrl } from "../utils/html.js";
import { icon } from "../utils/icons.js";

export function renderHeader(site: SiteConfig): string {
  return `<header class="site-header" data-header>
    <div class="container header-inner">
      <a class="brand" href="#home" aria-label="홈으로 이동">
        ${site.agent.logoImage ? `<img src="${escapeHtml(site.agent.logoImage)}" alt="" width="36" height="36">` : `<span class="brand-mark">${escapeHtml(site.agent.name.slice(0, 1))}</span>`}
        <span><strong>${escapeHtml(site.agent.name)}</strong><small>${escapeHtml(site.agent.title)}</small></span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" data-nav-toggle><span class="sr-only">메뉴 열기</span>${icon("menu")}</button>
      <nav class="main-nav" id="main-nav" aria-label="주요 메뉴" data-nav>
        <a href="#about">소개</a><a href="#specialties">상담 분야</a>${site.sections.process ? '<a href="#process">상담 절차</a>' : ""}${site.sections.faq ? '<a href="#faq">자주 묻는 질문</a>' : ""}<a class="nav-cta" href="#contact">상담 문의</a>
      </nav>
    </div>
  </header>`;
}

export function renderActions(site: SiteConfig): string {
  return `<div class="hero-actions">
    <a class="button button-primary" href="#contact">${icon("message", 20)}${escapeHtml(site.hero.primaryCtaLabel)}</a>
    <a class="button button-secondary" href="${phoneHref(site.contact.phone)}">${icon("phone", 20)}${escapeHtml(site.hero.secondaryCtaLabel)}</a>
  </div>`;
}

export function renderProfile(site: SiteConfig): string {
  const regions = site.agent.regions.slice(0, 3).map((region) => `<span>${escapeHtml(region)}</span>`).join("");
  return `<aside class="profile-card reveal" aria-label="설계사 프로필">
    <div class="profile-photo-wrap">
      <img class="profile-photo" src="${escapeHtml(site.agent.profileImage)}" alt="${escapeHtml(site.agent.name)} ${escapeHtml(site.agent.title)} 프로필" width="720" height="900">
      <span class="profile-status"><i></i>상담 가능</span>
    </div>
    <div class="profile-info">
      <p>${escapeHtml(site.agent.company)}${site.agent.branch ? ` · ${escapeHtml(site.agent.branch)}` : ""}</p>
      <h2>${escapeHtml(site.agent.name)} <small>${escapeHtml(site.agent.title)}</small></h2>
      <div class="region-tags">${regions}</div>
      <dl class="profile-meta">
        ${site.agent.careerYears ? `<div><dt>상담 경력</dt><dd>${site.agent.careerYears}년</dd></div>` : ""}
        <div><dt>상담 방식</dt><dd>대면 · 비대면</dd></div>
      </dl>
    </div>
  </aside>`;
}

function sectionHeading(kicker: string, title: string, description?: string): string {
  return `<div class="section-heading reveal"><p class="section-kicker">${escapeHtml(kicker)}</p><h2>${escapeHtml(title)}</h2>${description ? `<p>${escapeHtml(description)}</p>` : ""}</div>`;
}

export function renderIntro(site: SiteConfig): string {
  return `<section class="section intro-section" id="about"><div class="container intro-grid">
    ${sectionHeading("ABOUT", site.intro.title)}
    <div class="intro-body reveal"><p>${nl2br(site.intro.body)}</p>${site.intro.philosophy ? `<blockquote>${icon("shield", 24)}<span><small>상담 원칙</small>${escapeHtml(site.intro.philosophy)}</span></blockquote>` : ""}</div>
  </div></section>`;
}

export function renderSpecialties(site: SiteConfig): string {
  const cards = site.specialties.map((item, index) => `<article class="specialty-card reveal"><span class="card-number">${String(index + 1).padStart(2, "0")}</span><div class="card-icon">${icon(index === 0 ? "shield" : index === 1 ? "person" : index === 2 ? "check" : "message")}</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`).join("");
  return `<section class="section section-muted" id="specialties"><div class="container">${sectionHeading("CONSULTING", "필요한 부분을 함께 살펴봅니다.", "일방적인 권유보다 현재 상황을 이해하는 것부터 시작합니다.")}<div class="specialty-grid">${cards}</div></div></section>`;
}

export function renderProcess(site: SiteConfig): string {
  if (!site.sections.process || !site.process.length) return "";
  const steps = site.process.map((item, index) => `<li class="process-item reveal"><span>${index + 1}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></div></li>`).join("");
  return `<section class="section process-section" id="process"><div class="container">${sectionHeading("PROCESS", "부담 없이 시작하는 상담 과정", "신청부터 사후 점검까지 순서대로 안내합니다.")}<ol class="process-list">${steps}</ol></div></section>`;
}

export function renderCareer(site: SiteConfig): string {
  if (!site.sections.career || !site.career.length) return "";
  const rows = site.career.map((item) => `<li>${icon("check", 18)}<span>${escapeHtml(item)}</span></li>`).join("");
  return `<section class="section career-section"><div class="container career-grid">${sectionHeading("EXPERIENCE", "차곡차곡 쌓아온 상담 경험")}<div class="career-card reveal"><ul>${rows}</ul>${site.agent.registrationNumber ? `<p class="registration">등록번호 ${escapeHtml(site.agent.registrationNumber)}</p>` : ""}</div></div></section>`;
}

export function renderFaq(site: SiteConfig): string {
  if (!site.sections.faq || !site.faqs.length) return "";
  const items = site.faqs.map((item, index) => `<details class="faq-item reveal"${index === 0 ? " open" : ""}><summary><span>Q</span>${escapeHtml(item.question)}${icon("chevron", 20)}</summary><div class="faq-answer"><span>A</span><p>${escapeHtml(item.answer)}</p></div></details>`).join("");
  return `<section class="section section-muted" id="faq"><div class="container faq-grid">${sectionHeading("FAQ", "상담 전 자주 묻는 질문", "궁금한 점을 먼저 확인해 보세요.")}<div class="faq-list">${items}</div></div></section>`;
}

export function renderLocation(site: SiteConfig): string {
  if (!site.sections.location || (!site.contact.officeAddress && !site.contact.availableHours)) return "";
  const mapUrl = safeUrl(site.contact.mapUrl);
  return `<section class="section location-section"><div class="container location-card reveal"><div><p class="section-kicker">CONTACT INFO</p><h2>편한 방법으로 연락해 주세요.</h2><p>상담 가능 시간과 위치를 확인하고 방문 전 일정을 예약해 주세요.</p></div><dl>
    ${site.contact.officeAddress ? `<div>${icon("map", 22)}<span><dt>상담 장소</dt><dd>${escapeHtml(site.contact.officeAddress)}${mapUrl ? `<a href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener">지도 보기 ${icon("arrow", 16)}</a>` : ""}</dd></span></div>` : ""}
    <div>${icon("clock", 22)}<span><dt>상담 가능 시간</dt><dd>${escapeHtml(site.contact.availableHours)}</dd></span></div>
    ${site.contact.email ? `<div>${icon("mail", 22)}<span><dt>이메일</dt><dd><a href="mailto:${escapeHtml(site.contact.email)}">${escapeHtml(site.contact.email)}</a></dd></span></div>` : ""}
  </dl></div></section>`;
}

export function renderContact(site: SiteConfig): string {
  const kakaoUrl = safeUrl(site.contact.kakaoUrl);
  return `<section class="section contact-section" id="contact"><div class="container contact-grid">
    <div class="contact-copy reveal"><p class="section-kicker">CONSULTATION</p><h2>지금 궁금한 점부터<br>편하게 이야기해 주세요.</h2><p>상담 신청을 남기면 확인 후 연락드립니다. 가입 여부는 충분히 검토한 뒤 결정할 수 있습니다.</p><div class="direct-contact"><a href="${phoneHref(site.contact.phone)}">${icon("phone", 22)}<span><small>전화 상담</small><strong>${escapeHtml(site.contact.phone)}</strong></span></a>${kakaoUrl ? `<a href="${escapeHtml(kakaoUrl)}" target="_blank" rel="noopener">${icon("message", 22)}<span><small>카카오톡</small><strong>채팅으로 문의</strong></span></a>` : ""}</div></div>
    ${site.sections.contactForm ? renderContactForm(site) : ""}
  </div></section>`;
}

function renderContactForm(site: SiteConfig): string {
  return `<form class="contact-form reveal" data-contact-form novalidate>
    <input type="hidden" name="siteId" value="${escapeHtml(site.id)}">
    <label class="honeypot" aria-hidden="true">회사명<input name="companyWebsite" tabindex="-1" autocomplete="off"></label>
    <div class="form-row"><label>이름<span aria-hidden="true">*</span><input type="text" name="name" autocomplete="name" required maxlength="30" placeholder="성함을 입력해 주세요"></label><label>연락처<span aria-hidden="true">*</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" required maxlength="15" placeholder="010-0000-0000"></label></div>
    <label>상담 희망 내용<textarea name="message" rows="4" maxlength="500" placeholder="궁금한 내용을 간단히 적어 주세요."></textarea></label>
    <label class="consent"><input type="checkbox" name="privacyConsent" value="true" required><span>개인정보 수집·이용에 동의합니다. <a href="/privacy" target="_blank">내용 보기</a></span></label>
    <button class="button button-primary button-block" type="submit"><span>상담 신청하기</span>${icon("arrow", 20)}</button>
    <p class="form-status" role="status" aria-live="polite" data-form-status>${site.demo?.enabled ? "데모 페이지에서는 입력 내용이 저장되지 않습니다." : ""}</p>
  </form>`;
}

export function renderCustomizationBand(site: SiteConfig): string {
  if (!site.demo?.enabled) return "";
  return `<aside class="customization-band"><div class="container"><div><span>DEMO</span><strong>문구·색상·구성·사진은 설계사별로 변경할 수 있습니다.</strong></div><a href="/templates">5가지 디자인 보기 ${icon("arrow", 18)}</a></div></aside>`;
}

export function renderFooter(site: SiteConfig): string {
  return `<footer class="site-footer"><div class="container footer-main"><div class="footer-brand"><strong>${escapeHtml(site.agent.name)}</strong><span>${escapeHtml(site.agent.title)} · ${escapeHtml(site.agent.company)}</span></div><div class="footer-links"><a href="/privacy">개인정보처리방침</a><a href="${phoneHref(site.contact.phone)}">상담 연락처</a></div></div><div class="container footer-legal"><p>${escapeHtml(site.compliance.footerDisclaimer)}</p>${site.compliance.advertisingReviewNumber ? `<p>${escapeHtml(site.compliance.advertisingReviewNumber)}${site.compliance.advertisingReviewExpiresAt ? ` · 유효기간 ${escapeHtml(site.compliance.advertisingReviewExpiresAt)}` : ""}</p>` : ""}<p>© ${new Date().getUTCFullYear()} ${escapeHtml(site.agent.name)}. All rights reserved.</p></div></footer>`;
}

export function renderMobileCta(site: SiteConfig): string {
  return `<nav class="mobile-cta" aria-label="빠른 상담"><a href="${phoneHref(site.contact.phone)}">${icon("phone", 20)}전화</a><a class="mobile-cta-primary" href="#contact">${icon("message", 20)}상담 신청</a></nav>`;
}

export function renderDemoSwitcher(site: SiteConfig): string {
  if (!site.demo?.enabled || !site.demo.allowTemplateSwitch) return "";
  const options = [
    ["trust-blue", "신뢰 블루"], ["warm-care", "따뜻한 케어"], ["premium-navy", "프리미엄 네이비"], ["clean-minimal", "클린 미니멀"], ["local-friendly", "지역 친화"]
  ].map(([value, label]) => `<option value="${value}"${site.template === value ? " selected" : ""}>${label}</option>`).join("");
  return `<div class="demo-switcher" data-demo-switcher><label><span>디자인 체험</span><select aria-label="템플릿 선택" data-template-select>${options}</select></label><button type="button" data-switcher-close aria-label="디자인 체험 닫기">${icon("close", 18)}</button></div>`;
}
