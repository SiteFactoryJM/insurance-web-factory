import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

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
