import { escapeHtml } from "../utils/html.js";

/** Both versions remain complete; CSS exposes only the version for this viewport. */
export function responsiveCopy(desktop: string, mobile?: string): string {
  const html = (text: string) => escapeHtml(text).replace(/\n/g, '<br>');
  return mobile?.trim()
    ? `<span class="copy-desktop">${html(desktop)}</span><span class="copy-mobile">${html(mobile)}</span>`
    : html(desktop);
}
