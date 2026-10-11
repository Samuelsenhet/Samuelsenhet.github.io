import type { Metadata } from 'next';
import Link from 'next/link';
import { posts } from '@/content/writing';
import { PageHead } from '@/components/PageHead';

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes on how the work is actually built.',
};

const month = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

/** sen-3d-resume's hairline list (ui/Works.tsx WorkLine): the title left, the month right, an indent on hover. */
export default function Writing() {
  return (
    <section className="page">
      <PageHead kicker="Notes" title="Writing">
        <p>Notes on how the work is actually built. Fewer than I would like, and only about things I have measured.</p>
      </PageHead>

      {posts.length > 0 ? (
        <ul className="list rv">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/writing/${p.slug}/`}>
                <span>
                  <span className="list-title">{p.title}</span>
                  <span className="list-sub">{p.standfirst}</span>
                </span>
                <span className="list-when">
                  <span className="list-month tnum">{month.format(new Date(p.date))}</span>
                  {p.project && <span className="list-tag">{p.project}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="list-empty rv">Nothing here yet.</p>
      )}
    </section>
  );
}
