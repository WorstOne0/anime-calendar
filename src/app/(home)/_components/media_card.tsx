"use client";

// Next
import Link from "next/link";
// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS, animePath, type Media } from "@/core/models";
// Hooks
import { useMyList } from "../_hooks/use_my_list";
// Components
import { Cover } from "@/components";
// Utils
import { describeMedia } from "@/utils";

const ACTION = "rounded-full bg-action text-[1.2rem] font-semibold text-on-action transition-colors hover:bg-action-hover";
const OUTLINE = "rounded-full border border-line-strong text-[1.2rem] font-semibold transition-colors hover:border-soft";

// The season list card: compact under lg, the two-column desk card from lg up.
export default function MediaCard({ media, now }: { media: Media; now: number | null }) {
  const lang = useLanguageController((state) => state.lang);
  const setDetailId = useSeasonController((state) => state.setDetailId);
  const { isLoggedIn, entries, setProgress, addToList } = useMyList();

  const t = TRANSLATIONS[lang];
  const info = describeMedia(media, { t, lang, now, entry: entries.get(media.id) });
  const isBehind = info.isOnList && info.behind > 0;
  const canAdd = isLoggedIn && !info.isOnList;

  const onMark = (event: React.MouseEvent) => {
    event.stopPropagation();
    setProgress(media.id, info.watched + 1, info.title);
  };

  const onAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    addToList(media.id, info.title);
  };

  // A plain click opens the drawer through the card; a modified one opens the anime's own page.
  const onTitleClick = (event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) return event.stopPropagation();
    event.preventDefault();
  };

  return (
    <div
      onClick={() => setDetailId(media.id)}
      className={`grid grid-cols-[9.6rem_minmax(0,1fr)] rounded-card overflow-hidden border bg-surface cursor-pointer transition-colors lg:min-h-[23.6rem] lg:grid-cols-[15rem_minmax(0,1fr)]
        ${info.isOnList ? "border-action/50" : "border-line hover:border-line-strong"}`}
    >
      <Cover image={media.coverImage} alt={info.title} isLarge className="min-h-[15rem]" />

      <div className="min-w-0 px-[1.4rem] py-[1.2rem] flex flex-col gap-[0.5rem] lg:px-[2rem] lg:py-[1.8rem] lg:gap-[0.8rem]">
        <div className="flex justify-between gap-[0.8rem] font-mono text-[1rem] uppercase text-meta lg:gap-[1.2rem] lg:text-[1.1rem] lg:tracking-[0.05em]">
          <span className="truncate">
            {info.format} · {info.length}
            <span className="hidden lg:inline"> · {info.studio}</span>
          </span>
          <span className="shrink-0 text-title">{info.score}</span>
        </div>

        <h2 className="text-[1.6rem] font-bold leading-[1.2] line-clamp-2 lg:text-[2rem] lg:leading-[1.15] lg:tracking-[-0.01em]">
          <Link href={animePath(media)} onClick={onTitleClick}>
            {info.title}
          </Link>
        </h2>
        {info.subtitle && <span className="text-[1.2rem] text-meta truncate lg:-mt-[0.4rem] lg:text-[1.3rem]">{info.subtitle}</span>}

        <span className="text-[1.2rem] text-meta lg:hidden">
          {info.studio} · {info.genres.join(" / ")}
        </span>
        <div className="hidden flex-wrap gap-[0.5rem] lg:flex">
          {info.genres.map((genre) => (
            <span key={genre} className="px-[0.8rem] py-[0.3rem] rounded-full bg-surface-2 text-[1.1rem] text-body">
              {genre}
            </span>
          ))}
        </div>

        <p className="text-[1.2rem] leading-[1.45] text-copy line-clamp-2 lg:mt-[0.2rem] lg:text-[1.3rem] lg:leading-[1.5] lg:line-clamp-3">{info.synopsis}</p>

        {info.isOnList && (
          <div className="mt-[0.2rem] flex items-center gap-[1.2rem]">
            <div className="min-w-0 flex-1 flex flex-col gap-[0.5rem] lg:gap-[0.6rem]">
              <div className="flex justify-between gap-[0.6rem] font-mono text-[1rem] lg:text-[1.1rem]">
                <span className="text-body">{info.progressLabel}</span>
                <span className={info.behind > 0 ? "text-action-text" : "text-meta"}>{info.behindLabel}</span>
              </div>
              <div className="h-[0.4rem] rounded-[0.2rem] bg-track overflow-hidden">
                <div className="h-full bg-linear-to-r from-action to-accent" style={{ width: info.progressWidth }} />
              </div>
            </div>
            {isBehind && (
              <button type="button" onClick={onMark} className={`hidden shrink-0 px-[1.2rem] py-[0.7rem] lg:block ${ACTION}`}>
                {info.markLabel}
              </button>
            )}
          </div>
        )}
        {canAdd && (
          <button type="button" onClick={onAdd} className={`hidden self-start px-[1.2rem] py-[0.6rem] lg:block ${OUTLINE}`}>
            + {t.list.add}
          </button>
        )}

        <span className={`mt-auto pt-[0.4rem] font-mono text-[1.1rem] lg:hidden ${info.hasNext ? "text-lavender" : "text-meta"}`}>{info.inLine}</span>
        {isBehind && (
          <button type="button" onClick={onMark} className={`h-[3.6rem] self-start px-[1.4rem] lg:hidden ${ACTION}`}>
            {info.markLabel}
          </button>
        )}
        {canAdd && (
          <button type="button" onClick={onAdd} className={`h-[3.6rem] self-start px-[1.4rem] lg:hidden ${OUTLINE}`}>
            + {t.list.add}
          </button>
        )}

        <div className="hidden mt-auto pt-[1rem] items-center justify-between gap-[1.2rem] border-t border-line lg:flex">
          <div className="flex flex-col gap-[0.2rem] font-mono">
            <span className={`text-[1.4rem] ${info.hasNext ? "text-lavender" : "text-meta"}`}>{info.countdown}</span>
            {info.hasCountdown && <span className="text-[1.1rem] text-meta">{info.nextLine}</span>}
          </div>
          <div className="flex flex-wrap justify-end gap-[0.5rem]">
            {info.streams.map((stream) => (
              <a
                key={stream.name}
                href={stream.url}
                target="_blank"
                rel="noopener"
                onClick={(event) => event.stopPropagation()}
                className="px-[0.7rem] py-[0.3rem] rounded-[0.4rem] border border-line-strong font-mono text-[1rem] text-title transition-colors hover:border-soft"
              >
                {stream.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
