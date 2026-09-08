export const TEMPLATE_IDS = ["trust-blue", "warm-care", "premium-navy", "clean-minimal", "local-friendly"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];
export const PALETTE_IDS = ["navy", "forest", "slate", "charcoal", "teal", "stone"] as const;
export type PaletteId = (typeof PALETTE_IDS)[number];
export type HeadingFont = "pretendard" | "noto-serif-kr";
export type PublishStatus = "draft" | "published";
export type AdvertisingReviewStatus = "pending" | "approved" | "not-required";
export interface ContentCard { title: string; body: string; }
export interface FaqItem { question: string; answer: string; }
export interface ReviewItem { quote: string; author: string; context?: string; isExample?: boolean; }
export interface TemplateContent {
  headline?: string; subheadline?: string; eyebrow?: string;
  specialties?: ContentCard[]; process?: ContentCard[]; faqs?: FaqItem[];
  focusTitle?: string; focus?: ContentCard[];
}
export interface SiteConfig {
  id: string; status: PublishStatus; domains: string[]; template: TemplateId; accentColor?: string; headingFont: HeadingFont;
  palette?: PaletteId;
  templateContent?: Partial<Record<TemplateId, TemplateContent>>;
  agent: { name: string; title: string; company: string; branch?: string; registrationNumber?: string; careerYears?: number; regions: string[]; profileImage: string; logoImage?: string; };
  hero: { eyebrow?: string; headline: string; subheadline: string; primaryCtaLabel: string; secondaryCtaLabel: string; trustNote?: string; };
  intro: { title: string; body: string; philosophy?: string; };
  specialties: ContentCard[]; process: ContentCard[]; career: string[]; reviews?: ReviewItem[]; faqs: FaqItem[];
  consultation?: { topics: string[] };
  contact: { phone: string; kakaoUrl?: string; instagramUrl?: string; email?: string; formEmail?: string; officeAddress?: string; mapUrl?: string; availableHours: string; };
  sections: { career: boolean; process: boolean; reviews?: boolean; faq: boolean; location: boolean; contactForm: boolean; };
  seo: { title: string; description: string; ogImage?: string; noIndex?: boolean; };
  compliance: { advertisingReviewStatus: AdvertisingReviewStatus; advertisingReviewNumber?: string; advertisingReviewExpiresAt?: string; footerDisclaimer: string; privacyOfficer: string; privacyRetentionPeriod: string; contentTruthConfirmed: boolean; photoUseConfirmed: boolean; publicationConfirmed: boolean; };
  demo?: { enabled: boolean; allowTemplateSwitch?: boolean; submissionMode?: "discard" | "store" | "mailto"; };
}
export interface AssetBinding { fetch(input: Request): Promise<Response>; }
export interface D1PreparedStatement { bind(...values: unknown[]): D1PreparedStatement; run(): Promise<unknown>; }
export interface D1DatabaseLike { prepare(query: string): D1PreparedStatement; }
export interface Env { ASSETS: AssetBinding; DB?: D1DatabaseLike; DEMO_SITE_ID?: string; CONSULTATION_WEBHOOK_URL?: string; }
