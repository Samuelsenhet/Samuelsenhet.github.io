import type { CSSProperties } from 'react';
import { bookLabel, type ShelfBook } from '@/content/library';
import { Cover } from './Cover';

type Props = {
  book: ShelfBook;
  /** True while this book is out in the detail view: its place stays, empty. */
  out: boolean;
  onOpen: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
};

const u = (px: number) => `calc(var(--u) * ${px}px)`;

export function Book({ book, out, onOpen, buttonRef }: Props) {
  const { look } = book;
  const style = {
    '--book-color': look.color,
    '--book-ink': look.ink,
    '--book-band': look.band ?? look.ink,
    '--rest': look.pose === 'cover' ? `rotate(${look.tilt ?? 0}deg)` : 'none',
  } as CSSProperties;
  const lettering =
    look.face === 'mono'
      ? 'font-mono text-[11px] uppercase tracking-[0.14em]'
      : look.caps
        ? 'font-sans text-[12px] font-semibold uppercase tracking-[0.12em]'
        : 'font-sans text-[15px] font-medium tracking-[-0.01em]';

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      aria-label={bookLabel(book)}
      data-pose={look.pose}
      data-out={out}
      className="lib-book"
      style={style}
    >
      <span
        aria-hidden
        className={`lib-body lib-${look.pose}`}
        style={{ width: u(look.width), height: u(look.height) }}
      >
        {look.pose === 'cover' ? (
          <Cover book={book} />
        ) : (
          <>
            {look.band && look.pose === 'spine' && (
              <>
                <span className="lib-band" style={{ top: 12 }} />
                <span className="lib-band" style={{ top: 18 }} />
              </>
            )}
            <span className={`lib-title ${lettering}`}>{book.name}</span>
            {book.marker && look.pose === 'spine' && <span className="lib-foot font-mono">{book.marker}</span>}
          </>
        )}
      </span>
      <span aria-hidden className="lib-card">
        <span className="flex items-baseline gap-2 font-mono text-[11px] text-[var(--lib-dim)]">
          <span
            className={`inline-block size-1.5 translate-y-[-0.1em] rounded-full ${book.status === 'building' ? 'bg-brass' : 'bg-jade'}`}
          />
          {book.statusLabel}
        </span>
        <span className="mt-1 block text-lg font-medium tracking-tight">{book.name}</span>
        <span className="mt-1 block text-[13px] leading-snug text-[var(--lib-dim)]">{book.summary}</span>
      </span>
    </button>
  );
}
