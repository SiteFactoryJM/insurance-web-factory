import assert from 'node:assert/strict';
import { appendFile } from 'node:fs/promises';
const origin=process.env.LIVE_URL || 'https://insurance-web-factory.pjmsm0319.workers.dev';
const themes=['trust-blue','warm-care','premium-navy','clean-minimal','local-friendly'];
const palettes=['navy','forest','slate','charcoal','teal','stone'];
async function get(path) {
  const url=new URL(path,origin);url.searchParams.set('verify',process.env.GITHUB_SHA?.slice(0,12)||'local');
  const response=await fetch(url,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});
  assert.ok(response.ok,`${url.pathname}: HTTP ${response.status}`);
  return response.text();
}
function shared(html) {
  assert.ok(html.includes('name="robots" content="noindex,nofollow"'),'noindex missing');
  assert.ok(html.includes('유퍼스트 해온지사'),'company name missing');
  assert.ok(html.includes('class="site-footer '),'footer missing');
  assert.ok(!html.includes('data-reading-toggle'),'old reading control remains');
}
let verified=false;
for(let attempt=1;attempt<=30;attempt++) {
  try {
    for(const theme of themes) for(const palette of palettes) {
      const html=await get(`/?theme=${theme}&palette=${palette}`);shared(html);
      assert.ok(html.includes('data-design-version="atelier-focus-v8"'),'new design not yet live');
      assert.ok(html.includes(`data-layout="${theme}" data-palette="${palette}"`),`${theme}/${palette}: wrong combination`);
      assert.ok(html.includes('data-submission-mode="discard"'),'demo discard mode missing');
      assert.ok(html.includes('실제 상담은 접수되지 않았습니다'),'demo completion notice missing');
    }
    const gallery=await get('/templates');shared(gallery);
    for(const theme of themes) assert.ok(gallery.includes(`href="/?theme=${theme}"`),`gallery: ${theme} missing`);
    for(const palette of palettes) assert.ok(gallery.includes(`name="palette" value="${palette}"`),`gallery: ${palette} missing`);
    const privacy=await get('/privacy');shared(privacy);assert.ok(privacy.includes('개인정보는 저장하거나 전송하지 않습니다.'));
    const studio=await get('/studio');assert.ok(studio.includes('id="site-preview"'),'DIY preview missing');assert.ok(studio.includes('data-action="export"'),'DIY export missing');
    const bundle=await get('/assets/studio.js');assert.ok(bundle.length>10000,'DIY bundle missing');
    verified=true;break;
  }catch(error){console.log(`Waiting for connected Cloudflare build (${attempt}/30): ${error.message}`);if(attempt<30)await new Promise(resolve=>setTimeout(resolve,10000));}
}
assert.ok(verified,'Connected Cloudflare build was not verified. Inspect Cloudflare Builds or run Deploy Cloudflare demo with configured secrets.');
const summary=`Atelier Focus v8 live verification passed: 5 layouts × 6 palettes, gallery, noindex, company name, demo-only form, completion notice and privacy.\n${origin}/templates\n`;
console.log(summary);
if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,summary);
