"use client";

// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS } from "@/core/models";
// Hooks
import { useMyList } from "../_hooks/use_my_list";
// Components
import { Cover } from "@/components";
// Utils
import { formatClock, formatWeekday, pad2 } from "@/utils";
import { describeEntry, type WeekDay } from "../_utils/build_week";

// Desktop week, one column per day; DayAgenda is the small-screen calendar. Cards share one height (a fixed
// header row, a three-line title box) so rows line up across days; season_view.tsx's skeleton copies it.
export default function WeekCalendar({ days, now }: { days: WeekDay[]; now: number }) {
  const lang = useLanguageController((state) => state.lang);
  const setDetailId = useSeasonController((state) => state.setDetailId);
  const { entries, setProgress } = useMyList();

  const t = TRANSLATIONS[lang];

  return (
    <div className="hidden px-[3.6rem] pt-[2rem] pb-[6rem] lg:grid grid-cols-7">
      {days.map((day) => (
        <div key={day.index} className={`min-w-0 px-[0.6rem] pb-[2.4rem] border-l border-line ${day.isToday ? "bg-action/5" : ""}`}>
          <div className={`pt-[1.4rem] pb-[1.2rem] flex items-baseline justify-between border-b-2 ${day.isToday ? "border-action text-action-text" : "border-line text-title"}`}>
            <span className="text-[1.5rem] font-bold">{formatWeekday(day.date, lang)}</span>
            <span className="font-mono text-[1.3rem]">{pad2(day.date.getDate())}</span>
          </div>

          {day.entries.map((entry) => {
            const info = describeEntry(entry, now, entries.get(entry.mediaId));

            return (
              <div
                key={entry.key}
                onClick={() => setDetailId(entry.mediaId)}
                className={`mt-[0.8rem] px-[0.8rem] py-[1rem] flex flex-col gap-[0.8rem] rounded-control border cursor-pointer transition-colors
                  ${info.isOnList ? "border-action/60 bg-action/10" : "border-line bg-surface hover:border-line-strong"}`}
              >
                <div className="h-[1.6rem] flex items-center justify-between gap-[0.6rem] font-mono text-[1.2rem]">
                  <span className={info.isAired ? "text-soft" : "text-lavender"}>{formatClock(new Date(entry.at))}</span>
                  <span className="min-w-0 flex items-center gap-[0.6rem] text-soft">
                    <span className="truncate">
                      {t.media.ep} {entry.episode}
                    </span>
                    {/* The list's mark-watched, as a checkbox in the header row so it costs the card no height. */}
                    {info.isOnList && info.isAired && (
                      <button
                        type="button"
                        title={info.isWatched ? t.list.watchedShort : t.list.markShort}
                        aria-label={info.isWatched ? t.list.watchedShort : t.list.markShort}
                        aria-pressed={info.isWatched}
                        onClick={(event) => {
                          event.stopPropagation();
                          setProgress(entry.mediaId, info.isWatched ? entry.episode - 1 : entry.episode, info.title);
                        }}
                        className={`h-[1.6rem] w-[1.6rem] shrink-0 flex items-center justify-center rounded-[0.4rem] border-[1.5px] font-sans text-[1rem] leading-none transition-colors
                          ${info.isWatched ? "border-action bg-action text-on-action" : "border-muted hover:border-action-text"}`}
                      >
                        {info.isWatched && "✓"}
                      </button>
                    )}
                  </span>
                </div>

                <div className="flex items-start gap-[0.8rem]">
                  <Cover image={entry.media.coverImage} alt={info.title} isDimmed={info.isAired} className="w-[3.2rem] aspect-[2/3] rounded-[0.3rem]" />
                  <span className={`h-[5.1rem] min-w-0 text-[1.3rem] font-semibold leading-[1.7rem] line-clamp-3 ${info.isAired ? "text-meta" : "text-title"}`}>{info.title}</span>
                </div>
              </div>
            );
          })}

          {day.entries.length === 0 && <div className="py-[1.2rem] font-mono text-[1.1rem] text-soft">—</div>}
        </div>
      ))}
    </div>
  );
}
