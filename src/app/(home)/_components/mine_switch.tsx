"use client";

// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS } from "@/core/models";
// Hooks
import { useMyList } from "../_hooks/use_my_list";

// Logged out, the switch is the way in: it starts the AniList login.
export default function MineSwitch({ myCount }: { myCount: number }) {
  const lang = useLanguageController((state) => state.lang);
  const isMine = useSeasonController((state) => state.filter.mine);
  const setMine = useSeasonController((state) => state.setMine);
  const { isLoggedIn, login } = useMyList();

  const t = TRANSLATIONS[lang];
  const isOn = isMine && isLoggedIn;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={() => (isLoggedIn ? setMine(!isMine) : login())}
      className={`min-h-[5.2rem] w-full pt-[1.2rem] flex items-center justify-between gap-[1.2rem] border-t border-line text-left lg:min-h-0 lg:pt-[1.6rem] ${isLoggedIn ? "" : "opacity-70"}`}
    >
      <span className="flex flex-col gap-[0.3rem]">
        <span className="text-[1.5rem] font-semibold lg:text-[1.4rem]">{t.filters.mine}</span>
        <span className="font-mono text-[1.1rem] text-meta">{isLoggedIn ? `${myCount} ${t.filters.onList}` : t.filters.mineLocked}</span>
      </span>

      <span className={`h-[2.2rem] w-[3.8rem] shrink-0 relative rounded-full transition-colors ${isOn ? "bg-action" : "bg-line-strong"}`}>
        <span className={`h-[1.6rem] w-[1.6rem] absolute top-[0.3rem] rounded-full bg-title transition-[left] ${isOn ? "left-[1.9rem]" : "left-[0.3rem]"}`} />
      </span>
    </button>
  );
}
