import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";
import type { Locale } from "@/lib/i18n/locales";
import { hreflangAlternates } from "@/lib/i18n/href";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const en = locale === "en";
  return {
    title: en ? "Terms of Use" : "使用条款",
    description: en
      ? "Terms for using MCP Radar data, scores and commercial content."
      : "使用 MCP Radar 数据、评分与商业内容的条款。",
    alternates: hreflangAlternates(locale, "/terms"),
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <PolicyPage locale={locale} kind="terms" />;
}
