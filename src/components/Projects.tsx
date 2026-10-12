import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import Section from "./Section";
import { ArrowLeft, ArrowRight, ExternalLink, Lock, Maximize2, X } from "lucide-react";
import { projectGroups, type Project } from "../data/content";
import { GitHubIcon } from "./icons";
import Reveal from "./Reveal";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Item = { p: Project; group: string };
// Display order: these first, then everything else in its group order.
const FIRST = ["Talié", "Deferral Management System", "Instruments Management System", "Plant Handover"];
const rank = (name: string) => (FIRST.includes(name) ? FIRST.indexOf(name) : FIRST.length);
const all: Item[] = projectGroups
  .flatMap((g) => g.items.map((p) => ({ p, group: g.title })))
  .map((it, i) => ({ it, i }))
  .sort((a, b) => rank(a.it.p.name) - rank(b.it.p.name) || a.i - b.i)
  .map(({ it }) => it);
const filters = ["All", ...projectGroups.map((g) => g.title)];

const host = (p: Project) => (p.live ? new URL(p.live.trim()).host : p.internal ? "internal network" : "github.com");

/** Fake browser chrome around a screenshot. */
function BrowserFrame({ p, children, big = false }: { p: Project; children: React.ReactNode; big?: boolean }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink">
      <div className={`flex items-center gap-2 border-b border-line bg-[#0A1220] px-3 ${big ? "py-2.5" : "py-2"}`}>
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </span>
        <span className="mx-auto flex min-w-0 max-w-[70%] items-center gap-1.5 truncate rounded-md bg-panel px-3 py-0.5 text-[0.72rem] text-muted">
          {p.internal ? <Lock className="h-3 w-3 shrink-0 text-amber" aria-hidden /> : null}
          <span className="truncate">{host(p)}</span>
        </span>
      </div>
      {children}
    </div>
  );
}

