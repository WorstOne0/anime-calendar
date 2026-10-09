const ANILIST_URL = "https://graphql.anilist.co";
const CLIENT_ID = process.env.NEXT_PUBLIC_ANILIST_CLIENT_ID;

type Variables = Record<string, unknown>;

// Implicit grant: AniList redirects to the client's registered URL (/auth) with the token in the fragment.
export const ANILIST_LOGIN_URL = CLIENT_ID ? `https://anilist.co/api/v2/oauth/authorize?client_id=${CLIENT_ID}&response_type=token` : null;

export class AniListError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const anilist = async <T>(query: string, variables: Variables = {}, token?: string | null) => {
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json().catch(() => null);

  if (!response.ok || body?.errors) throw new AniListError(body?.errors?.[0]?.message ?? response.statusText, response.status);
  return body.data as T;
};

// Follows Page.pageInfo.hasNextPage and joins the Page.<key> lists. AniList caps perPage at 50.
export const anilistPages = async <T>(query: string, variables: Variables, key: string, token?: string | null, maxPages = 6) => {
  const items: T[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const data = await anilist<{ Page: { pageInfo: { hasNextPage: boolean } } & Record<string, unknown> }>(query, { ...variables, page }, token);
    items.push(...(data.Page[key] as T[]));
    if (!data.Page.pageInfo.hasNextPage) break;
  }

  return items;
};
