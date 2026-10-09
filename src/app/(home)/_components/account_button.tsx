/* eslint-disable @next/next/no-img-element */
"use client";

// Controllers
import { useLanguageController } from "@/core/controllers";
// Models
import { TRANSLATIONS } from "@/core/models";
// Hooks
import { useMyList } from "../_hooks/use_my_list";

export default function AccountButton() {
  const lang = useLanguageController((state) => state.lang);
  const { isLoggedIn, viewer, login, logout } = useMyList();

  const t = TRANSLATIONS[lang];

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        onClick={login}
        className="h-[3.6rem] px-[1.4rem] rounded-full bg-action text-[1.3rem] font-semibold text-on-action transition-colors hover:bg-action-hover lg:h-auto lg:px-[1.6rem] lg:py-[1rem]"
      >
        <span className="lg:hidden">{t.account.loginShort}</span>
        <span className="hidden lg:inline">{t.account.login}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-[0.8rem] lg:gap-[1rem]">
      {/* The Kuuhaku blue-to-violet ring; it fills the circle until AniList sends the avatar. */}
      <span className="h-[3.2rem] w-[3.2rem] shrink-0 p-[0.2rem] flex items-center justify-center rounded-full bg-linear-135 from-action to-accent text-[1.4rem] font-bold text-on-action">
        {viewer?.avatar?.medium ? <img src={viewer.avatar.medium} alt="" className="h-full w-full rounded-full object-cover" /> : viewer?.name.charAt(0).toUpperCase()}
      </span>
      <span className="hidden lg:inline text-[1.3rem] font-semibold">{viewer?.name}</span>
      <button type="button" onClick={logout} className="p-[0.4rem] font-mono text-[1.1rem] text-meta hover:text-title">
        {t.account.logout}
      </button>
    </div>
  );
}
