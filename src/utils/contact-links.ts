/** No SDK, login, message composition, webhook, or server-side contact delivery. */
export function directPhoneHref(input: unknown): string {
  if (typeof input !== 'string' || !/^[+\d][\d ()-]{5,31}$/.test(input.trim())) return '';
  const value = input.trim().replace(/[ ()-]/g, '');
  return /^\+?\d{7,15}$/.test(value) ? `tel:${value}` : '';
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
