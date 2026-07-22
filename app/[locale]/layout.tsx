import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CompareTray from "@/components/CompareTray";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME } from "@/lib/site";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { LOCALES, LOCALE_HTML_LANG, isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";

// 预生成两种语言的静态段
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = (isLocale(params.locale) ? params.locale : "zh") as Locale;
  const dict = getDictionary(locale);
  return {
    title: {
      default: dict.meta.titleDefault,
      template: `%s | ${SITE_NAME}`,
    },
    description: dict.meta.description,
    alternates: {
      // 每种语言 canonical 指向自己；hreflang 互指，告诉搜索引擎这是同一内容的多语言版本
      canonical: `/${locale}`,
      languages: {
        zh: "/zh",
        en: "/en",
        "x-default": "/zh",
      },
      types: {
        "application/rss+xml": "/feed.xml",
        "application/feed+json": "/feed.json",
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: dict.meta.tagline,
      url: `/${locale}`,
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: dict.meta.tagline,
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const c = getDictionary(locale).compare;
  return (
    <>
      {/* 根布局的 <html lang> 是静态 zh-CN 兜底；这里按当前 locale 校正，保持 SSG 不变 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang=${JSON.stringify(LOCALE_HTML_LANG[locale])}`,
        }}
      />
      <JsonLd data={[organizationSchema(), webSiteSchema()]} />
      <SiteHeader locale={locale} />
      <main className="flex-1">{children}</main>
      <CompareTray locale={locale} strings={{ trayLabel: c.trayLabel, compareCta: c.compareCta, clear: c.clear }} />
      <SiteFooter locale={locale} />
    </>
  );
}
