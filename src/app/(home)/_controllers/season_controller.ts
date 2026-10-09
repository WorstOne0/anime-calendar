// Next
import { create } from "zustand";

export type View = "list" | "calendar";
export type FilterGroup = "formats" | "genres" | "studios" | "streams";
export type Filter = Record<FilterGroup, string[]> & { mine: boolean };
// No state is a plain notice; a sync shows its progress under the text.
export type Toast = { title?: string; text: string; state?: "syncing" | "synced" | "failed" };

export const DEFAULT_FILTER: Filter = { formats: [], genres: [], studios: [], streams: [], mine: false };

// The season itself is the route (/temporada/outono-2026); this is what the screen does with it.
type SeasonController = {
  filter: Filter;
  view: View;
  // Null follows today; the mobile calendar's tabs set it.
  selectedDay: number | null;
  detailId: number | null;
  isSheetOpen: boolean;
  toast: Toast | null;
  //
  toggleFilter: (group: FilterGroup, value: string) => void;
  setMine: (mine: boolean) => void;
  resetFilter: () => void;
  setView: (view: View) => void;
  setSelectedDay: (selectedDay: number) => void;
  setDetailId: (detailId: number | null) => void;
  setIsSheetOpen: (isSheetOpen: boolean) => void;
  setToast: (toast: Toast | null) => void;
};

export const useSeasonController = create<SeasonController>((set) => ({
  filter: DEFAULT_FILTER,
  view: "list",
  selectedDay: null,
  detailId: null,
  isSheetOpen: false,
  toast: null,
  //
  toggleFilter: (group, value) =>
    set((state) => {
      const current = state.filter[group];
      return { filter: { ...state.filter, [group]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] } };
    }),
  setMine: (mine) => set((state) => ({ filter: { ...state.filter, mine } })),
  resetFilter: () => set({ filter: DEFAULT_FILTER }),
  setView: (view) => set({ view }),
  setSelectedDay: (selectedDay) => set({ selectedDay }),
  setDetailId: (detailId) => set({ detailId, isSheetOpen: false }),
  setIsSheetOpen: (isSheetOpen) => set({ isSheetOpen }),
  setToast: (toast) => set({ toast }),
}));
