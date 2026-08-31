# AI Agent Working Rules

## 필수 순서

1. `README.md`, `docs/ARCHITECTURE.md`, 이 파일을 읽습니다.
2. 변경 전 `npm run check`를 실행합니다.
3. 사이트 원본은 `sites/<id>/site.json`만 수정합니다.
4. `src/generated/sites.generated.ts`는 직접 편집하지 않고 `npm run generate`를 사용합니다.
5. 공통 UI 변경 시 320px, 360px, 390px, 768px, 1440px 폭을 확인합니다.
6. 보험 고지·개인정보·접근성 요소를 임의로 제거하지 않습니다.
7. 기능 단위로 커밋해 언제든 롤백할 수 있게 합니다.

## 완료 기준

- `npm run check` 성공
- 잘못된 도메인 또는 사이트 ID 중복 없음
- 데모 입력 미저장 유지
- 모바일 하단 CTA가 콘텐츠를 가리지 않음
- 긴 한국어 문구가 잘리지 않음
- 프로필 이미지에 대체 텍스트 존재
- draft/noindex와 published/index 상태가 의도대로 구분됨

## 토큰·테스트 절약

- 먼저 변경 파일과 영향 범위를 좁힙니다.
- 전체 브라우저 검증은 공통 UI 변경 때만 수행합니다.
- 설계사 문구 한 건 수정은 설정 검증과 해당 사이트 미리보기를 우선합니다.
- 같은 실패 테스트를 반복하지 말고 원인을 수정한 뒤 재실행합니다.
