import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getServerBySlug, getSimilarServers, formatNumber } from "@/lib/data";
import { getServerCapability } from "@/lib/server-capabilities";
import CapabilityCard from "@/components/CapabilityCard";
import InstallCommandCard from "@/components/InstallCommand";
import { installCommands } from "@/lib/install";
import ServerCard from "@/components/ServerCard";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref, hreflangAlternates } from "@/lib/i18n/href";
import { getSeoLandingSlugs, getSeoLanding, seoLandingText } from "@/lib/seo-landing";

const SUFFIX = "-mcp-server";

interface Props {
  params: { tool: string; locale: Locale };
}

// URL 段是 "{toolSlug}-mcp-server"，如 postgres-mcp-server；预生成所有白名单落地页。
export function generateStaticParams() {
  return getSeoLandingSlugs().map((s) => ({ tool: `${s}${SUFFIX}` }));
}

function toolSlugFromParam(param: string): string | null {
  if (!param.endsWith(SUFFIX)) return null;
  return param.slice(0, -SUFFIX.length);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const toolSlug = toolSlugFromParam(params.tool);
  const landing = toolSlug ? getSeoLanding(toolSlug) : undefined;
  if (!landing) return {};
  const t = seoLandingText(landing, params.locale);
  // 站点名后缀由 layout 的 title.template 统一追加，这里不再手动拼 | SITE_NAME，避免重复。
  const title = `${t.toolName} MCP Server — Setup, Tools & Config`;
  return {
    title,
    description: t.tagline,
    alternates: hreflangAlternates(params.locale, `/servers/${params.tool}`),
    openGraph: { title, description: t.tagline, url: `/${params.locale}/servers/${params.tool}`, type: "article" },
    twitter: { card: "summary_large_image", title, description: t.tagline },
  };
}

export default async function SeoLandingPage({ params }: Props) {
  const { locale } = params;
  const toolSlug = toolSlugFromParam(params.tool);
  const landing = toolSlug ? getSeoLanding(toolSlug) : undefined;
  if (!landing) notFound();

  const t = seoLandingText(landing, locale);
  const d = getDictionary(locale).server;
  const s = await getServerBySlug(landing.serverSlug);
  if (!s) notFound(); // 数据里的目标 server 不在了 → 不渲染空壳页

  const capability = getServerCapability(landing.serverSlug);
  const similar = await getSimilarServers(s);

  const h1 = `${t.toolName} MCP Server`;
  const detailHref = localizedHref(locale, `/server/${s.slug}`);

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: h1,
    description: t.tagline,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Model Context Protocol Server",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    ...(s.repoUrl ? { codeRepository: s.repoUrl, sameAs: [s.repoUrl] } : {}),
  };
  const crumb = breadcrumbSchema([
    { name: SITE_NAME, path: `/${locale}` },
    { name: "MCP Servers", path: `/${locale}/leaderboard` },
    { name: h1, path: `/${locale}/servers/${params.tool}` },
  ]);
  const faq = faqSchema(t.faq.map((f) => ({ q: f.q, a: f.a })));

  const whyLabel = locale === "zh" ? "为什么用它" : "Why use it";
  const dataLabel = locale === "zh" ? "看这个 server 的健康数据 →" : "See this server's health data →";
  const faqLabel = locale === "zh" ? "常见问题" : "Frequently Asked Questions";

  return (
    <div className="container-site max-w-3xl py-10 sm:py-14">
      <JsonLd data={[appSchema, crumb, faq]} />

      <nav className="mb-4 text-sm text-neutral-400">
        <Link href={localizedHref(locale, "/")} className="hover:text-brand-600">{SITE_NAME}</Link>
        <span className="mx-2">/</span>
        <Link href={localizedHref(locale, "/leaderboard")} className="hover:text-brand-600">MCP Servers</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-600 dark:text-neutral-300">{h1}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {h1}
        </h1>
        <div className="mt-4 space-y-3">
          {t.intro.map((p, i) => (
            <p key={i} className="leading-7 text-neutral-600 dark:text-neutral-400">{p}</p>
          ))}
        </div>
        {/* 链到数据详情页：把深度信号留在旧页，两页内容分工不重复 */}
        <Link href={detailHref} className="link-accent mt-4 inline-flex items-center gap-1 text-sm font-medium">
          {dataLabel}
        </Link>
      </header>

      {/* What it does（复用能力卡） */}
      {capability && (
        <CapabilityCard
          cap={capability}
          locale={locale}
          strings={{
            capabilitiesTitle: d.capabilitiesTitle,
            whatCanDo: d.whatCanDo,
            tryTitle: d.tryTitle,
            tryNote: d.tryNote,
          }}
        />
      )}

      {/* Install（复用安装卡） */}
      <InstallCommandCard
        commands={installCommands(s)}
        title={d.installTitle}
        note={d.installNote}
        copyLabel={d.copy}
        copiedLabel={d.copied}
      />

      {/* Why use it */}
      <section className="card mt-6 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{whyLabel}</h2>
        <div className="mt-3 space-y-3">
          {t.whyUse.map((p, i) => (
            <p key={i} className="leading-7 text-neutral-600 dark:text-neutral-400">{p}</p>
          ))}
        </div>
      </section>

      {/* 相似 server（内链） */}
      {similar.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">{d.similarTitle}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {similar.map((x) => (
              <ServerCard key={x.slug} server={x} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ（配 FAQPage schema） */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">{faqLabel}</h2>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {t.faq.map((f) => (
            <div key={f.q} className="py-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{f.q}</h3>
              <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Link href={localizedHref(locale, "/what-is-mcp-server")} className="link-accent">
          {locale === "zh" ? "← 什么是 MCP Server" : "← What is an MCP Server"}
        </Link>
      </div>
    </div>
  );
}
