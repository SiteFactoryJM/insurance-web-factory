import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { COPY_LIBRARY as library, COPY_CHOICE_COUNT } from '../.preview-dist/content/copy-library.js';
import { applyCopy, applyPurpose, blankGuidedSite, guidedIssues } from '../.preview-dist/studio/guided-model.js';
import { directEmailHref, directPhoneHref, openChatUrl } from '../.preview-dist/utils/contact-links.js';
import { createProject, parseProject, validateProjectSite } from '../.preview-dist/studio/project.js';
import { validateContentLengths } from '../scripts/validate-sites.mjs';
const raw=JSON.parse(fs.readFileSync(new URL('../sites/demo-agent/site.json',import.meta.url),'utf8'));

test('114 distinct selections, eight purposes, preserved five layouts and six palette choices',()=>{
 assert.equal(COPY_CHOICE_COUNT,114);assert.equal(library.presets.length,8);
 assert.deepEqual(['heroes','intros','services','processes','faqs','footers'].map(k=>library[k].length),[24,16,24,8,30,12]);
 assert.equal(new Set(library.presets.map(p=>p.template)).size,5);
});
for(const group of ['heroes','intros','services','processes','faqs','footers']){
 test(`${group}: unique IDs`,()=>assert.equal(new Set(library[group].map(c=>c.id)).size,library[group].length));
 for(const choice of library[group])test(`${group}/${choice.id}: selected copy validates and round-trips`,()=>{
  const ids=[choice.id];if(group==='services')ids.push(...library.services.filter(c=>c.id!==choice.id).slice(0,2).map(c=>c.id));if(group==='faqs')ids.push(library.faqs.find(c=>c.id!==choice.id).id);
  const before=JSON.stringify(raw), changed=applyCopy(raw,group,ids);
  assert.deepEqual(validateProjectSite(changed),[]);assert.deepEqual(validateContentLengths(changed),[]);
  assert.deepEqual(parseProject(JSON.stringify(createProject(changed))).site,createProject(changed).site);
  assert.equal(JSON.stringify(raw),before);assert.equal(changed.status,'draft');assert.equal(changed.compliance.publicationConfirmed,false);
  assert.equal(changed.templateContent,undefined);assert.equal(changed.sections.contactForm,false);
  assert.deepEqual(changed.agent,raw.agent);assert.deepEqual(changed.contact,raw.contact);
 });
}
for(const preset of library.presets)test(`purpose/${preset.id}: real identity is not rewritten`,()=>{
 const before=JSON.stringify(raw),s=applyPurpose(raw,preset);
 assert.equal(JSON.stringify(raw),before);assert.equal(s.template,preset.template);assert.equal(s.palette,preset.palette);
 assert.deepEqual(s.agent,raw.agent);assert.deepEqual(s.contact,raw.contact);assert.deepEqual(s.reviews,[]);
 assert.deepEqual(validateProjectSite(s),[]);assert.deepEqual(validateContentLengths(s),[]);assert.deepEqual(guidedIssues(s),[]);
 assert.equal(s.seo.noIndex,true);assert.deepEqual(s.domains,[]);assert.equal(s.compliance.advertisingReviewNumber,'');
});
test('blank project does not silently copy a real advisor identity',()=>{
 const s=blankGuidedSite(raw);for(const v of [s.agent.name,s.agent.company,s.contact.phone,s.contact.kakaoUrl,s.contact.availableHours,s.contact.email,s.contact.fax])assert.equal(v,'');
 assert.equal(guidedIssues(s).length,5);assert.equal(s.agent.profileImage,'/assets/profile-placeholder.svg');assert.deepEqual(s.career,[]);assert.deepEqual(s.reviews,[]);
});
test('invalid and duplicate selection is rejected without changing the source',()=>{
 const before=JSON.stringify(raw);for(const ids of [[],['missing'],['hero-01','hero-01']])assert.throws(()=>applyCopy(raw,'heroes',ids));
 for(const ids of [['service-01'],library.services.slice(0,7).map(c=>c.id)])assert.throws(()=>applyCopy(raw,'services',ids));assert.equal(JSON.stringify(raw),before);
});
for(const url of ['http://open.kakao.com/o/abc','https://open.kakao.com.evil.test/o/abc','https://open.kakao.com@evil.test/o/abc','javascript:alert(1)','//open.kakao.com/o/abc','https://open.kakao.com:443/o/abc','https://open.kakao.com/o/abc?next=evil','https://open.kakao.com/o/abc#x','https://open.kakao.com/o/abc/../def','https://open.kakao.com/o/abc%2Fdef','https://open.kakao.com/o/'])test(`reject unsafe chat destination ${url}`,()=>assert.equal(openChatUrl(url),''));
test('telephone is a plain tel URL and chat has no message payload',()=>{
 assert.equal(directPhoneHref(raw.contact.phone),'tel:01041877511');assert.equal(openChatUrl(raw.contact.kakaoUrl),raw.contact.kakaoUrl);
 assert.equal(directPhoneHref('+82 (10) 1234-5678'),'tel:+821012345678');
 for(const value of ['javascript:1','01012345678;ext=1','123',null])assert.equal(directPhoneHref(value),'');
});

test('email creates only a safe plain mailto link and remains optional',()=>{
 assert.equal(directEmailHref('agent@example.com'),'mailto:agent@example.com');
 assert.equal(directEmailHref('advisor+vip@example.com'),'mailto:advisor%2Bvip@example.com');
 assert.equal(directEmailHref('agent%0Aname@example.com'),'mailto:agent%250Aname@example.com');
 for(const value of ['',null,'agent@example.com?subject=x','agent@example.com%0D%0ABcc:bad@example.com','a@localhost','a..b@example.com'])assert.equal(directEmailHref(value),'');
});

test('optional email and fax values validate only when present',()=>{
 const empty=structuredClone(raw);empty.contact.email='';empty.contact.fax='';assert.deepEqual(guidedIssues(empty),[]);assert.deepEqual(validateProjectSite(empty),[]);
 const valid=structuredClone(raw);valid.contact.email='advisor+vip@example.com';valid.contact.fax='02-1234-5678';assert.deepEqual(guidedIssues(valid),[]);assert.deepEqual(validateProjectSite(valid),[]);
 const invalidEmail=structuredClone(raw);invalidEmail.contact.email='agent@example.com?subject=x';assert.ok(guidedIssues(invalidEmail).some(issue=>issue.includes('이메일')));assert.ok(validateProjectSite(invalidEmail).some(issue=>issue.includes('contact.email')));
 const invalidFax=structuredClone(raw);invalidFax.contact.fax='fax-now';assert.ok(guidedIssues(invalidFax).some(issue=>issue.includes('팩스')));assert.ok(validateProjectSite(invalidFax).some(issue=>issue.includes('contact.fax')));
});

test('project validation rejects phone values that cannot create a direct link',()=>{
 for(const phone of ['123456','010.1234.5678','0101234567890123456','+------']) {
  const changed=structuredClone(raw);changed.contact.phone=phone;
  assert.ok(validateProjectSite(changed).some(error=>error.includes('contact.phone')));
  assert.throws(()=>createProject(changed),/contact.phone/);
 }
});
