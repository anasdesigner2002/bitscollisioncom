import type Lenis from "lenis";

// The site's scrolling is driven by Lenis (see SmoothScroll.tsx), which keeps
// running its own rAF-driven scroll even when `overflow: hidden` is set - so
// locking the page behind the full-screen menu needs the instance itself, not
// just CSS. SmoothScroll already publishes it on `window.__lenis` for
// BackToTop; this reads the same handle rather than adding a second registry.
function lenis(): Lenis | undefined {
  return (window as unknown as { __lenis?: Lenis }).__lenis;
}

export function setScrollLocked(locked: boolean) {
  document.documentElement.classList.toggle("wa-scroll-locked", locked);
  if (locked) {
    lenis()?.stop();
  } else {
    lenis()?.start();
  }
}
