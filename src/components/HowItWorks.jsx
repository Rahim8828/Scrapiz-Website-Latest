import { motion } from "framer-motion";
import { CardStack } from "@/components/ui/card-stack";
import ResponsiveAssetImage from "./ResponsiveAssetImage";

export default function HowItWorks() {
  const heading = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="how-it-works-heading"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
        How it <span className="text-green-700">works?</span>
      </h2>
    </motion.div>
  );

  return (
    <section id="how-it-works" className="how-it-works-section">
      <CardStack items={SCRAPIZ_STEPS} heading={heading} />
    </section>
  );
}

// STEP CARD UI
const StepCard = ({ step, img, title, description }) => {
  return (
    <div className="step-card">
      {/* Image */}
      <div className="step-card-image-wrapper">
        <ResponsiveAssetImage src={img} alt={title} className="step-card-image" loading="lazy" />
      </div>

      {/* Text */}
      <div className="step-card-text">
        <span className="step-card-badge">Step {step}</span>
        <h3 className="step-card-title">{title}</h3>
        <p className="step-card-description">{description}</p>
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
        img="step1.png"
        title="KNOW YOUR SCRAP VALUE"
        description="Want to sell scrap now? Check live rates and estimate your earnings instantly. Prefer later? Plan your pickup at your convenience."
      />
    ),
  },
  {
    id: 2,
    name: "Step 2",
    content: (
      <StepCard
        step="2"
        img="step2.png"
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
        img="step3.png"
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
        img="step4.png"
        title="DOORSTEP COLLECTION"
        description="Our pickup partner arrives at your location and you get paid instantly."
      />
    ),
  },
];
