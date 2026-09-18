# 운영 배포 가이드

이 문서는 데모 Worker(`insurance-web-factory-demo`)와 별개로 실고객 운영 Worker(`insurance-web-factory`)를 수동 배포하는 절차를 설명합니다.

## 0. ZIP 적용 직후 1회

저장소 최상위에서 아래 명령을 한 번 실행합니다.

```bash
node APPLY_ONCE.mjs
```

이 작업은 같은 고객의 `example.com` + `www.example.com`을 허용하되, 서로 다른 고객이 같은 루트/`www` 도메인 계열을 나눠 갖는 충돌은 막도록 기존 사이트 검증기를 수정합니다.

## 1. 최초 1회 GitHub 설정

1. GitHub 저장소의 **Settings → Environments**에서 `production` 환경을 만듭니다.
2. `production` 환경에 아래 Secret을 등록합니다.
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. 가능하면 `production` Environment에 승인 규칙을 걸어 운영 배포 전에 한 번 더 확인하도록 합니다.
4. 실고객 개인정보와 공개 승인 전 자료를 저장할 계획이라면 저장소를 Private으로 전환하거나, 실고객 설정을 별도 Private 운영 저장소로 분리합니다.

## 2. 고객 1명 추가

예: 전달받은 JSON이 `incoming/kim.json`이고 고객 ID가 `agent-kim`인 경우:

```bash
npm run studio:import -- --file "./incoming/kim.json" --id agent-kim
```

가져온 직후에는 `draft`, `noindex`, 빈 `domains` 상태를 유지합니다. 이름·직함·소속·전화번호·오픈채팅·사진 사용권·취급 범위·게시 원고·조직 검토 상태·도메인을 확인한 뒤 승인 결과에 맞게 `sites/agent-kim/site.json`을 수정합니다.

게시 예시 핵심값:

```json
{
  "status": "published",
  "domains": ["kiminsurance.kr", "www.kiminsurance.kr"],
  "seo": { "noIndex": false },
  "demo": { "enabled": false }
}
```

실제 파일의 다른 필드는 유지해야 합니다.

## 3. 여러 고객을 한 번에 추가

고객별로 고유 ID를 사용합니다.

```bash
npm run studio:import -- --file "./incoming/kim.json"  --id agent-kim
npm run studio:import -- --file "./incoming/park.json" --id agent-park
npm run studio:import -- --file "./incoming/lee.json"  --id agent-lee
```

고객마다 `sites/<id>/site.json`으로 독립 관리합니다. 고객마다 Worker나 Workflow를 복제하지 않습니다.

## 4. 로컬 확인

```bash
npm ci
npm run check
npx playwright install chromium
npm run test:e2e
npm run domains:generate
node scripts/validate-production-config.mjs
node scripts/list-production-sites.mjs
```

`wrangler.domains.jsonc`에서 아래를 확인합니다.

- `name` = `insurance-web-factory`
- `workers_dev` = `false`
- `routes`에는 `published` 이면서 `demo.enabled !== true`인 고객 도메인만 존재
- 기존 운영 고객 도메인과 신규 운영 고객 도메인이 함께 존재

## 5. GitHub 운영 배포

1. 변경사항을 `main`에 반영합니다.
2. GitHub → **Actions** → **Deploy production**을 엽니다.
3. **Run workflow**에서 `main`을 선택합니다.
4. 확인값에 정확히 `DEPLOY_PRODUCTION`을 입력합니다.
5. Workflow 성공 여부와 **Production deployment / Production verification** Summary를 확인합니다.
6. 실제 휴대폰에서 고객 도메인을 열고 전화·카카오 연결을 마지막으로 확인합니다.

운영 Workflow는 자동 Push 배포를 하지 않으며, `main` + 수동 확인값이 모두 맞아야 실행됩니다.

## 6. 기존 고객 수정

기존 고객을 다시 import할 때는 기존 `site.json`을 먼저 백업/diff합니다. 특히 `status`, `domains`, 심의/게시 확인, `seo.noIndex`가 덮어써지지 않았는지 재확인한 뒤 `npm run check` → `main` 반영 → 운영 Workflow 순서로 진행합니다.

## 7. 배포 후 자동 확인 항목

각 운영 도메인에서 자동으로 아래를 확인합니다.

- `/`, `/health`, `/privacy`, `/robots.txt`, `/sitemap.xml` → 200
- `/studio`, `/proposal`, `/templates` → 404
- `/api/consultations` → 410
- `/` HTML에 해당 고객의 공개 담당자 이름이 포함되는지 확인

최초 Custom Domain 연결 직후 TLS/DNS 전파가 늦을 수 있어 최대 10회, 15초 간격으로 제한 재시도합니다. 최종 실패하면 Workflow도 실패합니다.
