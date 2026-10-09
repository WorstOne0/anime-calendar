// Next
import type { Metadata } from "next";
import { notFound } from "next/navigation";
// Models
import { currentSeason, parseSeasonSlug, type SeasonRef } from "@/core/models";
// Services
import { getSeasonMedia } from "@/services/loaders";
// Components
import { JsonLd } from "@/components";
import SeasonView from "../../_components/season_view";
// Utils
import { seasonJsonLd, seasonMetadata } from "@/utils";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 3600;

// None at build time, so a deploy doesn't burst AniList's rate limit: each season renders on its first visit, then is cached.
export const generateStaticParams = () => [];

// The upper bound stops the "next season" links from walking crawlers into an endless run of empty seasons.
const seasonFromParams = async ({ params }: Params): Promise<SeasonRef | null> => {
  const season = parseSeasonSlug((await params).slug);
  return season && season.year >= 1900 && season.year <= currentSeason().year + 1 ? season : null;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const season = await seasonFromParams(props);
  if (!season) return {};

  const media = await getSeasonMedia(season.season, season.year);
  return seasonMetadata(season, media?.length ?? null);
}

export default async function SeasonPage(props: Params) {
  const season = await seasonFromParams(props);
  if (!season) notFound();

  const media = await getSeasonMedia(season.season, season.year);

  return (
    <>
      {media && <JsonLd data={seasonJsonLd(season, media)} />}
      <SeasonView season={season} initialMedia={media} />
    </>
  );
}
