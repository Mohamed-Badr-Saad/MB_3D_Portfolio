import { about, education } from "../data/content";
import Section from "./Section";
import Reveal from "./Reveal";

export default function About() {
  return (
    <Section id="about">
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <h2 className="heading text-[clamp(2rem,3.6vw,2.75rem)]">Between the field and the codebase</h2>
          {about.paragraphs.map((p) => (
            <p key={p} className="mt-5 max-w-[36rem] text-muted">
              {p}
            </p>
          ))}
          <p className="mt-5 max-w-[36rem] text-muted">
            {education.degree}, Alexandria University, {education.year}. {education.grades}.
          </p>
        </Reveal>

        <dl className="divide-y divide-line border-y border-line lg:col-span-6 lg:col-start-7">
          {about.focus.map((f, i) => (
            <Reveal key={f.title} delay={i * 100} className="grid gap-2 py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
              <dt className="heading text-[1.15rem]">{f.title}</dt>
              <dd className="text-muted">{f.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
