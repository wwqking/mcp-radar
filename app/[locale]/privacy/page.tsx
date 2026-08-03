import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import type { Locale } from "@/lib/i18n/locales";
import { hreflangAlternates } from "@/lib/i18n/href";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en ? "Privacy Policy" : "隐私政策",
    description: en
      ? "How MCP Radar handles newsletter, analytics and preference data."
      : "MCP Radar 如何处理周刊、统计和偏好数据。",
    alternates: hreflangAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} kind="privacy" />;
}
