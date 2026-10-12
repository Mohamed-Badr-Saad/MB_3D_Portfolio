import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "../data/content";
import { GitHubIcon, LinkedInIcon } from "./icons";

const links = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const l of links) {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-8" aria-label="Main">
        <a href="#top" className="heading text-[1.05rem]" onClick={() => setOpen(false)}>
          Mohamed Badr
        </a>

        <ul className="hidden items-center gap-7 text-[0.95rem] md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "true" : undefined}
                className={`transition-colors hover:text-fg ${active === l.id ? "text-fg" : "text-muted"}`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="flex items-center gap-4 border-l border-line pl-6 text-muted">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-fg">
              <GitHubIcon />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-fg">
              <LinkedInIcon />
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="-mr-2 p-2 text-fg md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-ink md:hidden">
          <ul className="mx-auto flex max-w-page flex-col px-4 py-3">
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="block py-3 text-lg" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
            <li className="flex gap-6 py-3 text-muted">
              <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <GitHubIcon /> GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <LinkedInIcon /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
