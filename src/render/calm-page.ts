import type { DesignSectionId, SiteConfig } from '../types.js';
import { escapeHtml as e, safeUrl } from '../utils/html.js';
import { responsiveCopy as copy } from './copy.js';
import { getDesign } from './design-system.js';
import { formatIndex, renderContactButtons, renderContactForm } from './shared.js';
import { directPhoneHref } from '../utils/contact-links.js';
import { icon } from '../utils/icons.js';

const profile = (site: SiteConfig, className = '', eager = false) => `<img class="${className}" src="${e(site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${e(site.agent.name || '담당자')} 프로필" width="600" height="800" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

/**
 * CH2/Navy/Agent Details. 이름·소속·전화·상담 시간을 한 덩어리로 보여 주는
 * Figma 컴포넌트입니다. 전화번호는 링크가 가능할 때만 `tel:`로 연결합니다.
 */
function adviserCard(site: SiteConfig): string {
  const phone = directPhoneHref(site.contact.phone);
  const number = e(site.contact.phone || '연락처 확인 필요');
  return `<div class="adviser-card"><div class="adviser-details"><p class="adviser-role">담당 설계사</p><p class="adviser-name">${e(site.agent.name || '담당자 이름')}</p><p class="adviser-org">${e(site.agent.company || '소속 확인 필요')} · ${e(site.agent.title || '보험설계사')}</p>${phone ? `<a class="adviser-phone" data-contact-link="phone" href="${e(phone)}">${number}</a>` : `<p class="adviser-phone">${number}</p>`}<p class="adviser-hours">상담 시간 ${e(site.contact.availableHours || '담당자에게 확인')}</p></div></div>`;
}
const heading = (kicker: string, title: string, mobile?: string, description = '') => `<div class="section-heading"><p class="eyebrow">${e(kicker)}</p><h2>${copy(naturalHeading(title), naturalHeading(mobile))}</h2>${description ? `<p class="section-support">${e(description)}</p>` : ''}</div>`;

function naturalHeading(value?: string): string {
  return (value || '').replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

const BRAND_PRESENTATION_COPY = {
  'soft-panel': {
    tagline: '사람을 먼저 생각하는 보험의 기준, 해온',
    subline: 'LIFE INSURANCE FOR A BRIGHTER TOMORROW',
  },
  'gold-wave': {
    tagline: '당신의 오늘이 더 나은 내일이 되도록',
    subline: 'LIFE, ALWAYS WITH YOU',
  },
  watermark: {
    tagline: '',
    subline: '',
  },
} as const;

function heroBrandFeature(site: SiteConfig): string {
  const layout = site.hero.brandLayout || 'soft-panel';
  const fallback = BRAND_PRESENTATION_COPY[layout] || BRAND_PRESENTATION_COPY['soft-panel'];
  const tagline = site.hero.brandTagline?.trim() || fallback.tagline;
  const subline = site.hero.brandSubline?.trim() || fallback.subline;
  const logo = site.agent.logoImage?.trim() || '';
  const mark = site.agent.logoMarkImage?.trim() || logo;
  if (layout === 'watermark') {
    return '<div class="hero-brand-feature hero-brand-watermark" data-brand-layout="watermark" aria-hidden="true"></div>';
  }
  if (!logo && !mark) return '';
  const featureClass = layout === 'gold-wave' ? 'hero-brand-gold-wave' : 'hero-brand-soft-panel';
  return `<div class="hero-brand-feature ${featureClass}" data-brand-layout="${e(layout)}"><div class="brand-panel-logo"><img src="${e(logo || mark)}" alt="${e(site.agent.company || '소속')} 로고"></div><span class="brand-panel-divider" aria-hidden="true"></span><div class="brand-panel-copy">${tagline ? `<p>${e(tagline)}</p>` : ''}${subline ? `<span>${e(subline)}</span>` : ''}</div><span class="brand-panel-wave" aria-hidden="true"></span></div>`;
}

function hero(site: SiteConfig): string {
  const design = getDesign(site);
  const pattern = design.hero;
  const coreTopics = site.specialties.slice(0, 3).map(item => ({ label: item.title, tone: 'base' }));
  const extraTopics = [
    { label: '청구서비스', tone: 'base' },
    { label: '청구 금액 확인', tone: 'base' },
    { label: '부지급된 보험금 확인', tone: 'base' },
    { label: '자동차사고', tone: 'base' },
    { label: '배상책임사고', tone: 'base' },
  ];
  const topicChips = [...coreTopics, ...extraTopics].map(item => `<span class="topic-chip topic-${item.tone}">${e(item.label)}</span>`).join('');
  const brandLayout = site.hero.brandLayout || 'soft-panel';
  const heroBrand = heroBrandFeature(site);
  const eyebrow = `<p class="eyebrow"><span class="small-line" aria-hidden="true"></span>${e(site.hero.eyebrow || '보험 상담 안내')}</p>`;
  const title = `<h1 id="hero-title">${copy(naturalHeading(site.hero.headline || '가입한 보험, 무엇부터 확인할까요?'), naturalHeading(site.hero.mobileHeadline))}</h1>`;
  const brandLead = brandLayout === 'watermark' ? `<div class="hero-watermark-zone">${heroBrand}${eyebrow}${title}</div>` : `${heroBrand}${eyebrow}${title}`;
  const lead = `<div class="hero-copy hero-copy-brand-${e(brandLayout)}">${brandLead}<p class="hero-description">${copy(site.hero.subheadline, site.hero.mobileSubheadline)}</p>${topicChips ? `<div class="hero-topics" aria-label="주요 상담 분야">${topicChips}</div>` : ''}<div class="hero-actions">${renderContactButtons(site)}</div><p class="hero-note">상담은 가입 신청과 별개입니다.${site.hero.trustNote ? ` ${e(site.hero.trustNote)}` : ''}</p></div>`;
  let visual: string;
  if (pattern === 'editorial') {
    visual = `<div class="hero-visual"><figure class="hero-scene"><img src="${e(site.hero.image || site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${site.hero.image ? '' : e(`${site.agent.name || '담당자'} 프로필`)}" width="1536" height="1024" fetchpriority="high"></figure>${adviserCard(site)}</div>`;
  } else if (pattern === 'portrait') {
    visual = `<div class="hero-visual"><figure class="portrait-figure">${profile(site, '', true)}</figure>${adviserCard(site)}</div>`;
  } else {
    visual = `<div class="hero-visual hero-statement-person">${profile(site, '', true)}${adviserCard(site)}</div>`;
  }
  return `<section class="hero premium-hero hero-${pattern} container" id="home" aria-labelledby="hero-title">${visual}${lead}</section>`;
}

const INSURANCE_SCOPE_TOPICS = [
  { title: '실손의료비', description: '의료비 보장 범위와 청구 관련 내용을 확인합니다.', icon: 'medical', popular: true },
  { title: '암보험', description: '진단비·치료 관련 보장 내용을 함께 확인합니다.', icon: 'cancer', popular: true },
  { title: '뇌심장보험', description: '뇌·심장 질환 관련 보장 범위를 살펴봅니다.', icon: 'heartPulse', popular: true },
  { title: '수술보험', description: '수술 관련 보장 항목과 조건을 확인합니다.', icon: 'surgery', popular: false },
  { title: '치아보험', description: '치료 항목별 보장 내용을 함께 살펴봅니다.', icon: 'tooth', popular: true },
  { title: '태아보험', description: '출생 전후 필요한 보장 내용을 확인합니다.', icon: 'baby', popular: false },
  { title: '자동차보험', description: '차량 사고와 보상 관련 내용을 확인합니다.', icon: 'car', popular: true },
  { title: '운전자보험', description: '운전 중 사고 관련 보장 범위를 살펴봅니다.', icon: 'steering', popular: false },
  { title: '상해보험', description: '일상 중 상해 관련 보장 내용을 확인합니다.', icon: 'bandage', popular: false },
  { title: '배상책임', description: '일상 속 배상책임 관련 내용을 살펴봅니다.', icon: 'liability', popular: false },
  { title: '화재보험', description: '화재와 재산 피해 관련 보장을 확인합니다.', icon: 'fire', popular: false },
  { title: '치매보험', description: '치매 관련 진단·돌봄 보장 내용을 살펴봅니다.', icon: 'brain', popular: false },
  { title: '간병보험', description: '간병이 필요한 상황의 보장 내용을 확인합니다.', icon: 'care', popular: false },
  { title: '펫보험', description: '반려동물 치료 관련 보장 내용을 확인합니다.', icon: 'paw', popular: false },
  { title: '여행자보험', description: '여행 중 발생할 수 있는 위험 보장을 살펴봅니다.', icon: 'travel', popular: false },
] as const;

function insuranceScopeItem(item: (typeof INSURANCE_SCOPE_TOPICS)[number]): string {
  return `<li class="insurance-scope-item"><span class="insurance-scope-icon">${icon(item.icon, 22)}</span><div class="insurance-scope-item-copy"><h4>${e(item.title)}</h4><p>${e(item.description)}</p></div></li>`;
}

function insuranceScope(): string {
  const popular = INSURANCE_SCOPE_TOPICS.filter(item => item.popular).map(insuranceScopeItem).join('');
  const other = INSURANCE_SCOPE_TOPICS.filter(item => !item.popular).map(insuranceScopeItem).join('');

  return `<section class="section insurance-scope-section" id="insurance-scope" aria-labelledby="insurance-scope-title" data-pattern="split-directory"><div class="container"><div class="section-heading insurance-scope-heading"><p class="eyebrow">대표 15가지 상담 분야</p><h2 id="insurance-scope-title">보험 이름이 떠오르면, 그대로 말씀해 주세요.</h2><p class="section-support">아래는 자주 문의받는 대표 15가지입니다. 이 외 모든 보험 종류도 상담 가능합니다.</p></div><div class="insurance-scope-directory"><section class="insurance-scope-group insurance-scope-popular" aria-labelledby="insurance-scope-popular-title"><p class="insurance-scope-label">POPULAR</p><h3 id="insurance-scope-popular-title">많이 찾는 상담</h3><p class="insurance-scope-group-support">먼저 확인하시는 경우가 많은 보험을 모았습니다.</p><ul class="insurance-scope-list insurance-scope-popular-list">${popular}</ul></section><section class="insurance-scope-group insurance-scope-other" aria-labelledby="insurance-scope-other-title"><p class="insurance-scope-label">ALL CONSULTATION</p><h3 id="insurance-scope-other-title">그 외 상담 가능한 보험</h3><p class="insurance-scope-group-support">아래 항목 외에도 보험 이름이나 상황을 말씀해 주시면 함께 확인합니다.</p><ul class="insurance-scope-list insurance-scope-other-list">${other}</ul></section></div></div></section>`;
}
function services(site: SiteConfig): string {
  const design = getDesign(site);
  const items = site.specialties.map((item, i) => `<article class="service-card"><span class="section-index" aria-hidden="true">${formatIndex(i)}</span><div class="service-copy"><h3>${e(item.title)}</h3><p>${copy(item.body, item.mobileBody)}</p></div></article>`).join('');
  // 칸 수를 항목 수에 맞춰 마지막 줄에 한 칸만 남는 모양을 막습니다.
  const serviceSection = `<section class="section container services-section" id="specialties" aria-labelledby="services-title"><div class="section-heading"><p class="eyebrow">상담 분야</p><h2 id="services-title">어떤 상담이 필요하신가요?</h2><p class="section-support">지금 필요한 항목부터 골라 보세요.</p></div><div class="service-grid services-${design.services}" data-pattern="services-${design.services}" data-count="${site.specialties.length}">${items}</div></section>`;
  return `${serviceSection}${insuranceScope()}`;
}

function consultationPrinciple(site: SiteConfig): string {
  const title = site.intro.principleTitle?.trim() || '설명보다 먼저, 이해할 내용을 정리합니다.';
  const body = site.intro.principleBody?.trim() || '계약 조건을 확인하고 이해되지 않은 내용은 다시 질문한 뒤 결정할 수 있도록 안내합니다.';
  const layout = site.intro.principleLayout || '01';
  return `<aside class="adviser-principle principle-layout-${e(layout)}" aria-labelledby="adviser-principle-title"><div class="adviser-principle-copy"><p class="eyebrow">상담 원칙</p><h3 id="adviser-principle-title">${e(title)}</h3><p class="adviser-principle-body">${e(body)}</p></div></aside>`;
}
function about(site: SiteConfig): string {
  const pattern = getDesign(site).about;
  const extraFacts = `${site.agent.registrationNumber ? `<p><strong>설계사 등록번호</strong> ${e(site.agent.registrationNumber)}</p>` : ''}${site.agent.regions.length ? `<p><strong>상담 지역</strong> ${e(site.agent.regions.join(' · '))}</p>` : ''}`;
  const body = `<div class="about-copy"><p>${copy(site.intro.body, site.intro.mobileBody)}</p>${site.sections.career && site.career.length ? `<ul class="career-list">${site.career.map(c => `<li>${e(c)}</li>`).join('')}</ul>` : ''}${extraFacts ? `<div class="agent-meta">${extraFacts}</div>` : ''}${consultationPrinciple(site)}</div>`;
  const intro = `<div class="about-heading"><p class="eyebrow">담당자 소개</p><h2 id="about-title">${copy(naturalHeading(site.intro.title), naturalHeading(site.intro.mobileTitle))}</h2>${site.intro.philosophy && !site.intro.principleTitle ? `<p class="philosophy">${e(site.intro.philosophy)}</p>` : ''}</div>`;
  const image = `<figure class="about-portrait">${profile(site)}<figcaption>${e(site.agent.name)} · ${e(site.agent.title)}</figcaption></figure>`;
  const layout = pattern === 'profile' ? `${image}<div>${intro}${body}</div>` : pattern === 'quote' ? `<div class="about-quote">${intro}<blockquote>${e(site.intro.philosophy || site.intro.title)}</blockquote>${body}</div>` : `${intro}${body}`;
  return `<section class="section about-section" id="about" aria-labelledby="about-title"><div class="container about-grid about-${pattern}" data-pattern="about-${pattern}">${layout}</div></section>`;
}
function process(site: SiteConfig): string {
  if (!site.sections.process || !site.process.length) return '';
  const pattern = getDesign(site).process;
  return `<section class="section container process-section" id="process" aria-labelledby="process-title"><div class="section-heading"><p class="eyebrow">상담 과정</p><h2 id="process-title">상담은 이렇게 진행됩니다.</h2><p class="section-support">연락 후 필요한 범위와 일정을 함께 정합니다.</p></div><ol class="process-grid process-${pattern}" data-pattern="process-${pattern}">${site.process.map((p, i) => `<li><span class="process-number">${formatIndex(i)}</span><div><h3>${e(p.title)}</h3><p>${copy(p.body, p.mobileBody)}</p></div></li>`).join('')}</ol></section>`;
}

function reviews(site: SiteConfig): string {
  if (!site.sections.reviews || (!site.design && site.template === 'clean-minimal')) return '';
  const items = (site.reviews || []).filter(r => !r.isExample);
  if (!items.length) return '';
  return `<section class="section review-section" id="reviews" aria-labelledby="reviews-title"><div class="container"><div class="section-heading"><div><p class="eyebrow">고객 후기</p><h2 id="reviews-title">상담 후 남겨주신 이야기.</h2></div></div><div class="review-grid">${items.map(r => `<figure class="review-card"><blockquote>${e(r.quote)}</blockquote><figcaption>${e(r.author)}${r.context ? ` · ${e(r.context)}` : ''}</figcaption></figure>`).join('')}</div></div></section>`;
}

const SITE_HELP_FAQS = new Set([
  '상담 요청이 곧 보험 가입인가요?',
  '어떻게 연락하면 되나요?',
  '이 페이지에 신청서를 작성하나요?',
  '버튼을 누르면 메시지가 자동 발송되나요?',
  '전화 버튼이 PC에서 동작하지 않아요.',
  '오픈채팅을 열 수 없으면 어떻게 하나요?',
  '점검 결과가 자동으로 나오나요?',
  '입력한 정보가 이 사이트에 저장되나요?',
]);

function faq(site: SiteConfig): string {
  if (!site.sections.faq || !site.faqs.length) return '';
  const pattern = getDesign(site).faq;
  const items = site.faqs.filter(item => !SITE_HELP_FAQS.has(item.question)).slice(0, 4);
  if (!items.length) return '';
  return `<section class="section container faq-section faq-${pattern}" id="faq" aria-labelledby="faq-title"><div class="section-heading"><p class="eyebrow">자주 묻는 질문</p><h2 id="faq-title">많이 물어보시는 내용을 모았습니다.</h2></div><div class="faq-list" data-pattern="faq-${pattern}">${items.map((f, i) => `<details${pattern === 'columns' ? ' open' : ''}><summary><span class="faq-question"><span class="faq-number" aria-hidden="true">${formatIndex(i)}</span>${e(f.question)}</span><span aria-hidden="true">+</span></summary><p>${copy(f.answer, f.mobileAnswer)}</p></details>`).join('')}</div></section>`;
}

function focus(site: SiteConfig): string {
  const content = site.templateContent?.[site.template];
  if (!content?.focus?.length) return '';
  return `<section class="section container focus-section" id="focus">${heading('상담 전 살펴보기', content.focusTitle || '선택 전에 살펴볼 내용')}<div class="focus-grid">${content.focus.map((c, i) => `<article><span class="section-index">${formatIndex(i)}</span><h3>${e(c.title)}</h3><p>${copy(c.body, c.mobileBody)}</p></article>`).join('')}</div></section>`;
}

function casesTicker(site: SiteConfig): string {
  const items = [
    { title: '내 보험, 제대로 준비되어 있을까요?', body: '현재 가입 중인 보험을 한눈에 보기 쉽게 정리해드립니다. 부족하거나 중복된 보장은 없는지 꼼꼼하게 점검해드립니다.' },
    { title: '보험 리모델링', body: '불필요하게 지출되는 보험료는 없는지 확인하고, 중증 보장에만 치우치지 않고 경증 질환이나 일상적인 치료 상황에서도 활용할 수 있는 보장이 있는지 꼼꼼하게 점검합니다. 꼭 필요한 보장은 남겨 합리적으로 다시 설계해드립니다.' },
    { title: '나에게 맞는 맞춤 설계', body: '나이·직업·가족력·생활환경을 고려해 꼭 필요한 보장을 우선순위에 맞춰 안내해드립니다.' },
    { title: '보험금 청구 지원', body: '진단·수술·사고 시 받을 수 있는 보험금을 놓치지 않도록 도와드립니다. 병원 내원부터 필요한 서류와 청구 절차까지 꼼꼼하게 안내해드립니다. 연중무휴로 언제든지, 늦은 밤이나 새벽에도 편하게 연락 주시면 친절하게 안내해드립니다.' },
    { title: '우리 가족 보험 통합 관리', body: '부모님·배우자·자녀까지 가족 전체의 보장을 함께 살펴보고, 가입 여부와 관계없이 지속적으로 관리해드립니다.' },
    { title: '은퇴·노후 준비', body: '연금·저축성 상품 등을 활용해 막연한 노후 걱정을 구체적인 준비 계획으로 바꿔드립니다.' },
  ];
  const initialClass = (index: number) => index === 0 ? 'is-active' : index === 1 ? 'is-next' : index === items.length - 1 ? 'is-prev' : index >= items.length - 2 ? 'is-hidden-left' : 'is-hidden-right';
  return `<section class="section cases-section" id="cases" aria-labelledby="cases-title"><div class="container cases-shell"><div class="section-heading cases-heading"><p class="eyebrow">상담 포인트</p><h2 id="cases-title">많이 확인하는 내용을 먼저 훑어보세요.</h2><p class="section-support">자주 고르는 질문을 정리해 어떤 내용을 확인하는지 한눈에 볼 수 있습니다.</p></div><div class="cases-carousel" data-cases-carousel role="region" aria-roledescription="carousel" aria-label="상담 포인트 6가지"><button class="cases-nav cases-nav-prev" type="button" data-cases-prev aria-label="이전 상담 포인트" aria-controls="cases-list"><span class="cases-nav-mark" aria-hidden="true"></span></button><div class="cases-stage"><ol class="cases-list" id="cases-list">${items.map((item, i) => `<li class="cases-item ${initialClass(i)}" data-case-index="${i}" role="group" aria-roledescription="slide" aria-label="${i + 1} / ${items.length}"${i > 1 && i < items.length - 1 ? ' aria-hidden="true"' : ''}><span class="cases-badge">POINT ${String(i + 1).padStart(2, '0')}</span><div class="cases-copy"><h3>${e(item.title)}</h3><p>${e(item.body)}</p></div></li>`).join('')}</ol></div><button class="cases-nav cases-nav-next" type="button" data-cases-next aria-label="다음 상담 포인트" aria-controls="cases-list"><span class="cases-nav-mark" aria-hidden="true"></span></button><p class="cases-live" data-cases-live aria-live="polite">01 / 06 ${e(items[0].title)}</p></div></div></section>`;
}
function contact(site: SiteConfig): string {
  const channels = site.contact.instagramUrl ? '전화·카카오톡·인스타그램' : '전화와 카카오톡 오픈채팅';
  return `<section class="section contact-section" id="contact" aria-labelledby="contact-title"><div class="container contact-grid"><div class="contact-copy"><p class="eyebrow">연락 방법</p><h2 id="contact-title">편한 방법으로 바로 문의하세요.</h2><p>${channels} 중 편한 방법을 선택하세요.</p></div>${renderContactForm(site)}</div></section>`;
}

export function renderCalmPage(site: SiteConfig): string {
  const design = getDesign(site);
  const modules: Record<DesignSectionId, () => string> = { services: () => services(site), about: () => about(site), process: () => process(site), reviews: () => reviews(site), faq: () => faq(site), contact: () => contact(site) };
  const sections = design.sectionOrder.filter(key => !design.hiddenSections.includes(key)).map(key => modules[key]()).join('');
  return `<main id="main" tabindex="-1" data-typography-version="balanced-v3" class="ornament-${design.ornament} density-${design.density}">${hero(site)}${focus(site)}${casesTicker(site)}${sections}</main>`;
}
