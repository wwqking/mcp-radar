import type { Metadata } from "next";
import { getRadarEntries, getLastUpdated } from "@/lib/data";
import RadarView from "./RadarView";

export const metadata: Metadata = {
  title: "趋势雷达 —— 本周 MCP 生态动态",
  description:
    "本周 MCP 生态发生了什么：爆火 server、新增收录、弃坑预警。每个变化都附可解释依据（涨了多少、为什么判死）。",
  alternates: { canonical: "/radar" },
};

export default async function RadarPage() {
  const [entries, lastUpdated] = await Promise.all([getRadarEntries(), getLastUpdated()]);
  return <RadarView entries={entries} lastUpdated={lastUpdated} />;
}
