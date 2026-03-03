import { motion } from "framer-motion";
import { CardStack } from "@/components/ui/card-stack";

// IMPORT IMAGES FROM ASSETS
import copperImg from "../assets/step1.png";
import addImg from "../assets/step2.png";
import scheduleImg from "../assets/step3.png";
import addressImg from "../assets/step4.png";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mt-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            How it <span className="text-green-700">works?</span>
          </h2>
        </motion.div>

        {/* Card Stack */}
        <div className="flex justify-center">
          <div className="w-full max-w-5xl min-h-[26rem] md:min-h-[rem]">
            <CardStack items={SCRAPIZ_STEPS} />
          </div>
        </div>
      </div>
    </section>
  );
}

// STEP CARD UI
const StepCard = ({ step, img, title, description }) => {
  return (
    <div
      className="
        bg-white shadow-2xl rounded-3xl 
        px-6 py-8 md:px-10 md:py-10
        flex flex-col md:flex-row
        gap-8 md:gap-10 items-center 
        w-full h-auto md:h-full
      "
    >
      {/* Image */}
      <div
        className="
        w-40 h-40 md:w-56 md:h-56 
        rounded-3xl overflow-hidden flex-shrink-0
      "
      >
        <img src={img} alt={title} className="object-cover w-full h-full" />
      </div>

      {/* Text */}
      <div className="flex-1 text-center md:text-left">
        <span className="bg-green-700 text-white text-sm px-5 py-1.5 rounded-full font-semibold">
          Step {step}
        </span>

        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-5">
          {title}
        </h3>

        <p className="text-gray-600 mt-4 text-base leading-relaxed md:max-w-xl">
          {description}
        </p>
      </div>
    </div>
  );
};

// CARD DATA
const SCRAPIZ_STEPS = [
  {
    id: 1,
    name: "Step 1",
    content: (
      <StepCard
        step="1"
        img={copperImg}
        title="KNOW YOUR SCRAP VALUE"
        description="Check live rates and estimate your earnings instantly before booking."
      />
    ),
  },
  {
    id: 2,
    name: "Step 2",
    content: (
      <StepCard
        step="2"
        img={addImg}
        title="ADD ITEMS & QUANTITY"
        description="Select scrap types, set the quantity and get real-time price estimates."
      />
    ),
  },
  {
    id: 3,
    name: "Step 3",
    content: (
      <StepCard
        step="3"
        img={scheduleImg}
        title="SCHEDULE PICKUP"
        description="Choose a time slot that works best for you and book a doorstep pickup."
      />
    ),
  },
  {
    id: 4,
    name: "Step 4",
    content: (
      <StepCard
        step="4"
        img={addressImg}
        title="DOORSTEP COLLECTION"
        description="Our pickup partner arrives at your location and you get paid instantly."
      />
    ),
  },
];
