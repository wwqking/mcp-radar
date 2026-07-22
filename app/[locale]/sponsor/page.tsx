import type { Metadata } from "next";
import { EMAIL_SPONSOR } from "@/lib/site";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const dict = getDictionary(params.locale);
  return {
    title: dict.sponsor.metaTitle,
    description: dict.sponsor.metaDesc,
    alternates: { canonical: `/${params.locale}/sponsor` },
  };
}

export default function SponsorPage({ params }: { params: { locale: Locale } }) {
  const dict = getDictionary(params.locale);
  const s = dict.sponsor;

  const slots = [
    { name: s.slotNewsletter, desc: s.slotNewsletterDesc, price: s.slotNewsletterPrice },
    { name: s.slotDetail, desc: s.slotDetailDesc, price: s.slotDetailPrice },
    { name: s.slotGuide, desc: s.slotGuideDesc, price: s.slotGuidePrice },
  ];

  return (
    <div className="container-site max-w-3xl py-10 sm:py-14">
      {/* 公信力声明（最重要，放最前） */}
      <div className="rounded-xl border-2 border-brand-600 bg-brand-50 p-6 dark:border-brand-500 dark:bg-brand-950/40 sm:p-8">
        <h1 className="text-xl font-extrabold leading-snug text-brand-900 dark:text-brand-100 sm:text-2xl">
          {s.integrity}
        </h1>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{s.audienceTitle}</h2>
        <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">{s.audienceBody}</p>
        <p className="mt-2 text-sm text-neutral-400">{s.audienceNote}</p>
      </section>

      {/* 认领详情页 */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{s.claimTitle}</h2>
        <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">{s.claimBody}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card flex flex-col p-5">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{s.claimFreeTier}</p>
            <p className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">{s.claimFreePrice}</p>
            <ul className="mt-3 flex-1 space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              <li>{s.claimFree1}</li>
              <li>{s.claimFree2}</li>
              <li>{s.claimFree3}</li>
            </ul>
            <p className="mt-3 text-xs text-neutral-400">{s.claimFreeNote}</p>
          </div>
          <div className="card relative flex flex-col border-2 border-brand-600 p-5 dark:border-brand-500">
            <span className="absolute -top-3 left-4 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              {s.rushBadge}
            </span>
            <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">{s.rushTier}</p>
            <p className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-neutral-50">
              {s.rushPrice}<span className="text-sm font-normal text-neutral-400">{s.rushPricePer}</span>
            </p>
            <ul className="mt-3 flex-1 space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              <li>{s.rush1}</li>
              <li>{s.rush2}</li>
              <li>{s.rush3}</li>
            </ul>
            <p className="mt-3 text-xs text-neutral-400">{s.rushNote}</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{s.slotsTitle}</h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{s.slotsSub}</p>
        <div className="mt-4 space-y-4">
          {slots.map((f) => (
            <div key={f.name} className="card flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">{f.name}</p>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{f.desc}</p>
              </div>
              <span className="shrink-0 rounded-lg border border-brand-600 px-4 py-1.5 text-sm font-medium text-brand-700 dark:border-brand-500 dark:text-brand-300">
                {f.price}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-400">{s.slotsNote}</p>
      </section>

      <section className="mt-10 rounded-xl bg-neutral-100 p-6 dark:bg-neutral-800/50">
        <h2 className="font-bold text-neutral-900 dark:text-neutral-100">{s.contactTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          {s.contactBody}<span className="mono">{EMAIL_SPONSOR}</span>
        </p>
      </section>
    </div>
  );
}
