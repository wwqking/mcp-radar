"use client";

import { useState } from "react";
import SubscribeForm, { type SubscribeFormStrings } from "./SubscribeForm";

interface Props {
  /** 按钮文案（未展开时） */
  label: string;
  /** 展开后表单的字符串（cta 用「加入候补」类文案） */
  strings: SubscribeFormStrings;
  source: string;
  note?: string;
  buttonVariant?: "primary" | "outline";
}

/** 会员/团队档「候补名单」CTA：点按钮展开真实订阅表单，把兴趣邮箱收进列表。
 *  变现（支付）未落地，这里先收需求，不做假按钮也不假装能付款。 */
export default function WaitlistCta({ label, strings, source, note, buttonVariant = "primary" }: Props) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="mt-5">
        <SubscribeForm strings={strings} source={source} layout="stacked" buttonVariant={buttonVariant} />
        {note && <p className="mt-2 text-center text-xs text-neutral-400">{note}</p>}
      </div>
    );
  }

  const btnClass =
    buttonVariant === "outline"
      ? "mt-5 w-full rounded-lg border border-brand-600 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-50 dark:border-brand-500 dark:text-brand-300 dark:hover:bg-brand-950"
      : "mt-5 w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700";

  return (
    <button type="button" onClick={() => setOpen(true)} className={btnClass}>
      {label}
    </button>
  );
}
