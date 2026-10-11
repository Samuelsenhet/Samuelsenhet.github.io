import Link from 'next/link';
import { PageHead } from '@/components/PageHead';

export default function NotFound() {
  return (
    <section className="page">
      <PageHead kicker="404" title="This page does not exist">
        <p>The link is wrong or the page has moved. The work is all reachable from one place.</p>
      </PageHead>
      <p className="rv">
        <Link href="/work/" className="visit">
          Go to the work <span aria-hidden>↗</span>
        </Link>
      </p>
    </section>
  );
}
