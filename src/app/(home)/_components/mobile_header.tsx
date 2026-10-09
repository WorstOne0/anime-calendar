"use client";

// Next
import Link from "next/link";
import { useRouter } from "next/navigation";
// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS, seasonPath, shiftSeason, type SeasonRef } from "@/core/models";
// Components
import { LangToggle } from "@/components";
import AccountButton from "./account_button";
import ActiveChips from "./active_chips";
import ViewToggle from "./view_toggle";
// Utils
import { formatWeekday, pad2 } from "@/utils";
import type { WeekDay } from "../_utils/build_week";

// Small-screen header, sticky inside <main>: brand, season picker, filters and, in calendar view, the day tabs.
export default function MobileHeader({ season, days, activeCount }: { season: SeasonRef; days: WeekDay[] | null; activeCount: number }) {
  const lang = useLanguageController((state) => state.lang);
  const view = useSeasonController((state) => state.view);
  const selectedDay = useSeasonController((state) => state.selectedDay);
  const setSelectedDay = useSeasonController((state) => state.setSelectedDay);
  const setIsSheetOpen = useSeasonController((state) => state.setIsSheetOpen);
  const router = useRouter();

  const t = TRANSLATIONS[lang];
  const seasons = [-2, -1, 0, 1, 2].map((step) => shiftSeason(season, step));
  const activeDay = selectedDay ?? days?.find((day) => day.isToday)?.index;

  return (
    <div className="px-[2rem] py-[1.2rem] flex flex-col gap-[1.2rem] sticky top-0 z-10 bg-background border-b border-line lg:hidden">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-[0.3rem]">
          <span className="text-[1.5rem] font-extrabold tracking-[-0.02em]">kuuhaku</span>
          <span className="font-mono text-[1.1rem] text-lavender">/anime</span>
        </Link>
        <div className="flex items-center gap-[1.2rem]">
          <LangToggle />
          <AccountButton />
        </div>
      </div>

      <div className="flex items-center justify-between gap-[1.2rem]">
        {/* A transparent native select over the title: the phone's own picker, no custom menu. */}
        <label className="relative min-w-0 flex items-center gap-[0.6rem] text-[2.2rem] font-extrabold tracking-[-0.03em]">
          <span className="truncate">
            {t.seasons[season.season]} {season.year}
          </span>
          <span className="text-[1.3rem] text-meta">▾</span>
          <select value={seasonPath(season)} onChange={(event) => router.push(event.target.value)} className="absolute inset-0 opacity-0">
            {seasons.map((option) => (
              <option key={seasonPath(option)} value={seasonPath(option)}>
                {t.seasons[option.season]} {option.year}
              </option>
            ))}
          </select>
        </label>
        <ViewToggle />
      </div>

      <div className="flex items-center gap-[0.6rem] overflow-x-auto">
        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="h-[3.6rem] shrink-0 px-[1.4rem] rounded-full border border-title bg-title text-[1.3rem] font-semibold text-background"
        >
          {t.filters.title}
          {activeCount > 0 && ` · ${activeCount}`}
        </button>
        <ActiveChips />
      </div>

      {view === "calendar" && days && (
        <div className="flex gap-[0.6rem]">
          {days.map((day) => {
            const isSelected = day.index === activeDay;

            return (
              <button
                key={day.index}
                type="button"
                onClick={() => setSelectedDay(day.index)}
                className={`h-[5.8rem] min-w-0 flex-1 flex flex-col items-center justify-center gap-[0.4rem] rounded-card ${isSelected ? "bg-action" : ""}`}
              >
                <span className={`font-mono text-[1rem] uppercase ${isSelected ? "text-on-action" : "text-meta"}`}>{formatWeekday(day.date, lang)}</span>
                <span className={`text-[1.8rem] font-bold ${isSelected ? "text-on-action" : day.isToday ? "text-action-text" : "text-title"}`}>{pad2(day.date.getDate())}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
