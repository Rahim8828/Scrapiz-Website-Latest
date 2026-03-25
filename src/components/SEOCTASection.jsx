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

  let heading = "Sell Scrap at Best Price 💰";
  let description =
    "Get the highest scrap rate, instant payment, and free doorstep pickup with Scrapiz.";

  if (cleanName && locationName) {
    heading = `Sell ${cleanName} Scrap in ${locationName} 💰`;
    description = `Looking to sell ${cleanName.toLowerCase()} scrap in ${locationName}? Get the best price, instant payment, and free pickup with Scrapiz.`;
  } else if (cleanName) {
    heading = `Sell ${cleanName} Scrap at Best Price 💰`;
    description = `Looking to sell ${cleanName.toLowerCase()} scrap? Get the highest scrap rate, instant payment, and free pickup with Scrapiz.`;
  } else if (locationName) {
    heading = `Sell Scrap in ${locationName} 💰`;
    description = `Sell your scrap in ${locationName} at the best rates. Get instant payment and doorstep pickup with Scrapiz.`;
  }

  return (
    <section className="py-14 lg:py-20 relative overflow-hidden bg-gray-900">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 opacity-90"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* 🔥 HEADING */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            {heading}

            {/* PRICE (only if scrap exists) */}
            {scrap?.pricePerKg && (
              <span className="block text-yellow-300 text-lg mt-2">
                ₹{scrap.pricePerKg} / {scrap.unit}
              </span>
            )}
          </h2>

          {/* 🔥 DESCRIPTION */}
          <p className="text-sm lg:text-base text-green-100 mb-6">
            {description}
          </p>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 text-xs text-green-200">
            <span className="bg-white/10 px-3 py-1 rounded-full">✔ Same Day Pickup</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">✔ Instant Payment</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">✔ No Hidden Charges</span>
          </div>

          {/* BUTTONS */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleBookPickup}
              size="lg"
              className="w-full sm:w-auto bg-yellow-400 text-gray-900 hover:bg-yellow-500 px-8 py-6 rounded-full font-bold shadow-lg hover:scale-105 transition-all group"
            >
              Book Free Pickup
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              onClick={handleCallNow}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-6 rounded-full font-semibold"
            >
              <Phone className="mr-2 w-5 h-5" />
              Call Now
            </Button>
          </motion.div>

          {/* SUPPORT */}
          <motion.div
            className="mt-6 text-green-200 text-xs"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>
              Need help?{" "}
              <a
                href="/contact"
                className="font-semibold text-white underline hover:text-yellow-300"
              >
                Contact our team
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SEOCTASection;