import type { Project, ProjectStatus } from './projects';

/**
 * How each project looks as a book on /library/. The words live in
 * projects.ts; this file only holds the binding. A project with no entry
 * here, or an entry with no project, stops the build: see buildShelves.
 *
 * Plain TypeScript with type-only imports, so scripts/check-library.mts can
 * run it under Node without a bundler.
 */

export type Pose = 'cover' | 'spine' | 'flat';

/** What kind of thing a project is, for the buttons above the shelves. */
export type Kind = 'app' | 'ai' | 'web' | 'people';
export const KINDS: Kind[] = ['app', 'ai', 'web', 'people'];

export type BookLook = {
  pose: Pose;
  /** Cloth or board colour. */
  color: string;
  /** Lettering colour. Must reach 4.5:1 against color (npm run check). */
  ink: string;
  /** Accent rules across a spine. */
  band?: string;
  face: 'sans' | 'mono';
  /** Letterspaced capitals. Mono is always set this way. */
  caps?: boolean;
  /** px at full size: a spine's thickness, a cover's width, a flat book's length. */
  width: number;
  /** px at full size: a spine's or cover's height, a flat book's thickness. */
  height: number;
  /** Degrees. Only covers lean. */
  tilt?: number;
  /** At least one. Each must be true of the project (AI = it calls a language model). */
  kinds: Kind[];
};

/** Suggested colours, not the apps' brands. Swap freely; npm run check guards contrast. */
export const bookLooks: Record<string, BookLook> = {
  maak: { pose: 'cover', color: '#2f4a3a', ink: '#efe6d2', face: 'sans', width: 146, height: 210, tilt: -2, kinds: ['app', 'ai'] },
  'prata-oppet': { pose: 'spine', color: '#6e2a26', ink: '#f3e7d8', face: 'sans', caps: true, width: 44, height: 214, kinds: ['people'] },
  bibelrosten: { pose: 'spine', color: '#22324a', ink: '#c9a75e', band: '#c9a75e', face: 'sans', width: 48, height: 228, kinds: ['app', 'ai'] },
  crava: { pose: 'spine', color: '#b98a3a', ink: '#2a1f14', face: 'sans', caps: true, width: 40, height: 200, kinds: ['app'] },
  heytid: { pose: 'flat', color: '#8fa3b8', ink: '#1d2733', face: 'sans', width: 190, height: 34, kinds: ['app', 'web'] },
  hand: { pose: 'flat', color: '#3a3a3c', ink: '#e8e2d6', face: 'mono', width: 176, height: 30, kinds: ['app', 'ai'] },
};

export type ShelfBook = {
  /** Position across every shelf, in reading order. */
  index: number;
  slug: string;
  name: string;
  status: ProjectStatus;
  statusLabel: string;
  marker: string;
  summary: string;
  stack: string[];
  facts: { term: string; value: string; href?: string }[];
  look: BookLook;
};

export type Decor = 'plant' | 'bookend';
export type ShelfId = 'live' | 'progress';

export type Shelf = {
  id: ShelfId;
  label: string;
  title: string;
  start?: Decor;
  end?: Decor;
  books: ShelfBook[];
};

const SHELVES: Omit<Shelf, 'books'>[] = [
  { id: 'live', label: 'On the shelf', title: 'Live', start: 'plant', end: 'bookend' },
  { id: 'progress', label: 'On the workbench', title: 'In progress', start: 'bookend' },
];

/** Shipped software and a running circle can both be experienced today. */
export function shelfFor(status: ProjectStatus): ShelfId {
  return status === 'building' ? 'progress' : 'live';
}

export function buildShelves(projects: Project[], looks: Record<string, BookLook>): Shelf[] {
  const noBook = projects.filter((p) => !looks[p.slug]).map((p) => p.slug);
  const noProject = Object.keys(looks).filter((slug) => !projects.some((p) => p.slug === slug));
  if (noBook.length > 0 || noProject.length > 0) {
    throw new Error(
      `content/library.ts and content/projects.ts disagree. No book for: ${noBook.join(', ') || 'none'}. No project for: ${noProject.join(', ') || 'none'}.`,
    );
  }
  let index = 0;
  return SHELVES.map((shelf) => ({
    ...shelf,
    books: projects
      .filter((p) => shelfFor(p.status) === shelf.id)
      .map((p) => ({
        index: index++,
        slug: p.slug,
        name: p.name,
        status: p.status,
        statusLabel: p.statusLabel,
        marker: p.marker,
        summary: p.summary,
        stack: p.stack,
        facts: p.facts,
        look: looks[p.slug],
      })),
  }));
}

/** Lower case, accents off: "MÄÄK" and "maak" are the same word to a visitor. */
function fold(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/**
 * The shelves with only the books that match: every word of the query must
 * appear in the book's words, and the book must be of the chosen kind.
 * Books keep their index, so a book's place in reading order never changes.
 */
export function filterShelves(shelves: Shelf[], query: string, kind: Kind | 'all'): Shelf[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  return shelves.map((shelf) => ({
    ...shelf,
    books: shelf.books.filter((b) => {
      if (kind !== 'all' && !b.look.kinds.includes(kind)) return false;
      const text = fold(
        [b.name, b.summary, b.statusLabel, ...b.stack, ...b.facts.map((f) => f.value), ...b.look.kinds].join(' '),
      );
      return words.every((w) => text.includes(w));
    }),
  }));
}

/** An empty shelf has nothing to say, so it is not drawn at all. */
export function visibleShelves(shelves: Shelf[]): Shelf[] {
  return shelves.filter((s) => s.books.length > 0);
}

/** Index of the book a URL hash names, or -1. Never throws on a malformed hash. */
export function bookIndexForHash(hash: string, books: { slug: string }[]): number {
  let slug: string;
  try {
    slug = decodeURIComponent(hash.replace(/^#/, ''));
  } catch {
    return -1;
  }
  if (!slug) return -1;
  return books.findIndex((b) => b.slug === slug);
}

/** Next or previous book, wrapping at both ends. -1 when there are none. */
export function step(index: number, delta: number, length: number): number {
  if (length <= 0) return -1;
  return (((index + delta) % length) + length) % length;
}

/** Consecutive flat books lie in one pile; everything else stands alone. */
export function groupRuns(books: ShelfBook[]): (ShelfBook | ShelfBook[])[] {
  const out: (ShelfBook | ShelfBook[])[] = [];
  for (const book of books) {
    const last = out[out.length - 1];
    if (book.look.pose !== 'flat') out.push(book);
    else if (Array.isArray(last)) last.push(book);
    else out.push([book]);
  }
  return out;
}

/**
 * Title size on a cover, in cqw: 21 at most, but small enough that the
 * longest word fits the 77% of the width the padding leaves. Long single
 * words ("Bibelrösten") would otherwise run past the edge.
 * ponytail: 0.5em per glyph is Familjen Grotesk's measured average (0.43) plus margin.
 */
export function coverTitleSize(name: string): number {
  const longest = Math.max(...name.split(/\s+/).map((w) => w.length));
  return Math.min(21, Math.floor((77 / (longest * 0.5)) * 10) / 10);
}

export function volumes(n: number): string {
  return `${n} ${n === 1 ? 'volume' : 'volumes'}`;
}

/** The one word that fits at the foot of a cover. */
export function shortStatus(status: ProjectStatus): string {
  return status === 'shipped' ? 'Live' : status === 'running' ? 'Running' : 'In progress';
}

/** What a screen reader hears for a book: the spine lettering is decoration. */
export function bookLabel(book: { name: string; statusLabel: string }): string {
  return `${book.name}, ${book.statusLabel}`;
}
