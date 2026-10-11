import Link from 'next/link';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import { bookLooks, buildShelves } from '@/content/library';
import { HomeScene } from '@/components/home/HomeScene';
import { Resume } from '@/components/home/Resume';
import { RepoList } from '@/components/RepoList';

/**
 * The home page as a 3D résumé (D-002), after dayinji/sen-3d-resume: the
 * figure behind, an About over it, then the timeline the camera follows.
 * Everything here is plain HTML; the figure arrives after it, if it can.
 */
export default function Home() {
  return (
    <>
      <HomeScene />

      <section className="hero">
        <div className="about" id="about">
          <div className="about-intro">
            <h1 className="about-title" id="about-title">
              About {profile.name}
            </h1>
            <p className="about-body" id="about-body">
              I&rsquo;m {profile.name}, a builder in {profile.location} who takes a product the whole way: the
              interface, the database, the release, the store listing, and the words. I build apps on my own, and I
              run a room where men talk.
            </p>
          </div>
        </div>
        <div className="scroll-cue" id="scroll-cue" aria-hidden>
          <span className="scroll-cue-label">Scroll</span>
          <span className="scroll-cue-track">
            <span className="scroll-cue-dot" />
          </span>
        </div>
      </section>

      <Resume shelves={buildShelves(projects, bookLooks)} />

      {/* With no nav on this page, these are the site's navigation. */}
      <nav aria-label="Sections" className="home-links">
        <ul>
          {[
            { href: '/work/', label: 'My work' },
            { href: '/writing/', label: 'My writing' },
            { href: '/about/', label: 'About me' },
            { href: '/contact/', label: 'Contact me' },
          ].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="tap rv">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="home-code">
        <RepoList />
      </div>
    </>
  );
}
