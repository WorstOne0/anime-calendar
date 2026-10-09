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
import { formatClock, formatCountdown, formatWeekday } from "@/utils";
import { describeEntry, type WeekDay } from "../_utils/build_week";

// Small-screen calendar: the day picked in MobileHeader's tabs, one row per episode.
export default function DayAgenda({ day, todayIndex, now }: { day: WeekDay; todayIndex: number; now: number }) {
  const lang = useLanguageController((state) => state.lang);
  const setDetailId = useSeasonController((state) => state.setDetailId);
  const { entries, setProgress } = useMyList();

  const t = TRANSLATIONS[lang];
  const title = day.isToday ? t.schedule.today : day.index === todayIndex + 1 ? t.schedule.tomorrow : formatWeekday(day.date, lang, { long: true });

  return (
    <div className="pb-[4rem] lg:hidden">
      <div className="px-[2rem] pt-[1.4rem] pb-[0.8rem] flex items-baseline justify-between">
        <span className="text-[2.2rem] font-bold tracking-[-0.02em]">{title}</span>
        <span className="font-mono text-[1.1rem] text-meta">
          {day.entries.length} {t.schedule.episodes}
        </span>
      </div>

      {day.entries.map((entry) => {
        const info = describeEntry(entry, now, entries.get(entry.mediaId));

        return (
          <div
            key={entry.key}
            onClick={() => setDetailId(entry.mediaId)}
            className={`px-[2rem] py-[1.2rem] grid grid-cols-[6.2rem_4.4rem_minmax(0,1fr)] items-center gap-[1.2rem] border-b border-line-faint cursor-pointer ${info.isOnList ? "bg-action/7" : ""}`}
          >
            <span className={`font-mono text-[1.3rem] ${info.isAired ? "text-soft" : "text-lavender"}`}>{formatClock(new Date(entry.at))}</span>
            <Cover
              image={entry.media.coverImage}
              alt={info.title}
              isDimmed={info.isAired}
              className={`w-[4.4rem] aspect-[2/3] rounded-[0.3rem] ${info.isOnList ? "outline-2 outline-offset-1 outline-action" : ""}`}
            />

            <div className="min-w-0 flex flex-col gap-[0.4rem]">
              <span className={`text-[1.4rem] font-semibold leading-[1.25] line-clamp-2 ${info.isAired ? "text-meta" : "text-title"}`}>{info.title}</span>
              <div className="flex items-center justify-between gap-[0.8rem]">
                <span className="font-mono text-[1.1rem] text-meta">
                  {t.media.ep} {entry.episode} · {info.isAired ? t.media.aired : formatCountdown(entry.at - now, true)}
                </span>
                {info.canMark && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setProgress(entry.mediaId, entry.episode, info.title);
                    }}
                    className="h-[3rem] shrink-0 px-[1rem] rounded-full bg-action text-[1.1rem] font-semibold text-on-action"
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

      {day.entries.length === 0 && <div className="px-[2rem] py-[2.4rem] font-mono text-[1.2rem] text-meta">{t.schedule.dayEmpty}</div>}
    </div>
  );
}
