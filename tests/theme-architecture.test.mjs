import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = new URL('../src/render/templates/', import.meta.url);
const sources = {
  'trust-blue': fs.readFileSync(new URL('trust-blue.ts', base), 'utf8'),
  'warm-care': fs.readFileSync(new URL('warm-care.ts', base), 'utf8'),
  'premium-navy': fs.readFileSync(new URL('premium-navy.ts', base), 'utf8'),
  'clean-minimal': fs.readFileSync(new URL('clean-minimal.ts', base), 'utf8'),
  'local-friendly': fs.readFileSync(new URL('local-friendly.ts', base), 'utf8'),
};

test('five templates use five distinct page architectures', () => {
  const signatures = {
    'trust-blue': ['advisory-hero', 'advisory-service-table', 'ledger-faq'],
    'warm-care': ['human-photo-panel', 'human-faq-board', 'human-featured-review'],
    'premium-navy': ['private-portrait', 'private-identity', 'private-review-track'],
    'clean-minimal': ['report-hero-index', 'report-service-table', 'report-review-list'],
    'local-friendly': ['concierge-profile', 'concierge-service-board', 'concierge-faq-grid'],
  };
  for (const [id, markers] of Object.entries(signatures)) {
    for (const marker of markers) assert.match(sources[id], new RegExp(marker), `${id} missing ${marker}`);
  }
});

test('FAQ presentation differs by template', () => {
  assert.match(sources['trust-blue'], /<details class="ledger-faq/);
  assert.match(sources['warm-care'], /role="tab"/);
  assert.match(sources['premium-navy'], /<details class="private-faq/);
  assert.match(sources['clean-minimal'], /<details class="report-faq/);
  assert.match(sources['local-friendly'], /<article class="concierge-faq-card/);
});

test('only contact actions use emoji', () => {
  const renderRoot = new URL('../src/render/', import.meta.url);
  const files = [
    'shared.ts', 'page.ts', 'client-script.ts', 'styles.ts',
    'templates/trust-blue.ts', 'templates/warm-care.ts', 'templates/premium-navy.ts',
    'templates/clean-minimal.ts', 'templates/local-friendly.ts', 'templates/index.ts',
  ];
  const combined = files.map((file) => fs.readFileSync(new URL(file, renderRoot), 'utf8')).join('\n');
  const emoji = [...combined.matchAll(/[📞📷💬😀-🙏🌀-🫿]/gu)].map((match) => match[0]);
  assert.deepEqual([...new Set(emoji)].sort(), ['📞', '📷', '💬'].sort());
});
