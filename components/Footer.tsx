import { profile } from '@/content/profile';

export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto flex max-w-3xl flex-wrap items-baseline gap-x-6 gap-y-2 px-5 py-8 text-sm text-dim sm:px-8">
        <span>
          {profile.name}, {profile.location}
        </span>
        <a
          href={profile.github}
          className="hover:text-text transition-colors"
          rel="me noreferrer"
          target="_blank"
        >
          github.com/{profile.handle}
        </a>
        <a
          href={`${profile.github}/Samuelsenhet.github.io`}
          className="ml-auto hover:text-text transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          Source of this site
        </a>
      </div>
    </footer>
  );
}
