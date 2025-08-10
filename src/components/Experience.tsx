import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

import { motion } from "framer-motion";
import "react-vertical-timeline-component/style.min.css";
import { styles } from "../styles";
import { experiences } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";


type ExperienceType = {
  title: string;
  company_name: string;
  icon: string;
  iconBg: string;
  date:string;
  points: string[];
};

const Experience = () => {
  const ExperienceCard = ({experience}:{experience: ExperienceType}) => {
    return (
      <VerticalTimelineElement
        contentStyle={{ background: "#1d1836", color: "#fff" }}
        contentArrowStyle={{ borderRight: "7px solid  #232631" }}
        date={experience.date}
        iconStyle={{ background: experience.iconBg }}
        icon={
          <div className="flex justify-center items-center w-full h-full">
            <img
              src={experience.icon}
              alt={experience.company_name}
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
        }
      >
        <div>
          <h3 className="text-white text-[24px] font-bold">{experience.title}</h3>
          <p className="text-secondary text-[16px] font-semibold" style={{margin:0}}>{experience.company_name}</p>
        <ul>
          {experience.points.map((point,index)=>{
            return(
              <li key={`experience-point-${index}`} className="text-white-100 text-[14px] pl-1 tracking-wider">
                {point}
              </li>
            )
          })}
        </ul>
        
        </div>

      </VerticalTimelineElement>
    );
  };
  return (
    <>
      <motion.div variants={textVariant(0.1)}>
        <p className={styles.sectionSubText}>WHAT I HAVE DONE SO FAR.</p>
        <h2 className={styles.sectionHeadText}>Work Experience.</h2>
      </motion.div>

      <div className="flex flex-col mt-20">
        <VerticalTimeline>
          {experiences.map((experience, index) => {
            return <ExperienceCard key={`experience-${index}`} experience={experience} />;
          })}
        </VerticalTimeline>
      </div>
    </>
  );
};

const WrappedExperience = SectionWrapper(Experience, "work");
export default WrappedExperience;
