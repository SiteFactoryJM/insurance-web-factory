# Clear Human Figma 대응표

기준 파일: `보험설계 2026 · Clear Human · 5 Color Themes + Guide` (`ngHLfP7Li2mzqWNo8yz8Zu`).
2026-09-17에 Figma MCP로 파일을 다시 읽었다.

## 파일에 실제로 있는 것

Figma 파일의 최상위 페이지는 두 개뿐이다.

- `0:1` — `00 · Overview`. 개요 문구와 6색 갤러리 안내.
- `36:12` — `30 · 컴포넌트 · 미드나이트 네이비`. 아래의 컴포넌트 세트.

Overview 본문이 예고하는 "고객용 60개 화면 프로토타입"과 나머지 다섯 색상의 컴포넌트 페이지는
이 파일에 존재하지 않는다. 따라서 **미드나이트 네이비 컴포넌트 세트를 정본으로 삼고**, 나머지 다섯
색상은 같은 구조에 팔레트 토큰만 바꿔 쓴다.

## 컴포넌트 대응

| Figma 노드 | 컴포넌트 | 코드 대응 |
| --- | --- | --- |
| `38:10` | CH2/Navy/Portrait | `.portrait-figure img` 등, 3:4 비율 고정 |
| `38:11` | CH2/Navy/Button | `.button`, `.button-secondary` |
| `68:39` | CH2/Navy/Contact Button | `.direct-contact-actions .button`, `.direct-phone`, `.direct-kakao` |
| `38:20` | CH2/Navy/Topic Row | `.services-list .service-card` |
| `38:24` | CH2/Navy/Topic Card | `.services-cards .service-card`, `.services-split .service-card` |
| `39:22` | CH2/Navy/Accordion | `.faq-list details` |
| `38:31` | CH2/Navy/Agent Details | `.adviser-card` (`calm-page.ts`의 `adviserCard()`) |
| `40:22` | CH2/Navy/Field | 제작 화면의 `.g-field` |

Figma에서 읽은 컴포넌트·팔레트 수치는 `src/render/clear-human-styles.ts`에 모았다. 이 시트가 마지막 레이어라 앞선
`styles.ts` · `premium-styles.ts` · `direct-contact-styles.ts`의 값을 덮는다. `balanced-v2`는 Figma 파일을 수정한 결과가 아니라, 사용자 요청에 따라 소비자 화면의 폭·타이포그래피·정보 묶음을 조정한 오버라이드다.

## 읽어 온 토큰

| Figma 변수 | 값 | 코드 토큰 |
| --- | --- | --- |
| `--ch-ink` | `#172A3D` | `--ink` |
| `--ch-brand` | `#2D4864` | `--accent` |
| `--ch-brand-hover` | `#1D3249` | `--accent-hover` |
| `--ch-soft` | `#E8EDF3` | `--tint` |
| `--ch-line` | `#CDD6E0` | `--line` |
| `--ch-control` | `#788696` | `--input` |
| `--ch-muted` | `#526170` | `--muted` |
| `--ch-surface` | `#FFFFFF` | `--surface` |
| `--ch-on-brand` | `#FFFFFF` | `--on-brand` |
| `--ch-danger` | `#AC2537` | `--danger` |
| `--ch-radius-control` | `8px` | `--radius-control` |
| `--radius-contact` | `2px` | `--radius-contact` |
| 카카오 채널 | `#EEE6D4` / `#E3D8C0` / `#C8BDA6` / `#302D24` | `--kakao`, `--kakao-hover`, `--kakao-line`, `--kakao-ink` |

여섯 팔레트의 정확한 값은 `src/render/design-system.ts`와 `tests/theme-architecture.test.mjs`가 고정한다.

## Figma 원본 타이포 기록

아래 표는 Figma에서 읽은 원본 텍스트 스타일 기록이다. `balanced-v2` 코드 토큰 값이 아니며, Figma 파일 자체는 이 작업에서 변경하지 않았다. 본문 글꼴은 Noto Sans KR이고 (`BODY_FONT`), 제목 글꼴만 선택할 수 있게 남겼다.

| 용도 | Figma | 코드 |
| --- | --- | --- |
| 담당자 이름 | 60 / 80 Bold | `--ch-display` |
| 섹션 제목 | 40 / 56 Bold | `--ch-h2` |
| 항목 제목 | 26 / 40 Bold | `--ch-h3` |
| 카드 제목 | 22 / 34 Bold | `--ch-card` |
| 본문 | 18 / 30 Regular | `--ch-body` |
| 보조 문구 | 16 / 26 Regular | `--ch-small` |

## 구현 원칙

- 고객 화면은 좌측 원고 · 우측 인물 · 담당자 정보 카드 · 직접 연락으로 구성한다.
- 화면 구성 5종과 색상 6종은 서로 독립이다. 목적별 추천만 여러 선택을 한 번에 바꾼다.
- 제작 화면은 `/studio` 하나이고, 나가는 길은 메인(`/`) 하나다.
- 고객 화면에는 제작 도구의 용어를 노출하지 않는다.
- 저장은 작업본을 만드는 동작일 뿐 게시·전송·주소 연결이 아니다.

`data-design-version`은 `clear-human-v1`으로 호환을 유지한다. 고객 첫 화면에는 `data-typography-version="balanced-v2"`가 추가되어 Figma 원본 토큰과 구분되는 사용자 요청 기반 화면 조정을 식별한다.
