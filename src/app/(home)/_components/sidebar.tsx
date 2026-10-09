"use client";

// Next
import Link from "next/link";
// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS, seasonPath, shiftSeason, type Media, type SeasonRef } from "@/core/models";
// Components
import FilterGroups from "./filter_groups";
import MineSwitch from "./mine_switch";
// Utils
import { timeZoneLabel } from "@/utils";

// Desktop only; below lg the same filters live in the bottom sheet.
export default function Sidebar({ season, media, myCount, activeCount, now }: { season: SeasonRef; media: Media[]; myCount: number; activeCount: number; now: number | null }) {
  const lang = useLanguageController((state) => state.lang);
  const resetFilter = useSeasonController((state) => state.resetFilter);

  const t = TRANSLATIONS[lang];
  const previous = shiftSeason(season, -1);
  const next = shiftSeason(season, 1);

  return (
    <aside className="hidden h-full min-h-0 pt-[2.8rem] px-[2.4rem] pb-[2.4rem] lg:flex flex-col gap-[2.6rem] border-r border-line overflow-y-auto scrollbar-thin">
      <Link href="/" className="flex items-baseline gap-[0.4rem]">
        <span className="text-[1.9rem] font-extrabold tracking-[-0.02em]">kuuhaku</span>
        <span className="font-mono text-[1.3rem] text-lavender">/anime</span>
      </Link>

      <div className="flex flex-col gap-[0.8rem]">
        <span className="font-mono text-[1.1rem] uppercase tracking-[0.1em] text-lavender">{t.season.kicker}</span>
        <span className="text-[2.6rem] font-extrabold tracking-[-0.03em]">
          {t.seasons[season.season]} {season.year}
        </span>
        <nav className="flex gap-[1.4rem] font-mono text-[1.2rem] text-meta">
          <Link href={seasonPath(previous)} className="hover:text-title">
            ‹ {t.seasons[previous.season]} {previous.year}
          </Link>
          <Link href={seasonPath(next)} className="hover:text-title">
            {t.seasons[next.season]} {next.year} ›
          </Link>
        </nav>
      </div>

      <div className="pt-[2rem] flex items-baseline justify-between border-t border-line">
        <span className="text-[1.5rem] font-bold">{t.filters.title}</span>
        {activeCount > 0 && (
          <button type="button" onClick={resetFilter} className="font-mono text-[1.2rem] text-action-text hover:text-action-text-hover">
            {t.filters.clearShort}
          </button>
        )}
      </div>

      <FilterGroups media={media} />
      <MineSwitch myCount={myCount} />

      <div className="mt-auto font-mono text-[1.2rem] leading-[1.7] text-meta">
        {now != null && (
          <>
            {t.season.timesIn} {timeZoneLabel(now).long}
            <br />
          </>
        )}
        {t.season.source}
      </div>
    </aside>
  );
}
