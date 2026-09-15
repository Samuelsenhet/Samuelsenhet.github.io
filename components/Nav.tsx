'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { profile } from '@/content/profile';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

/**
 * Deliberately quiet: small, dim, and with no rule under it, so the headline
 * below is the first thing read. The current page is the only link at full
 * strength, which is the whole active state. No underline, no pill, nothing
 * that would read as a second heading.
 */
export function Nav() {
  const pathname = usePathname() ?? '/';

  return (
    <header>
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-3xl flex-wrap items-baseline gap-x-4 gap-y-2 px-5 py-6 text-sm sm:gap-x-5 sm:px-8"
      >
        <Link
          href="/"
          className={`font-medium transition-colors ${
            pathname === '/' ? 'text-text' : 'text-dim hover:text-text'
          }`}
          aria-current={pathname === '/' ? 'page' : undefined}
        >
          {profile.name}
        </Link>
        <ul className="flex flex-1 flex-wrap items-baseline gap-x-4 gap-y-2 sm:gap-x-5">
          {links.map((l) => {
            // /work/ stays current while reading a project under it.
            const active = pathname === l.href || pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`transition-colors ${active ? 'text-text' : 'text-dim hover:text-text'}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
