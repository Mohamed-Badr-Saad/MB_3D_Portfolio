// All site copy lives here, so updating the portfolio never means touching layout code.
import dms from "../assets/projects/dms.webp";
import talie from "../assets/projects/talie.webp";
import instruments from "../assets/projects/instruments.webp";
import badrpicture from "../assets/projects/badrpicture.webp";
import recipeFinder from "../assets/projects/recipe-finder.webp";
import bestMatch from "../assets/projects/best-match.webp";
import shop from "../assets/projects/shop.webp";
import nutrition from "../assets/projects/nutrition.webp";
import hoDashboard from "../assets/handover/dashboard.webp";
import hoList from "../assets/handover/handovers.webp";
import hoDetail from "../assets/handover/handover-detail.webp";
import hoEquipment from "../assets/handover/equipment.webp";

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
  { name: "Plant Handover", src: hoDashboard },
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
      "Delivered the Deferral Management System, Instruments Management System, Metering Best Match Finder and Plant Handover.",
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
    note: "Built for Rashpetco engineering teams",
    items: [
      {
        name: "Plant Handover",
        highlights: [
          "Runs in Chrome or Edge straight from a folder: no server, nothing to install",
          "Saves to a shared network folder through the browser's File System Access API",
          "15,981 handovers imported from the old Excel sheets and searchable with the new ones",
          "Every handover links to equipment tags, and each tag has its own history page",
          "Filters, CSV export, comments, attachments, notifications and an admin area",
        ],
        gallery: [hoList, hoDetail, hoEquipment],
        summary:
          "The instruments department's shift log. Runs in the browser with no server, saving to a shared folder, with 15,981 old Excel records imported.",
        stack: ["Browser app", "File System Access API", "No server"],
        image: hoDashboard,
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
        live: "https://talie-ecommerce.vercel.app/",
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
