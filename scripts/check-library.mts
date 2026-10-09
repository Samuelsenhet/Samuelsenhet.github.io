/**
 * Checks for content/library.ts. No test framework on this site: run with
 * `npm run check`. Each assert names the behaviour it pins.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { projects, type Project, type ProjectStatus } from '../content/projects.ts';
import {
  bookIndexForHash,
  bookLabel,
  bookLooks,
  buildShelves,
  coverTitleSize,
  filterShelves,
  groupRuns,
  KINDS,
  shortStatus,
  step,
  visibleShelves,
  volumes,
  type BookLook,
} from '../content/library.ts';

const fixture = (slug: string, status: ProjectStatus): Project => ({
  slug,
  name: slug,
  summary: '',
  status,
  marker: '',
  statusLabel: status,
  repo: null,
  link: null,
  stack: [],
  body: [],
  facts: [],
});
const spine: BookLook = { pose: 'spine', color: '#000000', ink: '#ffffff', face: 'sans', width: 40, height: 200, kinds: ['app'] };
const flat: BookLook = { ...spine, pose: 'flat', width: 180, height: 30 };

// The real shelves: status decides the shelf, projects.ts decides the order.
const real = buildShelves(projects, bookLooks);
assert.deepEqual(
  real.map((s) => [s.id, s.books.map((b) => b.slug)]),
  [
    ['live', ['maak', 'prata-oppet']],
    ['progress', ['bibelrosten', 'crava', 'heytid', 'hand']],
  ],
);
assert.deepEqual(real.flatMap((s) => s.books.map((b) => b.index)), [0, 1, 2, 3, 4, 5]);

// A project without a book, or a book without a project, stops the build.
assert.throws(() => buildShelves([fixture('a', 'shipped')], {}), /No book for: a/);
assert.throws(() => buildShelves([], { b: spine }), /No project for: b/);

// Review focus 1: an empty shelf disappears.
const allLive = buildShelves([fixture('a', 'shipped'), fixture('b', 'running')], { a: spine, b: spine });
assert.deepEqual(visibleShelves(allLive).map((s) => s.id), ['live']);

// Review focus 2: a hash that is not a book opens nothing and never throws.
const books = real.flatMap((s) => s.books);
assert.equal(bookIndexForHash('#maak', books), 0);
assert.equal(bookIndexForHash('#hand', books), 5);
assert.equal(bookIndexForHash('', books), -1);
assert.equal(bookIndexForHash('#', books), -1);
assert.equal(bookIndexForHash('#nope', books), -1);
assert.equal(bookIndexForHash('#%E0%A4%A', books), -1);

// Review focus 3: stepping past either end wraps around.
assert.equal(step(0, -1, 6), 5);
assert.equal(step(5, 1, 6), 0);
assert.equal(step(2, 1, 6), 3);
assert.equal(step(0, 1, 0), -1);

// Consecutive flat books lie in one pile; a spine between them splits it.
const one = (slug: string, look: BookLook) => ({ ...buildShelves([fixture(slug, 'building')], { [slug]: look })[1].books[0] });
const s1 = one('s1', spine), f1 = one('f1', flat), f2 = one('f2', flat), s2 = one('s2', spine);
assert.deepEqual(groupRuns([s1, f1, f2]), [s1, [f1, f2]]);
assert.deepEqual(groupRuns([f1, s2, f2]), [[f1], s2, [f2]]);

assert.equal(volumes(1), '1 volume');
assert.equal(volumes(6), '6 volumes');
assert.equal(shortStatus('shipped'), 'Live');
assert.equal(shortStatus('running'), 'Running');
assert.equal(shortStatus('building'), 'In progress');
assert.equal(bookLabel(books[0]), 'MÄÄK, Live on the App Store');

// Review focus 5: every name fits on its book.
// ponytail: width estimate from average glyph width; measure in a browser if a name is borderline.
function textFits(name: string, look: BookLook): boolean {
  const size = look.face === 'mono' ? 11 : look.caps ? 12 : 15;
  const track = look.face === 'mono' ? 0.14 : look.caps ? 0.12 : 0;
  const length = name.length * size * (0.62 + track);
  const room = look.pose === 'spine' ? look.height - 36 : look.width - 24;
  return length <= room;
}
for (const b of books) assert.ok(textFits(b.name, b.look), `${b.name} does not fit on its ${b.look.pose}`);

// Every book opens to a cover, so every name must fit one: the longest word
// on a line, at the cover's title size, inside the 77% the padding leaves.
// ponytail: 0.5em per glyph is Familjen Grotesk's measured average (0.43) plus margin.
for (const b of books) {
  const longest = Math.max(...b.name.split(/\s+/).map((w) => w.length));
  assert.ok(longest * 0.5 * coverTitleSize(b.name) <= 77, `${b.name} overflows its cover`);
}

// Lettering on every book is readable: 4.5:1 against its cloth.
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
for (const b of books) {
  assert.ok(contrast(b.look.ink, b.look.color) >= 4.5, `${b.name}: ink on cloth is ${contrast(b.look.ink, b.look.color).toFixed(2)}:1`);
}

// The warm room meets the site's contrast floor in both themes. Tokens are
// read from globals.css, so this checks the values that actually ship.
const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  assert.ok(start >= 0, `globals.css has no "${selector} {" block`);
  const body = css.slice(start, css.indexOf('}', start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6}|var\(--[\w-]+\))/g)].map((m) => [m[1], m[2]]));
}
// The shelf borrows the site's own colours by var(); dark mode overrides only what it names.
const site = { light: block('@theme'), dark: { ...block('@theme'), ...block('.dark') } };
const roomLight = block('.library');
const room = { light: roomLight, dark: { ...roomLight, ...block('.dark .library') } };
for (const theme of ['light', 'dark'] as const) {
  const resolve = (v: string) => (v.startsWith('var(--') ? site[theme][v.slice(6, -1)] : v);
  const t = Object.fromEntries(Object.entries(room[theme]).map(([k, v]) => [k, resolve(v)]));
  const papers = [t['lib-paper-1'], t['lib-paper-2'], t['lib-paper-3']];
  for (const paper of papers) {
    for (const ink of ['lib-text', 'lib-dim'] as const) {
      const c = contrast(t[ink], paper);
      assert.ok(c >= 4.5, `${theme}: ${ink} ${t[ink]} on ${paper} is ${c.toFixed(2)}:1, needs 4.5`);
    }
    for (const dot of ['color-jade', 'color-brass'] as const) {
      const c = contrast(site[theme][dot], paper);
      assert.ok(c >= 3, `${theme}: ${dot} dot on ${paper} is ${c.toFixed(2)}:1, needs 3`);
    }
  }
  const card = contrast(t['lib-dim'], t['lib-card']);
  assert.ok(card >= 4.5, `${theme}: lib-dim on lib-card is ${card.toFixed(2)}:1, needs 4.5`);
}

// Filtering: the search box and the kind buttons above the shelves.
const slugs = (shelves: ReturnType<typeof buildShelves>) => shelves.flatMap((sh) => sh.books.map((b) => b.slug));
assert.deepEqual(slugs(filterShelves(real, '', 'all')), ['maak', 'prata-oppet', 'bibelrosten', 'crava', 'heytid', 'hand']);
// Every book is some kind of thing, and every button finds at least one.
for (const b of books) assert.ok(b.look.kinds.length > 0, `${b.name} has no kind`);
for (const k of KINDS) assert.ok(slugs(filterShelves(real, '', k)).length > 0, `the ${k} button finds nothing`);
assert.deepEqual(slugs(filterShelves(real, '', 'ai')), ['maak', 'bibelrosten', 'hand']);
assert.deepEqual(slugs(filterShelves(real, '', 'people')), ['prata-oppet']);
// Searching reads the name, summary, stack and facts, ignores case and accents,
// and needs every word to match.
assert.deepEqual(slugs(filterShelves(real, 'maak', 'all')), ['maak']);
assert.deepEqual(slugs(filterShelves(real, 'OPPET', 'all')), ['prata-oppet']);
assert.deepEqual(slugs(filterShelves(real, 'scripture', 'all')), ['bibelrosten']);
assert.deepEqual(slugs(filterShelves(real, 'supabase ireland', 'all')), ['heytid']);
assert.deepEqual(slugs(filterShelves(real, '  ', 'all')).length, 6);
// Search and button together narrow further; nothing matching leaves empty shelves.
assert.deepEqual(slugs(filterShelves(real, 'insurance', 'ai')), ['hand']);
assert.deepEqual(slugs(filterShelves(real, 'insurance', 'web')), []);
assert.deepEqual(visibleShelves(filterShelves(real, 'zzzz', 'all')), []);
// Filtering keeps each book's place in reading order.
assert.deepEqual(filterShelves(real, '', 'ai').flatMap((sh) => sh.books.map((b) => b.index)), [0, 2, 5]);

// Reduced motion keeps the hover lift: the site's global rule makes it
// instant, so the book still comes forward without animating. Nothing may
// pin the book's transform in place.
assert.ok(
  !/\.lib-body\s*\{[^}]*transform:[^;}]*!important/.test(css),
  'globals.css pins .lib-body transform with !important, so a book never comes forward under reduced motion',
);

console.log('check-library: all passed');
