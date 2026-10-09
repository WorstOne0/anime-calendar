"use client";

// Next
import { useMemo } from "react";
import Link from "next/link";
// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS, currentSeason, isSameSeason, seasonPath, shiftSeason, type AiringSchedule, type Media, type SeasonRef } from "@/core/models";
// Services
import { AniListError, SCHEDULE_QUERY, SEASON_QUERY } from "@/services";
// Hooks
import { useAniList, useNow } from "@/hooks";
import { useMyList } from "../_hooks/use_my_list";
// Components
import Sidebar from "./sidebar";
import SeasonHeader from "./season_header";
import MobileHeader from "./mobile_header";
import TodayStrip from "./today_strip";
import MediaCard from "./media_card";
import WeekCalendar from "./week_calendar";
import DayAgenda from "./day_agenda";
import DetailPanel from "./detail_panel";
import FilterSheet from "./filter_sheet";
import Toast from "./toast";
// Utils
import { formatMonth, pad2 } from "@/utils";
import { buildWeek, weekRange } from "../_utils/build_week";
import { countActiveFilters, filterMedia } from "../_utils/filter_media";

// Module scope: a `= []` default is a new array each render, and these feed the memos below.
const EMPTY_MEDIA: Media[] = [];
const EMPTY_SCHEDULE: AiringSchedule[] = [];

const ACTION = "h-[4.4rem] px-[1.8rem] rounded-full bg-action text-[1.4rem] font-semibold text-on-action transition-colors hover:bg-action-hover lg:h-auto lg:py-[1rem] lg:text-[1.3rem]";

