"use client";

// Next
import { useEffect, useMemo } from "react";
// Controllers
import { useLanguageController, useSessionController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS, type ListEntry, type Viewer } from "@/core/models";
// Services
import { ANILIST_LOGIN_URL, AniListError, LIST_QUERY, SAVE_ENTRY_MUTATION, VIEWER_QUERY, anilist } from "@/services";
// Hooks
import { useAniList } from "@/hooks";

type ListCollection = { MediaListCollection: { lists: { entries: ListEntry[] }[] } };

// The viewer's AniList list keyed by media id, and the writes that change it.
export const useMyList = () => {
  const lang = useLanguageController((state) => state.lang);
  const token = useSessionController((state) => state.token);
  const setToken = useSessionController((state) => state.setToken);
  const setToast = useSeasonController((state) => state.setToast);

  const { data: viewerData, error: viewerError } = useAniList<{ Viewer: Viewer }>(token ? VIEWER_QUERY : null, {}, { token });
  const viewer = viewerData?.Viewer ?? null;
  const { data: listData, refresh } = useAniList<ListCollection>(viewer ? LIST_QUERY : null, { userId: viewer?.id }, { token });

  const t = TRANSLATIONS[lang];
  const entries = useMemo(
    () => new Map((listData?.MediaListCollection.lists ?? []).flatMap((list) => list.entries).map((entry) => [entry.mediaId, entry])),
    [listData]
  );

  // An expired or revoked token answers 400/401. A rate limit or a dropped connection keeps the session.
  useEffect(() => {
    if (viewerError instanceof AniListError && [400, 401].includes(viewerError.status)) setToken(null);
  }, [viewerError, setToken]);

  const login = () => {
    if (!ANILIST_LOGIN_URL) return setToast({ text: t.account.unavailable });
    window.location.assign(ANILIST_LOGIN_URL);
  };

  const save = async (variables: { mediaId: number; progress: number; status?: string }, title: string, text: string) => {
    setToast({ title, text, state: "syncing" });

    try {
      await anilist(SAVE_ENTRY_MUTATION, variables, token);
      await refresh();
      setToast({ title, text, state: "synced" });
    } catch {
      setToast({ title, text, state: "failed" });
    }
  };

  // Marking a planned show moves it to watching, as AniList's own site does.
  const setProgress = (mediaId: number, progress: number, title: string) =>
    save({ mediaId, progress, status: entries.get(mediaId)?.status === "PLANNING" ? "CURRENT" : undefined }, title, `· Ep ${progress} ${t.list.marked}`);

  const addToList = (mediaId: number, title: string) => save({ mediaId, progress: 0, status: "CURRENT" }, title, t.list.added);

  return { isLoggedIn: !!token, viewer, entries, login, logout: () => setToken(null), setProgress, addToList };
};
