import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/locales";
import { localizedHref } from "@/lib/i18n/href";
import { getSeoLanding, getSeoLandingSlugs } from "@/lib/seo-landing";

const SUFFIX = "-mcp-server";

interface Props {
  params: Promise<{ tool: string; locale: Locale }>;
}

export function generateStaticParams() {
  return getSeoLandingSlugs().map((slug) => ({ tool: `${slug}${SUFFIX}` }));
}

function toolSlugFromParam(param: string): string | null {
  if (!param.endsWith(SUFFIX)) return null;
  return param.slice(0, -SUFFIX.length);
}

function detailPath(tool: string, locale: Locale): string | null {
  const toolSlug = toolSlugFromParam(tool);
  const landing = toolSlug ? getSeoLanding(toolSlug) : undefined;
  return landing ? localizedHref(locale, `/server/${landing.serverSlug}`) : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool, locale } = await params;
  const destination = detailPath(tool, locale);
  if (!destination) return {};

  return {
    alternates: { canonical: destination },
    robots: { index: false, follow: true },
  };
}

export default async function LegacySeoLandingPage({ params }: Props) {
  const { tool, locale } = await params;
  const destination = detailPath(tool, locale);
  if (!destination) notFound();

  permanentRedirect(destination);
}
