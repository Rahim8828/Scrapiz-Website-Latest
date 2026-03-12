import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "What is Scrapiz?", answer: "Scrapiz is a smart scrap pickup and recycling platform." },
    { question: "How do I send a service request with Scrapiz?", answer: "You can easily request via our app or website." },
    { question: "Can I get multiple tasks done in one booking?", answer: "Yes, you can include multiple scrap items in one request." },
    { question: "What if I need to cancel the pickup?", answer: "You can cancel anytime before the pickup partner arrives." },
    { question: "Do you offer reschedule options?", answer: "Yes, pickups can be rescheduled from the app." },
  ];

  return (
    <section id="faqs" className="mt-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* FAQ Cards */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex justify-between items-center text-left"
              >
                <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>

                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 py-4 text-gray-700 bg-gray-50">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQs;