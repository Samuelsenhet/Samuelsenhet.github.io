import Link from 'next/link';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { Ledger } from '@/components/Ledger';
import { RepoList } from '@/components/RepoList';

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <section className="pt-20 pb-16 sm:pt-24">
        <h1 className="text-display font-bold [text-wrap:balance]">
          Hey, I&rsquo;m Samuel. I build{' '}
          <Link href="/work/" className="underline decoration-[0.08em] underline-offset-[0.12em]">
            apps
          </Link>{' '}
          on my own, and I run a room where men talk.
        </h1>
      </section>

      <section aria-labelledby="state" className="pb-16">
        <h2 id="state" className="sr-only">
          The state of the work
        </h2>
        <Ledger projects={projects} />
      </section>

      {/* With no nav on this page, these are the site's navigation. Set large
          enough to be unmissable, underlined so they cannot be mistaken for
          headings, and no arrows: that is someone else's ornament. */}
      <nav aria-label="Sections" className="pb-16">
        <ul className="space-y-2 text-xl sm:text-2xl">
          {[
            { href: '/work/', label: 'My work' },
            { href: '/about/', label: 'About me' },
            { href: '/contact/', label: 'Contact me' },
          ].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-medium underline decoration-dim decoration-[0.06em] underline-offset-[0.14em] transition-colors hover:decoration-current"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="max-w-[62ch] pb-16">
        <p className="text-mid">
          I am a builder in {profile.location} who takes a product the whole way: the interface, the
          database, the release, the store listing, and the words. Right now that means an app about
          knowing yourself, a voice that cannot misquote scripture, and a marketplace that runs
          backwards. The oldest thing on this list is not software at all, but a room where men sit
          down and talk.
        </p>
      </section>

      <section aria-labelledby="code" className="pb-8">
        <h2 id="code" className="text-sm text-dim mb-4">
          Public code
        </h2>
        <RepoList />
      </section>
    </div>
  );
}
