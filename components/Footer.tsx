import { profile } from '@/content/profile';

/** The credit line again, at the end of every page. */
export function Footer() {
  return (
    <footer className="site-foot">
      <span>
        {profile.name} · {profile.location}
      </span>
      <span className="credit-sep" aria-hidden />
      <a href={profile.github} className="tap" rel="me noreferrer" target="_blank">
        github.com/{profile.handle}
      </a>
      <span className="credit-sep" aria-hidden />
      <a href={`${profile.github}/Samuelsenhet.github.io`} className="tap" target="_blank" rel="noreferrer">
        Source of this site
      </a>
    </footer>
  );
}
