// Models
import { mediaTitles, type AiringSchedule, type ListEntry, type ScheduleMedia } from "@/core/models";

// Shows carried over from earlier seasons make the week only when this many AniList users follow them.
const POPULARITY_FLOOR = 15_000;

export type WeekEntry = { key: string; mediaId: number; episode: number; at: number; day: number; media: ScheduleMedia };
export type WeekDay = { index: number; date: Date; isToday: boolean; entries: WeekEntry[] };

// Sunday to Sunday, local time.
export const weekRange = (now: number) => {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return { start: start.getTime(), end: end.getTime() };
};

export const buildWeek = (schedule: AiringSchedule[], { now, start, mediaIds, includePopular }: { now: number; start: number; mediaIds: Set<number>; includePopular: boolean }): WeekDay[] => {
  const keys = new Set<string>();
  const entries = schedule
    .filter((item): item is AiringSchedule & { media: ScheduleMedia } => !!item.media && !item.media.isAdult)
    .filter((item) => mediaIds.has(item.media.id) || (includePopular && item.media.popularity >= POPULARITY_FLOOR))
    .map((item) => ({ key: `${item.media.id}-${item.episode}`, mediaId: item.media.id, episode: item.episode, at: item.airingAt * 1000, day: new Date(item.airingAt * 1000).getDay(), media: item.media }))
    .filter((entry) => !keys.has(entry.key) && keys.add(entry.key))
    .sort((a, b) => a.at - b.at);
  const today = new Date(now).getDay();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + index);

    return { index, date, isToday: index === today, entries: entries.filter((entry) => entry.day === index) };
  });
};

// What the today strip and both calendars show for one episode.
export const describeEntry = (entry: WeekEntry, now: number, listEntry?: ListEntry) => {
  const isAired = entry.at <= now;
  const isWatched = !!listEntry && listEntry.progress >= entry.episode;

  return { ...mediaTitles(entry.media.title), isAired, isOnList: !!listEntry, isWatched, canMark: !!listEntry && isAired && !isWatched };
};
