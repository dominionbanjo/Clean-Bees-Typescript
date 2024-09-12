import { faq1 } from "../utils/faq";
import FaqItem from "./FaqItem";
const GeneralList = () => {
  return (
    <>
      <div className="list-general">
        {faq1.map((faq, index) => {
          return (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          );
        })}
      </div>
    </>
  );
};
export default GeneralList;
