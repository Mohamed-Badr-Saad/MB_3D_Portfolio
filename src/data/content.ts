// All site copy lives here, so updating the portfolio never means touching layout code.
import dms from "../assets/projects/dms.webp";
import talie from "../assets/projects/talie.webp";
import instruments from "../assets/projects/instruments.webp";
import badrpicture from "../assets/projects/badrpicture.webp";
import recipeFinder from "../assets/projects/recipe-finder.webp";
import bestMatch from "../assets/projects/best-match.webp";
import shop from "../assets/projects/shop.webp";
import nutrition from "../assets/projects/nutrition.webp";
import ho1 from "../assets/handover/01_plant-handover_overview.webp";
import ho2 from "../assets/handover/02_plant-handover_install-and-roles.webp";
import ho3 from "../assets/handover/03_plant-handover_import-names.webp";
import ho4 from "../assets/handover/04_plant-handover_admin-delete.webp";
import ho5 from "../assets/handover/05_plant-handover_shared-folder.webp";
import pc1 from "../assets/PageCraft/PageCraft-1-start-screen.webp";
import pc2 from "../assets/PageCraft/PageCraft-2-edit-pdf-text.webp";
import pc3 from "../assets/PageCraft/PageCraft-3-sign.webp";
import pc4 from "../assets/PageCraft/PageCraft-4-ocr-arabic.webp";
import pc5 from "../assets/PageCraft/PageCraft-5-edit-scanned-page.webp";
import pc6 from "../assets/PageCraft/PageCraft-6-phone.webp";
import pc7 from "../assets/PageCraft/PageCraft-7-phone-pages.webp";
import cams0 from "../assets/CAMS_Alarm_Explorer/0_cover.webp";
import cams1 from "../assets/CAMS_Alarm_Explorer/1_alarms.webp";
import cams2 from "../assets/CAMS_Alarm_Explorer/2_alarm_details.webp";
import cams3 from "../assets/CAMS_Alarm_Explorer/3_statistics.webp";
import cams4 from "../assets/CAMS_Alarm_Explorer/4_hma_view.webp";
import cams5 from "../assets/CAMS_Alarm_Explorer/5_mobile_app.webp";
// C&E Explorer screenshots have the plant's tags, descriptions and chart names blurred.
import ce1 from "../assets/C&E_Explorer/ce-explorer-1-start.webp";
import ce2 from "../assets/C&E_Explorer/ce-explorer-2-signal.webp";
import ce3 from "../assets/C&E_Explorer/ce-explorer-3-trip-chain.webp";
import ce4 from "../assets/C&E_Explorer/ce-explorer-4-matrix.webp";
import ce5 from "../assets/C&E_Explorer/ce-explorer-5-blank-sheet.webp";
import ce6 from "../assets/C&E_Explorer/ce-explorer-6-phone.webp";

export const profile = {
  name: "Mohamed Badr",
  role: "Full-stack developer, instrumentation & control engineer",
  location: "Alexandria, Egypt",
  email: "mohamedbadrsaad23@gmail.com",
  github: "https://github.com/Mohamed-Badr-Saad",
  linkedin: "https://www.linkedin.com/in/mohamed-badr-95283b278",
  // Drop your CV into /public with this name and set the path to show the download button.
  cv: "/Mohamed_Badr_resume_software.pdf" as string | null, // e.g. "/Mohamed_Badr_CV.pdf"
  revised: "Oct 2026",
};

export const hero = {
  headline: "I build full-stack web apps that make complex work feel simple.",
  intro:
    "Full-stack developer and instrumentation & control engineer at Rashpetco (Shell JV). I turn spreadsheets, paperwork and approval chains into fast, friendly web apps, from data model to deployment.",
};

export const about = {
  paragraphs: [
    "Most of my week is spent with transmitters, valves and the DCS/ESD logic behind them. The rest goes into the tools around that work. As part of Rashpetco's digitalization team I've shipped apps for deferral approvals, instrument calibration, metering calculations and shift handovers, replacing Excel sheets and manual follow-up.",
    "Outside the plant I build full-stack products for clients, from data model and auth through to a fast, responsive interface.",
  ],
  focus: [
    {
      title: "Plant digitalization",
      body: "Internal tools for engineering teams: approval workflows, calibration records, shift logs and equipment registers, shaped around how work is actually done on site.",
    },
    {
      title: "Full-stack web apps",
      body: "Next.js, React and Node.js on PostgreSQL or MongoDB. Auth, payments, dashboards and deployment, delivered as one piece.",
    },
    {
      title: "Control systems",
      body: "Troubleshooting control logic in distributed, safety-critical DCS/ESD systems, working with industrial communication protocols and data-driven diagnostics.",
    },
  ],
};

