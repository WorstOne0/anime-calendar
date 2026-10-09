/* eslint-disable @next/next/no-img-element */
"use client";

// Next
import Link from "next/link";
// Controllers
import { useLanguageController } from "@/core/controllers";
// Models
import { TRANSLATIONS, animePath, mediaTitles, type ListEntry, type Media, type MediaDetail } from "@/core/models";
// Components
import Cover from "../cover";
// Utils
import { describeMedia, formatClock, formatCountdown, formatDay, formatMonth, formatWeekday, timeZoneLabel, zoneOf } from "@/utils";

const ACTION = "rounded-card bg-action text-[1.4rem] font-semibold text-on-action transition-colors hover:bg-action-hover lg:rounded-full lg:text-[1.3rem]";

// Everything about one anime, for the season's drawer and the /anime page. `full` adds the episodes, trailer
// and relations once loaded; list actions only show when their handlers are passed.
export default function AnimeDetail({
  media,
  full,
  now,
  episodesStatus,
  entry,
  canAdd = false,
  isPage = false,
  onProgress,
  onAdd,
  onOpen,
  bannerActions,
}: {
  media: Media;
  full: MediaDetail | null;
  now: number | null;
  episodesStatus: "loading" | "failed" | "ready";
  entry?: ListEntry;
  canAdd?: boolean;
  isPage?: boolean;
  onProgress?: (progress: number) => void;
  onAdd?: () => void;
  onOpen?: (id: number) => void;
  bannerActions?: React.ReactNode;
}) {
  const lang = useLanguageController((state) => state.lang);

  const t = TRANSLATIONS[lang];
  const info = describeMedia(media, { t, lang, now, entry });
  const zone = zoneOf(now);
  const zoneLabel = timeZoneLabel(now).short;
  const banner = media.bannerImage ?? media.coverImage?.extraLarge ?? media.coverImage?.large;
  const episodes = [...(full?.airingSchedule?.nodes ?? [])].sort((a, b) => a.episode - b.episode);
  const relations = (full?.relations?.edges ?? []).filter((edge) => edge.node?.type === "ANIME" && t.relations[edge.relationType]).slice(0, 6);
  const trailer = full?.trailer?.site === "youtube" ? full.trailer : null;
  const Title = isPage ? "h1" : "h2";

  const buildStat = (label: string, value: React.ReactNode) => (
    <div className="px-[1.4rem] py-[1.2rem] flex flex-col gap-[0.4rem] bg-panel">
      <span className="font-mono text-[1rem] uppercase tracking-[0.08em] text-meta">{label}</span>
      {value}
    </div>
  );

  return (
    <>
      <div className={`h-[20rem] relative lg:h-[21rem] ${banner ? "" : "stripes"}`} style={{ backgroundColor: media.coverImage?.color ?? undefined }}>
        {banner && <img src={banner} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-linear-to-b from-panel/30 via-panel/50 to-panel" />
        {bannerActions}
      </div>

      <div className="-mt-[6.4rem] relative px-[2rem] pb-[4rem] flex flex-col gap-[2rem] lg:-mt-[8.4rem] lg:px-[3.2rem] lg:gap-[2.4rem]">
        <div className="flex items-end gap-[1.4rem] lg:gap-[2rem]">
          <Cover image={media.coverImage} alt={info.title} isLarge className="w-[9.2rem] aspect-[2/3] rounded-control shadow-[0_1rem_3rem_rgb(0_0_0/0.5)] lg:w-[12rem]" />
          <div className="min-w-0 pb-[0.4rem] flex flex-col gap-[0.4rem] lg:gap-[0.6rem]">
            <span className="font-mono text-[1rem] uppercase text-meta lg:text-[1.1rem] lg:tracking-[0.05em]">
              {info.format} · {info.length}
            </span>
            <Title className="text-[2.1rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-pretty lg:text-[2.6rem] lg:leading-[1.1]">{info.title}</Title>
            {info.subtitle && <span className="text-[1.3rem] text-meta lg:text-[1.4rem]">{info.subtitle}</span>}
            {full?.title.native && <span className="hidden text-[1.3rem] text-soft lg:block">{full.title.native}</span>}
          </div>
        </div>

        {/* Desktop: three stats in a ruled strip. Small screens: next episode against score. */}
        <div className="hidden grid-cols-3 gap-px rounded-card overflow-hidden border border-line bg-line lg:grid">
          {buildStat(t.detail.studio, <span className="text-[1.4rem] font-semibold">{info.studio}</span>)}
          {buildStat(t.detail.score, <span className="text-[1.4rem] font-semibold">{info.score}</span>)}
          {buildStat(t.detail.nextEpisode, <span className={`font-mono text-[1.4rem] ${info.hasNext ? "text-lavender" : "text-meta"}`}>{info.countdown}</span>)}
        </div>
        {info.hasNext && (
          <span className="hidden -mt-[1.2rem] font-mono text-[1.2rem] text-body lg:block">
            {info.nextLine} · {zoneLabel}
          </span>
        )}
        <div className="px-[1.6rem] py-[1.4rem] flex justify-between gap-[1.2rem] rounded-card border border-line bg-surface lg:hidden">
          <div className="flex flex-col gap-[0.3rem]">
            <span className="font-mono text-[1rem] uppercase text-meta">{t.detail.nextEpisode}</span>
            <span className={`font-mono text-[1.7rem] ${info.hasNext ? "text-lavender" : "text-meta"}`}>{info.countdown}</span>
            {info.hasNext && (
              <span className="font-mono text-[1.1rem] text-body">
                {info.hasCountdown ? info.nextLine : zoneLabel}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end gap-[0.3rem] text-right">
            <span className="font-mono text-[1rem] uppercase text-meta">{t.detail.score}</span>
            <span className="text-[1.7rem] font-bold">{info.score}</span>
            <span className="text-[1.1rem] text-body">{info.studio}</span>
          </div>
        </div>

        {info.isOnList && (
          <div className="p-[1.4rem] flex flex-col gap-[1rem] rounded-card border border-action/40 bg-action/10 lg:p-[1.6rem] lg:flex-row lg:items-center lg:gap-[1.6rem]">
            <div className="min-w-0 flex-1 flex flex-col gap-[0.8rem]">
              <div className="flex justify-between gap-[0.8rem] font-mono text-[1.1rem] lg:text-[1.2rem]">
                <span>{info.progressLabel}</span>
                <span className={info.behind > 0 ? "text-action-text" : "text-meta"}>{info.behindLabel}</span>
              </div>
              <div className="h-[0.5rem] rounded-[0.3rem] bg-track overflow-hidden">
                <div className="h-full bg-linear-to-r from-action to-accent" style={{ width: info.progressWidth }} />
              </div>
            </div>
            {info.behind > 0 && onProgress && (
              <button type="button" onClick={() => onProgress(info.watched + 1)} className={`h-[4.4rem] shrink-0 lg:h-auto lg:px-[1.4rem] lg:py-[0.9rem] ${ACTION}`}>
                {info.markLabel}
              </button>
            )}
          </div>
        )}
        {canAdd && onAdd && (
          <button type="button" onClick={onAdd} className={`h-[4.4rem] lg:self-start lg:h-auto lg:px-[1.6rem] lg:py-[1rem] ${ACTION}`}>
            + {t.list.add}
          </button>
        )}

        {info.genres.length > 0 && (
          <div className="flex flex-wrap gap-[0.6rem]">
            {info.genres.map((genre) => (
              <span key={genre} className="px-[1rem] py-[0.4rem] rounded-full bg-surface-2 text-[1.2rem] text-body">
                {genre}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-[0.8rem]">
          <span className="hidden label lg:block">{t.detail.synopsis}</span>
          <p className="text-[1.4rem] leading-[1.6] text-body text-pretty lg:leading-[1.65]">{info.synopsis}</p>
        </div>

        <div className="flex flex-col gap-[1rem]">
          <span className="label">{t.detail.where}</span>
          {info.streams.length > 0 ? (
            <div className="flex flex-wrap gap-[0.8rem]">
              {info.streams.map((stream) => (
                <a
                  key={stream.name}
                  href={stream.url}
                  target="_blank"
                  rel="noopener"
                  className="h-[4.4rem] px-[1.4rem] flex items-center rounded-card border border-line-strong text-[1.4rem] font-semibold transition-colors hover:border-soft lg:h-auto lg:py-[0.8rem] lg:rounded-[0.8rem] lg:text-[1.3rem]"
                >
                  {stream.name} ↗
                </a>
              ))}
            </div>
          ) : (
            <span className="text-[1.3rem] text-meta">{t.detail.noStream}</span>
          )}
          <span className="hidden font-mono text-[1.1rem] text-soft lg:block">{t.filters.streamNote}</span>
        </div>

        {trailer && (
          <a href={`https://www.youtube.com/watch?v=${trailer.id}`} target="_blank" rel="noopener" className="relative block aspect-video rounded-card overflow-hidden bg-surface">
            <img src={trailer.thumbnail ?? `https://i.ytimg.com/vi/${trailer.id}/hqdefault.jpg`} alt={`${t.detail.trailer}: ${info.title}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/35" />
            <span className="px-[1.4rem] py-[0.8rem] absolute left-[1.2rem] bottom-[1.2rem] rounded-full bg-black/85 text-[1.3rem] font-semibold lg:left-[1.6rem] lg:bottom-[1.4rem]">
              ▶ {t.detail.trailer}
            </span>
          </a>
        )}

        <div className="flex flex-col">
          <span className="pb-[0.6rem] label lg:pb-[0.8rem]">
            {t.detail.episodes} · {zoneLabel}
          </span>
          {episodesStatus === "loading" && <span className="py-[1rem] font-mono text-[1.2rem] text-meta">{t.detail.loadingEpisodes}</span>}
          {episodesStatus !== "loading" && episodes.length === 0 && (
            <span className="py-[1rem] font-mono text-[1.2rem] text-meta">{episodesStatus === "failed" ? t.detail.episodesFailed : t.detail.noEpisodes}</span>
          )}
          {episodes.map((episode) => {
            const date = new Date(episode.airingAt * 1000);
            const isAired = now != null && date.getTime() <= now;
            const isDone = !!entry && entry.progress >= episode.episode;
            const canCheck = !!entry && isAired && !!onProgress;

            return (
              <div
                key={episode.episode}
                className="min-h-[4.8rem] py-[1rem] grid grid-cols-[2.4rem_4.8rem_minmax(0,1fr)] items-center gap-[1rem] border-t border-line-faint lg:min-h-0 lg:grid-cols-[2.4rem_5.6rem_minmax(0,1fr)_auto] lg:gap-[1.2rem]"
              >
                <button
                  type="button"
                  disabled={!canCheck}
                  aria-label={`${t.media.ep} ${episode.episode}`}
                  onClick={() => onProgress?.(isDone ? episode.episode - 1 : episode.episode)}
                  className={`h-[2.2rem] w-[2.2rem] flex items-center justify-center rounded-control border-[1.5px] text-[1.2rem] text-on-action
                    ${isDone ? "border-action bg-action" : canCheck ? "border-muted" : "border-edge"} ${!entry ? "invisible" : canCheck ? "" : "opacity-40"}`}
                >
                  {isDone && "✓"}
                </button>
                <span className={`font-mono text-[1.2rem] lg:text-[1.3rem] ${isAired || now == null ? "text-title" : "text-meta"}`}>
                  {t.media.ep} {episode.episode}
                </span>
                {/* One flex cell under lg; from lg its two spans become the grid's last two columns. */}
                <div className="min-w-0 flex justify-between gap-[0.8rem] lg:contents">
                  <time dateTime={date.toISOString()} className="text-[1.2rem] text-body truncate lg:text-[1.3rem]">
                    {formatWeekday(date, lang, { zone })} {formatDay(date, zone)} {formatMonth(date, lang, zone)} · {formatClock(date, zone)}
                  </time>
                  {now != null && (
                    <span className={`shrink-0 font-mono text-[1.1rem] lg:text-[1.2rem] ${isAired ? "text-meta" : "text-lavender"}`}>
                      {isAired ? t.media.aired : formatCountdown(date.getTime() - now, true)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {relations.length > 0 && (
          <div className="flex flex-col gap-[1rem]">
            <span className="label">{t.detail.related}</span>
            {relations.map((edge) => (
              <Link
                key={edge.node.id}
                href={animePath(edge.node)}
                onClick={(event) => {
                  if (!onOpen || event.metaKey || event.ctrlKey) return;
                  event.preventDefault();
                  onOpen(edge.node.id);
                }}
                className="p-[0.8rem] flex items-center gap-[1.2rem] rounded-[0.8rem] bg-surface transition-colors hover:bg-surface-2"
              >
                <Cover image={edge.node.coverImage} alt={mediaTitles(edge.node.title).title} className="w-[3.6rem] aspect-[2/3] rounded-[0.3rem]" />
                <div className="min-w-0 flex flex-col gap-[0.3rem]">
                  <span className="font-mono text-[1rem] uppercase text-lavender">
                    {t.relations[edge.relationType]}
                    {edge.node.format && ` · ${t.formats[edge.node.format]}`}
                  </span>
                  <span className="text-[1.3rem] font-semibold">{mediaTitles(edge.node.title).title}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <a href={media.siteUrl} target="_blank" rel="noopener" className="self-start font-mono text-[1.3rem] text-action-text hover:text-action-text-hover">
          {t.detail.openAniList}
        </a>
      </div>
    </>
  );
}
