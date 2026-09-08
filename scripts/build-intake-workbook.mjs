/** Portable intake workbook generator. Uses the existing importer dependency. */
import ExcelJS from "exceljs";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const spec = JSON.parse(await readFile(path.join(root, "config/intake-fields.json"), "utf8"));
const workbook = new ExcelJS.Workbook();
workbook.creator = "Insurance Web Factory";
workbook.calcProperties.fullCalcOnLoad = true;
const colors = { navy: "18324A", blue: "2D4864", pale: "EDF2F6", yellow: "FFF8D8", ink: "18324A", gray: "526477", line: "D5DEE8", white: "FFFFFF", red: "B42318", paleRed: "FDECEC", green: "147D53" };
const fill = color => ({ type: "pattern", pattern: "solid", fgColor: { argb: color } });
const border = Object.fromEntries(["top", "bottom", "left", "right"].map(edge => [edge, { style: "thin", color: { argb: colors.line } }]));
const sheets = Object.fromEntries(["안내", "작성양식", "템플릿안내", "제출전확인"].map(name => [name, workbook.addWorksheet(name, { properties: { defaultRowHeight: 32 }, pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 } })]));

function style(cell, options = {}) {
  cell.font = { name: "맑은 고딕", size: 11, color: { argb: colors.ink }, ...options.font };
  cell.alignment = { vertical: "middle", wrapText: true, ...options.alignment };
  if (options.fill) cell.fill = fill(options.fill);
  if (options.border !== false) cell.border = border;
}
function title(sheet, heading, subheading, lastColumn) {
  sheet.mergeCells(1, 1, 2, lastColumn);
  sheet.mergeCells(3, 1, 3, lastColumn);
  const primary = sheet.getCell(1, 1); primary.value = heading;
  style(primary, { fill: colors.navy, font: { bold: true, size: 21, color: { argb: colors.white } } });
  const secondary = sheet.getCell(3, 1); secondary.value = subheading;
  style(secondary, { fill: colors.navy, font: { size: 11, color: { argb: "DCE8F3" } } });
  sheet.getRow(1).height = 28; sheet.getRow(2).height = 28; sheet.getRow(3).height = 38;
  sheet.views = [{ state: "frozen", ySplit: 4, showGridLines: false }];
}
function section(sheet, row, label, columns) {
  sheet.mergeCells(row, 1, row, columns);
  const cell = sheet.getCell(row, 1); cell.value = label;
  style(cell, { fill: colors.blue, font: { bold: true, color: { argb: colors.white } } });
  sheet.getRow(row).height = 28;
}
function line(sheet, row, values, height = 42, header = false) {
  values.forEach((value, index) => {
    const cell = sheet.getCell(row, index + 1); cell.value = value;
    style(cell, { ...(header ? { fill: colors.pale, font: { bold: true } } : {}) });
  });
  sheet.getRow(row).height = height;
}

const guide = sheets["안내"];
guide.columns = [{ width: 24 }, { width: 33 }, { width: 82 }];
title(guide, "보험설계사 홈페이지 자료수집", "먼저 목적과 고객을 정하고, PC 문구와 모바일 문구를 나누어 작성해 주세요.", 3);
section(guide, 5, "작성 순서", 3);
[
  ["01 · 방향 정하기", "콘텐츠 기획", "홈페이지의 목적, 주로 만날 고객, 방문자가 할 첫 행동을 적습니다. 제작 참고용으로만 사용합니다."],
  ["02 · 정보 작성", "작성양식의 노란색 E열", "이름·소속·연락처·상담 범위는 확인 가능한 사실을 작성하세요. A열 시스템키는 변경하지 마세요."],
  ["03 · 문구 나누기", "PC는 설명, 모바일은 핵심", "PC 행 바로 아래의 모바일 행에 짧은 문구를 적습니다. 모바일이 비어 있으면 PC 원문을 그대로 표시합니다."],
  ["04 · 이미지 준비", "엑셀과 같은 폴더", "프로필은 세로 3:4 또는 4:5 사진을 권장합니다. 사용 권한을 확인하고 실제 파일명을 적으세요."],
  ["05 · 제출 전 점검", "제출전확인 시트", "필수값과 동의를 확인합니다. 제출 파일을 가져올 때 문구 길이와 설정을 다시 검증합니다."],
].forEach((row, index) => line(guide, index + 6, row, 55));
section(guide, 12, "문구 길이 기준 · 공백과 줄바꿈 포함", 3);
line(guide, 13, ["작성 영역", "PC / 모바일", "작성 요령"], 30, true);
[
  ["메인 제목", "40자 / 24자 이내", "누구에게 어떤 상담을 제공하는지 한 가지 메시지로 적습니다."],
  ["메인 설명", "120자 / 60자 이내", "상담 범위와 다음 행동을 알려 주세요. 모바일은 한두 문장으로 정리합니다."],
  ["소개 제목", "40자 / 24자 이내", "상담자의 원칙을 짧게 적습니다."],
  ["상세 소개", "400자 / 100자 이내", "실제 상담 방식과 고객이 준비할 내용을 설명합니다."],
  ["분야·절차 설명", "120자 / 48자 이내", "카드 한 개에 하나의 내용만 적습니다."],
  ["FAQ 답변", "240자 / 80자 이내", "답부터 짧게 적되, 가입 조건·불이익·개인정보 안내는 생략하지 않습니다."],
].forEach((row, index) => line(guide, index + 14, row, 43));
section(guide, 21, "꼭 확인해 주세요", 3);
[
  ["글자수 계산", "공백 포함", "한국어·공백·줄바꿈을 각각 한 글자로 셉니다. 최종 가져오기는 Unicode code points로 검증하며, 초과 문구를 자동으로 자르지 않습니다."],
  ["준법 검토", "승인받은 문구 유지", "소속·경력·수상은 사실만 작성하고 상품·보장 홍보는 소속 회사/GA 기준을 확인하세요. 모바일에서도 필수 고지를 유지합니다."],
  ["개인정보", "고객 자료는 넣지 않기", "이 양식에는 실제 고객의 주민등록번호·병력·계약 자료를 적지 마세요. 개인정보 담당자와 보유기간은 실제 운영 방침에 맞춥니다."],
  ["샘플과 운영", "초안은 draft", "샘플 도구는 페이지 최상단에서만 표시합니다. 상담 데모는 입력값을 저장·전송하지 않습니다."],
].forEach((row, index) => line(guide, index + 22, row, 58));

