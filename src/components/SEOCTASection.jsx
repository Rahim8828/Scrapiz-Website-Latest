import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const SEOCTASection = ({ scrap, location, openModal }) => {
  const handleBookPickup = () => {
    if (openModal) openModal();
  };

  const handleCallNow = () => {
    window.location.href = "tel:+918828700630";
  };

  const cleanName = scrap?.name?.replace("Scrap", "").trim();
  const locationName = location?.displayName;

  /* =========================
     🧠 DYNAMIC TEXT LOGIC
  ========================= */

  let heading = "Sell Scrap at Best Price";
  let description =
    "Get the highest scrap rate, instant payment, and free doorstep pickup with Scrapiz.";

  if (cleanName && locationName) {
    heading = `Sell ${cleanName} Scrap in ${locationName}`;
    description = `Looking to sell ${cleanName.toLowerCase()} scrap in ${locationName}? Get the best price, instant payment, and free pickup with Scrapiz.`;
  } else if (cleanName) {
    heading = `Sell ${cleanName} Scrap at Best Price`;
    description = `Looking to sell ${cleanName.toLowerCase()} scrap? Get the highest scrap rate, instant payment, and free pickup with Scrapiz.`;
  } else if (locationName) {
    heading = `Sell Scrap in ${locationName}`;
    description = `Sell your scrap in ${locationName} at the best rates. Get instant payment and doorstep pickup with Scrapiz.`;
  }

  return (
    <section className="py-14 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12 text-center"
        >
          {/* PRICE BADGE */}
          {scrap?.pricePerKg && (
            <span className="inline-block bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-1 rounded-full mb-5">
              Current Rate: ₹{scrap.pricePerKg} / {scrap.unit}
            </span>
          )}

          {/* HEADING */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            {heading}
          </h2>

          {/* DESCRIPTION */}
          <p className="text-sm lg:text-base text-gray-500 mb-6 max-w-xl mx-auto">
            {description}
          </p>

          {/* DIVIDER */}
          <div className="border-t border-gray-100 my-6" />

          {/* TRUST BADGES */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 text-xs text-green-700">
            <span className="bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">✔ Same Day Pickup</span>
            <span className="bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">✔ Instant Payment</span>
            <span className="bg-green-50 border border-green-200 px-3 py-1.5 rounded-full font-medium">✔ No Hidden Charges</span>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleBookPickup}
              size="lg"
              className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700 px-8 py-6 rounded-full font-bold shadow-md hover:scale-105 transition-all group"
            >
              Book Free Pickup
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              onClick={handleCallNow}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-6 rounded-full font-semibold transition-all"
            >
              <Phone className="mr-2 w-5 h-5" />
              Call Now
            </Button>
          </div>

          {/* SUPPORT */}
          <p className="mt-6 text-gray-400 text-xs">
            Need help?{" "}
            <a href="/contact" className="font-semibold text-green-600 hover:text-green-700">
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default SEOCTASection;