"use client";

// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS, type Media } from "@/core/models";
// Components
import FilterGroups from "./filter_groups";
import MineSwitch from "./mine_switch";

// Small-screen filters: a bottom sheet over the list. The desktop sidebar holds the same groups.
export default function FilterSheet({ media, visibleCount, myCount }: { media: Media[]; visibleCount: number; myCount: number }) {
  const lang = useLanguageController((state) => state.lang);
  const isSheetOpen = useSeasonController((state) => state.isSheetOpen);
  const setIsSheetOpen = useSeasonController((state) => state.setIsSheetOpen);
  const resetFilter = useSeasonController((state) => state.resetFilter);

  const t = TRANSLATIONS[lang];

  if (!isSheetOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end lg:hidden">
      <div onClick={() => setIsSheetOpen(false)} className="absolute inset-0 bg-black/60" />

      <div className="relative max-h-[84%] min-h-0 flex flex-col rounded-t-[2rem] border-t border-edge bg-panel">
        <div className="pt-[1rem] flex justify-center">
          <span className="h-[0.4rem] w-[4rem] rounded-[0.2rem] bg-line-strong" />
        </div>

        <div className="px-[2rem] py-[1rem] flex items-center justify-between">
          <span className="text-[1.8rem] font-bold">{t.filters.title}</span>
          <button type="button" onClick={resetFilter} className="py-[1rem] font-mono text-[1.2rem] text-action-text">
            {t.filters.clearShort}
          </button>
        </div>

        <div className="min-h-0 flex-1 px-[2rem] pt-[0.4rem] pb-[1.6rem] flex flex-col gap-[2.2rem] overflow-y-auto">
          <FilterGroups media={media} />
          <MineSwitch myCount={myCount} />
        </div>

        <div className="px-[2rem] pt-[1.2rem] pb-[2.4rem] border-t border-line">
          <button type="button" onClick={() => setIsSheetOpen(false)} className="h-[5rem] w-full rounded-[1.2rem] bg-action text-[1.5rem] font-bold text-on-action">
            {t.filters.show} {visibleCount} {t.season.titles}
          </button>
        </div>
      </div>
    </div>
  );
}
