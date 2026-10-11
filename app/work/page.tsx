import type { Metadata } from 'next';
import Link from 'next/link';
import { projects } from '@/content/projects';
import { volumes } from '@/content/library';
import { PageHead } from '@/components/PageHead';
import { WorkGallery } from '@/components/WorkGallery';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Six things: one app in the App Store, a circle that has met for three years, and four apps in development.',
};

const no = (i: number) => String(i + 1).padStart(2, '0');

/**
 * Each project once, as a card in sen-3d-resume's gallery: number and state,
 * name and summary, a picture where there is one, four facts as hairline
 * lines, then state and stack. Colour is data, as everywhere on the site:
 * jade can be used today, brass not yet.
 */
export default function Work() {
  return (
    <WorkGallery>
      <div className="intro-card">
        <PageHead kicker={volumes(projects.length)} title="Work">
          <p>
            Six things. One is in the App Store, one has been meeting for three years, and four are still being
            built. None of the code is open source yet, and none of it claims to be.
          </p>
        </PageHead>
      </div>
      {projects.map((p, i) => {
        const tone = p.status === 'building' ? 'text-brass' : 'text-jade';
        return (
          <Link key={p.slug} href={`/work/${p.slug}/`} className="card">
            <div>
              <span className="card-no tnum">
                {no(i)}
                <span aria-hidden className={`inline-block size-1.5 rounded-full bg-current ${tone}`} />
              </span>
              <h2 className="card-title">{p.name}</h2>
              <span className="card-tagline">{p.summary}</span>
            </div>
            <div className="card-cover">
              {p.shots ? (
                // A static export with images.unoptimized: next/image would add nothing here.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.shots[0].src} alt="" loading="lazy" />
              ) : (
                <span className="cover-ph" aria-hidden>
                  {no(i)}
                </span>
              )}
            </div>
            <ul className="lines">
              {p.facts.slice(0, 4).map((f) => (
                <li key={f.term}>
                  <span className="line-name">{f.value}</span>
                  <span className="line-tag">{f.term}</span>
                </li>
              ))}
            </ul>
            <div className="card-foot">
              <p className="foot-line">
                <span className="foot-label">State</span>
                <span className={tone}>
                  {p.statusLabel}
                  {p.marker && ` · ${p.marker}`}
                </span>
              </p>
              {p.stack.length > 0 && (
                <p className="foot-line">
                  <span className="foot-label">Stack</span>
                  {p.stack.join(' · ')}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </WorkGallery>
  );
}