const form = sheets["작성양식"];
form.columns = [16, 18, 29, 8, 44, 44, 58, 16].map(width => ({ width }));
title(form, "홈페이지 작성양식 · PC / 모바일", "노란색 E열만 작성하세요. PC 아래 모바일 행은 선택입니다. H열의 글자수 기준을 확인해 주세요.", 8);
line(form, 4, ["시스템키", "구분", "작성 항목", "필수", "작성란", "작성 예시", "안내", "공백 포함 기준"], 34, true);
form.views = [{ state: "frozen", xSplit: 4, ySplit: 4, showGridLines: false }];
let row = 5;
let currentSection = "";
const fieldRows = new Map();
for (const field of spec.fields) {
  if (field.section !== currentSection) { currentSection = field.section; section(form, row++, currentSection, 8); }
  fieldRows.set(field.key, row);
  const height = field.maxLength ? Math.min(290, Math.max(68, Math.ceil(field.maxLength / 24) * 16 + 18)) : 74;
  line(form, row, [field.key, field.section, field.label, field.required ? "필수" : "선택", field.default ?? "", field.example ?? "", field.help ?? "", field.maxLength ?? "안내 참고"], height);
  style(form.getCell(row, 1), { fill: colors.pale, font: { size: 9, color: { argb: colors.gray } } });
  style(form.getCell(row, 2), { fill: colors.pale, font: { size: 10, color: { argb: colors.gray } } });
  style(form.getCell(row, 3), { font: { bold: true } });
  style(form.getCell(row, 4), { fill: field.required ? colors.paleRed : colors.pale, font: { size: 10, bold: true, color: { argb: field.required ? colors.red : colors.gray } }, alignment: { horizontal: "center" } });
  style(form.getCell(row, 5), { fill: colors.yellow });
  style(form.getCell(row, 6), { font: { color: { argb: colors.gray }, size: 10, italic: true } });
  style(form.getCell(row, 7), { font: { color: { argb: colors.gray }, size: 10 } });
  style(form.getCell(row, 8), { fill: colors.pale, font: { bold: true }, alignment: { horizontal: "center" } });
  if (field.maxLength) form.getCell(row, 8).numFmt = '0"자 이내"';
  if (field.options) form.getCell(row, 5).dataValidation = { type: "list", allowBlank: !field.required, formulae: [`"${field.options.join(",")}"`], showErrorMessage: true, errorTitle: "목록에서 선택해 주세요", error: "안내된 선택값을 사용해 주세요." };
  if (field.required) form.addConditionalFormatting({ ref: `E${row}`, rules: [{ type: "expression", formulae: [`AND($D${row}="필수",$E${row}="")`], style: { fill: fill(colors.paleRed), font: { color: { argb: colors.red } } } }] });
  row++;
}
form.pageSetup.printTitlesRow = "1:4";
form.pageSetup.printArea = `A1:H${row - 1}`;

