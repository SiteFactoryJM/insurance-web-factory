# Insurance Web Factory

보험설계사 소개 홈페이지 30~40개를 하나의 코드베이스에서 생성·검수·배포하기 위한 Cloudflare Workers 멀티사이트 프로젝트입니다.

설계사는 자료수집 엑셀과 사진을 제출하고, 운영자는 설정 파일을 생성해 도메인별 홈페이지를 배포합니다. 공통 기능을 수정하면 전체 사이트에 반영되며, 각 설계사는 문구·사진·레이아웃·색상·노출 영역을 독립적으로 선택할 수 있습니다.

## 현재 데모

- 설계사: 이윤복 보험설계사
- 소속: 유퍼스트 해온지
- 프로필 사진: `public/sites/demo-agent/lee-yunbok-profile.webp`
- 기본 레이아웃: `trust-blue`
- 데모 주소: `https://insurance-web-factory.pjmsm0319.workers.dev`
- 레이아웃 비교: `/templates`

데모는 검색 노출을 막는 `noIndex` 상태이며 상담 카드 입력값도 저장하지 않습니다. 실제 운영 전에는 소속 회사 또는 GA의 최신 광고심의·준법·개인정보 기준을 별도로 확인해야 합니다.

## 서로 다른 다섯 가지 레이아웃

| ID | 화면 방향 | 핵심 구조 |
|---|---|---|
| `trust-blue` | 인스티튜셔널 | 기업형 히어로, 상담 범위 원장, 기록형 후기, 아코디언 FAQ |
| `warm-care` | 휴먼 에디토리얼 | 사진과 본문을 나눈 편집형 히어로, 대표 후기, 탭형 FAQ |
| `premium-navy` | 프라이빗 컨설팅 | 전면 사진 히어로, 상담가 정보 패널, 세로 프로세스, 프리미엄 후기 카드 |
| `clean-minimal` | 리포트 미니멀 | 보고서형 3열 히어로, 번호 체계, 표형 서비스·후기·FAQ |
| `local-friendly` | 모바일 컨시어지 | 연락 수단 우선 히어로, 상담 메뉴 보드, 사례형 후기, 전체 노출 FAQ 카드 |

주소 뒤에 테마를 붙여 바로 비교할 수 있습니다.

```text
/?theme=trust-blue
/?theme=warm-care
/?theme=premium-navy
/?theme=clean-minimal
/?theme=local-friendly
/templates
```

## 모바일 연락 동작

모바일 화면 하단에는 다음 세 가지 연락 수단만 고정됩니다.

- 전화: `tel:` 링크로 기본 전화 앱 연결
- 카카오톡: 오픈채팅 링크 연결
- 인스타그램: 설계사 프로필 연결

이모지는 위 세 연락 수단의 식별 표시로만 사용하고, 나머지 UI에는 SVG 선형 아이콘과 텍스트를 사용합니다.

## 상담 카드와 이메일 전달

기본 데모는 개인정보가 저장되지 않도록 설정되어 있습니다.

```json
"contact": {
  "email": "",
  "formEmail": ""
},
"demo": {
  "submissionMode": "discard"
}
```

담당 이메일 앱으로 상담 내용을 넘기려면 사이트 설정에 받는 주소를 넣고 제출 방식을 바꿉니다.

```json
"contact": {
  "formEmail": "manager@example.com"
},
"demo": {
  "submissionMode": "mailto"
}
```

브라우저가 이름·연락처·상담 희망 내용을 포함한 이메일 초안을 열어주며, 최종 전송은 사용자가 이메일 앱에서 확인합니다. 서버 저장 방식은 `submissionMode: "store"`와 D1 또는 Webhook 구성을 사용합니다.

## 설계사 한 명 추가하기

```bash
npm run intake:import -- --file ./incoming/이윤복/이윤복_홈페이지자료.xlsx
npm run check
```

여러 명을 한 번에 가져올 때:

```bash
npm run intake:import -- --dir ./incoming --move
```

사이트 설정은 다음과 같이 생성됩니다.

```text
sites/<site-id>/site.json
public/sites/<site-id>/profile.webp
```

## 주요 설정 항목

`sites/<site-id>/site.json`에서 다음을 바꿀 수 있습니다.

- 설계사 이름·소속·연락처·상담 가능 시간
- 전화·카카오톡·인스타그램 연결
- 프로필·로고·공유 이미지
- 소개 문구, 상담 분야, 진행 단계
- 고객 후기와 예시 여부
- FAQ 문답
- 5개 레이아웃과 포인트 색상
- 후기·FAQ·프로세스·상담 카드 표시 여부
- SEO와 검색 노출 상태
- 광고심의·게시 동의·개인정보 고지

## 개발 및 검증

```bash
npm install
npm run check
npm run dev
```

`npm run check`는 사이트 레지스트리 생성, 설정 검증, TypeScript 검사와 테스트를 실행합니다. `main` 브랜치에 푸시하면 연결된 Cloudflare Workers Builds에서 자동 배포됩니다.

## 구조

```text
insurance-web-factory/
├── forms/                     # 설계사 자료수집 엑셀
├── sites/                     # 설계사별 JSON 설정
├── public/sites/<site-id>/    # 프로필·로고·공유 이미지
├── src/render/templates/      # 구조가 다른 5개 레이아웃
├── src/render/                # 공통 연락·폼·스타일·클라이언트 동작
├── scripts/                   # 엑셀 가져오기·검증·레지스트리 생성
├── tests/                     # 데이터·레이아웃 회귀 테스트
└── docs/                      # 운영 및 디자인 문서
```

## 운영상 주의

- 고객 후기는 실제 고객 동의와 사실 확인을 거친 문구만 게시합니다.
- 데모 후기에는 `isExample: true`를 표시하고 화면에도 예시임을 고지합니다.
- 실제 공개 전 등록번호, 소속, 연락처, 고지 문구와 광고심의 상태를 검수합니다.
- 프로필 사진 사용권과 게시 동의를 기록합니다.
- 실서비스 상담 카드는 개인정보 보유기간과 삭제 절차를 확정한 뒤 저장 모드로 전환합니다.
