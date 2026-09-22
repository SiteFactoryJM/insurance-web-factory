export const TEMPLATE_IDS = ["trust-blue", "warm-care", "premium-navy", "clean-minimal", "local-friendly"] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];
export const PALETTE_IDS = ["navy", "forest", "slate", "charcoal", "teal", "stone"] as const;
export type PaletteId = (typeof PALETTE_IDS)[number];
export const HEADING_FONT_IDS = ["pretendard", "noto-serif-kr", "noto-sans-kr", "nanum-gothic", "nanum-myeongjo", "gowun-batang"] as const;
export type HeadingFont = (typeof HEADING_FONT_IDS)[number];
export const HERO_BRAND_LAYOUT_IDS = ["soft-panel", "gold-wave", "watermark"] as const;
export type HeroBrandLayout = (typeof HERO_BRAND_LAYOUT_IDS)[number];
export type PublishStatus = "draft" | "published";
export type AdvertisingReviewStatus = "pending" | "approved" | "not-required";
export const INTRO_PRINCIPLE_LAYOUT_IDS = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16"] as const;
export type IntroPrincipleLayout = (typeof INTRO_PRINCIPLE_LAYOUT_IDS)[number];
export const DESIGN_SECTION_IDS = ["services", "about", "process", "reviews", "faq", "contact"] as const;
export type DesignSectionId = (typeof DESIGN_SECTION_IDS)[number];
export interface SiteDesign {
  hero?: "portrait" | "editorial" | "statement";
  services?: "cards" | "list" | "split";
  about?: "editorial" | "profile" | "quote";
  process?: "steps" | "timeline";
  faq?: "accordion" | "columns";
  footer?: "classic" | "columns" | "minimal";
  ornament?: "line" | "grid" | "none";
  density?: "airy" | "compact";
  sectionOrder?: DesignSectionId[];
  hiddenSections?: DesignSectionId[];
}
export interface ContentCard { title: string; body: string; mobileBody?: string; }
export interface FaqItem { question: string; answer: string; mobileAnswer?: string; }
export interface ReviewItem { quote: string; author: string; context?: string; isExample?: boolean; }
export interface TemplateContent {
  headline?: string; subheadline?: string; mobileHeadline?: string; mobileSubheadline?: string; eyebrow?: string;
  specialties?: ContentCard[]; process?: ContentCard[]; faqs?: FaqItem[];
  focusTitle?: string; focus?: ContentCard[];
}
export interface SiteConfig {
  id: string; status: PublishStatus; domains: string[]; template: TemplateId; accentColor?: string; headingFont: HeadingFont;
  palette?: PaletteId;
  design?: SiteDesign;
  footer?: { heading?: string; note?: string; };
  templateContent?: Partial<Record<TemplateId, TemplateContent>>;
  contentBrief?: { purpose?: string; targetAudience?: string; primaryAction?: string; };
  agent: { name: string; title: string; company: string; branch?: string; registrationNumber?: string; businessNumber?: string; careerYears?: number; regions: string[]; profileImage: string; logoImage?: string; logoMarkImage?: string; };
  hero: { eyebrow?: string; headline: string; subheadline: string; mobileHeadline?: string; mobileSubheadline?: string; primaryCtaLabel: string; secondaryCtaLabel: string; trustNote?: string; image?: string; brandLayout?: HeroBrandLayout; brandTagline?: string; brandSubline?: string; certificationBadgeImage?: string; certificationBadgeAlt?: string; };
  intro: { title: string; body: string; mobileTitle?: string; mobileBody?: string; philosophy?: string; principleTitle?: string; principleBody?: string; principleLayout?: IntroPrincipleLayout; };
  specialties: ContentCard[]; process: ContentCard[]; career: string[]; reviews?: ReviewItem[]; faqs: FaqItem[];
  consultation?: { topics: string[] };
  contact: { phone: string; kakaoUrl?: string; instagramUrl?: string; email?: string; fax?: string; formEmail?: string; officeAddress?: string; mapUrl?: string; availableHours: string; };
  sections: { career: boolean; process: boolean; reviews?: boolean; faq: boolean; location: boolean; contactForm: boolean; recruitment?: boolean; };
  seo: { title: string; description: string; ogImage?: string; noIndex?: boolean; };
  compliance: { advertisingReviewStatus: AdvertisingReviewStatus; advertisingReviewNumber?: string; advertisingReviewExpiresAt?: string; footerDisclaimer: string; privacyOfficer: string; privacyRetentionPeriod: string; contentTruthConfirmed: boolean; photoUseConfirmed: boolean; publicationConfirmed: boolean; };
  demo?: { enabled: boolean; allowTemplateSwitch?: boolean; submissionMode?: "discard" | "store" | "mailto"; };
}
export interface AssetBinding { fetch(input: Request): Promise<Response>; }
export interface D1PreparedStatement { bind(...values: unknown[]): D1PreparedStatement; run(): Promise<unknown>; }
export interface D1DatabaseLike { prepare(query: string): D1PreparedStatement; }
export interface Env { ASSETS: AssetBinding; DB?: D1DatabaseLike; DEMO_SITE_ID?: string; CONSULTATION_WEBHOOK_URL?: string; }
