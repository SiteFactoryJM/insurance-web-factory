# Cloudflare 배포

현재 데모 Worker 이름은 `insurance-web-factory-demo`입니다. 공개 주소를 코드에 고정하지 않고, 배포 시 Wrangler가 반환하는 `deployment-url`을 실서버 검증에 사용합니다.

고객 입력 저장, D1 상담 DB, 웹훅은 현재 기능이 아닙니다. 새 D1 바인딩이나 `CONSULTATION_WEBHOOK_URL`을 배포 요건으로 추가하지 않습니다. 이전 형식과 이력을 위한 타입·마이그레이션은 별도 운영 결정 없이 삭제하지 않습니다.

## 배포 전 확인

Node.js 22 이상에서 의존성을 설치하고 전체 검사를 실행합니다.

```bash
npm install
npm run check
npm run test:e2e
```

실제 담당자 사이트는 이름·소속·연락처·사진 권한·광고심의 상태를 확인하고 `status: published`, `seo.noIndex: false`를 의도적으로 설정해야 합니다. 데모는 `draft`와 `noindex`를 유지합니다.

## 데모 자동 배포와 실서버 확인

`main`에 변경이 반영되면 GitHub Actions의 `Deploy Cloudflare demo` 워크플로가 자동 실행됩니다.

배포 순서는 다음과 같습니다.

1. 의존성 설치
2. `npm run check`
3. Cloudflare 자격 증명 확인
4. `wrangler deploy`
5. Wrangler가 반환한 실제 `deployment-url`을 `LIVE_URL`로 전달
6. `scripts/verify-live.mjs`로 실서버 검증

따라서 일반 CI는 코드·브라우저 테스트만 담당하고, 아직 배포되지 않은 커밋을 실서버에서 먼저 검증하지 않습니다.

자동 배포를 다시 실행해야 할 때는 GitHub의 `Actions` → `Deploy Cloudflare demo` → `Run workflow`에서 브랜치를 `main`으로 선택하거나 다음 명령을 사용합니다.

```bash
gh workflow run deploy-cloudflare.yml --ref main
gh run list --workflow deploy-cloudflare.yml --limit 1
```

배포가 성공했는데 실서버 검증이 실패하면 같은 워크플로의 `Deploy Worker` 출력과 `Verify deployed Worker` 단계를 함께 확인합니다.

## 로컬 실서버 검증

`scripts/verify-live.mjs`는 `LIVE_URL`을 필수로 받습니다. 로컬에서는 확인하려는 실제 Worker 주소를 명시합니다.

PowerShell:

```powershell
$env:LIVE_URL='https://<실제-worker-주소>.workers.dev'
node scripts/verify-live.mjs
```

bash:

```bash
LIVE_URL='https://<실제-worker-주소>.workers.dev' node scripts/verify-live.mjs
```

검증이 실패하면 배포 성공으로 보고하지 않고 Cloudflare 배포 로그와 응답을 확인합니다.

## GitHub Actions 배포 준비

저장소 또는 Environment에 `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`를 등록해야 합니다. 자동 배포와 수동 재실행 모두 같은 비밀값을 사용합니다.

## 로컬 배포

Workers 편집 권한이 있는 계정으로 로그인한 뒤 실행합니다.

```bash
npx wrangler login
npm run deploy
```

로컬 배포 출력의 실제 URL을 `LIVE_URL`로 전달해 `scripts/verify-live.mjs`를 실행합니다. 이 절차는 코드 배포만 수행하며 도메인 소유 확인, 광고심의, 전화 앱과 오픈채팅방의 실제 동작 확인을 대신하지 않습니다.
