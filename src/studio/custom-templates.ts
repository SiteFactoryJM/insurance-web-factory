import type { PaletteId, SiteConfig } from '../types.js';

export const CUSTOM_STUDIO_TEMPLATE_IDS = ['kim-gyeonghyeon', 'kim-daekyung'] as const;
export type CustomStudioTemplateId = typeof CUSTOM_STUDIO_TEMPLATE_IDS[number];

interface CustomStudioTemplate {
  name: string;
  description: string;
  palette: PaletteId;
  accentColor: string;
}

/**
 * 검증이 끝난 실제 제작본을 스튜디오에서 다시 쓸 수 있는 시각 프리셋입니다.
 * 담당자 개인정보와 자격 이미지는 복사하지 않고 레이아웃·색상 계약만 적용합니다.
 */
export const CUSTOM_STUDIO_TEMPLATES: Record<CustomStudioTemplateId, CustomStudioTemplate> = {
  'kim-gyeonghyeon': {
    name: '김경현 템플릿',
    description: '기존 김경현 페이지 구성과 차콜 색상을 사용합니다.',
    palette: 'charcoal',
    accentColor: '#2D4864',
  },
  'kim-daekyung': {
    name: '김대경 템플릿',
    description: '김경현 페이지 구성을 그대로 두고 포레스트 그린 색상만 적용합니다.',
    palette: 'forest',
    accentColor: '#2B5544',
  },
};

export function isCustomStudioTemplateId(value: string): value is CustomStudioTemplateId {
  return CUSTOM_STUDIO_TEMPLATE_IDS.includes(value as CustomStudioTemplateId);
}

export function inferCustomStudioTemplate(site: SiteConfig): CustomStudioTemplateId {
  return site.palette === 'forest' ? 'kim-daekyung' : 'kim-gyeonghyeon';
}

/** Keep the shared Kim Gyeonghyeon structure while preserving customer data. */
export function enforceCustomStudioStructure(source: SiteConfig): SiteConfig {
  const next = structuredClone(source);
  next.template = 'warm-care';
  next.headingFont = 'noto-sans-kr';
  next.design = undefined;
  next.hero = { ...next.hero, brandLayout: 'watermark' };
  next.sections = { ...next.sections, recruitment: true };
  next.footer = { ...next.footer, note: '', hideInstagram: true };
  next.demo = { ...(next.demo || { enabled: true }), enabled: true, allowTemplateSwitch: false, submissionMode: 'discard' };
  return next;
}

export function applyCustomStudioTemplate(source: SiteConfig, id: CustomStudioTemplateId): SiteConfig {
  const next = enforceCustomStudioStructure(source);
  const preset = CUSTOM_STUDIO_TEMPLATES[id];
  next.palette = preset.palette;
  next.accentColor = preset.accentColor;
  return next;
}
