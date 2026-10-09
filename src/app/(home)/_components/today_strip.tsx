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
import { formatClock, formatCountdown, formatWeekday, pad2 } from "@/utils";
import { describeEntry, type WeekDay } from "../_utils/build_week";

export default function TodayStrip({ day, now }: { day: WeekDay; now: number }) {
  const lang = useLanguageController((state) => state.lang);
  const setDetailId = useSeasonController((state) => state.setDetailId);
  const { entries, setProgress } = useMyList();

  const t = TRANSLATIONS[lang];

  return (
    <div className="pt-[1.6rem] lg:px-[3.6rem] lg:pt-[2rem]">
      <div className="mb-[1rem] px-[2rem] flex items-baseline justify-between lg:mb-[1.2rem] lg:px-0">
        <span className="text-[1.6rem] font-bold lg:text-[1.8rem] lg:tracking-[-0.01em]">
          {t.schedule.today} · {formatWeekday(day.date, lang, { long: true })} {pad2(day.date.getDate())}
        </span>
        <span className="font-mono text-[1.1rem] text-meta lg:text-[1.2rem]">
          {day.entries.length} {t.schedule.episodes}
        </span>
      </div>

      <div className="px-[2rem] pb-[0.6rem] flex gap-[1rem] overflow-x-auto scrollbar-thin lg:px-0 lg:pb-[0.8rem]">
        {day.entries.map((entry) => {
          const info = describeEntry(entry, now, entries.get(entry.mediaId));

          return (
            <div
              key={entry.key}
              onClick={() => setDetailId(entry.mediaId)}
              className={`w-[21rem] shrink-0 p-[1rem] flex gap-[1rem] rounded-[0.8rem] border cursor-pointer transition-colors lg:w-[23.6rem]
                ${info.isOnList ? "border-action/60 bg-action/10" : "border-line bg-surface hover:border-line-strong"}`}
            >
              <Cover image={entry.media.coverImage} alt={info.title} isDimmed={info.isAired} className="w-[3.4rem] aspect-[2/3] rounded-[0.3rem] lg:w-[3.8rem]" />

              <div className="min-w-0 flex-1 flex flex-col gap-[0.3rem]">
                <span className={`font-mono text-[1.1rem] ${info.isAired ? "text-soft" : "text-lavender"}`}>
                  {formatClock(new Date(entry.at))} · {t.media.ep} {entry.episode}
                </span>
                <span className={`text-[1.3rem] font-semibold leading-[1.25] line-clamp-2 ${info.isAired ? "text-meta" : "text-title"}`}>{info.title}</span>

                <div className="mt-auto flex items-center justify-between gap-[0.6rem]">
                  <span className="font-mono text-[1rem] text-meta">{info.isAired ? t.media.aired : formatCountdown(entry.at - now, true)}</span>
                  {info.canMark && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setProgress(entry.mediaId, entry.episode, info.title);
                      }}
                      className="hidden px-[0.8rem] py-[0.3rem] rounded-full bg-action text-[1.1rem] font-semibold text-on-action hover:bg-action-hover lg:block"
                    >
                      {t.list.markShort}
                    </button>
                  )}
                  {info.isWatched && <span className="font-mono text-[1rem] text-action-text">{t.list.watchedShort}</span>}
                </div>
              </div>
            </div>
          );
        })}

        {day.entries.length === 0 && <span className="py-[0.8rem] font-mono text-[1.2rem] text-meta">{t.schedule.todayEmpty}</span>}
      </div>
    </div>
  );
}
