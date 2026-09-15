import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <div className="max-w-[52ch] pt-20">
        <h1 className="text-title font-medium">This page does not exist</h1>
        <p className="mt-4 text-mid">
          The link is wrong or the page has moved. The work is all reachable from one place.
        </p>
        <p className="mt-6">
          <Link href="/work/" className="underline underline-offset-4 decoration-line hover:decoration-current">
            Go to the work
          </Link>
        </p>
      </div>
    </div>
  );
}
