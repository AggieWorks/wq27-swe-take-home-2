const LEGACY_CDN_HOSTS = ["images.dibs.deals", "dev-images.dibs.deals"];

/**
 * Maps legacy production CDN URLs to local placeholders for the take-home app.
 */
export function resolvePublicImageUrl(
  url: string | null | undefined,
  placeholder = "/deal_placeholder.svg"
): string {
  if (!url || url.trim() === "") {
    return placeholder;
  }

  try {
    if (url.startsWith("/")) {
      return url;
    }

    const parsed = new URL(url);
    if (LEGACY_CDN_HOSTS.includes(parsed.hostname)) {
      return placeholder;
    }

    return url;
  } catch {
    return placeholder;
  }
}
