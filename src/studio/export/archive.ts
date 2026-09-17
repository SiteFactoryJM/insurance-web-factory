import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import type { SiteConfig } from '../../types.js';
import { createProject, parseProject, type CreateProjectOptions } from '../project.js';
import { captureSiteDesign } from './capture.js';
import { createReviewPdf } from './pdf.js';
import type { DraftArchiveResult, ExportPhase } from './types.js';

export const MAX_PDF_BYTES = 20 * 1024 * 1024;
export const MAX_ARCHIVE_BYTES = 30 * 1024 * 1024;

function fileStem(project: ReturnType<typeof createProject>): string {
  const time = project.savedAt.replace(/[-:]/g, '').replace('T','-').replace(/\.\d{3}Z$/, 'Z');
  const shortId = project.handoff.draftId.split('-').at(-1) || 'draft';
  const siteId = project.site.id.replace(/[^a-z0-9-]/gi,'-').replace(/-+/g,'-').slice(0,63) || 'site';
  return `insurance-draft_${siteId}_${time}_${shortId}`;
}

export async function createDraftArchive(site: SiteConfig, options: CreateProjectOptions & {onPhase?:(phase:ExportPhase)=>void} = {}): Promise<DraftArchiveResult> {
  options.onPhase?.('validating');
  const project = createProject(site, options);
  const jsonText = JSON.stringify(project, null, 2);
  parseProject(jsonText);
  const jsonBytes = new TextEncoder().encode(jsonText);
  options.onPhase?.('preparing-assets');
  const captures = await captureSiteDesign(project.site);
  options.onPhase?.('rendering-pdf');
  const pdfBytes = await createReviewPdf(project, captures);
  if (pdfBytes.byteLength > MAX_PDF_BYTES) throw new Error('인쇄본이 20MB를 넘었습니다. 사진 용량을 줄인 뒤 다시 내보내 주세요.');
  await PDFDocument.load(pdfBytes);
  const stem = fileStem(project), pdfName = `${stem}.pdf`, jsonName = `${stem}.json`;
  options.onPhase?.('packaging');
  const zip = new JSZip();
  zip.file(pdfName, pdfBytes); zip.file(jsonName, jsonBytes);
  const zipBytes = await zip.generateAsync({type:'uint8array',compression:'DEFLATE',compressionOptions:{level:6}});
  if (zipBytes.byteLength > MAX_ARCHIVE_BYTES) throw new Error('파일이 30MB를 넘었습니다. 사진 용량을 줄인 뒤 다시 내보내 주세요.');
  options.onPhase?.('ready');
  const zipBuffer = zipBytes.buffer.slice(zipBytes.byteOffset, zipBytes.byteOffset + zipBytes.byteLength) as ArrayBuffer;
  return { project, fileName:`${stem}.zip`, pdfName, jsonName, zipBytes, pdfBytes, jsonBytes, blob:new Blob([zipBuffer],{type:'application/zip'}) };
}

export function requestArchiveDownload(result: DraftArchiveResult): string {
  const url = URL.createObjectURL(result.blob);
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = result.fileName;
  document.body.append(anchor); anchor.click(); anchor.remove();
  return url;
}
