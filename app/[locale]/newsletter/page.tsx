import type { Metadata } from "next";
import SubscribeInline, { subscribeStrings } from "@/components/SubscribeInline";
import SubscribeForm from "@/components/SubscribeForm";
import WaitlistCta from "@/components/WaitlistCta";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatNumber, getLastUpdated, getRadarEntries, getSiteStats } from "@/lib/data";
import { evidenceText } from "@/lib/i18n/verdict";
import { hreflangAlternates } from "@/lib/i18n/href";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.newsletter.metaTitle,
    description: dict.newsletter.metaDesc,
    alternates: hreflangAlternates(locale, "/newsletter"),
  };
}

export default async function NewsletterPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const n = dict.newsletter;
  const [radar, stats, lastUpdated] = await Promise.all([
    getRadarEntries(),
    getSiteStats(),
    getLastUpdated(),
  ]);
  const trend = radar.trending[0];
  const added = radar.added[0];
  const risk = radar.dead[0];
  const en = locale === "en";

  return (
    <div className="container-site max-w-3xl py-10 sm:py-16">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
          {n.heroTitleA}
          <br />
          {n.heroTitleB}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">
          {n.heroSub}
        </p>
      </div>

      {/* 用当前数据生成预览，避免用虚构期号和硬编码统计。 */}
      <div className="card mt-10 p-6 sm:p-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">{n.sampleLabel}</p>
        <div className="space-y-4 rounded-lg border border-neutral-100 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-800/30">
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            {en ? "Latest data snapshot" : "最新数据快照"} · {lastUpdated}
          </p>
          <div className="space-y-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
            {trend && <p>🔥 <strong>{trend.server.name}</strong> — {evidenceText(trend, locale)}</p>}
            {added && <p>🆕 <strong>{added.server.name}</strong> — {evidenceText(added, locale)}</p>}
            {risk && <p>⚰️ <strong>{risk.server.name}</strong> — {evidenceText(risk, locale)}</p>}
            <p>
              📊 {en
                ? `${formatNumber(stats.total)} tracked · ${formatNumber(stats.dying + stats.dead)} currently flagged at risk`
                : `追踪 ${formatNumber(stats.total)} 个 · 当前 ${formatNumber(stats.dying + stats.dead)} 个被标记为风险项`}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <SubscribeInline locale={locale} />
      </div>

      {/* 免费 / 会员 两档 */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card flex flex-col p-6">
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{n.freeTier}</p>
          <p className="mt-1 text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">{n.freePrice}</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>{n.freeItem1}</li>
            <li>{n.freeItem2}</li>
            <li>{n.freeItem3}</li>
          </ul>
          <div className="mt-5">
            <SubscribeForm
              strings={{ ...subscribeStrings(locale), cta: n.freeCta }}
              source="newsletter-free"
              layout="stacked"
              buttonVariant="outline"
            />
          </div>
        </div>

        <div className="card relative flex flex-col border-2 border-brand-600 p-6 dark:border-brand-500">
          <span className="absolute -top-3 left-4 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white">
            {n.proBadge}
          </span>
          <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">{n.proTier}</p>
          <p className="mt-1 text-3xl font-extrabold text-neutral-900 dark:text-neutral-50">
            {n.proPrice}<span className="text-base font-normal text-neutral-400">{n.proPricePer}</span>
          </p>
          <p className="mt-1 text-xs text-neutral-400">{n.proYearly}</p>
          <ul className="mt-4 flex-1 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">{n.proAlert}</strong>
              <br />
              <span className="text-neutral-500">{n.proAlertDesc}</span>
            </li>
            <li>
              <strong className="text-neutral-800 dark:text-neutral-200">{n.proBoard}</strong>
              <br />
              <span className="text-neutral-500">{n.proBoardDesc}</span>
            </li>
            <li>{n.proGuides}</li>
            <li>{n.proExport}</li>
          </ul>
          <WaitlistCta
            label={n.proCtaWaitlist}
            strings={{ ...subscribeStrings(locale), cta: n.proCtaWaitlist }}
            source="newsletter-pro"
            note={n.waitlistNote}
          />
        </div>
      </div>

      {/* 团队档 */}
      <div className="mt-4 card border border-neutral-200 p-6 dark:border-neutral-700">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{n.teamTier}</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{n.teamDesc}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
              {n.teamPrice}<span className="text-sm font-normal text-neutral-400">{n.teamPricePer}</span>
            </p>
          </div>
        </div>
        <WaitlistCta
          label={n.teamCtaWaitlist}
          strings={{ ...subscribeStrings(locale), cta: n.teamCtaWaitlist }}
          source="newsletter-team"
          note={n.waitlistNote}
          buttonVariant="outline"
        />
      </div>

      {/* FAQ */}
      <div className="mt-10 space-y-4">
        {[
          [n.faq1Q, n.faq1A],
          [n.faq2Q, n.faq2A],
          [n.faq3Q, n.faq3A],
        ].map(([q, a]) => (
          <div key={q} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{q}</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
