import { Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import { profile } from "./data/content";
import { SceneCanvas, hasWebGL } from "./three/lazy";

export default function App() {
  return (
    <>
      <a
        href="#about"
        className="sr-only z-[60] bg-amber px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Education />
        <Contact />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-page flex-col gap-2 px-4 py-8 text-[0.9rem] text-muted sm:flex-row sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>Built with React, React Three Fiber and Tailwind CSS. Robot model by Quaternius (CC0).</p>
        </div>
      </footer>
      {hasWebGL && (
        <Suspense fallback={null}>
          <SceneCanvas />
        </Suspense>
      )}
    </>
  );
}
