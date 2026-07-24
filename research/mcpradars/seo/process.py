#!/usr/bin/env python3
"""Stage B-C: 清洗 + 聚类 + 机会打分。种子 mcp / 目录站 mcpradars。
输入: raw/mcp_broad_us_2026-07-23.csv
输出: keywords.csv, clusters.csv, content-map.csv
"""
import csv, re
from collections import defaultdict, Counter

RAW = "raw/mcp_broad_us_2026-07-23.csv"

# 噪音词：医学/游戏/无关同名 + 品牌资源 + 低价值
NOISE = [
    "metacarpophalangeal", "joint", "arthritis", "hand", "finger", "thumb",  # 医学(MCP关节)
    "minecraft", "coder pack",                                                # Minecraft Coder Pack
    "coronado", "taphouse", "grill", "restaurant", "menu",                    # 同名餐厅/地名
    "salary", "jobs", "job ", "certification", "certified", "exam",           # 认证/职业(Microsoft Certified)
    "logo", "icon",                                                           # 品牌资源(低价值)
    "medical control", "paramedic", "physician",                             # 医疗
    "lyrics", "reddit", "youtube",                                            # 平台/歌词
]

def is_noise(kw):
    k = kw.lower()
    return any(n in k for n in NOISE)

def main():
    rows = list(csv.DictReader(open(RAW)))
    seen = set()
    clean = []
    for r in rows:
        kw = r["Keyword"].strip().lower()
        if kw in seen:
            continue
        seen.add(kw)
        if is_noise(kw):
            continue
        try:
            vol = int(r["Volume"]); kd = int(r["Keyword Difficulty"])
            cpc = float(r["CPC (USD)"] or 0)
        except ValueError:
            continue
        if vol < 50:
            continue
        # trend 方向：取 12 期序列首尾比
        trend_dir = "flat"
        parts = [float(x) for x in r["Trend"].split(",") if x]
        if len(parts) >= 2:
            a, b = parts[0], parts[-1]
            if b > a * 1.15: trend_dir = "rising"
            elif b < a * 0.85: trend_dir = "falling"
        intent = r["Intent"]
        ai_ov = "AI Overview" in r["SERP Features"]
        clean.append({
            "keyword": kw, "volume": vol, "kd": kd, "cpc": round(cpc, 2),
            "intent": intent, "trend": trend_dir, "ai_overview": ai_ov,
        })

    # ---- 聚类：按“搜索问题”归组 ----
    # 对比/教程/协议等“意图型”词，即使含 xxx mcp 也应归意图集群，先于工具词判断
    def cluster_of(kw):
        k = kw
        if " vs " in k or k.endswith(" vs") or "alternative" in k or "compare" in k or "difference" in k:
            return "comparison"
        if k.startswith("what is") or k.startswith("what are") or "explained" in k or "meaning" in k or k in ("mcp", "mcp definition"):
            return "what-is-mcp"
        if "config" in k or "setup" in k or "install" in k or k.startswith("how to") or "how do" in k or "tutorial" in k or ("guide" in k and "guideline" not in k):
            return "setup-tutorial"
        if "protocol" in k or "specification" in k or ("spec" in k and "special" not in k) or "inspector" in k:
            return "protocol"
        if "security" in k or "auth" in k or "oauth" in k:
            return "security"
        if "client" in k:
            return "mcp-client"
        # 具体工具的 server / 简写词 → server-detail（对应 /servers 体系）
        if "mcp server" in k or re.search(r"\bmcp\b.*server", k):
            return "server-detail"
        # “{工具名} mcp” 或 “mcp {工具名}”：具体某个 server 的品牌词，也归 server-detail
        if re.search(r"[a-z0-9.\-]+ mcp$", k) or re.search(r"^mcp [a-z0-9.\-]+$", k):
            return "server-detail"
        if "tool" in k:
            return "mcp-tools"
        if "agent" in k:
            return "mcp-agent"
        if "claude" in k:
            return "claude-mcp"
        if "cursor" in k:
            return "cursor-mcp"
        if "list" in k or "directory" in k or "registry" in k or "awesome" in k or "best " in k:
            return "directory-list"
        if "sdk" in k or "python" in k or "typescript" in k or "npm" in k or "github" in k:
            return "dev-sdk"
        return "other"

    for c in clean:
        c["cluster"] = cluster_of(c["keyword"])

    # ---- 机会打分 (quick score, SERP 前留 provisional) ----
    def vol_s(v): return 1 if v<50 else 2 if v<100 else 5 if v<=1000 else 4 if v<=3000 else 3
    def kd_s(k): return 5 if k<15 else 4 if k<30 else 3 if k<45 else 2 if k<60 else 1
    def int_s(i):
        if "Transactional" in i: return 5
        if "Commercial" in i: return 4
        if "Informational" in i: return 2
        return 1
    def tr_s(t): return 5 if t=="rising" else 3 if t=="flat" else 1
    for c in clean:
        c["score"] = round(vol_s(c["volume"])*0.20 + kd_s(c["kd"])*0.25 +
                           int_s(c["intent"])*0.25 + tr_s(c["trend"])*0.15 +
                           3*0.15, 2)  # serp=3 provisional(中性)
        c["verdict"] = "do" if c["score"]>=3.5 else "watch" if c["score"]>=2.5 else "drop"

    clean.sort(key=lambda x: (-x["score"], -x["volume"]))

    # ---- 写 keywords.csv ----
    with open("keywords.csv","w",newline="") as f:
        w=csv.DictWriter(f, fieldnames=["keyword","cluster","volume","kd","cpc","intent","trend","ai_overview","score","verdict"])
        w.writeheader(); w.writerows(clean)

    # ---- clusters.csv ----
    cl = defaultdict(list)
    for c in clean: cl[c["cluster"]].append(c)
    with open("clusters.csv","w",newline="") as f:
        w=csv.writer(f)
        w.writerow(["cluster","kw_count","total_volume","avg_kd","avg_score","do_count","ai_ov_share","top_keyword"])
        clusters_sorted = sorted(cl.items(), key=lambda kv: -sum(x["volume"] for x in kv[1]))
        for name, items in clusters_sorted:
            tv=sum(x["volume"] for x in items)
            w.writerow([name, len(items), tv, round(sum(x["kd"] for x in items)/len(items),1),
                        round(sum(x["score"] for x in items)/len(items),2),
                        sum(1 for x in items if x["verdict"]=="do"),
                        f'{sum(1 for x in items if x["ai_overview"])*100//len(items)}%',
                        max(items,key=lambda x:x["volume"])["keyword"]])

    # 打印摘要
    print(f"清洗后: {len(clean)} 词 (原始 {len(rows)})")
    print(f"总搜索量: {sum(c['volume'] for c in clean):,}/月 | do={sum(1 for c in clean if c['verdict']=='do')} watch={sum(1 for c in clean if c['verdict']=='watch')}")
    print("\n=== 集群(按总搜索量) ===")
    print(f'{"cluster":18} {"词数":>5} {"总量":>8} {"均KD":>5} {"均分":>5} {"AIov":>5}  代表词')
    for name, items in clusters_sorted:
        tv=sum(x["volume"] for x in items)
        print(f'{name:18} {len(items):>5} {tv:>8,} {sum(x["kd"] for x in items)/len(items):>5.0f} '
              f'{sum(x["score"] for x in items)/len(items):>5.2f} '
              f'{sum(1 for x in items if x["ai_overview"])*100//len(items):>4}%  {max(items,key=lambda x:x["volume"])["keyword"]}')

if __name__ == "__main__":
    main()
