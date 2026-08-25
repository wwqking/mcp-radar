import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

interface GscRow {
  url: string;
  clicks: number;
  impressions: number;
  position: number;
}

interface AllowlistEntry {
  clicks: number;
  impressions: number;
  weightedPosition: number;
  locales: string[];
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value);
  return values;
}

function parseRows(csv: string): GscRow[] {
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const header = parseCsvLine(lines[0] ?? "");
  const column = (name: string) => {
    const index = header.indexOf(name);
    if (index < 0) throw new Error(`Missing required GSC column: ${name}`);
    return index;
  };

  const urlIndex = column("Top pages");
  const clicksIndex = column("Clicks");
  const impressionsIndex = column("Impressions");
  const positionIndex = column("Position");

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return {
      url: values[urlIndex] ?? "",
      clicks: Number(values[clicksIndex] ?? 0),
      impressions: Number(values[impressionsIndex] ?? 0),
      position: Number(values[positionIndex] ?? Number.POSITIVE_INFINITY),
    };
  });
}

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const input = process.argv[2];
  if (!input || input.startsWith("--")) {
    throw new Error(
      "Usage: node --import tsx scripts/build-seo-index-allowlist.mts <Pages.csv> --export-date YYYY-MM-DD",
    );
  }

  const exportDate = argument("--export-date");
  if (!exportDate || !/^\d{4}-\d{2}-\d{2}$/.test(exportDate)) {
    throw new Error("--export-date YYYY-MM-DD is required");
  }

  const sourcePath = resolve(input);
  const rows = parseRows(await readFile(sourcePath, "utf8"));
  const bySlug = new Map<
    string,
    { clicks: number; impressions: number; positionWeight: number; locales: Set<string> }
  >();

  for (const row of rows) {
    const match = row.url.match(/^https:\/\/www\.mcpradars\.com\/(en|zh)\/server\/([^/?#]+)\/?$/);
    if (!match) continue;

    const qualifies = row.clicks > 0 || (row.impressions >= 5 && row.position <= 20);
    if (!qualifies) continue;

    const [, locale, slug] = match;
    const current = bySlug.get(slug) ?? {
      clicks: 0,
      impressions: 0,
      positionWeight: 0,
      locales: new Set<string>(),
    };
    current.clicks += row.clicks;
    current.impressions += row.impressions;
    current.positionWeight += row.position * Math.max(row.impressions, 1);
    current.locales.add(locale);
    bySlug.set(slug, current);
  }

  const entries = Object.fromEntries(
    [...bySlug.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([slug, value]) => {
        const entry: AllowlistEntry = {
          clicks: value.clicks,
          impressions: value.impressions,
          weightedPosition: Number(
            (value.positionWeight / Math.max(value.impressions, 1)).toFixed(2),
          ),
          locales: [...value.locales].sort(),
        };
        return [slug, entry];
      }),
  );

  const outputPath = resolve("data/seo-index-allowlist.json");
  const output = {
    version: 1,
    exportDate,
    source: "Google Search Console Pages.csv",
    criteria: {
      includeIfClicksGreaterThan: 0,
      orMinimumImpressions: 5,
      andMaximumAveragePosition: 20,
      note: "Entity demand is aggregated by slug across locales; only English detail pages are indexable during recovery.",
    },
    entries,
  };

  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Wrote ${Object.keys(entries).length} demanded server slugs to ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
