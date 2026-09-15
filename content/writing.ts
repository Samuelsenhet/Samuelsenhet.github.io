import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type Post = {
  slug: string;
  title: string;
  /** One line under the title, and the page description. */
  standfirst: string;
  /** ISO date. Shown as the month, because a day is more precision than this needs. */
  date: string;
  /** The project it comes out of, if any. */
  project?: string;
  /**
   * Standing caveat, rendered by the page rather than left in the markdown,
   * where a change to how the body is sliced could drop it without anyone
   * noticing. It is the sentence that stops the piece overclaiming.
   */
  note?: string;
};

export const posts: Post[] = [
  {
    slug: 'the-model-never-holds-the-quote',
    title: 'The model never holds the quote',
    standfirst:
      'How Bibelrösten makes a language model unable to misquote scripture, rather than merely asking it not to.',
    date: '2026-09-15',
    project: 'Bibelrösten',
    note: 'In development. The verification layer described here was built in August 2026 and has a test suite around it. Nothing is shipped to anyone yet, and the measurements are my own, from the build.',
  },
];

export function postBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Read at build time. Static export means this never runs for a visitor. */
export function postBody(slug: string): string {
  return readFileSync(join(process.cwd(), 'content', 'writing', `${slug}.md`), 'utf8');
}