// Screens shown on the floating monitor next to the robot.
export const screens = [
  { name: "PageCraft, a PDF editor that runs on your device", src: pc2 },
  { name: "Plant Handover", src: ho1 },
  { name: "CAMS Alarm Explorer", src: cams0 },
  { name: "C&E Explorer", src: ce3 },
  { name: "the Deferral Management System", src: dms },
  { name: "Talié, a fashion store with Paymob payments", src: talie },
  { name: "the Instruments Management System", src: instruments },
  { name: "BadrPicture", src: badrpicture },
  { name: "Metering Best Match Finder", src: bestMatch },
];

export type Job = {
  role: string;
  org: string;
  start: string;
  end: string; // "Present" marks an ongoing role
  points: string[];
  tech: string[];
};

export const experience: Job[] = [
  {
    role: "Freelance Full-stack Developer",
    org: "Remote",
    start: "Jun 2024",
    end: "Present",
    points: [
      "Build and deploy full-stack web apps with Next.js, React, Node.js, MongoDB and Tailwind CSS.",
      "Deliver responsive, modern interfaces and robust REST APIs, from requirements to post-launch support.",
    ],
    tech: ["Next.js", "React", "Node.js", "PostgreSQL", "MongoDB", "Tailwind CSS"],
  },
  {
    role: "Instrumentation & Control Engineer",
    org: "Rashpetco (Shell JV)",
    start: "Feb 2025",
    end: "Present",
    points: [
      "Member of the digitalization team, building internal applications that cut manual effort in engineering workflows.",
      "Delivered the Deferral Management System, Instruments Management System, Metering Best Match Finder, Plant Handover and C&E Explorer.",
      "Troubleshoot and analyse control logic in distributed, safety-critical DCS/ESD systems.",
      "Work with industrial communication protocols and data-driven diagnostics.",
    ],
    tech: ["Next.js", "React", "PostgreSQL", "DCS / ESD", "Field instruments"],
  },
  {
    role: "Software Developer (OJT)",
    org: "SEITech Solutions",
    start: "Feb 2024",
    end: "May 2024",
    points: [
      "Worked within SDLC processes using version control and software design patterns.",
      "Managed requirements in IBM DOORS for software engineering projects.",
    ],
    tech: ["Git", "Design patterns", "IBM DOORS"],
  },
  {
    role: "Full-stack Development Intern",
    org: "National Telecommunication Institute (NTI)",
    start: "Jul 2023",
    end: "Dec 2023",
    points: [
      "Completed a 288-hour programme covering frontend, backend, soft skills and project management.",
      "Built web applications with HTML, CSS/Sass, JavaScript, React, Node.js and REST APIs.",
    ],
    tech: ["React", "Node.js", "JavaScript", "Sass"],
  },
];

export type Project = {
  name: string;
  summary: string;
  stack: string[];
  image?: string;
  live?: string;
  code?: string;
  internal?: string; // shown instead of links for internal tools
  highlights: string[]; // shown in the project detail view
  gallery?: string[]; // extra screenshots for the detail view
};