function ProjectCard({ item, featured, onOpen }: { item: Item; featured: boolean; onOpen: () => void }) {
  const { p, group } = item;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    if (reduced || e.pointerType !== "mouse") return;
    el.style.setProperty("--rx", `${(0.5 - y) * (featured ? 4 : 7)}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * (featured ? 5 : 9)}deg`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onOpen}
      className="project-card group relative flex h-full cursor-pointer flex-col rounded-2xl p-[1px]"
    >
      {/* spotlight border that follows the cursor */}
      <span aria-hidden className="spotlight-border pointer-events-none absolute inset-0 rounded-2xl" />
      <div className="relative flex h-full flex-col rounded-2xl bg-panel/90 p-4">
        <div className="relative">
          <BrowserFrame p={p}>
            <div className={`relative overflow-hidden ${featured ? "aspect-[16/8]" : "aspect-[16/9]"}`}>
              {p.image && (
                <img
                  src={p.image}
                  alt={`${p.name} screenshot`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-[transform,object-position] duration-[1200ms] ease-out group-hover:scale-[1.04] group-hover:object-[center_70%]"
                />
              )}
              {/* hover actions */}
              <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center justify-center gap-2 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent p-4 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber px-3.5 py-1.5 text-[0.85rem] font-semibold text-ink"
                >
                  <Maximize2 className="h-3.5 w-3.5" aria-hidden /> Details
                </button>
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 rounded-full border border-fg/30 bg-ink/70 px-3.5 py-1.5 text-[0.85rem] backdrop-blur hover:border-fg"
                  >
                    Live <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                )}
                {p.code && (
                  <a
                    href={p.code}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 rounded-full border border-fg/30 bg-ink/70 px-3.5 py-1.5 text-[0.85rem] backdrop-blur hover:border-fg"
                  >
                    <GitHubIcon className="h-3.5 w-3.5" /> Code
                  </a>
                )}
              </div>
            </div>
          </BrowserFrame>
        </div>

        <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.8rem] text-live">{group}</p>
            {p.internal && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber/15 px-2.5 py-0.5 text-[0.75rem] text-amber">
                <Lock className="h-3 w-3" aria-hidden /> {p.internal}
              </span>
            )}
          </div>
          <h3 className={`mt-1.5 font-semibold transition-colors group-hover:text-white ${featured ? "heading text-[1.6rem]" : "text-[1.2rem]"}`}>
            {p.name}
          </h3>
          <p className={`mt-2 flex-1 text-muted ${featured ? "text-[1.02rem]" : "text-[0.95rem]"}`}>{p.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {p.stack.map((s, i) => (
              <li
                key={s}
                className="rounded-full border border-line bg-ink/40 px-2.5 py-0.5 text-[0.78rem] text-muted transition-all duration-300 group-hover:border-live/40 group-hover:text-fg"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function ProjectModal({ items, index, onClose, onMove }: { items: Item[]; index: number; onClose: () => void; onMove: (d: number) => void }) {
  const { p, group } = items[index];
  const shots = [p.image, ...(p.gallery ?? [])].filter(Boolean) as string[];
  const [shot, setShot] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setShot(0), [index]);
  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onMove]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={p.name}>
      <button type="button" aria-label="Close" onClick={onClose} className="modal-fade absolute inset-0 bg-ink/80 backdrop-blur-md" />
      <div key={index} className="modal-pop relative max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-line bg-panel shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_1fr]">
          <div className="p-4 sm:p-6">
            <BrowserFrame p={p} big>
              <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                <img key={shots[shot]} src={shots[shot]} alt={`${p.name} screenshot ${shot + 1}`} className="shot-fade h-full w-full object-cover object-top" />
              </div>
            </BrowserFrame>
            {shots.length > 1 && (
              <div className="mt-3 flex gap-2">
                {shots.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setShot(i)}
                    aria-label={`Screenshot ${i + 1}`}
                    className={`overflow-hidden rounded-md border-2 transition-all ${i === shot ? "border-amber" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={s} alt="" className="h-12 w-20 object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col p-5 pt-0 sm:p-6 lg:pl-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.85rem] text-live">{group}</p>
                <h3 className="heading mt-1 text-[1.7rem]">{p.name}</h3>
              </div>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="rounded-full border border-line p-2 hover:border-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-muted">{p.summary}</p>
            <ul className="mt-5 space-y-2.5">
              {p.highlights.map((h, i) => (
                <li key={h} className="stagger-in flex gap-3 text-[0.95rem]" style={{ animationDelay: `${150 + i * 60}ms` }}>
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-live" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li key={s} className="rounded-full border border-line px-2.5 py-0.5 text-[0.8rem] text-muted">
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" className="btn-primary">
                  Open live site <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              )}
              {p.code && (
                <a href={p.code} target="_blank" rel="noreferrer" className="btn-ghost">
                  <GitHubIcon className="h-4 w-4" /> Source code
                </a>
              )}
              {p.internal && <span className="self-center text-[0.9rem] text-muted">Internal tool, not publicly hosted.</span>}
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 pt-8 text-[0.88rem] text-muted">
              <button type="button" onClick={() => onMove(-1)} className="inline-flex items-center gap-1.5 hover:text-fg">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Previous
              </button>
              <span className="tabular-nums">
                {index + 1} / {items.length}
              </span>
              <button type="button" onClick={() => onMove(1)} className="inline-flex items-center gap-1.5 hover:text-fg">
                Next <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const items = all.filter((it) => filter === "All" || it.group === filter);

  // Sliding pill behind the active filter tab
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, top: 0, height: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabs.current[filters.indexOf(filter)];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, top: el.offsetTop, height: el.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [filter]);

  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);
  const close = useCallback(() => setOpen(null), []);

  return (
    <Section id="projects">
      <Reveal>
        <h2 className="heading text-[clamp(2rem,3.6vw,2.75rem)]">Projects</h2>
        <p className="mt-4 max-w-2xl text-muted">
          Tools I've shipped for plant engineering teams, products for clients, and where I started. Click any project for
          the details.
        </p>
      </Reveal>

      <div role="tablist" aria-label="Filter projects" className="relative mt-8 flex flex-wrap gap-2">
        <span
          aria-hidden
          className="absolute rounded-full bg-amber transition-all duration-300 ease-out"
          style={{ left: pill.left, width: pill.width, top: pill.top, height: pill.height }}
        />
        {filters.map((f, i) => {
          const count = f === "All" ? all.length : all.filter((it) => it.group === f).length;
          return (
            <button
              key={f}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              type="button"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`relative rounded-full border px-4 py-2 text-[0.92rem] transition-colors duration-300 ${
                filter === f ? "border-transparent text-ink" : "border-line text-muted hover:border-muted hover:text-fg"
              }`}
            >
              {f} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <ul key={filter} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <li key={it.p.name} className={`pop-in ${i === 0 ? "sm:col-span-2" : ""}`} style={{ animationDelay: `${i * 70}ms` }}>
            <ProjectCard item={it} featured={i === 0} onOpen={() => setOpen(i)} />
          </li>
        ))}
      </ul>

      {open !== null && <ProjectModal items={items} index={open} onClose={close} onMove={move} />}
    </Section>
  );
}
