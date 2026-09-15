import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { posts, postBySlug, postBody } from '@/content/writing';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.standfirst,
    openGraph: { type: 'article', title: post.title, description: post.standfirst },
  };
}

const month = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

export default async function Post({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  // The markdown file already opens with the title and standfirst, which the
  // page renders itself, so drop everything above the first rule.
  const raw = postBody(slug);
  const body = raw.slice(raw.indexOf('\n---\n') + 5);
  const html = await marked.parse(body, { gfm: true, async: true });

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <article className="pt-20">
        <p className="flex flex-wrap items-baseline gap-x-3 text-sm text-dim">
          <span className="tnum font-mono text-xs">{month.format(new Date(post.date))}</span>
          {post.project && <span>{post.project}</span>}
        </p>

        <h1 className="mt-3 text-title font-medium">{post.title}</h1>
        <p className="mt-4 max-w-[52ch] text-xl leading-snug text-mid">{post.standfirst}</p>

        {post.note && (
          <p className="mt-8 max-w-[62ch] border-l-2 border-brass pl-4 text-sm text-mid">
            {post.note}
          </p>
        )}

        <div className="prose mt-12 max-w-[62ch]" dangerouslySetInnerHTML={{ __html: html }} />

        <p className="mt-16">
          <Link href="/writing/" className="text-sm text-mid hover:text-text transition-colors">
            Back to writing
          </Link>
        </p>
      </article>
    </div>
  );
}