// The season screen. The server renders the list from `initialMedia` (what search engines read); the week,
// countdowns and local times arrive once the client knows its clock.
export default function SeasonView({ season, initialMedia }: { season: SeasonRef; initialMedia: Media[] | null }) {
  const lang = useLanguageController((state) => state.lang);
  const filter = useSeasonController((state) => state.filter);
  const view = useSeasonController((state) => state.view);
  const selectedDay = useSeasonController((state) => state.selectedDay);
  const resetFilter = useSeasonController((state) => state.resetFilter);
  const now = useNow();
  const { isLoggedIn, entries } = useMyList();

  const week = useMemo(() => (now == null ? null : weekRange(now)), [now]);
  const { data, error, refresh } = useAniList<Media[]>(SEASON_QUERY, { season: season.season, year: season.year }, { pages: "media", fallbackData: initialMedia ?? undefined });
  const { data: scheduleData, error: scheduleError } = useAniList<AiringSchedule[]>(
    week ? SCHEDULE_QUERY : null,
    { from: week && week.start / 1000 - 1, to: week && week.end / 1000 },
    { pages: "airingSchedules" }
  );

  const t = TRANSLATIONS[lang];
  const media = data ?? EMPTY_MEDIA;
  const schedule = scheduleData ?? EMPTY_SCHEDULE;
  const activeCount = countActiveFilters(filter, isLoggedIn);
  const visible = useMemo(() => filterMedia(media, filter, isLoggedIn ? entries : null), [media, filter, isLoggedIn, entries]);
  const myCount = media.filter((item) => entries.has(item.id)).length;

  // Unfiltered, the current week also carries popular holdovers from earlier seasons; filtered, only what the list shows.
  const days = useMemo(() => {
    if (now == null || !week) return null;

    const isCurrent = isSameSeason(currentSeason(new Date(now)), season);
    return buildWeek(schedule, { now, start: week.start, mediaIds: new Set((activeCount ? visible : media).map((item) => item.id)), includePopular: isCurrent && !activeCount });
  }, [now, week, season, schedule, activeCount, visible, media]);

  const today = days?.find((day) => day.isToday);
  const agendaDay = days?.[selectedDay ?? today?.index ?? 0];
  const hasWeek = !!today && (!!scheduleData || !!scheduleError);
  const isError = !!error && !data;
  const isSeasonEmpty = !!data && media.length === 0;
  const seasonLabel = `${t.seasons[season.season]} ${season.year}`;

  const count = activeCount ? `${visible.length} ${t.season.of} ${media.length} ${t.season.titles}` : `${media.length} ${t.season.titles}`;
  const weekLabel = days ? `${pad2(days[0].date.getDate())} ${formatMonth(days[0].date, lang)} – ${pad2(days[6].date.getDate())} ${formatMonth(days[6].date, lang)}` : "";

  const buildStripSkeleton = () => (
    <div className="px-[2rem] pt-[1.6rem] flex flex-col gap-[1.2rem] lg:px-[3.6rem] lg:pt-[2rem]">
      <div className="h-[1.8rem] w-[22rem] rounded-[0.4rem] bg-surface-3" />
      <div className="flex gap-[1rem] overflow-hidden">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="h-[8rem] w-[21rem] shrink-0 rounded-[0.8rem] border border-line-faint bg-surface animate-pulse lg:w-[23.6rem]" />
        ))}
      </div>
    </div>
  );

  const buildCalendarSkeleton = () => (
    <div className="hidden px-[3.6rem] py-[2.4rem] lg:grid grid-cols-7">
      {[0, 1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="px-[0.6rem] py-[1.4rem] flex flex-col gap-[0.8rem] border-l border-line-faint">
          <div className="h-[1.4rem] w-1/2 rounded-[0.3rem] bg-surface-2" />
          {[0, 1, 2].map((row) => (
            <div key={row} className="h-[9.7rem] rounded-control bg-surface animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );

  const buildListSkeleton = (className: string) => (
    <div className={`px-[1.6rem] py-[1.6rem] flex flex-col gap-[1.2rem] lg:px-[3.6rem] lg:py-[2.4rem] lg:grid-cols-2 lg:gap-[2rem] ${className}`}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="h-[15rem] grid grid-cols-[9.6rem_minmax(0,1fr)] rounded-card overflow-hidden border border-line-faint bg-surface lg:h-[23.6rem] lg:grid-cols-[15rem_minmax(0,1fr)]">
          <div className="bg-surface-3 animate-pulse" />
          <div className="p-[1.4rem] flex flex-col gap-[0.9rem] lg:px-[2rem] lg:py-[1.8rem] lg:gap-[1rem]">
            <div className="h-[1rem] w-[45%] rounded-[0.3rem] bg-surface-2" />
            <div className="h-[1.6rem] w-[85%] rounded-[0.4rem] bg-surface-2" />
            <div className="h-[1rem] w-[60%] rounded-[0.3rem] bg-surface-2" />
            <div className="mt-[0.6rem] h-[1rem] w-full rounded-[0.3rem] bg-surface-3" />
            <div className="h-[1rem] w-[75%] rounded-[0.3rem] bg-surface-3" />
          </div>
        </div>
      ))}
    </div>
  );

  const buildError = () => (
    <div className="mx-[1.6rem] my-[2.4rem] p-[2rem] flex flex-col gap-[0.8rem] rounded-[1.2rem] border border-line-strong bg-surface lg:mx-[3.6rem] lg:my-[4.8rem] lg:p-[2.8rem] lg:gap-[1rem] lg:max-w-[56rem]">
      <span className="font-mono text-[1.1rem] text-meta lg:text-[1.2rem]">{error instanceof AniListError ? `HTTP ${error.status}` : t.states.offline} · graphql.anilist.co</span>
      <span className="text-[1.8rem] font-bold lg:text-[2.2rem] lg:tracking-[-0.02em]">{t.states.errorTitle}</span>
      <span className="text-[1.3rem] leading-[1.5] text-copy lg:text-[1.4rem] lg:leading-[1.55]">{t.states.errorBody}</span>
      <button type="button" onClick={() => refresh()} className={`mt-[0.6rem] self-start lg:mt-[0.8rem] ${ACTION}`}>
        {t.states.retry}
      </button>
    </div>
  );

  // A season AniList has nothing for yet offers the way back; a filter that empties the list offers clearing it.
  const buildEmpty = () => (
    <div className="px-[2rem] py-[4.8rem] flex flex-col items-start gap-[1rem] lg:mx-[3.6rem] lg:my-[6.4rem] lg:p-0 lg:gap-[1.2rem] lg:max-w-[52rem]">
      <span className="font-mono text-[1.1rem] uppercase tracking-[0.1em] text-lavender lg:text-[1.2rem]">0 {t.season.titles}</span>
      <span className="text-[2.2rem] font-bold tracking-[-0.02em] lg:text-[2.8rem]">
        {isSeasonEmpty ? t.states.emptySeason : filter.mine && isLoggedIn ? t.states.emptyMine : t.states.emptyTitle}
      </span>
      <span className="text-[1.3rem] leading-[1.5] text-copy lg:text-[1.4rem] lg:leading-[1.55]">{isSeasonEmpty ? t.states.emptySeasonBody : t.states.emptyBody}</span>
      {isSeasonEmpty ? (
        <Link href="/" className={`mt-[0.6rem] inline-flex items-center ${ACTION}`}>
          {t.states.currentSeason}
        </Link>
      ) : (
        <button type="button" onClick={resetFilter} className={`mt-[0.6rem] ${ACTION}`}>
          {t.filters.clear}
        </button>
      )}
    </div>
  );

  // Plain words about the page and links to the seasons around it, for readers and crawlers alike.
  const buildFooter = () => (
    <footer className="mx-[2rem] mb-[4rem] pt-[2.4rem] flex flex-col gap-[1.2rem] border-t border-line lg:mx-[3.6rem] lg:mb-[6rem] lg:max-w-[88rem]">
      <h2 className="text-[1.6rem] font-bold">{t.seo.aboutTitle}</h2>
      <p className="text-[1.3rem] leading-[1.6] text-meta">{t.seo.about(seasonLabel, media.length)}</p>
      <nav className="flex flex-wrap items-center gap-x-[1.4rem] gap-y-[0.6rem] font-mono text-[1.2rem]">
        <span className="text-soft">{t.seo.otherSeasons}</span>
        {[-2, -1, 1, 2]
          .map((step) => shiftSeason(season, step))
          .map((option) => (
            <Link key={seasonPath(option)} href={seasonPath(option)} className="text-action-text hover:text-action-text-hover">
              {t.seasons[option.season]} {option.year}
            </Link>
          ))}
      </nav>
    </footer>
  );

  return (
    <div className="h-full lg:grid lg:grid-cols-[28rem_minmax(0,1fr)]">
      <Sidebar season={season} media={media} myCount={myCount} activeCount={activeCount} now={now} />

      <main className="h-full min-w-0 overflow-y-auto scrollbar-thin">
        <MobileHeader season={season} days={days} activeCount={activeCount} />
        <SeasonHeader season={season} summary={[data && count, weekLabel].filter(Boolean).join(" · ")} activeCount={activeCount} />

        {isError && buildError()}
        {!isError && !data && (
          <>
            {buildStripSkeleton()}
            {buildListSkeleton("lg:grid")}
            <div className="px-[2rem] pb-[2.4rem] font-mono text-[1.2rem] text-meta lg:px-[3.6rem]">{t.states.loading}</div>
          </>
        )}
        {data && visible.length === 0 && buildEmpty()}

        {data && visible.length > 0 && (
          <>
            {/* The mobile calendar has its own day tabs, so the strip only rides along with its list. */}
            <div className={view === "calendar" ? "hidden lg:block" : ""}>{hasWeek && now != null ? <TodayStrip day={today} now={now} /> : buildStripSkeleton()}</div>

            {view === "list" && (
              <div className="px-[1.6rem] pt-[1.4rem] pb-[3.2rem] flex flex-col gap-[1.2rem] lg:px-[3.6rem] lg:pt-[2rem] lg:pb-[4rem] lg:grid lg:grid-cols-2 lg:gap-[2rem]">
                {visible.map((item) => (
                  <MediaCard key={item.id} media={item} now={now} />
                ))}
              </div>
            )}

            {view === "calendar" && hasWeek && days && now != null && (
              <>
                <WeekCalendar days={days} now={now} />
                {agendaDay && <DayAgenda day={agendaDay} todayIndex={today.index} now={now} />}
              </>
            )}
            {view === "calendar" && !hasWeek && (
              <>
                {buildCalendarSkeleton()}
                {buildListSkeleton("lg:hidden")}
              </>
            )}
          </>
        )}

        {data && buildFooter()}
      </main>

      {now != null && <DetailPanel media={media} schedule={schedule} now={now} />}
      <FilterSheet media={media} visibleCount={visible.length} myCount={myCount} />
      <Toast />
    </div>
  );
}
