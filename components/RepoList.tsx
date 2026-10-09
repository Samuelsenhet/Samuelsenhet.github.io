import { getRepos } from '@/lib/github';
import { profile } from '@/content/profile';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'short',
});

/**
 * The "Public code" section: public repositories only, read from the file
 * written at build time. This site's own repo is already the footer's
 * "Source of this site", so while it is the only public one there is no
 * section at all rather than the same link twice.
 */
export function RepoList() {
  const { repos } = getRepos();
  const site = `${profile.handle}.github.io`.toLowerCase();
  if (!repos.some((r) => r.name.toLowerCase() !== site)) return null;

  return (
    <section aria-labelledby="code" className="pb-8">
      <h2 id="code" className="text-sm text-dim mb-4">
        Public code
      </h2>
      <ul className="border-t border-line">
        {repos.map((r) => (
          <li key={r.name} className="border-b border-line">
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 py-4"
            >
              <span className="font-mono text-[0.95rem] group-hover:text-mid transition-colors">
                {r.name}
              </span>
              <span className="tnum font-mono text-xs text-dim">
                {dateFormat.format(new Date(r.updated))}
              </span>
              <span className="col-span-2 text-sm text-mid">
                {r.description ?? (r.language ? `Written in ${r.language}.` : 'No description yet.')}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
