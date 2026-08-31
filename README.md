# Insurance Web Factory

보험설계사 소개 홈페이지 30~40개를 **하나의 코드베이스**에서 생성·검수·배포하기 위한 Cloudflare Workers 멀티사이트 프로젝트입니다.

설계사는 엑셀 양식과 사진만 제출하고, 운영자는 가져오기 명령 한 번으로 사이트 설정을 생성합니다. 공통 기능이나 디자인을 수정하면 모든 사이트에 반영되며, 접속한 도메인에 따라 해당 설계사 홈페이지가 자동으로 노출됩니다.

## 핵심 기능

- 도메인별 사이트 자동 분기: `kim-insurance.kr` → `sites/kim/...`
- 보험설계사 자료수집 엑셀 양식 및 일괄 가져오기
- 모바일 우선 반응형 UI와 하단 고정 전화·상담 버튼
- 5개 템플릿: `trust-blue`, `warm-care`, `premium-navy`, `clean-minimal`, `local-friendly`
- Pretendard 본문 + 선택형 Noto Serif KR 제목, 총 2개 한글 글꼴 체계
- SEO 메타데이터, 구조화 데이터, robots.txt, sitemap.xml
- 광고심의·사진 사용권·게시 동의 검증
- 데모 상담 폼 입력값 미저장
- 실제 운영용 Cloudflare D1·Webhook 상담 접수 확장점
- GitHub Actions 검증 및 수동 Cloudflare 배포 워크플로

## 빠른 시작

```bash
npm install
npm run check
npm run dev
```

Cloudflare 로컬 주소에서 데모 사이트가 열립니다. 데모에서는 우측 하단 선택기로 5개 템플릿을 즉시 비교할 수 있습니다.

```text
/?theme=trust-blue
/?theme=warm-care
/?theme=premium-navy
/?theme=clean-minimal
/?theme=local-friendly
/templates
```

## 설계사 한 명 추가하기

1. `forms/보험설계사_홈페이지_자료수집_양식.xlsx`를 설계사에게 전달합니다.
2. 작성된 엑셀과 프로필 사진을 같은 폴더에 받습니다.
3. 초안으로 가져옵니다.

```bash
npm run intake:import -- --file ./incoming/김하늘/김하늘_홈페이지자료.xlsx
```

여러 명을 한 번에 가져올 때:

```bash
npm run intake:import -- --dir ./incoming --move
```

가져오기 결과:

```text
sites/kim-haneul/site.json
public/sites/kim-haneul/profile.jpg
public/sites/kim-haneul/logo.png
```

이후 아래 명령으로 전체 설정을 확인합니다.

```bash
npm run check
```

> `published` 사이트는 대표 도메인, 사실 확인, 사진 사용권, 게시 동의가 모두 필요합니다. 검수 전에는 반드시 `draft`를 사용합니다.

## 사이트 설정과 디자인 변경

각 사이트의 `site.json`에서 다음을 독립적으로 변경할 수 있습니다.

- 메인·소개·상담 문구
- 템플릿과 포인트 색상
- 프로필 사진·로고·공유 이미지
- 전문 상담 분야와 상담 절차
- 경력, FAQ, 주소, 상담 시간
- 경력·FAQ·지도·상담 폼 노출 여부
- SEO 제목과 설명
- 광고심의 번호·고지 문구·개인정보 보유기간

공통 디자인 변경은 `src/render/` 아래에서 한 번만 수정합니다.

## 구조

```text
insurance-web-factory/
├── config/                    # 엑셀 필드 규격
├── forms/                     # 배포용 자료수집 엑셀
├── sites/                     # 설계사별 JSON 설정
├── public/
│   ├── assets/                # 공통 이미지
│   └── sites/<site-id>/       # 설계사별 사진·로고
├── src/
│   ├── render/templates/      # 5개 템플릿
│   ├── routes/                # 상담·SEO 라우트
│   └── generated/             # 자동 생성 사이트 레지스트리
├── scripts/                   # 엑셀 가져오기·검증·배포 설정 생성
├── migrations/                # 상담 DB 스키마
└── docs/                      # 운영 문서
```

## 주요 명령

| 명령 | 용도 |
|---|---|
| `npm run generate` | `sites/*/site.json`을 Worker 레지스트리로 생성 |
| `npm run validate:sites` | 필수값·중복 도메인·이미지·준법 동의 검사 |
| `npm run intake:import -- --file ...` | 설계사 엑셀 한 건 가져오기 |
| `npm run intake:import -- --dir ...` | 폴더 내 엑셀 일괄 가져오기 |
| `npm run domains:generate` | 운영 도메인을 포함한 Wrangler 설정 생성 |
| `npm run check` | 생성·검증·타입 검사·테스트 전체 실행 |
| `npm run dev` | Wrangler 로컬 개발 서버 |
| `npm run deploy` | workers.dev 데모 배포 |
| `npm run deploy:domains` | 실제 Custom Domain 포함 운영 배포 |

## 문서

- [아키텍처](docs/ARCHITECTURE.md)
- [엑셀 접수·가져오기](docs/EXCEL_INTAKE_GUIDE.md)
- [Cloudflare 배포](docs/CLOUDFLARE_DEPLOY.md)
- [도메인 연결](docs/CUSTOM_DOMAINS.md)
- [디자인 시스템](docs/DESIGN_SYSTEM.md)
- [준법·개인정보 체크리스트](docs/COMPLIANCE_CHECKLIST.md)
- [운영 절차](docs/OPERATIONS.md)

## 중요한 운영 원칙

이 프로젝트는 기술적 게시 장치를 제공합니다. 보험 광고 문구, 등록번호, 심의번호, 고지 문구, 개인정보 처리 방식은 실제 소속 보험사 또는 GA의 최신 준법 기준에 따라 확정해야 합니다. 데모 데이터는 모두 예시이며 검색엔진에 노출되지 않도록 설정되어 있습니다.
