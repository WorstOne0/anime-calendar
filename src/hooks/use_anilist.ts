"use client";

// Next
import useSWR from "swr";
// Services
import { anilist, anilistPages, type AniListError } from "@/services";

type Variables = Record<string, unknown>;

// The query, its variables and the token are the cache key; a null query skips.
// With `pages`, every page of Page.<pages> is fetched and the lists are joined.
// `fallbackData` is what the server rendered: shown at once, then revalidated in the background.
export const useAniList = <T>(
  query: string | null,
  variables: Variables = {},
  { pages, token, fallbackData }: { pages?: string; token?: string | null; fallbackData?: T } = {}
) => {
  const { data, error, isLoading, mutate } = useSWR(
    query ? [query, variables, pages, token] : null,
    ([query, variables, pages, token]: [string, Variables, string | undefined, string | null | undefined]) =>
      pages ? anilistPages(query, variables, pages, token) : anilist(query, variables, token),
    { revalidateOnFocus: false, errorRetryCount: 2, fallbackData }
  );

  return { data: data as T | undefined, error: error as AniListError | TypeError | undefined, isLoading, refresh: mutate };
};
