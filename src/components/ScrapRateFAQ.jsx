import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

const ScrapRateFAQ = ({ scrap, location, faqs: faqsProp }) => {
  if (!scrap) return null;

  const cleanName = scrap.name.replace("Scrap", "").trim();
  const lowerName = cleanName.toLowerCase();
  const locationName = location?.displayName;

  // Use passed-in FAQs if provided, otherwise generate defaults
  const faqs = faqsProp?.length ? faqsProp : [
    {
      question: `What is the ${lowerName} scrap rate ${locationName ? `in ${locationName}` : "today"}?`,
      answer: `The current ${lowerName} scrap rate is around ₹${scrap.pricePerKg} per ${scrap.unit}. Prices may vary based on quality, quantity, and market demand.`,
    },
    {
      question: `Where can I sell ${lowerName} scrap ${locationName ? `in ${locationName}` : "near me"}?`,
      answer: `You can sell your ${lowerName} scrap with Scrapiz. We provide doorstep pickup, instant payment, and the best market rates ${locationName ? `in ${locationName}` : ""}.`,
    },
    {
      question: `How is ${lowerName} scrap price calculated?`,
      answer: `Scrap price depends on factors like purity, weight, and current market demand. Higher quality scrap fetches better prices.`,
    },
    {
      question: `Do you offer scrap pickup ${locationName ? `in ${locationName}` : ""}?`,
      answer: `Yes, Scrapiz provides free doorstep pickup and instant payment for all types of scrap.`,
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, faqs.length);
  }, [faqs.length]);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleKey = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(index);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
            <span className="text-sm font-semibold">FAQs</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions About {cleanName} Scrap{" "}
            {locationName ? `in ${locationName}` : ""}
          </h2>

          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Common questions about {lowerName} scrap rates, pricing, and pickup services{" "}
            {locationName ? `in ${locationName}` : ""}.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                    onClick={() => toggle(index)}
                    onKeyDown={(e) => handleKey(e, index)}
                    className="w-full flex justify-between items-center px-6 py-5 text-left text-base font-semibold text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
                  >
                    <span className="flex-1 pr-4">{faq.question}</span>

                    <span
                      className={`ml-3 transform transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    ref={(el) => (contentRefs.current[index] = el)}
                    style={{
                      maxHeight: isOpen
                        ? `${contentRefs.current[index]?.scrollHeight ?? 500}px`
                        : "0px",
                      transition: "max-height 0.36s ease",
                      overflow: "hidden",
                    }}
                    className="px-6"
                  >
                    <div className="py-5 text-base text-gray-600 leading-relaxed border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mt-8 text-sm text-gray-600"
          >
            <p>Still have questions? Contact us — we’re happy to help.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScrapRateFAQ;