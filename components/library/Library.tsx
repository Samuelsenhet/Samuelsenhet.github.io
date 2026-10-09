'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  bookIndexForHash,
  filterShelves,
  groupRuns,
  step,
  visibleShelves,
  volumes,
  type Decor,
  type Kind,
  type Shelf,
  type ShelfBook,
} from '@/content/library';
import { Book } from './Book';
import { BookDetail } from './BookDetail';
import { Bookend, Plant } from './Decor';
import { ShelfFilter } from './ShelfFilter';

function DecorItem({ kind }: { kind: Decor }) {
  return <li aria-hidden>{kind === 'plant' ? <Plant /> : <Bookend />}</li>;
}

export function Library({ shelves }: { shelves: Shelf[] }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<Kind | 'all'>('all');
  const shown = useMemo(() => visibleShelves(filterShelves(shelves, query, kind)), [shelves, query, kind]);
  const books = useMemo(() => shown.flatMap((s) => s.books), [shown]);
  const total = useMemo(() => shelves.reduce((n, s) => n + s.books.length, 0), [shelves]);
  // Keyed by slug: filtering changes which books are on the shelf, never which book a slug is.
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const [open, setOpen] = useState<string | null>(null);
  const position = open === null ? -1 : books.findIndex((b) => b.slug === open);

  // A link to /#maak opens MÄÄK. Deferred a frame: no setState in the effect body.
  useEffect(() => {
    const i = bookIndexForHash(window.location.hash, books);
    if (i < 0) return;
    const slug = books[i].slug;
    const id = requestAnimationFrame(() => setOpen(slug));
    return () => cancelAnimationFrame(id);
    // Only on load: later filtering must not reopen a book the visitor closed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function show(slug: string) {
    setOpen(slug);
    window.history.replaceState(null, '', `#${slug}`);
  }

  function closed() {
    const slug = open;
    setOpen(null);
    window.history.replaceState(null, '', window.location.pathname);
    if (slug !== null) buttons.current[slug]?.focus();
  }

  function bookOnShelf(b: ShelfBook) {
    return (
      <Book
        book={b}
        out={open === b.slug}
        onOpen={() => show(b.slug)}
        buttonRef={(el) => {
          buttons.current[b.slug] = el;
        }}
      />
    );
  }

  return (
    <div className="library">
      <ShelfFilter query={query} onQuery={setQuery} kind={kind} onKind={setKind} shown={books.length} total={total} />

      {shown.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-[var(--lib-dim)]">Nothing matches.</p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setKind('all');
            }}
            className="mt-4 min-h-11 px-4 underline underline-offset-4"
          >
            Show everything
          </button>
        </div>
      )}

      <div className="space-y-12">
        {shown.map((shelf) => (
          <section key={shelf.id} aria-labelledby={`shelf-${shelf.id}`}>
            <p className="text-center font-mono text-sm text-[var(--lib-dim)]">{shelf.label}</p>
            <h2 id={`shelf-${shelf.id}`} className="mt-1 text-center text-2xl font-medium tracking-[-0.02em]">
              {shelf.title}
            </h2>
            <p className="mt-1 flex items-baseline justify-center gap-2 font-mono text-sm text-[var(--lib-dim)]">
              <span
                aria-hidden
                className={`inline-block size-1.5 translate-y-[-0.1em] rounded-full ${shelf.id === 'progress' ? 'bg-brass' : 'bg-jade'}`}
              />
              {volumes(shelf.books.length)}
            </p>
            <ul className="lib-row">
              {shelf.start && <DecorItem kind={shelf.start} />}
              {groupRuns(shelf.books).map((item) =>
                Array.isArray(item) ? (
                  <li key={item.map((b) => b.slug).join('+')}>
                    <ul className="lib-pile">
                      {item.map((b) => (
                        <li key={b.slug} className="settle" style={{ animationDelay: `${120 + b.index * 90}ms` }}>
                          {bookOnShelf(b)}
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.slug} className="settle" style={{ animationDelay: `${120 + item.index * 90}ms` }}>
                    {bookOnShelf(item)}
                  </li>
                ),
              )}
              {shelf.end && <DecorItem kind={shelf.end} />}
            </ul>
            <div className="lib-ledge" />
          </section>
        ))}
      </div>

      {position >= 0 && (
        <BookDetail
          books={books}
          index={position}
          sourceRect={() => (open ? (buttons.current[open]?.getBoundingClientRect() ?? null) : null)}
          onStep={(d) => show(books[step(position, d, books.length)].slug)}
          onClosed={closed}
        />
      )}
    </div>
  );
}
