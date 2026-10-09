// Models
import { mediaStreams, mediaTitles, type Lang, type ListEntry, type Media, type Translation } from "@/core/models";
// Utils
import { formatClock, formatCountdown, formatWeekday, zoneOf } from "./format";

// The display values the list card, the detail panel and the anime page share. A null `now` is the
// server render: no countdown yet, times in Brasília.
export const describeMedia = (media: Media, { t, lang, now, entry }: { t: Translation; lang: Lang; now: number | null; entry?: ListEntry }) => {
  const next = media.nextAiringEpisode;
  const nextAt = next ? next.airingAt * 1000 : 0;
  const hasNext = !!next && (now == null || nextAt > now);
  const hasCountdown = hasNext && now != null;
  const zone = zoneOf(now);
  const status = media.status === "FINISHED" ? t.media.finished : t.media.tba;
  const nextLine = hasNext ? `${t.media.ep} ${next.episode} · ${formatWeekday(new Date(nextAt), lang, { zone })} ${formatClock(new Date(nextAt), zone)}` : "";
  // AniList keeps an episode as "next" for a while after it airs.
  const aired = next ? Math.max(0, next.episode - 1 + (now != null && nextAt <= now ? 1 : 0)) : media.status === "FINISHED" ? (media.episodes ?? 0) : 0;
  const watched = entry?.progress ?? 0;
  const behind = Math.max(0, aired - watched);
  // Descriptions arrive with HTML and source credits.
  const synopsis = (media.description ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\((Source|Fonte)[^)]*\)/gi, "")
    .replace(/\[(Written|Source)[^\]]*\]/gi, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/\s+/g, " ")
    .trim();

  return {
    ...mediaTitles(media.title),
    format: media.format ? t.formats[media.format] : "—",
    length: [media.episodes ? `${media.episodes} ep` : "? ep", media.duration ? `${media.duration} min` : ""].filter(Boolean).join(" · "),
    studio: media.studios?.nodes[0]?.name ?? "—",
    genres: media.genres.slice(0, 3).map((genre) => t.genres[genre] ?? genre),
    score: media.averageScore ? `${media.averageScore}%` : "—",
    synopsis: synopsis || t.media.noSynopsis,
    hasNext,
    hasCountdown,
    countdown: hasCountdown ? formatCountdown(nextAt - now) : hasNext ? nextLine : status,
    nextLine,
    inLine: hasCountdown ? `${nextLine} · ${formatCountdown(nextAt - now, true)}` : hasNext ? nextLine : status,
    streams: mediaStreams(media),
    isOnList: !!entry,
    watched,
    behind,
    progressLabel: `Ep ${watched} ${t.list.of} ${media.episodes || "?"} ${t.list.watched}`,
    progressWidth: `${Math.min(100, Math.round((watched / (media.episodes || Math.max(aired, 1))) * 100))}%`,
    behindLabel: behind > 0 ? `${behind} ${t.list.behind}` : t.list.upToDate,
    markLabel: `${t.list.mark} Ep ${watched + 1}`,
  };
};
