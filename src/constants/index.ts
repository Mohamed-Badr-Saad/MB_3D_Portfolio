import {
  backend1,
  web1,
  frontend,
  Embedded,
  javascript,
  typescript,
  html,
  reactjs,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  mobile1,
  fullstack,
  api,
  uiux,
  seitech,
  NTI,
  freelance,
  mysql,
  shadcn,
  bootstrap,
  sass,
  badrShop,
  recipeFinder,
  badrPics,
  bestMatchFinder,
  nutrition,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web1,
  },
  {
    title: "Frontend Developer",
    icon: frontend,
  },
  {
    title: "Backend Developer",
    icon: backend1,
  },
  {
    title: "Mobile App Developer",
    icon: mobile1,
  },
  {
    title: "Full-Stack Solutions",
    icon: fullstack,
  },
  {
    title: "API Development & Integration",
    icon: api,
  },
  {
    title: "UI/UX Implementation",
    icon: uiux,
  },
  {
    title: "Embedded Systems Developer",
    icon: Embedded,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "SASS",
    icon: sass,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Bootstrap",
    icon: bootstrap,
  },
  {
    name: "shadcn",
    icon: shadcn,
  },
  {
    name: "MySQL",
    icon: mysql,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "Git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
];

const experiences = [
  {
    title: "Freelance Software Developer",
    company_name: "Self-Employed",
    icon: freelance,
    iconBg: "#E6DEDD",
    date: "2024 - Present",
    points: [
      "Designed and developed custom software solutions tailored to client needs, including web and mobile applications.",
      "Implemented responsive, user-friendly interfaces and optimized backend performance for scalability.",
      "Integrated databases, APIs, and third-party services to ensure smooth and secure data flow.",
      "Managed the full development cycle from requirements gathering to deployment and post-launch support.",
    ],
  },
  {
    title: "Software Developer (OJT)",
    company_name: "SEITech Solutions",
    icon: seitech,
    iconBg: "#E6DEDD",
    date: "January 2024 - May 2024",
    points: [
      "Gained hands-on experience with SDLC processes, version control, and software design patterns.",
      "Assisted in developing and maintaining web applications using React.js, Node.js, and MongoDB.",
      "Collaborated with senior developers to troubleshoot and debug application issues.",
      "Utilized DOORS for requirements management in software engineering projects.",
    ],
  },
  {
    title: "Full Stack Development Intern",
    company_name: "National Telecommunication Institute (NTI)",
    icon: NTI,
    iconBg: "#E6DEDD",
    date: "July 2023 - December 2023",
    points: [
      "Completed a 288-hour technical program covering both frontend and backend development.",
      "Built web applications using HTML, CSS/SASS, JavaScript, React.js, Node.js, and RESTful APIs.",
      "Implemented authentication, database integration, and responsive design in multiple projects.",
      "Collaborated with peers on group projects, applying Agile methodologies and Git version control.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "BadrPicture",
    description:
      "Modern social media app with a native mobile feel, infinite scroll, and high performance using React.js, TypeScript, Shadcn, and Appwrite backend.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "typescript", color: "pink-text-gradient" },
      { name: "appwrite", color: "green-text-gradient" },
      { name: "vite", color: "yellow-text-gradient" },
    ],
    image: badrPics,
    source_code_link: "https://github.com/Mohamed-Badr-Saad/BadrPicture",
    live_link: "https://badr-picture.vercel.app",
  },
  {
    name: "E-Commerce App",
    description:
      "Responsive e-commerce web app built with React.js and Material-UI, featuring custom hooks, context API, and a tailored theme for optimized performance.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "material-ui", color: "pink-text-gradient" },
      { name: "context-api", color: "green-text-gradient" },
    ],
    image: badrShop,
    source_code_link: "https://github.com/Mohamed-Badr-Saad/e-commerce",
    live_link: "https://e-commerce-eta-six-18.vercel.app",
  },

  {
    name: "Responsive Recipe Finder",
    description:
      "Web application that fetches and displays meal data with recipes, ingredients, and videos, built using HTML, CSS, and JavaScript.",
    tags: [
      { name: "html", color: "blue-text-gradient" },
      { name: "css", color: "pink-text-gradient" },
      { name: "javascript", color: "yellow-text-gradient" },
    ],
    image: recipeFinder,
    source_code_link: "https://github.com/Mohamed-Badr-Saad/Recipe-Finder",
    live_link: "https://recipe-finder-app-nu.vercel.app/",
  },
  {
    name: "Smart Nutrition System",
    description:
      "Multi-threaded nutrition management system with a Pistache RESTful API backend and a React.js frontend, integrating MongoDB for data storage.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "pistache", color: "green-text-gradient" },
      { name: "mongodb", color: "pink-text-gradient" },
    ],
    image: nutrition,
    source_code_link: "https://github.com/Mohamed-Badr-Saad/nutrition-system",
    live_link:""
  },
  {
    name: "Metering Best Match Finder",
    description:
      "Custom tool using dynamic programming to calculate optimal combinations of input values to reach a target value, developed for specific client needs.",
    tags: [
      { name: "javascript", color: "yellow-text-gradient" },
      { name: "dynamic-programming", color: "green-text-gradient" },
      { name: "algorithm", color: "blue-text-gradient" },
    ],
    image: bestMatchFinder,
    source_code_link:
      "https://github.com/Mohamed-Badr-Saad/Metering-Best-Match-Finder",
      live_link:"https://metering-best-match-finder.vercel.app"
  },
];

export { services, technologies, experiences, testimonials, projects };
