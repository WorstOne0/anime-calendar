// Next
import type { MetadataRoute } from "next";
// Models
import { TRANSLATIONS } from "@/core/models";
// Utils
import { SITE_NAME } from "@/utils";

// Concrete colours: the manifest is read before any CSS, so it can't use the tokens. --background in tokens.css.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} · ${TRANSLATIONS.pt.seo.aboutTitle}`,
    short_name: SITE_NAME,
    description: TRANSLATIONS.pt.meta.siteDescription,
    start_url: "/",
    display: "standalone",
    lang: "pt-BR",
    background_color: "#0e0f13",
    theme_color: "#0e0f13",
    icons: [{ src: "/logo/logo.png", sizes: "826x826", type: "image/png", purpose: "any" }],
  };
}
