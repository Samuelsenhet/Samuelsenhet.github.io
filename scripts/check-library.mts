/**
 * Checks for content/library.ts. No test framework on this site: run with
 * `npm run check`. Each assert names the behaviour it pins.
 */
import assert from 'node:assert/strict';
import { projects, type Project, type ProjectStatus } from '../content/projects.ts';
import {
  bookIndexForHash,
  bookLabel,
  bookLooks,
  buildShelves,
  groupRuns,
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
const spine: BookLook = { pose: 'spine', color: '#000000', ink: '#ffffff', face: 'sans', width: 40, height: 200 };
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
  if (look.pose === 'cover') return true; // covers wrap the title
  const size = look.face === 'mono' ? 11 : look.caps ? 12 : 15;
  const track = look.face === 'mono' ? 0.14 : look.caps ? 0.12 : 0;
  const length = name.length * size * (0.62 + track);
  const room = look.pose === 'spine' ? look.height - 36 : look.width - 24;
  return length <= room;
}
for (const b of books) assert.ok(textFits(b.name, b.look), `${b.name} does not fit on its ${b.look.pose}`);

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

console.log('check-library: all passed');
