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
    <section className="detail">
      <article className="sheet rv">
        <Link href="/writing/" className="sheet-close" aria-label="Back to writing">
          <span aria-hidden>✕</span>
        </Link>
        <div className="banner" aria-hidden>
          <span>{post.title}</span>
        </div>
        <div className="article">
          <header className="article-head">
            <h1 className="article-title">{post.title}</h1>
            <p className="article-sub">
              <span className="tnum">{month.format(new Date(post.date))}</span>
              {post.project && <span>· {post.project}</span>}
            </p>
          </header>
          <p className="serif-lede">{post.standfirst}</p>
          {post.note && <p className="note">{post.note}</p>}
          <div className="md" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </article>
      <nav className="pager" aria-label="Writing">
        <Link href="/writing/" className="tap">
          ← All writing
        </Link>
      </nav>
    </section>
  );
}
