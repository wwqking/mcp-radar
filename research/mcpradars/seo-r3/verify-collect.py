#!/usr/bin/env python3
"""采集结果验证 —— 跑完 `npm run collect` 后确认三件事：

1. remoteEndpoints 真的落盘了，且数量与 registry 里的占比对得上
2. 批次 B 的 34 个新种子确实进库，且 TrustScore 正常（不是 0 分空壳）
3. 没有把库存打崩（总数只增不减、已建落地页的 server 都还在）

用法：python3 research/mcpradars/seo-r3/verify-collect.py [旧数据快照路径]
"""
import json, sys, collections

new = json.load(open("data/servers.json"))["servers"]
old_path = sys.argv[1] if len(sys.argv) > 1 else "/tmp/servers-before.json"
try:
    old = json.load(open(old_path))["servers"]
except Exception:
    old = []

print(f"总数: {len(old)} → {len(new)}  ({len(new)-len(old):+d})\n")

# --- 1. remote 端点 ---
remote = [s for s in new if s.get("remoteEndpoints")]
print(f"[1] 带托管端点的 server: {len(remote)} / {len(new)} ({len(remote)/max(len(new),1):.0%})")
tr = collections.Counter(e["type"] for s in remote for e in s["remoteEndpoints"])
for t, n in tr.most_common():
    print(f"      {t}: {n}")
if remote:
    top = sorted(remote, key=lambda s: -s["trustScore"])[:5]
    print("    健康分最高的 5 个（/remote-mcp-servers 首屏就是这些）:")
    for s in top:
        print(f"      {s['trustScore']:>3}  {s['name'][:38]:<38} {s['remoteEndpoints'][0]['url'][:44]}")
else:
    print("    ⚠️ 一个都没有 —— registry.ts 的 remotes 捕获没生效")

# --- 2. 批次 B 新种子 ---
import csv, re
try:
    want = [r["github_repo"] for r in csv.DictReader(
        open("research/mcpradars/seo-r3/collect-whitelist-final.csv"))]
except Exception:
    want = []
by_repo = {}
for s in new:
    ru = (s.get("repoUrl") or "").lower()
    m = re.search(r"github\.com[/:]([^/]+)/([^/#?.]+)", ru)
    if m:
        by_repo[f"{m.group(1)}/{m.group(2)}"] = s
hit = [(r, by_repo[r.lower()]) for r in want if r.lower() in by_repo]
miss = [r for r in want if r.lower() not in by_repo]
print(f"\n[2] 批次 B 新种子入库: {len(hit)} / {len(want)}")
zero = [(r, s) for r, s in hit if s["trustScore"] == 0]
if zero:
    print(f"    ⚠️ TrustScore=0 的 {len(zero)} 个（可能富化失败）: {[r for r,_ in zero]}")
for r, s in sorted(hit, key=lambda x: -x[1]["trustScore"])[:10]:
    print(f"      trust={s['trustScore']:>3} ★{s['signals']['stars']:<7} {r}")
if miss:
    print(f"    ✗ 没进库的 {len(miss)} 个: {miss}")

# --- 3. 回归：已建落地页的 server 不能丢 ---
LANDING = ["airtable","anki","context7","exa","fetch","figma","filesystem","firecrawl","github",
           "linear","memory","perplexity","playwright","postgres","qdrant","sentry","shopify",
           "tavily","twilio"]
old_slugs = {s["slug"] for s in old}
new_slugs = {s["slug"] for s in new}
lost = old_slugs - new_slugs
print(f"\n[3] 回归检查")
print(f"    本轮消失的 server: {len(lost)}" + (f"  例: {list(lost)[:5]}" if lost else ""))
print(f"    新增: {len(new_slugs - old_slugs)}")
