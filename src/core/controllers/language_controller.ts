// Next
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// Models
import type { Lang } from "@/core/models";

type LanguageController = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const useLanguageController = create<LanguageController>()(
  persist(
    (set) => ({
      lang: "pt",
      setLang: (lang) => set({ lang }),
    }),
    {
      name: "anime_lang",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
