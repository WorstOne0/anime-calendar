// Next
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Schibsted_Grotesk } from "next/font/google";
// Models
import { TRANSLATIONS } from "@/core/models";
// Components
import Providers from "./providers";
// Utils
import { SITE_NAME, SITE_URL } from "@/utils";
// Styles
import "@/styles/index.css";

const schibsted = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-schibsted" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const t = TRANSLATIONS.pt;

// Server component on purpose: "use client" here would silently drop metadata. Pages override title and description.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${t.meta.siteTitle} | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  description: t.meta.siteDescription,
  applicationName: SITE_NAME,
  keywords: [
    "temporada de anime",
    "animes da temporada",
    "calendário de animes",
    "lançamentos de anime",
    "horário dos episódios de anime",
    "onde assistir anime",
    "simulcast",
    "Crunchyroll",
    "AniList",
    "anime season",
    "anime airing schedule",
  ],
  icons: { icon: "/logo/logo.png", apple: "/logo/logo.png" },
  openGraph: { type: "website", locale: "pt_BR", siteName: SITE_NAME, title: t.meta.siteTitle, description: t.meta.siteDescription },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

// --background in tokens.css: browser chrome is painted before any CSS loads.
export const viewport: Viewport = { themeColor: "#0e0f13", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${schibsted.variable} ${geistMono.variable}`}>
      <body className="h-full w-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
