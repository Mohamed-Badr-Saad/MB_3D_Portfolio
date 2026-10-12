import { Suspense, useCallback, useEffect, useState } from "react";
import { Briefcase, Code2, Download, MapPin } from "lucide-react";
import { hero, profile } from "../data/content";
import { RobotView, hasWebGL } from "../three/lazy";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useReducedMotion } from "../hooks/useReducedMotion";

const FIRST_LINE = "Hi! I'm Badr's robot. Click me, or drag to spin me around.";

/** Speech bubble with a typewriter effect. */
function Bubble({ line, className = "" }: { line: string; className?: string }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? line.length : 0);
  useEffect(() => {
    if (reduced) {
      setShown(line.length);
      return;
    }
    setShown(0);
    const id = window.setInterval(() => {
      setShown((n) => {
        if (n >= line.length) window.clearInterval(id);
        return Math.min(line.length, n + 1);
      });
    }, 22);
    return () => window.clearInterval(id);
  }, [line, reduced]);

  return (
    <div className={`pointer-events-none ${className}`} aria-live="polite">
      <div className="bubble relative max-w-[17rem] rounded-2xl rounded-bl-sm border border-live/40 bg-ink/90 px-4 py-3 text-[0.95rem] leading-snug shadow-[0_0_40px_-12px_rgba(60,207,180,0.6)] backdrop-blur-sm">
        <span>{line.slice(0, shown)}</span>
        <span className="invisible">{line.slice(shown)}</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const [line, setLine] = useState(FIRST_LINE);
  const say = useCallback((l: string) => setLine(l), []);

  return (
    <section id="top" className="relative overflow-hidden pt-16">
      <div className="blueprint pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="hero-glow pointer-events-none absolute -right-40 top-10 -z-10 h-[38rem] w-[38rem] rounded-full" aria-hidden />

      {hasWebGL && wide && (
        <>
          <Suspense fallback={null}>
            <RobotView className="absolute bottom-0 right-0 top-16 w-[60%]" onSay={say} />
          </Suspense>
          <Bubble line={line} className="absolute right-[27%] top-[19%] z-[2]" />
        </>
      )}

      <div className="pointer-events-none relative z-[1] mx-auto grid max-w-page px-4 sm:px-8 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:items-center">
        <div className="pointer-events-auto pb-4 pt-12 sm:pt-16 lg:col-span-6 lg:pb-24 lg:pt-0">
          <p className="rise flex items-center gap-2 text-[1.05rem] text-muted">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
            </span>
            Hi, I'm {profile.name}
          </p>
          <h1 className="display rise mt-4 text-[clamp(2.3rem,4.4vw,3.8rem)] [animation-delay:80ms]">
            I build full-stack web apps that make complex work <span className="text-gradient">feel simple.</span>
          </h1>
          <p className="rise mt-6 max-w-[34rem] text-[1.125rem] leading-relaxed text-muted [animation-delay:160ms]">
            {hero.intro}
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3 [animation-delay:240ms]">
            <a href="#projects" className="btn-primary">
              See my projects
            </a>
            <a href="#contact" className="btn-ghost">
              Get in touch
            </a>
            {profile.cv && (
              <a href={profile.cv} className="btn-ghost" download>
                <Download className="h-4 w-4" aria-hidden /> Download CV
              </a>
            )}
          </div>
          <ul className="rise mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.92rem] text-muted [animation-delay:320ms]">
            <li className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-live" aria-hidden /> Full-stack freelancer
            </li>
            <li className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-live" aria-hidden /> I&amp;C engineer, Rashpetco (Shell JV)
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-live" aria-hidden /> {profile.location}
            </li>
          </ul>
        </div>
      </div>

      {hasWebGL && !wide && (
        <div className="relative">
          <Bubble line={line} className="absolute left-4 top-2 z-[2]" />
          <Suspense fallback={<div className="h-[52svh]" />}>
            <RobotView className="relative h-[52svh] min-h-[320px] w-full" onSay={say} />
          </Suspense>
        </div>
      )}
    </section>
  );
}
