import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";
import { EMAIL_CORRECTIONS, EMAIL_SPONSOR } from "@/lib/site";

type PolicyKind = "privacy" | "terms" | "editorial";

const COPY: Record<
  PolicyKind,
  Record<
    Locale,
    {
      title: string;
      intro: string;
      sections: Array<{ heading: string; body: string[] }>;
    }
  >
> = {
  privacy: {
    en: {
      title: "Privacy Policy",
      intro: "This policy explains the limited data MCP Radar processes when you browse the site or join the newsletter.",
      sections: [
        {
          heading: "Data we process",
          body: [
            "Most pages are static and can be read without an account. Server health data comes from public registries, repositories and package APIs.",
            "If you subscribe, we send your email address and the signup source to our newsletter provider for double opt-in. We do not sell email addresses.",
          ],
        },
        {
          heading: "Analytics and cookies",
          body: [
            "The site uses Google Tag Manager to load analytics tags and measure page visits and conversion events. Google Analytics may set first-party analytics cookies and process browser, device and approximate-location data. Language and theme preferences can also be stored in your browser.",
          ],
        },
        {
          heading: "Your choices",
          body: [
            "You can unsubscribe through any newsletter email. For access, correction or deletion requests, contact the corrections address below.",
          ],
        },
      ],
    },
    zh: {
      title: "隐私政策",
      intro: "本政策说明你浏览 MCP Radar 或订阅周刊时，我们会处理哪些有限数据。",
      sections: [
        {
          heading: "我们处理的数据",
          body: [
            "大部分页面是静态页面，无需账号即可阅读。Server 健康数据来自公开 Registry、代码仓库和软件包 API。",
            "订阅时，邮箱和订阅来源会发送给周刊服务商用于双重确认。我们不会出售邮箱地址。",
          ],
        },
        {
          heading: "统计与 Cookie",
          body: [
            "站点使用 Google Tag Manager 加载统计标签，用于衡量页面访问和转化事件。Google Analytics 可能设置第一方统计 Cookie，并处理浏览器、设备和大致位置数据；语言与主题偏好也可保存在浏览器中。",
          ],
        },
        {
          heading: "你的选择",
          body: [
            "你可以通过任一周刊邮件取消订阅。如需访问、更正或删除相关数据，请通过下方纠错邮箱联系。",
          ],
        },
      ],
    },
  },
  terms: {
    en: {
      title: "Terms of Use",
      intro: "MCP Radar provides research and discovery information, not a warranty, security certification or professional advice.",
      sections: [
        {
          heading: "Use of the data",
          body: [
            "TrustScore and lifecycle labels summarize public signals and can be incomplete or delayed. Verify repositories, packages, permissions and network behavior before installing software.",
            "You are responsible for testing, access control, backups and compliance in your own environment.",
          ],
        },
        {
          heading: "Availability and corrections",
          body: [
            "We may update, correct or remove records as sources change. Maintainers can request a review by providing the repository URL and supporting evidence.",
          ],
        },
        {
          heading: "Commercial content",
          body: [
            "Sponsored placements are labeled. Payment does not purchase a TrustScore, category or organic ranking.",
          ],
        },
      ],
    },
    zh: {
      title: "使用条款",
      intro: "MCP Radar 提供研究与发现信息，不构成质量保证、安全认证或专业建议。",
      sections: [
        {
          heading: "数据使用",
          body: [
            "TrustScore 和生命周期标签是公开信号的摘要，可能存在缺失或延迟。安装前应自行核对仓库、软件包、权限和网络行为。",
            "你需要对自己的测试、权限控制、备份和合规负责。",
          ],
        },
        {
          heading: "可用性与更正",
          body: [
            "来源变化后，我们可能更新、更正或移除记录。维护者可提供仓库 URL 和证据申请复核。",
          ],
        },
        {
          heading: "商业内容",
          body: [
            "赞助展示会被明确标记。付费不能购买 TrustScore、分类或自然排名。",
          ],
        },
      ],
    },
  },
  editorial: {
    en: {
      title: "Editorial & Sponsorship Policy",
      intro: "This policy separates MCP Radar's public-data scoring from sponsorship and explains how corrections are handled.",
      sections: [
        {
          heading: "Scoring independence",
          body: [
            "TrustScore is computed from the published methodology. Sponsors cannot pay to change a score, lifecycle label, category or organic order.",
            "A sponsored placement is visually labeled and does not imply that MCP Radar has security-audited or endorsed the product.",
          ],
        },
        {
          heading: "Sources and review",
          body: [
            "Automated fields must identify their source and data date. Editorial claims should use primary sources where practical and distinguish observed facts from interpretation.",
            "Material methodology changes are documented, and unsupported claims should be corrected or removed.",
          ],
        },
        {
          heading: "Corrections and sponsorship",
          body: [
            "For a data correction, contact the corrections address with evidence. For clearly labeled commercial placements, contact the sponsor address.",
          ],
        },
      ],
    },
    zh: {
      title: "编辑与赞助政策",
      intro: "本政策用于隔离 MCP Radar 的公开数据评分与商业赞助，并说明更正流程。",
      sections: [
        {
          heading: "评分独立",
          body: [
            "TrustScore 按公开方法计算。赞助商不能付费修改分数、生命周期、分类或自然排序。",
            "赞助展示必须有明显标记，也不代表 MCP Radar 已完成安全审计或为产品背书。",
          ],
        },
        {
          heading: "来源与复核",
          body: [
            "自动生成字段应注明来源和数据日期。编辑性结论应尽可能引用一手来源，并区分观察事实与解释。",
            "重要方法变更应被记录；缺乏证据的说法应被更正或删除。",
          ],
        },
        {
          heading: "更正与赞助",
          body: [
            "数据更正请附证据联系纠错邮箱；明确标记的商业展示请联系赞助邮箱。",
          ],
        },
      ],
    },
  },
};

export default function PolicyPage({
  locale,
  kind,
}: {
  locale: Locale;
  kind: PolicyKind;
}) {
  const copy = COPY[kind][locale];
  return (
    <div className="container-site max-w-3xl py-10 sm:py-14">
      <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
        {copy.title}
      </h1>
      <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">{copy.intro}</p>
      <p className="mt-2 text-xs text-neutral-400">
        {locale === "en" ? "Last updated: July 28, 2026" : "最后更新：2026-07-28"}
      </p>

      <div className="mt-10 space-y-10">
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="leading-7 text-neutral-600 dark:text-neutral-400">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-neutral-200 p-5 text-sm dark:border-neutral-700">
        <p>
          {locale === "en" ? "Corrections: " : "数据更正："}
          <Link className="link-accent" href={`mailto:${EMAIL_CORRECTIONS}`}>
            {EMAIL_CORRECTIONS}
          </Link>
        </p>
        <p className="mt-2">
          {locale === "en" ? "Sponsorship: " : "商业合作："}
          <Link className="link-accent" href={`mailto:${EMAIL_SPONSOR}`}>
            {EMAIL_SPONSOR}
          </Link>
        </p>
      </div>
    </div>
  );
}
