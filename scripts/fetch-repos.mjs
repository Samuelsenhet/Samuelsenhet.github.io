/**
 * Writes data/repos.json from the GitHub REST API at build time.
 *
 * Only public repositories are requested, so no token is needed and none is
 * read. Running this at build time rather than in the browser means visitors
 * never touch the API, so the unauthenticated rate limit is never a factor.
 *
 * If the request fails the existing committed file is left exactly as it is
 * and the build continues with the last known good data.
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const USER = 'Samuelsenhet';
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'data', 'repos.json');

/** The profile README repo is account metadata, not a project. */
const EXCLUDE = new Set([USER.toLowerCase()]);

async function existing() {
  try {
    return JSON.parse(await readFile(OUT, 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  const prior = await existing();

  let repos;
  try {
    const res = await fetch(
      `https://api.github.com/users/${USER}/repos?type=public&sort=pushed&per_page=100`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': `${USER}-site-build`,
        },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json)) throw new Error('Unexpected response shape');

    repos = json
      .filter((r) => !r.fork && !r.archived && !EXCLUDE.has(String(r.name).toLowerCase()))
      .map((r) => ({
        name: r.name,
        description: r.description ?? null,
        language: r.language ?? null,
        url: r.html_url,
        stars: r.stargazers_count ?? 0,
        updated: r.pushed_at,
      }));
  } catch (err) {
    const why = err instanceof Error ? err.message : String(err);
    if (prior) {
      console.warn(`[repos] fetch failed (${why}); keeping committed data/repos.json`);
      return;
    }
    console.warn(`[repos] fetch failed (${why}); writing an empty list`);
    await mkdir(dirname(OUT), { recursive: true });
    await writeFile(OUT, JSON.stringify({ fetchedAt: null, repos: [] }, null, 2) + '\n');
    return;
  }

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(
    OUT,
    JSON.stringify({ fetchedAt: new Date().toISOString(), repos }, null, 2) + '\n',
  );
  console.log(`[repos] wrote ${repos.length} public repositories`);
}

main();
