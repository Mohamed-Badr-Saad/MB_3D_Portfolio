import { useEffect, useRef, useState } from "react";
import Section from "./Section";
import { ChevronDown } from "lucide-react";
import { experience, type Job } from "../data/content";
import Reveal from "./Reveal";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toDate(s: string) {
  if (s === "Present") return new Date();
  const [m, y] = s.split(" ");
  return new Date(Number(y), MONTHS.indexOf(m), 1);
}

function duration(job: Job) {
  const a = toDate(job.start);
  const b = toDate(job.end);
  // inclusive count: Feb to May is 4 months
  const months = Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth() + 1);
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
}

function JobCard({ job, side, active }: { job: Job; side: "left" | "right"; active: boolean }) {
  const [open, setOpen] = useState(false);
  const ongoing = job.end === "Present";
  const [first, ...rest] = job.points;
  return (
    <div
      className={`group rounded-2xl border bg-panel/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-live/50 hover:shadow-[0_20px_50px_-24px_rgba(60,207,180,0.45)] ${
        active ? "border-line" : "border-line/60"
      } ${side === "left" ? "md:text-right" : ""}`}
    >
      <div className={`flex flex-wrap items-center gap-2 text-[0.88rem] ${side === "left" ? "md:justify-end" : ""}`}>
        {ongoing && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-live/15 px-2.5 py-0.5 text-live">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-live motion-reduce:animate-none" /> Now
          </span>
        )}
        <span className="tabular-nums text-muted">
          {job.start} to {ongoing ? "present" : job.end}
        </span>
        <span className="text-muted/70">({duration(job)})</span>
      </div>
      <h3 className="heading mt-3 text-[1.3rem]">{job.role}</h3>
      <p className="mt-1 text-amber">{job.org}</p>
      <p className="mt-4 text-muted">{first}</p>

      {rest.length > 0 && (
        <>
          <div className={`grid transition-[grid-template-rows] duration-500 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <ul className="space-y-2 overflow-hidden text-muted">
              {rest.map((p, i) => (
                <li
                  key={p}
                  className={`pt-2 transition-all duration-500 ${open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
                  style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="mt-4 inline-flex items-center gap-1.5 text-[0.9rem] text-live hover:text-fg"
          >
            {open ? "Show less" : `Show ${rest.length} more`}
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden />
          </button>
        </>
      )}

      <ul className={`mt-5 flex flex-wrap gap-1.5 ${side === "left" ? "md:justify-end" : ""}`}>
        {job.tech.map((t) => (
          <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-[0.78rem] text-muted transition-colors group-hover:border-live/40">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Experience() {
  const list = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  // The centre line fills as you scroll through the timeline.
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.6 - r.top) / r.height;
      setProgress(Math.min(1, Math.max(0, p)));

    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Section id="experience">
      <Reveal>
        <h2 className="heading text-[clamp(2rem,3.6vw,2.75rem)]">Experience</h2>
        <p className="mt-4 max-w-2xl text-muted">Freelance products, plant digitalization, and where it started.</p>
      </Reveal>

      <ol ref={list} className="relative mt-14">
        {/* track + fill */}
        <span aria-hidden className="absolute bottom-0 left-[11px] top-0 w-[2px] bg-line md:left-1/2 md:-translate-x-1/2" />
        <span
          aria-hidden
          className="absolute left-[11px] top-0 w-[2px] bg-gradient-to-b from-live to-amber shadow-[0_0_12px_rgba(60,207,180,0.7)] md:left-1/2 md:-translate-x-1/2"
          style={{ height: `${progress * 100}%` }}
        />

        {experience.map((job, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          const at = (i + 0.35) / experience.length;
          const active = progress >= at;
          return (
            <li key={job.role + job.org} className="relative pb-12 pl-10 last:pb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
              <span
                aria-hidden
                className={`absolute left-[4px] top-7 grid h-4 w-4 place-items-center rounded-full border-2 transition-all duration-500 md:left-1/2 md:-translate-x-1/2 ${
                  active ? "scale-110 border-live bg-live shadow-[0_0_0_6px_rgba(60,207,180,0.18)]" : "border-line bg-ink"
                }`}
              />
              <div className={`[perspective:1200px] ${side === "left" ? "md:col-start-1" : "md:col-start-2"}`}>
                <Reveal className={`exp-card exp-${side}`}>
                  <JobCard job={job} side={side} active={active} />
                </Reveal>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
