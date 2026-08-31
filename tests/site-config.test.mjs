import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const site = JSON.parse(await readFile(new URL("../sites/demo-agent/site.json", import.meta.url), "utf8"));

test("demo site is no-index and discards submissions", () => {
  assert.equal(site.seo.noIndex, true);
  assert.equal(site.demo.enabled, true);
  assert.equal(site.demo.submissionMode, "discard");
});

test("demo site has complete mobile contact information", () => {
  assert.match(site.contact.phone, /^010-/);
  assert.ok(site.contact.availableHours.length > 5);
  assert.equal(site.sections.contactForm, true);
});

test("demo site has enough useful content", () => {
  assert.ok(site.specialties.length >= 4);
  assert.ok(site.process.length >= 4);
  assert.ok(site.faqs.length >= 3);
});
