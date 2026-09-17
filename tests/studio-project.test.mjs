import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createProject, createStudioExample, parseProject, validateProjectSite, validateImageSource, isSectionEnabled, MAX_PROJECT_BYTES, MAX_IMAGE_BYTES } from "../.preview-dist/studio/project.js";
import { HEADING_FONT_IDS } from "../.preview-dist/types.js";
import { HEADING_FONTS, fontStylesheetLinks, headingFont, headingFontStyle } from "../.preview-dist/render/fonts.js";
import { importStudioProject } from "../scripts/import-studio.mjs";
import { validateContentLengths, validateDesignConfiguration, validateSectionContent } from "../scripts/validate-sites.mjs";

const raw = JSON.parse(await readFile(new URL("../sites/demo-agent/site.json", import.meta.url), "utf8"));
const clone = value => JSON.parse(JSON.stringify(value));
const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aPioAAAAASUVORK5CYII=";
const example = () => createStudioExample(raw);
async function fixture(t) {
  const rootDir = await mkdtemp(path.join(os.tmpdir(), "insurance-studio-test-"));
  t.after(async () => {
    assert.ok(path.basename(rootDir).startsWith("insurance-studio-test-") && path.dirname(rootDir) === path.resolve(os.tmpdir()));
    await rm(rootDir, { recursive: true, force: true });
  });
  const site = example();
  site.agent.profileImage = png;
  site.agent.logoImage = "";
  site.hero.image = png;
  delete site.seo.ogImage;
  const file = path.join(rootDir, "project.json");
  await writeFile(file, JSON.stringify(createProject(site)));
  return { rootDir, site, file };
}

test("DIY JSON round-trip preserves chosen patterns, mobile copy, footer and custom images", () => {
  const site = example();
  site.design = { hero: "editorial", services: "split", about: "quote", process: "timeline", faq: "columns", footer: "minimal", ornament: "grid", density: "compact", sectionOrder: ["faq", "about", "services", "contact", "process", "reviews"], hiddenSections: ["reviews"] };
  site.footer = { heading: "김서연 보험상담", note: "설명은 쉽게, 판단은 충분히." };
  site.agent.businessNumber = "123-45-67890";
  site.hero.image = png;
  site.hero.mobileHeadline = "우리 가족의 다음 선택";
  const project = createProject(site);
  const restored = parseProject(JSON.stringify(project));
  assert.deepEqual(restored, project);
  assert.deepEqual(restored.site.design, site.design);
  assert.deepEqual(restored.site.footer, site.footer);
  assert.equal(restored.site.hero.mobileHeadline, "우리 가족의 다음 선택");
  assert.equal(restored.site.hero.image, png);
  assert.equal(restored.site.agent.businessNumber, "123-45-67890");
});

