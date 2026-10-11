'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// three.js and the model load after the page, in their own chunk; nothing on the page waits for them.
const Scene = dynamic(() => import('./Scene').then((m) => m.Scene), { ssr: false });

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (x: number, a: number, b: number, c: number, d: number) => c + (d - c) * clamp01((x - a) / (b - a));

/**
 * The fixed layers behind and over the home page, and what scroll does to
 * them (sen-3d-resume App.tsx, MIT, Copyright (c) 2026 Sen Zheng): the 3D
 * scene, the dimming on the timeline's side, the glass rail, the scroll cue
 * fading, and the About blurring away as it leaves.
 */
export function HomeScene() {
  useEffect(() => {
    const scrim = document.getElementById('scrim');
    const rail = document.getElementById('glass-rail');
    const cue = document.getElementById('scroll-cue');
    const about = document.getElementById('about');
    const title = document.getElementById('about-title');
    const body = document.getElementById('about-body');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (scrim) scrim.style.opacity = String(lerp(y, 0, 520, 0, 0.4));
      if (rail) rail.style.opacity = String(lerp(y, vh * 0.5, vh * 1.1, 0, 1));
      if (cue) cue.style.opacity = String(lerp(y, 0, 160, 1, 0));
      if (!about || !title || !body) return;
      // offset ['start 0.6', 'start start']: gone, and blurred, halfway there.
      const p = clamp01((vh * 0.6 - about.getBoundingClientRect().top) / (vh * 0.6));
      about.style.opacity = String(lerp(p, 0, 0.5, 1, 0));
      if (reduced.matches) return;
      about.style.filter = `blur(${lerp(p, 0, 0.5, 0, 16)}px)`;
      title.style.transform = `translateY(${-96 * p}px)`;
      title.style.letterSpacing = `${0.01 + 0.41 * p}em`;
      body.style.transform = `translateY(${-52 * p}px)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="scene-bg" aria-hidden>
        <Scene />
      </div>
      <div className="scrim" id="scrim" aria-hidden />
      <div className="glass-rail" id="glass-rail" aria-hidden />
    </>
  );
}
