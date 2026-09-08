# Insurance Web Factory · Calm Trust

여러 보험설계사 홈페이지를 한 코드베이스와 설계사별 JSON으로 운영하는 Cloudflare Workers 프로젝트입니다. 2026년 개편은 **큰 글씨, 모바일 가독성, 확인 가능한 담당자 정보, 전송 없는 상담 신청 샘플**에 집중합니다.

## 미리보기

기본 주소: https://insurance-web-factory.pjmsm0319.workers.dev

전체 비교: `/templates`

| 주소 | 샘플 |
| --- | --- |
| `/?theme=trust-blue` | 신뢰의 기준 · 기업형 |
| `/?theme=warm-care` | 사람과 대화 · 소개 중심형 |
| `/?theme=premium-navy` | 선택의 기준 · 가입 점검형 |
| `/?theme=clean-minimal` | 한 장의 정리 · 리포트형 |
| `/?theme=local-friendly` | 바로 묻는 상담 · 상담 메뉴형 |

기존 5개 URL을 유지하면서 5개 배치 구조와 6개 팔레트를 독립적으로 조합하는 30가지 샘플을 제공합니다. 본문·입력·버튼은 기본 18px, 보조 글씨·고지는 최소 16px입니다. 글자 크게 버튼은 제거하고 브라우저 글자 확대를 지원합니다. 모든 푸터는 어두운 계열입니다.

## 상담 신청은 현재 샘플입니다

분야 선택 → 상담 목적·추가 내용(선택) → 예시 연락 정보 → 최종 확인의 4단계입니다. 오류 안내, 이전 단계, 입력 요약, 안내 확인, 완료 상태만 체험할 수 있습니다. **입력값은 서버, 이메일, 카카오톡 또는 브라우저 저장소로 전달되지 않습니다.** 실제 개인정보 대신 예시 정보를 사용하세요.

완료와 페이지 이탈 시 입력을 지우며, 자바스크립트가 없으면 입력/전송을 비활성화합니다. 데모 API도 본문 파싱 이전에 종료합니다. 기존 비데모 API는 별도로 남아 있으나 새로운 신청 UI에는 연결되어 있지 않습니다. `submissionMode`, `formEmail`만 바꿔서 실제 전송을 활성화할 수 없습니다.

미래 연동 요구와 구현 지점: [카카오톡 연동 계획](docs/KAKAO_INTEGRATION.md)

## PC·모바일 문구와 자료수집 설문

메인 제목은 PC 40자 / 모바일 24자, 메인 설명은 PC 120자 / 모바일 60자 이내입니다. 소개는 제목 40/24자·본문 400/100자, 상담 분야·절차 설명은 120/48자, FAQ 답변은 240/80자입니다. 공백·줄바꿈 포함 Unicode 문자 수 기준이며 초과하면 가져오기와 사이트 검증에서 오류를 안내합니다. 모바일 문구는 650px 이하에서 표시하고, 비워두면 PC 원문을 그대로 표시합니다. 보험 고지와 개인정보 안내는 축약하지 않습니다.

자료수집 엑셀에는 홈페이지 목적·주요 고객·원하는 방문자 행동과 PC·모바일 원고를 각각 적습니다. `npm run intake:build`로 양식을 갱신합니다. [작성 가이드](docs/EXCEL_INTAKE_GUIDE.md) · [2026 레퍼런스 조사](docs/DESIGN_REFERENCE_RESEARCH_2026.md)

시안 조합 도구는 사이트 헤더 위에만 표시하고, 후기·FAQ는 서로 다른 배경으로 구분합니다.

## 설계사별 원본

`sites/<id>/site.json`에서 이름, 소속, 사진, 소개, 상담 분야, FAQ, 실제 경력, 고지 등을 관리합니다. 자료수집 엑셀과 기존 가져오기 기능은 유지합니다. 새 `consultation.topics`는 실제 취급 가능한 상담 분야 목록이며 1~12개의 중복 없는 문자열입니다. 등록 정보가 없으면 임의의 배지를 만들지 않고, 후기가 없으면 영역을 생략합니다.

`src/generated/sites.generated.ts`는 직접 편집하지 않고 생성 스크립트로 갱신합니다.

```bash
npm install
npm run check
npm run preview
# 또는 Cloudflare 환경으로 실행
npm run dev
```

```bash
npm run intake:import -- --file ./incoming/설계사/자료.xlsx
npm run generate
npm run check
```

## 검증과 Actions

```bash
npm run check
npx playwright install chromium
npm run test:e2e
```

설정 검증, TypeScript, 단위/렌더/API 회귀 테스트와 Playwright/axe 자동 검사를 제공합니다. 반응형 검사는 320·360·390·768·1440px, 200% 글자 확대, 신청 단계, 미전송, 모바일 CTA, 키보드와 자바스크립트 비활성화 상태를 포함합니다. 테스트용 정보만 사용합니다.

PR과 main 푸시에서 CI가 실행되고 브라우저 보고서를 Actions artifact로 남깁니다. 연결된 Cloudflare Workers Builds는 main 변경을 배포합니다. main CI의 live verification은 실제 데모 주소에서 새 페이지 식별자와 30개 배치·색상 조합를 확인합니다. 별도 수동 배포 워크플로는 기존 Cloudflare secrets가 설정된 환경에서 사용합니다.

## 문서와 코드

- [디자인 시스템](docs/DESIGN_SYSTEM.md)
- [5개 샘플과 참고 페이지 반영 범위](docs/THEME_AND_DEMO_GUIDE.md)
- [카카오톡 연동 계획](docs/KAKAO_INTEGRATION.md)
- [아키텍처](docs/ARCHITECTURE.md)
- `src/render/calm-page.ts`: 마스터와 목적별 구성
- `src/render/shared.ts`: 공통 신청·헤더·고지
- `src/render/styles.ts`: 큰 글씨와 반응형 토큰
- `src/render/client-script.ts`: 브라우저 내 데모 동작

실제 게시 전 소속 조직의 준법/광고심의, 무료 상담 조건, 실제 취급 범위, 등록 정보, 사진 사용권, 개인정보 처리 구조를 확정해야 합니다. 샘플은 noindex이며 실제 고객 후기로 오인할 수 있는 임시 수치나 성과 주장을 추가하지 않습니다.
