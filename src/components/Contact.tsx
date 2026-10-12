import { Suspense, useState, type FormEvent } from "react";
import Section from "./Section";
import { Mail } from "lucide-react";
import emailjs from "@emailjs/browser";
import { profile } from "../data/content";
import { GlobeView, hasWebGL } from "../three/lazy";
import { GitHubIcon, LinkedInIcon } from "./icons";

// EmailJS keys are public by design; override them in a .env file if you rotate them.
const SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "service_nbwdcxn";
const TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "template_98g1u8n";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "k2cYVVx7Up2pvhLok";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; email: string } | { kind: "error" };

const field =
  "w-full rounded-[3px] border border-line bg-panel/70 px-4 py-3 text-fg placeholder:text-muted/70 focus:border-muted focus:outline-none";

export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email"));
    setStatus({ kind: "sending" });
    try {
      await emailjs.send(
        SERVICE,
        TEMPLATE,
        {
          from_name: data.get("name"),
          from_email: email,
          to_name: profile.name,
          to_email: profile.email,
          message: data.get("message"),
        },
        { publicKey: PUBLIC_KEY },
      );
      form.reset();
      setStatus({ kind: "sent", email });
    } catch (err) {
      console.error("EmailJS send failed", err);
      setStatus({ kind: "error" });
    }
  }

  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="heading text-[clamp(2rem,3.6vw,2.75rem)]">Contact</h2>
          <p className="mt-4 max-w-[34rem] text-muted">
            Hiring for a full-stack or digitalization role, or need an internal tool built? Send a message here or
            email me directly.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <li>
              <a href={`mailto:${profile.email}`} className="link inline-flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden /> {profile.email}
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
                <LinkedInIcon className="h-4 w-4" /> LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer" className="link inline-flex items-center gap-2">
                <GitHubIcon className="h-4 w-4" /> GitHub
              </a>
            </li>
          </ul>

          <form onSubmit={onSubmit} className="mt-10 grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-[0.92rem]">Your name</span>
              <input name="name" required autoComplete="name" className={field} />
            </label>
            <label className="grid gap-2">
              <span className="text-[0.92rem]">Your email</span>
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-[0.92rem]">Message</span>
              <textarea name="message" required rows={6} className={field} />
            </label>
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
              <button type="submit" className="btn-primary disabled:opacity-60" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? "Sending message" : "Send message"}
              </button>
              <p role="status" aria-live="polite" className="text-[0.95rem]">
                {status.kind === "sent" && <span className="text-live">Message sent. I'll reply to {status.email}.</span>}
                {status.kind === "error" && (
                  <span className="text-amber">
                    The message didn't go through. Email me at{" "}
                    <a className="link" href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                    .
                  </span>
                )}
              </p>
            </div>
          </form>
        </div>

        <figure className="lg:col-span-6">
          {hasWebGL ? (
            <Suspense fallback={<div className="h-[340px] sm:h-[460px]" />}>
              <GlobeView className="h-[340px] w-full sm:h-[460px]" />
            </Suspense>
          ) : (
            <div className="h-[340px] sm:h-[460px]" />
          )}
          <figcaption className="mt-2 text-center text-[0.9rem] text-muted">
            Drag the globe. {profile.location} <span className="tag ml-2">31.20° N, 29.92° E</span>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
