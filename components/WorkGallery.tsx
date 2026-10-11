'use client';

import { useEffect, useRef } from 'react';

/**
 * sen-3d-resume's works gallery (ui/Works.tsx, MIT, Copyright (c) 2026 Sen
 * Zheng): the section pins for as long as the cards are wider than the
 * screen, and vertical scroll moves them sideways 1:1, with a progress bar.
 * The cards render stacked first; this pins them only on a wide screen
 * without reduced motion, as sen does on phones.
 */
export function WorkGallery({ children }: { children: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const hint = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let range = 0;
    let raf = 0;

    const move = () => {
      raf = 0;
      if (!gallery.current || !track.current || !range) return;
      const p = Math.min(1, Math.max(0, -gallery.current.getBoundingClientRect().top / range));
      track.current.style.transform = `translateX(${-p * range}px)`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      if (hint.current) hint.current.style.opacity = String(1 - Math.min(1, Math.max(0, (p - 0.85) / 0.15)));
    };
    const layout = () => {
      const pinned = window.innerWidth > 640 && !reduced.matches;
      section.current?.classList.toggle('is-pinned', pinned);
      if (!gallery.current || !track.current) return;
      range = pinned ? Math.max(0, track.current.scrollWidth - window.innerWidth) : 0;
      gallery.current.style.height = pinned ? `calc(100vh + ${range}px)` : '';
      if (!pinned) track.current.style.transform = '';
      move();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(move);
    };
    layout();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', layout);
    reduced.addEventListener('change', layout);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', layout);
      reduced.removeEventListener('change', layout);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={section} className="works">
      <div ref={gallery} className="gallery">
        <div className="gallery-sticky">
          <div ref={track} className="track">
            {children}
          </div>
          <div className="gallery-progress" aria-hidden>
            <i ref={bar} />
          </div>
          <span ref={hint} className="gallery-hint" aria-hidden>
            Keep scrolling
          </span>
        </div>
      </div>
    </section>
  );
}
