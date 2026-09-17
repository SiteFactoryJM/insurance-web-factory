import html2canvasModule, { type Options } from 'html2canvas';
import type { SiteConfig } from '../../types.js';
import { renderSitePage } from '../../render/page.js';
import type { PreviewCapture } from './types.js';

type Html2Canvas = (element: HTMLElement, options?: Partial<Options>) => Promise<HTMLCanvasElement>;
const html2canvas = ((html2canvasModule as unknown as {default?:Html2Canvas}).default || html2canvasModule) as unknown as Html2Canvas;

const waitFor = <T>(promise: Promise<T>, message: string, timeout = 15000): Promise<T> => Promise.race([
  promise,
  new Promise<T>((_, reject) => window.setTimeout(() => reject(new Error(message)), timeout)),
]);

async function ready(document: Document): Promise<void> {
  await waitFor(document.fonts.ready, 'PDF 글꼴을 준비하지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해 주세요.');
  const images = [...document.images];
  await waitFor(Promise.all(images.map(async image => {
    if (image.complete && image.naturalWidth) return;
    await image.decode();
  })).then(() => undefined), '사진을 불러오지 못했습니다. 사진을 다시 업로드한 뒤 저장해 주세요.');
}

async function captureDevice(site: SiteConfig, device: PreviewCapture['device'], width: number): Promise<PreviewCapture> {
  const frame = document.createElement('iframe');
  frame.title = `${device} PDF 출력 준비`;
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = `position:fixed;left:-20000px;top:0;width:${width}px;height:1200px;border:0;visibility:visible;pointer-events:none`;
  document.body.append(frame);
  try {
    await waitFor(new Promise<void>((resolve, reject) => {
      frame.onload = () => resolve();
      frame.onerror = () => reject(new Error('출력용 페이지를 준비하지 못했습니다.'));
      frame.srcdoc = renderSitePage(site, new Request(`${location.origin}/`), { studioPreview: true });
    }), '출력용 페이지 준비 시간이 초과되었습니다.');
    const page = frame.contentDocument;
    if (!page) throw new Error('출력용 페이지를 준비하지 못했습니다.');
    page.documentElement.style.scrollBehavior = 'auto';
    page.querySelectorAll<HTMLDetailsElement>('#faq details').forEach(details => { details.open = true; });
    await ready(page);
    const target = page.body;
    const height = Math.max(page.documentElement.scrollHeight, target.scrollHeight);
    if (height <= 1) throw new Error(`${device} 디자인을 캡처하지 못했습니다.`);
    const canvas = await html2canvas(target, {
      backgroundColor: '#ffffff', logging: false, scale: width <= 390 ? 1.5 : 1,
      useCORS: true, width, height, windowWidth: width, windowHeight: height, scrollX: 0, scrollY: 0,
    });
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('디자인 캡처 이미지를 만들지 못했습니다.');
    const scaleY = canvas.height / height;
    const breakpoints = [...page.querySelectorAll<HTMLElement>('header,#main>*,#main article,#main li,#main details,#main p,#main h1,#main h2,#main h3,footer')]
      .flatMap(element => {
        const rect = element.getBoundingClientRect();
        return rect.height > 1 ? [rect.top * scaleY, rect.bottom * scaleY] : [];
      })
      .map(value => Math.round(value))
      .filter(value => value > 0 && value < canvas.height)
      .sort((a, b) => a - b)
      .filter((value, index, values) => index === 0 || value - values[index - 1] > 3);
    const capture = { device, section: '전체 페이지', width: canvas.width, height: canvas.height, breakpoints, png: new Uint8Array(await blob.arrayBuffer()) } satisfies PreviewCapture;
    canvas.width = 1; canvas.height = 1;
    return capture;
  } finally {
    frame.remove();
  }
}

export async function captureSiteDesign(site: SiteConfig): Promise<PreviewCapture[]> {
  const desktop = await captureDevice(site, 'PC', 1440);
  const mobile = await captureDevice(site, '모바일', 390);
  return [desktop, mobile];
}
