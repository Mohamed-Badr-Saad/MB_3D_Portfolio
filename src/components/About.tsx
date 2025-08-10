import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { services } from "../constants";
import { Tilt } from "react-tilt";
import { SectionWrapper } from "../hoc";

const About = () => {
  const ServiceCard = ({
    index,
    title,
    icon,
  }: {
    index: number;
    title: string;
    icon: string;
  }) => {
    return (
      <Tilt className="xs:w-[250px] w-full">
        <motion.div
          variants={fadeIn("right", "spring", index * 0.5, 0.75)}
          className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
        >
          <div
            options={{ max: 45, scale: 1.1, speed: 450 }}
            className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col "
          >
            <img src={icon} alt={title} className="w-16 h-16 object-contain" />
            <h3 className="text-white text-[20px] font-bold text-center">
              {title}
            </h3>
          </div>
        </motion.div>
      </Tilt>
    );
  };

  return (
    <>
      <motion.div variants={textVariant(0.1)}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>
      <motion.p
        variants={fadeIn("", "", 0.2, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] "
      >
        I am a software engineer with a passion for building innovative
        solutions that solve real-world problems. With a strong foundation in
        computer science and a keen interest in web development, I have honed my
        skills in various programming languages and frameworks. My experience
        includes developing responsive web applications, optimizing performance,
        and ensuring seamless user experiences. I thrive in collaborative
        environments and am always eager to learn new technologies to enhance my
        skill set.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
//we wrapped the About component with SectionWrapper HOC to add motion effects and styles
//SectionWrapper is a Higher Order Component (HOC) that adds motion effects and styles to the component
//it uses framer-motion for animations and styles from a styles file
//the SectionWrapper HOC takes the component and an id as arguments and returns a new component
