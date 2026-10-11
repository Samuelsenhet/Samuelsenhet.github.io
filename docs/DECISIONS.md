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

## D-003 - The figure is a stylized Hyper3D model with eyes behind the glasses; replaces D-002's intro3d model
**Date** 2026-10-11
**Context** The intro3d figure was far from the finish of sen's hand-sculpted one. Hyper3D Rodin was tried from a photo: a realistic model with a smeared face. A prompt asking for a stylized look was ignored, since Rodin follows the image. A stylized picture of the owner as input gave a stylized model, but Rodin turned the glasses' lenses into opaque white with no eyes behind them.
**Alternatives** The realistic Hyper3D model; eyes stuck in front of the white lenses (googly); the lenses cut out of the mesh with dark sockets (jagged, read as sunglasses); a glasses-free picture to start from (the owner could not make one); keeping intro3d.
**Reason** Stylized model `2e7ab813` (Gen-2.5-High, Quad mesh, ~38k faces, no decimation). In Blender the lens texels were repainted to the cheek's skin with a soft shade toward the rims; eyes `eye-L`/`eye-R` (white ball, flat iris) sit level in the frames, part-sunk into the face, with thin skin lids `lid-*` that the scene does not turn. Textures at 1024 px JPEG: 1.2 MB, smaller than before. Checked in the sketch with the pointer in four directions.
**Tradeoffs** Single AI mesh: no real eyelids or sockets, a faint grey streak by the right lens, the body ends at the knees as in the picture, and dreadlocks lie oddly behind the left shoulder. No focus-1… anchors, so the stops fall back to chest, collar and shoulder. The intro3d model is kept as `scratch/models/me.intro3d.glb`. Generations: `scratch/hyper3d-*/`.
