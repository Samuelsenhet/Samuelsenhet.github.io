# Samuelsenhet.github.io

The source of my personal website, [samuelsenhet.github.io](https://samuelsenhet.github.io).
The repository is named after the site because that is what makes GitHub Pages
serve it from the root of the domain; see Deploying.

It is a small static site: who I am, what I have built, and what state each of
those things is actually in.

## How it works

Next.js App Router with `output: 'export'`, so `npm run build` produces a
folder of static files in `out/` and nothing needs a server at runtime. That
keeps GitHub Pages, which is what serves it, along with Vercel, Cloudflare
Pages, or a plain bucket all viable.

**Content lives in `content/`, not in components.** Every project is an entry
in `content/projects.ts` with a `status` of `shipped`, `running`, or
`building`. The ledger colours those: shipped and running are both jade,
because both mean a person can experience the thing today, and building is
brass. Set `isSoftware: false` on an entry that is not software, and it drops
the code framing.

Opening a project is one field. Put the repository URL in `repo` and the
project page turns its Source row from `Private` into a link; leave it `null`
and it stays private. No component changes either way.

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

This is a GitHub Pages **user** page. The repository is named
`Samuelsenhet.github.io`, which is what makes it one, and a user page is served
from the root of the domain, so no `basePath` and no `assetPrefix` are needed.

Do not rename the repository without changing that. A *project* page is served
from a subpath, and without a `basePath` every stylesheet, font, and link would
404.

`.github/workflows/pages.yml` builds and deploys on every push to `main`. It
runs `npm run typecheck` before the build, so a type error stops the deploy
rather than shipping. You can also trigger it by hand from the Actions tab,
which is how to refresh the public repository list without making a commit.

`siteUrl` in `content/profile.ts` has to match the origin that actually serves
the site. Canonical links and the Open Graph image both resolve against it, and
a wrong value there fails quietly.

A custom domain is also served from the root, so no `basePath`: point it at
Pages, add a `CNAME`, and change `siteUrl`.

The build is a plain static export, so nothing here is tied to Pages. Another
host is a matter of pointing it at `out/` and setting `siteUrl`.

## Licence

Code is MIT. The written content and the images are mine and are not covered
by it.
