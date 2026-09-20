import type { ContentCard, FaqItem, SiteConfig } from '../types.js';
import { COPY_LIBRARY, type PurposeChoice } from '../content/copy-library.js';
import { getDesign } from '../render/design-system.js';
import { directEmailHref, directPhoneHref, openChatUrl } from '../utils/contact-links.js';

export type CopyGroup = 'heroes' | 'intros' | 'services' | 'processes' | 'faqs' | 'footers';
const card = (item: ContentCard): ContentCard => ({ title: item.title, body: item.body, ...(item.mobileBody ? {mobileBody: item.mobileBody} : {}) });
const faq = (item: FaqItem): FaqItem => ({ question: item.question, answer: item.answer, ...(item.mobileAnswer ? {mobileAnswer: item.mobileAnswer} : {}) });
export function resetPublication(site: SiteConfig): SiteConfig {
  site.status = 'draft'; site.domains = []; site.seo.noIndex = true;
  site.demo = { enabled: true, allowTemplateSwitch: false, submissionMode: 'discard' };
  site.sections.contactForm = false;
  site.compliance.contentTruthConfirmed = false; site.compliance.photoUseConfirmed = false; site.compliance.publicationConfirmed = false;
  site.compliance.advertisingReviewStatus = 'pending';
  site.compliance.advertisingReviewNumber = ''; site.compliance.advertisingReviewExpiresAt = '';
  return site;
}

export function applyCopy(site: SiteConfig, group: CopyGroup, ids: string[]): SiteConfig {
  const out: SiteConfig = structuredClone(site);
  delete out.templateContent; // Selected text, not stale per-template overrides, owns the page.
  const wanted = new Set(ids);
  if (wanted.size !== ids.length) throw new Error('중복 문구를 선택할 수 없습니다.');
  const items = COPY_LIBRARY[group].filter(item => wanted.has(item.id));
  if (items.length !== ids.length) throw new Error('문구 선택을 확인해 주세요.');
  if (!['services', 'faqs'].includes(group) && ids.length !== 1) throw new Error('문구를 하나 선택해 주세요.');
  if (group === 'heroes') {
    const h = COPY_LIBRARY.heroes.find(item => item.id === ids[0])!;
    out.hero = { ...out.hero, headline: h.headline, mobileHeadline: h.mobileHeadline, subheadline: h.subheadline,
      mobileSubheadline: h.mobileSubheadline, eyebrow: h.eyebrow, primaryCtaLabel: '전화로 문의하기', secondaryCtaLabel: '상담 분야 보기' };
  } else if (group === 'intros') {
    const h = COPY_LIBRARY.intros.find(item => item.id === ids[0])!;
    out.intro = { title: h.title, mobileTitle: h.mobileTitle, body: h.body, mobileBody: h.mobileBody, philosophy: h.philosophy, principleTitle: h.principleTitle, principleBody: h.principleBody, principleLayout: h.principleLayout };
  } else if (group === 'services') {
    if (ids.length < 3 || ids.length > 6) throw new Error('상담 분야는 3~6개를 골라 주세요.');
    out.specialties = ids.map(id => card(COPY_LIBRARY.services.find(item => item.id === id)!));
  } else if (group === 'processes') {
    out.process = COPY_LIBRARY.processes.find(item => item.id === ids[0])!.items.map(card);
  } else if (group === 'faqs') {
    if (ids.length < 2 || ids.length > 8) throw new Error('FAQ는 2~8개를 골라 주세요.');
    out.faqs = ids.map(id => faq(COPY_LIBRARY.faqs.find(item => item.id === id)!));
  } else {
    out.footer = { ...out.footer, note: COPY_LIBRARY.footers.find(item => item.id === ids[0])!.text };
  }
  return resetPublication(out);
}

export function applyPurpose(site: SiteConfig, preset: PurposeChoice): SiteConfig {
  let out = structuredClone(site);
  delete out.design;
  out.template = preset.template; out.palette = preset.palette;
  out = applyCopy(out, 'heroes', [preset.heroId]);
  out = applyCopy(out, 'intros', [preset.introId]);
  out = applyCopy(out, 'services', preset.serviceIds);
  out = applyCopy(out, 'processes', [preset.processId]);
  out = applyCopy(out, 'faqs', preset.faqIds);
  out = applyCopy(out, 'footers', [preset.footerId]);
  out.design = getDesign(out); // Preserve the resolved arrangement when transferring to advanced editing.
  out.sections.process = true; out.sections.faq = true;
  // Never manufacture a testimonial or professional credential.
  out.reviews = (out.reviews || []).filter(item => !item.isExample);
  out.sections.reviews = Boolean(out.reviews.length);
  out.contentBrief = { purpose: preset.label, targetAudience: preset.audience, primaryAction: '전화 또는 카카오톡 오픈채팅으로 직접 문의' };
  return out;
}

export function blankGuidedSite(example: SiteConfig): SiteConfig {
  const out = structuredClone(example);
  out.id = 'new-adviser';
  out.headingFont = 'noto-sans-kr';
  out.agent = { name: '', title: '보험설계사', company: '', branch: '', registrationNumber: '', regions: [], profileImage: '/assets/profile-placeholder.svg', logoImage: '' };
  out.contact = { phone: '', kakaoUrl: '', availableHours: '', email: '', fax: '', officeAddress: '' };
  out.hero = { ...out.hero, image: undefined, trustNote: '계약 조건을 충분히 확인한 뒤 결정하세요.' };
  out.career = []; out.reviews = [];
  out.sections = { career: false, process: true, reviews: false, faq: true, location: false, contactForm: false };
  out.footer = { heading: '보험 상담 안내', note: '' };
  out.seo = { title: '보험 상담 안내', description: '담당자 소개와 상담 분야, 연락 방법을 확인하세요.', noIndex: true };
  out.compliance = { advertisingReviewStatus: 'pending', footerDisclaimer: '본 페이지는 담당자 소개 및 연락 방법 안내를 위한 자료입니다. 구체적인 상품 내용은 담당자에게 확인하고, 계약 전 상품설명서와 약관을 확인하시기 바랍니다.', privacyOfficer: '게시 전 담당자 확인 필요', privacyRetentionPeriod: '고객용 신청서를 제공하지 않으며 상담 입력값을 수집하지 않습니다.', contentTruthConfirmed: false, photoUseConfirmed: false, publicationConfirmed: false };
  return applyPurpose(out, COPY_LIBRARY.presets[0]);
}

/** Additional guardrails, separate from schema validation and NOT a legal approval. */
export function guidedIssues(site: SiteConfig): string[] {
  const issues: string[] = [];
  if (!site.agent.name.trim()) issues.push('담당자 이름을 입력해 주세요.');
  if (!site.agent.company.trim()) issues.push('실제 소속을 입력해 주세요.');
  if (!directPhoneHref(site.contact.phone)) issues.push('연결 가능한 전화번호를 입력해 주세요.');
  if (!openChatUrl(site.contact.kakaoUrl)) issues.push('https://open.kakao.com/o/로 시작하는 오픈채팅 초대 주소를 입력해 주세요.');
  if (!site.contact.availableHours.trim()) issues.push('실제 상담 시간을 입력해 주세요.');
  if (site.contact.email && !directEmailHref(site.contact.email)) issues.push('이메일 주소를 확인해 주세요.');
  if (site.contact.fax && !directPhoneHref(site.contact.fax)) issues.push('팩스번호를 숫자와 +, -, 괄호로 입력해 주세요.');
  return issues;
}
