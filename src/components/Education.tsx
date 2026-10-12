import { GraduationCap } from "lucide-react";
import Section from "./Section";
import { education } from "../data/content";
import Reveal from "./Reveal";

export default function Education() {
  return (
    <Section id="education">
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <h2 className="heading text-[clamp(2rem,3.6vw,2.75rem)]">Education</h2>
          <div className="mt-8 rounded-2xl border border-line bg-panel/70 p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-amber/15 text-amber">
                <GraduationCap className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-[1.15rem] font-semibold">{education.degree}</p>
                <p className="mt-1 text-muted">
                  {education.school}, {education.year}
                </p>
                <p className="mt-1 text-live">{education.grades}</p>
              </div>
            </div>
            <p className="mt-5 text-muted">{education.project}</p>
          </div>
        </Reveal>
        <Reveal className="grid content-start gap-8 sm:grid-cols-2 lg:col-span-6 lg:pt-[4.5rem]" delay={120}>
          <div>
            <h3 className="border-b border-line pb-2 font-semibold">Courses</h3>
            <ul className="mt-3 space-y-3">
              {education.courses.map((c) => (
                <li key={c.name}>
                  {c.name}
                  <span className="block text-[0.92rem] text-muted">{c.org}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="border-b border-line pb-2 font-semibold">Activities</h3>
            <ul className="mt-3 space-y-3">
              {education.activities.map((a) => (
                <li key={a.name}>
                  {a.name}, {a.org}
                  <span className="block text-[0.92rem] text-muted">{a.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:col-span-2">
            <h3 className="border-b border-line pb-2 font-semibold">Languages</h3>
            <p className="mt-3 text-muted">{education.languages}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
