"use client";

// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS, type MediaFormat } from "@/core/models";
// Hooks
import { useMyList } from "../_hooks/use_my_list";

// One removable chip per active filter value; the caller lays them out.
export default function ActiveChips() {
  const lang = useLanguageController((state) => state.lang);
  const filter = useSeasonController((state) => state.filter);
  const toggleFilter = useSeasonController((state) => state.toggleFilter);
  const setMine = useSeasonController((state) => state.setMine);
  const { isLoggedIn } = useMyList();

  const t = TRANSLATIONS[lang];
  const chips = [
    ...filter.formats.map((value) => ({ key: `formats_${value}`, label: t.formats[value as MediaFormat] ?? value, onRemove: () => toggleFilter("formats", value) })),
    ...filter.genres.map((value) => ({ key: `genres_${value}`, label: t.genres[value] ?? value, onRemove: () => toggleFilter("genres", value) })),
    ...filter.studios.map((value) => ({ key: `studios_${value}`, label: value, onRemove: () => toggleFilter("studios", value) })),
    ...filter.streams.map((value) => ({ key: `streams_${value}`, label: value, onRemove: () => toggleFilter("streams", value) })),
    ...(filter.mine && isLoggedIn ? [{ key: "mine", label: t.filters.mine, onRemove: () => setMine(false) }] : []),
  ];

  return (
    <>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="h-[3.6rem] shrink-0 pl-[1.2rem] pr-[1rem] flex items-center gap-[0.6rem] rounded-full bg-action/18 text-[1.2rem] font-semibold text-action-pale transition-colors hover:bg-action/28 lg:h-auto lg:py-[0.4rem] lg:pl-[1rem] lg:pr-[0.8rem]"
        >
          {chip.label}
          <span className="text-[1.4rem] leading-none text-action-text">×</span>
        </button>
      ))}
    </>
  );
}
