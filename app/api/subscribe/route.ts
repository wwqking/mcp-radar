// 邮件订阅落地接口（真实生效）。
//
// 全站是纯静态 SSG，这个 route 是唯一的运行时端点：接收邮箱 → 转发给 Buttondown 建列表。
// 不收款、不建库，只把邮箱交给 newsletter 服务商。
//
// 生效条件：环境变量配了 BUTTONDOWN_API_KEY（Vercel 项目 env 里加即可）。
// 未配置时返回 503 + 明确文案，前端降级提示「订阅暂未开放」，不会假装成功。
//
// Buttondown API: https://docs.buttondown.email/api-subscribers-create

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeBody {
  email?: unknown;
  /** 订阅来源（inline / newsletter-free / newsletter-pro 等），只做打标，非必填。 */
  source?: unknown;
  /** 蜜罐字段：机器人常会填，真人看不到。有值即判定为 bot。 */
  website?: unknown;
}

export async function POST(req: Request) {
  let body: SubscribeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // 蜜罐：正常用户不会填 website，填了的当机器人静默丢弃（返回 ok 避免暴露机制）。
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const apiKey = process.env.BUTTONDOWN_API_KEY;
  if (!apiKey) {
    // 服务商未接线：明确告知，不静默吞掉邮箱。
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const source = typeof body.source === "string" ? body.source.slice(0, 40) : "web";

  try {
    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        // 双重确认（Buttondown 侧发确认邮件），符合 GDPR / 反垃圾。
        type: "unactivated",
        tags: [source],
      }),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    // Buttondown 对「已存在的邮箱」返回 400，且 body 里含 already 提示。
    // 对用户而言重复订阅 = 成功，不该报错。
    const text = await res.text().catch(() => "");
    if (res.status === 400 && /already|exists|subscribed/i.test(text)) {
      return NextResponse.json({ ok: true, already: true });
    }

    // Buttondown 对「邮箱本身有问题」（被防火墙拦截 / 一次性域名 / 格式非法）返回 400。
    // 这类是用户输入问题，不是服务端故障 → 回 422，前端提示「邮箱无效」而非「稍后重试」。
    if (res.status === 400 && /blocked|invalid|disposable|not a valid|firewall/i.test(text)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
    }

    console.error("[subscribe] buttondown error", res.status, text.slice(0, 300));
    return NextResponse.json({ ok: false, error: "provider_error" }, { status: 502 });
  } catch (err) {
    console.error("[subscribe] fetch failed", err);
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }
}
