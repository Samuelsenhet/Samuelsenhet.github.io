# samuel-dev

The source of my personal website, [github.com/Samuelsenhet](https://github.com/Samuelsenhet).

It is a small static site: who I am, what I have built, and what state each
of those things is actually in.

## How it works

Next.js App Router with `output: 'export'`, so `npm run build` produces a
folder of static files in `out/` and nothing needs a server at runtime. That
keeps Vercel, GitHub Pages, Cloudflare Pages, and a plain bucket all viable.

**Content lives in `content/`, not in components.** Every project is an entry
in `content/projects.ts` with a `status` of `shipped` or `building`. Adding a
project, or changing one from closed to open source, is an edit to that file
alone.

**Public repositories are fetched at build time, never in the browser.**
`scripts/fetch-repos.mjs` runs before every build, asks the GitHub REST API
for public repositories only, and writes `data/repos.json`, which is
committed. Three consequences worth stating:

- No token is needed, so there is none to leak.
- Visitors never call the API, so its unauthenticated rate limit of 60
  requests per hour per address is never a factor.
- If GitHub is unreachable at build time, the script leaves the committed
  file untouched, logs a warning, and the build continues with the last known
  good data. The site does not depend on the API being up.

## Environment variables

None. There is no `.env` file and no secret of any kind in this repository.
If that ever changes, an `.env.example` belongs here with it.

## Commands

```
npm install
npm run dev         # http://localhost:3000
npm run build       # fetches repos, then writes out/
npm run typecheck   # tsc --noEmit
npm run fetch:repos # refresh data/repos.json on its own
```

## Deploying

**Vercel:** import the repository. The framework is detected, no settings to
change. Point a domain at it if you have one.

**GitHub Pages:** the build already writes a fully static `out/`. Publish that
folder with the Pages action of your choice. Mind which kind of Pages site it
is, because it changes the configuration:

- A *project* page, `samuelsenhet.github.io/samuel-dev/`, is served from a
  subpath. Set `basePath: '/samuel-dev'` and `assetPrefix: '/samuel-dev/'` in
  `next.config.mjs`, or every stylesheet, font, and link will 404.
- A *user* page, `samuelsenhet.github.io`, requires the repository to be named
  `Samuelsenhet.github.io` and is served from the root, so no `basePath`.
- A custom domain is served from the root either way, so no `basePath`.

**Before the first deploy, whichever host you pick:** set `siteUrl` in
`content/profile.ts` to the real origin. It ships as `https://example.com` on
purpose, so that an unset value is obvious rather than plausible. Canonical
links and the Open Graph image both resolve against it.

## Licence

Code is MIT. The written content and the images are mine and are not covered
by it.
