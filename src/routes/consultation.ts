import type { Env, SiteConfig } from '../types.js';

/** Retired endpoint. Reject BEFORE reading a body; stale clients must not submit PII. */
export async function handleConsultation(_request: Request, _env: Env, _site: SiteConfig): Promise<Response> {
  return new Response(JSON.stringify({
    ok: false,
    code: 'DIRECT_CONTACT_ONLY',
    message: '온라인 상담 접수는 제공하지 않습니다. 페이지의 전화 또는 카카오톡 오픈채팅 버튼을 이용해 주세요.',
  }), {
    status: 410,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
