import type { SiteConfig } from "../types.js";
import { escapeHtml as e, safeUrl } from "../utils/html.js";
import { arrow, formatIndex, renderContactForm, renderReviewNotice, renderSocialLinks } from "./shared.js";

function portrait(site: SiteConfig): string {
  return `<figure class="portrait"><img src="${e(site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${e(site.agent.name)} 보험설계사 프로필" width="600" height="800" fetchpriority="high"><figcaption><span>${e(site.agent.company)}</span><strong>${e(site.agent.name)} <span>${e(site.agent.title)}</span></strong></figcaption></figure>`;
}
function hero(site: SiteConfig): string {
  const action = `<div class="hero-actions"><a class="button" href="#contact">상담 요청하기 ${arrow}</a><a class="text-link" href="#specialties">상담할 수 있는 내용 <span aria-hidden="true">↓</span></a></div><p class="hero-note">상담 요청은 보험 가입 신청이 아닙니다.</p>`;
  const topicLinks = site.template === 'local-friendly' ? `<div class="quick-topics" aria-label="상담 시작 주제"><a href="#contact" data-start-topic="실손·건강보험">가입한 보험 점검 ${arrow}</a><a href="#contact" data-start-topic="기타 / 아직 잘 모르겠어요">새 보험 가입 상담 ${arrow}</a><a href="#contact" data-start-topic="기타 / 아직 잘 모르겠어요">무엇부터 물어볼지 모르겠어요 ${arrow}</a></div>` : '';
  const headline = site.template==='premium-navy' ? '새 보험을 준비할 때,\n필요한 보장부터 살펴보세요.' : site.template==='clean-minimal' ? '내 보험,\n차근차근 이해해 보세요.' : site.template==='local-friendly' ? '보험에 대한 궁금한 점,\n편하게 물어보세요.' : site.hero.headline;
  return `<section class="hero container" id="home" aria-labelledby="hero-title"><div class="hero-copy"><p class="eyebrow"><span class="small-line" aria-hidden="true"></span>${e(site.hero.eyebrow || '보험을 이해하는 시간')}</p><p class="mobile-identity">${e(site.agent.name)} 보험설계사 · ${e(site.agent.company)}</p><h1 id="hero-title">${e(headline).replace(/\n/g,'<br>')}</h1><p class="hero-description">${e(site.hero.subheadline)}</p>${topicLinks}${action}</div>${portrait(site)}</section>`;
}
function services(site: SiteConfig): string {
  return `<section class="section container" id="specialties" aria-labelledby="services-title"><div class="section-heading"><div><p class="eyebrow">상담할 수 있는 내용</p><h2 id="services-title">이런 고민, 함께 정리해요.</h2></div><p>상품을 잘 몰라도 괜찮습니다.<br>지금 궁금한 것부터 시작하세요.</p></div><div class="service-grid">${site.specialties.map((s,i)=>`<article class="service-card"><span class="section-index" aria-hidden="true">${formatIndex(i)}</span><h3>${e(s.title)}</h3><p>${e(s.body)}</p></article>`).join('')}</div></section>`;
}
function about(site: SiteConfig): string {
  return `<section class="section about-section" id="about" aria-labelledby="about-title"><div class="container about-grid"><div><p class="eyebrow">상담자를 소개합니다</p><h2 id="about-title">${e(site.intro.title)}</h2>${site.intro.philosophy?`<p class="philosophy">“${e(site.intro.philosophy)}”</p>`:''}<dl class="agent-facts"><div><dt>상담 담당</dt><dd>${e(site.agent.name)} · ${e(site.agent.title)}</dd></div><div><dt>소속</dt><dd>${e(site.agent.company)} ${e(site.agent.branch || '')}</dd></div>${site.agent.registrationNumber?`<div><dt>등록번호</dt><dd>${e(site.agent.registrationNumber)}</dd></div>`:''}<div><dt>상담 시간</dt><dd>${e(site.contact.availableHours)}</dd></div></dl></div><div class="about-copy">${site.intro.body.split(/\n\n/).filter(Boolean).map(p=>`<p>${e(p)}</p>`).join('')}${site.sections.career&&site.career.length?`<ul class="career-list">${site.career.map(c=>`<li>${e(c)}</li>`).join('')}</ul>`:''}<div class="principle-note"><strong>이해한 뒤 선택할 수 있도록.</strong><p>${e(site.hero.trustNote || '선택에 필요한 내용을 차분하고 명확하게 설명합니다.')}</p></div></div></div></section>`;
}
function process(site: SiteConfig): string {
  if(!site.sections.process || !site.process.length) return '';
  return `<section class="section container" id="process" aria-labelledby="process-title"><div class="section-heading"><div><p class="eyebrow">상담 진행 안내</p><h2 id="process-title">신청 후에는 이렇게 진행돼요.</h2></div><p>원하는 내용을 확인하고,<br>연락을 통해 일정을 조율합니다.</p></div><ol class="process-grid">${site.process.map((p,i)=>`<li><span class="process-number">${formatIndex(i)}</span><h3>${e(p.title)}</h3><p>${e(p.body)}</p></li>`).join('')}</ol></section>`;
}
function reviews(site: SiteConfig): string {
  if(!site.sections.reviews || site.template==='clean-minimal') return '';
  const items=(site.reviews||[]).filter(r=>site.demo?.enabled || !r.isExample);
  if(!items.length) return '';
  return `<section class="section container" id="reviews" aria-labelledby="reviews-title"><div class="section-heading"><div><p class="eyebrow">${items.some(r=>r.isExample)?'후기 영역 · 제안용 예시':'고객 후기'}</p><h2 id="reviews-title">상담에서 중요했던 순간들.</h2></div></div>${items.some(r=>r.isExample)?renderReviewNotice():''}<div class="review-grid">${items.map(r=>`<figure class="review-card">${r.isExample?'<span class="badge">디자인 예시 · 실제 후기 아님</span>':''}<blockquote>${e(r.quote)}</blockquote><figcaption>${e(r.author)}${r.context?` · ${e(r.context)}`:''}</figcaption></figure>`).join('')}</div></section>`;
}
function faq(site: SiteConfig): string {
  if(!site.sections.faq || !site.faqs.length) return '';
  return `<section class="section container faq-section" id="faq" aria-labelledby="faq-title"><div><p class="eyebrow">자주 묻는 질문</p><h2 id="faq-title">미리 알아두면<br>더 편안한 상담.</h2><p>궁금한 내용을 눌러 확인해 보세요.</p></div><div class="faq-list">${site.faqs.map(f=>`<details><summary>${e(f.question)}<span aria-hidden="true">+</span></summary><p>${e(f.answer)}</p></details>`).join('')}</div></section>`;
}
function contact(site: SiteConfig): string {
  return `<section class="section contact-section" id="contact" aria-labelledby="contact-title"><div class="container contact-grid"><div class="contact-copy"><p class="eyebrow">무료 상담 신청 · 샘플</p><h2 id="contact-title">혼자 고민하지 말고,<br>하나씩 물어보세요.</h2><p>간단한 내용을 남기는 것부터 시작합니다.<br>마지막 단계에서 다시 확인할 수 있어요.</p><div class="contact-person"><img src="${e(site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="" width="72" height="72" loading="lazy"><div><strong>${e(site.agent.name)} 보험설계사</strong><span>${e(site.agent.company)}</span></div></div><p class="support-note">이 페이지는 디자인 검토용입니다.<br>상담료와 실제 취급 범위는 운영 전 확정합니다.</p>${renderSocialLinks(site)}</div>${site.sections.contactForm?renderContactForm(site):'<div class="notice-card"><h3>상담 신청을 준비하고 있습니다.</h3><p>현재 페이지에서는 상담을 접수하지 않습니다.</p></div>'}</div></section>`;
}
export function renderCalmPage(site: SiteConfig): string {
  // Content-light variant must remain convincing without invented credentials or reviews.
  const introFirst = site.template === 'warm-care';
  const location = site.sections.location && site.contact.officeAddress ? `<section class="section container"><h2>찾아오시는 길</h2><p>${e(site.contact.officeAddress)}</p>${safeUrl(site.contact.mapUrl)?`<a href="${e(safeUrl(site.contact.mapUrl))}" target="_blank" rel="noopener noreferrer">지도 확인 (새 창)</a>`:''}</section>` : '';
  return `<main id="main" tabindex="-1">${hero(site)}<div class="container trust-strip"><p>상황을 먼저 듣습니다</p><p>쉬운 말로 설명합니다</p><p>충분히 생각할 시간을 드립니다</p></div>${introFirst?about(site):''}${services(site)}${contact(site)}${introFirst?'':about(site)}${process(site)}${reviews(site)}${faq(site)}${location}</main>`;
}
