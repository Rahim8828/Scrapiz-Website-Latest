"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/**
 * DesktopCardStack — scroll-driven, pinned section.
 * The heading is INSIDE the sticky viewport so there's no gap.
 */
export const CardStack = ({ items, heading }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return <MobileCarousel items={items} heading={heading} />;
  }

  return <DesktopScrollStack items={items} heading={heading} />;
};

/* ========================================
   DESKTOP: Scroll-driven sticky card stack
   ======================================== */
function DesktopScrollStack({ items, heading }) {
  const totalCards = items.length;
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      className="card-stack-scroll-container"
      style={{ height: `${totalCards * 100}vh`, position: "relative" }}
    >
      <div className="card-stack-sticky-viewport">
        {/* Heading inside sticky so it stays visible */}
        {heading}

        {/* Cards area */}
        <div className="card-stack-cards-wrap">
          {items.map((card, index) => (
            <ScrollCard
              key={card.id}
              card={card}
              index={index}
              totalCards={totalCards}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScrollCard({ card, index, totalCards, scrollYProgress }) {
  const segmentSize = 1 / totalCards;
  const start = index * segmentSize;
  const end = start + segmentSize;

  const enterStart = start;
  const enterEnd = start + segmentSize * 0.25;
  const exitStart = end - segmentSize * 0.25;
  const exitEnd = end;

  let opacityInputRange, opacityOutputRange;
  let yInputRange, yOutputRange;

  if (index === 0) {
    opacityInputRange = [exitStart, exitEnd];
    opacityOutputRange = [1, 0];
    yInputRange = [exitStart, exitEnd];
    yOutputRange = [0, -40];
  } else if (index === totalCards - 1) {
    opacityInputRange = [enterStart, enterEnd];
    opacityOutputRange = [0, 1];
    yInputRange = [enterStart, enterEnd];
    yOutputRange = [50, 0];
  } else {
    opacityInputRange = [enterStart, enterEnd, exitStart, exitEnd];
    opacityOutputRange = [0, 1, 1, 0];
    yInputRange = [enterStart, enterEnd, exitStart, exitEnd];
    yOutputRange = [50, 0, 0, -40];
  }

  const opacity = useTransform(scrollYProgress, opacityInputRange, opacityOutputRange);
  const y = useTransform(scrollYProgress, yInputRange, yOutputRange);
  const scale = useTransform(
    scrollYProgress,
    index === 0 ? [0, 0.001] : [enterStart, enterEnd],
    index === 0 ? [1, 1] : [0.98, 1]
  );

  return (
    <motion.div
      className="card-stack-card"
      style={{ opacity, y, scale }}
    >
      {card.content}
    </motion.div>
  );
}

/* ========================================
   MOBILE: Arrow-button carousel
   ======================================== */
function MobileCarousel({ items, heading }) {
  const [current, setCurrent] = useState(0);

  const goNext = () => setCurrent((p) => Math.min(p + 1, items.length - 1));
  const goPrev = () => setCurrent((p) => Math.max(p - 1, 0));

  return (
    <section className="mobile-carousel-section">
      {heading}

      <div className="mobile-carousel-wrapper">
        {/* Left Arrow */}
        <button
          className="mobile-carousel-arrow mobile-carousel-arrow--left"
          onClick={goPrev}
          disabled={current === 0}
          aria-label="Previous step"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Card */}
        <div className="mobile-carousel-card-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={items[current].id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {items[current].content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button
          className="mobile-carousel-arrow mobile-carousel-arrow--right"
          onClick={goNext}
          disabled={current === items.length - 1}
          aria-label="Next step"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
