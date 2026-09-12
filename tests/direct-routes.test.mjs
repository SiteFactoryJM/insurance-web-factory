import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../.preview-dist/index.js';
import { siteConfigs, domainIndex } from '../.preview-dist/generated/sites.generated.js';

test('the Worker rejects arbitrary retired-API requests before any input or binding access', async () => {
  for (const method of ['GET', 'POST', 'PATCH', 'OPTIONS', 'DELETE']) {
    let accesses = 0;
    const fail = () => { accesses++; throw new Error('unexpected customer data access'); };
    const request = new Request('https://localhost/api/consultations', { method });
    for (const name of ['body', 'json', 'text', 'formData', 'arrayBuffer']) Object.defineProperty(request, name, { get: fail });
    const response = await worker.fetch(request, { get DB() { return fail(); }, get CONSULTATION_WEBHOOK_URL() { return fail(); }, get ASSETS() { return fail(); } });
    assert.equal(response.status, 410);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal((await response.json()).code, 'DIRECT_CONTACT_ONLY');
    assert.equal(accesses, 0);
  }
});

test('production domains cannot expose demo editors, gallery or proposal', async () => {
  const id = 'route-test-adviser', host = 'route-test.example';
  siteConfigs[id] = structuredClone(siteConfigs['demo-agent']);
  Object.assign(siteConfigs[id], { id, domains: [host], status: 'published', demo: { enabled: false } });
  siteConfigs[id].seo.noIndex = false;
  domainIndex[host] = id;
  try {
    for (const path of ['/studio', '/studio/advanced', '/proposal', '/templates']) {
      const response = await worker.fetch(new Request(`https://${host}${path}`), {});
      assert.equal(response.status, 404, path);
    }
    const home = await worker.fetch(new Request(`https://${host}/`), {});
    const html = await home.text();
    assert.equal(home.status, 200);
    assert.doesNotMatch(html, /class="sample-bar"|href="\/studio/);
    assert.match(html, /content="index,follow,max-image-preview:large"/);
  } finally {
    delete domainIndex[host];
    delete siteConfigs[id];
  }
});
