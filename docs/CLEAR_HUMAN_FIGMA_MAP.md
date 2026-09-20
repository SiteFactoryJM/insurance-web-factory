# Clear Human Figma 대응표 · 2026-09-20

기준 파일: `보험설계 2026 · Clear Human · 5 Color Themes + Guide` (`ngHLfP7Li2mzqWNo8yz8Zu`).

이번 리빌딩에서는 Figma MCP로 컴포넌트뿐 아니라 실제 고객 화면과 제작자 화면까지 다시 읽었다.
최상위 페이지 목록은 Overview(`0:1`)와 컴포넌트(`36:12`) 두 개로 보이지만, Overview가 연결하는
가이드·고객 화면·Studio 프레임은 각각의 node id로 정상 조회된다. 따라서 이전 문서의
“실제 고객 화면이 파일에 없다”는 설명은 더 이상 사용하지 않는다.

## 이번 구현에 직접 사용한 Figma 노드

| Figma 노드 | 용도 | 코드 대응 |
| --- | --- | --- |
| `6:2` | 6개 팔레트 역할/HEX | `src/render/design-system.ts`, `clear-human-styles.ts` |
| `38:10` | 3:4 담당자 사진 | `calm-page.ts` profile / portrait |
| `38:11` | 기본 버튼 56px | 고객 화면·Studio 버튼 |
| `68:39` | 전화/카카오톡 버튼 58px | `renderContactButtons()` |
| `38:20` | Topic Row | 목록형 상담 분야·상담 과정 |
| `38:24` | Topic Card | 카드/분할형 상담 분야 |
| `39:22` | Accordion | FAQ |
| `38:31` | Agent Details | 어두운 담당자 정보 블록 |
| `40:22` | Field | Studio 입력란 |
| `42:7` | C01 신뢰의 기준 PC | 고객 화면의 1440px 기준 레이아웃 |
| `42:142` | C01 모바일 | 390px 고객 화면 기준 |
| `105:7` | S01 제작자 화면 | Studio의 200 / 664 / 416 3열 구조 |

## 고정 토큰

여섯 팔레트의 실제 HEX는 `src/render/design-system.ts`가 정본이다.
모든 색상은 primitive 값 → semantic 역할(`brand/ink/muted/canvas/soft/line/control`) →
component 사용(Button/Field/Topic/Accordion) 순서로 적용한다.

공통 수치는 다음과 같다.

- 본문: Noto Sans KR 18/30
- 보조 문구: 16/26
- Studio/일반 버튼: 높이 56px, radius 8px
- 전화·카카오톡: 높이 58px, radius 2px, 아이콘 21px
- PC 고객 콘텐츠 폭: 1248px (1440px 화면에서 좌우 96px)
- PC 섹션 기본 상하 여백: 64px
- 모바일 기준: 390px, 좌우 24px

## 5개 배치의 역할

- `trust-blue` — **신뢰의 기준**: 큰 제목 + 실제 인물 사진 → 행형 상담 분야 → 담당자 사실 블록.
- `warm-care` — **사람과 대화**: 담당자 소개를 앞세우고 사진/정보를 한 묶음으로 보여준다.
- `premium-navy` — **선택의 기준**: 어두운 statement hero + 점검 기준/과정 중심.
- `clean-minimal` — **한 장의 정리**: 카드 장식을 줄이고 보고서형 행/구분선으로 읽는다.
- `local-friendly` — **바로 묻는 상담**: 문의 동선을 앞쪽에 두고 장면 이미지와 직접 연락을 가깝게 배치한다.

색상과 배치는 독립이다. 팔레트를 바꿔도 문구·담당자 사실·섹션 순서는 의도하지 않는 한 바뀌지 않는다.

## Skill 역할 분리

이번 코드베이스에서 세 디자인 Skill의 책임을 다음처럼 분리한다.

1. **ui-ux-pro-max 범위**: 보험 상담/high-trust service라는 제품 맥락, 레이아웃 패턴, 접근성,
   responsive/interaction 규칙, 정보 밀도를 결정한다. 장식적 gradient/glass/card wall은 사용하지 않는다.
2. **design-system 범위**: primitive → semantic → component 토큰, typography, spacing, radius,
   button/field/accordion/topic 명세를 고정한다.
3. **design 범위**: 브랜드 인상과 페이지별 composition을 결정한다. 큰 사진, 큰 제목, 교차되는 surface,
   섹션마다 다른 리듬으로 “글만 길게 이어지는 페이지”를 피한다.

실행 환경에 위 세 이름의 별도 Skill runner가 노출되지 않는 경우에도, 이 문서의 역할 분리를 구현 규칙으로 사용한다.

## 백엔드/로직 경계

살리는 로직:
- `site.json → registry → resolver → renderSitePage`
- 5개 배치 × 6개 팔레트
- 114개 문구 / 8개 목적 추천
- 안전한 전화·이메일·카카오 링크 검증
- Studio JSON v2 import/export와 v1 migration
- PDF + JSON 2개를 담은 초안 ZIP
- opt-in 브라우저 임시 보관
- draft/noindex/심의 확인 초기화
- `/api/consultations` HTTP 410 호환 처리

삭제·재활성화하지 않는 로직:
- 고객 입력 폼
- 서버 상담 데이터 저장
- 자동 카카오/이메일 발송
- 웹훅 기반 접수
- 예시 후기·가짜 경력·가짜 자격

신규 UI 로직은 위 경계를 넘지 않는다. Studio 미리보기에서도 외부 연락 링크는 계속 차단된다.
