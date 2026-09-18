# Clear Human 검증 안내

검증일: 2026-09-18

이 문서는 현재 소스의 검증 범위와 실제 실행 결과만 기록합니다. 배포·심의·실기기 연락 확인은 코드 검사와 구분합니다.

## 자동 검사 범위

- `npm run check`: 사이트 레지스트리 생성, 제작 번들 생성, 설정 검증, TypeScript, 단위 테스트
- `npm run test:e2e`: 고객 페이지와 제작 화면, 320·360·390·768·1440px, 200% 글자 확대, 접근성, 30개 구성·색상 조합
- 이름 카드의 6개 팔레트 보조 글자 대비 4.5:1 이상
- 상담분야 list/cards/split의 3–8개 항목 대칭 배치와 긴 한국어 무잘림
- 소비자 본문·FAQ·소개·연락 영역의 폭 제한, 중앙 제목과 설명의 근접 배치, 과정 3단계와 연락 패널의 실제 bounding geometry
- 모바일 하단 연락 버튼, 프로필 이미지 대체 텍스트, 직접 전화·오픈채팅, 고객 입력 미저장
- 선택 이메일·팩스의 입력 검증, 미리보기 표시, PDF·JSON 내보내기와 재불러오기 보존
- `draft/noindex`와 `published/index` 구분, 이전 `/api/consultations`의 HTTP 410
- 배포본의 `data-design-version="clear-human-v1"`, `data-contact-version="direct-v1"`, `data-typography-version="balanced-v2"`

## 이번 실행 결과

- `npm run check` 성공: 레지스트리·제작 번들·사이트 설정·타입 검사와 단위 테스트 205개 통과. 로그: `artifacts/balanced-contact-check.log`.
- 별도 포트 8798에서 전체 Playwright 28개 통과: 5개 폭, 200% 확대, 30개 구성·색상 조합, WCAG A/AA axe, 목록 3–8개 대칭, 제목·설명·폭 geometry, 이메일·팩스의 JSON 왕복과 PDF 평문 확인. 로그: `artifacts/balanced-contact-e2e.log`.
- `scripts/verify-live.mjs`를 새 로컬 미리보기에서 실행해 버전 마커·30개 조합·제작 번들의 선택 연락 필드·API 410을 확인했습니다. 실서버는 병합 후 배포 및 CI의 `verify-live` 결과로 확인합니다.
- 최종 요소 캡처: `artifacts/balanced-typography/`. 1440px 주요 6개 영역, 390px 주요 영역, 나머지 4개 테마의 첫 화면, 선택 연락처와 제작 입력 화면을 포함합니다. 예시 이메일·팩스는 검증용 화면에만 입력했고 실제 사이트 원본에 저장하지 않았습니다.

## 별도 확인

- 실제 담당자 기기의 전화 앱과 카카오톡 로그인·오픈채팅방 활성 상태
- 실제 도메인 소유·DNS·게시 승인
- 광고심의 대상 여부와 소속 조직 승인

위 항목은 자동 검사 통과만으로 완료되었다고 보지 않습니다.
