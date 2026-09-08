import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateInput, toSiteConfig, readWorkbook } from "../scripts/import-intake.mjs";

const spec = JSON.parse(await readFile(new URL("../config/intake-fields.json", import.meta.url), "utf8"));

test("intake field keys are unique", () => {
  const keys = spec.fields.map((field) => field.key);
  assert.equal(new Set(keys).size, keys.length);
});

test("required intake fields have examples or defaults", () => {
  const missing = spec.fields.filter((field) => field.required && !field.example && field.default === undefined);
  assert.deepEqual(missing, []);
});

test("template options expose exactly five templates", () => {
  const field = spec.fields.find((item) => item.key === "template");
  assert.ok(field);
  assert.deepEqual(field.options, ["trust-blue", "warm-care", "premium-navy", "clean-minimal", "local-friendly"]);
});

test("workbook columns match importer contract", () => {
  assert.equal(spec.sheetName, "작성양식");
  assert.equal(spec.keyColumn, "A");
  assert.equal(spec.valueColumn, "E");
});

const validValues = () => Object.fromEntries(spec.fields.filter(field => !field.key.includes("mobile")).map(field => [field.key, field.default ?? field.example ?? ""]));

test("legacy intake values still import without mobile copy", () => {
  const values = validValues();
  assert.doesNotThrow(() => validateInput(values, "legacy.xlsx"));
  const site = toSiteConfig(values);
  assert.equal(site.hero.headline, values.headline);
  assert.equal(site.hero.mobileHeadline, undefined);
  assert.equal(site.intro.mobileBody, undefined);
  assert.ok(site.specialties.every(card => card.mobileBody === undefined));
});

test("mobile intake copy and content brief survive conversion", () => {
  const values = { ...validValues(), mobile_headline: "내 보험, 쉽게 이해하기", mobile_subheadline: "가입 내역부터 함께 확인합니다.", intro_mobile_title: "먼저 듣겠습니다.", intro_mobile_body: "현재 상황을 듣고 쉽게 설명합니다.", specialty_1_mobile_body: "현재 보장을 함께 살펴봅니다.", process_1_mobile_body: "편한 시간을 알려주세요.", faq_1_mobile_answer: "충분히 설명을 듣고 결정하세요." };
  validateInput(values, "mobile.xlsx");
  const site = toSiteConfig(values);
  assert.equal(site.hero.mobileHeadline, values.mobile_headline);
  assert.equal(site.hero.mobileSubheadline, values.mobile_subheadline);
  assert.equal(site.intro.mobileTitle, values.intro_mobile_title);
  assert.equal(site.intro.mobileBody, values.intro_mobile_body);
  assert.equal(site.specialties[0].mobileBody, values.specialty_1_mobile_body);
  assert.equal(site.process[0].mobileBody, values.process_1_mobile_body);
  assert.equal(site.faqs[0].mobileAnswer, values.faq_1_mobile_answer);
  assert.equal(site.contentBrief.purpose, values.site_purpose);
  assert.equal(site.contentBrief.targetAudience, values.target_audience);
  assert.equal(site.contentBrief.primaryAction, values.desired_action);
});

test("intake enforces every copy limit without truncating Unicode text", () => {
  for (const field of spec.fields.filter(field => field.maxLength)) {
    const values = { ...validValues(), [field.key]: "😀".repeat(field.maxLength) };
    assert.doesNotThrow(() => validateInput(values, "boundary.xlsx"), field.key);
    values[field.key] += "한";
    assert.throws(() => validateInput(values, "boundary.xlsx"), /자 이내로 작성하세요/, field.key);
    assert.equal(Array.from(values[field.key]).length, field.maxLength + 1, "input must not be silently shortened");
  }
  assert.throws(() => validateInput({ ...validValues(), mobile_headline: "한 ".repeat(12) + "끝" }, "spaces.xlsx"), /현재 25자/);
});

test("partial card or FAQ input fails rather than silently disappearing", () => {
  const values = validValues();
  values.specialty_4_title = "";
  values.specialty_4_body = "";
  values.specialty_4_mobile_body = "모바일 문구만 작성한 상태";
  assert.throws(() => validateInput(values, "partial.xlsx"), /모바일 문구만 가져올 수 없습니다/);
});

test("checked-in workbook includes the PC and mobile field contract", async () => {
  const values = await readWorkbook(new URL("../forms/보험설계사_홈페이지_자료수집_양식.xlsx", import.meta.url));
  for (const field of spec.fields) assert.ok(Object.hasOwn(values, field.key), `missing workbook field: ${field.key}`);
});
