# 테마와 데모 수정 가이드

## 기본 테마 변경

`sites/demo-agent/site.json`의 `template`과 `accentColor`, `headingFont`를 수정합니다.

```json
"template": "premium-navy",
"accentColor": "#B79A63",
"headingFont": "noto-serif-kr"
```

## 실시간 비교

```text
/?theme=trust-blue
/?theme=warm-care
/?theme=premium-navy
/?theme=clean-minimal
/?theme=local-friendly
/templates
```

쿼리스트링으로 보는 테마는 미리보기이며 원본 설정을 변경하지 않습니다.

## 프로필 사진 변경

1. `public/sites/<site-id>/`에 WebP 또는 JPG를 올립니다.
2. `site.json`의 `agent.profileImage`를 바꿉니다.
3. 3:4 세로 사진, 1080×1440px 전후, 1MB 이하를 권장합니다.

## 연락 링크

```json
"contact": {
  "phone": "010-0000-0000",
  "kakaoUrl": "https://open.kakao.com/o/...",
  "instagramUrl": "https://www.instagram.com/...",
  "availableHours": "09:00–20:00"
}
```

전화 링크는 숫자만 정리해 `tel:` 주소로 생성됩니다.

## 상담 카드 이메일 모드

```json
"contact": {
  "formEmail": "manager@example.com"
},
"demo": {
  "submissionMode": "mailto"
}
```

이메일 주소가 없는 상태에서 `mailto`를 선택하면 검증이 실패합니다. 실제 서버 저장은 `store`, 데모 비저장은 `discard`를 사용합니다.
