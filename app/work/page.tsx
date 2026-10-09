import type { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/content/projects';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Six things: one app in the App Store, a circle that has met for three years, and four apps in development.',
};

export default function Work() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <section className="pt-20 pb-12">
        <h1 className="text-title font-medium">Work</h1>
        <p className="mt-4 max-w-[58ch] text-mid">
          Six things. One is in the App Store, one has been meeting for three years, and four are
          still being built. None of the code is open source yet, and none of it claims to be.
        </p>
      </section>

      {/* Each project once, opening with its state. Colour is data here, as on
          the home page shelf: jade means a person can use it today, brass means
          not yet. Each article settles in once on load. */}
      <div className="space-y-12">
        {projects.map((p, i) => (
          <article key={p.slug} className="settle max-w-[62ch]" style={{ animationDelay: `${120 + i * 90}ms` }}>
            <p className={`flex items-baseline gap-2 text-sm ${p.status === 'building' ? 'text-brass' : 'text-jade'}`}>
              <span aria-hidden className="inline-block size-1.5 translate-y-[-0.15em] rounded-full bg-current" />
              {p.statusLabel}
              {p.marker && <span className="tnum font-mono text-xs text-dim">{p.marker}</span>}
            </p>
            <h2 className="mt-2 text-xl font-medium tracking-tight">{p.name}</h2>
            <p className="mt-2 text-mid">{p.summary}</p>
            {p.stack.length > 0 && (
              <p className="mt-3 font-mono text-xs text-dim">{p.stack.join(', ')}</p>
            )}
            <p className="mt-3">
              <Link
                href={`/work/${p.slug}/`}
                className="tap text-sm underline underline-offset-4 decoration-line hover:decoration-current"
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
