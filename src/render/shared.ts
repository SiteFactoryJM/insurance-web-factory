import type { SiteConfig, TemplateId, PaletteId } from "../types.js";
import { escapeHtml as e, phoneHref, safeUrl } from "../utils/html.js";
import { TEMPLATE_META, DEFAULT_TOPICS, PALETTES, paletteId } from "./design-system.js";

export const arrow = '<span aria-hidden="true">↗</span>';
export function renderHeader(site: SiteConfig): string {
  const links = `<a href="#about">설계사 소개</a><a href="#specialties">상담 분야</a>${site.sections.faq ? '<a href="#faq">자주 묻는 질문</a>' : ''}<a class="button button-small" href="#contact">상담 요청하기 ${arrow}</a>`;
  return `<a class="skip-link" href="#main">본문으로 바로가기</a>
  <header class="site-header"><div class="container header-inner">
    <a class="brand" href="/" aria-label="${e(site.agent.name)} 보험상담 홈"><span class="brand-mark" aria-hidden="true">${e(site.agent.name.slice(0,1))}</span><span><strong>${e(site.agent.name)} 보험상담</strong><span class="brand-sub">${e(site.agent.company)}</span></span></a>
    <nav class="desktop-nav" aria-label="주요 메뉴">${links}</nav>
    <div class="header-tools"><details class="mobile-menu"><summary>메뉴</summary><nav aria-label="모바일 메뉴">${links}</nav></details></div>
  </div></header>`;
}
export function renderDemoSwitcher(site: SiteConfig): string {
  if (!site.demo?.enabled || !site.demo.allowTemplateSwitch) return "";
  return `<aside class="sample-bar" aria-label="배치와 색상 조합"><div class="container sample-inner"><p><span class="badge">디자인 샘플</span> 실제 상담은 접수되지 않습니다.</p><form class="design-controls" action="/" method="get" data-design-controls><div><label for="sample-theme">배치</label><select id="sample-theme" name="theme">${(Object.entries(TEMPLATE_META) as [TemplateId, typeof TEMPLATE_META[TemplateId]][]).map(([id,m])=>`<option value="${id}"${site.template===id?' selected':''}>${e(m.name)} · ${e(m.purpose)}</option>`).join('')}</select></div><div><label for="sample-palette">색상</label><select id="sample-palette" name="palette">${(Object.entries(PALETTES) as [PaletteId, typeof PALETTES[PaletteId]][]).map(([id,p])=>`<option value="${id}"${paletteId(site)===id?' selected':''}>${e(p.name)}</option>`).join('')}</select></div><button class="button button-small" type="submit">조합 보기</button><a href="/templates">전체 비교 ${arrow}</a></form></div></aside>`;
}
export function renderSocialLinks(site: SiteConfig): string {
  if (site.demo?.enabled) return `<p class="support-note">전화·카카오톡 연결은 실제 운영 단계에서 활성화합니다.</p>`;
  const kakao = safeUrl(site.contact.kakaoUrl);
  return `<div class="secondary-links"><a href="${phoneHref(site.contact.phone)}">전화 ${e(site.contact.phone)}</a>${kakao?`<a href="${e(kakao)}" target="_blank" rel="noopener noreferrer">카카오톡 상담 (새 창)</a>`:''}</div>`;
}
export function renderContactForm(site: SiteConfig): string {
  const topics = site.consultation?.topics?.length ? site.consultation.topics : DEFAULT_TOPICS;
  return `<form class="consultation-form" data-contact-form data-submission-mode="discard" method="post" action="/#contact" novalidate autocomplete="off">
    <div class="form-intro"><span class="badge">미리보기 전용</span><p>실제 개인정보 대신 예시 정보를 입력해 주세요.<br>입력 내용은 저장하거나 전송하지 않습니다.</p></div>
    <ol class="stepper" aria-label="상담 신청 단계">${['분야 선택','상황 작성','연락 정보','최종 확인'].map((s,i)=>`<li data-step-indicator${i===0?' aria-current="step"':''}><span aria-hidden="true">${i+1}</span><span>${s}</span></li>`).join('')}</ol>
    <p class="step-status" data-step-status aria-live="polite">1 / 4단계 · 분야 선택</p>
    <fieldset data-step="0" disabled><legend><span tabindex="-1" data-step-title>어떤 상담이 필요하신가요?</span></legend><p class="field-help">가장 가까운 분야 하나를 선택해 주세요.</p><div class="topic-grid">${topics.map((topic,i)=>`<label class="topic-option"><input type="radio" name="topic" value="${e(topic)}"${i===0?' required':''}><span>${e(topic)}</span></label>`).join('')}</div></fieldset>
    <fieldset data-step="1" hidden disabled><legend><span tabindex="-1" data-step-title>궁금한 점을 알려주세요.</span></legend><p class="field-help" id="message-help">선택 항목입니다. 잘 모르겠다면 건너뛰어도 괜찮습니다.<br>주민등록번호, 병력 등 민감한 정보는 적지 마세요.</p><label for="consult-message">상담하고 싶은 내용 <span class="optional">(선택)</span></label><textarea id="consult-message" name="message" rows="4" maxlength="300" aria-describedby="message-help" placeholder="예: 가입한 보험의 보장 내용을 쉽게 설명받고 싶어요."></textarea><p class="character-count" data-character-count>0 / 300자</p></fieldset>
    <fieldset data-step="2" hidden disabled><legend><span tabindex="-1" data-step-title>어떻게 연락드리면 될까요?</span></legend><p class="field-help">화면 확인용입니다. 실제 연락은 드리지 않습니다.</p><div class="form-row"><div><label for="consult-name">이름 또는 호칭 <span class="optional">(선택)</span></label><input id="consult-name" name="name" type="text" maxlength="30" placeholder="예: 홍길동"></div><div><label for="consult-phone">휴대전화 번호 <span class="required">(필수)</span></label><input id="consult-phone" name="phone" type="tel" inputmode="tel" maxlength="13" required aria-describedby="phone-help" placeholder="010-0000-0000"><p id="phone-help" class="field-help">숫자만 입력해도 됩니다.</p></div></div>
      <fieldset class="nested-fieldset"><legend>희망 연락 방법</legend><div class="choice-row">${['전화','문자','카카오톡'].map((v,i)=>`<label><input type="radio" name="contactMethod" value="${v}"${i===0?' checked':''}><span>${v}</span></label>`).join('')}</div><p class="field-help">카카오톡 전송은 추후 연동 예정입니다.</p></fieldset>
      <label for="consult-time">희망 연락 시간 <span class="optional">(선택)</span></label><select id="consult-time" name="contactTime"><option value="일정 조율 후 결정">일정 조율 후 결정</option><option>오전</option><option>오후</option><option>저녁</option></select><p class="field-help">상담 가능 시간: ${e(site.contact.availableHours)} · 예약 확정이 아닙니다.</p>
    </fieldset>
    <fieldset data-step="3" hidden disabled><legend><span tabindex="-1" data-step-title>신청 내용을 확인해 주세요.</span></legend><p class="field-help">담당자: <strong>${e(site.agent.name)}</strong> · ${e(site.agent.company)}</p><dl class="review-summary" data-review-summary></dl><details class="privacy-disclosure"><summary>개인정보 안내 확인하기</summary><p>이 화면은 시연용으로 개인정보를 수집·저장·전송하지 않습니다. 입력값은 현재 화면에서만 사용되며 완료 또는 페이지 이탈 시 지웁니다.</p><p>실제 운영 시에는 처리 주체, 수집 목적과 항목, 보유기간, 동의 거부에 따른 영향을 확정한 후 별도로 안내해야 합니다.</p><a href="/privacy" target="_blank" rel="noopener noreferrer">개인정보 안내 자세히 보기 (새 창)</a></details><label class="consent"><input type="checkbox" name="privacyConsent" required><span>개인정보 안내를 확인했습니다. <strong>샘플 확인용이며 실제 동의·접수가 아닙니다.</strong></span></label></fieldset>
    <p class="form-error" data-form-error role="alert" tabindex="-1"></p>
    <div class="form-actions" data-form-actions><button class="button button-secondary" type="button" data-prev hidden>이전</button><button class="button" type="button" data-next disabled>다음 단계 <span aria-hidden="true">→</span></button><button class="button" type="submit" data-submit hidden disabled>상담 신청 미리보기 ${arrow}</button></div>
    <section class="demo-result" data-demo-result hidden aria-labelledby="result-title"><span class="result-mark" aria-hidden="true">✓</span><h3 id="result-title" tabindex="-1">신청 화면 체험을 마쳤습니다.</h3><p><strong>실제 상담은 접수되지 않았습니다.</strong><br>입력 정보는 저장·전송되지 않았으며,<br>전화나 카카오톡도 발송되지 않습니다.</p><button type="button" class="button button-secondary" data-restart>처음부터 다시 보기</button></section>
    <noscript><p class="form-error">이 신청 화면은 자바스크립트가 필요한 샘플입니다. 입력과 전송은 비활성화되어 있습니다.</p></noscript>
  </form>`;
}
export function renderCustomizationBand(site: SiteConfig): string {
  return site.demo?.enabled ? `<aside class="customization-band container"><div><p class="eyebrow">나에게 맞는 상담 페이지</p><h2>배치와 색상,<br>원하는 조합으로.</h2><p>다섯 가지 배치와 여섯 가지 색상을 자유롭게 조합해 보세요.</p></div><a class="button button-secondary" href="/templates">배치·색상 조합하기 ${arrow}</a></aside>` : '';
}
export function renderFooter(site: SiteConfig): string {
  return `<footer class="site-footer"><div class="container"><div class="footer-top"><div><strong>${e(site.agent.name)} 보험설계사</strong><p>${e(site.agent.company)}</p></div><a href="/privacy">개인정보처리방침</a></div><div class="footer-legal"><p>${e(site.compliance.footerDisclaimer)}</p>${site.compliance.advertisingReviewNumber?`<p>${e(site.compliance.advertisingReviewNumber)}${site.compliance.advertisingReviewExpiresAt?` · 유효기간 ${e(site.compliance.advertisingReviewExpiresAt)}`:''}</p>`:''}<p>상담 요청은 보험 가입 신청이 아닙니다. 계약 전 상품설명서와 약관을 확인해 주세요.</p><p>© ${new Date().getUTCFullYear()} ${e(site.agent.name)} · ${site.demo?.enabled?'디자인 검토용 / 검색 비노출':'보험 상담 안내'}</p></div></div></footer>`;
}
export function renderMobileCta(site: SiteConfig): string {
  return `<div class="mobile-cta" data-mobile-cta hidden><a class="button" href="#contact">${site.sections.contactForm?'상담 요청하기':'상담 방법 확인'} ${arrow}</a></div>`;
}
export function formatIndex(index: number): string { return String(index + 1).padStart(2, '0'); }
export function renderReviewNotice(): string { return '<p class="review-notice">아래 문구는 디자인 확인용 예시이며 실제 고객 후기가 아닙니다.</p>'; }
