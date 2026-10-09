import { KINDS, type Kind } from '@/content/library';

type Props = {
  query: string;
  onQuery: (q: string) => void;
  kind: Kind | 'all';
  onKind: (k: Kind | 'all') => void;
  /** Books shown and books in all, for the announcement under the buttons. */
  shown: number;
  total: number;
};

const LABEL: Record<Kind | 'all', string> = { all: 'All', app: 'App', ai: 'AI', web: 'Web', people: 'People' };

/** The search box and the kind buttons above the shelves. Plain text search: no server on this site. */
export function ShelfFilter({ query, onQuery, kind, onKind, shown, total }: Props) {
  return (
    <div className="mb-10">
      <label htmlFor="shelf-search" className="sr-only">
        Search the shelves
      </label>
      <input
        id="shelf-search"
        type="search"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="What are you looking for?"
        autoComplete="off"
        className="block w-full border-b border-[var(--lib-dim)] bg-transparent py-2 text-left text-lg placeholder:text-[var(--lib-dim)]"
      />
      <ul className="mt-6 flex flex-wrap gap-2">
        {(['all', ...KINDS] as const).map((k) => (
          <li key={k}>
            <button
              type="button"
              aria-pressed={kind === k}
              onClick={() => onKind(k)}
              className={`min-h-11 min-w-11 rounded-full border px-3 font-mono text-xs uppercase tracking-[0.14em] transition-colors sm:px-4 sm:tracking-[0.2em] ${
                kind === k
                  ? 'border-[var(--lib-text)] bg-[var(--lib-card)] text-[var(--lib-text)]'
                  : 'border-[var(--lib-line)] text-[var(--lib-dim)] hover:text-[var(--lib-text)]'
              }`}
            >
              {LABEL[k]}
            </button>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="sr-only">
        {shown} of {total}
      </p>
    </div>
  );
}
