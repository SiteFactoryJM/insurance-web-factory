import { HEADING_FONT_IDS, type HeadingFont } from "../types.js";
import { escapeHtml } from "../utils/html.js";

export interface HeadingFontOption {
  id: HeadingFont; label: string; description: string; family: string;
  stylesheet: string; licenseUrl: string; weights: readonly number[];
}

/** Unmodified OFL 1.1 families; see docs/FONT_LICENSES.md for redistribution conditions. */
export const HEADINGS: Record<HeadingFont, HeadingFontOption> = {
  pretendard: {
    id: "pretendard", label: "프리텐다드", description: "현대적이고 또렷한 고딕",
    family: "'Pretendard Variable', Pretendard, 'Malgun Gothic', sans-serif",
    stylesheet: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css",
    licenseUrl: "https://github.com/orioncactus/pretendard/blob/main/LICENSE", weights: [400, 500, 600, 700],
  },
  "noto-serif-kr": {
    id: "noto-serif-kr", label: "노토 세리프", description: "차분하고 정제된 명조",
    family: "'Noto Serif KR', Georgia, serif",
    stylesheet: "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600;700&display=swap",
    licenseUrl: "https://github.com/google/fonts/blob/main/ofl/notoserifkr/OFL.txt", weights: [400, 500, 600, 700],
  },
  "noto-sans-kr": {
    id: "noto-sans-kr", label: "노토 산스", description: "균형 있고 안정적인 고딕",
    family: "'Noto Sans KR', 'Malgun Gothic', sans-serif",
    stylesheet: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap",
    licenseUrl: "https://github.com/google/fonts/blob/main/ofl/notosanskr/OFL.txt", weights: [400, 500, 600, 700],
  },
  "nanum-gothic": {
    id: "nanum-gothic", label: "나눔고딕", description: "친숙하고 편안한 고딕",
    family: "'Nanum Gothic', 'Malgun Gothic', sans-serif",
    stylesheet: "https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap",
    licenseUrl: "https://github.com/google/fonts/blob/main/ofl/nanumgothic/OFL.txt", weights: [400, 700, 800],
  },
  "nanum-myeongjo": {
    id: "nanum-myeongjo", label: "나눔명조", description: "단아한 인상을 주는 명조",
    family: "'Nanum Myeongjo', Georgia, serif",
    stylesheet: "https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap",
    licenseUrl: "https://github.com/google/fonts/blob/main/ofl/nanummyeongjo/OFL.txt", weights: [400, 700, 800],
  },
  "gowun-batang": {
    id: "gowun-batang", label: "고운바탕", description: "부드럽고 따뜻한 바탕체",
    family: "'Gowun Batang', Georgia, serif",
    stylesheet: "https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&display=swap",
    licenseUrl: "https://github.com/google/fonts/blob/main/ofl/gowunbatang/OFL.txt", weights: [400, 700],
  },
};
export const HEADING_FONTS: readonly HeadingFontOption[] = HEADING_FONT_IDS.map(id => HEADINGS[id]);

export function headingFont(id?: string): HeadingFontOption {
  return id && Object.hasOwn(HEADINGS, id) ? HEADINGS[id as HeadingFont] : HEADINGS.pretendard;
}

/** Load only the selected heading families plus the common body face.
 *  Figma's Clear Human sheets set every text style in Noto Sans KR. */
export const BODY_FONT: HeadingFont = "noto-sans-kr";
export function fontStylesheetLinks(ids: readonly HeadingFont[], includeBody = true): string {
  const requested = includeBody ? [BODY_FONT, ...ids] : ids;
  return [...new Set(requested.map(id => headingFont(id).stylesheet))]
    .map(href => `<link rel="stylesheet" href="${escapeHtml(href)}">`).join("");
}

export function headingFontStyle(id?: string): string {
  return `--heading-family:${headingFont(id).family}`;
}
