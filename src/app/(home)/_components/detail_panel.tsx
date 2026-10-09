"use client";

// Next
import { useEffect } from "react";
// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS, mediaTitles, type AiringSchedule, type Media, type MediaDetail } from "@/core/models";
// Services
import { MEDIA_QUERY } from "@/services";
// Hooks
import { useAniList } from "@/hooks";
import { useMyList } from "../_hooks/use_my_list";
// Components
import { AnimeDetail } from "@/components";

// Desktop: a drawer over the season. Small screens: a full-screen page with a back button.
export default function DetailPanel({ media, schedule, now }: { media: Media[]; schedule: AiringSchedule[]; now: number }) {
  const lang = useLanguageController((state) => state.lang);
  const detailId = useSeasonController((state) => state.detailId);
  const setDetailId = useSeasonController((state) => state.setDetailId);
  const { isLoggedIn, entries, setProgress, addToList } = useMyList();

  const { data, error } = useAniList<{ Media: MediaDetail }>(detailId ? MEDIA_QUERY : null, { id: detailId });

  useEffect(() => {
    if (!detailId) return;

    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setDetailId(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [detailId, setDetailId]);

  if (!detailId) return null;

  const t = TRANSLATIONS[lang];
  const full = data?.Media.id === detailId ? data.Media : null;
  const scheduled = schedule.find((item) => item.media?.id === detailId)?.media;
  // Until the full record arrives, show what the season list or the week already knows about it.
  const base: Media | null =
    full ??
    media.find((item) => item.id === detailId) ??
    (scheduled
      ? {
          ...scheduled,
          siteUrl: `https://anilist.co/anime/${scheduled.id}`,
          status: "RELEASING",
          format: null,
          episodes: null,
          duration: null,
          genres: [],
          averageScore: null,
          description: null,
          studios: null,
          nextAiringEpisode: null,
          externalLinks: null,
        }
      : null);

  const buildShell = (children: React.ReactNode) => (
    <div className="fixed inset-0 z-40">
      <div onClick={() => setDetailId(null)} className="hidden absolute inset-0 bg-black/60 lg:block" />
      <aside
        key={detailId}
        className="absolute inset-0 bg-panel overflow-y-auto scrollbar-thin lg:left-auto lg:w-[56rem] lg:border-l lg:border-edge lg:shadow-[-3rem_0_6rem_rgb(0_0_0/0.4)]"
      >
        {children}
      </aside>
    </div>
  );

  if (!base) {
    return buildShell(
      <div className="h-full p-[3.2rem] flex flex-col items-start justify-center gap-[1.2rem]">
        <span className="font-mono text-[1.2rem] text-meta">{error ? t.detail.episodesFailed : t.detail.loadingEpisodes}</span>
        <button type="button" onClick={() => setDetailId(null)} className="font-mono text-[1.2rem] text-action-text">
          ‹ {t.detail.back}
        </button>
      </div>
    );
  }

  const entry = entries.get(base.id);
  const { title } = mediaTitles(base.title);

  return buildShell(
    <AnimeDetail
      media={base}
      full={full}
      now={now}
      episodesStatus={full ? "ready" : error ? "failed" : "loading"}
      entry={entry}
      canAdd={isLoggedIn && !entry}
      onProgress={(progress) => setProgress(base.id, progress, title)}
      onAdd={() => addToList(base.id, title)}
      onOpen={setDetailId}
      bannerActions={
        <>
          <button
            type="button"
            onClick={() => setDetailId(null)}
            className="h-[4rem] px-[1.4rem] absolute top-[1.2rem] left-[1.2rem] rounded-full bg-black/80 text-[1.4rem] font-semibold lg:hidden"
          >
            ‹ {t.detail.back}
          </button>
          <button
            type="button"
            aria-label={t.detail.close}
            onClick={() => setDetailId(null)}
            className="hidden h-[3.6rem] w-[3.6rem] absolute top-[1.6rem] right-[1.6rem] items-center justify-center rounded-full bg-black/75 text-[2rem] leading-none lg:flex"
          >
            ×
          </button>
        </>
      }
    />
  );
}
