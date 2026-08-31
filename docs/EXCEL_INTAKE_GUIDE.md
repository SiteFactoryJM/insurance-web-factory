# 엑셀 접수 및 자동 가져오기

## 전달할 파일

`forms/보험설계사_홈페이지_자료수집_양식.xlsx`

시트는 네 개입니다.

1. `안내`: 작성 순서와 사진 제출 기준
2. `작성양식`: 노란색 E열 입력란과 드롭다운
3. `템플릿안내`: 5개 템플릿 비교
4. `제출전확인`: 필수값과 동의 상태 자동 점검

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

## 엑셀 필드를 추가할 때

1. `config/intake-fields.json`에 필드를 추가합니다.
2. `scripts/import-intake.mjs`의 변환 규칙을 추가합니다.
3. `scripts/build-intake-workbook.py`로 엑셀을 다시 생성합니다.
4. 테스트와 가져오기 검증을 실행합니다.

```bash
python scripts/build-intake-workbook.py
npm test
```
