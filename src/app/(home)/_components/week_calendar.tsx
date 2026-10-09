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

// Desktop week, one column per day. DayAgenda is the small-screen calendar.
export default function WeekCalendar({ days, now }: { days: WeekDay[]; now: number }) {
  const lang = useLanguageController((state) => state.lang);
  const setDetailId = useSeasonController((state) => state.setDetailId);
  const { entries, setProgress } = useMyList();

  const t = TRANSLATIONS[lang];

  return (
    <div className="hidden px-[3.6rem] pt-[2rem] pb-[6rem] lg:grid grid-cols-7">
      {days.map((day) => (
        <div key={day.index} className={`min-w-0 px-[1rem] pb-[2.4rem] border-l border-line ${day.isToday ? "bg-action/5" : ""}`}>
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
                className={`mt-[0.8rem] -mx-[0.8rem] px-[0.8rem] py-[1rem] flex flex-col gap-[0.8rem] rounded-control border cursor-pointer transition-colors
                  ${info.isOnList ? "border-action/60 bg-action/10" : "border-line bg-surface hover:border-line-strong"}`}
              >
                <div className="flex justify-between font-mono text-[1.2rem]">
                  <span className={info.isAired ? "text-soft" : "text-lavender"}>{formatClock(new Date(entry.at))}</span>
                  <span className="text-soft">
                    {t.media.ep} {entry.episode}
                  </span>
                </div>

                <div className="flex items-start gap-[1rem]">
                  <Cover image={entry.media.coverImage} alt={info.title} isDimmed={info.isAired} className="w-[3.2rem] aspect-[2/3] rounded-[0.3rem]" />
                  <span className={`min-w-0 text-[1.3rem] font-semibold leading-[1.3] line-clamp-3 ${info.isAired ? "text-meta" : "text-title"}`}>{info.title}</span>
                </div>

                {info.canMark && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setProgress(entry.mediaId, entry.episode, info.title);
                    }}
                    className="px-[0.8rem] py-[0.4rem] rounded-full bg-action text-[1.1rem] font-semibold text-on-action hover:bg-action-hover"
                  >
                    {t.list.markShort}
                  </button>
                )}
                {info.isWatched && <span className="font-mono text-[1rem] text-action-text">{t.list.watchedShort}</span>}
              </div>
            );
          })}

          {day.entries.length === 0 && <div className="py-[1.2rem] font-mono text-[1.1rem] text-soft">—</div>}
        </div>
      ))}
    </div>
  );
}
