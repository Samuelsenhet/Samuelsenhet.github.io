'use client';

/**
 * No React state at all. The theme lives on the root element's class, which is
 * set before first paint by the script in the layout, so the label can come
 * from CSS and is correct from the very first frame. That removes the extra
 * render an effect would cause, and the hydration mismatch that reading the
 * DOM during render would risk.
 */
export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      /* Storage can be unavailable; the toggle still works for this visit. */
    }
  }

  return (
    <button type="button" onClick={toggle} className="text-dim transition-colors hover:text-text">
      <span className="dark:hidden">Dark</span>
      <span className="hidden dark:inline">Light</span>
      <span className="sr-only"> theme</span>
    </button>
  );
}
