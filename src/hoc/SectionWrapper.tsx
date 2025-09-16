//this is a Higher Order Component (HOC) that wraps a component with motion effects

import { motion } from "framer-motion";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";
import type React from "react";
import { useState, useEffect } from "react";

const SectionWrapper = (Component: React.FC, id: string) =>
  function HOC() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
      <motion.div
        variants={staggerContainer(0.3, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{
          once: true,
          amount: isMobile ? 0.1 : 0.25, // Lower threshold for mobile
          margin: isMobile ? "-10% 0px -10% 0px" : "0px", // Trigger earlier on mobile
        }}
        className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
      >
        <span className="hash-span" id={id}>
          &nbsp;
        </span>
        <Component />
      </motion.div>
    );
  };

export default SectionWrapper;
