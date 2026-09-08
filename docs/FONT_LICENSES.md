# 웹폰트 사용과 라이선스

확인일: 2026-09-08. DIY 제목 서체는 아래 6종입니다. 본문은 가독성과 페이지 간 일관성을 위해 Pretendard를 사용합니다. 공식 배포 저장소의 라이선스 원문을 확인했으며, 모두 SIL Open Font License 1.1로 배포됩니다. 해당 조건을 지키는 상업용 웹사이트 제작과 웹폰트 임베딩에 사용할 수 있습니다.

| 선택 이름 | 저장 ID | 실제 웹폰트 family | 공식 라이선스 |
| --- | --- | --- | --- |
| 프리텐다드 | `pretendard` | Pretendard Variable / Pretendard | [제작자 저장소 LICENSE](https://github.com/orioncactus/pretendard/blob/main/LICENSE) |
| 노토 세리프 | `noto-serif-kr` | Noto Serif KR | [Google Fonts OFL.txt](https://github.com/google/fonts/blob/main/ofl/notoserifkr/OFL.txt) |
| 노토 산스 | `noto-sans-kr` | Noto Sans KR | [Google Fonts OFL.txt](https://github.com/google/fonts/blob/main/ofl/notosanskr/OFL.txt) |
| 나눔고딕 | `nanum-gothic` | Nanum Gothic | [Google Fonts OFL.txt](https://github.com/google/fonts/blob/main/ofl/nanumgothic/OFL.txt) |
| 나눔명조 | `nanum-myeongjo` | Nanum Myeongjo | [Google Fonts OFL.txt](https://github.com/google/fonts/blob/main/ofl/nanummyeongjo/OFL.txt) |
| 고운바탕 | `gowun-batang` | Gowun Batang | [Google Fonts OFL.txt](https://github.com/google/fonts/blob/main/ofl/gowunbatang/OFL.txt) |

## 적용 범위와 조건

폰트를 이용해 만든 홈페이지나 PDF 전체가 OFL로 전환되는 것은 아닙니다. 폰트 자체의 판매·수정·재배포에는 다음 조건이 적용됩니다. 상세 판단 기준은 [OFL 1.1 공식 원문](https://openfontlicense.org/open-font-license-official-text/)입니다.

- 폰트 파일만 독립 상품으로 판매하지 않습니다.
- 폰트 파일을 프로젝트와 함께 재배포하거나 직접 호스팅할 때는 저작권 안내와 라이선스를 함께 보존합니다. 사용자가 확인할 수 있는 원문 파일 또는 적절한 메타데이터 형태를 사용합니다.
- 폰트를 수정해 배포할 때는 원문에 지정된 Reserved Font Name 조건을 확인합니다. Pretendard, 나눔 계열과 Noto Sans KR의 원문에 관련 이름이 기재되어 있습니다.
- 수정·미수정 폰트 파일은 OFL 조건을 유지합니다. 제작자의 이름으로 수정본을 보증·추천하는 것처럼 홍보하지 않습니다.

이는 확인한 공식 배포본과 현재 적용 방식에 대한 설명입니다. 출처가 다른 동명 폰트, 별도 유료 버전 또는 라이선스 조건을 벗어난 수정본까지 일괄 허용한다는 뜻은 아닙니다.

## 구현 방식

`src/render/fonts.ts`가 선택 이름, family, 실제 제공 굵기, 스타일시트 주소, 라이선스 링크를 한곳에서 관리합니다. Google Fonts 5종은 공식 `fonts.googleapis.com/css2` 스타일시트, Pretendard는 제작자가 안내한 jsDelivr 배포의 고정 버전 `v1.3.9`을 사용합니다. 폰트 바이너리는 이 저장소에 복사하지 않습니다. [Pretendard 공식 웹폰트 사용 안내](https://github.com/orioncactus/pretendard/blob/main/packages/pretendard/README.md)

실제 페이지는 선택한 제목 서체와 공통 본문 서체를 로드합니다. DIY 선택 화면에서는 6종의 실제 글꼴을 비교할 수 있도록 로드합니다. 외부 스타일시트가 차단되거나 네트워크 연결이 없으면 정의한 시스템 대체 서체로 표시됩니다.

JSON 제작 파일에는 서체 ID가 저장되므로 다시 불러오거나 CLI로 개인별 `site.json`을 만들 때 선택이 유지됩니다. PDF에서는 문서에 선택 서체 이름을 표시하고, 제목에 해당 family를 적용합니다. 제작서를 공유해도 폰트 파일 자체를 별도 상품으로 판매하는 방식은 아닙니다.
