# 배치와 색상 조합 안내

기존 5개 샘플 주소는 유지한다. `/?theme=trust-blue`, `/?theme=warm-care`, `/?theme=premium-navy`, `/?theme=clean-minimal`, `/?theme=local-friendly`.

각 페이지 최상단 시안 조합 도구의 **배치**와 **색상**을 고르고 **조합 보기**를 누른다. 두 항목은 독립적으로 적용된다. 예: `/?theme=warm-care&palette=stone`. `/templates`에서는 색상을 고른 뒤 5가지 배치를 비교한다. 추천 색상으로 돌아가면 배치별 기본 팔레트를 보여 준다. 미리보기 선택은 URL에만 반영되며 개인정보나 브라우저 저장소를 사용하지 않는다. 6개 팔레트 × 5개 배치로 30가지 조합을 제공한다.

설계사 원본 JSON의 `template`은 배치, 선택 항목 `palette`는 색상이다. `palette`가 없으면 해당 배치의 기본값을 사용한다. 이전 JSON도 계속 렌더링된다. 기존 `accentColor` 필드는 가져오기 호환을 위해 보존하며, v6 화면 색상은 대비를 검증하는 팔레트가 우선한다.

선택 항목 `templateContent`에서 배치 ID별 `headline`, `subheadline`, `mobileHeadline`, `mobileSubheadline`, `eyebrow`, `specialties`, `process`, `faqs`, `focusTitle`, `focus`를 설정한다. 생략한 항목은 기존 공통 JSON 내용을 사용한다. 데모 외 운영 사이트에서도 설정한 배치의 내용은 적용되며, URL을 통한 배치/색상 변경은 `demo.enabled`와 `demo.allowTemplateSwitch`가 모두 참일 때만 허용한다.

기본 글자는 본문 18px, 보조 16px이다. 글자 크게 버튼은 제거했고 브라우저 확대는 지원한다. 푸터는 모든 조합에서 어둡게 유지한다. 상담 폼은 실제 접수하지 않는 네 단계 샘플이다. 전화·메일·카카오톡 링크는 샘플에서 활성화하지 않는다.

색상 및 구조 세부사항은 [디자인 시스템](DESIGN_SYSTEM.md), 향후 카카오톡 연동은 [연동 계획](KAKAO_INTEGRATION.md)을 참고한다.

모바일 원고는 650px 이하에서 표시한다. 해당 배치에 PC 제목만 새로 작성하면 모바일에서도 그 제목을 사용하며, 모바일 제목만 별도로 작성하는 것도 가능하다. 글자 수 기준과 자료수집 설문은 [엑셀 작성 가이드](EXCEL_INTAKE_GUIDE.md)를 참고한다.
