import Link from 'next/link';
import { profile } from '@/content/profile';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export function Nav() {
  return (
    <header className="border-b border-line">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-3xl flex-wrap items-baseline gap-x-4 gap-y-2 px-5 py-5 sm:gap-x-6 sm:px-8"
      >
        <Link href="/" className="font-medium tracking-tight hover:text-mid transition-colors">
          {profile.name}
        </Link>
        <ul className="flex flex-1 flex-wrap items-baseline gap-x-4 gap-y-2 sm:gap-x-5">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-mid hover:text-text transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </nav>
    </header>
  );
}
