'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { profile } from '@/content/profile';

const links = [
  { href: '/work/', label: 'Work' },
  { href: '/writing/', label: 'Writing' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

/**
 * sen-3d-resume's credit line (styles.css .credit, MIT, Copyright (c) 2026
 * Sen Zheng), used as the navigation: centred at the top, small letterspaced
 * capitals, quiet until current. Each link keeps a 44px tap through `.tap`.
 *
 * The home page carries these links in its body instead, so there is no nav
 * there: it would sit on top of the 3D figure and the About.
 */
export function Nav() {
  const pathname = usePathname() ?? '/';
  if (pathname === '/') return null;

  return (
    <header className="credit">
      <Link href="/" className="credit-home tap">
        {profile.name}
      </Link>
      <span className="credit-sep" aria-hidden />
      <nav aria-label="Main">
        <ul className="credit-links">
          {links.map((l) => {
            // /work/ stays current while reading a project under it.
            const active = pathname === l.href || pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link href={l.href} className="tap" aria-current={active ? 'page' : undefined}>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