export const projectGroups: { title: string; note: string; items: Project[] }[] = [
  {
    title: "Plant & engineering tools",
    note: "Built for plant engineering teams",
    items: [
      {
        name: "Plant Handover",
        highlights: [
          "Installable on Android and iPhone, with guided install steps, offline opening, camera photos, in-app notifications and update prompts",
          "Managers' database protected by Postgres row-level security, plus admin tools: filtered delete (recoverable or permanent) with restore, shared-folder export/import and backups",
          "Migrated 21,000+ old Excel handovers with automatic name matching and manual overrides, and made first sync about 18× faster (36 s → 2 s)",
        ],
        gallery: [ho2, ho3, ho4, ho5],
        summary:
          "A shift-handover app for Rashpetco's Instruments (I&C) team. Engineers log handovers, follow-up actions, photos and comments against 3,000+ plant instrument tags. It installs on Android and iPhone and still opens with no signal. Managers also get their own private database.",
        stack: ["JavaScript", "PWA (Service Worker, IndexedDB)", "Supabase (PostgreSQL, Auth, RLS, Storage)", "Cloudflare Workers", "SheetJS", "Playwright"],
        image: ho1,
        live: "https://handover-mobapp.badrm7103.workers.dev/",
        internal: "Internal tool",
      },
      {
        name: "C&E Explorer",
        highlights: [
          "Reads the plant's C&E workbooks in the browser, including charts converted from PDF, and links 38,000+ cause–effect marks into one searchable model. Nothing is uploaded.",
          "Trip chain follows a signal across charts (confirmed fire → ESD level → shutdown valves → subsea wells) and exports the chain to Excel.",
          "Smooth matrix view of charts up to 668 × 535, with code filters, pinned-cell readout and filtered export.",
          "Installs on iPhone and Android as an app and works offline in the plant, with a layout built for phones.",
          "\"Blank C&E sheet\" generates an Excel template in the importer's layout, so new package charts can be typed in and imported without changes.",
        ],
        gallery: [ce2, ce4, ce1, ce5, ce6],
        summary:
          "An installable web app for exploring the cause & effect charts of plant safety systems (ESD, F&G, BMS, vendor packages and subsea controls). Type any tag to see what it trips, what trips it, its set point and chart notes, and follow the trip chain across charts, on a desktop or on a phone, offline.",
        stack: ["React", "TypeScript", "Vite", "PWA", "IndexedDB", "Web Workers", "fflate"],
        image: ce3,
        live: "https://cause-and-effect-tool.vercel.app/",
        internal: "Internal tool",
      },
      {
        name: "Deferral Management System",
        highlights: [
          "Multi-level approval workflows for company deferrals",
          "Centralised tracking so nothing waits in someone's inbox",
          "Sign-in and roles with Better Auth on a PostgreSQL database",
        ],
        summary: "Company deferrals with multi-level approval workflows, central tracking and faster follow-up.",
        stack: ["Next.js", "PostgreSQL", "Better Auth", "Tailwind CSS"],
        image: dms,
        live: "https://deferral-dms.vercel.app/",
        code: "https://github.com/Mohamed-Badr-Saad/deferral-dms",
      },
      {
        name: "CAMS Alarm Explorer",
        highlights: [
          "Loads 80,000+ alarms in seconds with virtual scrolling. Splits tag and alarm type from the source, shows current priority, mark color and setpoint, and works out \"Shown to operator\" from Detection + Enabled.In.Block. Rows are banded by tag, with filters, sorting, a full details panel and CSV/Excel export.",
          "Statistics and a Highly Managed Alarms (HMA) view benchmarked against ISA-18.2: priority mix vs Table 6, operator response time vs time to event, priority changes and documentation completeness, with page references to the standard.",
          "Installable PWA that works offline and keeps the last import on the device. The CAMS file is read locally and never uploaded.",
        ],
        gallery: [cams1, cams2, cams3, cams4, cams5],
        summary:
          "A web app that turns a Yokogawa CENTUM VP CAMS alarm export into a searchable alarm database with statistics. It makes alarm troubleshooting faster for engineers and gives operators a clear view of every tag's alarms, priorities, setpoints and whether each alarm actually reaches the operator. It works in any browser and installs as an app on Android and iPhone.",
        stack: ["HTML", "CSS", "Vanilla JavaScript", "SheetJS", "IndexedDB", "PWA", "SVG charts", "Vercel"],
        image: cams0,
        live: "https://cams-tool.vercel.app/",
        code: "https://github.com/Mohamed-Badr-Saad/CAMS_Tool",
      },
      {
        name: "Instruments Management System",
        highlights: [
          "Calibration workflows for instruments, technicians and engineers",
          "Role-based authentication",
          "PDF reports generated from calibration data",
        ],
        summary: "Calibration workflows for instruments, technicians and engineers, with role-based access and PDF reports.",
        stack: ["React", "Node.js", "MongoDB", "shadcn/ui"],
        image: instruments,
        live: "https://calibration-tool-five.vercel.app/",
        code: "https://github.com/Mohamed-Badr-Saad/calibration-tool",
      },
      {
        name: "Metering Best Match Finder",
        highlights: [
          "Computes the best combination of input values to reach a target",
          "Dynamic programming keeps it fast for real client data",
        ],
        summary: "Finds the combination of input values that best reaches a target, using dynamic programming.",
        stack: ["JavaScript", "Dynamic programming"],
        image: bestMatch,
        live: "https://metering-best-match-finder.vercel.app/",
        code: "https://github.com/Mohamed-Badr-Saad/Metering-Best-Match-Finder",
      },
    ],
  },
  {
    title: "Web products",
    note: "Client and personal products",
    items: [
      {
        name: "PageCraft",
        highlights: [
          "Edits the PDF's own content, not an overlay. It rewrites the page's drawing instructions so changed text keeps the document's original font, and images are moved or replaced without quality loss.",
          "On-device OCR for English and Arabic, including Arabic letter-joining and right-to-left text. When you edit a scanned line, the new words match the scan's ink colour and boldness, and the old words are hidden under a patch made from the surrounding paper.",
          "One codebase on three platforms: a web app, an installable phone app with touch gestures, and an offline desktop app that opens PDFs straight from File Explorer. Files never leave the device.",
        ],
        gallery: [pc5, pc4, pc3, pc1, pc6, pc7],
        summary:
          "A free PDF editor that runs entirely on your device: edit a PDF's existing text and images, sign, comment, read scanned pages in English and Arabic, and organize pages, with no upload and no account. It works in the browser, installs as a phone app, and ships as an offline Windows program.",
        stack: ["React 19", "TypeScript", "Vite", "Zustand", "pdf.js", "pdf-lib + fontkit", "Tesseract.js", "PWA", "Electron", "Playwright", "GitHub Pages"],
        image: pc2,
        live: "https://mohamed-badr-saad.github.io/PDF_Editor/",
        code: "https://github.com/Mohamed-Badr-Saad/PDF_Editor",
      },
      {
        name: "Talié",
        highlights: [
          "Product catalogue, collections, cart and wishlist",
          "Customer accounts with order tracking",
          "Admin dashboard with inventory handling",
          "Paymob payment integration",
        ],
        summary: "Fashion e-commerce with catalogue, cart, wishlist, accounts, order tracking, admin dashboard, inventory and Paymob payments.",
        stack: ["Next.js 16", "Prisma", "PostgreSQL / Supabase", "Paymob"],
        image: talie,
        live: "https://talie.store/",
        code: "https://github.com/Mohamed-Badr-Saad/Ecommerce",
      },
      {
        name: "BadrPicture",
        highlights: [
          "Native mobile feel in the browser",
          "Infinite scroll with optimised loading",
          "Appwrite for auth, database and storage",
        ],
        summary: "Social app with a native mobile feel, infinite scroll and optimised loading.",
        stack: ["React", "TypeScript", "Appwrite", "Vite"],
        image: badrpicture,
        live: "https://badr-picture.vercel.app",
        code: "https://github.com/Mohamed-Badr-Saad/BadrPicture",
      },
    ],
  },
  {
    title: "Earlier projects",
    note: "From training and coursework",
    items: [
      {
        name: "Recipe Finder",
        highlights: ["Search meals and see ingredients and recipes", "Embedded preparation videos", "Plain HTML, CSS and JavaScript"],
        summary: "Meal search with recipes, ingredients and preparation videos.",
        stack: ["HTML", "CSS", "JavaScript"],
        image: recipeFinder,
        live: "https://recipe-finder-app-nu.vercel.app/",
        code: "https://github.com/Mohamed-Badr-Saad/Recipe-Finder",
      },
      {
        name: "E-commerce storefront",
        highlights: ["Custom React hooks and the Context API for state", "A tailored Material UI theme", "Fully responsive layout"],
        summary: "Responsive shop with custom hooks, Context API and a tailored Material UI theme.",
        stack: ["React", "Material UI"],
        image: shop,
        live: "https://e-commerce-eta-six-18.vercel.app",
        code: "https://github.com/Mohamed-Badr-Saad/e-commerce",
      },
      {
        name: "Smart Nutrition System",
        highlights: ["Multi-threaded REST API in C++ with Pistache", "React frontend", "MongoDB for storage"],
        summary: "Multi-threaded C++ REST backend (Pistache) with a React frontend and MongoDB storage.",
        stack: ["C++", "Pistache", "React", "MongoDB"],
        image: nutrition,
        code: "https://github.com/Mohamed-Badr-Saad/nutrition-system",
      },
    ],
  },
];

export const education = {
  degree: "B.Sc. Electronics and Communication Engineering",
  school: "Faculty of Engineering, Alexandria University",
  year: "2023",
  grades: "GPA 3.55 / 4, ranked 6th in the department",
  project:
    "Graduation project: a self-driving car using deep learning and vehicle-to-vehicle communication, covering data collection, model training, hardware integration and performance tuning.",
  courses: [
    { name: "Full Stack Development track", org: "National Telecommunication Institute (NTI)" },
    { name: "Professional Web Development", org: "Udacity" },
  ],
  activities: [
    { name: "Team Coordinator", org: "InnovEgypt", detail: "Design-thinking projects" },
    { name: "Organizer", org: "Student Union", detail: "Newcomer registration and medical examination" },
  ],
  languages: "Arabic (native), English (advanced), German (basic)",
};
