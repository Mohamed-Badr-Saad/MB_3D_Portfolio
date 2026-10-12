import { useEffect, useRef, useState } from "react";

// Every element waiting to be revealed registers here. On each scroll, anything whose top is above
// the bottom of the screen gets revealed: that covers normal scrolling, menu-link jumps that skip
// over sections, and reaching the very end of the page.
type Pending = { el: HTMLElement; show: () => void };
const pending = new Set<Pending>();
let installed = false;

function checkAll() {
  const vh = window.innerHeight;
  const atBottom = vh + window.scrollY >= document.documentElement.scrollHeight - 4;
  for (const p of pending) {
    if (atBottom || p.el.getBoundingClientRect().top < vh * 0.92) {
      p.show();
      pending.delete(p);
    }
  }
}

function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  let raf = 0;
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(() => ((raf = 0), checkAll()));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("hashchange", () => setTimeout(checkAll, 50));
}

/** True once the element has scrolled into view (or anything above it has been passed). Never flips back. */
export function useInView<T extends HTMLElement>(rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    install();
    const entry: Pending = { el, show: () => setInView(true) };
    pending.add(entry);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting || e.boundingClientRect.bottom < 0) entry.show();
      },
      { rootMargin, threshold: 0.08 },
    );
    io.observe(el);
    // in case the page was opened (or reloaded) part-way down
    const t = window.setTimeout(checkAll, 100);
    return () => {
      io.disconnect();
      pending.delete(entry);
      window.clearTimeout(t);
    };
  }, [inView, rootMargin]);

  return [ref, inView] as const;
}
