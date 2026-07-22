"use client";

import { useState, type FormEvent } from "react";

export interface SubscribeFormStrings {
  cta: string;
  submitting: string;
  success: string;
  already: string;
  invalidEmail: string;
  notConfigured: string;
  error: string;
}

interface Props {
  strings: SubscribeFormStrings;
  /** 订阅来源打标（inline / newsletter-free / newsletter-pro …） */
  source?: string;
  /** 布局：inline = 输入框+按钮同一行；stacked = 上下堆叠（窄卡片用） */
  layout?: "inline" | "stacked";
  /** 按钮样式：primary = 实心；outline = 描边 */
  buttonVariant?: "primary" | "outline";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "loading" | "success" | "error";

/** 真实提交的订阅表单：POST /api/subscribe。含加载/成功/错误态与蜜罐反爬。 */
export default function SubscribeForm({
  strings,
  source = "web",
  layout = "inline",
  buttonVariant = "primary",
}: Props) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // 蜜罐
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      setMessage(strings.invalidEmail);
      return;
    }

    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source, website }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        already?: boolean;
        error?: string;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        setMessage(data.already ? strings.already : strings.success);
        setEmail("");
        return;
      }

      setStatus("error");
      if (res.status === 503 || data.error === "not_configured") {
        setMessage(strings.notConfigured);
      } else if (res.status === 422 || data.error === "invalid_email") {
        setMessage(strings.invalidEmail);
      } else {
        setMessage(strings.error);
      }
    } catch {
      setStatus("error");
      setMessage(strings.error);
    }
  }

  const btnClass =
    buttonVariant === "outline"
      ? "rounded-lg border border-brand-600 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-60 dark:border-brand-500 dark:text-brand-300 dark:hover:bg-brand-950"
      : "rounded-lg bg-brand-600 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60";

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
      >
        {message}
      </p>
    );
  }

  const loading = status === "loading";

  return (
    <form onSubmit={onSubmit} noValidate className={layout === "stacked" ? "" : "flex flex-col gap-2 sm:flex-row"}>
      {/* 蜜罐：视觉隐藏，屏幕外，aria-hidden，机器人才会填 */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        placeholder="you@example.com"
        aria-label="Email"
        disabled={loading}
        className={`${
          layout === "stacked" ? "w-full" : "flex-1"
        } rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-brand-900`}
      />
      <button
        type="submit"
        disabled={loading}
        className={`${btnClass} ${layout === "stacked" ? "mt-2 w-full py-2.5" : "px-5 py-2.5"}`}
      >
        {loading ? strings.submitting : strings.cta}
      </button>
      {status === "error" && message && (
        <p role="alert" className={`text-xs text-red-600 dark:text-red-400 ${layout === "stacked" ? "mt-2" : "basis-full"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
