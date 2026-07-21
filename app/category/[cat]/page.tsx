import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  CATEGORIES,
  getCategoryBySlug,
  getServersByCategory,
  getLastUpdated,
} from "@/lib/data";
import CategoryList from "@/components/CategoryList";
import SourceMethodNote from "@/components/SourceMethodNote";
import SubscribeInline from "@/components/SubscribeInline";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";

interface Props {
  params: { cat: string };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getCategoryBySlug(params.cat);
  if (!cat) return {};
  const servers = await getServersByCategory(cat.slug);
  const title = `${cat.name}类 MCP server —— ${cat.tagline}`;
  const description = `${cat.description} 共收录 ${servers.length} 个，每个都标注维护状态与健康数据。`;
  const url = `/category/${cat.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({ params }: Props) {
  const cat = await getCategoryBySlug(params.cat);
  if (!cat) notFound();

  const servers = await getServersByCategory(cat.slug);
  const lastUpdated = await getLastUpdated();
  const related = CATEGORIES.filter((c) => c.slug !== cat.slug).slice(0, 5);

  // schema.org 结构化数据：CollectionPage 内嵌 ItemList（利于 AI 引用）+ 面包屑
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name}类 MCP server`,
    description: cat.description,
    url: absoluteUrl(`/category/${cat.slug}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: servers.length,
      itemListElement: servers.slice(0, 20).map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/server/${s.slug}`),
        name: s.name,
      })),
    },
  };
  const crumb = breadcrumbSchema([
    { name: "首页", path: "/" },
    { name: cat.name, path: `/category/${cat.slug}` },
  ]);

  return (
    <div className="container-site py-10 sm:py-14">
      <JsonLd data={[collectionSchema, crumb]} />

      <nav className="mb-4 text-sm text-neutral-400">
        <Link href="/" className="hover:text-brand-600">首页</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-600 dark:text-neutral-300">{cat.name}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          {cat.icon} {cat.name}类 MCP server
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          {cat.tagline}。{cat.description}
        </p>
        <SourceMethodNote
          className="mt-3"
          sources={["官方 registry", "GitHub API", "npm"]}
          updatedAt={lastUpdated}
        />
      </header>

      <CategoryList servers={servers} />

      {/* 相关分类内链 */}
      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-100">相关分类</h2>
        <div className="flex flex-wrap gap-2">
          {related.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600 hover:border-brand-400 hover:text-brand-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-brand-700 dark:hover:text-brand-300"
            >
              {c.icon} {c.name}
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <SubscribeInline />
      </div>
    </div>
  );
}
