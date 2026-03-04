import { motion } from "framer-motion";
import { Mail } from "lucide-react"; // ← Lucide Icon
import googlePlay from "../assets/google.png";
import appStore from "../assets/apple.png";

export default function DownloadCTA() {
  return (
    <section id="contact-us" className="mt-32 text-center">
      <div className="max-w-4xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold leading-tight text-gray-900"
        >
          Get Instant Scrap Pickup at your doorstep.
          <br />
          <span className="text-green-700">Download Scrapiz!</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 text-lg mt-4"
        >
          Thousands trust us for hassle-free doorstep scrap pickup & instant
          payouts.
        </motion.p>

        {/* Store Buttons */}
        <div className="flex justify-center gap-6 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex justify-center gap-4"
          >
            {/* Google Play Link */}
            <a
              href="https://play.google.com/store/apps/details?id=com.scrapiz.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={googlePlay}
                alt="Google Play"
                className="h-14 cursor-pointer hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </a>
            <a
              href="https://apps.apple.com/in/app/scrapiz-sell-scrap-online/id6756441850"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={appStore}
                alt="App Store"
                className="h-14 cursor-pointer hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </a>
          </motion.div>
        </div>

        {/* Email pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14"
        >
          <p className="text-gray-500 mb-3">Feel free to reach us at:</p>

          <div className="inline-flex items-center gap-3 bg-gray-100 text-gray-800 px-6 py-3 rounded-full shadow-sm border border-gray-200">
            <Mail className="w-5 h-5 text-gray-700" /> {/* Lucide icon */}
            <span className="font-medium">support@scrapiz.in</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
