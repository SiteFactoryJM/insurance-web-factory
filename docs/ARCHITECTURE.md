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
