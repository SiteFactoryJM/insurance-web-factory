import { DESIGN_SECTION_IDS, type DesignSectionId, type SiteConfig } from "../types.js";
import { renderSitePage } from "../render/page.js";
import { PALETTES } from "../render/design-system.js";
import { escapeHtml as esc } from "../utils/html.js";
import { createProject, createStudioExample, parseProject, validateProjectSite, validateImageSource, MAX_IMAGE_BYTES, MAX_PROJECT_BYTES } from "./project.js";

type FieldOptions = { max?: number; rows?: number; optional?: boolean; hint?: string; placeholder?: string; type?: string; lines?: boolean };
type PatternOption = readonly [string, string, string];
const bootstrap = document.getElementById("studio-bootstrap");
if (!bootstrap?.textContent) throw new Error("페이지 예시를 불러오지 못했습니다.");
const example = createStudioExample(JSON.parse(bootstrap.textContent) as SiteConfig);
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const defaultDesign: NonNullable<SiteConfig["design"]> = { hero: "editorial", services: "list", about: "editorial", process: "steps", faq: "accordion", footer: "classic", ornament: "line", density: "airy", sectionOrder: [...DESIGN_SECTION_IDS], hiddenSections: ["reviews"] };
const sectionNames: Record<DesignSectionId, string> = { services: "상담 분야", about: "소개와 원칙", process: "진행 과정", reviews: "고객 후기", faq: "자주 묻는 질문", contact: "상담 연락" };
const patterns: Record<string, { label: string; options: readonly PatternOption[] }> = {
  hero: { label: "첫 화면", options: [["editorial", "에디토리얼", "풍경과 여백, 매거진 같은 첫인상"], ["portrait", "인물 중심", "프로필 사진과 소개를 나란히"], ["statement", "메시지 중심", "큰 제목과 한 문장에 집중"]] },
  services: { label: "상담 분야", options: [["list", "정돈된 목록", "번호와 설명을 넓은 행으로"], ["cards", "분야별 카드", "각 상담 분야를 독립된 카드로"], ["split", "두 단의 구성", "소개와 분야를 좌우로 배치"]] },
  about: { label: "소개와 원칙", options: [["editorial", "읽는 소개", "제목과 이야기를 균형 있게"], ["profile", "프로필 소개", "사진과 소속 정보를 중심으로"], ["quote", "한 문장의 원칙", "상담 철학을 인용문처럼 크게"]] },
  process: { label: "진행 과정", options: [["steps", "단계별 안내", "순서대로 살펴보는 단계 구성"], ["timeline", "이어지는 흐름", "선을 따라 읽는 세로 타임라인"]] },
  faq: { label: "자주 묻는 질문", options: [["accordion", "접고 펼치기", "궁금한 질문만 열어 확인"], ["columns", "모두 펼치기", "질문과 답변을 한눈에 확인"]] },
  footer: { label: "푸터 구성", options: [["classic", "클래식", "왼쪽 소개, 오른쪽 연락처"], ["columns", "세 단의 정보", "소개·소속·연락처를 나란히"], ["minimal", "간결한 정렬", "필수 정보를 순서대로 정리"]] },
  ornament: { label: "배경 디테일", options: [["line", "가는 선", "여백을 가로지르는 섬세한 선"], ["grid", "은은한 격자", "배경에 더하는 건축적인 질서"], ["none", "깨끗한 면", "장식 없이 글과 사진에 집중"]] },
  density: { label: "여백", options: [["airy", "넉넉하게", "천천히 읽는 여유로운 간격"], ["compact", "단정하게", "한 화면에 더 많은 정보"]] },
};
function blankSite(): SiteConfig {
  const site = clone(example);
  site.id = "my-consultation";
  site.palette = "forest";
  site.headingFont = "noto-serif-kr";
  site.design = clone(defaultDesign);
  site.agent = { name: "", title: "보험설계사", company: "", branch: "", registrationNumber: "", businessNumber: "", regions: [], profileImage: "/assets/profile-placeholder.svg" };
  site.hero = { eyebrow: "", headline: "", subheadline: "", primaryCtaLabel: "상담 문의하기", secondaryCtaLabel: "상담 분야 보기", trustNote: "상담 문의는 보험 가입 신청이 아닙니다.", image: example.hero.image || "/assets/atelier-interior.webp" };
  site.intro = { title: "", body: "", philosophy: "" };
  site.specialties = Array.from({ length: 3 }, () => ({ title: "", body: "" }));
  site.process = Array.from({ length: 3 }, () => ({ title: "", body: "" }));
  site.faqs = Array.from({ length: 2 }, () => ({ question: "", answer: "" }));
  site.career = [];
  site.reviews = [];
  site.sections = { career: false, process: true, reviews: false, faq: true, location: false, contactForm: true };
  site.contact = { phone: "010-0000-0000", email: "", officeAddress: "", availableHours: "평일 09:00–18:00" };
  site.footer = { heading: "", note: "" };
  site.contentBrief = {};
  site.seo = { title: "나의 보험상담 페이지", description: "상담 분야와 상담 원칙, 담당자 정보를 안내하는 페이지입니다.", noIndex: true };
  site.compliance.privacyOfficer = "페이지 운영자";
  site.compliance.privacyRetentionPeriod = "이 제작 예시에서는 상담정보를 저장하거나 전송하지 않습니다.";
  site.compliance.advertisingReviewNumber = "";
  site.compliance.footerDisclaimer = "본 페이지는 보험설계사 소개 및 상담 연락을 위한 제작 초안입니다. 보험 가입 전 상품설명서와 약관을 확인하시기 바랍니다. 기존 계약을 해지하고 새 계약을 체결할 경우 가입 거절, 보험료 인상, 보장 변경 등의 불이익이 생길 수 있습니다.";
  delete site.templateContent;
  return site;
}
let site = blankSite();
let step = 0;
let dirty = false;
let hasOwnContent = false;
let previewTimer: number | undefined;
let view: "editor" | "preview" = "editor";
const panels = document.getElementById("studio-panels")!;
const preview = document.getElementById("site-preview") as HTMLIFrameElement;
const previewMat = document.querySelector<HTMLElement>(".preview-mat")!;
const previewCanvas = document.querySelector<HTMLElement>(".preview-canvas")!;
const status = document.getElementById("studio-status")!;
const fileInput = document.getElementById("project-file") as HTMLInputElement;
const optionalNonempty = /(?:mobileHeadline|mobileSubheadline|mobileTitle|mobileBody|mobileAnswer|contentBrief\.(?:purpose|targetAudience|primaryAction))$/;

