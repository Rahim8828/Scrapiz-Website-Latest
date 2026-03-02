import { motion } from "framer-motion";
import phones from "../assets/phones.png";

export default function SnapSection() {
  return (
    <section className="px-6 md:px-10 mt-16">
      <div
        className="bg-[#D9F1E1] rounded-[40px]
                   px-8 md:px-14 py-8 md:py-6
                   flex flex-col md:flex-row 
                   items-center justify-center
                   gap-10 md:gap-6
                   overflow-hidden relative
                   h-[380px] md:h-[420px] lg:h-[460px]"  // FIXED HEIGHT
      >
        {/* Phones Image (inside fixed box) */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex justify-center 
                     max-h-full max-w-[450px] 
                     overflow-hidden"
        >
          <motion.img
            src={phones}
            alt="Scrapiz App Preview"
            className="h-full w-auto object-contain"   // prevents container stretching
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-lg text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-black">
            Sell your <span className="text-green-700">Scrap</span>
            <br />
            in a Snap!
          </h2>
        </motion.div>
      </div>
    </section>
  );
}