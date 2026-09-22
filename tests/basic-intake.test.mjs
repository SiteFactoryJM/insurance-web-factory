import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import { normalizeRequestedDomain, planBasicImport, readBasicWorkbook, siteIdFor } from "../scripts/import-basic-intake.mjs";

async function createWorkbook(file, values = {}) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("기본정보");
  const rows = [
    ["이름 *", values.name ?? "김테스트"],
    ["휴대폰 번호 *", values.phone ?? "010-9876-5432"],
    ["팩스번호", values.fax ?? "0504-1111-2222"],
    ["이메일", values.email ?? "test@example.com"],
    ["소속", values.company ?? "해온지사"],
    ["상담시간", values.availableHours ?? "평일 09:00 ~ 18:00"],
    ["인스타그램 주소", values.instagramUrl ?? "https://instagram.com/test.agent"],
    ["오픈카카오톡주소", values.kakaoUrl ?? "https://open.kakao.com/o/Test123"],
    ["직함", values.title ?? "보험설계사"],
    ["주소", values.officeAddress ?? "서울시 중구"],
    ["사진 파일명", values.photoFileName ?? "김테스트_프로필.png"],
    ["희망도메인", values.requestedDomain ?? "김테스트.kr"],
    ["가비아 아이디", "secret-id"],
    ["가비아 비밀번호", "secret-password"],
    ["수정 요청사항", "이 문장은 자동 반영하지 않음"],
  ];
  rows.forEach((row, index) => {
    sheet.getCell(index + 1, 1).value = row[0];
    sheet.getCell(index + 1, 2).value = row[1];
  });
  await workbook.xlsx.writeFile(file);
}

test("basic workbook maps only supported fields and ignores manual changes and credentials", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "basic-intake-read-"));
  const file = path.join(directory, "form.xlsx");
  await createWorkbook(file);
  const result = await readBasicWorkbook(file);
  assert.equal(result.values.name, "김테스트");
  assert.equal(result.values.phone, "010-9876-5432");
  assert.equal(result.values.photoFileName, "김테스트_프로필.png");
  assert.deepEqual(result.ignored.sort(), ["가비아 비밀번호", "가비아 아이디", "수정 요청사항"].sort());
  assert.doesNotMatch(JSON.stringify(result.values), /secret|수정/);
});

test("domain normalization supports Korean domains and registers root plus www", () => {
  const domains = normalizeRequestedDomain("김테스트.kr");
  assert.equal(domains.length, 2);
  assert.match(domains[0], /^xn--[a-z0-9-]+\.kr$/);
  assert.equal(domains[1], `www.${domains[0]}`);
});

test("site id is stable, private and valid", () => {
  const values = { name: "김테스트", phone: "010-9876-5432" };
  assert.equal(siteIdFor(values), siteIdFor(values));
  assert.match(siteIdFor(values), /^agent-[a-f0-9]{12}$/);
  assert.doesNotMatch(siteIdFor(values), /9876|5432/);
});

test("batch plan creates draft/noindex sites from basic information only", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "basic-intake-plan-"));
  const excelDir = path.join(directory, "excel");
  const photoDir = path.join(directory, "photos");
  const rootDir = path.join(directory, "repo");
  await Promise.all([mkdir(excelDir), mkdir(photoDir), mkdir(path.join(rootDir, "sites"), { recursive: true })]);
  await createWorkbook(path.join(excelDir, "김테스트.xlsx"));
  await writeFile(path.join(photoDir, "김테스트_프로필.png"), Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));

  const [plan] = await planBasicImport({ excelDir, photoDir, rootDir });
  assert.equal(plan.site.status, "draft");
  assert.equal(plan.site.seo.noIndex, true);
  assert.equal(plan.site.agent.name, "김테스트");
  assert.equal(plan.site.agent.company, "해온지사");
  assert.equal(plan.site.contact.fax, "0504-1111-2222");
  assert.equal(plan.site.sections.contactForm, false);
  assert.equal(plan.site.compliance.publicationConfirmed, false);
  assert.equal(plan.site.agent.profileImage, `/sites/${plan.id}/profile.png`);
  const serialized = JSON.stringify(plan.site);
  assert.doesNotMatch(serialized, /secret-id|secret-password|수정 요청사항/);
});

test("photo filename must include the person's name", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "basic-intake-photo-name-"));
  const excelDir = path.join(directory, "excel");
  const photoDir = path.join(directory, "photos");
  const rootDir = path.join(directory, "repo");
  await Promise.all([mkdir(excelDir), mkdir(photoDir), mkdir(path.join(rootDir, "sites"), { recursive: true })]);
  await createWorkbook(path.join(excelDir, "form.xlsx"), { photoFileName: "다른사람.png", requestedDomain: "" });
  await writeFile(path.join(photoDir, "다른사람.png"), Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));
  await assert.rejects(() => planBasicImport({ excelDir, photoDir, rootDir }), /사진 파일명에는 반드시 본인 이름/);
});
