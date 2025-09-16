import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { styles } from "../styles";
import TechCanvasGrid from "./canvas/TechCanvasGrid";

const Tech = () => {
  return (
    <div className="flex flex-col items-center" >
      <div className="text-center mb-8">
        <p className={`${styles.sectionSubText}`}>What I work with</p>
        <h2 className={`${styles.sectionHeadText}`}>Technologies.</h2>
      </div>
      
      <TechCanvasGrid technologies={technologies} />
    </div>
  );
};

const WrappedTech = SectionWrapper(Tech, "tech");
export default WrappedTech;