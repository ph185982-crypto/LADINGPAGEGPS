import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PIXEL_ID = process.env.META_CAPI_PIXEL_ID ?? "998928515981741";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function POST(req: NextRequest) {
  if (!ACCESS_TOKEN) {
    return NextResponse.json({ ok: false, error: "CAPI token not configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.event_name) {
    return NextResponse.json({ error: "event_name required" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";

  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer") || "";

  const userData: Record<string, string> = {
    client_ip_address: ip,
    client_user_agent: userAgent,
  };

  if (body.fbc) userData.fbc = body.fbc;
  if (body.fbp) userData.fbp = body.fbp;
  if (body.em)  userData.em  = hash(body.em);
  if (body.ph)  userData.ph  = hash(body.ph);

  const event: Record<string, unknown> = {
    event_name: body.event_name,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: body.event_source_url || referer,
    user_data: userData,
  };

  if (body.custom_data) event.custom_data = body.custom_data;

  const payload = {
    data: [event],
    ...(process.env.NODE_ENV !== "production" && body.test_event_code
      ? { test_event_code: body.test_event_code }
      : {}),
  };

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const result = await res.json();
  return NextResponse.json(result, { status: res.status });
}
