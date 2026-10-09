"use client";

// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS, type SeasonRef } from "@/core/models";
// Components
import { LangToggle } from "@/components";
import AccountButton from "./account_button";
import ActiveChips from "./active_chips";
import ViewToggle from "./view_toggle";

// Desktop header, sticky inside <main>. MobileHeader is the small-screen one; this one carries the page's h1.
export default function SeasonHeader({ season, summary, activeCount }: { season: SeasonRef; summary: string; activeCount: number }) {
  const lang = useLanguageController((state) => state.lang);
  const resetFilter = useSeasonController((state) => state.resetFilter);

  const t = TRANSLATIONS[lang];

  return (
    <div className="hidden px-[3.6rem] pt-[2rem] pb-[1.6rem] lg:flex flex-col gap-[1.2rem] sticky top-0 z-10 bg-background border-b border-line">
      <div className="flex items-center justify-between gap-[2.4rem]">
        <div className="min-w-0 flex items-baseline gap-[1.6rem]">
          <h1 className="text-[3.6rem] font-extrabold tracking-[-0.035em] whitespace-nowrap">
            <span className="sr-only">{t.season.heading} </span>
            {t.seasons[season.season]} {season.year}
          </h1>
          <span className="font-mono text-[1.3rem] text-meta truncate">{summary}</span>
        </div>

        <div className="shrink-0 flex items-center gap-[2rem]">
          <ViewToggle />
          <LangToggle />
          <AccountButton />
        </div>
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-[0.6rem]">
          <ActiveChips />
          <button type="button" onClick={resetFilter} className="px-[0.6rem] py-[0.4rem] font-mono text-[1.2rem] text-meta hover:text-title">
            {t.filters.clear}
          </button>
        </div>
      )}
    </div>
  );
}
