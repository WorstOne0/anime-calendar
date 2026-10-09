// Field names and enums are AniList's GraphQL schema (services/queries.ts selects them).
export type MediaFormat = "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";
export type MediaTitle = { romaji: string | null; english: string | null; native?: string | null };
export type CoverImage = { extraLarge?: string | null; large: string | null; color?: string | null };

export type Media = {
  id: number;
  siteUrl: string;
  status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
  format: MediaFormat | null;
  episodes: number | null;
  duration: number | null;
  genres: string[];
  averageScore: number | null;
  description: string | null;
  title: MediaTitle;
  coverImage: CoverImage | null;
  bannerImage: string | null;
  studios: { nodes: { name: string }[] } | null;
  nextAiringEpisode: { airingAt: number; episode: number } | null;
  externalLinks: { site: string; url: string; type: string }[] | null;
};

export type MediaDetail = Media & {
  season: Season | null;
  seasonYear: number | null;
  startDate: { year: number | null; month: number | null; day: number | null } | null;
  trailer: { id: string; site: string; thumbnail: string | null } | null;
  airingSchedule: { nodes: { episode: number; airingAt: number }[] } | null;
  relations: { edges: { relationType: string; node: { id: number; type: string; format: MediaFormat | null; title: MediaTitle; coverImage: CoverImage | null } }[] } | null;
};

export type ScheduleMedia = { id: number; isAdult: boolean; popularity: number; title: MediaTitle; coverImage: CoverImage | null; bannerImage: string | null };
export type AiringSchedule = { airingAt: number; episode: number; media: ScheduleMedia | null };

export type Viewer = { id: number; name: string; avatar: { medium: string | null } | null };
export type ListEntry = { mediaId: number; progress: number; status: string };

export const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;

export type Season = (typeof SEASONS)[number];
export type SeasonRef = { season: Season; year: number };

// Route paths are a contract with search engines: /temporada/outono-2026. Changing one breaks indexed links.
export const SEASON_SLUGS: Record<Season, string> = { WINTER: "inverno", SPRING: "primavera", SUMMER: "verao", FALL: "outono" };

// AniList's own names for the sites, mapped to what a Brazilian viewer knows them as.
export const STREAMING_SITES: Record<string, string> = {
  Crunchyroll: "Crunchyroll",
  Netflix: "Netflix",
  "Disney Plus": "Disney+",
  "Amazon Prime Video": "Prime Video",
  Max: "Max",
  "HBO Max": "Max",
  Globoplay: "Globoplay",
};

// Broadcast seasons start in January, April, July and October.
export const currentSeason = (date: Date = new Date()): SeasonRef => ({ season: SEASONS[Math.floor(date.getMonth() / 3)], year: date.getFullYear() });

export const shiftSeason = ({ season, year }: SeasonRef, step: number): SeasonRef => {
  const index = SEASONS.indexOf(season) + step;
  return { season: SEASONS[((index % 4) + 4) % 4], year: year + Math.floor(index / 4) };
};

export const isSameSeason = (a: SeasonRef, b: SeasonRef) => a.season === b.season && a.year === b.year;

export const seasonSlug = ({ season, year }: SeasonRef) => `${SEASON_SLUGS[season]}-${year}`;

export const seasonPath = (ref: SeasonRef) => `/temporada/${seasonSlug(ref)}`;

export const parseSeasonSlug = (slug: string): SeasonRef | null => {
  const [name, year] = slug.split("-");
  const season = SEASONS.find((key) => SEASON_SLUGS[key] === name);

  return season && /^\d{4}$/.test(year ?? "") ? { season, year: Number(year) } : null;
};

// /anime/185660-kusuriya-no-hitorigoto-3rd-season: the id is what the page reads, the words are for people and search engines.
export const animePath = ({ id, title }: { id: number; title: MediaTitle }) => {
  const words = (title.romaji || title.english || "anime")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `/anime/${id}-${words}`;
};

// Romaji first; the English title only when it says something different.
export const mediaTitles = (title: MediaTitle) => {
  const romaji = title.romaji ?? "";
  const english = title.english ?? "";

  return { title: romaji || english, subtitle: romaji && english.toLowerCase() !== romaji.toLowerCase() ? english : "" };
};

export const mediaStreams = (media: Media) => {
  const links = (media.externalLinks ?? []).filter((link) => link.type === "STREAMING" && STREAMING_SITES[link.site]);
  const names = new Set<string>();

  return links
    .map((link) => ({ name: STREAMING_SITES[link.site], url: link.url }))
    .filter((stream) => !names.has(stream.name) && names.add(stream.name))
    .slice(0, 4);
};
