/** No SDK, login, message composition, webhook, or server-side contact delivery. */
export function directPhoneHref(input: unknown): string {
  if (typeof input !== 'string' || !/^[+\d][\d ()-]{5,31}$/.test(input.trim())) return '';
  const value = input.trim().replace(/[ ()-]/g, '');
  return /^\+?\d{7,15}$/.test(value) ? `tel:${value}` : '';
}

/** Build a plain mailto link without headers, query parameters, or control characters. */
export function directEmailHref(input: unknown): string {
  if (typeof input !== 'string') return '';
  const value = input.trim();
  if (!value || value.length > 254 || /[\r\n?#]/.test(value)) return '';
  const match = /^([A-Za-z0-9.!#$%&'*+/=^_`{|}~-]+)@([A-Za-z0-9.-]+)$/.exec(value);
  if (!match || match[1].length > 64 || match[1].startsWith('.') || match[1].endsWith('.') || match[1].includes('..')) return '';
  const labels = match[2].split('.');
  if (labels.length < 2 || labels.some(label => !label || label.length > 63 || !/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label))) return '';
  return `mailto:${encodeURIComponent(match[1])}@${match[2]}`;
}

/** Accept only a Kakao Open Chat invite, never a redirect or arbitrary website. */
export function openChatUrl(input: unknown): string {
  if (typeof input !== 'string') return '';
  const value = input.trim();
  if (!/^https:\/\/open\.kakao\.com\/o\/[A-Za-z0-9_-]+\/?$/.test(value)) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'open.kakao.com' &&
      !url.port && !url.username && !url.password && !url.search && !url.hash ? url.href : '';
  } catch { return ''; }
}
