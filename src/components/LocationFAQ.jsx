import React, { useState, useRef, useEffect } from "react";

const LocationFAQ = ({ faqs, name }) => {
  if (!faqs || faqs.length === 0) return null;
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, faqs.length);
  }, [faqs.length]);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleKey = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(index);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-semibold">FAQs</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Frequently Asked Questions About Scrap Pickup in {name}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold"
                  >
                    <span>{faq.question}</span>
                    <span className={`transform ${isOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>

                  <div
                    style={{
                      maxHeight: isOpen ? "200px" : "0px",
                      overflow: "hidden",
                      transition: "0.3s",
                    }}
                  >
                    <div className="px-6 pb-5 text-gray-600">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default LocationFAQ;