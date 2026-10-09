"use client";

// Next
import { useEffect } from "react";
// Controllers
import { useLanguageController, useSessionController } from "@/core/controllers";

// Client-only providers, so the root layout stays a server component that can export metadata.
export default function Providers({ children }: { children: React.ReactNode }) {
  const lang = useLanguageController((state) => state.lang);

  useEffect(() => {
    useLanguageController.persist.rehydrate();
    useSessionController.persist.rehydrate();
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  return children;
}
