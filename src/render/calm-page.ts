import type { SiteConfig } from "../types.js";
import { escapeHtml as e, safeUrl } from "../utils/html.js";
import { arrow, formatIndex, renderContactForm, renderReviewNotice, renderSocialLinks } from "./shared.js";

import { responsiveCopy as copy } from "./copy.js";

function portrait(site: SiteConfig): string {
  return `<figure class="portrait"><img src="${e(site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${e(site.agent.name)} 보험설계사 프로필" width="600" height="800" fetchpriority="high"><figcaption><span>${e(site.agent.company)}</span><strong>${e(site.agent.name)} <span>${e(site.agent.title)}</span></strong></figcaption></figure>`;
}
function hero(site: SiteConfig): string {
  const heroCopy = `<div class="hero-copy"><p class="eyebrow"><span class="small-line" aria-hidden="true"></span>${e(site.hero.eyebrow || '보험을 이해하는 시간')}</p><h1 id="hero-title">${copy(site.hero.headline, site.hero.mobileHeadline)}</h1><p class="hero-description">${copy(site.hero.subheadline, site.hero.mobileSubheadline)}</p><div class="hero-actions"><a class="button" href="#contact">${e(site.hero.primaryCtaLabel)} ${arrow}</a><a class="text-link" href="#specialties">${e(site.hero.secondaryCtaLabel)} <span aria-hidden="true">↓</span></a></div><p class="hero-note">상담 요청은 보험 가입 신청이 아닙니다.</p></div>`;
  const open = (kind: string) => `<section class="hero container ${kind}" id="home" aria-labelledby="hero-title">`;
  switch(site.template) {
    case 'warm-care':
      return `${open('hero-editorial')}${portrait(site)}<div class="editorial-story">${heroCopy}${site.intro.philosophy?`<blockquote class="hero-quote">“${e(site.intro.philosophy)}”</blockquote>`:''}</div></section>`;
    case 'premium-navy':
      return `${open('hero-premium')}${heroCopy}${portrait(site)}<div class="hero-criteria"><p>가입 전 확인할 기준</p><a href="${site.templateContent?.[site.template]?.focus?.length?'#focus':'#specialties'}">01 보장 범위</a><a href="${site.templateContent?.[site.template]?.focus?.length?'#focus':'#specialties'}">02 유지할 예산</a><a href="${site.templateContent?.[site.template]?.focus?.length?'#focus':'#specialties'}">03 계약 조건</a></div></section>`;
    case 'clean-minimal':
      return `${open('hero-report')}${heroCopy}<aside class="report-identity" aria-label="상담 담당자">${portrait(site)}</aside><dl class="report-summary"><div><dt>상담 담당</dt><dd>${e(site.agent.name)}</dd></div><div><dt>상담 가능 시간</dt><dd>${e(site.contact.availableHours)}</dd></div><div><dt>상담 시작</dt><dd>질문 정리부터</dd></div></dl></section>`;
    case 'local-friendly': {
      const topics=site.consultation?.topics || [];
      return `${open('hero-concierge')}<div class="concierge-person">${portrait(site)}<p>${e(site.contact.availableHours)}<br>상담 가능 시간</p></div>${heroCopy}<nav class="quick-topics" aria-label="상담 시작 주제">${topics.slice(0,3).map((topic,i)=>`<a href="#contact" data-start-topic="${e(topic)}"><span class="topic-number">0${i+1}</span><span>${e(topic)}</span>${arrow}</a>`).join('')}</nav></section>`;
    }
    default:
      return `${open('hero-corporate')}${heroCopy}<div class="corporate-profile">${portrait(site)}<p class="profile-caption">${e(site.agent.company)} · 상담 가능 ${e(site.contact.availableHours)}</p></div></section>`;
  }
}
function focus(site: SiteConfig): string {
  const content=site.templateContent?.[site.template];
  if(!content?.focus?.length)return '';
  return `<section class="section container focus-section" id="focus" aria-labelledby="focus-title"><div class="section-heading"><div><p class="eyebrow">상담 전 살펴보기</p><h2 id="focus-title">${e(content.focusTitle || '선택 전에 확인할 내용')}</h2></div></div><div class="focus-grid">${content.focus.map((card,i)=>`<article><span class="section-index">${formatIndex(i)}</span><h3>${e(card.title)}</h3><p>${copy(card.body, card.mobileBody)}</p></article>`).join('')}</div></section>`;
}
function services(site: SiteConfig): string {
  return `<section class="section container" id="specialties" aria-labelledby="services-title"><div class="section-heading"><div><p class="eyebrow">상담할 수 있는 내용</p><h2 id="services-title">${site.template==='clean-minimal'?'확인할 항목을 한눈에.':site.template==='premium-navy'?'가입 전에 비교할 내용.':site.template==='local-friendly'?'상담 주제를 선택하세요.':'상담 분야를 확인하세요.'}</h2></div><p>상품을 잘 몰라도 괜찮습니다.<br>지금 궁금한 것부터 시작하세요.</p></div><div class="service-grid">${site.specialties.map((s,i)=>`<article class="service-card"><span class="section-index" aria-hidden="true">${formatIndex(i)}</span><h3>${e(s.title)}</h3><p>${copy(s.body, s.mobileBody)}</p></article>`).join('')}</div></section>`;
}
function about(site: SiteConfig): string {
  return `<section class="section about-section" id="about" aria-labelledby="about-title"><div class="container about-grid"><div><p class="eyebrow">상담자를 소개합니다</p><h2 id="about-title">${copy(site.intro.title, site.intro.mobileTitle)}</h2>${site.intro.philosophy?`<p class="philosophy">“${e(site.intro.philosophy)}”</p>`:''}<dl class="agent-facts"><div><dt>상담 담당</dt><dd>${e(site.agent.name)} · ${e(site.agent.title)}</dd></div><div><dt>소속</dt><dd>${e(site.agent.company)} ${e(site.agent.branch || '')}</dd></div>${site.agent.registrationNumber?`<div><dt>등록번호</dt><dd>${e(site.agent.registrationNumber)}</dd></div>`:''}<div><dt>상담 시간</dt><dd>${e(site.contact.availableHours)}</dd></div></dl></div><div class="about-copy"><p>${copy(site.intro.body, site.intro.mobileBody)}</p>${site.sections.career&&site.career.length?`<ul class="career-list">${site.career.map(c=>`<li>${e(c)}</li>`).join('')}</ul>`:''}<div class="principle-note"><strong>이해한 뒤 선택할 수 있도록.</strong><p>${e(site.hero.trustNote || '선택에 필요한 내용을 차분하고 명확하게 설명합니다.')}</p></div></div></div></section>`;
}
function process(site: SiteConfig): string {
  if(!site.sections.process || !site.process.length) return '';
  return `<section class="section container" id="process" aria-labelledby="process-title"><div class="section-heading"><div><p class="eyebrow">상담 진행 안내</p><h2 id="process-title">${copy("상담은 이 순서로 진행합니다.", "상담, 이렇게 진행해요.")}</h2></div><p>원하는 내용을 확인하고,<br>연락을 통해 일정을 조율합니다.</p></div><ol class="process-grid">${site.process.map((p,i)=>`<li><span class="process-number">${formatIndex(i)}</span><h3>${e(p.title)}</h3><p>${copy(p.body, p.mobileBody)}</p></li>`).join('')}</ol></section>`;
}
function reviews(site: SiteConfig): string {
  if(!site.sections.reviews || site.template==='clean-minimal') return '';
  const items=(site.reviews||[]).filter(r=>site.demo?.enabled || !r.isExample);
  if(!items.length) return '';
  return `<section class="section container" id="reviews" aria-labelledby="reviews-title"><div class="section-heading"><div><p class="eyebrow">${items.some(r=>r.isExample)?'후기 영역 · 제안용 예시':'고객 후기'}</p><h2 id="reviews-title">${copy("상담에서 중요했던 순간들.", "상담에서 듣고 싶은 말.")}</h2></div></div>${items.some(r=>r.isExample)?renderReviewNotice():''}<div class="review-grid">${items.map(r=>`<figure class="review-card">${r.isExample?'<span class="badge">디자인 예시 · 실제 후기 아님</span>':''}<blockquote>${e(r.quote)}</blockquote><figcaption>${e(r.author)}${r.context?` · ${e(r.context)}`:''}</figcaption></figure>`).join('')}</div></section>`;
}
function faq(site: SiteConfig): string {
  if(!site.sections.faq || !site.faqs.length) return '';
  const heading=`<div><p class="eyebrow">자주 묻는 질문</p><h2 id="faq-title">${site.template==='clean-minimal'?'궁금한 점, 짧게 정리합니다.':'상담 전,<br>확인할 질문.'}</h2></div>`;
  const body = `<div class="faq-list">${site.faqs.map((f,i)=>`<details><summary><span class="faq-question"><span class="faq-number" aria-hidden="true">${formatIndex(i)}</span>${e(f.question)}</span><span aria-hidden="true">+</span></summary><p>${copy(f.answer, f.mobileAnswer)}</p></details>`).join('')}</div>`;
  return `<section class="section container faq-section" id="faq" aria-labelledby="faq-title">${heading}${body}</section>`;
}
function contact(site: SiteConfig): string {
  return `<section class="section contact-section" id="contact" aria-labelledby="contact-title"><div class="container contact-grid"><div class="contact-copy"><p class="eyebrow">상담 준비 · 샘플</p><h2 id="contact-title">${copy("궁금한 내용을 정리하면,\n상담이 쉬워집니다.", "어떤 점이 궁금하세요?")}</h2><p>${copy("상담 주제를 고르고 필요한 내용을 알려주세요. 마지막 단계에서 다시 확인할 수 있습니다.", "주제를 고르고, 마지막에 확인하세요.")}</p><div class="contact-person"><img src="${e(site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${e(site.agent.name)} 보험설계사 프로필" width="72" height="72" loading="lazy"><div><strong>${e(site.agent.name)} 보험설계사</strong><span>${e(site.agent.company)}</span></div></div><p class="support-note">이 페이지는 디자인 검토용입니다.<br>상담료와 실제 취급 범위는 운영 전 확정합니다.</p>${renderSocialLinks(site)}</div>${site.sections.contactForm?renderContactForm(site):'<div class="notice-card"><h3>상담 신청을 준비하고 있습니다.</h3><p>현재 페이지에서는 상담을 접수하지 않습니다.</p></div>'}</div></section>`;
}
export function renderCalmPage(site: SiteConfig): string {
  const modules={ services:services(site), about:about(site), process:process(site), reviews:reviews(site), faq:faq(site), contact:contact(site), focus:focus(site) };
  const order: Record<SiteConfig['template'], (keyof typeof modules)[]> = {
    'trust-blue':['services','about','process','reviews','faq','contact'],
    'warm-care':['about','focus','reviews','services','faq','process','contact'],
    'premium-navy':['focus','services','process','about','faq','contact','reviews'],
    'clean-minimal':['focus','services','process','faq','about','contact'],
    'local-friendly':['services','contact','focus','faq','about','process','reviews'],
  };
  const location=site.sections.location && site.contact.officeAddress ? `<section class="section container"><h2>찾아오시는 길</h2><p>${e(site.contact.officeAddress)}</p>${safeUrl(site.contact.mapUrl)?`<a href="${e(safeUrl(site.contact.mapUrl))}" target="_blank" rel="noopener noreferrer">지도 확인 (새 창)</a>`:''}</section>` : '';
  const trust=site.template==='trust-blue'?'<div class="container trust-strip"><p>상황을 먼저 듣습니다</p><p>쉬운 말로 설명합니다</p><p>충분히 생각할 시간을 드립니다</p></div>':'';
  return `<main id="main" tabindex="-1">${hero(site)}${trust}${order[site.template].filter(key=>modules[key]).map((key,index)=>`<div class="section-band ${key==='reviews'?'band-dark':index%2?'band-tint':'band-white'}">${modules[key]}</div>`).join('')}${location}</main>`;
}