function readPath(path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, site);
}
function setPath(path: string, value: unknown): void {
  const keys = path.split(".");
  let parent = site as unknown as Record<string, unknown>;
  for (const key of keys.slice(0, -1)) {
    if (!parent[key] || typeof parent[key] !== "object") parent[key] = {};
    parent = parent[key] as Record<string, unknown>;
  }
  const key = keys.at(-1)!;
  if (value === "" && optionalNonempty.test(path)) delete parent[key];
  else parent[key] = value;
}
function field(path: string, label: string, opts: FieldOptions = {}): string {
  const { max, rows, optional, hint, placeholder, type = "text", lines } = opts;
  const value = readPath(path);
  const text = lines && Array.isArray(value) ? value.join("\n") : String(value ?? "");
  const id = `field-${path.replaceAll(".", "-")}`;
  const length = Array.from(text).length;
  return `<label class="field" for="${id}"><span class="field-label">${esc(label)}${optional ? '<span class="optional">선택</span>' : ""}</span>${rows ? `<textarea id="${id}" name="${esc(path)}" rows="${rows}" data-field="${esc(path)}"${lines ? ' data-lines="true"' : ""}${max ? ` data-max="${max}"` : ""} aria-describedby="${id}-meta" placeholder="${esc(placeholder || "")}">${esc(text)}</textarea>` : `<input id="${id}" name="${esc(path)}" type="${type}" value="${esc(text)}" data-field="${esc(path)}"${max ? ` data-max="${max}"` : ""} aria-describedby="${id}-meta" placeholder="${esc(placeholder || "")}">`}<span class="field-meta" id="${id}-meta"><span>${esc(hint || (max ? `공백 포함 ${max}자 이내` : ""))}</span>${max ? `<span class="char-count${length > max ? " over" : ""}" data-count="${esc(path)}">${length} / ${max}</span>` : ""}</span></label>`;
}
function copyPair(pcPath: string, mobilePath: string, label: string, pcMax: number, mobileMax: number, rows = 3): string {
  return `<div class="copy-pair">${field(pcPath, `${label} · PC`, { max: pcMax, rows, placeholder: "PC에서 보여줄 문구" })}${field(mobilePath, `${label} · 모바일`, { max: mobileMax, rows: 2, optional: true, hint: `공백 포함 ${mobileMax}자 · 비우면 PC 문구 사용`, placeholder: "핵심만 짧게 적어 주세요" })}</div>`;
}
function group(title: string, content: string, exampleKey?: string): string {
  return `<section class="field-group"><div class="group-top"><h3>${esc(title)}</h3>${exampleKey ? `<button type="button" class="use-example" data-example="${esc(exampleKey)}">예시 사용</button>` : ""}</div>${content}</section>`;
}
function patternGroup(key: string): string {
  const definition = patterns[key];
  const selected = site.design?.[key as keyof typeof defaultDesign] ?? defaultDesign[key as keyof typeof defaultDesign];
  return `<fieldset class="field-group"><legend>${definition.label}</legend><div class="pattern-list">${definition.options.map(([value, label, description]) => `<label class="pattern-choice"><input type="radio" name="design-${key}" value="${value}" data-design="${key}"${selected === value ? " checked" : ""}><span><span class="pattern-drawing drawing-${value}" aria-hidden="true"><i></i><i></i><i></i></span><span><b>${label}</b><small>${description}</small></span></span></label>`).join("")}</div></fieldset>`;
}
function orderControls(): string {
  const order = site.design?.sectionOrder?.length ? site.design.sectionOrder : [...DESIGN_SECTION_IDS];
  return `<fieldset class="field-group"><legend>섹션 순서와 표시</legend><p class="hint">화살표로 순서를 바꾸고, 체크를 해제해 숨기세요. 푸터와 필수 고지는 항상 표시됩니다.</p><ol class="section-order">${order.map((id, index) => `<li class="section-row"><label><input type="checkbox" data-section="${id}"${!site.design?.hiddenSections?.includes(id) ? " checked" : ""}>${sectionNames[id]}</label><button type="button" class="reorder" data-move="${id}" data-direction="-1" aria-label="${sectionNames[id]} 위로 이동"${index === 0 ? " disabled" : ""}>↑</button><button type="button" class="reorder" data-move="${id}" data-direction="1" aria-label="${sectionNames[id]} 아래로 이동"${index === order.length - 1 ? " disabled" : ""}>↓</button></li>`).join("")}</ol></fieldset>`;
}
function stylePanel(): string {
  return `<h2 class="panel-heading">어떤 인상을 전할까요.</h2><p class="panel-subtitle">절제된 색, 읽기 좋은 글, 여백의 균형.<br>섹션마다 어울리는 구성을 고르세요.</p><fieldset class="field-group"><legend>컬러 무드</legend><div class="color-options">${(["forest", "stone", "navy", "charcoal", "slate", "teal"] as const).map(id => `<label class="color-choice"><input type="radio" name="palette" value="${id}" data-field="palette"${site.palette === id ? " checked" : ""}><span><i class="swatch" style="--swatch:${PALETTES[id].accent}" aria-hidden="true"></i>${({ forest: "포레스트", stone: "웜스톤", navy: "네이비", charcoal: "차콜", slate: "슬레이트", teal: "딥 틸" })[id]}</span></label>`).join("")}</div></fieldset><fieldset class="field-group"><legend>제목 서체</legend><div class="font-options"><label class="font-choice"><input type="radio" name="headingFont" value="noto-serif-kr" data-field="headingFont"${site.headingFont === "noto-serif-kr" ? " checked" : ""}><span><strong class="serif">신뢰의 깊이</strong><small>차분한 명조</small></span></label><label class="font-choice"><input type="radio" name="headingFont" value="pretendard" data-field="headingFont"${site.headingFont === "pretendard" ? " checked" : ""}><span><strong>신뢰의 기준</strong><small>선명한 고딕</small></span></label></div><p class="hint" style="margin:12px 0 0">본문은 두 선택 모두 읽기 편한 고딕체입니다.</p></fieldset>${patternGroup("hero")}${patternGroup("services")}<details class="section-details"><summary>소개·진행·FAQ 패턴 고르기</summary>${patternGroup("about")}${patternGroup("process")}${patternGroup("faq")}</details><details class="section-details"><summary>배경 디테일과 여백</summary>${patternGroup("ornament")}${patternGroup("density")}</details>${orderControls()}<p class="editor-note">선택한 스타일을 유지한 채, 다음 단계에서 내 소개를 작성하거나 예시 문구를 가져올 수 있습니다.</p><button type="button" class="btn blank-button" data-action="blank">빈 원고로 다시 시작</button>${panelNav(0)}`;
}
function cardsEditor(key: "specialties" | "process"): string {
  const items = site[key];
  const noun = key === "specialties" ? "상담 분야" : "진행 단계";
  const max = key === "specialties" ? 6 : 4;
  return items.map((_, index) => `<article class="list-card"><div class="list-card-top"><h4>${noun} ${index + 1}</h4><button type="button" class="delete-item" data-remove="${key}" data-index="${index}" aria-label="${noun} ${index + 1} 삭제"${items.length <= 3 ? " disabled" : ""}>삭제</button></div>${field(`${key}.${index}.title`, "제목", { max: 60, placeholder: key === "specialties" ? "예: 현재 보장 점검" : "예: 일정 조율" })}${copyPair(`${key}.${index}.body`, `${key}.${index}.mobileBody`, "설명", 120, 48, 3)}</article>`).join("") + `<button type="button" class="add-item" data-add="${key}"${items.length >= max ? " disabled" : ""}>+ ${noun} 추가 (${items.length}/${max})</button>`;
}
function faqEditor(): string {
  return site.faqs.map((_, index) => `<article class="list-card"><div class="list-card-top"><h4>질문 ${index + 1}</h4><button type="button" class="delete-item" data-remove="faqs" data-index="${index}" aria-label="질문 ${index + 1} 삭제"${site.faqs.length <= 2 ? " disabled" : ""}>삭제</button></div>${field(`faqs.${index}.question`, "질문", { max: 100, rows: 2 })}${copyPair(`faqs.${index}.answer`, `faqs.${index}.mobileAnswer`, "답변", 240, 80, 4)}</article>`).join("") + `<button type="button" class="add-item" data-add="faqs"${site.faqs.length >= 8 ? " disabled" : ""}>+ 질문 추가 (${site.faqs.length}/8)</button>`;
}
function reviewsEditor(): string {
  return `<p class="hint">실제 후기 원고가 준비된 경우에 작성하세요. 예시는 ‘디자인 예시 · 실제 후기 아님’으로 표시됩니다.</p>${(site.reviews || []).map((review, index) => `<article class="list-card"><div class="list-card-top"><h4>후기 ${index + 1}</h4><button type="button" class="delete-item" data-remove="reviews" data-index="${index}" aria-label="후기 ${index + 1} 삭제">삭제</button></div>${field(`reviews.${index}.quote`, "후기 내용", { max: 400, rows: 4 })}${field(`reviews.${index}.author`, "작성자 표시", { max: 80 })}${field(`reviews.${index}.context`, "상담 주제", { max: 120, optional: true })}<label class="check-line"><input type="checkbox" data-field="reviews.${index}.isExample"${review.isExample ? " checked" : ""}>실제 후기가 아닌 디자인 예시입니다.</label></article>`).join("")}<button type="button" class="add-item" data-add="reviews"${(site.reviews?.length || 0) >= 6 ? " disabled" : ""}>+ 후기 추가 (${site.reviews?.length || 0}/6)</button>`;
}
function contentPanel(): string {
  return `<h2 class="panel-heading">나의 이야기를 담습니다.</h2><p class="panel-subtitle">처음이라면 ‘예시 사용’으로 시작하세요. PC는 충분히, 모바일은 핵심만 담습니다.</p>${group("설계사 프로필", `${field("agent.name", "이름", { max: 60, placeholder: "설계사 이름" })}${field("agent.title", "직함", { max: 80 })}${field("agent.company", "소속 GA·대리점", { max: 120, placeholder: "소속 회사 또는 대리점 이름" })}${field("agent.branch", "지점·지사", { max: 120, optional: true })}${field("agent.regions", "상담 가능 지역", { rows: 3, lines: true, optional: true, hint: "한 줄에 하나씩 · 최대 12개", placeholder: "서울·경기\n전국 비대면" })}<div class="upload-label"><img class="upload-thumb" src="${esc(site.agent.profileImage || "/assets/profile-placeholder.svg")}" alt="${esc(site.agent.name || "설계사")} 프로필 미리보기"><div><p>프로필 사진</p><small>JPG·PNG·WebP / 최대 3MB</small></div></div><label class="field" for="profile-upload"><span class="field-label">사진 파일 선택</span><input id="profile-upload" type="file" data-upload="agent.profileImage" accept="image/jpeg,image/png,image/webp"><span class="field-meta">사진은 제작 파일에 함께 포함됩니다.</span></label><button type="button" class="use-example" data-action="remove-photo">프로필 사진 제거</button>`, "profile")}${group("첫 화면의 문구", `${field("hero.eyebrow", "제목 위 짧은 문구", { max: 80, optional: true })}${copyPair("hero.headline", "hero.mobileHeadline", "메인 제목", 40, 24, 3)}<div style="height:20px"></div>${copyPair("hero.subheadline", "hero.mobileSubheadline", "메인 설명", 120, 60, 4)}<div style="height:20px"></div>${field("hero.primaryCtaLabel", "주요 버튼 문구", { max: 24 })}${field("hero.secondaryCtaLabel", "보조 버튼 문구", { max: 24 })}${field("hero.trustNote", "버튼 아래 안내", { max: 240, rows: 3, optional: true })}<label class="field" for="hero-upload"><span class="field-label">첫 화면 풍경 사진 <span class="optional">선택</span></span><input id="hero-upload" type="file" data-upload="hero.image" accept="image/jpeg,image/png,image/webp"><span class="field-meta">JPG·PNG·WebP · 최대 3MB · 에디토리얼 구성에 사용</span></label>`, "hero")}<details class="section-details" open><summary>소개와 상담 원칙</summary>${group("소개 문구", `${copyPair("intro.title", "intro.mobileTitle", "소개 제목", 40, 24)}<div style="height:20px"></div>${copyPair("intro.body", "intro.mobileBody", "소개 본문", 400, 100, 6)}<div style="height:20px"></div>${field("intro.philosophy", "한 문장의 상담 원칙", { max: 160, rows: 3, optional: true })}${field("career", "경력·자격", { rows: 3, lines: true, optional: true, hint: "확인 가능한 내용만 · 한 줄에 하나씩 · 최대 20개" })}`, "intro")}</details><details class="section-details"><summary>상담 분야 (${site.specialties.length})</summary>${group("전문 분야", cardsEditor("specialties"), "specialties")}</details><details class="section-details"><summary>진행 과정 (${site.process.length})</summary>${group("상담 순서", cardsEditor("process"), "process")}</details><details class="section-details"><summary>자주 묻는 질문 (${site.faqs.length})</summary>${group("질문과 답변", faqEditor(), "faqs")}</details><details class="section-details"><summary>고객 후기 (${site.reviews?.length || 0})</summary>${group("후기 원고", reviewsEditor(), "reviews")}</details><details class="section-details"><summary>상담 설문과 제작 방향</summary>${group("상담 주제 선택지", field("consultation.topics", "설문에 표시할 상담 주제", { rows: 6, lines: true, hint: "한 줄에 하나씩 · 중복 없이 1~12개" }), "topics")}${group("페이지 제작 방향", `${field("contentBrief.purpose", "페이지의 목적", { max: 100, rows: 3, optional: true })}${field("contentBrief.targetAudience", "주로 만나고 싶은 고객", { max: 80, rows: 3, optional: true })}${field("contentBrief.primaryAction", "방문자가 해 주면 좋은 행동", { max: 60, rows: 2, optional: true })}`, "brief")}</details>${panelNav(1)}`;
}
function footerPanel(): string {
  return `<h2 class="panel-heading">마지막까지, 신뢰 있게.</h2><p class="panel-subtitle">소속과 연락처를 분명하게 안내하세요. 정보와 고지가 잘 읽히는 푸터를 만듭니다.</p><div class="footer-preview" aria-label="푸터 정보 구성 안내"><strong>설계사 이름 보험상담</strong><p>소속 GA·대리점 · 등록 정보<br>주소</p><p>전화 · 이메일 · 상담시간</p><hr><p>보험 고지와 개인정보 안내</p></div>${patternGroup("footer")}${group("푸터 소개", `${field("footer.heading", "푸터 제목", { max: 80, optional: true, placeholder: "예: 홍길동 보험상담", hint: "비우면 이름과 직함으로 표시" })}${field("footer.note", "추가 안내", { max: 400, rows: 4, optional: true, placeholder: "예: 방문 상담은 사전 예약제로 진행합니다." })}${field("agent.registrationNumber", "설계사 등록번호", { max: 80, optional: true })}${field("agent.businessNumber", "사업자등록번호", { max: 80, optional: true })}`, "footer")}${group("연락처와 상담 시간", `${field("contact.phone", "전화번호", { max: 32, type: "tel" })}${field("contact.email", "이메일", { max: 254, type: "email", optional: true, placeholder: "email@example.com" })}${field("contact.kakaoUrl", "카카오톡 상담 주소", { max: 2048, type: "url", optional: true, placeholder: "https://..." })}${field("contact.instagramUrl", "인스타그램 주소", { max: 2048, type: "url", optional: true })}${field("contact.availableHours", "상담 가능 시간", { max: 100 })}${field("contact.officeAddress", "사무실 주소", { max: 240, rows: 3, optional: true })}${field("contact.mapUrl", "지도 링크", { max: 2048, type: "url", optional: true })}`, "contact")}${group("보험 고지와 개인정보", `<p class="hint">필수 고지는 줄이거나 숨기지 않습니다. 실제 게시 전에 소속 조직의 확인을 받아 주세요.</p>${field("compliance.footerDisclaimer", "보험 고지 문구", { max: 2000, rows: 8 })}${field("compliance.advertisingReviewNumber", "광고 심의번호", { max: 120, optional: true })}${field("compliance.advertisingReviewExpiresAt", "심의 유효기간", { max: 40, optional: true })}${field("compliance.privacyOfficer", "개인정보 담당자", { max: 120 })}${field("compliance.privacyRetentionPeriod", "개인정보 보유 기간 안내", { max: 500, rows: 4 })}`, "compliance")}<details class="section-details"><summary>페이지 제목과 공유 설명</summary>${field("seo.title", "브라우저·검색 제목", { max: 120 })}${field("seo.description", "페이지 설명", { max: 300, rows: 4 })}<p class="hint">제작 파일은 검색 비공개 초안으로 저장됩니다.</p></details>${panelNav(2)}`;
}
function savePanel(): string {
  return `<h2 class="panel-heading">이제, 제작자에게 전하세요.</h2><p class="panel-subtitle">작성한 내용과 선택한 구성을 파일로 남겨 두세요. 파일을 다시 열어 이어서 수정할 수 있습니다.</p><div id="studio-errors" class="error-box" role="alert" tabindex="-1"></div><div class="save-card"><span class="pill">다시 편집할 수 있는 원본</span><h3>제작 파일 저장</h3><p>선택한 패턴, PC·모바일 원고, 사진과 푸터 정보를 JSON 파일 하나에 담습니다.</p><button type="button" class="btn primary" data-action="export">제작 파일 저장 ↓</button></div><div class="save-card"><span class="pill">검토하고 공유하는 문서</span><h3>제작 의뢰서 PDF</h3><p>모든 원고와 구성 정보를 보기 좋은 제작서로 정리합니다. 인쇄 창에서 ‘PDF로 저장’을 선택하세요.</p><button type="button" class="btn" data-action="print">PDF로 저장 ↓</button></div><p class="save-note">다운로드한 제작 파일을 제작자에게 전달해 주세요. 개인별 페이지 제작에 사용하고, 나중에 ‘파일 불러오기’로 복원할 수 있습니다.</p><p class="hint">입력 내용은 서버로 전송하거나 브라우저 저장소에 자동 저장하지 않습니다. 페이지를 닫기 전에 제작 파일을 저장해 주세요.</p><div class="brief-details"><h3 style="font-size:17px">현재 구성</h3><p>${esc(PALETTES[site.palette || "forest"].name)} · ${site.headingFont === "noto-serif-kr" ? "명조 제목" : "고딕 제목"}<br>${esc(patterns.hero.options.find(option => option[0] === site.design?.hero)?.[1] || "에디토리얼")} · ${(site.design?.sectionOrder || DESIGN_SECTION_IDS).filter(id => !site.design?.hiddenSections?.includes(id)).length}개 섹션</p></div>${panelNav(3)}`;
}
function panelNav(index: number): string {
  return `<div class="panel-nav">${index > 0 ? `<button type="button" class="btn" data-go-step="${index - 1}">← 이전</button>` : ""}${index < 3 ? `<button type="button" class="btn primary" data-go-step="${index + 1}">${["프로필·문구 작성", "푸터 작성", "파일 저장하기"][index]} →</button>` : ""}</div>`;
}
function renderPanels(): void {
  const openSummaries = [...panels.querySelectorAll<HTMLDetailsElement>("details[open]")].map(details => details.querySelector("summary")?.textContent?.replace(/\s*\(\d+\)$/, ""));
  panels.innerHTML = [stylePanel(), contentPanel(), footerPanel(), savePanel()].map((content, index) => `<section class="panel" id="panel-${index}" role="tabpanel" aria-labelledby="step-${index}"${step === index ? "" : " hidden"}>${content}</section>`).join("");
  for (const details of panels.querySelectorAll<HTMLDetailsElement>("details")) if (openSummaries.includes(details.querySelector("summary")?.textContent?.replace(/\s*\(\d+\)$/, ""))) details.open = true;
}
function activateStep(index: number, focus = false): void {
  step = Math.max(0, Math.min(3, index));
  document.querySelectorAll<HTMLButtonElement>("[data-step]").forEach(button => {
    const selected = Number(button.dataset.step) === step;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus();
  });
  document.querySelectorAll<HTMLElement>(".panel").forEach((panel, index) => { panel.hidden = index !== step; });
  setView("editor");
}
function setView(next: "editor" | "preview"): void {
  view = next;
  document.getElementById("studio-workspace")!.dataset.view = view;
  document.querySelectorAll<HTMLButtonElement>("button[data-view]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.view === view)));
  fitPreview();
}
function fitPreview(): void {
  const width = preview.dataset.viewport === "mobile" ? 390 : 1440;
  const bounds = previewMat.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const scale = Math.min(1, bounds.width / width);
  previewCanvas.style.width = `${width * scale}px`;
  previewCanvas.style.height = `${bounds.height}px`;
  preview.style.width = `${width}px`;
  preview.style.height = `${Math.ceil(bounds.height / scale)}px`;
  preview.style.transform = `scale(${scale})`;
  document.getElementById("preview-size")!.textContent = `${width === 390 ? "모바일" : "PC"} · ${width}px`;
}
function announce(message: string): void { status.textContent = message; }
function markChanged(content = true): void {
  dirty = true;
  if (content) hasOwnContent = true;
  document.getElementById("save-status")!.textContent = "변경 내용 · 파일 저장 전";
  window.clearTimeout(previewTimer);
  previewTimer = window.setTimeout(updatePreview, 120);
}
function updatePreview(): void {
  let scrollY = 0;
  try { scrollY = preview.contentWindow?.scrollY || 0; } catch { /* first frame */ }
  const renderConfig = hasOwnContent ? clone(site) : { ...clone(example), palette: site.palette, headingFont: site.headingFont, design: clone(site.design) };
  renderConfig.demo = { enabled: true, allowTemplateSwitch: false, submissionMode: "discard" };
  delete renderConfig.templateContent;
  document.getElementById("preview-label")!.innerHTML = hasOwnContent ? '내 페이지 미리보기<small>작성한 내용이 실시간으로 반영됩니다.</small>' : '예시 미리보기<small>‘예시로 시작’하면 이 내용을 가져옵니다.</small>';
  preview.onload = () => { fitPreview(); try { preview.contentWindow?.scrollTo(0, scrollY); } catch { /* navigation to a linked page */ } };
  preview.srcdoc = renderSitePage(renderConfig, new Request(`${location.origin}/`), { studioPreview: true });
}
function confirmReplace(message: string): boolean { return !dirty || window.confirm(message); }
function useFullExample(): void {
  if (!confirmReplace("작성 중인 원고를 대표 예시로 바꿀까요? 선택한 스타일은 유지됩니다.")) return;
  const design = clone(site.design);
  const palette = site.palette;
  const font = site.headingFont;
  site = clone(example);
  site.design = design;
  site.palette = palette;
  site.headingFont = font;
  site.demo = { enabled: true, allowTemplateSwitch: false, submissionMode: "discard" };
  markChanged();
  renderPanels();
  announce("대표 예시의 문구와 사진을 가져왔습니다. 이름과 연락처부터 내 정보로 바꿔 보세요. 후기는 디자인 예시로 표시됩니다.");
}
function useExampleGroup(key: string): void {
  const labels: Record<string, string> = { profile: "프로필", hero: "첫 화면 문구", intro: "소개 문구", specialties: "상담 분야", process: "진행 과정", faqs: "자주 묻는 질문", reviews: "후기", footer: "푸터", contact: "연락처", compliance: "보험 고지", topics: "상담 주제", brief: "제작 방향" };
  if (dirty && hasOwnContent && !window.confirm(`${labels[key] || "선택한 영역"}의 현재 내용을 예시로 바꿀까요?`)) return;
  switch (key) {
    case "profile": site.agent = clone(example.agent); site.seo.ogImage = site.agent.profileImage; break;
    case "hero": site.hero = clone(example.hero); break;
    case "intro": site.intro = clone(example.intro); site.career = clone(example.career); break;
    case "specialties": site.specialties = clone(example.specialties); break;
    case "process": site.process = clone(example.process); site.sections.process = true; break;
    case "faqs": site.faqs = clone(example.faqs); site.sections.faq = true; break;
    case "reviews": site.reviews = clone(example.reviews || []).map(review => ({ ...review, isExample: true })); site.sections.reviews = !!site.reviews.length; break;
    case "footer": site.footer = clone(example.footer || {}); site.agent.registrationNumber = example.agent.registrationNumber || ""; site.agent.businessNumber = example.agent.businessNumber || ""; break;
    case "contact": site.contact = clone(example.contact); break;
    case "compliance": site.compliance = clone(example.compliance); break;
    case "topics": site.consultation = clone(example.consultation || { topics: ["기존 보험 점검", "새로운 보장 상담", "기타 문의"] }); break;
    case "brief": site.contentBrief = clone(example.contentBrief || {}); break;
  }
  const visibleSection = ({ intro: "about", specialties: "services", process: "process", faqs: "faq", reviews: "reviews", contact: "contact" } as Record<string, DesignSectionId>)[key];
  if (visibleSection) site.design = { ...defaultDesign, ...site.design, hiddenSections: (site.design?.hiddenSections || []).filter(id => id !== visibleSection) };
  markChanged();
  renderPanels();
  announce(`${labels[key] || "선택한 영역"} 예시를 가져왔습니다. 필요한 부분을 직접 수정하세요.`);
}
const pathNames: Record<string, string> = { id: "사이트 ID", "agent.name": "설계사 이름", "agent.title": "직함", "agent.company": "소속 GA·대리점", "agent.branch": "지점·지사", "agent.regions": "상담 가능 지역", "agent.profileImage": "프로필 사진", "agent.registrationNumber": "설계사 등록번호", "agent.businessNumber": "사업자등록번호", "hero.eyebrow": "제목 위 문구", "hero.headline": "메인 제목 · PC", "hero.mobileHeadline": "메인 제목 · 모바일", "hero.subheadline": "메인 설명 · PC", "hero.mobileSubheadline": "메인 설명 · 모바일", "hero.primaryCtaLabel": "주요 버튼 문구", "hero.secondaryCtaLabel": "보조 버튼 문구", "hero.trustNote": "버튼 아래 안내", "hero.image": "첫 화면 사진", "intro.title": "소개 제목 · PC", "intro.mobileTitle": "소개 제목 · 모바일", "intro.body": "소개 본문 · PC", "intro.mobileBody": "소개 본문 · 모바일", "intro.philosophy": "상담 원칙", "contact.phone": "전화번호", "contact.email": "이메일", "contact.kakaoUrl": "카카오톡 주소", "contact.instagramUrl": "인스타그램 주소", "contact.officeAddress": "사무실 주소", "contact.mapUrl": "지도 링크", "contact.availableHours": "상담 시간", "footer.heading": "푸터 제목", "footer.note": "푸터 추가 안내", "compliance.footerDisclaimer": "보험 고지 문구", "compliance.privacyOfficer": "개인정보 담당자", "compliance.privacyRetentionPeriod": "개인정보 보유 기간 안내", "compliance.advertisingReviewNumber": "광고 심의번호", "compliance.advertisingReviewExpiresAt": "심의 유효기간", "seo.title": "페이지 제목", "seo.description": "페이지 설명", "consultation.topics": "상담 주제", "contentBrief.purpose": "페이지 목적", "contentBrief.targetAudience": "주요 고객", "contentBrief.primaryAction": "방문자의 행동", career: "경력·자격" };
function readableError(message: string): string {
  return message.replace(/(?:project\.)?site\.([\w.[\]-]+)/g, (_, path: string) => {
    if (pathNames[path]) return pathNames[path];
    const match = /^(specialties|process|faqs|reviews)\[(\d+)\](?:\.(\w+))?$/.exec(path);
    if (match) return `${({ specialties: "상담 분야", process: "진행 단계", faqs: "질문", reviews: "후기" } as Record<string, string>)[match[1]]} ${match[2]}${match[3] ? ` · ${({ title: "제목", body: "설명 PC", mobileBody: "설명 모바일", question: "질문", answer: "답변 PC", mobileAnswer: "답변 모바일", quote: "내용", author: "작성자", context: "상담 주제" } as Record<string, string>)[match[3]] || match[3]}` : ""}`;
    return ({ specialties: "상담 분야", process: "진행 과정", faqs: "자주 묻는 질문", reviews: "고객 후기" } as Record<string, string>)[path] || path;
  });
}
function showErrors(errors: string[]): void {
  activateStep(3);
  const box = document.getElementById("studio-errors")!;
  box.innerHTML = `<p>다음 내용을 확인한 뒤 다시 저장해 주세요.</p><ul>${errors.map(error => `<li>${esc(readableError(error))}</li>`).join("")}</ul>`;
  box.focus();
  announce("입력 내용을 확인해 주세요. 작성한 내용은 그대로 유지됩니다.");
}
function checkedProject(): ReturnType<typeof createProject> | null {
  const errors = validateProjectSite(site);
  if (errors.length) { showErrors(errors); return null; }
  try { return createProject(site); } catch (error) { showErrors(String(error instanceof Error ? error.message : error).split("\n")); return null; }
}
function downloadProject(): void {
  const project = checkedProject();
  if (!project) return;
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${site.agent.name.replace(/[^\p{L}\p{N} _-]/gu, "").trim() || "나의"}-상담페이지-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  dirty = false;
  document.getElementById("save-status")!.textContent = "제작 파일 저장 완료";
  document.getElementById("studio-errors")?.replaceChildren();
  announce("제작 파일을 저장했습니다. 이 JSON 파일을 제작자에게 전달하거나 ‘파일 불러오기’로 다시 편집하세요.");
}
function printPair(label: string, pc: string | undefined, mobile?: string): string {
  return `<tr><th>${esc(label)}</th><td><span class="copy-label">PC · ${Array.from(pc || "").length}자</span><p>${esc(pc || "미작성")}</p>${mobile !== undefined ? `<span class="copy-label">모바일 · ${Array.from(mobile).length}자</span><p>${esc(mobile || "PC 문구와 동일")}</p>` : ""}</td></tr>`;
}
function printRows(rows: [string, unknown][]): string { return rows.map(([name, value]) => `<tr><th>${esc(name)}</th><td>${esc(Array.isArray(value) ? value.join("\n") : value || "미작성")}</td></tr>`).join(""); }
export function renderPrintBrief(config: SiteConfig): string {
  const selected = Object.entries(patterns).map(([key, definition]): [string, string] => [definition.label, definition.options.find(option => option[0] === (config.design?.[key as keyof NonNullable<SiteConfig["design"]>] || defaultDesign[key as keyof typeof defaultDesign]))?.[1] || "기본"]);
  const order = config.design?.sectionOrder || [...DESIGN_SECTION_IDS];
  const hidden = config.design?.hiddenSections || [];
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${esc(config.agent.name)} · 상담 페이지 제작 의뢰서</title><style>@page{size:A4;margin:19mm 17mm}*{box-sizing:border-box}body{font-family:Pretendard,"Malgun Gothic",sans-serif;color:#223e35;font-size:11pt;line-height:1.65;margin:0}header{padding-bottom:22px;border-bottom:2px solid #25483b;margin-bottom:24px}header small{letter-spacing:.2em;font-size:10pt}h1{font-family:Georgia,serif;font-size:29pt;line-height:1.35;font-weight:500;margin:14px 0 8px}h2{font-size:17pt;line-height:1.5;margin:28px 0 12px;break-after:avoid}h3{font-size:12pt;margin:18px 0 8px;break-after:avoid}p{margin:0 0 8px;white-space:pre-wrap;overflow-wrap:anywhere}table{border-collapse:collapse;width:100%;table-layout:fixed;margin-bottom:16px}th,td{text-align:left;vertical-align:top;border-bottom:1px solid #d4dbcf;padding:10px 11px;overflow-wrap:anywhere;white-space:pre-wrap}th{width:28%;background:#f2f3ed;font-weight:500}tr{break-inside:avoid}.profile{display:flex;gap:24px;align-items:flex-start}.profile img{width:95px;height:122px;object-fit:cover}.profile table{flex:1}.copy-label{font-size:10pt;color:#657363;display:block;margin-bottom:4px}.notice{padding:14px;background:#f2f3ed;border-left:2px solid #98804f;margin-top:22px;font-size:10pt}footer{margin-top:28px;padding-top:16px;border-top:1px solid #a5b09e;color:#657363;font-size:10pt}.block{break-inside:avoid}a{color:inherit}@media screen{body{max-width:780px;padding:30px;margin:auto}}</style></head><body><header><small>ATELIER · CONSULTATION PAGE</small><h1>상담 페이지 제작 의뢰서</h1><p>${esc(config.agent.name)} · ${esc(config.agent.company)}</p><p>작성일 ${new Date().toLocaleDateString("ko-KR")} · 검색 비공개 초안</p></header><p>선택한 디자인과 원고를 바탕으로 개인별 페이지를 제작하기 위한 문서입니다. 편집 복원과 사진 원본 전달에는 함께 저장한 JSON 제작 파일을 사용하세요.</p><h2>01. 디자인과 페이지 구성</h2><table>${printRows([["컬러", `${PALETTES[config.palette || "forest"].name} (${PALETTES[config.palette || "forest"].accent})`], ["제목 서체", config.headingFont === "noto-serif-kr" ? "Noto Serif KR · 명조" : "Pretendard · 고딕"], ...selected, ["섹션 순서", order.map(id => `${sectionNames[id]}${hidden.includes(id) ? " (숨김)" : ""}`).join(" → ")]])}</table><h2>02. 프로필과 제작 방향</h2><div class="profile"><img src="${esc(config.agent.profileImage)}" alt="${esc(config.agent.name)} 프로필"><table>${printRows([["이름·직함", `${config.agent.name} ${config.agent.title}`], ["소속·지점", `${config.agent.company} ${config.agent.branch || ""}`], ["상담 지역", config.agent.regions], ["등록번호", config.agent.registrationNumber], ["사업자등록번호", config.agent.businessNumber], ["경력·자격", config.career]])}</table></div><table>${printRows([["페이지 목적", config.contentBrief?.purpose], ["주요 고객", config.contentBrief?.targetAudience], ["방문자의 행동", config.contentBrief?.primaryAction]])}</table><h2>03. 첫 화면</h2><table>${printRows([["제목 위 문구", config.hero.eyebrow]])}${printPair("메인 제목", config.hero.headline, config.hero.mobileHeadline || "")}${printPair("메인 설명", config.hero.subheadline, config.hero.mobileSubheadline || "")}${printRows([["주요 버튼", config.hero.primaryCtaLabel], ["보조 버튼", config.hero.secondaryCtaLabel], ["버튼 아래 안내", config.hero.trustNote]])}</table>${config.hero.image ? `<div class="block"><h3>첫 화면 사진</h3><img src="${esc(config.hero.image)}" alt="선택한 첫 화면 풍경 사진" style="width:100%;max-height:190px;object-fit:cover"></div>` : ""}<h2>04. 소개와 상담 원칙</h2><table>${printPair("소개 제목", config.intro.title, config.intro.mobileTitle || "")}${printPair("소개 본문", config.intro.body, config.intro.mobileBody || "")}${printRows([["상담 원칙", config.intro.philosophy]])}</table><h2>05. 상담 분야</h2>${config.specialties.map((item, index) => `<h3>${index + 1}. ${esc(item.title)}</h3><table>${printPair("설명", item.body, item.mobileBody || "")}</table>`).join("")}<h2>06. 진행 과정</h2>${config.process.map((item, index) => `<h3>${index + 1}. ${esc(item.title)}</h3><table>${printPair("설명", item.body, item.mobileBody || "")}</table>`).join("")}<h2>07. 자주 묻는 질문</h2>${config.faqs.map((item, index) => `<h3>${index + 1}. ${esc(item.question)}</h3><table>${printPair("답변", item.answer, item.mobileAnswer || "")}</table>`).join("")}<h2>08. 후기와 상담 설문</h2>${(config.reviews || []).map((review, index) => `<div class="block"><h3>후기 ${index + 1}${review.isExample ? " · 디자인 예시 / 실제 후기 아님" : " · 실제 후기 원고"}</h3><p>${esc(review.quote)}</p><p>${esc(review.author)} · ${esc(review.context || "")}</p></div>`).join("") || "<p>후기 원고 없음</p>"}<table>${printRows([["상담 주제 선택지", config.consultation?.topics || []]])}</table><h2>09. 푸터와 연락처</h2><table>${printRows([["푸터 제목", config.footer?.heading || `${config.agent.name} ${config.agent.title}`], ["추가 안내", config.footer?.note], ["전화", config.contact.phone], ["이메일", config.contact.email], ["상담 시간", config.contact.availableHours], ["주소", config.contact.officeAddress], ["카카오톡", config.contact.kakaoUrl], ["인스타그램", config.contact.instagramUrl], ["지도", config.contact.mapUrl]])}</table><h2>10. 고지와 페이지 정보</h2><table>${printRows([["보험 고지", config.compliance.footerDisclaimer], ["광고 심의번호", config.compliance.advertisingReviewNumber], ["심의 유효기간", config.compliance.advertisingReviewExpiresAt], ["개인정보 담당자", config.compliance.privacyOfficer], ["보유 기간", config.compliance.privacyRetentionPeriod], ["페이지 제목", config.seo.title], ["페이지 설명", config.seo.description]])}</table><p class="notice">제작 초안입니다. 실제 게시 전 소속·등록 정보, 원고의 사실 여부, 사진 사용 권한, 광고 심의와 개인정보 처리 방침을 확인해야 합니다. 상담 신청 예시는 입력 내용을 저장하거나 전송하지 않습니다.</p><footer>ATELIER · 모든 원고의 글자 수는 공백과 줄바꿈을 포함합니다. 모바일 원고가 비어 있으면 PC 원고를 사용합니다.</footer></body></html>`;
}
function printBrief(): void {
  const project = checkedProject();
  if (!project) return;
  document.getElementById("print-brief")?.remove();
  const frame = document.createElement("iframe");
  frame.id = "print-brief";
  frame.className = "print-frame";
  frame.title = "PDF 저장용 상담 페이지 제작 의뢰서";
  frame.tabIndex = -1;
  frame.setAttribute("aria-hidden", "true");
  frame.setAttribute("sandbox", "allow-same-origin allow-modals");
  frame.onload = () => {
    try { frame.contentWindow?.focus(); frame.contentWindow?.print(); }
    catch { announce("브라우저의 인쇄 기능을 열지 못했습니다. 팝업·인쇄 설정을 확인한 뒤 다시 시도해 주세요."); }
  };
  frame.srcdoc = renderPrintBrief(project.site);
  document.body.append(frame);
  announce("인쇄 창의 대상에서 ‘PDF로 저장’을 선택하세요. 다시 편집하려면 JSON 제작 파일도 함께 저장해 주세요.");
}
async function importProject(file: File): Promise<void> {
  if (file.size > MAX_PROJECT_BYTES) { showErrors(["제작 파일은 8MB 이하여야 합니다. 사진 크기를 줄인 JSON 파일을 선택해 주세요."]); return; }
  try {
    const incoming = parseProject(await file.text());
    if (!confirmReplace("현재 작성 중인 내용을 불러온 제작 파일로 바꿀까요?")) return;
    site = incoming.site;
    site.design = { ...defaultDesign, ...site.design, sectionOrder: [...new Set([...(site.design?.sectionOrder || []), ...DESIGN_SECTION_IDS])] };
    delete site.templateContent;
    hasOwnContent = true;
    dirty = false;
    renderPanels();
    updatePreview();
    document.getElementById("save-status")!.textContent = "제작 파일 불러오기 완료";
    announce("저장한 제작 파일을 불러왔습니다. 패턴, 원고와 사진을 이어서 수정할 수 있습니다.");
  } catch (error) { showErrors(String(error instanceof Error ? error.message : error).split("\n")); }
}
async function uploadImage(input: HTMLInputElement): Promise<void> {
  const file = input.files?.[0];
  if (!file) return;
  const path = input.dataset.upload!;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > MAX_IMAGE_BYTES) {
    input.value = "";
    announce("사진은 3MB 이하의 JPG·PNG·WebP 파일을 선택해 주세요. 현재 사진은 유지됩니다.");
    input.focus();
    return;
  }
  try {
    const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("사진 파일을 읽지 못했습니다.")); reader.readAsDataURL(file); });
    const problem = validateImageSource(dataUrl);
    if (problem) throw new Error(problem);
    const image = new Image();
    image.src = dataUrl;
    await image.decode();
    setPath(path, dataUrl);
    if (path === "agent.profileImage") site.seo.ogImage = dataUrl;
    markChanged();
    renderPanels();
    announce("사진을 적용했습니다. 제작 파일을 저장하면 사진도 함께 포함됩니다.");
  } catch (error) { announce(`${error instanceof Error ? error.message : "사진을 불러올 수 없습니다."} 현재 사진은 유지됩니다.`); input.value = ""; input.focus(); }
}
function updateCounter(input: HTMLInputElement | HTMLTextAreaElement): void {
  if (!input.dataset.max) return;
  const max = Number(input.dataset.max);
  const length = Array.from(input.value).length;
  const counter = [...panels.querySelectorAll<HTMLElement>("[data-count]")].find(node => node.dataset.count === input.dataset.field);
  if (counter) { counter.textContent = `${length} / ${max}`; counter.classList.toggle("over", length > max); }
  input.setAttribute("aria-invalid", String(length > max));
}
function receiveField(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): void {
  const path = input.dataset.field;
  if (!path) return;
  if (input instanceof HTMLInputElement && input.type === "radio" && !input.checked) return;
  const value = input instanceof HTMLInputElement && input.type === "checkbox" ? input.checked : input.dataset.lines ? input.value.split(/\r?\n/).map(line => line.trim()).filter(Boolean) : input.value;
  setPath(path, value);
  if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) updateCounter(input);
  if (path === "career") site.sections.career = site.career.length > 0;
  markChanged(!["palette", "headingFont"].includes(path));
}
document.addEventListener("input", event => {
  const target = event.target;
  if ((target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && target.dataset.field) receiveField(target);
});
document.addEventListener("change", event => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
  if (target.dataset.upload && target instanceof HTMLInputElement) { void uploadImage(target); return; }
  if (target === fileInput) { const file = fileInput.files?.[0]; fileInput.value = ""; if (file) void importProject(file); return; }
  if (target.dataset.design) { site.design = { ...defaultDesign, ...site.design, [target.dataset.design]: target.value }; markChanged(false); }
  if (target.dataset.field && (target instanceof HTMLSelectElement)) receiveField(target);
  if (target instanceof HTMLInputElement && target.dataset.section) {
    const id = target.dataset.section as DesignSectionId;
    const hidden = new Set(site.design?.hiddenSections || []);
    if (target.checked) hidden.delete(id); else hidden.add(id);
    site.design = { ...defaultDesign, ...site.design, hiddenSections: [...hidden] };
    if (id === "process") site.sections.process = target.checked;
    if (id === "faq") site.sections.faq = target.checked;
    if (id === "reviews") site.sections.reviews = target.checked && !!site.reviews?.length;
    markChanged(false);
    if (id === "reviews" && target.checked && !site.reviews?.length) announce("후기 영역을 선택했습니다. 프로필·문구 단계에서 실제 후기 또는 디자인 예시를 추가하면 표시됩니다.");
  }
});
document.addEventListener("click", event => {
  const button = (event.target as Element).closest<HTMLButtonElement>("button");
  if (!button || button.disabled) return;
  if (button.dataset.step !== undefined || button.dataset.goStep !== undefined) { activateStep(Number(button.dataset.step ?? button.dataset.goStep), !!button.dataset.goStep); return; }
  if (button.dataset.view) { setView(button.dataset.view as "editor" | "preview"); return; }
  if (button.dataset.device) {
    const mobile = button.dataset.device === "mobile";
    preview.dataset.viewport = mobile ? "mobile" : "desktop";
    fitPreview();
    document.querySelectorAll<HTMLButtonElement>("[data-device]").forEach(choice => choice.setAttribute("aria-pressed", String(choice === button)));
    return;
  }
  if (button.dataset.example) { useExampleGroup(button.dataset.example); return; }
  if (button.dataset.move) {
    const id = button.dataset.move as DesignSectionId;
    const order = [...(site.design?.sectionOrder || DESIGN_SECTION_IDS)];
    const index = order.indexOf(id);
    const destination = index + Number(button.dataset.direction);
    if (destination < 0 || destination >= order.length) return;
    [order[index], order[destination]] = [order[destination], order[index]];
    site.design = { ...defaultDesign, ...site.design, sectionOrder: order };
    markChanged(false);
    renderPanels();
    panels.querySelector<HTMLButtonElement>(`[data-move="${id}"][data-direction="${button.dataset.direction}"]:not(:disabled)`)?.focus();
    announce(`${sectionNames[id]}을 ${destination + 1}번째로 옮겼습니다.`);
    return;
  }
  const listKey = button.dataset.add || button.dataset.remove;
  if (listKey && ["specialties", "process", "faqs", "reviews"].includes(listKey)) {
    const key = listKey as "specialties" | "process" | "faqs" | "reviews";
    const items = site[key] || [];
    if (button.dataset.add) {
      const max = key === "faqs" ? 8 : key === "process" ? 4 : 6;
      if (items.length >= max) return;
      if (key === "faqs") site.faqs.push({ question: "", answer: "" });
      else if (key === "reviews") { site.reviews = [...(site.reviews || []), { quote: "", author: "", isExample: true }]; site.sections.reviews = true; }
      else site[key].push({ title: "", body: "" });
    } else {
      const min = key === "reviews" ? 0 : key === "faqs" ? 2 : 3;
      if (items.length <= min) return;
      items.splice(Number(button.dataset.index), 1);
      if (key === "reviews" && !items.length) site.sections.reviews = false;
    }
    markChanged();
    renderPanels();
    const control = panels.querySelector<HTMLButtonElement>(`[data-add="${key}"]`);
    control?.closest("details")?.setAttribute("open", "");
    control?.focus();
    return;
  }
  switch (button.dataset.action) {
    case "example": useFullExample(); break;
    case "import": fileInput.click(); break;
    case "export": downloadProject(); break;
    case "print": printBrief(); break;
    case "blank": if (confirmReplace("작성 중인 내용을 지우고 빈 원고로 시작할까요?")) { site = blankSite(); dirty = false; hasOwnContent = false; renderPanels(); updatePreview(); document.getElementById("save-status")!.textContent = "이 브라우저에서만 편집 중"; announce("빈 원고로 시작합니다. 오른쪽은 참고용 예시이며 ‘예시 사용’으로 원하는 내용만 가져올 수 있습니다."); } break;
    case "remove-photo": site.agent.profileImage = "/assets/profile-placeholder.svg"; delete site.seo.ogImage; markChanged(); renderPanels(); announce("프로필 사진을 기본 이미지로 바꿨습니다."); break;
  }
});
document.querySelector("[role=tablist]")?.addEventListener("keydown", event => {
  const key = (event as KeyboardEvent).key;
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key)) return;
  event.preventDefault();
  activateStep(key === "Home" ? 0 : key === "End" ? 3 : (step + (key === "ArrowRight" ? 1 : 3)) % 4, true);
});
window.addEventListener("beforeunload", event => { if (dirty) { event.preventDefault(); event.returnValue = ""; } });
new ResizeObserver(fitPreview).observe(previewMat);
renderPanels();
updatePreview();
