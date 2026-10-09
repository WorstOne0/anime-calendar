"use client";

// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController, type View } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS } from "@/core/models";

const VIEWS: View[] = ["list", "calendar"];

export default function ViewToggle() {
  const lang = useLanguageController((state) => state.lang);
  const view = useSeasonController((state) => state.view);
  const setView = useSeasonController((state) => state.setView);

  const t = TRANSLATIONS[lang];

  return (
    <div className="p-[0.3rem] flex gap-[0.2rem] rounded-full border border-line bg-surface">
      {VIEWS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={view === option}
          onClick={() => setView(option)}
          className={`h-[3.8rem] px-[1.2rem] rounded-full text-[1.3rem] font-semibold transition-colors lg:h-auto lg:px-[1.8rem] lg:py-[0.8rem]
            ${view === option ? "bg-action text-on-action" : "text-meta hover:text-title"}`}
        >
          {t.season[option]}
        </button>
      ))}
    </div>
  );
}
