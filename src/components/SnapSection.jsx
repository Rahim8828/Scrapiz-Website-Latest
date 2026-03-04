import { motion } from "framer-motion";
import ResponsiveAssetImage from "./ResponsiveAssetImage";

export default function SnapSection() {
  return (
    <section className="px-4 sm:px-6 md:px-10 mt-4 md:mt-16">
      <div
        className="snap-section-box bg-[#D9F1E1] rounded-[32px] md:rounded-[40px]
                   flex flex-col md:flex-row 
                   items-center justify-between md:justify-center
                   overflow-hidden relative
                   md:px-14 md:py-6
                   md:h-[500px] lg:h-[560px]
                   md:gap-6"
      >
        {/* Phones Image — takes ~70% of box on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="snap-phones-wrapper flex justify-center
                     w-full md:max-w-[550px] lg:max-w-[600px]
                     md:overflow-hidden"
        >
          <ResponsiveAssetImage
            src="phones.png"
            alt="Scrapiz App Preview"
            className="snap-phones-img w-auto object-contain
                       md:h-full md:scale-[1.35] lg:scale-150"
            loading="lazy"
          />
        </motion.div>

        {/* Text — takes ~20-25% of box on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="snap-text-wrapper text-center md:text-left
                     w-full md:max-w-lg"
        >
          <h2 className="snap-heading text-3xl sm:text-4xl md:text-6xl font-bold leading-tight text-black">
            Sell your <span className="text-green-700">Scrap</span>
            <br />
            in a Snap!
          </h2>
        </motion.div>
      </div>
    </section>
  );
}