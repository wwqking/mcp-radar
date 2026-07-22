import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL_CORRECTIONS } from "@/lib/site";
import type { Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localizedHref } from "@/lib/i18n/href";

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const d = getDictionary(params.locale).about;
  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: { canonical: `/${params.locale}/about` },
  };
}

export default function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const d = getDictionary(locale).about;

  const WEIGHTS = [
    { dim: d.wMaintenance, weight: "30%", signals: d.wMaintenanceSig },
    { dim: d.wAdoption, weight: "25%", signals: d.wAdoptionSig },
    { dim: d.wUsability, weight: "20%", signals: d.wUsabilitySig },
    { dim: d.wHealth, weight: "15%", signals: d.wHealthSig },
    { dim: d.wCommunity, weight: "10%", signals: d.wCommunitySig },
  ];

  const DATA_SOURCES = [
    { src: d.srcRegistry, fields: d.srcRegistryFields, note: d.srcRegistryNote },
    { src: "GitHub API", fields: d.srcGithubFields, note: "" },
    { src: d.srcNpm, fields: d.srcNpmFields, note: d.srcNpmNote },
  ];

  return (
    <div className="container-site max-w-3xl py-10 sm:py-14">
      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
        {d.h1}
      </h1>
      <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">{d.intro}</p>

      {/* 1. 主理人 */}
      <section className="mt-12">
        <h2 className="flex items-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm dark:bg-brand-900">👤</span>
          {d.ownerTitle}
        </h2>
        <div className="mt-3 rounded-xl border border-neutral-200 p-5 dark:border-neutral-700">
          <p className="leading-7 text-neutral-600 dark:text-neutral-400">{d.ownerBody}</p>
          <p className="mt-3 text-sm text-neutral-400">
            {d.ownerSign} <span className="text-neutral-300 dark:text-neutral-600">{d.ownerSignNote}</span>
          </p>
        </div>
      </section>

      {/* 2. 评分方法论 */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{d.methodTitle}</h2>
        <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">{d.methodIntro}</p>
        <div className="card mt-4 overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-400 dark:border-neutral-800">
                <th className="px-4 py-3 font-medium">{d.thDim}</th>
                <th className="px-4 py-3 font-medium">{d.thWeight}</th>
                <th className="px-4 py-3 font-medium">{d.thSignals}</th>
              </tr>
            </thead>
            <tbody>
              {WEIGHTS.map((w) => (
                <tr key={w.dim} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60">
                  <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-200">{w.dim}</td>
                  <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">{w.weight}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{w.signals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 font-semibold text-neutral-900 dark:text-neutral-100">{d.lifecycleTitle}</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            ["🟢", "active", d.ruleActive],
            ["🟡", "dying", d.ruleDying],
            ["⚰️", "dead", d.ruleDead],
            ["⚪", "unverifiable", d.ruleUnverifiable],
          ].map(([emoji, name, rule]) => (
            <div key={name} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {emoji} <span className="mono">{name}</span>
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{rule}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-neutral-400">{d.lifecycleNote}</p>
      </section>

      {/* 3. 数据来源与限制 */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{d.sourceTitle}</h2>
        <div className="card mt-4 overflow-x-auto p-0">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs text-neutral-400 dark:border-neutral-800">
                <th className="px-4 py-3 font-medium">{d.thSource}</th>
                <th className="px-4 py-3 font-medium">{d.thFields}</th>
                <th className="px-4 py-3 font-medium">{d.thLimits}</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map((ds) => (
                <tr key={ds.src} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/60">
                  <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-200">{ds.src}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{ds.fields}</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400">{ds.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-neutral-400">{d.updateFreq}</p>
        <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
          <strong>{d.boundaryLead}</strong>{d.boundaryBody}
        </div>
      </section>

      {/* 4. 利益披露 */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{d.disclosureTitle}</h2>
        <p className="mt-2 leading-7 text-neutral-600 dark:text-neutral-400">
          {d.disclosureBody1}
          <strong className="text-neutral-900 dark:text-neutral-100">{d.disclosureBold}</strong>
          {d.disclosureBody2}
        </p>
        <Link href={localizedHref(locale, "/sponsor")} className="link-accent mt-2 inline-block text-sm font-medium">
          {d.disclosureLink}
        </Link>
      </section>

      {/* 5. 更正与申诉通道 */}
      <section className="mt-12 rounded-xl border border-neutral-200 p-6 dark:border-neutral-700">
        <h2 className="font-bold text-neutral-900 dark:text-neutral-100">{d.correctionTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          {d.correctionBody}
          <span className="mono"> {EMAIL_CORRECTIONS}</span>
        </p>
      </section>
    </div>
  );
}
