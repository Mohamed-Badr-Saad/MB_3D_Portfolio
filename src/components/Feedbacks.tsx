import { motion} from "framer-motion";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";
import { SectionWrapper } from "../hoc";

const Feedbacks = () => {
  interface FeedbackCardProps {
    index: number;
    testimonial: string;
    name: string;
    company: string;
    designation: string;
    image: string;
  }

  const FeedbackCard = (props: FeedbackCardProps) => {
    return (
      <motion.div
        className="bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full"
        variants={fadeIn("up", "spring", props.index * 0.5, 0.75)}
      >
        <p className="text-white font-black text-[48px]">"</p>
        <p className="text-white tracking-wider text-[18px] mt-1">
          {props.testimonial}
        </p>

        <div className="mt-7 flex justify-between items-center gap-1">
          <div className="flex-1 flex flex-col">
            <p className="text-white font-medium text-[16px]">
              <span className="blue-text-gradient">@{props.name}</span> of{" "}
              {props.company}
            </p>
            <p className="mt-1 text-secondary text-[12px]">
              {props.designation} of {props.company}
            </p>
          </div>
          <img
            src={props.image}
            alt={`feedback_by-${props.name}`}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </motion.div>
    );
  };

  
  return (
    <div className="mt-12 bg-black-100 rounded-[20px]">
      <div
        className={`${styles.padding} bg-tertiary rounded-2xl min-h-[300px]`}
      >
        <motion.div variants={textVariant(0.3)}>
          <p className={styles.sectionSubText}>What others say</p>
          <h2 className={styles.sectionHeadText}>Testimonials</h2>
        </motion.div>
      </div>
      <div className={`${styles.paddingX} -mt-20 pb-14 flex flex-wrap gap-8`}>
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

const WrappedFeedback = SectionWrapper(Feedbacks, "feedbacks");
export default WrappedFeedback;
