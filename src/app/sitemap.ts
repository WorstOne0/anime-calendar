// Next
import type { MetadataRoute } from "next";
// Models
import { animePath, currentSeason, seasonPath, shiftSeason } from "@/core/models";
// Services
import { getSeasonMedia } from "@/services/loaders";
// Utils
import { SITE_URL } from "@/utils";

export const revalidate = 86400;

// The home, the year of seasons around this one, and every anime of the current and the next season.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const current = currentSeason();
  const seasons = [-4, -3, -2, -1, 0, 1].map((step) => shiftSeason(current, step));
  const lists = await Promise.all([current, shiftSeason(current, 1)].map((season) => getSeasonMedia(season.season, season.year)));
  const media = lists.flatMap((list) => list ?? []);

  return [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    ...seasons.map((season) => ({ url: `${SITE_URL}${seasonPath(season)}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...media.map((item) => ({ url: `${SITE_URL}${animePath(item)}`, changeFrequency: "daily" as const, priority: 0.6 })),
  ];
}
