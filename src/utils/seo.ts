// Next
import type { Metadata } from "next";
// Models
import { TRANSLATIONS, animePath, mediaTitles, seasonPath, type Media, type MediaDetail, type SeasonRef } from "@/core/models";
// Utils
import { describeMedia } from "./describe_media";
import { formatClock, formatDay, formatMonth, formatWeekday, pad2 } from "./format";

export const SITE_URL = "https://anime.kuuhaku.dev";
export const SITE_NAME = "kuuhaku/anime";

// The server always renders Portuguese, so that is what search engines index.
const t = TRANSLATIONS.pt;

// A page's openGraph replaces the layout's whole object, so every page repeats these.
const OPEN_GRAPH = { siteName: SITE_NAME, locale: "pt_BR" };

const seasonLabel = ({ season, year }: SeasonRef) => `${t.seasons[season]} ${year}`;

// The home is the current season under "/", so it passes its own canonical path.
export const seasonMetadata = (season: SeasonRef, count: number | null, path = seasonPath(season)): Metadata => {
  const title = t.meta.seasonTitle(seasonLabel(season));
  const description = t.meta.seasonDescription(seasonLabel(season), count);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { ...OPEN_GRAPH, type: "website", title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
};

export const animeMetadata = (media: MediaDetail): Metadata => {
  const info = describeMedia(media, { t, lang: "pt", now: null });
  const next = media.nextAiringEpisode;
  const nextAt = next ? new Date(next.airingAt * 1000) : null;
  const when = nextAt
    ? `${formatWeekday(nextAt, "pt", { long: true, zone: "brasilia" })}, ${formatDay(nextAt, "brasilia")} ${formatMonth(nextAt, "pt", "brasilia")}, ${formatClock(nextAt, "brasilia")}`
    : "";
  const title = t.meta.animeTitle(info.title);
  const description = t.meta.animeDescription(info.title, [info.format, info.studio].filter((part) => part !== "—").join(", "), next ? t.meta.nextEpisode(next.episode, when) : "");
  const image = media.bannerImage ?? media.coverImage?.extraLarge ?? media.coverImage?.large ?? undefined;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: animePath(media) },
    openGraph: { ...OPEN_GRAPH, type: "video.tv_show", title, description, url: animePath(media), images: image },
    twitter: { card: "summary_large_image", title, description, images: image },
  };
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "pt-BR",
  description: t.meta.siteDescription,
};

export const seasonJsonLd = (season: SeasonRef, media: Media[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: t.meta.seasonTitle(seasonLabel(season)),
  url: `${SITE_URL}${seasonPath(season)}`,
  numberOfItems: media.length,
  itemListElement: media.map((item, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}${animePath(item)}`, name: mediaTitles(item.title).title })),
});

export const animeJsonLd = (media: MediaDetail) => {
  const info = describeMedia(media, { t, lang: "pt", now: null });
  const isMovie = media.format === "MOVIE";
  const start = media.startDate;
  const date = start?.year ? [start.year, start.month, start.day].filter(Boolean).map((part, index) => (index ? pad2(part!) : part)).join("-") : undefined;
  const studio = media.studios?.nodes[0]?.name;

  return {
    "@context": "https://schema.org",
    "@type": isMovie ? "Movie" : "TVSeries",
    name: info.title,
    alternateName: [media.title.english, media.title.native].filter(Boolean),
    url: `${SITE_URL}${animePath(media)}`,
    image: media.coverImage?.extraLarge ?? media.coverImage?.large ?? undefined,
    description: info.synopsis,
    genre: media.genres,
    inLanguage: "ja",
    sameAs: media.siteUrl,
    ...(studio && { productionCompany: { "@type": "Organization", name: studio } }),
    ...(date && { [isMovie ? "datePublished" : "startDate"]: date }),
    ...(!isMovie && media.episodes && { numberOfEpisodes: media.episodes }),
  };
};