const templates = sheets["템플릿안내"];
templates.columns = [22, 24, 40, 50].map(width => ({ width }));
title(templates, "5가지 배치 · 6가지 색상", "배치와 색상을 별도로 고릅니다. 시안 비교 도구는 실제 소개 페이지와 구분해 최상단에 표시합니다.", 4);
line(templates, 5, ["템플릿 값", "배치 이름", "어떤 내용에 맞나요?", "페이지에서 강조할 내용"], 36, true);
[
  ["trust-blue", "신뢰의 기준", "소개와 상담 분야를 고르게 안내", "인물 소개 → 상담 분야 → 절차 → 문의"],
  ["warm-care", "사람과 대화", "상담 원칙과 가족의 상황을 전달", "상담자의 원칙과 고객이 준비할 질문"],
  ["premium-navy", "선택의 기준", "가입 전에 확인할 기준을 설명", "보장 범위·유지할 예산·계약 조건"],
  ["clean-minimal", "한 장의 정리", "가입 내역을 항목별로 안내", "자료 확인 → 항목 정리 → 질문 기록"],
  ["local-friendly", "바로 묻는 상담", "주제를 고르고 쉬운 문의로 연결", "질문 선택과 다음 행동을 명확하게"],
].forEach((value, index) => line(templates, index + 6, value, 65));
section(templates, 12, "색상은 배치와 독립적으로 비교합니다", 4);
line(templates, 13, ["navy / forest", "네이비 / 포레스트", "slate / charcoal", "슬레이트 / 차콜"], 46);
line(templates, 14, ["teal / stone", "틸 / 스톤", "색상 선택", "샘플 도구에서 30가지 조합을 비교하세요."], 46);
line(templates, 16, ["문구 검수", "모바일 우선 확인", "CTA는 행동을 구체적으로", "예: 상담 분야 보기 / 상담 요청하기. 12자 이내를 권장합니다."], 64);

const check = sheets["제출전확인"];
check.columns = [29, 27, 85].map(width => ({ width }));
title(check, "제출 전 자동 확인", "필수값·동의 상태를 확인한 뒤 엑셀과 이미지 파일을 함께 제출해 주세요.", 3);
line(check, 5, ["검사 항목", "결과", "설명"], 34, true);
const required = spec.fields.filter(field => field.required);
const missing = required.filter(field => !(field.default ?? "")).length;
const checks = [
  ["전체 필수 항목 수", { formula: `COUNTIF('작성양식'!D5:D${row - 1},"필수")`, result: required.length }, "작성해야 할 필수 항목 수입니다."],
  ["비어 있는 필수 항목", { formula: `COUNTIFS('작성양식'!D5:D${row - 1},"필수",'작성양식'!E5:E${row - 1},"")`, result: missing }, "0이어야 제출 가능합니다."],
  ...[["content_truth_confirmed", "기재 내용 사실 확인"], ["photo_use_confirmed", "사진/로고 사용권 확인"], ["publication_confirmed", "홈페이지 게시 동의"]].map(([key, label]) => [label, { formula: `'작성양식'!E${fieldRows.get(key)}`, result: "아니오" }, "‘예’여야 실제 게시할 수 있습니다."]),
  ["광고심의 상태", { formula: `'작성양식'!E${fieldRows.get("advertising_review_status")}`, result: "pending" }, "실제 게시 전 소속 회사/GA 기준을 확인합니다."],
];
checks.forEach((values, index) => line(check, index + 6, values, 43));
section(check, 13, "필수값과 동의 확인 결과", 3);
check.mergeCells("A14:C15");
check.getCell("A14").value = { formula: 'IF(AND(B7=0,B8="예",B9="예",B10="예"),"제출 가능","작성양식을 다시 확인해 주세요")', result: "작성양식을 다시 확인해 주세요" };
style(check.getCell("A14"), { fill: colors.paleRed, font: { color: { argb: colors.red }, bold: true, size: 16 }, alignment: { horizontal: "center" } });
check.addConditionalFormatting({ ref: "A14:C15", rules: [{ type: "expression", formulae: ['$A$14="제출 가능"'], style: { fill: fill("EAF7F1"), font: { color: { argb: colors.green }, bold: true } } }] });
check.addConditionalFormatting({ ref: "B7", rules: [{ type: "cellIs", operator: "greaterThan", formulae: [0], style: { fill: fill(colors.paleRed), font: { color: { argb: colors.red } } } }] });
section(check, 17, "최종 검수는 가져오기와 미리보기에서 진행합니다", 3);
[
  ["문구 길이", "H열 기준 확인", "PC와 모바일 문구가 각각 기준 이내인지 가져오기에서 검증합니다. 초과하면 항목명과 현재 글자수를 알려줍니다."],
  ["첨부 파일", "사진 파일명 일치", "엑셀에 적은 파일명과 같은 이름으로 이미지를 함께 제출합니다."],
  ["준법과 개인정보", "필수 고지 유지", "모바일 문구에도 조건과 주의사항을 남기고 개인정보 처리 내용은 실제 운영 방식과 맞춥니다."],
  ["제출할 파일", "엑셀 + 프로필 사진", "예: 김하늘_홈페이지자료.xlsx / profile.jpg / logo.png(선택)"],
].forEach((values, index) => line(check, index + 18, values, 58));

const output = path.join(root, "forms", "보험설계사_홈페이지_자료수집_양식.xlsx");
await mkdir(path.dirname(output), { recursive: true });
await workbook.xlsx.writeFile(output);
console.log(`Created ${output}: ${spec.fields.length} fields, ${required.length} required; 4 worksheets.`);
