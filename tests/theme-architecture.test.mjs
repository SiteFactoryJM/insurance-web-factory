import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderSitePage, renderTemplateGallery, renderPrivacyPage } from '../.preview-dist/render/page.js';
import { TEMPLATE_IDS, PALETTE_IDS } from '../.preview-dist/types.js';
import { clientScript } from '../.preview-dist/render/client-script.js';
import { handleConsultation } from '../.preview-dist/routes/consultation.js';
import { responsiveCopy } from '../.preview-dist/render/copy.js';
import { DESIGN_VERSION, PALETTES } from '../.preview-dist/render/design-system.js';
const site=JSON.parse(fs.readFileSync(new URL('../sites/demo-agent/site.json',import.meta.url),'utf8'));
const page=(config=site,theme='trust-blue')=>renderSitePage(config,new Request(`https://example.test/?theme=${theme}`));
const luminance=hex=>{
 const rgb=hex.slice(1).match(/../g).map(value=>parseInt(value,16)/255).map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);
 return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
};
const contrast=(a,b)=>{const first=luminance(a),second=luminance(b);return (Math.max(first,second)+.05)/(Math.min(first,second)+.05);};
test('Clear Human design version and six Figma palette tokens stay exact',()=>{
 assert.equal(DESIGN_VERSION,'clear-human-v1');
 assert.deepEqual(PALETTES,{
  navy:{name:'미드나이트 네이비',accent:'#2D4864',hover:'#1D3249',ink:'#172A3D',muted:'#526170',paper:'#F8F7F3',tint:'#E8EDF3',line:'#CDD6E0',input:'#788696',dark:'#172A3D',detail:'#CDD6E0'},
  forest:{name:'포레스트 그린',accent:'#2B5544',hover:'#1F4334',ink:'#142A20',muted:'#52695B',paper:'#F5F8F5',tint:'#EAF3ED',line:'#D1DED5',input:'#607768',dark:'#142A20',detail:'#D1DED5'},
  teal:{name:'딥 틸',accent:'#235B63',hover:'#184850',ink:'#112B30',muted:'#4C676D',paper:'#F4F8F9',tint:'#E7F2F3',line:'#CDDDE0',input:'#5F777D',dark:'#112B30',detail:'#CDDDE0'},
  charcoal:{name:'차콜 그레이',accent:'#41464E',hover:'#2D333B',ink:'#1D2127',muted:'#59616E',paper:'#F7F8FA',tint:'#ECEFF3',line:'#D7DDE5',input:'#6A7482',dark:'#1D2127',detail:'#D7DDE5'},
  stone:{name:'웜 스톤',accent:'#605744',hover:'#49412F',ink:'#302C25',muted:'#6D6555',paper:'#FAF8F3',tint:'#F2EDE2',line:'#DDD6C9',input:'#7C7464',dark:'#302C25',detail:'#DDD6C9'},
  slate:{name:'스틸 슬레이트',accent:'#485868',hover:'#303F4E',ink:'#24323F',muted:'#566370',paper:'#F6F6F2',tint:'#E5E9ED',line:'#CDD4DB',input:'#768390',dark:'#24323F',detail:'#CDD4DB'},
 });
 for(const palette of Object.values(PALETTES))assert.ok(contrast(palette.ink,palette.detail)>=4.5,`${palette.name} detail text contrast`);
});
for(const id of TEMPLATE_IDS)test(`${id}: direct contact replaces customer-input wizard`,()=>{
 const html=page(site,id);assert.match(html,new RegExp(`theme-${id}`));assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.match(html,/data-contact-version="direct-v1"/);assert.match(html,/href="tel:01041877511"/);assert.match(html,/href="https:\/\/open\.kakao\.com\/o\/sH6OIpKi"/);
 assert.match(html,/target="_blank" rel="noopener noreferrer"/);assert.match(html,/data-contact-link="phone"/);assert.match(html,/data-contact-link="kakao"/);
 assert.match(html,/name="robots" content="noindex,nofollow"/);assert.doesNotMatch(html,/data-contact-form|data-submission-mode|name="privacyConsent"|name="phone"|data-reading-toggle/);
});
test('purpose layouts preserve useful ordering and explicit template diagrams',()=>{
 const warm=page(site,'warm-care');assert.ok(warm.indexOf('id="about"')<warm.indexOf('id="specialties"'));
 const standard=page();assert.ok(standard.indexOf('id="specialties"')<standard.indexOf('id="about"'));
 assert.doesNotMatch(page(site,'clean-minimal'),/id="reviews"/);
 const gallery=renderTemplateGallery(site,new Request('https://example.test/templates'));
 for(const id of TEMPLATE_IDS)assert.ok(gallery.includes(`href="/?theme=${id}"`));assert.match(gallery,/구성 안내도/);
});
test('service layouts expose counts from three through six for balanced grids',()=>{
 for(const count of [3,4,5,6])for(const theme of ['warm-care','premium-navy']){
  const modified=structuredClone(site);modified.templateContent[theme].specialties=modified.templateContent[theme].specialties.slice(0,count);
  const html=page(modified,theme);assert.match(html,new RegExp(`services-${theme==='premium-navy'?'split':'cards'}[^>]+data-count="${count}"`));
 }
});
test('untrusted content is escaped and missing credentials are never invented',()=>{
 const modified=structuredClone(site);modified.agent.name='<script>alert(1)</script>';modified.career=[];modified.reviews=[];modified.agent.registrationNumber='';modified.agent.profileImage='';
 const html=page(modified);assert.doesNotMatch(html,/<script>alert\(1\)<\/script>/);assert.match(html,/&lt;script&gt;/);assert.match(html,/\/assets\/profile-placeholder.svg/);assert.doesNotMatch(html,/id="reviews"/);
});
test('only real reviews can render, and optional sections remain optional',()=>{
 const modified=structuredClone(site);modified.sections.faq=false;modified.sections.process=false;modified.sections.reviews=true;
 modified.reviews=[{quote:'example must never render 84729',author:'example',isExample:true}];
 for(const enabled of [true,false]){modified.demo.enabled=enabled;const html=page(modified);assert.doesNotMatch(html,/id="faq"|id="process"|id="reviews"|example must never render 84729/);}
 modified.reviews=[{quote:'검토된 후기 원고',author:'게시 동의 고객',isExample:false}];assert.match(page(modified),/검토된 후기 원고/);
});
test('customer client has no automatic sending, SDK, analytics, or storage',()=>{
 assert.doesNotMatch(clientScript,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|mailto:|Kakao\./);
 assert.match(clientScript,/studioPreview/);assert.match(clientScript,/event\.preventDefault/);assert.match(clientScript,/IntersectionObserver/);
});
for(const enabled of [true,false])for(const method of ['GET','POST','PUT','DELETE'])test(`retired API ${enabled}/${method} does not parse, store or send`,async()=>{
 let calls=0;const fail=()=>{calls++;throw new Error('must not touch customer input');};
 const response=await handleConsultation({method,get json(){return fail();},get body(){return fail();}},{get DB(){return fail();},get CONSULTATION_WEBHOOK_URL(){return fail();}},{...site,demo:{enabled,submissionMode:'store'}});
 assert.equal(response.status,410);assert.equal((await response.json()).code,'DIRECT_CONTACT_ONLY');assert.equal(calls,0);
});
test('five layouts combine independently with all six palettes and their selected copy',()=>{
 assert.equal(PALETTE_IDS.length,6);assert.equal(TEMPLATE_IDS.length,5);const headlines=new Set();
 for(const theme of TEMPLATE_IDS){const headline=site.templateContent[theme].headline;headlines.add(headline);for(const palette of PALETTE_IDS){
  const html=renderSitePage(site,new Request(`https://example.test/?theme=${theme}&palette=${palette}`));
  assert.ok(html.includes(`data-layout="${theme}" data-palette="${palette}"`));assert.ok(html.includes(headline.replaceAll('\n','<br>')));
  assert.ok(html.includes(`value="${theme}" selected`));assert.ok(html.includes(`value="${palette}" selected`));for(const card of site.templateContent[theme].specialties)assert.ok(html.includes(card.title));
  assert.ok(html.includes('유퍼스트 해온지사'));assert.ok(html.includes('tel:01041877511'));
 }}assert.equal(headlines.size,5);
});
test('query fallbacks remain safe and production ignores preview switches',()=>{
 const request=new Request('https://example.test/?theme=warm-care&palette=stone'),production=structuredClone(site);production.demo.enabled=false;
 assert.match(renderSitePage(production,request),new RegExp(`data-layout="trust-blue" data-palette="${site.palette}"`));
 const legacy=structuredClone(site);delete legacy.palette;delete legacy.templateContent;
 assert.match(renderSitePage(legacy,new Request('https://example.test/?theme=INVALID&palette=INVALID')),/data-layout="trust-blue" data-palette="navy"/);
 assert.ok(renderSitePage(legacy,new Request('https://example.test/?theme=warm-care')).includes(legacy.hero.headline.replaceAll('\n','<br>')));
 const disabled=structuredClone(site);disabled.demo.allowTemplateSwitch=false;assert.match(renderSitePage(disabled,request),new RegExp(`data-layout="trust-blue" data-palette="${site.palette}"`));
});
test('studio tools are outside the consumer header and stay out of production',()=>{
 const html=page();assert.ok(html.indexOf('<aside class="sample-bar"')<html.indexOf('<header class="site-header"'));
 const production=structuredClone(site);production.demo.enabled=false;assert.doesNotMatch(page(production),/<aside class="sample-bar"/);
 production.status='published';production.seo.noIndex=false;assert.match(page(production),/name="robots" content="index,follow,max-image-preview:large"/);
 production.status='draft';assert.match(page(production),/name="robots" content="noindex,nofollow"/);
});
test('invalid contact destinations are never exposed as clickable links',()=>{
 const modified=structuredClone(site);modified.contact.phone='javascript:alert(1)';modified.contact.kakaoUrl='https://open.kakao.com.evil.test/o/x';
 assert.doesNotMatch(page(modified),/data-contact-link=/);assert.match(page(modified),/연락처 확인 후/);
});
test('privacy guidance matches direct contact and never promises a functioning form',()=>{
 const html=renderPrivacyPage(site,new Request('https://example.test/privacy'));
 assert.match(html,/오픈채팅/);assert.doesNotMatch(html,/동의하지 않을 수 있으나 상담 신청 기능 이용이 제한/);
});
test('responsive copy preserves full escaped text and legacy mobile fallbacks',()=>{
 assert.equal(responsiveCopy('기존 원문\n두 번째 줄'),'기존 원문<br>두 번째 줄');assert.equal(responsiveCopy('원문',''),'원문');
 assert.equal(responsiveCopy('<b>PC</b>','<img src=x>'),'<span class="copy-desktop">&lt;b&gt;PC&lt;/b&gt;</span><span class="copy-mobile">&lt;img src=x&gt;</span>');
 const modified=structuredClone(site);modified.hero.mobileHeadline='기본 모바일';modified.templateContent['warm-care'].headline='별도 PC 제목';delete modified.templateContent['warm-care'].mobileHeadline;
 assert.ok(page(modified,'warm-care').includes('별도 PC 제목'));assert.ok(!page(modified,'warm-care').includes('기본 모바일'));
 modified.templateContent['warm-care']={mobileHeadline:'모바일만 별도 작성',mobileSubheadline:'짧은 설명만 교체'};
 assert.ok(page(modified,'warm-care').includes('모바일만 별도 작성'));assert.ok(page(modified,'warm-care').includes('짧은 설명만 교체'));
});
