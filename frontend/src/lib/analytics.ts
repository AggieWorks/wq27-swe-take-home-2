import posthog from "posthog-js";

import { appEnv } from "@/lib/env";

export function captureAnalytics(
  event: string,
  properties?: Record<string, unknown>
) {
  if (!appEnv.isPostHogEnabled) {
    return;
  }
  posthog.capture(event, properties);
}

export function identifyAnalytics(
  distinctId: string,
  properties?: Record<string, unknown>
) {
  if (!appEnv.isPostHogEnabled) {
    return;
  }
  posthog.identify(distinctId, properties);
}
