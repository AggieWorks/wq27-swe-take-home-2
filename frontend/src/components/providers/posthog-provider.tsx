// app/providers.tsx
"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

import SuspendedPostHogPageView from "@/components/posthog/posthog-page-view";
import { appEnv } from "@/lib/env";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!appEnv.isPostHogEnabled) {
      return;
    }

    posthog.init(appEnv.POSTHOG_KEY, {
      api_host: appEnv.POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
    });
  }, []);

  if (!appEnv.isPostHogEnabled) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}
