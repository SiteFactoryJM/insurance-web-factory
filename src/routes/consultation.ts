import type { Env, SiteConfig } from "../types.js";

interface ConsultationPayload {
  siteId?: unknown;
  name?: unknown;
  phone?: unknown;
  message?: unknown;
  privacyConsent?: unknown;
  companyWebsite?: unknown;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizePhone(value: unknown): string {
  return cleanText(value, 20).replace(/[^\d+]/g, "");
}

export async function handleConsultation(request: Request, env: Env, site: SiteConfig): Promise<Response> {
  if (request.method !== "POST") return json({ message: "허용되지 않은 요청입니다." }, 405);

  let payload: ConsultationPayload;
  try {
    payload = await request.json() as ConsultationPayload;
  } catch {
    return json({ message: "입력 내용을 확인해 주세요." }, 400);
  }

  if (cleanText(payload.companyWebsite, 120)) {
    return json({ ok: true, message: "상담 신청이 접수되었습니다." });
  }

  const name = cleanText(payload.name, 30);
  const phone = normalizePhone(payload.phone);
  const message = cleanText(payload.message, 500);
  const consent = payload.privacyConsent === true || payload.privacyConsent === "true" || payload.privacyConsent === "on";

  if (cleanText(payload.siteId, 80) !== site.id) return json({ message: "사이트 정보가 올바르지 않습니다." }, 400);
  if (name.length < 2) return json({ message: "이름을 두 글자 이상 입력해 주세요." }, 400);
  if (phone.length < 9 || phone.length > 13) return json({ message: "연락처를 확인해 주세요." }, 400);
  if (!consent) return json({ message: "개인정보 수집·이용 동의가 필요합니다." }, 400);

  if (site.demo?.enabled && site.demo.submissionMode !== "store") {
    return json({ ok: true, demo: true, message: "예시 페이지입니다. 입력 내용은 저장되지 않았습니다." });
  }

  const createdAt = new Date().toISOString();
  const requestId = crypto.randomUUID();
  const tasks: Promise<unknown>[] = [];

  if (env.DB) {
    tasks.push(
      env.DB.prepare(`INSERT INTO consultations (id, site_id, name, phone, message, privacy_consent, created_at, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(requestId, site.id, name, phone, message, 1, createdAt, request.headers.get("user-agent")?.slice(0, 255) ?? "")
        .run(),
    );
  }

  if (env.CONSULTATION_WEBHOOK_URL) {
    tasks.push(fetch(env.CONSULTATION_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ requestId, siteId: site.id, agentName: site.agent.name, name, phone, message, createdAt }),
    }));
  }

  if (!tasks.length) {
    console.warn("Consultation storage is not configured", { requestId, siteId: site.id });
    return json({ message: "상담 접수 기능을 준비 중입니다. 전화로 문의해 주세요." }, 503);
  }

  try {
    await Promise.all(tasks);
    return json({ ok: true, requestId, message: "상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다." }, 201);
  } catch (error) {
    console.error("Failed to store consultation", error);
    return json({ message: "상담 신청을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." }, 500);
  }
}
