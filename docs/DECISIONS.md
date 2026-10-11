# Decisions

Append-only. A revisited decision is a new entry that replaces an old one.

## D-001 - The projects stand as books on a shelf on the home page
**Date** 2026-10-09
**Context** The home page listed the projects as a ledger. Inspired by Carollia's virtual library, the owner wanted the projects shown as books, without redoing the rest of the site. Design and its dated changes: `docs/superpowers/specs/2026-10-09-library-design.md`.
**Alternatives** A separate `/library/` page with its own warm paper (built, then dropped); the shelf on both the home page and `/library/`; keeping the ledger.
**Reason** One place for the shelf, where visitors land. It takes the page's own colours by `var()`, so it reads as part of the site and follows the theme toggle. Text stays in `content/projects.ts`; `content/library.ts` holds only how each book looks, and the build fails if the two disagree. Search runs in the browser and kind buttons (App, AI, Web, People) are checked against the repos; no AI search, since the site is static.
**Tradeoffs** The home page loses the compact ledger, which now lives only on `/work`. The shelf is hand-built CSS 3D with no browser test harness; motion and focus were checked by hand in Arc. Book colours are suggestions, not the apps' brands.

## D-002 - The home page becomes a 3D résumé in the site's dark; the shelf keeps only what is in progress
**Date** 2026-10-11
**Context** The owner wanted what dayinji/sen-3d-resume does: a 3D figure of the owner, an About over it, and a résumé timeline the camera follows on scroll. Sketches in `scratch/home-3d.html` (home) and `scratch/pages.html` (the other pages) were worked through by eye. An animated SVG banner in the profile README was tried first and rejected.
**Alternatives** A 3D hero above the unchanged shelf; the full résumé hosted from the profile repo; the README banner; books as 3D objects in front of the figure (built, then removed as clutter); sen's green backdrop.
**Reason** The home page follows sen's structure in the site's own dark (`#0f1620`): the owner's figure (made in intro3d, eyes added in the sketch), About, then a timeline. Live work (Prata Öppet, MÄÄK) gets a row with its cover; everything in progress stands together on one mini shelf that keeps D-001's behaviour (lift, card, open book). Nothing stands in front of the figure. The other pages take the same type and dark, without 3D.
**Tradeoffs** three.js, postprocessing and a 2 MB model on the home page; they load after the text, in their own chunk, so nothing waits for them, and the scene draws only while something moves. The site becomes dark only: sen's design has no light version, so the theme toggle is gone. The shelf's search box and kind buttons go with the full shelf. The model (`public/models/me.glb`) is the owner's likeness and becomes public with the site. sen's code is MIT and keeps its notice; his figure, content and `sen.blend` are not and are not used. The owner's model stays out of git.
