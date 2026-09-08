import type { TemplateId } from "../types.js";

/** Stable IDs preserve existing URLs and intake workbooks. */
export const TEMPLATE_META: Record<TemplateId, { name: string; purpose: string; description: string }> = {
  "trust-blue": { name: "차분한 신뢰", purpose: "표준 상담형 · 추천", description: "담당자와 상담 범위를 먼저 확인하는 기본형. 소개부터 상담 신청까지 균형 있게 안내합니다." },
  "warm-care": { name: "따뜻한 동행", purpose: "대화 중심형", description: "담당자의 사진과 상담 원칙을 먼저 보여줍니다. 사람과 설명 방식에 집중하는 구성입니다." },
  "premium-navy": { name: "꼼꼼한 준비", purpose: "가입 준비형", description: "새 보험을 알아보기 전 확인할 내용을 차분하게 정리합니다. 어두운 강조 영역은 첫 화면에만 사용합니다." },
  "clean-minimal": { name: "한눈에 정리", purpose: "정보 최소형", description: "후기나 경력 수치가 없어도 완성되는 구성. 짧은 설명과 명확한 상담 순서에 집중합니다." },
  "local-friendly": { name: "가까운 상담", purpose: "모바일 우선형", description: "궁금한 주제부터 고르고 상담을 시작합니다. 큰 선택 영역과 간단한 안내로 접근성을 높입니다." },
};
export const DEFAULT_TOPICS = ["생명보험", "실손·건강보험", "암·질병보험", "자동차보험", "연금·저축보험", "어린이·태아보험", "기타 / 아직 잘 모르겠어요"];
