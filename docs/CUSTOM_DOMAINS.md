# 독립 도메인 연결

## 사이트 JSON에 도메인 입력

```json
{
  "id": "kim-haneul",
  "status": "published",
  "domains": [
    "kim-haneul.kr",
    "www.kim-haneul.kr"
  ]
}
```

`npm run validate:sites`는 모든 사이트의 도메인 중복을 검사합니다.

## Wrangler 설정 생성

```bash
npm run domains:generate
```

생성 파일 `wrangler.domains.jsonc`에는 게시 상태이며 데모가 아닌 사이트의 도메인이 Custom Domain route로 들어갑니다.

```bash
npm run deploy:domains
```

공식 문서:

- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/

## 권장 도메인 처리

- 루트 도메인과 `www`를 모두 연결합니다.
- 사이트 JSON의 첫 번째 도메인을 canonical 주소로 사용합니다.
- 한 도메인을 두 사이트에 넣지 않습니다.
- 만료일·자동갱신·DNS 소유 계정을 운영대장에 기록합니다.
- 계약 종료 시 사이트를 먼저 `draft`로 내린 뒤 도메인 route를 제거합니다.

## 여러 Zone 운영

도메인이 각각 별도 Zone이어도 동일 Worker 코드로 연결할 수 있습니다. 다만 계정 권한, 도메인 소유권, 인증서 상태를 도메인별로 확인해야 합니다. 배포 후 각 도메인에서 `/health`, `/robots.txt`, 모바일 메인 페이지를 점검합니다.
