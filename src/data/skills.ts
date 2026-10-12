// Skills shown in the physics playground. Logos come from Simple Icons (CC0).
import {
  siReact, siNextdotjs, siTypescript, siJavascript, siTailwindcss, siShadcnui, siMui, siSass, siThreedotjs,
  siNodedotjs, siExpress, siPostgresql, siPrisma, siSupabase, siMongodb, siMysql, siAppwrite, siBetterauth,
  siGit, siGithubactions, siLinux, siVite, siPython, siCplusplus, siC, siHtml5,
} from "simple-icons";

export type SkillGroup = "Frontend" | "Backend & data" | "Plant & control" | "Tools & languages";
export const skillGroups: SkillGroup[] = ["Frontend", "Backend & data", "Plant & control", "Tools & languages"];

type Icon = { path: string; hex: string };

export type Skill = {
  name: string;
  group: SkillGroup;
  icon?: Icon;
  short?: string; // label for balls without a logo
  size: number; // relative ball size: core skills are bigger
  key: string; // keyboard shortcut shown on the keycap
  usedIn: string;
};

export const skillList: Skill[] = [
  { name: "React", key: "R", group: "Frontend", icon: siReact, size: 1.25, usedIn: "Instruments Management System, BadrPicture and this site." },
  { name: "Next.js", key: "N", group: "Frontend", icon: siNextdotjs, size: 1.25, usedIn: "Deferral Management System and the Talié store." },
  { name: "TypeScript", key: "T", group: "Frontend", icon: siTypescript, size: 1.15, usedIn: "Talié, BadrPicture and this site." },
  { name: "JavaScript", key: "J", group: "Frontend", icon: siJavascript, size: 1.05, usedIn: "Metering Best Match Finder, Recipe Finder and every web project." },
  { name: "Tailwind CSS", key: "W", group: "Frontend", icon: siTailwindcss, size: 1.05, usedIn: "Deferral Management System, Talié and this site." },
  { name: "shadcn/ui", key: "U", group: "Frontend", icon: siShadcnui, size: 0.9, usedIn: "Instruments Management System and BadrPicture." },
  { name: "Material UI", key: "M", group: "Frontend", icon: siMui, size: 0.85, usedIn: "The React e-commerce storefront." },
  { name: "Sass", key: "S", group: "Frontend", icon: siSass, size: 0.8, usedIn: "NTI and Udacity web projects." },
  { name: "HTML", key: "H", group: "Frontend", icon: siHtml5, size: 0.85, usedIn: "Everything on the web, starting with Recipe Finder." },
  { name: "Three.js", key: "3", group: "Frontend", icon: siThreedotjs, size: 0.95, usedIn: "This site, through React Three Fiber. You're throwing it around." },
  { name: "Node.js", key: "O", group: "Backend & data", icon: siNodedotjs, size: 1.2, usedIn: "Instruments Management System and freelance APIs." },
  { name: "Express", key: "X", group: "Backend & data", icon: siExpress, size: 0.9, usedIn: "REST APIs for the Instruments Management System." },
  { name: "PostgreSQL", key: "Q", group: "Backend & data", icon: siPostgresql, size: 1.1, usedIn: "Deferral Management System and Talié." },
  { name: "Prisma", key: "Z", group: "Backend & data", icon: siPrisma, size: 0.9, usedIn: "Talié's data layer." },
  { name: "Supabase", key: "B", group: "Backend & data", icon: siSupabase, size: 0.9, usedIn: "Talié's hosted Postgres." },
  { name: "MongoDB", key: "G", group: "Backend & data", icon: siMongodb, size: 1.05, usedIn: "Instruments Management System and the Smart Nutrition System." },
  { name: "MySQL", key: "Y", group: "Backend & data", icon: siMysql, size: 0.8, usedIn: "Coursework and training projects." },
  { name: "Appwrite", key: "A", group: "Backend & data", icon: siAppwrite, size: 0.85, usedIn: "BadrPicture's auth, database and storage." },
  { name: "Better Auth", key: "K", group: "Backend & data", icon: siBetterauth, size: 0.8, usedIn: "Sign-in and roles in the Deferral Management System." },
  { name: "DCS / ESD", key: "D", group: "Plant & control", short: "DCS\nESD", size: 1.1, usedIn: "Troubleshooting control logic in safety-critical systems at Rashpetco." },
  { name: "Field instruments", key: "F", group: "Plant & control", short: "PT\nLT FT", size: 1.0, usedIn: "Transmitters, valves and gauges, the daily work behind Plant Handover." },
  { name: "Calibration", key: "L", group: "Plant & control", short: "CAL", size: 0.9, usedIn: "Calibration workflows, digitised in the Instruments Management System." },
  { name: "Industrial protocols", key: "I", group: "Plant & control", short: "I/O\nBUS", size: 0.9, usedIn: "Industrial communication and data-driven diagnostics." },
  { name: "Git", key: "E", group: "Tools & languages", icon: siGit, size: 1.0, usedIn: "Every project, every day." },
  { name: "GitHub Actions", key: "2", group: "Tools & languages", icon: siGithubactions, size: 0.85, usedIn: "CI/CD pipelines." },
  { name: "Vite", key: "V", group: "Tools & languages", icon: siVite, size: 0.9, usedIn: "BadrPicture and this site." },
  { name: "Linux", key: "1", group: "Tools & languages", icon: siLinux, size: 0.85, usedIn: "Development and servers." },
  { name: "Python", key: "P", group: "Tools & languages", icon: siPython, size: 0.95, usedIn: "Deep-learning models for the self-driving car graduation project." },
  { name: "C++", key: "=", group: "Tools & languages", icon: siCplusplus, size: 0.9, usedIn: "The multi-threaded Pistache backend of the Smart Nutrition System." },
  { name: "C", key: "C", group: "Tools & languages", icon: siC, size: 0.8, usedIn: "Embedded systems and university coursework." },
];
