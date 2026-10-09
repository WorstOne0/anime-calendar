"use client";

// Next
import { useState } from "react";
// Controllers
import { useLanguageController } from "@/core/controllers";
import { useSeasonController, type FilterGroup } from "../_controllers/season_controller";
// Models
import { TRANSLATIONS, mediaStreams, type Media, type MediaFormat } from "@/core/models";
// Utils
import { tally } from "../_utils/filter_media";

const CHIP = "h-[3.6rem] px-[1.2rem] flex items-center gap-[0.6rem] rounded-full border text-[1.3rem] font-semibold transition-colors lg:h-auto lg:px-[1rem] lg:py-[0.5rem] lg:text-[1.2rem]";

// The four chip groups, shared by the desktop sidebar and the mobile sheet. Counts are over the whole season.
export default function FilterGroups({ media }: { media: Media[] }) {
  const lang = useLanguageController((state) => state.lang);
  const filter = useSeasonController((state) => state.filter);
  const toggleFilter = useSeasonController((state) => state.toggleFilter);

  const [studioSearch, setStudioSearch] = useState("");

  const t = TRANSLATIONS[lang];
  const search = studioSearch.trim().toLowerCase();
  const formats = tally(media.map((item) => item.format ?? "").filter(Boolean));
  const genres = tally(media.flatMap((item) => item.genres));
  const streams = tally(media.flatMap((item) => mediaStreams(item).map((stream) => stream.name)));
  // Picked studios stay first and visible whatever the search says.
  const studios = tally(media.map((item) => item.studios?.nodes[0]?.name ?? "").filter(Boolean))
    .filter(([studio]) => filter.studios.includes(studio) || studio.toLowerCase().includes(search))
    .sort((a, b) => Number(filter.studios.includes(b[0])) - Number(filter.studios.includes(a[0])))
    .slice(0, search ? 12 : 8);

  const buildChips = (group: FilterGroup, values: [string, number][], name: (value: string) => string) => (
    <div className="flex flex-wrap gap-[0.6rem]">
      {values.map(([value, count]) => {
        const isSelected = filter[group].includes(value);

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggleFilter(group, value)}
            className={`${CHIP} ${isSelected ? "border-title bg-title text-background" : "border-line-strong text-body hover:border-soft"}`}
          >
            {name(value)}
            <span className={`font-mono text-[1rem] font-medium ${isSelected ? "text-muted" : "text-soft"}`}>{count}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="flex flex-col gap-[1rem]">
        <span className="label">{t.filters.format}</span>
        {buildChips("formats", formats, (value) => t.formats[value as MediaFormat] ?? value)}
      </div>

      <div className="flex flex-col gap-[1rem]">
        <span className="label">{t.filters.genre}</span>
        {buildChips("genres", genres, (value) => t.genres[value] ?? value)}
      </div>

      <div className="flex flex-col gap-[1rem]">
        <span className="label">{t.filters.studio}</span>
        <input
          value={studioSearch}
          onChange={(event) => setStudioSearch(event.target.value)}
          placeholder={t.filters.studioSearch}
          className="h-[4.4rem] w-full px-[1.4rem] rounded-card border border-line-strong bg-surface text-[1.4rem] text-title outline-none placeholder:text-soft focus:border-action lg:h-[3.6rem] lg:px-[1.2rem] lg:rounded-[0.8rem] lg:text-[1.3rem]"
        />
        {buildChips("studios", studios, (value) => value)}
      </div>

      <div className="flex flex-col gap-[1rem]">
        <span className="label">{t.filters.streaming}</span>
        {streams.length > 0 ? buildChips("streams", streams, (value) => value) : <span className="text-[1.2rem] text-meta">{t.filters.noStreams}</span>}
        <span className="font-mono text-[1.1rem] leading-[1.5] text-soft">{t.filters.streamNote}</span>
      </div>
    </>
  );
}
