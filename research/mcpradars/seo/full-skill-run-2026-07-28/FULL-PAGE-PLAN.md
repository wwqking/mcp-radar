# MCP Radar · SEO Keyword Research Skill 全量扩页结果

## 这次实际跑了什么

- 技能输入：25,479 条原始关键词。
- 模块裁决、去重和排除后：7,631 条。
- `plan.py` 的机械候选页信号：3,589。
- A6 优先级：P0 1,107 / P1 2,588 / P2 3,936。
- `classify.py`：entity 2,555 / attribute 998 / junk 784 / judge 3,294。
- A4 当前 817 个实体页：enrich=189，merge=150，noindex=96，reject=382。
- 与旧版 demand×supply 映射、当前 817 个实体、现有 URL 再求交：179 个实体页面机会。
- 内容词按“一意图一 URL”聚合：54 个内容页面簇。

## 可以立即新增

- 新页面：**74 页**
- 页面词簇需求合计：**56,880/月**（有同义词和跨页重叠，只用于排序）
- 实体机会状态：enrich_existing=44，collect_required=57，create_ready=29，semantic_review=47，scope_excluded=1，merge_into_entity_page=1
- 内容机会状态：create_ready=48，enrich_existing=6
- 另有 189 条核心内容词保留在未匹配池，等待下一轮语义聚类；没有被静默删除。

## 前 30 个 write-now 页面

| # | URL | 主词 | 主词量 | KD | 词簇量 | 类型 |
|---:|---|---|---:|---:|---:|---|
| 1 | `/servers/jira-mcp-server` | jira mcp | 2,900 | 50 | 5,310 | entity landing |
| 2 | `/guides/mcp-registry` | mcp registry | 1,600 | 43 | 3,460 | explainer |
| 3 | `/servers/obsidian-mcp-server` | obsidian mcp | 1,900 | 34 | 3,370 | entity landing |
| 4 | `/guides/how-to-build-an-mcp-server` | how to build an mcp server | 390 | 24 | 3,220 | how-to |
| 5 | `/guides/best-mcp-servers-for-marketing` | best mcp servers for business sales marketing | 2,900 | 13 | 2,900 | best-of |
| 6 | `/guides/best-mcp-servers` | best mcp servers | 1,900 | 48 | 2,800 | best-of |
| 7 | `/servers/openai-mcp-server` | openai mcp | 1,000 | 46 | 2,370 | entity landing |
| 8 | `/guides/use-mcp-servers-in-vscode` | vscode mcp server | 390 | 63 | 2,110 | client setup |
| 9 | `/servers/gmail-mcp-server` | gmail mcp | 1,000 | 49 | 2,060 | entity landing |
| 10 | `/guides/add-mcp-server-to-claude-desktop` | claude desktop mcp servers configuration | 390 | 23 | 1,650 | client setup |
| 11 | `/guides/cursor-mcp-spawn-npx-enoent` | cursor mcp spawn npx enoent | 1,600 | 24 | 1,600 | troubleshooting |
| 12 | `/guides/install-remotion-mcp-server` | remotion mcp server github npm install claude | 1,600 | 39 | 1,600 | entity integration |
| 13 | `/compare/mcp-vs-a2a` | a2a vs mcp | 720 | 32 | 1,520 | comparison |
| 14 | `/compare/mcp-vs-rag` | rag vs mcp | 720 | 26 | 1,310 | comparison |
| 15 | `/guides/mcp-server-examples` | mcp server examples | 720 | 59 | 1,310 | examples |
| 16 | `/guides/mcp-authentication-and-oauth` | mcp server authentication | 210 | 29 | 1,140 | security guide |
| 17 | `/compare/mcp-resources-vs-tools` | mcp resources vs tools | 590 | 24 | 900 | comparison |
| 18 | `/guides/google-sheets-mcp-server-for-manus` | google sheets mcp server for manus ai | 880 | 0 | 880 | entity integration |
| 19 | `/guides/are-mcp-servers-free` | are mcp servers free | 390 | 24 | 820 | explainer |
| 20 | `/guides/is-mcp-open-source` | model context protocol open source license free | 720 | 67 | 800 | explainer |
| 21 | `/servers/magic-mcp-server` | magic mcp | 390 | 3 | 790 | entity landing |
| 22 | `/guides/how-to-deploy-and-host-an-mcp-server` | hosted mcp servers | 210 | 29 | 780 | how-to |
| 23 | `/guides/best-mcp-servers-for-claude-code` | best mcp servers for claude code | 320 | 10 | 680 | best-of |
| 24 | `/servers/kubernetes-mcp-server` | kubernetes mcp server | 320 | 42 | 670 | entity landing |
| 25 | `/compare/mcp-vs-cli` | mcp vs cli | 390 | 28 | 650 | comparison |
| 26 | `/servers/arxiv-mcp-server` | arxiv-mcp-server | 320 | 7 | 640 | entity landing |
| 27 | `/servers/miro-mcp-server` | miro mcp | 390 | 29 | 610 | entity landing |
| 28 | `/servers/webflow-mcp-server` | webflow mcp | 390 | 17 | 560 | entity landing |
| 29 | `/servers/youtube-mcp-server` | youtube mcp | 320 | 33 | 540 | entity landing |
| 30 | `/guides/how-to-list-mcp-tools` | mcp list tools | 320 | 40 | 510 | how-to |

## 文件

- `WRITE-NOW-PAGES.csv`：已通过需求、去重和当前供给检查的新增页面。
- `ENTITY-PAGE-OPPORTUNITIES.csv`：全部 179 个实体页面机会，含 create/enrich/collect/review。
- `CONTENT-PAGE-CLUSTERS.csv`：一意图一 URL 的内容页面簇及全部支持词。
- `UNMATCHED-CONTENT-KEYWORDS.csv`：保留未完成语义归并的核心词，不冒充页面。
- `keywords.csv`、`entity-classification.csv`：技能脚本的原始输出。
