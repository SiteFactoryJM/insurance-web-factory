# Cloudflare 배포

현재 데모 Worker 이름은 `insurance-web-factory-demo`이며 기본 공개 주소는 다음과 같습니다.

`https://insurance-web-factory-demo.pjmsm0319.workers.dev`

고객 입력 저장, D1 상담 DB, 웹훅은 현재 기능이 아닙니다. 새 D1 바인딩이나 `CONSULTATION_WEBHOOK_URL`을 배포 요건으로 추가하지 않습니다. 이전 형식과 이력을 위한 타입·마이그레이션은 별도 운영 결정 없이 삭제하지 않습니다.

## 배포 전 확인

Node.js 22 이상에서 의존성을 설치하고 전체 검사를 실행합니다.

```bash
npm install
npm run check
npm run test:e2e
```

실제 담당자 사이트는 이름·소속·연락처·사진 권한·광고심의 상태를 확인하고 `status: published`, `seo.noIndex: false`를 의도적으로 설정해야 합니다. 데모는 `draft`와 `noindex`를 유지합니다.

## 데모 배포와 실서버 확인

현재 데모는 연결된 Cloudflare Build의 성공만으로 배포되었다고 간주하지 않습니다. `main`에 변경을 머지한 뒤 GitHub의 수동 배포 워크플로를 `main` 기준으로 실행하고, 그 실행의 성공과 새 실서버 응답을 모두 확인합니다.

```bash
gh workflow run deploy-cloudflare.yml --ref main
gh run list --workflow deploy-cloudflare.yml --limit 1
```

GitHub CLI를 사용하지 않을 때는 `Actions` → `Deploy Cloudflare demo` → `Run workflow`에서 브랜치를 `main`으로 선택합니다. 배포가 성공한 뒤 `verify-live`를 실행해 5개 구성×6개 팔레트, 직접 연락 링크, 새 hero·상담분야·이름 카드 CSS, `/studio`, `/proposal`, `/privacy`, 폐기 API의 HTTP 410을 확인합니다.

로컬에서 같은 검증을 실행할 때는 올바른 주소를 명시합니다.

PowerShell:

```powershell
$env:LIVE_URL='https://insurance-web-factory-demo.pjmsm0319.workers.dev'
node scripts/verify-live.mjs
```

bash:

```bash
LIVE_URL='https://insurance-web-factory-demo.pjmsm0319.workers.dev' node scripts/verify-live.mjs
```

검증이 실패하면 배포 성공으로 보고하지 않고 Cloudflare 빌드와 응답을 확인합니다.

## 수동 GitHub Actions 배포 준비

저장소 또는 Environment에 `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`를 등록한 뒤 GitHub의 `Actions` → `Deploy Cloudflare demo` → `Run workflow`를 실행합니다. 이 워크플로는 수동 실행만 허용합니다.

## 로컬 배포

Workers 편집 권한이 있는 계정으로 로그인한 뒤 실행합니다.

```bash
npx wrangler login
npm run deploy
```

배포 출력의 Worker 이름과 주소가 위 데모와 일치하는지 확인한 다음 `scripts/verify-live.mjs`를 실행합니다. 이 절차는 코드 배포만 수행하며 도메인 소유 확인, 광고심의, 전화 앱과 오픈채팅방의 실제 동작 확인을 대신하지 않습니다.
