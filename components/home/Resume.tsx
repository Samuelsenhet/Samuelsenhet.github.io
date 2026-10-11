'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { bookIndexForHash, groupRuns, step, volumes, type Shelf, type ShelfBook } from '@/content/library';
import { Book } from '@/components/library/Book';
import { BookDetail } from '@/components/library/BookDetail';
import { Cover } from '@/components/library/Cover';
import { Bookend } from '@/components/library/Decor';

/**
 * When each live thing started. The résumé reads oldest first, as
 * sen-3d-resume's does; anything live that is missing here goes last.
 */
const SINCE: Record<string, string> = {
  'prata-oppet': '2023 – Now',
  maak: '2026 – Now',
};

const dot = (book: ShelfBook) => (book.status === 'building' ? 'bg-brass' : 'bg-jade');

/**
 * The résumé timeline (sen-3d-resume ui/Resume.tsx, MIT, Copyright (c) 2026
 * Sen Zheng), with the site's own books in it. What is live gets a row and
 * its cover; everything in progress stands together on one small shelf,
 * which keeps the shelf's behaviour from D-001: lift, card, open book.
 * Each row carries data-point focus-N, the stop the 3D camera turns to.
 */
export function Resume({ shelves }: { shelves: Shelf[] }) {
  const books = shelves.flatMap((s) => s.books);
  const live = [...(shelves.find((s) => s.id === 'live')?.books ?? [])].sort(
    (a, b) => (SINCE[a.slug] ? 0 : 1) - (SINCE[b.slug] ? 0 : 1) || (SINCE[a.slug] ?? '').localeCompare(SINCE[b.slug] ?? ''),
  );
  const progress = shelves.find((s) => s.id === 'progress')?.books ?? [];

  // Keyed by slug, like the Library: a slug always names the same book.
  const buttons = useRef<Record<string, HTMLElement | null>>({});
  const [open, setOpen] = useState<string | null>(null);
  const position = open === null ? -1 : books.findIndex((b) => b.slug === open);

  // A link to /#maak opens MÄÄK, as it did with the shelf. Deferred a frame: no setState in the effect body.
  useEffect(() => {
    const i = bookIndexForHash(window.location.hash, books);
    if (i < 0) return;
    const slug = books[i].slug;
    const id = requestAnimationFrame(() => setOpen(slug));
    return () => cancelAnimationFrame(id);
    // Only on load: a book the visitor put back must not reopen.
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
    if (slug !== null) buttons.current[slug]?.focus({ preventScroll: true });
  }

  const ref = (slug: string) => (el: HTMLElement | null) => {
    buttons.current[slug] = el;
  };

  return (
    <section className="resume library" aria-labelledby="resume-title">
      <h2 id="resume-title" className="resume-title rv">
        Résumé
      </h2>
      <div className="timeline">
        {live.map((book, i) => (
          <div key={book.slug} className="tl-entry" data-point={`focus-${i + 1}`}>
            <span className={`tl-dot rv ${dot(book)}`} aria-hidden />
            <div className="tl-body">
              {SINCE[book.slug] && <div className="tl-period rv">{SINCE[book.slug]}</div>}
              <div className="tl-head rv">
                <button
                  ref={ref(book.slug)}
                  type="button"
                  className="tl-chip"
                  data-out={open === book.slug}
                  onClick={() => show(book.slug)}
                  aria-label={`Open ${book.name}`}
                  style={{ '--book-color': book.look.color, '--book-ink': book.look.ink } as CSSProperties}
                >
                  <span className="lib-body lib-cover block h-full w-full" aria-hidden>
                    <Cover book={book} />
                  </span>
                </button>
                <h3 className="tl-place">{book.name}</h3>
              </div>
              <p className="tl-status rv">
                <span aria-hidden className={`inline-block size-1.5 translate-y-[-0.15em] rounded-full ${dot(book)}`} />
                {book.statusLabel}
              </p>
              <p className="tl-summary rv">{book.summary}</p>
              <button type="button" className="tl-open rv" onClick={() => show(book.slug)}>
                Open the book
              </button>
            </div>
          </div>
        ))}

        {progress.length > 0 && (
          <div className="tl-entry" data-point={`focus-${live.length + 1}`}>
            <span className="tl-dot rv bg-brass" aria-hidden />
            <div className="tl-body">
              <div className="tl-period rv">Now</div>
              <div className="tl-head rv">
                <h3 className="tl-place">In progress</h3>
                <p className="tl-count">
                  <span aria-hidden className="inline-block size-1.5 translate-y-[-0.1em] rounded-full bg-brass" />
                  {volumes(progress.length)}
                </p>
              </div>
              {/* The shelf, as on the old home page: a bookend, then the books, flat ones in one pile. */}
              <div className="mini-shelf rv">
                <ul className="lib-row">
                  <li aria-hidden>
                    <Bookend />
                  </li>
                  {groupRuns(progress).map((item) =>
                    Array.isArray(item) ? (
                      <li key={item.map((b) => b.slug).join('+')}>
                        <ul className="lib-pile">
                          {item.map((b) => (
                            <li key={b.slug}>
                              <Book book={b} out={open === b.slug} onOpen={() => show(b.slug)} buttonRef={ref(b.slug)} />
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li key={item.slug}>
                        <Book book={item} out={open === item.slug} onOpen={() => show(item.slug)} buttonRef={ref(item.slug)} />
                      </li>
                    ),
                  )}
                </ul>
                <div className="lib-ledge" />
              </div>
            </div>
          </div>
        )}
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
    </section>
  );
}
