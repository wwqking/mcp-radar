import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  CATEGORIES,
  getCategoryBySlug,
  getServersByCategory,
  getLastUpdated,
  categoryName,
  categoryTagline,
  categoryDescription,
} from "@/lib/data";
import CategoryList from "@/components/CategoryList";
import SourceMethodNote from "@/components/SourceMethodNote";
import SubscribeInline from "@/components/SubscribeInline";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";

interface Props {
  params: { cat: string; locale: Locale };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategoryBySlug(params.cat);
  if (!cat) return {};
  const d = getDictionary(params.locale).category;
  const servers = await getServersByCategory(cat.slug);
  const name = categoryName(cat, params.locale);
  const title = d.titleTpl.replace("{name}", name).replace("{tagline}", categoryTagline(cat, params.locale));
  const description = d.descTpl
    .replace("{description}", categoryDescription(cat, params.locale))
    .replace("{count}", String(servers.length));
  const url = `/${params.locale}/category/${cat.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const d = dict.category;
  const cat = await getCategoryBySlug(params.cat);
  if (!cat) notFound();

  const servers = await getServersByCategory(cat.slug);
  const lastUpdated = await getLastUpdated();
  const related = CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 5);
  const name = categoryName(cat, locale);
  const staleCount = servers.filter((s) => s.lifecycle === "dying" || s.lifecycle === "dead").length;
  const anchor =
    d.listAnchorA.replace("{n}", String(servers.length)) +
    (staleCount > 0 ? d.listAnchorB.replace("{stale}", String(staleCount)) : "") +
    "。";

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name}${d.h1Suffix}`,
    description: categoryDescription(cat, locale),
    url: absoluteUrl(`/${locale}/category/${cat.slug}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: servers.length,
      itemListElement: servers.slice(0, 20).map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/${locale}/server/${s.slug}`),
        name: s.name,
      })),
    },
  };
  const crumb = breadcrumbSchema([
    { name: d.home, path: `/${locale}` },
    { name, path: `/${locale}/category/${cat.slug}` },
  ]);

  return (
    <div className="container-site py-10 sm:py-14">
      <JsonLd data={[collectionSchema, crumb]} />

      <nav className="mb-4 text-sm text-neutral-400">
        <Link href={localizedHref(locale, "/")} className="hover:text-brand-600">{d.home}</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-600 dark:text-neutral-300">{name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {cat.icon} {name}{d.h1Suffix}
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          {categoryTagline(cat, locale)}。{categoryDescription(cat, locale)}
        </p>
        <SourceMethodNote
          locale={locale}
          className="mt-3"
          sources={[d.srcRegistry, "GitHub API", "npm"]}
          updatedAt={lastUpdated}
        />
      </header>

      <CategoryList
        servers={servers}
        locale={locale}
        anchor={anchor}
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

      {/* 相关分类内链 */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">{d.relatedTitle}</h2>
        <div className="flex flex-wrap gap-2">
          {related.map((c) => (
            <Link
              key={c.slug}
              href={localizedHref(locale, `/category/${c.slug}`)}
              className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-brand-700 dark:hover:text-brand-300"
            >
              {c.icon} {categoryName(c, locale)}
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
