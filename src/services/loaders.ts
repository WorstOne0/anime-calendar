// Next
import { cache } from "react";
// Models
import type { Media, MediaDetail, Season } from "@/core/models";
// Services
import { AniListError, anilist, anilistPages } from "./anilist";
import { MEDIA_QUERY, SEASON_QUERY } from "./queries";

// Server-side reads for the rendered pages, imported by path: not in the barrel, which client code loads.
// cache() lets generateMetadata and the page share one request; its keys compare arguments by identity, hence primitives.

// A season that fails comes back null: the page still renders and the client fetches it.
export const getSeasonMedia = cache(async (season: Season, year: number) => {
  try {
    return await anilistPages<Media>(SEASON_QUERY, { season, year }, "media");
  } catch {
    return null;
  }
});

// Null only when AniList doesn't know the anime (or it is adult). Anything else throws, so a revalidation that
// fails keeps serving the last good page instead of caching an empty one.
export const getAnime = cache(async (id: number) => {
  try {
    return (await anilist<{ Media: MediaDetail }>(MEDIA_QUERY, { id })).Media;
  } catch (error) {
    if (error instanceof AniListError && error.status === 404) return null;
    throw error;
  }
});