test("all six licensed heading choices survive export, restore and source validation", () => {
  assert.equal(HEADING_FONT_IDS.length, 6);
  assert.deepEqual(HEADING_FONTS.map(font => font.id), [...HEADING_FONT_IDS]);
  for (const id of HEADING_FONT_IDS) {
    const site = example(); site.headingFont = id;
    assert.equal(parseProject(JSON.stringify(createProject(site))).site.headingFont, id);
    assert.ok(headingFontStyle(id).includes(headingFont(id).family));
    assert.match(headingFont(id).licenseUrl, /^https:\/\/github\.com\/(orioncactus\/pretendard|google\/fonts)\//);
    assert.equal((fontStylesheetLinks([id, id]).match(/<link /g) || []).length, id === "pretendard" ? 1 : 2);
  }
  assert.equal(headingFont("constructor").id, "pretendard");
  const invalid = example(); invalid.headingFont = "unknown-font";
  assert.match(validateProjectSite(invalid).join("\n"), /headingFont/);
});

test("hidden incomplete sections preserve drafts without blocking project save or backend validation", () => {
  const site = example();
  site.design = { ...site.design, hiddenSections: ["about", "services", "process", "faq", "reviews"] };
  site.intro = { title: "", body: "", mobileBody: "" };
  site.specialties = [{ title: "작성 중인 제목", body: "" }, {}];
  site.process = [];
  site.faqs = [{ question: "", answer: "" }];
  site.reviews = [{ quote: "", author: "" }];
  assert.deepEqual(validateProjectSite(site), []);
  assert.deepEqual(validateContentLengths(site), []);
  assert.deepEqual(validateSectionContent(site), []);
  const restored = parseProject(JSON.stringify(createProject(site))).site;
  for (const key of ["intro", "specialties", "process", "faqs", "reviews"]) assert.deepEqual(restored[key], site[key]);
  for (const section of ["about", "services", "process", "faq", "reviews"]) assert.equal(isSectionEnabled(restored, section), false);
  restored.design.hiddenSections = [];
  assert.ok(validateProjectSite(restored).length > 0, "restoring a section restores its content requirements");
  assert.ok(validateSectionContent(restored).length > 0);
});

test("hidden drafts still reject malformed shape, overlong copy, unsafe fields and absent legal identity", () => {
  const site = example();
  site.design = { ...site.design, hiddenSections: ["about", "services", "process", "faq", "reviews", "contact"] };
  for (const mutate of [s => s.intro = [], s => s.specialties = [null], s => s.specialties = [{ body: 42 }], s => s.intro.body = "가".repeat(401), s => s.faqs[0].answer = "가".repeat(241), s => s.specialties[0].script = "alert(1)", s => s.contact.kakaoUrl = "javascript:alert(1)", s => s.agent.name = "", s => s.compliance.footerDisclaimer = ""]) {
    const changed = clone(site); mutate(changed);
    assert.ok(validateProjectSite(changed).length > 0);
  }
  const changed = clone(site); changed.sections.process = false; changed.sections.faq = false; changed.sections.reviews = false; changed.design.hiddenSections = [];
  changed.process = []; changed.faqs = []; changed.reviews = [];
  assert.equal(isSectionEnabled(changed, "process"), false);
  assert.equal(isSectionEnabled(changed, "faq"), false);
  assert.equal(isSectionEnabled(changed, "reviews"), false);
  assert.deepEqual(validateProjectSite(changed), []);
  const noContact = clone(site); noContact.consultation.topics = [];
  assert.deepEqual(validateProjectSite(noContact), []);
  noContact.contact.phone = "";
  assert.ok(validateProjectSite(noContact).some(issue => issue.includes("contact.phone")), "footer contact stays required even when the survey is hidden");
  const malformed = clone(site); malformed.career = [undefined];
  assert.ok(validateProjectSite(malformed).some(issue => issue.includes("career")), "hidden arrays still require typed elements");
});

test("example resolution removes template overrides without changing the source", () => {
  const source = clone(raw);
  source.templateContent = { [source.template]: { headline: "예시의 제목", specialties: [{ title: "가", body: "첫 설명" }, { title: "나", body: "둘째 설명" }, { title: "다", body: "셋째 설명" }] } };
  const resolved = createStudioExample(source);
  assert.equal(resolved.hero.headline, "예시의 제목");
  assert.equal(resolved.specialties[0].body, "첫 설명");
  assert.equal(resolved.templateContent, undefined);
  assert.ok(source.templateContent);
  resolved.hero.headline = "사용자가 수정한 제목";
  assert.equal(parseProject(JSON.stringify(createProject(resolved))).site.hero.headline, "사용자가 수정한 제목");
});

test("export and import always reset publishing authority and preserve required disclosure", () => {
  const site = example();
  site.status = "published"; site.domains = ["example.com"]; site.seo.noIndex = false;
  site.demo = { enabled: false, submissionMode: "store" };
  site.compliance.contentTruthConfirmed = true; site.compliance.photoUseConfirmed = true; site.compliance.publicationConfirmed = true;
  site.compliance.advertisingReviewStatus = "approved";
  const exported = createProject(site);
  const manuallyChanged = { ...exported, site };
  for (const result of [exported, parseProject(manuallyChanged)]) {
    assert.equal(result.site.status, "draft"); assert.deepEqual(result.site.domains, []); assert.equal(result.site.seo.noIndex, true);
    assert.equal(result.site.demo.enabled, true); assert.equal(result.site.demo.submissionMode, "discard");
    assert.equal(result.site.compliance.publicationConfirmed, false); assert.equal(result.site.compliance.contentTruthConfirmed, false); assert.equal(result.site.compliance.photoUseConfirmed, false);
    assert.equal(result.site.compliance.advertisingReviewStatus, "pending");
    assert.equal(result.site.compliance.footerDisclaimer, site.compliance.footerDisclaimer);
  }
  assert.equal(site.status, "published", "export must not mutate the editor or source object");
});

test("rejects wrong versions, missing fields and malformed shapes with Korean feedback", () => {
  const project = createProject(example());
  for (const mutate of [p => p.version = 3, p => p.format = "other", p => delete p.site.agent, p => p.site.hero = [], p => p.site.contact.phone = "javascript:alert(1)", p => p.site.agent.careerYears = -1, p => p.savedAt = "yesterday"]) {
    const changed = clone(project); mutate(changed);
    assert.throws(() => parseProject(changed), /제작 파일|필수|형식|지원|날짜|정수/);
  }
  assert.throws(() => parseProject("not json"), /JSON 제작 파일/);
});

test("v1 projects migrate to v2 while preserving content and resetting publication authority", () => {
  const current = createProject(example());
  const legacy = { format: current.format, version: 1, savedAt: current.savedAt, site: clone(current.site) };
  legacy.site.status = "published"; legacy.site.domains = ["example.com"]; legacy.site.seo.noIndex = false;
  const migrated = parseProject(legacy);
  assert.equal(migrated.version, 2);
  assert.equal(migrated.savedAt, legacy.savedAt);
  assert.equal(migrated.site.hero.headline, legacy.site.hero.headline);
  assert.equal(migrated.site.status, "draft"); assert.deepEqual(migrated.site.domains, []); assert.equal(migrated.site.seo.noIndex, true);
  assert.equal(migrated.editor.source, "imported");
  assert.match(migrated.handoff.draftId, /^legacy-/);
});

test("v2 round-trip preserves explicit handoff metadata and never regenerates copy from IDs", () => {
  const project = createProject(example(), { purposeId: "check", requestedDomain: "agent.example.com", source: "demo" });
  const restored = parseProject(JSON.stringify(project));
  assert.equal(restored.version, 2);
  assert.equal(restored.handoff.draftId, project.handoff.draftId);
  assert.equal(restored.handoff.requestedDomain, "agent.example.com");
  assert.equal(restored.editor.purposeId, "check");
  assert.equal(restored.site.hero.headline, project.site.hero.headline);
});

test("rejects prototype pollution and unknown properties at any supported level", () => {
  const project = createProject(example());
  for (const location of ["", "site", "site.agent", "site.design"]) {
    const changed = clone(project);
    if (!changed.site.design) changed.site.design = {};
    const target = location ? location.split(".").reduce((value, key) => value[key], changed) : changed;
    Object.defineProperty(target, "__proto__", { value: { polluted: true }, enumerable: true });
    assert.throws(() => parseProject(JSON.stringify(changed)), /지원하지 않는 항목/);
  }
  const changed = clone(project); changed.site.agent.constructor = { prototype: { polluted: true } };
  assert.throws(() => parseProject(changed), /지원하지 않는 항목/);
  assert.equal({}.polluted, undefined);
});

test("enforces original desktop and mobile copy limits plus pattern enums and unique sections", () => {
  const site = example();
  site.hero.mobileHeadline = "가".repeat(25);
  assert.match(validateProjectSite(site).join("\n"), /24자/);
  site.hero.mobileHeadline = "가".repeat(24);
  site.specialties[0].mobileBody = "나".repeat(49);
  assert.match(validateProjectSite(site).join("\n"), /48자/);
  site.specialties[0].mobileBody = "간결한 설명";
  site.design = { hero: "unsupported", sectionOrder: ["faq", "faq"] };
  assert.ok(validateProjectSite(site).length >= 2);
  assert.ok(validateDesignConfiguration(site).length >= 2);
  site.design = { footer: "classic", sectionOrder: ["faq", "about"] };
  assert.deepEqual(validateDesignConfiguration(site), []);
});

test("rejects executable URLs, uploaded SVG and spoofed or oversized raster files", () => {
  for (const value of ["javascript:alert(1)", "data:text/html;base64,PHNjcmlwdD4=", "data:image/svg+xml;base64,PHN2Zz4=", "data:image/png;base64,PHNjcmlwdD4=", "/sites/../secret.png", "https://example.com/logo.svg", "//example.com/image.png"]) assert.ok(validateImageSource(value), value);
  assert.equal(validateImageSource(png), undefined);
  assert.equal(validateImageSource("/sites/demo-agent/lee-yunbok-profile.webp"), undefined);
  assert.equal(validateImageSource("/assets/profile-placeholder.svg"), undefined);
  const site = example(); site.contact.kakaoUrl = "javascript:alert(1)";
  assert.match(validateProjectSite(site).join("\n"), /http/);
  const tooLarge = `data:image/png;base64,${Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), Buffer.alloc(MAX_IMAGE_BYTES)]).toString("base64")}`;
  assert.match(validateImageSource(tooLarge), /3MB/);
  assert.throws(() => parseProject(" ".repeat(MAX_PROJECT_BYTES + 1)), /8MB/);
});

test("export accounts for indentation so a saved JSON never exceeds the import limit", () => {
  const site = example();
  const data = `data:image/png;base64,${Buffer.concat([Buffer.from("89504e470d0a1a0a", "hex"), Buffer.alloc(MAX_IMAGE_BYTES - 8)]).toString("base64")}`;
  site.agent.profileImage = data;
  site.hero.image = data;
  const provisional = { format: "insurance-web-factory/diy", version: 1, savedAt: "2026-09-08T00:00:00.000Z", site };
  const compactSize = Buffer.byteLength(JSON.stringify(provisional));
  const reduction = Math.ceil((compactSize - (MAX_PROJECT_BYTES - 500)) / 4) * 4;
  site.hero.image = site.hero.image.slice(0, -reduction);
  assert.ok(Buffer.byteLength(JSON.stringify(provisional)) < MAX_PROJECT_BYTES);
  assert.ok(Buffer.byteLength(JSON.stringify(provisional, null, 2)) > MAX_PROJECT_BYTES);
  assert.throws(() => createProject(site), /8MB/);
});

test("CLI imports into site.json, extracts uploaded images, and preserves visual choices", async t => {
  const { rootDir, site, file } = await fixture(t);
  site.design = { hero: "statement", footer: "columns", sectionOrder: ["about", "services", "faq"] };
  site.footer = { heading: "나의 보험상담", note: "예약 상담으로 운영합니다." };
  await writeFile(file, JSON.stringify(createProject(site)));
  const result = await importStudioProject(file, { rootDir, id: "agent-kim" });
  const config = JSON.parse(await readFile(result.configPath, "utf8"));
  assert.equal(config.id, "agent-kim"); assert.equal(config.status, "draft"); assert.equal(config.seo.noIndex, true);
  assert.deepEqual(config.design, site.design); assert.deepEqual(config.footer, site.footer);
  assert.match(config.agent.profileImage, /^\/sites\/agent-kim\/studio-profile-[0-9a-f]+\.png$/);
  assert.match(config.hero.image, /^\/sites\/agent-kim\/studio-hero-[0-9a-f]+\.png$/);
  assert.deepEqual(await readFile(path.join(rootDir, "public", config.agent.profileImage)), Buffer.from(png.split(",")[1], "base64"));
  assert.deepEqual(validateProjectSite(config), []);
  assert.equal((await readdir(path.join(rootDir, "sites", "agent-kim"))).length, 1);
});

test("CLI imported hidden drafts stay valid in the source-site validator", async t => {
  const { rootDir, site, file } = await fixture(t);
  site.headingFont = "gowun-batang";
  site.design = { ...site.design, hiddenSections: ["about", "services", "process", "faq", "reviews"] };
  site.intro = { title: "", body: "" }; site.specialties = [{ title: "미완성", body: "" }]; site.process = []; site.faqs = []; site.reviews = [];
  await writeFile(file, JSON.stringify(createProject(site)));
  const result = await importStudioProject(file, { rootDir, id: "hidden-draft" });
  const config = JSON.parse(await readFile(result.configPath, "utf8"));
  assert.equal(config.headingFont, "gowun-batang");
  assert.deepEqual(validateProjectSite(config), []);
  assert.deepEqual(validateDesignConfiguration(config), []);
  assert.deepEqual(validateContentLengths(config), []);
  assert.deepEqual(validateSectionContent(config), []);
});

test("CLI refuses existing sites by default and only replaces with explicit force", async t => {
  const { rootDir, site, file } = await fixture(t);
  const result = await importStudioProject(file, { rootDir, id: "agent-safe" });
  const before = await readFile(result.configPath, "utf8");
  site.hero.headline = "수정한 제목";
  await writeFile(file, JSON.stringify(createProject(site)));
  await assert.rejects(() => importStudioProject(file, { rootDir, id: "agent-safe" }), /이미 있습니다/);
  assert.equal(await readFile(result.configPath, "utf8"), before);
  await importStudioProject(file, { rootDir, id: "agent-safe", force: true });
  assert.equal(JSON.parse(await readFile(result.configPath, "utf8")).hero.headline, "수정한 제목");
});

test("CLI rejects traversal IDs, unsupported files and bad projects before filesystem changes", async t => {
  const { rootDir, file } = await fixture(t);
  for (const id of ["../outside", "..\\outside", "C:\\outside", "a/b", "demo.json", "a"]) await assert.rejects(() => importStudioProject(file, { rootDir, id }), /사이트 ID/);
  await assert.rejects(() => importStudioProject(path.join(rootDir, "evil.html"), { rootDir }), /json/);
  const broken = createProject(example()); broken.site.compliance.footerDisclaimer = "";
  await writeFile(file, JSON.stringify(broken));
  await assert.rejects(() => importStudioProject(file, { rootDir, id: "bad-agent" }), /필수 문구/);
  assert.deepEqual(await readdir(rootDir), ["project.json"]);
});
