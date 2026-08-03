import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import type { Locale } from "@/lib/i18n/locales";
import { hreflangAlternates } from "@/lib/i18n/href";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en ? "Editorial & Sponsorship Policy" : "编辑与赞助政策",
    description: en
      ? "How MCP Radar separates public-data scoring, editorial review and sponsorship."
      : "MCP Radar 如何隔离公开数据评分、编辑复核与商业赞助。",
    alternates: hreflangAlternates(locale, "/editorial-policy"),
  };
}

export default async function EditorialPolicyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} kind="editorial" />;
}
