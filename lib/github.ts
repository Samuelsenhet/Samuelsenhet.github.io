import repoData from '@/data/repos.json';

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  updated: string;
};

export type RepoData = {
  /** ISO date the list was last successfully fetched, or null if never. */
  fetchedAt: string | null;
  repos: Repo[];
};

/**
 * Public repositories, read from a file written at build time by
 * scripts/fetch-repos.mjs. Nothing is fetched in the browser, so there is
 * no rate limit to hit and no token to leak. If the build-time fetch fails
 * the committed file is left untouched and this still returns the last
 * known good list.
 */
export function getRepos(): RepoData {
  return repoData as RepoData;
}
