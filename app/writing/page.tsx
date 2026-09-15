import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/content/writing';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on how the work is actually built.',
};

const month = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

export default function Writing() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <section className="pt-20 pb-12">
        <h1 className="text-title font-medium">Writing</h1>
        <p className="mt-4 max-w-[58ch] text-mid">
          Notes on how the work is actually built. Fewer than I would like, and only about things I
          have measured.
        </p>
      </section>

      <ul className="border-t border-line">
        {posts.map((p) => (
          <li key={p.slug} className="border-b border-line">
            <Link href={`/writing/${p.slug}/`} className="group block py-5">
              <span className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-lg font-medium tracking-tight group-hover:text-mid transition-colors">
                  {p.title}
                </span>
                <span className="tnum font-mono text-xs text-dim">
                  {month.format(new Date(p.date))}
                </span>
              </span>
              <span className="mt-1 block max-w-[62ch] text-sm text-mid">{p.standfirst}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
