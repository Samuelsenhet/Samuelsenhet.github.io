import { profile } from '@/content/profile';
import { coverTitleSize, shortStatus, type ShelfBook } from '@/content/library';

/**
 * A typeset cover. Sizes are container units, so the same cover reads at
 * 146px on the shelf and at 420px when the book is open.
 */
export function Cover({ book }: { book: ShelfBook }) {
  return (
    <span className="flex h-full flex-col justify-between p-[11cqw] pl-[12cqw]">
      <span>
        <span className="block font-mono text-[5.5cqw] tracking-[0.08em] opacity-85">{profile.name}</span>
        <span className="my-[5cqw] block h-px bg-current opacity-40" />
        <span
          className="block font-medium leading-[0.95] tracking-[-0.04em]"
          style={{ fontSize: `${coverTitleSize(book.name)}cqw` }}
        >
          {book.name}
        </span>
      </span>
      <span className="block font-mono text-[5.5cqw] tracking-[0.08em] opacity-85">
        ● {shortStatus(book.status)}
        {book.marker && ` · ${book.marker}`}
      </span>
    </span>
  );
}
