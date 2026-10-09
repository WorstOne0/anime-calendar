// Next
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
// Models
import { animePath } from "@/core/models";
// Services
import { getAnime } from "@/services/loaders";
// Components
import { JsonLd } from "@/components";
import ShowView from "./_components/show_view";
// Utils
import { animeJsonLd, animeMetadata } from "@/utils";

type Params = { params: Promise<{ slug: string }> };

// Six hours: the schedule rarely moves, and every anime page is one AniList request per revalidation.
export const revalidate = 21600;

// Rendered on the first visit and cached, never at build time.
export const generateStaticParams = () => [];

const animeId = (slug: string) => Number(slug.match(/^\d+/)?.[0] ?? 0);

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const id = animeId((await params).slug);
  const media = id ? await getAnime(id).catch(() => null) : null;

  return media ? animeMetadata(media) : {};
}

export default async function AnimePage({ params }: Params) {
  const { slug } = await params;
  const id = animeId(slug);
  if (!id) notFound();

  const media = await getAnime(id);
  if (!media) notFound();

  // One URL per anime: a renamed title or a hand-typed id lands on the canonical slug.
  if (`/anime/${slug}` !== animePath(media)) permanentRedirect(animePath(media));

  return (
    <>
      <JsonLd data={animeJsonLd(media)} />
      <ShowView media={media} />
    </>
  );
}
