# 현재 아키텍처 · 선택형 제작 / 직접 연락

## 데이터와 렌더링

`sites/<id>/site.json`이 실제 담당자 데이터의 원본입니다. `generate-registry.mjs`가 레지스트리를 생성하며 기존 도메인→사이트 해석은 유지합니다. 5개 레이아웃과 6개 팔레트, 섹션별 배치가 공통 렌더러를 공유합니다.

```text
site.json → generated registry → site resolver → renderSitePage
                                      ├ / : 담당자 소개·전화·오픈채팅
                                      ├ /privacy : 개인정보·외부 연결 안내
                                      └ /api/consultations : HTTP 410 (본문 미해석)
데모 사이트에서만
  /proposal          조직용 제안 범위
  /templates         화면 구성 비교
  /studio            3단계 제작 화면 + 압축 파일 내보내기
```

운영 사이트에는 제작 화면·갤러리·제안 화면을 노출하지 않습니다. 제작 화면은 `/studio` 하나뿐이며, 나가는 길도 메인(`/`) 하나로 모읍니다. 자유 편집(`/studio/advanced`)과 그 번들은 제거했습니다. 경로 분리는 로그인이나 권한 제어 시스템이 아닙니다.

## 직접 연락

`src/utils/contact-links.ts`에서 전화번호, 선택 이메일, 오픈채팅 초대 주소, 선택 인스타그램 프로필 주소를 검증합니다. 선택 팩스는 전화번호와 같은 형식으로 검증하되 링크 없이 표시합니다. `src/render/shared.ts`의 `renderContactButtons()`를 헤더·첫 화면·연락 영역·푸터·모바일 하단에서 재사용하며 버튼은 전화와 카카오톡 두 종류로 유지합니다. 이메일은 별도 `data-email-link`의 안전한 `mailto:` 링크입니다. 서버로 상담 페이로드를 보내지 않습니다. `client-script.ts`는 메뉴·이미지 대체·하단 연락 버튼의 표시와 미리보기 링크 방지만 담당합니다.

`handleConsultation()`는 이전 API 주소를 안전하게 종료하는 호환 핸들러입니다. HTTP 410과 안내만 반환합니다. 기존 `Env.DB`, `CONSULTATION_WEBHOOK_URL` 선언 및 마이그레이션은 호환/이력으로 남지만 이 핸들러가 사용하지 않습니다. DB 삭제·보유자료 정리는 별도 운영 정책입니다.

## 커스텀 템플릿 설정 화면

- `src/render/guided-studio-page.ts`: 커스텀 템플릿, 색상과 담당자/연락처/이미지 입력, PC·모바일 미리보기 UI.
- `src/studio/custom-templates.ts`: 검증된 실제 제작본의 구조·색상을 재사용 가능한 프리셋으로 관리합니다. 담당자 개인정보와 자격 이미지는 복사하지 않습니다.
- `src/studio/guided.ts`: 선택한 프리셋과 입력값을 현재 `SiteConfig`에 반영하고 공통 `renderSitePage()`로 즉시 다시 렌더링합니다.
- 김경현 템플릿과 김대경 포레스트 템플릿은 모두 `warm-care`, `noto-sans-kr`, `watermark`, 리쿠르트 활성 구조를 공유합니다. 김대경 템플릿은 색상만 포레스트 그린으로 바꿉니다.
- 좌상단 로고는 `agent.logoImage`, 푸터 로고는 `agent.logoMarkImage`를 사용합니다.
- 해온 워터마크는 `/assets/haeon-watermark-wave.png`를 기본 자산으로 사용하며 설정 화면에서 교체하지 않습니다.
- 저장은 현재 설정을 `site.json`으로 내려받는 단순 작업입니다. PDF/ZIP 인계, 목적별 추천 문구, 자유 레이아웃 편집, 문구 라이브러리 편집은 설정 화면에서 제공하지 않습니다.

## 편집 저장과 게시 경계

`초안 저장 및 시연`은 지금 입력값 그대로 큰 화면을 열고 이 브라우저에 작업 내용을 보관합니다. `파일로 내보내기`는 같은 스냅샷의 인쇄본과 작업 파일을 압축 파일 하나로 내려받습니다. 압축 파일 다운로드는 공개가 아닙니다. 저장 시작 시 현재 편집 상태를 한 번 복제해 PDF와 JSON이 서로 다른 내용을 담지 않게 합니다. 내보내기와 불러오기는 `draft`, 검색 비공개, 문의 폼 비활성, 도메인 초기화, 사실·사진·게시 확인 및 심의 상태 초기화를 적용합니다. 기존 심의번호와 유효기간도 지워 오래된 승인이 새 원고에 붙지 않게 합니다.

브라우저 보관은 기본 꺼짐이며, `초안 저장 및 시연`을 누르면 켜집니다. 사용자가 선택한 경우에만 편집 원고·프로필을 브라우저 저장소에 저장합니다. 복원·삭제가 가능하고 계정 동기화나 서버 백업은 아닙니다. 고객용 상담 데이터는 생성하지 않습니다.

## 호환성

`sections.contactForm`, `consultation.topics`, `hero.primaryCtaLabel`, `contact.formEmail`, `demo.submissionMode`는 이전 제작 파일 파서를 위해 남을 수 있습니다. 이 값으로 신청서나 전송 기능을 다시 활성화할 수 없습니다. `renderContactForm()`이라는 기존 함수명은 직접 연락 패널을 반환하는 호환 이름입니다.

## Figma 정본

`src/render/clear-human-styles.ts`가 Figma `CH2/Navy/*` 컴포넌트의 수치를 담습니다. 마지막 스타일 레이어이므로 앞선 시트의 값을 덮어씁니다. 팔레트 토큰은 `paletteStyle()`이 `--surface`, `--on-brand`, `--danger`, `--radius-control`, `--radius-contact`, 카카오 채널 색까지 함께 내보냅니다.

고객 페이지의 동작 버전은 `clear-human-v1` / `data-contact-version="direct-v1"`입니다. 소비자 `<main>`에는 사용자 요청에 따라 반영한 타이포그래피 배치를 식별하는 `data-typography-version="balanced-v2"`가 있으며, 디자인 버전 호환 식별자를 바꾸지 않습니다. `scripts/verify-live.mjs`가 이 식별자와 경로·30개 조합·API 410을 확인합니다. 실제 통화 연결과 오픈채팅방의 소유·활성 상태는 담당자 기기에서 별도로 확인해야 합니다.
