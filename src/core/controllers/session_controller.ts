// Next
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// The AniList access token. Who it belongs to and their list are server data, fetched with it.
type SessionController = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const useSessionController = create<SessionController>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: "anime_session",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
