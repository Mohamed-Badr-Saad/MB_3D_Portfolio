//this is a Higher Order Component (HOC) that wraps a component with motion effects

import { motion } from "framer-motion";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";
import type React from "react";

const SectionWrapper = (Component: React.FC, id: string) =>
  function HOC() {
    return (
      <motion.div
        variants={staggerContainer(0.3, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
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
