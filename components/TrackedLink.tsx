"use client";

import type { ReactNode } from "react";
import { trackEvent, type AnalyticsProps } from "@/lib/analytics";

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  eventName: string;
  eventProps?: AnalyticsProps;
  target?: string;
  rel?: string;
}

export default function TrackedLink({
  href,
  children,
  className,
  eventName,
  eventProps,
  target,
  rel,
}: Props) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={() => trackEvent(eventName, eventProps)}
    >
      {children}
    </a>
  );
}
