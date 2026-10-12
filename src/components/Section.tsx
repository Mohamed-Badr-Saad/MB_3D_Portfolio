import type { ReactNode } from "react";
import { useInView } from "../hooks/useInView";

/** A page section that rises and fades in the first time it scrolls into view. */
export default function Section({ id, children, className = "section" }: { id: string; children: ReactNode; className?: string }) {
  const [ref, shown] = useInView<HTMLElement>("0px 0px -5% 0px");
  return (
    <section ref={ref} id={id} className={`section-reveal ${shown ? "section-in" : ""} ${className}`}>
      {children}
    </section>
  );
}
