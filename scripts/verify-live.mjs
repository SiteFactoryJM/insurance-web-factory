import assert from 'node:assert/strict';
import { appendFile } from 'node:fs/promises';
const origin=process.env.LIVE_URL||'https://insurance-web-factory.pjmsm0319.workers.dev';
const themes=['trust-blue','warm-care','premium-navy','clean-minimal','local-friendly'];
const palettes=['navy','forest','slate','charcoal','teal','stone'];
async function get(path){const url=new URL(path,origin);url.searchParams.set('verify',process.env.GITHUB_SHA?.slice(0,12)||'local');const res=await fetch(url,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});assert.ok(res.ok,`${url.pathname}: HTTP ${res.status}`);return res.text();}
function shared(html){assert.ok(html.includes('name="robots" content="noindex,nofollow"'));assert.ok(html.includes('유퍼스트 해온지사'));assert.ok(html.includes('class="site-footer '));assert.ok(!html.includes('data-reading-toggle'));}
let verified=false;
for(let attempt=1;attempt<=30;attempt++){
 try{
  for(const theme of themes)for(const palette of palettes){const html=await get(`/?theme=${theme}&palette=${palette}`);shared(html);
   assert.ok(html.includes('data-design-version="clear-human-v1"'));assert.ok(html.includes('data-contact-version="direct-v1"'));
   assert.ok(html.includes(`data-layout="${theme}" data-palette="${palette}"`));assert.ok(html.includes('href="tel:01041877511"'));
   assert.ok(html.includes('href="https://open.kakao.com/o/sH6OIpKi"'));assert.ok(!html.includes('data-contact-form'));
  }
  const gallery=await get('/templates');shared(gallery);for(const theme of themes)assert.ok(gallery.includes(`href="/?theme=${theme}"`));for(const palette of palettes)assert.ok(gallery.includes(`name="palette" value="${palette}"`));
  const privacy=await get('/privacy');shared(privacy);assert.ok(privacy.includes('오픈채팅'));
  const studio=await get('/studio');assert.ok(studio.includes('id="guided-preview"'));assert.ok(studio.includes('id="guided-bootstrap"'));
  const bundle=await get('/assets/guided-studio.js');assert.ok(bundle.length>10000);assert.ok(bundle.includes('copy-choice'));
  const advanced=await get('/studio/advanced');assert.ok(advanced.includes('id="site-preview"'));assert.ok((await get('/assets/studio.js')).includes('studio-section-focus'));
  assert.ok((await get('/proposal')).includes('보험사'));
  const retired=await fetch(new URL('/api/consultations',origin),{method:'POST',headers:{'content-type':'application/json'},body:'{}',signal:AbortSignal.timeout(15000)});
  assert.equal(retired.status,410);assert.equal((await retired.json()).code,'DIRECT_CONTACT_ONLY');
  verified=true;break;
 }catch(error){console.log(`Waiting for connected Cloudflare build (${attempt}/30): ${error.message}`);if(attempt<30)await new Promise(resolve=>setTimeout(resolve,10000));}
}
assert.ok(verified,'Live deployment not verified. Inspect Cloudflare Builds; do not report deployment success.');
const summary=`Clear Human live verification passed: 5 layouts × 6 palettes, phone/open chat, retired API, guided/advanced editors, proposal and privacy.\n${origin}/\n`;
console.log(summary);if(process.env.GITHUB_STEP_SUMMARY)await appendFile(process.env.GITHUB_STEP_SUMMARY,summary);
