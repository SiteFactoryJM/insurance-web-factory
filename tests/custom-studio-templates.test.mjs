import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  applyCustomStudioTemplate,
  CUSTOM_STUDIO_TEMPLATE_IDS,
  CUSTOM_STUDIO_TEMPLATES,
  inferCustomStudioTemplate,
} from '../.preview-dist/studio/custom-templates.js';

const source = JSON.parse(fs.readFileSync(new URL('../sites/20260922-kimdaekyung/site.json', import.meta.url), 'utf8'));

test('studio exposes Kim Gyeonghyeon and Kim Daekyung reusable custom templates', () => {
  assert.deepEqual(CUSTOM_STUDIO_TEMPLATE_IDS, ['kim-gyeonghyeon', 'kim-daekyung']);
  assert.equal(CUSTOM_STUDIO_TEMPLATES['kim-gyeonghyeon'].name, '김경현 템플릿');
  assert.equal(CUSTOM_STUDIO_TEMPLATES['kim-daekyung'].name, '김대경 템플릿');
});

test('custom template changes structure and color without copying or replacing customer identity', () => {
  const originalIdentity = structuredClone(source.agent);
  const originalContact = structuredClone(source.contact);
  const gyeonghyeon = applyCustomStudioTemplate(source, 'kim-gyeonghyeon');
  const daekyung = applyCustomStudioTemplate(source, 'kim-daekyung');

  assert.deepEqual(gyeonghyeon.agent, originalIdentity);
  assert.deepEqual(gyeonghyeon.contact, originalContact);
  assert.equal(gyeonghyeon.template, 'warm-care');
  assert.equal(gyeonghyeon.palette, 'charcoal');
  assert.equal(daekyung.template, gyeonghyeon.template);
  assert.equal(daekyung.headingFont, gyeonghyeon.headingFont);
  assert.equal(daekyung.hero.brandLayout, gyeonghyeon.hero.brandLayout);
  assert.equal(daekyung.palette, 'forest');
  assert.equal(daekyung.sections.recruitment, true);
  assert.equal(daekyung.footer.note, '');
  assert.equal(daekyung.footer.hideInstagram, true);
  assert.equal(inferCustomStudioTemplate(daekyung), 'kim-daekyung');
});
