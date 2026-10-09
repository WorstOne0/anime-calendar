"use client";

// Next
import { useEffect } from "react";
// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS } from "@/core/models";

export default function Toast() {
  const lang = useLanguageController((state) => state.lang);
  const toast = useSeasonController((state) => state.toast);
  const setToast = useSeasonController((state) => state.setToast);

  // Stays up while a sync is in flight, then leaves on its own.
  useEffect(() => {
    if (!toast || toast.state === "syncing") return;

    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  if (!toast) return null;

  const t = TRANSLATIONS[lang];
  const progress = toast.state && { syncing: t.list.syncing, synced: t.list.synced, failed: t.list.failed }[toast.state];

  return (
    <div
      role="status"
      className="px-[1.6rem] py-[1.2rem] flex flex-col gap-[0.3rem] fixed inset-x-[1.6rem] bottom-[2.4rem] z-50 rounded-[1.2rem] bg-title text-background shadow-[0_1.2rem_3rem_rgb(0_0_0/0.4)]
        lg:px-[1.8rem] lg:inset-x-auto lg:left-1/2 lg:bottom-[2.8rem] lg:-translate-x-1/2 lg:flex-row lg:items-center lg:gap-[1.4rem] lg:rounded-card"
    >
      <span className="min-w-0 flex gap-[0.4rem] text-[1.3rem] font-semibold">
        {toast.title && <span className="max-w-[24rem] truncate">{toast.title}</span>}
        <span className="shrink-0">{toast.text}</span>
      </span>
      {progress && <span className="font-mono text-[1.1rem] text-muted">{progress}</span>}
    </div>
  );
}
