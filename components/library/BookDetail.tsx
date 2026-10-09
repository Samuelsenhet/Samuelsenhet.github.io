'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import type { ShelfBook } from '@/content/library';
import { Cover } from './Cover';

type Props = {
  books: ShelfBook[];
  index: number;
  /** Where the current book stands on the shelf, or null when it cannot be measured. */
  sourceRect: () => DOMRect | null;
  onStep: (delta: number) => void;
  onClosed: () => void;
};

const OPEN_MS = 650;
const CLOSE_MS = 400;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** The transform that lays the open cover exactly over the book on the shelf. */
function flightFrom(book: ShelfBook, from: DOMRect, to: DOMRect): string {
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  const move = `translate(${dx}px, ${dy}px)`;
  if (book.look.pose === 'spine') {
    // A spine is the cover seen edge-on.
    return `${move} scale(${from.height / to.height}) rotateY(-80deg)`;
  }
  if (book.look.pose === 'flat') {
    // A flat book is a spine lying down.
    return `${move} rotate(-90deg) scale(${from.width / to.height}) rotateY(-80deg)`;
  }
  return `${move} scale(${from.height / to.height}) rotate(${book.look.tilt ?? 0}deg)`;
}

export function BookDetail({ books, index, sourceRect, onStep, onClosed }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<'opening' | 'open' | 'closing'>('opening');
  const book = books[index];

  // Open once, on mount: show the dialog, then fly the cover out of the shelf.
  useLayoutEffect(() => {
    const d = dialog.current;
    const c = cover.current;
    if (!d || !c) return;
    if (!d.open) d.showModal(); // StrictMode runs this effect twice in dev
    const from = sourceRect();
    if (from && !reducedMotion()) {
      c.style.transition = 'none';
      c.style.transform = flightFrom(book, from, c.getBoundingClientRect());
      c.getBoundingClientRect(); // commit the start pose before animating
      c.style.transition = `transform ${OPEN_MS}ms ${EASE}`;
      c.style.transform = '';
    }
    const id = requestAnimationFrame(() => setPhase('open'));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once; later books arrive by onStep without a flight
  }, []);

  function close() {
    if (phase === 'closing') return;
    setPhase('closing');
    const c = cover.current;
    const from = sourceRect();
    // The dialog's close event is the only way out (onClose below), so a
    // native close, e.g. Esc before any user interaction, ends up there too.
    const finish = () => dialog.current?.close();
    if (!c || !from || reducedMotion()) {
      finish();
      return;
    }
    c.style.transition = `transform ${CLOSE_MS}ms ${EASE}`;
    c.style.transform = flightFrom(book, from, c.getBoundingClientRect());
    window.setTimeout(finish, CLOSE_MS);
  }

  const style = { '--book-color': book.look.color, '--book-ink': book.look.ink } as CSSProperties;

  return (
    <dialog
      ref={dialog}
      className="lib-detail"
      data-phase={phase}
      aria-labelledby="lib-detail-title"
      onClose={onClosed}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') onStep(-1);
        if (e.key === 'ArrowRight') onStep(1);
      }}
    >
      <div className="lib-scrim" onClick={close} />
      <div className="lib-stage">
        <div ref={cover} className="lib-detail-cover" style={style}>
          <span key={book.slug} className="lib-body lib-cover lib-swap block h-full w-full">
            <Cover book={book} />
          </span>
        </div>
        <div className="lib-detail-text max-w-[30rem]">
          <div key={book.slug} className="lib-swap">
            <p className="flex items-baseline gap-2 text-sm text-[var(--lib-dim)]">
              <span
                aria-hidden
                className={`inline-block size-1.5 translate-y-[-0.15em] rounded-full ${book.status === 'building' ? 'bg-brass' : 'bg-jade'}`}
              />
              {book.statusLabel}
            </p>
            <h2 id="lib-detail-title" className="mt-2 text-title font-medium">
              {book.name}
            </h2>
            <p className="mt-3 text-lg leading-snug text-[var(--lib-dim)]">{book.summary}</p>
            {book.facts.length > 0 && (
              <dl className="mt-6 border-t border-[var(--lib-line)]">
                {book.facts.map((f) => (
                  <div key={f.term} className="grid grid-cols-[8rem_1fr] gap-x-4 border-b border-[var(--lib-line)] py-2">
                    <dt className="text-sm text-[var(--lib-dim)]">{f.term}</dt>
                    <dd className="text-sm">
                      {f.href ? (
                        <a href={f.href} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                          {f.value}
                        </a>
                      ) : (
                        f.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="mt-6">
              <Link href={`/work/${book.slug}/`} className="underline underline-offset-4">
                More about {book.name}
              </Link>
            </p>
          </div>
          <div className="mt-8 flex gap-2">
            <button type="button" onClick={() => onStep(-1)} className="min-h-11 min-w-11 rounded border border-[var(--lib-line)] px-4 text-sm">
              Previous
            </button>
            <button type="button" onClick={() => onStep(1)} className="min-h-11 min-w-11 rounded border border-[var(--lib-line)] px-4 text-sm">
              Next
            </button>
            <button
              type="button"
              onClick={close}
              autoFocus
              className="ml-auto min-h-11 min-w-11 rounded border border-[var(--lib-line)] px-4 text-sm"
            >
              Put it back
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
