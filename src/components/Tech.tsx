// // import { BallCanvas } from "./canvas";
// // import { SectionWrapper } from "../hoc";
// // import { technologies } from "../constants";

// // const Tech = () => {
// //   return (
// //     <div className="flex flex-row flex-wrap justify-center gap-10">
// //       {technologies.map((technology) => {
// //         return (
// //           <div className="w-28 h-28" key={technology.name}>
// //             <BallCanvas icon={technology.icon} />
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // };

// // const WrappedTech = SectionWrapper(Tech, "tech");
// // export default WrappedTech;



// import { SectionWrapper } from "../hoc";
// import { styles } from "../styles";
// import TechCanvas from "./canvas/TechCanvas";

// const Tech = () => {
//   return (
//     <div className="flex flex-col items-center">
//       {/* Section header */}
//       <div className="text-center mb-8">
//         <p className={`${styles.sectionSubText}`}>What I work with</p>
//         <h2 className={`${styles.sectionHeadText}`}>Technologies.</h2>
//       </div>
      
//       {/* Single Canvas containing all tech icons */}
//       <div className="w-full max-w-6xl h-96">
//         <TechCanvas />
//       </div>
//     </div>
//   );
// };

// const WrappedTech = SectionWrapper(Tech, "tech");
// export default WrappedTech;



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