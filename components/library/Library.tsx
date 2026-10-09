'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { bookIndexForHash, groupRuns, step, visibleShelves, volumes, type Decor, type Shelf } from '@/content/library';
import { Book } from './Book';
import { BookDetail } from './BookDetail';
import { Bookend, Plant } from './Decor';

function DecorItem({ kind }: { kind: Decor }) {
  return <li aria-hidden>{kind === 'plant' ? <Plant /> : <Bookend />}</li>;
}

export function Library({ shelves }: { shelves: Shelf[] }) {
  const shown = useMemo(() => visibleShelves(shelves), [shelves]);
  const total = shown.reduce((n, s) => n + s.books.length, 0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const books = useMemo(() => shown.flatMap((s) => s.books), [shown]);

  // A link to /library/#maak opens MÄÄK. Deferred a frame: no setState in the effect body.
  useEffect(() => {
    const i = bookIndexForHash(window.location.hash, books);
    if (i < 0) return;
    const id = requestAnimationFrame(() => setOpen(i));
    return () => cancelAnimationFrame(id);
  }, [books]);

  function show(i: number) {
    setOpen(i);
    window.history.replaceState(null, '', `#${books[i].slug}`);
  }

  function closed() {
    const i = open;
    setOpen(null);
    window.history.replaceState(null, '', window.location.pathname);
    if (i !== null) buttons.current[i]?.focus();
  }

  return (
    <div className="library lib-grain pb-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <header className="pt-20 pb-4 text-center">
          <p className="font-mono text-sm text-[var(--lib-dim)]">A personal archive</p>
          <h1 className="mt-3 text-[clamp(2.25rem,6vw,3.25rem)] font-medium leading-[0.97] tracking-[-0.04em]">
            Things I&rsquo;ve made
          </h1>
          <p className="mt-3 font-mono text-sm text-[var(--lib-dim)]">{volumes(total)}</p>
        </header>

        {shown.map((shelf) => (
          <section key={shelf.id} aria-labelledby={`shelf-${shelf.id}`} className="mt-12">
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
                          <Book
                            book={b}
                            out={open === b.index}
                            onOpen={() => show(b.index)}
                            buttonRef={(el) => {
                              buttons.current[b.index] = el;
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.slug} className="settle" style={{ animationDelay: `${120 + item.index * 90}ms` }}>
                    <Book
                      book={item}
                      out={open === item.index}
                      onOpen={() => show(item.index)}
                      buttonRef={(el) => {
                        buttons.current[item.index] = el;
                      }}
                    />
                  </li>
                ),
              )}
              {shelf.end && <DecorItem kind={shelf.end} />}
            </ul>
            <div className="lib-ledge" />
          </section>
        ))}
      </div>
      {open !== null && (
        <BookDetail
          books={books}
          index={open}
          sourceRect={() => buttons.current[open]?.getBoundingClientRect() ?? null}
          onStep={(d) => show(step(open, d, books.length))}
          onClosed={closed}
        />
      )}
    </div>
  );
}
