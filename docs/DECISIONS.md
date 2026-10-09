# Decisions

Append-only. A revisited decision is a new entry that replaces an old one.

## D-001 - The projects stand as books on a shelf on the home page
**Date** 2026-10-09
**Context** The home page listed the projects as a ledger. Inspired by Carollia's virtual library, the owner wanted the projects shown as books, without redoing the rest of the site. Design and its dated changes: `docs/superpowers/specs/2026-10-09-library-design.md`.
**Alternatives** A separate `/library/` page with its own warm paper (built, then dropped); the shelf on both the home page and `/library/`; keeping the ledger.
**Reason** One place for the shelf, where visitors land. It takes the page's own colours by `var()`, so it reads as part of the site and follows the theme toggle. Text stays in `content/projects.ts`; `content/library.ts` holds only how each book looks, and the build fails if the two disagree. Search runs in the browser and kind buttons (App, AI, Web, People) are checked against the repos; no AI search, since the site is static.
**Tradeoffs** The home page loses the compact ledger, which now lives only on `/work`. The shelf is hand-built CSS 3D with no browser test harness; motion and focus were checked by hand in Arc. Book colours are suggestions, not the apps' brands.
