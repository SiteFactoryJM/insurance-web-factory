# Cloudflare 배포

## 1. 사전 준비

- Cloudflare 계정
- Node.js 22 이상
- `CLOUDFLARE_ACCOUNT_ID`
- Workers 편집 권한이 있는 `CLOUDFLARE_API_TOKEN`

공식 문서:

- https://developers.cloudflare.com/workers/get-started/guide/
- https://developers.cloudflare.com/workers/static-assets/
- https://developers.cloudflare.com/workers/wrangler/commands/

## 2. 로컬 확인

```bash
npm install
npm run check
npm run dev
```

## 3. 예시 페이지 배포

`wrangler.jsonc`의 이름은 `insurance-web-factory-demo`이며 `workers_dev`가 활성화되어 있습니다.

```bash
npx wrangler login
npm run deploy
```

배포 후 표시되는 `*.workers.dev` 주소는 수주용 예시 페이지로 사용할 수 있습니다. 예시 페이지는 `noindex`이며 상담 폼 입력을 저장하지 않습니다.

## 4. GitHub Actions 배포

저장소 또는 Environment에 다음 Secrets를 등록합니다.

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

GitHub의 `Actions` → `Deploy Cloudflare demo` → `Run workflow`를 실행합니다. 워크플로는 수동 실행만 허용하여 Secrets가 없는 초기 상태에서 불필요한 실패가 발생하지 않게 했습니다.

## 5. 실제 상담 DB 연결

D1 데이터베이스 생성 후 마이그레이션을 적용합니다.

```bash
npx wrangler d1 create insurance-consultations
npx wrangler d1 migrations apply insurance-consultations --remote
```

반환된 바인딩을 `wrangler.jsonc`의 `d1_databases`에 추가하고 바인딩 이름을 `DB`로 맞춥니다.

상담 알림 서비스를 함께 사용할 때 Worker Secret을 등록합니다.

```bash
npx wrangler secret put CONSULTATION_WEBHOOK_URL
```

## 6. 운영 전 확인

- 데모의 예시 개인정보·전화번호·주소 교체
- 실제 페이지의 `demo` 블록 제거
- `status: published`
- `seo.noIndex: false`
- 광고심의 및 고지 문구 승인
- 상담정보 보유기간과 삭제 절차 확정
- Custom Domain 연결
