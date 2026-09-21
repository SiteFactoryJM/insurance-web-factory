import { PALETTE_IDS, type PaletteId, type SiteConfig } from '../types.js';
import { renderSitePage } from '../render/page.js';

const bootstrap = document.getElementById('guided-bootstrap');
if (!bootstrap?.textContent) throw new Error('설정 데이터를 찾지 못했습니다.');
const original = JSON.parse(bootstrap.textContent) as SiteConfig;

function clone<T>(value: T): T {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value)) as T;
}

function fixedSite(source: SiteConfig): SiteConfig {
  const next = clone(source);
  next.template = 'warm-care';
  next.headingFont = 'noto-sans-kr';
  next.design = undefined;
  next.hero = { ...next.hero, brandLayout: 'watermark' };
  next.sections = { ...next.sections, recruitment: true };
  next.demo = { ...(next.demo || { enabled: true }), enabled: true, allowTemplateSwitch: false, submissionMode: 'discard' };
  return next;
}

let site = fixedSite(original);
let device: 'desktop' | 'mobile' = 'desktop';
let renderTimer = 0;

const frame = document.getElementById('studio-frame');
const preview = document.getElementById('studio-preview');
const mat = document.querySelector('.s-mat');
const canvas = document.querySelector('.s-canvas');
const status = document.getElementById('studio-status');

if (!(frame instanceof HTMLIFrameElement) || !(preview instanceof HTMLElement) || !(mat instanceof HTMLElement) || !(canvas instanceof HTMLElement)) {
  throw new Error('미리보기 요소를 찾지 못했습니다.');
}

function setNested(target: Record<string, any>, path: string, value: string): void {
  const keys = path.split('.');
  let ref = target;
  keys.slice(0, -1).forEach((key) => {
    if (!ref[key] || typeof ref[key] !== 'object') ref[key] = {};
    ref = ref[key];
  });
  ref[keys[keys.length - 1]] = value;
}

function getNested(target: Record<string, any>, path: string): string {
  const value = path.split('.').reduce<any>((acc, key) => acc?.[key], target);
  return typeof value === 'string' ? value : '';
}

function syncForm(): void {
  document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-field]').forEach((input) => {
    const path = input.dataset.field!;
    const value = path === 'palette' ? (site.palette || '') : getNested(site as unknown as Record<string, any>, path);
    input.value = value;
  });
  document.querySelectorAll<HTMLInputElement>('input[type=file]').forEach((input) => { input.value = ''; });
}

function previewRequest(): Request {
  return new Request(`${location.origin}/?site=${encodeURIComponent(site.id)}`);
}

function renderPreview(): void {
  window.clearTimeout(renderTimer);
  renderTimer = window.setTimeout(() => {
    frame.srcdoc = renderSitePage(site, previewRequest(), { studioPreview: true });
    resizePreview();
  }, 60);
}

function resizePreview(): void {
  const targetWidth = device === 'mobile' ? 390 : 1440;
  const targetHeight = device === 'mobile' ? 844 : 1100;
  const availableWidth = Math.max(1, mat.clientWidth);
  const availableHeight = Math.max(1, mat.clientHeight);
  const scale = Math.min(availableWidth / targetWidth, availableHeight / targetHeight);
  const shownWidth = Math.floor(targetWidth * scale);
  const shownHeight = Math.floor(targetHeight * scale);
  canvas.style.width = `${shownWidth}px`;
  canvas.style.height = `${shownHeight}px`;
  frame.style.width = `${targetWidth}px`;
  frame.style.height = `${targetHeight}px`;
  frame.style.transform = `scale(${scale})`;
}

function scheduleStatus(message: string): void {
  if (!status) return;
  status.textContent = message;
}

document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-field]').forEach((input) => {
  input.addEventListener('input', () => {
    const path = input.dataset.field!;
    if (path === 'palette') {
      const value = input.value as PaletteId;
      if (PALETTE_IDS.includes(value)) site.palette = value;
    } else {
      setNested(site as unknown as Record<string, any>, path, input.value);
    }
    renderPreview();
  });
});

async function fileToDataUrl(file: File): Promise<string> {
  if (file.size > 6 * 1024 * 1024) throw new Error('이미지는 6MB 이하 파일을 사용해 주세요.');
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsDataURL(file);
  });
}

document.querySelectorAll<HTMLInputElement>('[data-image]').forEach((input) => {
  input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      const kind = input.dataset.image;
      if (kind === 'profile') site.agent.profileImage = dataUrl;
      if (kind === 'headerLogo') site.agent.logoImage = dataUrl;
      if (kind === 'footerLogo') site.agent.logoMarkImage = dataUrl;
      scheduleStatus(`${file.name} 적용됨`);
      renderPreview();
    } catch (error) {
      scheduleStatus(error instanceof Error ? error.message : '파일을 적용하지 못했습니다.');
    }
  });
});

document.querySelectorAll<HTMLButtonElement>('[data-device]').forEach((button) => {
  button.addEventListener('click', () => {
    device = button.dataset.device === 'mobile' ? 'mobile' : 'desktop';
    document.querySelectorAll<HTMLButtonElement>('[data-device]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    resizePreview();
  });
});

document.querySelector<HTMLButtonElement>('[data-action=expand]')?.addEventListener('click', () => {
  preview.dataset.expanded = 'true';
  document.body.style.overflow = 'hidden';
  resizePreview();
});

document.querySelector<HTMLButtonElement>('[data-action=close]')?.addEventListener('click', () => {
  preview.dataset.expanded = 'false';
  document.body.style.overflow = '';
  resizePreview();
});

document.querySelector<HTMLButtonElement>('[data-action=reset]')?.addEventListener('click', () => {
  site = fixedSite(original);
  syncForm();
  scheduleStatus('원래 값으로 되돌렸습니다.');
  renderPreview();
});

document.querySelector<HTMLButtonElement>('[data-action=download]')?.addEventListener('click', () => {
  const output = clone(site);
  output.template = 'warm-care';
  output.headingFont = 'noto-sans-kr';
  output.design = undefined;
  output.hero = { ...output.hero, brandLayout: 'watermark' };
  output.sections = { ...output.sections, recruitment: true };
  const blob = new Blob([JSON.stringify(output, null, 2) + '\n'], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${output.id || 'site'}-site.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  scheduleStatus('현재 설정을 site.json으로 저장했습니다.');
});

window.addEventListener('resize', resizePreview);
frame.addEventListener('load', resizePreview);

syncForm();
renderPreview();
