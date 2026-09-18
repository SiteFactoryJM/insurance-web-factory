# Insurance Web Factory · 선택형 상담 페이지

보험사·GA·지사에 제안하는 **담당자 소개 페이지 제작·운영 기반**입니다. 개인별 사이트 JSON과 공통 렌더러를 사용합니다. 일반 사용자는 빈 문장을 작성하기보다 목적과 문구를 선택하고, 실제 이름·소속·연락처를 확인합니다.

## 제공 범위

- 전화 아이콘 버튼 → `tel:` 링크. 카카오톡 버튼 → 설정된 오픈채팅 초대 주소.
- 고객용 온라인 신청서, 서버 상담 저장, 카카오톡 자동 발송, 웹훅 전송은 제공하지 않습니다.
- 문구 선택지 **114개**: 첫 화면 24, 소개 16, 상담 분야 24, 상담 과정 8세트, FAQ 30, 하단 안내 12.
- 목적별 추천 구성 **8개**, Clear Human 레이아웃 5개와 독립 팔레트 6개(총 30개 조합)를 제공합니다.
- `/studio`: 디자인과 문구 → 실제 정보 → 확인하고 저장의 3단계 제작 흐름. 화면 구성·색상과 문구 선택을 한 화면에서 고르고, 구성이나 색상을 바꿔도 고른 문구는 유지됩니다. 어느 단계에서든 `크게 보기`로 실제 크기 화면을 열고 ✕로 닫습니다. 가로 768px 미만에서는 안내만 표시합니다.
- `/proposal`: 보험사·GA·지사에 설명할 제공 범위와 운영 절차. 고객 상담 페이지와 구분합니다.
- `초안 저장 및 시연`은 입력값 그대로의 큰 화면을 열고 이 브라우저에 작업 내용을 보관합니다. `파일로 내보내기`는 인쇄용 화면과 다시 불러올 작업 파일을 정확히 두 개만 담은 압축 파일을 내려받습니다.

114개는 개별 UI 선택지 수입니다. 상담 과정은 3개 단계로 이루어진 한 묶음을 하나로 셉니다. 추천 원고는 광고심의 완료 문구가 아니며 실제 취급 범위와 조직 기준에 맞춰 확인해야 합니다. 경력·성과·후기를 자동으로 만들어 넣지 않습니다.

## 연락 방식

사이트 원본 `sites/<id>/site.json`의 `contact.phone`, `contact.kakaoUrl`, `contact.availableHours`와 선택 항목인 `contact.email`, `contact.fax`를 사용합니다. 오픈채팅은 `https://open.kakao.com/o/초대코드` 형식만 허용합니다. 이메일은 헤더나 쿼리가 없는 검증된 `mailto:` 링크로, 팩스는 일반 텍스트로 표시합니다. 다른 도메인, 실행 가능한 URL, 쿼리 전달, 로그인·메시지 API를 사용하지 않습니다. 전화 앱이 없는 PC를 위해 번호를 텍스트로도 표시합니다.

대표 샘플의 전화와 오픈채팅 버튼은 **실제 담당자에게 연결**됩니다. 샘플 안내를 유지합니다. 제작 도구의 iframe 미리보기에서는 실제 연결을 막습니다. 메시지를 자동으로 작성하거나 보내지 않습니다.

이전 `/api/consultations`는 모든 요청에 HTTP 410을 반환합니다. 요청 본문을 읽거나 DB·웹훅을 호출하지 않습니다. 기존 DB와 마이그레이션 파일을 삭제하는 변경은 포함하지 않습니다.

## 로컬 실행과 검증

Node.js 22 이상을 사용합니다.

```bash
npm install
npm run check
npx playwright install chromium
npm run test:e2e
npm run preview
```

`npm run check`는 사이트 레지스트리와 제작 화면 번들을 생성하고 설정·타입·단위 테스트를 실행합니다. `src/generated/sites.generated.ts`와 `public/assets/guided-studio.js`는 직접 수정하지 않습니다.

제작 화면과 고객 페이지는 같은 `renderSitePage()`와 작업 파일 v2 형식을 사용합니다. v1 작업 파일은 불러올 때 v2로 옮기며, 오픈채팅 이외의 카카오 링크는 수정해야 합니다. 새 저장·가져오기는 게시 권한과 기존 심의번호를 초기화한 작업본입니다. 파일 내보내기는 브라우저 안에서만 처리되며 서버 업로드·자동 전송·자동 공개를 하지 않습니다.

디자인 정본은 Figma `보험설계 2026 · Clear Human`의 `CH2/Navy/*` 컴포넌트이며, 수치는 `src/render/clear-human-styles.ts`에 모여 있습니다. Figma 원본을 바꾸지 않고 사용자 요청에 따라 반영한 소비자 화면 타이포그래피·폭 조정은 `data-typography-version="balanced-v2"`로 식별하고, `clear-human-v1` 디자인 호환 버전은 유지합니다.

## 실제 게시

자료수집 → 문구·연락처 선택 → 사실·사진 권한 확인 → 소속 조직 검토 → 도메인 및 게시 설정 → 실기기 확인 순서입니다. 데모가 아닌 실제 게시 설정에서 `advertisingReviewStatus: pending`은 검증 오류입니다. 심의 대상 여부와 `approved`/`not-required` 구분은 조직이 확인해야 합니다.

선택형 제작의 확인란은 작성자의 점검 기록일 뿐 승인 시스템이나 전자결재가 아닙니다. 저장 버튼은 공개 버튼이 아닙니다. 초안은 `draft`, `noIndex: true`로 유지하며 실제 게시와 수정 이력 관리는 기존 Git 기반 절차를 사용합니다.

## 관련 문서

- `docs/DIY_STUDIO_GUIDE.md`: 제작 화면 사용법
- `docs/KAKAO_INTEGRATION.md`: 전화·오픈채팅 직접 연결 계약
- `docs/ARCHITECTURE.md`: 현재 코드 구조와 호환 필드
- `docs/OPERATIONS.md`: 조직 단위 운영 절차
- `docs/B2B_HANDOFF.md`: 제안 범위와 인수 기준
- `docs/CLEAR_HUMAN_FIGMA_MAP.md`: Figma 화면과 코드 대응표
- `docs/DRAFT_EXPORT_CONTRACT.md`: 내보내기 파일 구성과 한도
- `docs/DESIGN_SYSTEM.md`: Clear Human 색상·배치·접근성 기준
- `docs/THEME_AND_DEMO_GUIDE.md`: 5개 구성·6개 팔레트와 데모 사용법
- `docs/CLOUDFLARE_DEPLOY.md`: 현재 데모 배포와 실서버 확인 절차
- `docs/COMPLIANCE_CHECKLIST.md`: 게시 전 준법·외부 연결 확인 항목
- `docs/REBUILD_VALIDATION.md`: 현재 자동 검증 범위와 실제 결과

고객관리 CRM, 상담 수신함, 카카오 자동 전송, 온라인 보험 가입, 자동 분석, 계정·역할·결재 시스템은 구현 범위에 포함되지 않습니다. 버튼 클릭만으로 상담 완료 또는 영업 성과를 측정한다고 설명하지 않습니다.
