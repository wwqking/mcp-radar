import Link from "next/link";
import type { BestOfList } from "@/lib/best-of";
import type { Locale } from "@/lib/i18n/locales";
import { localizedHref } from "@/lib/i18n/href";

interface Props {
  list: BestOfList;
  locale: Locale;
  client?: string;
  strings: {
    rank: string;
    server: string;
    trustScore: string;
    stars: string;
    clients: string;
    methodNote: string;
  };
}

/** best-of 指南里的数据榜单。由 data/servers.json 实时生成，不是手写排名。
 *  排序口径写在表下方——「凭什么是这个顺序」必须页面上能回答，
 *  否则和竞品那些手写榜单没有区别。 */
export default function RankingTable({ list, locale, client, strings }: Props) {
  if (!list.entries.length) return null;

  return (
    <div className="my-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wider text-neutral-400 dark:border-neutral-800">
              <th className="py-2 pr-3 font-medium">{strings.rank}</th>
              <th className="py-2 pr-3 font-medium">{strings.server}</th>
              <th className="py-2 pr-3 text-right font-medium">{strings.trustScore}</th>
              <th className="py-2 pr-3 text-right font-medium">{strings.stars}</th>
              <th className="py-2 font-medium">{strings.clients}</th>
            </tr>
          </thead>
          <tbody>
            {list.entries.map(({ rank, server }) => {
              const targetCompat = client
                ? server.clientCompat?.find((compat) => compat.client === client)
                : undefined;
              return (
              <tr
                key={server.slug}
                className="border-b border-neutral-100 last:border-0 dark:border-neutral-900"
              >
                <td className="py-2.5 pr-3 tabular-nums text-neutral-400">{rank}</td>
                <td className="py-2.5 pr-3">
                  <Link
                    href={localizedHref(locale, `/server/${server.slug}`)}
                    className="font-medium text-brand-600 hover:underline dark:text-brand-400"
                  >
                    {server.name}
                  </Link>
                  <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                    {server.tagline}
                  </span>
                </td>
                <td className="py-2.5 pr-3 text-right tabular-nums font-medium">
                  {server.trustScore}
                </td>
                <td className="py-2.5 pr-3 text-right tabular-nums text-neutral-500 dark:text-neutral-400">
                  {(server.signals?.stars ?? 0).toLocaleString()}
                </td>
                <td className="py-2.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {client
                    ? targetCompat ? `${client} · ${targetCompat.basis}` : "—"
                    : server.clientCompat?.length
                      ? `${server.clientCompat.length}${server.installVerified ? " ✓" : ""}`
                    : "—"}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
        {strings.methodNote
          .replace("{pool}", String(list.poolSize))
          .replace("{floor}", String(list.starsFloor))
          .replace("{n}", String(list.entries.length))}
      </p>
    </div>
  );
}
