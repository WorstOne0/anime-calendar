// Next
import type { Metadata } from "next";
// Models
import { currentSeason } from "@/core/models";
// Services
import { getSeasonMedia } from "@/services/loaders";
// Components
import { JsonLd } from "@/components";
import SeasonView from "./_components/season_view";
// Utils
import { seasonJsonLd, seasonMetadata, websiteJsonLd } from "@/utils";

// Rebuilt at most hourly: search engines get the season's titles in the HTML, AniList gets one request an hour.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const season = currentSeason();
  const media = await getSeasonMedia(season.season, season.year);

  return seasonMetadata(season, media?.length ?? null, "/");
}

export default async function Home() {
  const season = currentSeason();
  const media = await getSeasonMedia(season.season, season.year);

  return (
    <>
      <JsonLd data={websiteJsonLd} />
      {media && <JsonLd data={seasonJsonLd(season, media)} />}
      <SeasonView season={season} initialMedia={media} />
    </>
  );
}
