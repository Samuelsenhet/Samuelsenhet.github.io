import type { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/content/projects';
import { Ledger } from '@/components/Ledger';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Three products: one in the App Store, two in development.',
};

export default function Work() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <section className="pt-20 pb-12">
        <h1 className="text-title font-medium">Work</h1>
        <p className="mt-4 max-w-[58ch] text-mid">
          Three products. One is in the App Store, two are still being built. Nothing here is open
          source yet, and none of it claims to be.
        </p>
      </section>

      <Ledger projects={projects} />

      <div className="mt-14 space-y-12">
        {projects.map((p) => (
          <article key={p.slug} className="max-w-[62ch]">
            <h2 className="text-xl font-medium tracking-tight">{p.name}</h2>
            <p className="mt-2 text-mid">{p.summary}</p>
            <p className="mt-3 font-mono text-xs text-dim">{p.stack.join(', ')}</p>
            <p className="mt-3">
              <Link
                href={`/work/${p.slug}/`}
                className="text-sm underline underline-offset-4 decoration-line hover:decoration-current"
              >
                More about {p.name}
              </Link>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
