# How this site was made

A step-by-step account of how [samuelsenhet.github.io](https://samuelsenhet.github.io) was
built: what inspired it, which tools were used, what was installed, and what was tried and
dropped on the way. Written so someone else can build something similar. The reasoning behind
each larger choice is in [DECISIONS.md](DECISIONS.md) (D-001 to D-003).

## Inspiration

| What | Link | What was taken |
|---|---|---|
| sen-3d-resume by Sen Zheng | [github.com/dayinji/sen-3d-resume](https://github.com/dayinji/sen-3d-resume) · live: [about.senbuzy.com](https://about.senbuzy.com) | The home page's structure: a 3D figure of the owner, an About over it, a résumé timeline the camera follows on scroll, eyes that follow the pointer, the frame with corner labels, the nav as a credit line. His code is MIT and is credited where it is used. His figure, content and `sen.blend` are not used. |
| Carollia's virtual library | [carollia-library.lovable.app](https://carollia-library.lovable.app) · guide: [carollia99/virtual-library-guide](https://github.com/carollia99/virtual-library-guide) | The idea of projects as books on a shelf. The guide has no licence, so no code was copied: the shelf was built from the idea alone. |
| intro3d | [intro3d.com](https://intro3d.com) | The first 3D figure: upload a photo, get a character. Later replaced (step 5). |

## Tools

| Purpose | Tool |
|---|---|
| Writing the code | [Claude Code](https://claude.com/claude-code), working in this repository |
| Site | [Next.js](https://nextjs.org) 16 (App Router, `output: 'export'`), React 19, TypeScript, Tailwind CSS 4 |
| 3D in the browser | [three.js](https://threejs.org) 0.169 (`GLTFLoader`, `RoomEnvironment`) and [postprocessing](https://github.com/pmndrs/postprocessing) 6.39.1 (depth of field, bloom, SMAA) |
| Writing pages | `marked`, for the Markdown in `content/writing/` |
| Fonts | Google Fonts through `next/font`: [Familjen Grotesk](https://fonts.google.com/specimen/Familjen+Grotesk), [Cormorant Upright](https://fonts.google.com/specimen/Cormorant+Upright), [Mansalva](https://fonts.google.com/specimen/Mansalva), [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) |
| The figure | [Hyper3D Rodin](https://hyper3d.ai) through its CLI ([DeemosTech/hyper3d-cli](https://github.com/DeemosTech/hyper3d-cli)), then [Blender](https://www.blender.org) 4.5 driven from Claude Code with [mcp-for-blender](https://github.com/ahujasid/mcp-for-blender) |
| Checking on devices | [Playwright](https://playwright.dev) with headless Chromium, screenshots at phone, iPad and desktop sizes |
| Hosting | GitHub Pages, deployed by GitHub Actions (`.github/workflows/pages.yml`) |

## What was installed

- **Node 22 or newer**, then `npm install` in this repository. Everything the site needs is in
  `package.json`; there are no environment variables and no secrets.
- **The Hyper3D CLI**, globally: `npm install --global @hyper3d/cli`, then
  `hyper3d auth login` (opens the browser). It needs a Hyper3D account with credits. Each
  generation here cost 0.5 credits.
- **Blender** (4.5 was used), plus the Blender MCP so Claude Code can run Python in it:
  the `blender_mcp` add-on in Blender, and the server added to Claude Code with
  `claude mcp add --scope user blender -- uvx mcp-for-blender`.
- **Playwright** with its Chromium (`npm install playwright`, `npx playwright install chromium`)
  in a separate tools folder, not in this repository.

## Step by step

### 1. A static site that GitHub Pages can serve

- Create a repository named `<your-user>.github.io`. A repository with that name is a GitHub
  Pages **user** page, served from the root of the domain, so no `basePath` is needed.
- Next.js with `output: 'export'`, `trailingSlash: true` and unoptimised images
  (`next.config.mjs`). `npm run build` writes plain files to `out/`.
- Content lives in `content/`, not in components. Each project is one entry in
  `content/projects.ts` with a status (`shipped`, `running`, `building`).
- Public repositories are fetched at build time by `scripts/fetch-repos.mjs` into
  `data/repos.json`. Visitors never call the GitHub API, and a failed fetch keeps the last
  committed file.
- The workflow runs lint, typecheck and build on every push to `main`, then deploys `out/`.
  In the repository settings, Pages is set to deploy from GitHub Actions.

### 2. Sketch before code

Every visual change started as a self-contained HTML page in `scratch/`. The page uses the
site's real colours and fonts, can be clicked through every state, and has sliders for the
values that need tuning by eye. Only once the sketch looked right was the real component
written, with the tuned values as named constants that say where they came from.
`scratch/home-3d.html` is the sketch for the home page. The `scratch/` folder is not committed.

### 3. The bookshelf (D-001)

The projects stand as books on a shelf, each with its own cover, colour and size
(`content/library.ts`). A book slides out and opens on click. The build fails if a project
has no book, or a book has no project, and `npm run check` pins how the shelves are built.
It is hand-built CSS 3D; there is no 3D library for the shelf.

### 4. The 3D résumé (D-002)

- sen-3d-resume's `Scene.tsx` and `App.tsx` were ported from react-three-fiber to plain
  three.js in `components/home/Scene.tsx`. The parts kept from sen are: eyes that follow the
  pointer, the camera orbiting a few degrees with the pointer, scroll moving the camera from
  stop to stop, depth of field, bloom and SMAA, and his lights.
- `RoomEnvironment` stands in for sen's `env.hdr`, whose licence is unclear.
- The scene loads after the text in its own chunk, so the page never waits for it, and it
  only draws while something moves.
- The site went dark only, since sen's design has no light version.
- The model is `public/models/me.glb`. The scene relies on two naming rules: the eyes are
  objects named `eye-*` (they turn toward the pointer), and optional `focus-1`, `focus-2`…
  are the camera stops for the résumé rows.

### 5. The figure (D-003)

The first figure came from intro3d. It was far from the finish of sen's hand-sculpted
figure, so it was replaced with a Hyper3D model:

1. **A photo gives a realistic model.** `hyper3d generate --image photo.png` produced a
   realistic figure whose face smeared up close. Adding a `--prompt` that asked for a
   stylized look changed nothing: Rodin follows the image, not the text.
2. **A stylized picture gives a stylized model.** The photo was first turned into a
   stylized, animated-film-style picture with an AI image tool, and that picture was the
   input:
   ```
   hyper3d generate --image stylized.png --tier Gen-2.5-High --mesh-mode Quad --texture-delight
   hyper3d poll <generation-id> --timeout 580
   hyper3d result <generation-id> --output json   # links to the .glb files
   ```
   `Quad` gives a clean, light mesh (about 38k faces) without decimating. `--texture-delight`
   removes the photo's lighting from the colours.
3. **Glasses need fixing by hand.** Rodin turned the lenses into opaque white, with no eyes
   behind them. In Blender, through the MCP:
   - the white lens texels in the texture were repainted with the cheek's skin tone, with a
     soft shade toward the frames (no geometry cut: cutting left jagged edges);
   - eyes were added inside the frames: `eye-L` and `eye-R`, each an empty holding a white
     sphere and a flattened dark iris, sunk partly into the face so only the front shows;
   - a thin skin-coloured lid sits over each eye, named `lid-*` so the scene does not
     turn it;
   - exported as glTF binary with 1024 px JPEG textures: 1.2 MB.
4. **What was tried and dropped:** decimating the 500k-face model (jagged face), eyes stuck
   on top of the white lenses (googly), dark eye sockets behind cut-out lenses (looked like
   sunglasses).

If you start over: use a picture without glasses if you can, and add glasses afterwards.
Rodin then paints real eyes that can be covered by moving ones.

### 6. Checking on real sizes

Nothing was called done from code alone. A small Playwright script loaded the page and took
screenshots at 390×844 (phone), 820×1180 and 1180×820 (iPad), and desktop, with the pointer
moved up, down, left and right to check the eyes. Two things to know:

- Headless Chromium on a Mac needs `--use-angle=metal` for WebGL with postprocessing to
  render in time.
- Open `next dev` on `localhost`, not `127.0.0.1`. Next blocks its dev resources on the
  other host name, and the page's scripts never start.

Phone and iPad (any coarse pointer) get their own framing in `Scene.tsx`
(`START_VIEW_PHONE`, `START_EYES_PHONE`). The stylized head is large, and sen's phone values
cut it off.

### 7. Shipping

Each change goes on its own branch and pull request, is merged to `main`, and the Pages
workflow deploys it within a couple of minutes. Decisions that change direction are added
to `docs/DECISIONS.md` (append-only), with the alternatives that were rejected and why.

## Credits and licences

- This repository is MIT (`LICENSE`).
- Code ported from sen-3d-resume keeps its MIT notice in the files where it is used.
- Carollia's guide has no licence; only the idea was used.
- The figure is the owner's likeness. Please do not reuse it.
