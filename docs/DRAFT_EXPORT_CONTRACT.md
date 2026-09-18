# 초안 ZIP·PDF·JSON 계약

## 파일 구성

`초안 저장 · ZIP`은 브라우저에서 하나의 편집 스냅샷을 만든 뒤 정확히 두 파일을 생성한다.

- `insurance-draft_<siteId>_<UTC>_<short-id>.pdf`: 디자인·원고 검토본
- `insurance-draft_<siteId>_<UTC>_<short-id>.json`: 다시 불러올 수 있는 제작 데이터

서버 업로드, 자동 메시지, 자동 게시, 도메인 구매·연결은 수행하지 않는다. 같은 결과 카드의 ‘다시 다운로드’는 기존 Blob을 재사용한다. 편집 후에는 이전 결과를 오래된 초안으로 표시하고 새 ZIP 생성을 안내한다.

## JSON v2

```text
format: insurance-web-factory/diy
version: 2
savedAt: ISO 8601
site: 정규화된 draft SiteConfig
editor:
  copyLibraryVersion, purposeId, selectedCopy, customGroups, source
handoff:
  draftId, designVersion, exportProfile, requestedDomain
```

- 실제 원고가 선택 ID보다 우선한다. 불러올 때 원고와 라이브러리의 정확한 일치를 다시 계산하고 사용자 수정 그룹은 `customGroups`로 남긴다.
- v1은 사이트 내용을 보존해 v2로 마이그레이션한다. 알 수 없는 미래 버전과 알 수 없는 속성은 거부한다.
- 저장·불러오기 모두 `status: draft`, `seo.noIndex: true`, 빈 `domains`, `sections.contactForm: false`로 정규화한다.
- 게시 확인, 사실 확인, 사진 확인, 광고심의 번호·유효기간은 재사용하지 않는다.

## PDF

- A4 표지에 담당자, 배치, 색상, 생성 시각, 초안 ID와 비게시 안내를 표시한다.
- 공통 `renderSitePage()`에서 PC 1440px와 모바일 390px 화면을 섹션별로 캡처한다.
- 전체 원고, 모바일 원고, 전화·카카오톡과 입력된 선택 이메일·팩스, 필수 고지, 희망 도메인 안내를 검색 가능한 텍스트 부록으로 포함한다.
- 수정하지 않은 OFL 1.1 `NanumGothic-Regular.ttf`를 전체 임베딩해 복합 한글 글리프 누락을 방지한다.
- 모든 페이지에 초안 ID와 페이지 번호를 표시한다.

## 한도와 실패 처리

| 대상 | 한도 |
| --- | ---: |
| 업로드 이미지 1개 | 3 MiB |
| JSON | 8 MiB |
| PDF | 20 MiB |
| ZIP | 30 MiB |

저장 중 버튼은 비활성화하며 단계 상태를 표시한다. 실패하면 기존 편집 상태와 이전 성공 결과를 유지하고 오류를 현재 화면에 보여 준다. URL·이미지 서명·중복 필드·원고 길이·프로토타입 오염 검증은 ZIP 생성 전 공유 파서에서 수행한다.
