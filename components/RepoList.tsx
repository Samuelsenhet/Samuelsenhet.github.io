import { getRepos } from '@/lib/github';

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'short',
});

/**
 * Public repositories only, read from the file written at build time.
 * When the list is empty the section says so plainly rather than rendering
 * an empty shell.
 */
export function RepoList() {
  const { repos } = getRepos();

  if (repos.length === 0) {
    return (
      <p className="text-mid">
        Nothing public here yet. The projects above are closed source while they find their feet.
      </p>
    );
  }

  return (
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
  );
}
