import { faq2 } from "../utils/faq";
import FaqItem from "./FaqItem";

const SecondList = () => {
  return (
    <>
      <div className="list-setting ">
        {faq2.map((faq, index) => {
          return (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          );
        })}
      </div>
    </>
  );
};
export default SecondList;
