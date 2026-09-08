# 아키텍처

## 목표

40개 홈페이지를 40개 레포와 40개 서버로 관리하지 않고 다음 구성으로 운영합니다.

```text
여러 독립 도메인
        │
        ▼
Cloudflare DNS / TLS
        │
        ▼
Worker 1개 ── Host 헤더 확인 ── domainIndex
        │                           │
        ├── 공통 렌더러             └── site-id 선택
        ├── 5개 템플릿                    │
        ├── Static Assets                 ▼
        └── 상담 API                sites/<site-id>/site.json
```

## 요청 처리 순서

1. Worker가 정적 이미지 요청을 `ASSETS` 바인딩으로 전달합니다.
2. `Host`를 소문자·대표 형식으로 정규화합니다.
3. 빌드 시 생성된 `domainIndex`에서 사이트 ID를 찾습니다.
4. 사이트 JSON과 선택된 템플릿으로 HTML을 서버 측 렌더링합니다.
5. 데모용 workers.dev·localhost에서는 `DEMO_SITE_ID`를 사용합니다.

## 데이터의 단일 출처

설계사별 실제 원본은 `sites/<site-id>/site.json`입니다. `src/generated/sites.generated.ts`는 직접 수정하지 않고 `npm run generate`로 재생성합니다.

## 배포 단위

- Worker: 1개
- 공통 코드: 1개
- 사이트 설정: 설계사 수만큼
- 도메인: 설계사별 독립 연결
- 이미지: `public/sites/<site-id>/`

공통 수정은 전체 사이트에 영향을 주므로 PR 검수와 모바일 스크린샷 확인 후 병합합니다. 설계사 한 명의 문구·사진 변경은 해당 `site.json`과 이미지 폴더만 수정합니다.

## 상담 데이터 (2026-09-08 UI 개편)

현재 공통 신청 UI는 4단계 브라우저 데모이며 서버 호출을 하지 않습니다. 아래 D1/Webhook 구성은 남아 있는 비데모 서버의 배경 설명이지, 현재 화면의 활성화 방법이 아닙니다. 운영 전 `KAKAO_INTEGRATION.md`에 따라 별도 계약과 어댑터를 구현해야 합니다.

## 레거시 비데모 저장 구조

데모는 입력을 즉시 폐기합니다. 운영 환경은 두 방식 중 하나 또는 둘 다 사용할 수 있습니다.

- Cloudflare D1: `migrations/0001_consultations.sql`
- Webhook: `CONSULTATION_WEBHOOK_URL` 환경 변수

상담 데이터는 사이트 코드와 분리하고, 최소 권한·최소 보유기간·접근 로그 원칙으로 운영합니다.

## 확장 기준

30~40개 규모에서는 설정 파일을 빌드에 포함하는 현재 구조가 단순하고 빠릅니다. 향후 비개발자 관리자 화면, 즉시 수정, 수백 개 사이트가 필요해지면 설정을 D1/KV로 이전할 수 있으며 템플릿 렌더러와 도메인 해석 인터페이스는 그대로 유지할 수 있습니다.

## 반응형 콘텐츠 (v6)

PC 원문 필드와 선택형 모바일 원문 필드를 같은 site.json에 관리한다. 자료수집 설문 → 가져오기 → 문자 수 검증 → generate → responsiveCopy 렌더링의 순서다. 650px 이하에서 모바일 문구만 노출하고, 미작성 시 PC 원문을 사용한다. 문구를 임의로 잘라내지 않는다.

## DIY 제작 도구 (v7)

`/`는 대표 예시, `/studio`는 데모 사이트에서만 제공하는 검색 비공개 편집기다. `studio-page.ts`가 초기 예시 데이터를 안전한 JSON script로 전달한다. `src/studio/editor.ts`는 esbuild로 `public/assets/studio.js`에 묶이며, 이 생성 번들은 git에 추가하지 않는다. check·preview·deploy가 번들을 먼저 생성한다.

편집기는 서버 API와 저장소 없이 메모리에서 원고·사진·스타일을 관리한다. 공유 `renderSitePage(...,{studioPreview:true})`를 iframe srcdoc로 렌더링하므로 실제 사이트와 같은 패턴과 반응형 문구를 쓴다. PC 1440px/모바일 390px 캔버스를 작업 공간에 맞게 축소한다. 출력 미리보기에는 샘플 도구막대를 넣지 않는다.

`design`은 섹션별 패턴·순서·숨김·장식·밀도, `footer`는 사용자 푸터 원고를 담는다. 기존 JSON에 이 필드가 없으면 템플릿별 기본 패턴을 적용한다. 사이트 원본은 계속 `sites/<id>/site.json`이며 레거시 templateContent 예시를 DIY로 가져올 때 기본 원고에 해소하고 override를 제거한다.

명시적 저장 시 `project.ts`가 필드·한도·열거형·URL·이미지 서명을 검증한 JSON v1 파일을 만든다. 불러오기에도 같은 검증을 적용하며 실패하면 기존 편집값을 유지한다. `scripts/import-studio.mjs`는 이 계약을 사용해 사이트 JSON과 업로드 이미지를 추출한다. 파일 가져오기는 draft/noindex/미전송 설정을 강제하고 게시 권한·도메인을 초기화한다.

PDF는 별도 인쇄 iframe에서 선택사항과 전체 원고를 제작 의뢰서로 구성해 브라우저 인쇄를 호출한다. 상담 체험 데이터와 DIY 제작 데이터는 서로 참조하지 않는다.
