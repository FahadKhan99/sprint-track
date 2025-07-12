import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { FAQs } from "@/constants/faqs";

const AccordionFAQs = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full max-w-4xl mx-auto overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm"
    >
      {FAQs.map(({ id, question, answer }) => (
        <AccordionItem
          key={id}
          value={id.toString()}
          className="border-b border-white/10 last:border-none"
        >
          <AccordionTrigger
            className="
          flex justify-between items-center w-full
          px-6 py-5
          text-base sm:text-lg font-medium text-white/90
          hover:text-white
          transition-colors duration-200
          data-[state=open]:text-blue-400
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20
        "
          >
            {question}
          </AccordionTrigger>

          <AccordionContent
            className="
          px-6 pb-6 pt-0 text-sm sm:text-base text-white/70 leading-relaxed
          transition-all duration-300 ease-in-out
        "
          >
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionFAQs;
