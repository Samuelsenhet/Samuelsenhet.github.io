import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, projectBySlug } from '@/content/projects';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
    openGraph: { title: project.name, description: project.summary },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const tone = project.status === 'building' ? 'bg-brass' : 'bg-jade';
  const i = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  // Software says whether its source is open, and says it from one field, so
  // opening a project is a data edit rather than a copy edit.
  const facts =
    project.isSoftware === false
      ? project.facts
      : [
          ...project.facts,
          project.repo
            ? { term: 'Source', value: project.repo.replace(/^https?:\/\/(www\.)?/, ''), href: project.repo }
            : { term: 'Source', value: 'Private' },
        ];

  /* sen-3d-resume's work detail (ui/Works.tsx WorkDetail, MIT, Copyright (c)
     2026 Sen Zheng) as a page of its own: a sheet with a banner, the head,
     the words, the facts and a way out. Pictures come before the long text. */
  return (
    <section className="detail">
      <article className="sheet rv">
        <Link href="/work/" className="sheet-close" aria-label="Back to all work">
          <span aria-hidden>✕</span>
        </Link>
        <div className="banner" aria-hidden>
          <span>{project.name}</span>
        </div>
        <div className="article">
          <header className="article-head">
            <h1 className="article-title">{project.name}</h1>
            <p className="article-sub">
              <span aria-hidden className={`inline-block size-1.5 translate-y-[-0.1em] rounded-full ${tone}`} />
              {project.statusLabel}
              {project.status === 'shipped' && <span className="tnum">· version {project.marker}</span>}
            </p>
            {project.stack.length > 0 && (
              <ul className="badges">
                {project.stack.map((t) => (
                  <li key={t} className="badge">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </header>

          <p className="serif-lede">{project.summary}</p>

          {project.shots && (
            /* A set, so they stay a row rather than stacking into three
               full-height phones; they scroll sideways on a narrow screen. */
            <div className="shots">
              {project.shots.map((shot) => (
                /* A static export with images.unoptimized, and these are
                   already WebP at the size they render. */
                // eslint-disable-next-line @next/next/no-img-element
                <img key={shot.src} src={shot.src} alt={shot.alt} width={880} height={1907} loading="lazy" />
              ))}
            </div>
          )}

          <div className="md">
            {project.body.map((paragraph, k) => (
              <p key={k}>{paragraph}</p>
            ))}
          </div>

          <dl className="facts">
            {facts.map((f) => (
              <div key={f.term} className="foot-line">
                <dt className="foot-label">{f.term}</dt>
                <dd>
                  {f.href ? (
                    <a href={f.href} target="_blank" rel="noreferrer" className="tap">
                      {f.value}
                    </a>
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {project.link && (
            <a className="visit" href={project.link.href} target="_blank" rel="noreferrer">
              {project.link.label} <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </article>
      <nav className="pager" aria-label="More work">
        <Link href={`/work/${prev.slug}/`} className="tap">
          ← {prev.name}
        </Link>
        <Link href={`/work/${next.slug}/`} className="tap">
          {next.name} →
        </Link>
      </nav>
    </section>
  );
}
