// Models
import { mediaStreams, type ListEntry, type Media } from "@/core/models";
// Controllers
import type { Filter } from "../_controllers/season_controller";

// Each value with how often it appears, most common first: the chips' order and their counts.
export const tally = (values: string[]) =>
  [...values.reduce((counts, value) => counts.set(value, (counts.get(value) ?? 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);

export const countActiveFilters = (filter: Filter, isLoggedIn: boolean) =>
  filter.formats.length + filter.genres.length + filter.studios.length + filter.streams.length + (filter.mine && isLoggedIn ? 1 : 0);

// OR inside a group, AND across groups. `entries` is null when logged out, which turns "only my list" off.
export const filterMedia = (media: Media[], filter: Filter, entries: Map<number, ListEntry> | null) =>
  media.filter((item) => {
    if (filter.formats.length && !filter.formats.includes(item.format ?? "")) return false;
    if (filter.genres.length && !item.genres.some((genre) => filter.genres.includes(genre))) return false;
    if (filter.studios.length && !filter.studios.includes(item.studios?.nodes[0]?.name ?? "")) return false;
    if (filter.streams.length && !mediaStreams(item).some((stream) => filter.streams.includes(stream.name))) return false;

    return !filter.mine || !entries || entries.has(item.id);
  });
