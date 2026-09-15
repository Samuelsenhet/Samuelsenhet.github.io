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

  const tone = project.status === 'building' ? 'text-brass' : 'text-jade';

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

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <article className="pt-20">
        <p className={`flex items-baseline gap-2 text-sm ${tone}`}>
          <span aria-hidden className="inline-block size-1.5 translate-y-[-0.15em] rounded-full bg-current" />
          {project.statusLabel}
          {project.status === 'shipped' && (
            <span className="tnum font-mono text-dim">version {project.marker}</span>
          )}
        </p>

        <h1 className="mt-3 text-title font-medium">{project.name}</h1>
        <p className="mt-4 max-w-[52ch] text-xl leading-snug text-mid">{project.summary}</p>

        {project.link && (
          <p className="mt-6">
            <a
              href={project.link.href}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 decoration-line hover:decoration-current"
            >
              {project.link.label}
            </a>
          </p>
        )}

        <div className="mt-12 max-w-[62ch] space-y-5">
          {project.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {project.shots && (
          /* A set, so they stay a row rather than stacking into three
             full-height phones. Fixed 220px columns that scroll sideways on a
             narrow screen; equal fractions of the prose column above 640px, so
             the row's right edge lands on the text's own measure. */
          <div className="mt-12 grid max-w-[62ch] grid-flow-col auto-cols-[220px] gap-4 overflow-x-auto pb-2 sm:auto-cols-fr sm:overflow-x-visible sm:pb-0">
            {project.shots.map((shot) => (
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                width={880}
                height={1907}
                loading="lazy"
                className="w-full rounded-lg border border-line"
              />
            ))}
          </div>
        )}

        <dl className="mt-12 max-w-[62ch] border-t border-line">
          {facts.map((f) => (
            <div
              key={f.term}
              className="grid grid-cols-1 gap-x-6 border-b border-line py-3 sm:grid-cols-[9rem_1fr]"
            >
              <dt className="text-sm text-dim">{f.term}</dt>
              <dd className="text-sm">
                {f.href ? (
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 decoration-line hover:decoration-current"
                  >
                    {f.value}
                  </a>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-16">
          <Link href="/work/" className="text-sm text-mid hover:text-text transition-colors">
            Back to all work
          </Link>
        </p>
      </article>
    </div>
  );
}
