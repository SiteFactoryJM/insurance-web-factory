# 엑셀 접수 및 자동 가져오기

## 전달할 파일

`forms/보험설계사_홈페이지_자료수집_양식.xlsx`

시트는 네 개입니다.

1. `안내`: 작성 순서와 사진 제출 기준
2. `작성양식`: 노란색 E열 입력란, PC/모바일 별도 행, H열 글자수 기준
3. `템플릿안내`: 5개 배치와 6개 색상 비교 안내
4. `제출전확인`: 필수값과 동의 상태 자동 점검

## 먼저 답할 세 가지

작성양식 최상단의 `콘텐츠 기획`에서 홈페이지의 목적(100자 이내), 주로 만날 고객(80자 이내), 방문자가 할 첫 행동(60자 이내)을 적습니다. 선택 항목이며 기존 양식도 계속 가져올 수 있습니다. 이 답변은 `contentBrief`에 제작 참고용으로 보관하며 방문자 화면에는 그대로 노출하지 않습니다.

예: “현재 보장을 처음 점검하는 직장인이 상담 방식을 이해하고, 편한 시간에 문의하도록 안내한다.” 실제 경력·상담 범위와 확인 가능한 사실을 기준으로 문구를 작성합니다.

## PC와 모바일 문구를 따로 작성하기

PC 행 바로 아래의 모바일 행에 짧은 문구를 적습니다. 모든 길이는 **공백과 줄바꿈 포함**이며, 프로젝트에서 정한 편집 기준입니다.

| 영역 | PC | 모바일 | 시스템키 예시 |
| --- | ---: | ---: | --- |
| 메인 제목 | 40자 이내 | 24자 이내 | `headline` / `mobile_headline` |
| 메인 설명 | 120자 이내 | 60자 이내 | `subheadline` / `mobile_subheadline` |
| 소개 제목 | 40자 이내 | 24자 이내 | `intro_title` / `intro_mobile_title` |
| 상세 소개 | 400자 이내 | 100자 이내 | `intro_body` / `intro_mobile_body` |
| 상담 분야 설명 | 120자 이내 | 48자 이내 | `specialty_1_body` / `specialty_1_mobile_body` |
| 상담 절차 설명 | 120자 이내 | 48자 이내 | `process_1_body` / `process_1_mobile_body` |
| FAQ 답변 | 240자 이내 | 80자 이내 | `faq_1_answer` / `faq_1_mobile_answer` |

모바일 문구는 선택입니다. 비우면 PC 원문을 그대로 보여주며, 문장을 잘라서 표시하지 않습니다. 화면 폭 650px 이하에서 모바일 문구를 사용합니다. 예를 들어 PC 설명 “현재 보장 범위와 기간을 살펴보고 다음에 확인할 내용을 정리합니다.”는 모바일에서 “가입한 보장과 기간을 함께 확인합니다.”로 작성할 수 있습니다.

FAQ의 조건·불이익 안내, 개인정보 안내, 보험 고지는 모바일에서도 유지해야 합니다. 짧게 줄이기 어려우면 모바일 칸을 비우고 PC 원문을 사용하세요. 분야·절차·FAQ는 제목/질문과 PC 설명/답변을 함께 입력해야 합니다. 모바일 문구만 입력하면 오류를 표시합니다.

H열에서 항목별 최대 글자수를 확인할 수 있습니다. 가져오기와 `npm run validate:sites`는 Unicode code points 기준으로 길이를 검사합니다. 초과하면 항목명·최대 글자수·현재 글자수를 알려주고 중단하며, 원문을 자동으로 자르지 않습니다. 주요·보조 버튼은 12자 이내를 권장하며, 주요 버튼은 상담 요청 영역, 보조 버튼은 상담 분야 영역으로 연결됩니다.

배치별 문구를 직접 설정할 때는 `templateContent.<template>.mobileHeadline`, `mobileSubheadline`, 카드의 `mobileBody`, FAQ의 `mobileAnswer`에도 동일한 기준을 적용합니다. 설계사 문구의 원본은 항상 `sites/<id>/site.json`입니다.

## 설계사에게 받을 폴더 예시

```text
incoming/kim-haneul/
├── 김하늘_홈페이지자료.xlsx
├── profile.jpg
├── logo.png          # 선택
└── og-image.jpg      # 선택
```

엑셀에 적은 이미지 파일명과 실제 파일명이 정확히 같아야 합니다. 이미지 확장자는 JPG, JPEG, PNG, WEBP, SVG를 지원합니다.

## 한 건 가져오기

```bash
npm run intake:import -- --file ./incoming/kim-haneul/김하늘_홈페이지자료.xlsx
```

안전하게 결과만 확인:

```bash
npm run intake:import -- --file ./incoming/kim-haneul/김하늘_홈페이지자료.xlsx --dry-run
```

기존 사이트를 승인 후 덮어쓰기:

```bash
npm run intake:import -- --file ./incoming/kim-haneul/김하늘_홈페이지자료.xlsx --overwrite
```

## 여러 건 일괄 가져오기

`--dir`은 지정 폴더의 `.xlsx` 파일을 이름순으로 처리합니다.

```bash
npm run intake:import -- --dir ./incoming
```

처리된 엑셀을 `processed/`로 이동:

```bash
npm run intake:import -- --dir ./incoming --move
```

설계사별 하위 폴더를 사용하는 경우 현재 스크립트는 각 폴더를 개별 `--file`로 지정하는 방식을 권장합니다. 사진은 엑셀 파일과 같은 폴더에서 찾습니다.

## 가져오기 후 확인

```bash
npm run check
```

검사 항목:

- 사이트 ID·도메인 중복
- 템플릿·폰트·HEX 색상
- 최소 3개 전문분야와 필요한 FAQ·절차
- 프로필·로고·공유 이미지 존재 여부
- 검색 제목 중복
- 게시 사이트의 도메인·사실 확인·사용권·게시 동의
- PC/모바일 문구의 최대 글자수와 불완전한 카드·FAQ 입력

## 엑셀 필드를 추가할 때

1. `config/intake-fields.json`에 필드를 추가합니다.
2. `scripts/import-intake.mjs`의 변환 규칙을 추가합니다.
3. `npm run intake:build`로 엑셀을 다시 생성합니다.
4. 테스트와 가져오기 검증을 실행합니다.

```bash
npm run intake:build
npm test
```

생성기는 저장소에서 이미 사용하는 ExcelJS로 네 시트, 입력란, 드롭다운, 글자수 기준, 필수값·동의 점검 수식을 생성합니다. `python scripts/build-intake-workbook.py`도 동일한 생성기를 실행하는 기존 명령으로 유지됩니다. 별도의 Python `artifact_tool` 설치는 필요하지 않습니다.

양식을 갱신하면 실제 `.xlsx`를 다시 읽어 시스템키·E열 입력값·수식 참조를 확인하고 네 시트의 배치와 줄바꿈을 검수합니다. Excel의 계산 엔진이 없는 환경에서는 수식과 초기 계산값, 셀 구조를 검증하되 Excel 앱에서의 재계산 검수 여부를 구분해 기록합니다.
