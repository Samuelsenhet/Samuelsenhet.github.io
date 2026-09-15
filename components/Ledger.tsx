import Link from 'next/link';
import type { Project } from '@/content/projects';

/**
 * The state of the work, as a ledger. This is the page's one loud element:
 * colour here is data, not decoration. Jade means shipped, brass means in
 * progress, and nothing else on the site uses either colour.
 */
export function Ledger({ projects }: { projects: Project[] }) {
  return (
    <ul className="border-t border-line">
      {projects.map((p, i) => (
        <li key={p.slug} className="settle border-b border-line" style={{ animationDelay: `${120 + i * 90}ms` }}>
          <Link
            href={`/work/${p.slug}/`}
            className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 py-4 sm:grid-cols-[1fr_4rem_13rem]"
          >
            <span className="text-lg font-medium tracking-tight group-hover:text-mid transition-colors">
              {p.name}
            </span>
            <span className="tnum font-mono text-sm text-dim sm:text-right">{p.marker}</span>
            <span
              className={`col-span-2 flex items-baseline gap-2 text-sm sm:col-span-1 ${
                p.status === 'shipped' ? 'text-jade' : 'text-brass'
              }`}
            >
              <span
                aria-hidden
                className="inline-block size-1.5 translate-y-[-0.15em] rounded-full bg-current"
              />
              {p.statusLabel}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
