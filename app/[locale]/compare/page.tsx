import type { Metadata } from "next";
import Link from "next/link";
import { getAllServers } from "@/lib/data";
import CompareTable from "@/components/CompareTable";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";
import type { MCPServer } from "@/lib/types";

interface Props {
  params: { locale: Locale };
  searchParams: { ids?: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const c = getDictionary(params.locale).compare;
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: { canonical: `/${params.locale}/compare` },
    // 对比页是工具性动态页，不进搜索索引（避免无限 query 变体污染 index）
    robots: { index: false, follow: true },
  };
}

export default async function ComparePage({ params, searchParams }: Props) {
  const { locale } = params;
  const c = getDictionary(locale).compare;

  const requested = (searchParams.ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  let selected: MCPServer[] = [];
  if (requested.length > 0) {
    const all = await getAllServers();
    const bySlug = new Map(all.map((s) => [s.slug, s]));
    selected = requested.map((slug) => bySlug.get(slug)).filter((s): s is MCPServer => Boolean(s));
  }

  return (
    <div className="container-site py-10 sm:py-14">
      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
        {c.title}
      </h1>

      {selected.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700">
          <p className="text-neutral-500 dark:text-neutral-400">{c.empty}</p>
          <Link
            href={localizedHref(locale, "/leaderboard")}
            className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            {c.browse}
          </Link>
        </div>
      ) : (
        <div className="mt-8 card p-4 sm:p-5">
          <CompareTable
            locale={locale}
            initial={selected}
            strings={c as unknown as Record<string, string>}
          />
        </div>
      )}
    </div>
  );
}
