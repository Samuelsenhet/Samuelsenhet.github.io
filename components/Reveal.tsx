'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    __reveal?: boolean;
  }
}

/**
 * sen-3d-resume's entrance (Resume.tsx itemV: up 26px and in over 0.75s,
 * 0.09s apart), for anything marked `.rv`, once, as it scrolls into view.
 * The layout's script arms it before paint; this marks each element shown.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    window.__reveal = true;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('shown');
          io.unobserve(e.target);
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll<HTMLElement>('.rv:not(.shown)').forEach((el, i) => {
      // Siblings arrive one after another; anything further down the page waits for its turn on scroll.
      el.style.transitionDelay = `${Math.min(i % 7, 6) * 0.09}s`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
