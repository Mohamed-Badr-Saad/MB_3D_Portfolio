import { Suspense, useState } from "react";
import Section from "./Section";
import { RotateCcw, Shuffle } from "lucide-react";
import { skillGroups, skillList, type SkillGroup } from "../data/skills";
import { KeyboardView, OrbitView, SkillsView, hasWebGL } from "../three/lazy";
import Reveal from "./Reveal";

/**
 * Which 3D skills toy to show. Switch this one value to swap them; all three still work.
 *  - "orbit":    logo planets orbiting an MB core (current)
 *  - "keyboard": keycaps you click or type (backup)
 *  - "balls":    the physics ball pit you can grab and throw (backup)
 */
type SkillsMode = "orbit" | "keyboard" | "balls";
const SKILLS_MODE = "orbit" as SkillsMode;

const COPY: Record<SkillsMode, string> = {
  orbit:
    "Every planet is a skill, one ring per group. Hover a planet to stop its orbit, click it to fly in and see where I've used it, or drag space to turn the system.",
  keyboard:
    "Every key is a skill. Click one, or type the letter printed on it, to see where I've used it. Pick a group and its keys type themselves.",
  balls:
    "Go ahead and play. Grab a ball and throw it, sweep the cursor through the pile, or pick a group to make it jump. Click any ball to see where I've used it.",
};

function Logo({ name }: { name: string }) {
  const s = skillList.find((k) => k.name === name);
  if (!s) return null;
  if (!s.icon) {
    return (
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[#13213A] text-center text-[0.7rem] font-extrabold leading-tight text-live">
        {(s.short ?? s.name).split("\n").map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </span>
    );
  }
  return (
    <span className="grid h-14 w-14 place-items-center rounded-full bg-fg">
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
        <path d={s.icon.path} fill={["000000", "0A0A0A", "FFFFFF"].includes(s.icon.hex) ? "#0D1726" : `#${s.icon.hex}`} />
      </svg>
    </span>
  );
}

export default function Skills() {
  const [selected, setSelected] = useState<string | null>("React");
  const [group, setGroup] = useState<SkillGroup | "All">("All");
  const [shake, setShake] = useState(0);
  const [jump, setJump] = useState(0);
  const [focus, setFocus] = useState<string | null>(null);
  const current = skillList.find((s) => s.name === selected) ?? skillList[0];

  return (
    <Section id="skills">
      <Reveal>
        <h2 className="heading text-[clamp(2rem,3.6vw,2.75rem)]">Skills</h2>
        <p className="mt-4 max-w-2xl text-muted">{COPY[SKILLS_MODE]}</p>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <div
          className={`relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-panel/30 to-panel/80 ${
            SKILLS_MODE === "balls" ? "lg:col-span-8" : "lg:col-span-12"
          }`}
        >
          {hasWebGL ? (
            <Suspense fallback={<div className="h-[420px] sm:h-[500px]" />}>
              {SKILLS_MODE === "orbit" ? (
                <OrbitView
                  className="h-[460px] w-full sm:h-[520px]"
                  selected={selected}
                  group={group}
                  jump={jump}
                  focus={focus}
                  onSelect={setSelected}
                  onFocus={setFocus}
                />
              ) : SKILLS_MODE === "keyboard" ? (
                <KeyboardView
                  className="h-[440px] w-full sm:h-[460px]"
                  selected={selected}
                  group={group}
                  jump={jump}
                  onSelect={setSelected}
                />
              ) : (
                <SkillsView
                  className="h-[420px] w-full sm:h-[500px]"
                  selected={selected}
                  group={group}
                  shake={shake}
                  jump={jump}
                  onSelect={setSelected}
                />
              )}
            </Suspense>
          ) : (
            <ul className="flex flex-wrap gap-2 p-6">
              {skillList.map((s) => (
                <li key={s.name} className="rounded-full border border-line px-3 py-1 text-muted">
                  {s.name}
                </li>
              ))}
            </ul>
          )}
          {hasWebGL && SKILLS_MODE === "orbit" && focus && (
            <button
              type="button"
              onClick={() => setFocus(null)}
              className="modal-fade absolute left-4 top-4 z-[1] inline-flex items-center gap-2 rounded-full border border-line bg-ink/80 px-4 py-2 text-[0.9rem] backdrop-blur hover:border-muted"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Back to orbit
            </button>
          )}
          {hasWebGL && SKILLS_MODE === "balls" && (
            <button
              type="button"
              onClick={() => setShake((n) => n + 1)}
              className="absolute right-4 top-4 z-[1] inline-flex items-center gap-2 rounded-full border border-line bg-ink/80 px-4 py-2 text-[0.9rem] backdrop-blur hover:border-muted"
            >
              <Shuffle className="h-4 w-4" aria-hidden /> Shake
            </button>
          )}
        </div>

        <div
          className={
            SKILLS_MODE === "balls"
              ? "flex flex-col gap-6 lg:col-span-4"
              : "flex flex-col gap-6 lg:col-span-12 lg:grid lg:grid-cols-2 lg:items-start"
          }
        >
          <div className="rounded-2xl border border-line bg-panel/70 p-6" aria-live="polite">
            <div className="flex items-center gap-4">
              <Logo name={current.name} />
              <div>
                <p className="text-[1.3rem] font-semibold">{current.name}</p>
                <p className="text-[0.9rem] text-live">{current.group}</p>
              </div>
            </div>
            <p className="mt-4 text-muted">{current.usedIn}</p>
          </div>

          <div>
            <p className="mb-3 text-[0.9rem] text-muted">{SKILLS_MODE === "keyboard" ? "Play a group" : SKILLS_MODE === "orbit" ? "Highlight a ring" : "Make a group jump"}</p>
            <div className="flex flex-wrap gap-2">
              {(["All", ...skillGroups] as const).map((g) => {
                const count = g === "All" ? skillList.length : skillList.filter((s) => s.group === g).length;
                return (
                  <button
                    key={g}
                    type="button"
                    aria-pressed={group === g}
                    onClick={() => {
                      setGroup(g);
                      setJump((n) => n + 1);
                      setFocus(null);
                    }}
                    className={`rounded-full border px-3.5 py-1.5 text-[0.88rem] transition-colors ${
                      group === g ? "border-amber bg-amber text-ink" : "border-line text-muted hover:border-muted hover:text-fg"
                    }`}
                  >
                    {g} <span className="opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <details className="rounded-2xl border border-line p-5 text-[0.95rem]">
            <summary className="cursor-pointer text-muted">Show all skills as a list</summary>
            <div className="mt-4 space-y-4">
              {skillGroups.map((g) => (
                <div key={g}>
                  <p className="font-semibold">{g}</p>
                  <p className="text-muted">
                    {skillList
                      .filter((s) => s.group === g)
                      .map((s) => s.name)
                      .join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>
    </Section>
  );
}
