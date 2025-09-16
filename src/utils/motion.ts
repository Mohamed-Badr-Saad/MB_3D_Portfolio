import { easeOut, type Variants } from "framer-motion";

// types for direction and motion types
type Direction = "left" | "right" | "up" | "down";
type MotionType = "tween" | "spring" | "inertia";

export const textVariant = (delay: number): Variants => {
  return {
    hidden: {
      y: -50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        duration: 1.25,
        delay: delay,
      },
    },
  };
};

export const fadeIn = (direction: string, type: string, delay: number, duration: number) => {
  const isMobile = window.innerWidth <= 768;
  
  return {
    hidden: {
      x: direction === "left" ? (isMobile ? -50 : -100) : direction === "right" ? (isMobile ? 50 : 100) : 0,
      y: direction === "up" ? (isMobile ? -50 : -100) : direction === "down" ? (isMobile ? 50 : 100) : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type,
        delay: isMobile ? delay * 0.5 : delay, // Faster on mobile
        duration: isMobile ? duration * 0.7 : duration, // Shorter duration on mobile
        ease: "easeOut",
      },
    },
  };
};

export const staggerContainer = (staggerChildren: number, delayChildren: number) => {
  const isMobile = window.innerWidth <= 768;
  
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: isMobile ? staggerChildren * 0.5 : staggerChildren,
        delayChildren: isMobile ? delayChildren * 0.5 : delayChildren,
      },
    },
  };
};

export const zoomIn = (delay: number, duration: number): Variants => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween" as const,
        delay: delay,
        duration: duration,
        ease: easeOut,
      },
    },
  };
};

export const slideIn = (
  direction: Direction,
  type: MotionType,
  delay: number,
  duration: number
): Variants => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: easeOut, // cast here
      },
    },
  };
};

