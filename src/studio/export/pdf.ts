import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { PALETTES, TEMPLATE_META, paletteId } from '../../render/design-system.js';
import { isSectionEnabled, type StudioProject } from '../project.js';
import type { PreviewCapture } from './types.js';

const A4: [number, number] = [595.28, 841.89];
const margin = 42;
const bodySize = 10.5;

function color(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  return rgb(((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255);
}

function wrap(font: PDFFont, value: string, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of (value || '미작성').split(/\r?\n/)) {
    let line = '';
    for (const char of Array.from(paragraph || ' ')) {
      const next = line + char;
      if (line && font.widthOfTextAtSize(next, size) > maxWidth) { lines.push(line); line = char; }
      else line = next;
    }
    lines.push(line || ' ');
  }
  return lines;
}

function footer(page: PDFPage, font: PDFFont, draftId: string, pageNumber: number): void {
  page.drawLine({ start: {x: margin, y: 27}, end: {x: A4[0] - margin, y: 27}, thickness: .5, color: rgb(.78,.8,.82) });
  page.drawText(`보험 상담 페이지 · 확인용 인쇄본 · ${draftId}`, { x: margin, y: 14, size: 7.5, font, color: rgb(.35,.39,.43) });
  page.drawText(String(pageNumber), { x: A4[0] - margin - 12, y: 14, size: 8, font, color: rgb(.35,.39,.43) });
}

function textWriter(pdf: PDFDocument, font: PDFFont, draftId: string) {
  let page = pdf.addPage(A4), y = A4[1] - margin;
  const newPage = () => { page = pdf.addPage(A4); y = A4[1] - margin; };
  const ensure = (height: number) => { if (y - height < 42) newPage(); };
  const write = (value: string, options: {size?:number; gap?:number; color?:ReturnType<typeof rgb>} = {}) => {
    const size = options.size || bodySize, lineHeight = size * 1.65;
    const lines = wrap(font, value, size, A4[0] - margin * 2);
    for (const line of lines) { ensure(lineHeight); page.drawText(line, {x:margin,y:y-size,size,font,color:options.color || rgb(.1,.16,.21)}); y -= lineHeight; }
    y -= options.gap ?? 4;
  };
  const heading = (value: string) => { ensure(38); y -= 8; write(value, {size:16,gap:10}); };
  return { write, heading, page: () => page, finalize: () => pdf.getPages().forEach((item, index) => footer(item, font, draftId, index + 1)) };
}

function continuousSegments(capture: PreviewCapture, maxHeight: number): Array<{start:number; end:number}> {
  const segments: Array<{start:number; end:number}> = [];
  let start = 0;
  while (capture.height - start > maxHeight) {
    const ideal = start + maxHeight;
    const earliest = start + maxHeight * .68;
    const safe = capture.breakpoints.filter(point => point >= earliest && point <= ideal).at(-1);
    const end = safe && safe > start ? safe : ideal;
    segments.push({start, end});
    start = end;
  }
  segments.push({start, end:capture.height});
  return segments;
}

export async function createReviewPdf(project: StudioProject, captures: PreviewCapture[]): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const fontResponse = await fetch('/assets/fonts/NanumGothic-Regular.ttf');
  if (!fontResponse.ok) throw new Error('PDF 글꼴을 준비하지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해 주세요.');
  // pdf-lib/fontkit loses composite Hangul glyphs when this font is subset.
  // Embed the complete OFL font so both rendered glyphs and extracted text stay intact.
  const font = await pdf.embedFont(await fontResponse.arrayBuffer(), { subset: false });
  const site = project.site, palette = PALETTES[paletteId(site)], accent = color(palette.accent);

  const cover = pdf.addPage(A4);
  cover.drawRectangle({x:0,y:0,width:A4[0],height:A4[1],color:color(palette.paper)});
  cover.drawRectangle({x:margin,y:A4[1]-220,width:5,height:150,color:accent});
  cover.drawText('보험설계사 소개 페이지', {x:margin+24,y:A4[1]-92,size:13,font,color:accent});
  cover.drawText('확인용 인쇄본', {x:margin+24,y:A4[1]-142,size:31,font,color:color(palette.ink)});
  const summary = [`담당자  ${site.agent.name} · ${site.agent.company}`, `화면 구성  ${TEMPLATE_META[site.template].name}`, `색상  ${palette.name}`, `생성 시각  ${project.savedAt}`, `작업 번호  ${project.handoff.draftId}`];
  summary.forEach((line, index) => cover.drawText(line, {x:margin+24,y:A4[1]-190-index*28,size:11,font,color:color(palette.ink)}));
  cover.drawRectangle({x:margin,y:125,width:A4[0]-margin*2,height:118,color:color(palette.tint),borderColor:color(palette.line),borderWidth:1});
  ['이 문서는 화면과 문구를 눈으로 확인하는 인쇄본입니다.', '내보내기만으로는 누구에게도 전송되거나 공개되지 않습니다.', '받은 압축 파일은 풀지 말고 그대로 제작 담당자에게 전달해 주세요.'].forEach((line,index) => cover.drawText(line,{x:margin+20,y:210-index*27,size:10.5,font,color:color(palette.ink)}));

  for (const capture of captures) {
    const image = await pdf.embedJpg(capture.png);
    const availableWidth = A4[0] - margin * 2;
    const contentTop = A4[1] - 58, contentBottom = 38;
    const availableHeight = contentTop - contentBottom;
    const targetWidth = capture.device === '모바일' ? Math.min(330, availableWidth) : availableWidth;
    const scale = targetWidth / capture.width;
    const width = capture.width * scale, height = capture.height * scale;
    const segments = continuousSegments(capture, availableHeight / scale);
    for (const [index, segment] of segments.entries()) {
      const page = pdf.addPage(A4);
      const consumed = segment.start * scale;
      const segmentHeight = (segment.end - segment.start) * scale;
      page.drawImage(image, { x: (A4[0] - width) / 2, y: contentTop - height + consumed, width, height });
      page.drawRectangle({ x: 0, y: contentTop, width: A4[0], height: A4[1] - contentTop, color: rgb(1, 1, 1) });
      page.drawRectangle({ x: 0, y: 0, width: A4[0], height: Math.max(contentBottom, contentTop - segmentHeight), color: rgb(1, 1, 1) });
      page.drawText(`${capture.device} 웹페이지 · 연속 보기 ${index + 1}/${segments.length}`, {x:margin,y:A4[1]-35,size:12,font,color:accent});
    }
  }

  const writer = textWriter(pdf, font, project.handoff.draftId);
  writer.heading('전체 원고');
  writer.write(`담당자: ${site.agent.name} ${site.agent.title}\n소속: ${site.agent.company}${site.agent.branch ? ` · ${site.agent.branch}` : ''}\n전화: ${site.contact.phone}${site.contact.email ? `\n이메일: ${site.contact.email}` : ''}${site.contact.fax ? `\n팩스: ${site.contact.fax}` : ''}\n상담 시간: ${site.contact.availableHours}\n카카오톡: ${site.contact.kakaoUrl || '미작성'}`);
  writer.heading('첫 화면'); writer.write(`${site.hero.eyebrow || ''}\n${site.hero.headline}\n${site.hero.subheadline}`);
  if (site.hero.mobileHeadline || site.hero.mobileSubheadline) writer.write(`모바일 원고\n${site.hero.mobileHeadline || site.hero.headline}\n${site.hero.mobileSubheadline || site.hero.subheadline}`);
  if (isSectionEnabled(site,'about')) { writer.heading('담당자 소개'); writer.write(`${site.intro.title}\n${site.intro.body}${site.intro.philosophy ? `\n상담 원칙: ${site.intro.philosophy}` : ''}`); }
  if (isSectionEnabled(site,'services')) { writer.heading('상담 분야'); site.specialties.forEach((item,index)=>writer.write(`${index+1}. ${item.title}\n${item.body}${item.mobileBody ? `\n모바일: ${item.mobileBody}` : ''}`)); }
  if (isSectionEnabled(site,'process')) { writer.heading('상담 과정'); site.process.forEach((item,index)=>writer.write(`${index+1}. ${item.title}\n${item.body}${item.mobileBody ? `\n모바일: ${item.mobileBody}` : ''}`)); }
  if (isSectionEnabled(site,'faq')) { writer.heading('자주 묻는 질문'); site.faqs.forEach((item,index)=>writer.write(`${index+1}. ${item.question}\n${item.answer}${item.mobileAnswer ? `\n모바일: ${item.mobileAnswer}` : ''}`)); }
  writer.heading('하단 안내와 필수 고지'); writer.write(`${site.footer?.heading || ''}\n${site.footer?.note || ''}\n\n${site.compliance.footerDisclaimer}`);
  writer.heading('확인하고 전달하기'); writer.write(`사진을 써도 되는지, 내용이 사실인지, 소속 조직의 확인이 끝났는지 살펴봐 주세요.${project.handoff.requestedDomain ? `\n쓰고 싶은 주소: ${project.handoff.requestedDomain} (아직 만들어지지 않은 희망 주소)` : ''}\n내려받은 압축 파일을 그대로 제작 담당자에게 전달해 주세요. 안에 든 작업 파일을 불러오면 이어서 고칠 수 있습니다.`);
  writer.finalize();
  return pdf.save();
}
