import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryList from "@/components/CategoryList";
import JsonLd from "@/components/JsonLd";
import SourceMethodNote from "@/components/SourceMethodNote";
import SubscribeInline from "@/components/SubscribeInline";
import { getLastUpdated, getServersByTopic } from "@/lib/data";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { hreflangAlternates, localizedHref } from "@/lib/i18n/href";
import type { Locale } from "@/lib/i18n/locales";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import {
  TAXONOMY_TOPICS,
  getTopicBySlug,
  topicDescription,
  topicName,
} from "@/lib/taxonomy";

interface Props {
  params: Promise<{ locale: Locale; topic: string }>;
}

const copy = {
  zh: {
    suffix: "主题 MCP server",
    count: "该主题共 {n} 个 server；同一个 server 可以出现在多个主题中。",
    related: "探索其他主题",
    method: "主题采用受控词表自动标注，低置信度结果进入人工复核队列。",
    source: "受控主题词表",
  },
  en: {
    suffix: "MCP servers",
    count: "{n} servers in this topic. A server can appear in more than one topic.",
    related: "Explore other topics",
    method: "Topics use a controlled vocabulary; low-confidence results enter a human review queue.",
    source: "Controlled topic vocabulary",
  },
} as const;

export function generateStaticParams() {
  return TAXONOMY_TOPICS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, topic: slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};
  const name = topicName(topic, locale);
  const title = locale === "zh" ? `${name}主题 MCP server` : `${name} MCP servers`;
  const description = topicDescription(topic, locale);
  return {
    title,
    description,
    alternates: hreflangAlternates(locale, `/topic/${topic.slug}`),
    openGraph: { title, description, url: `/${locale}/topic/${topic.slug}`, type: "website" },
  };
}

export default async function TopicPage({ params }: Props) {
  const { locale, topic: slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const dict = getDictionary(locale);
  const c = copy[locale];
  const [servers, lastUpdated] = await Promise.all([
    getServersByTopic(topic.slug),
    getLastUpdated(),
  ]);
  const name = topicName(topic, locale);
  const relatedCounts = await Promise.all(
    TAXONOMY_TOPICS.filter((candidate) => candidate.slug !== topic.slug).map(async (candidate) => ({
      topic: candidate,
      count: (await getServersByTopic(candidate.slug)).length,
    })),
  );
  const related = relatedCounts.filter(({ count }) => count > 0).sort((a, b) => b.count - a.count).slice(0, 8);
  const url = `/${locale}/topic/${topic.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name} ${c.suffix}`,
    description: topicDescription(topic, locale),
    url: absoluteUrl(url),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: servers.length,
      itemListElement: servers.slice(0, 20).map((server, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: server.name,
        url: absoluteUrl(`/${locale}/server/${server.slug}`),
      })),
    },
  };

  return (
    <div className="container-site py-10 sm:py-14">
      <JsonLd
        data={[
          schema,
          breadcrumbSchema([
            { name: dict.category.home, path: `/${locale}` },
            { name, path: url },
          ]),
        ]}
      />

      <nav className="mb-4 text-sm text-neutral-400" aria-label={locale === "zh" ? "面包屑" : "Breadcrumb"}>
        <Link href={localizedHref(locale, "/")} className="hover:text-brand-600">
          {dict.category.home}
        </Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-neutral-600 dark:text-neutral-300">{name}</span>
      </nav>

      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
          {locale === "zh" ? "主题" : "Topic"}
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {name} {c.suffix}
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          {topicDescription(topic, locale)}
        </p>
        <p className="mt-3 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">{c.method}</p>
        <SourceMethodNote locale={locale} className="mt-3" sources={[c.source, "MCP Registry"]} updatedAt={lastUpdated} />
      </header>

      <CategoryList
        servers={servers}
        locale={locale}
        anchor={c.count.replace("{n}", String(servers.length))}
        labels={{
          all: dict.filters.all,
          activeOnly: dict.filters.activeOnly,
          sortBy: dict.filters.sortBy,
          sortScore: dict.filters.sortScore,
          sortStars: dict.filters.sortStars,
          sortUpdated: dict.filters.sortUpdated,
          emptyList: dict.filters.emptyList,
        }}
      />

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">{c.related}</h2>
        <div className="flex flex-wrap gap-2">
          {related.map(({ topic: relatedTopic, count }) => (
            <Link
              key={relatedTopic.slug}
              href={localizedHref(locale, `/topic/${relatedTopic.slug}`)}
              className="inline-flex min-h-11 items-center rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-brand-700 dark:hover:text-brand-300"
            >
              {topicName(relatedTopic, locale)} <span className="ml-1 text-neutral-400">{count}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <SubscribeInline locale={locale} />
      </div>
    </div>
  );
}
