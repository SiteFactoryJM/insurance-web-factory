# Clear Human Figma 대응표

기준 파일: `보험설계 2026 · Clear Human · 5 Color Themes + Guide` (`ngHLfP7Li2mzqWNo8yz8Zu`). 2026-09-17 공개 브라우저에서 실제 프레임을 확인했다. Figma MCP의 편집 권한은 없었으므로 화면 읽기는 공개 파일을 기준으로 했고, 색상 값은 디자인 가이드와 리빌딩 지시서의 토큰을 교차 확인했다.

| Figma 노드 | 확인한 화면 | 코드 대응 |
| --- | --- | --- |
| `0:1` | 전체 개요, 6색·5개 읽기 방식 | `src/render/design-system.ts`, `src/types.ts` |
| `105:7` | Studio S01, 좌측 단계·중앙 선택·우측 미리보기 | `src/render/guided-studio-page.ts`, `src/studio/guided.ts` 01단계 |
| `112:82` | Studio S02, 실제 정보 입력 | 같은 파일의 03단계 |
| `112:260` | Studio S03, 검토·저장 | 같은 파일의 04단계 |
| `119:246` | 초안 저장 완료 카드 | `.g-handoff`, `.g-result`, `saveArchive()` |
| `75:547` | 고객 PC, 좌측 원고·우측 인물·직접 연락 | `renderSitePage()`, Clear Human 고객 레이아웃 |
| `75:1373` | 고객 모바일, 세로 원고·사진·하단 CTA | 공통 반응형 렌더와 모바일 하단 연락 버튼 |
| `6:2` | 6개 색상 가이드 | `PALETTES`, 단위 테스트의 정확한 토큰 스냅샷 |

## 구현 원칙

- Studio는 1440px에서 단계 탐색, 편집, 고객 미리보기의 3열 관계를 유지하고 1000px 이하에서 한 열로 전환한다.
- 배치 5종과 색상 6종은 독립 상태다. 목적별 추천만 여러 선택을 한 번에 바꾼다.
- 밝은 종이색 배경, 짙은 잉크색, 얇은 경계, 작은 모서리 반경, 단정한 고딕을 공통 언어로 사용한다.
- 고객 화면은 제작 도구 UI를 노출하지 않고 전화·오픈채팅 직접 연결과 법적 고지를 유지한다.
- Figma의 저장 데모 문구처럼 저장은 초안 생성일 뿐 게시·전송·도메인 연결이 아니다.

현재 `data-design-version`은 `clear-human-v1`이다. 정확한 6개 팔레트 값은 `src/render/design-system.ts`와 `tests/theme-architecture.test.mjs`가 고정한다.
