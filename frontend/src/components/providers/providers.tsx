"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PostHogProvider } from "@/components/providers/posthog-provider";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PostHogProvider>
  );
}
