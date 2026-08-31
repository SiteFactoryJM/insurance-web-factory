# 운영 절차

## 신규 수주

1. 예시 workers.dev 페이지와 `/templates`를 보여줍니다.
2. 선택한 템플릿, 예상 도메인, 추가 변경 범위를 기록합니다.
3. 자료수집 엑셀과 사진 가이드를 전달합니다.
4. 초안은 `draft`, `noIndex` 상태로 생성합니다.
5. 모바일 360px·390px와 데스크톱에서 검수합니다.
6. 소속 회사/GA의 준법 확인 후 `published`로 변경합니다.
7. Custom Domain을 연결하고 실기기에서 전화·상담·개인정보 링크를 확인합니다.

## 변경 요청

- 설계사 개인 정보: 해당 `sites/<id>/site.json`만 수정
- 사진: `public/sites/<id>/` 교체
- 모든 사이트 공통 UI: `src/render/` 수정 후 전체 회귀 테스트
- 템플릿 추가: 타입, 엑셀 옵션, 렌더러, CSS, 테스트, 문서를 함께 수정

## 체크포인트

권장 브랜치 이름:

```text
site/add-kim-haneul
site/update-kim-haneul
fix/mobile-contact-bar
feature/new-template
```

커밋 예시:

```text
feat(site): add kim-haneul draft
content(site): update consultation copy for kim-haneul
fix(ui): prevent mobile CTA overlap
```

## 정기 점검

- 매월: 도메인 만료와 인증서·연락처 확인
- 분기: 심의번호 유효기간, 소속·경력·개인정보 보유정책 확인
- 배포마다: `npm run check`, 5개 템플릿 모바일 스크린샷, `/health`
- 상담 DB 운영 시: 접근자·보유기간·백업·삭제 로그 점검
