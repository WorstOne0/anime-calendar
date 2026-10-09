// Mirrors the types in core/models/media.ts: a field added here goes there too.
const MEDIA_FIELDS = `
  id siteUrl status format episodes duration genres averageScore
  description(asHtml: false)
  coverImage { extraLarge large color }
  bannerImage
  studios(isMain: true) { nodes { name } }
  nextAiringEpisode { airingAt episode }
  externalLinks { site url type }
`;

export const SEASON_QUERY = `
  query ($page: Int, $season: MediaSeason, $year: Int) {
    Page(page: $page, perPage: 50) {
      pageInfo { hasNextPage }
      media(season: $season, seasonYear: $year, type: ANIME, isAdult: false, sort: POPULARITY_DESC) {
        ${MEDIA_FIELDS}
        title { romaji english }
      }
    }
  }
`;

export const SCHEDULE_QUERY = `
  query ($page: Int, $from: Int, $to: Int) {
    Page(page: $page, perPage: 50) {
      pageInfo { hasNextPage }
      airingSchedules(airingAt_greater: $from, airingAt_lesser: $to, sort: TIME) {
        airingAt episode
        media { id isAdult popularity title { romaji english } coverImage { extraLarge large color } bannerImage }
      }
    }
  }
`;

export const MEDIA_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME, isAdult: false) {
      ${MEDIA_FIELDS}
      season seasonYear
      startDate { year month day }
      title { romaji english native }
      trailer { id site thumbnail }
      airingSchedule(perPage: 50) { nodes { episode airingAt } }
      relations { edges { relationType node { id type format title { romaji english } coverImage { large } } } }
    }
  }
`;

export const VIEWER_QUERY = `query { Viewer { id name avatar { medium } } }`;

export const LIST_QUERY = `
  query ($userId: Int) {
    MediaListCollection(userId: $userId, type: ANIME, status_in: [CURRENT, PLANNING, PAUSED, REPEATING]) {
      lists { entries { mediaId progress status } }
    }
  }
`;

export const SAVE_ENTRY_MUTATION = `
  mutation ($mediaId: Int, $progress: Int, $status: MediaListStatus) {
    SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status) { id mediaId progress status }
  }
`;
