"use client";

// Next
import Link from "next/link";
// Controllers
import { useLanguageController } from "@/core/controllers";
// Models
import { TRANSLATIONS, seasonPath, type MediaDetail } from "@/core/models";
// Hooks
import { useNow } from "@/hooks";
// Components
import { AnimeDetail, LangToggle } from "@/components";

// The anime's own page, where search results and shared links land. Read-only: list actions live in the season screen.
export default function ShowView({ media }: { media: MediaDetail }) {
  const lang = useLanguageController((state) => state.lang);
  const now = useNow();

  const t = TRANSLATIONS[lang];
  const season = media.season && media.seasonYear ? { season: media.season, year: media.seasonYear } : null;
  const seasonLabel = season ? `${t.seasons[season.season]} ${season.year}` : "";

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <header className="px-[2rem] py-[1.4rem] flex items-center justify-between gap-[1.2rem] sticky top-0 z-10 bg-background border-b border-line lg:px-[3.6rem]">
        <Link href="/" className="flex items-baseline gap-[0.4rem]">
          <span className="text-[1.7rem] font-extrabold tracking-[-0.02em]">kuuhaku</span>
          <span className="font-mono text-[1.2rem] text-lavender">/anime</span>
        </Link>
        <div className="flex items-center gap-[1.6rem]">
          {season && (
            <Link href={seasonPath(season)} className="font-mono text-[1.2rem] text-action-text hover:text-action-text-hover">
              ‹ {seasonLabel}
            </Link>
          )}
          <LangToggle />
        </div>
      </header>

      <article className="max-w-[72rem] mx-auto bg-panel lg:my-[3.2rem] lg:rounded-card lg:border lg:border-line lg:overflow-hidden">
        <AnimeDetail media={media} full={media} now={now} episodesStatus="ready" isPage />
      </article>

      <div className="max-w-[72rem] mx-auto px-[2rem] py-[3.2rem] lg:px-0 lg:pt-0">
        <Link
          href={season ? seasonPath(season) : "/"}
          className="h-[4.4rem] px-[1.8rem] inline-flex items-center rounded-full bg-action text-[1.4rem] font-semibold text-on-action transition-colors hover:bg-action-hover"
        >
          {season ? t.seo.allSeason(seasonLabel) : t.notFound.action}
        </Link>
      </div>
    </div>
  );
}
