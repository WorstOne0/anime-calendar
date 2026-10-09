// Models
import type { Lang } from "@/core/models";

const buildFormats = (locale: string, timeZone?: string) => ({
  weekday: new Intl.DateTimeFormat(locale, { weekday: "short", timeZone }),
  weekdayLong: new Intl.DateTimeFormat(locale, { weekday: "long", timeZone }),
  month: new Intl.DateTimeFormat(locale, { month: "short", timeZone }),
  day: new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone }),
  clock: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }),
});

// "local" is the viewer's timezone. The server and the hydrating client don't know it yet, so they print
// Brasília time (the audience's) until useNow reports the client's clock.
const FORMATS = {
  local: { pt: buildFormats("pt-BR"), en: buildFormats("en-US") },
  brasilia: { pt: buildFormats("pt-BR", "America/Sao_Paulo"), en: buildFormats("en-US", "America/Sao_Paulo") },
};

export type Zone = keyof typeof FORMATS;

// pt-BR abbreviations end in a dot and start lowercase: "qui." reads "Qui".
const capitalize = (text: string) => text.replace(/\./g, "").replace(/^./, (first) => first.toUpperCase());

export const zoneOf = (now: number | null): Zone => (now == null ? "brasilia" : "local");

export const pad2 = (value: number) => String(value).padStart(2, "0");

export const formatClock = (date: Date, zone: Zone = "local") => FORMATS[zone].pt.clock.format(date);

export const formatDay = (date: Date, zone: Zone = "local") => FORMATS[zone].pt.day.format(date);

export const formatWeekday = (date: Date, lang: Lang, { long = false, zone = "local" }: { long?: boolean; zone?: Zone } = {}) =>
  capitalize(FORMATS[zone][lang][long ? "weekdayLong" : "weekday"].format(date));

export const formatMonth = (date: Date, lang: Lang, zone: Zone = "local") => capitalize(FORMATS[zone][lang].month.format(date));

export const formatCountdown = (ms: number, short = false) => {
  const total = Math.max(0, Math.floor(ms / 60_000));
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const minutes = total % 60;

  if (days === 0) return `${hours}h ${pad2(minutes)}m`;
  return short ? `${days}d ${pad2(hours)}h` : `${days}d ${pad2(hours)}h ${pad2(minutes)}m`;
};

// "Sao Paulo · GMT−3". An "Etc/GMT+3" zone is a bare offset with its sign inverted, so it shows the offset alone.
export const timeZoneLabel = (now: number | null) => {
  if (now == null) return { long: "Brasília", short: "Brasília" };

  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const parts = new Intl.DateTimeFormat("en-US", { timeZoneName: "shortOffset" }).formatToParts(new Date(now));
  const offset = (parts.find((part) => part.type === "timeZoneName")?.value ?? "").replace("-", "−");
  const city = zone.startsWith("Etc/") || !zone.includes("/") ? "" : zone.split("/").pop()!.replace(/_/g, " ");

  return { long: city ? `${city} · ${offset}` : offset, short: city ? `${city} ${offset}` : offset };
};
