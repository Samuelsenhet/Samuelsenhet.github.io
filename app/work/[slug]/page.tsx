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

        <dl className="mt-12 max-w-[62ch] border-t border-line">
          {project.facts.map((f) => (
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
