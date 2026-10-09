"use client";

// Controllers
import { useLanguageController } from "@/core/controllers";

const OPTION = "px-[0.3rem] py-[0.8rem] uppercase transition-colors lg:px-[0.2rem] lg:py-[0.6rem]";

export default function LangToggle() {
  const lang = useLanguageController((state) => state.lang);
  const setLang = useLanguageController((state) => state.setLang);

  return (
    <div className="flex items-center gap-[0.4rem] font-mono text-[1.2rem] text-muted lg:gap-[0.6rem]">
      <button type="button" onClick={() => setLang("pt")} className={`${OPTION} ${lang === "pt" ? "text-title" : "text-soft hover:text-body"}`}>
        pt
      </button>
      <span>/</span>
      <button type="button" onClick={() => setLang("en")} className={`${OPTION} ${lang === "en" ? "text-title" : "text-soft hover:text-body"}`}>
        en
      </button>
    </div>
  );
}
