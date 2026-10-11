'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { profile } from '@/content/profile';

/** What the bottom-left corner says, per section. */
function sectionLabel(pathname: string): string {
  if (pathname === '/') return 'Built end to end';
  if (pathname.startsWith('/work/') && pathname !== '/work/') return 'Work · Project';
  if (pathname.startsWith('/work')) return 'Work';
  if (pathname.startsWith('/writing')) return 'Writing';
  if (pathname.startsWith('/about')) return 'About';
  if (pathname.startsWith('/contact')) return 'Contact';
  return 'Not found';
}

/**
 * The hairline frame, its corner marks and the corner labels, from
 * sen-3d-resume (App.tsx hero-chrome, MIT, Copyright (c) 2026 Sen Zheng).
 * It belongs to the first screen and fades out over the first 280px of
 * scroll. Decoration only: everything it says is said again on the page.
 */
export function Chrome() {
  const pathname = usePathname() ?? '/';
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const fade = () => {
      raf = 0;
      const o = String(1 - Math.min(1, window.scrollY / 280));
      if (ref.current) ref.current.style.opacity = o;
      // The nav's backing fades in as the frame fades out (globals.css .credit::before).
      document.documentElement.style.setProperty('--chrome-o', o);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(fade);
    };
    fade();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <div ref={ref} className="chrome" aria-hidden>
      <div className="chrome-frame" />
      <span className="chrome-mark tl">+</span>
      <span className="chrome-mark tr">+</span>
      <span className="chrome-mark bl">+</span>
      <span className="chrome-mark br">+</span>
      {/* On the home page there is no nav at the top, so the name takes the corner. */}
      {pathname === '/' && (
        <div className="chrome-meta tl">
          <span className="chrome-name">{profile.name}</span>
          {profile.role}
        </div>
      )}
      <div className="chrome-meta tr">Portfolio — 2026</div>
      <div className="chrome-meta bl">{sectionLabel(pathname)}</div>
      <div className="chrome-meta right">Based in {profile.location}</div>
    </div>
  );
}
