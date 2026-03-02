import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import verifiedImg from "../assets/verfied.jpeg"
import pricingImg from "../assets/pricing.jpeg"
import pickupImg from "../assets/pickup.jpeg"
import img4 from "../assets/whyus.jpeg"
import img5 from "../assets/img5.jpeg"

export default function WhyChooseScrapiz() {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = 350

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  const cards = [
    {
      img: verifiedImg,
      title: "VERIFIED & TRAINED PICKUP PARTNERS",
      desc: "Verified experts for safe and reliable scrap collection",
    },
    {
      img: pricingImg,
      title: "TRANSPARENT LIVE PRICING",
      desc: "100% transparent pricing with live rate estimates.",
    },
    {
      img: pickupImg,
      title: "DOORSTEP PICKUP & HEAVY LIFTING",
      desc: "Sit back while we handle the pickup, lifting, and disposal.",
    },
    {
      img: img4,
      title: "INSTANT BOOKING",
      desc: "Book scrap pickup within seconds through our platform.",
    },
    {
      img: img5,
      title: "ECO-FRIENDLY RECYCLING",
      desc: "We ensure responsible recycling and waste management.",
    },
  ]

  return (
    <section className="bg-white mt-24 px-6 relative">
      <div className="max-w-7xl mx-auto text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          Why choose <span className="text-green-600">Scrapiz?</span>
        </motion.h2>

        {/* Arrows */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={() => scroll("left")}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() => scroll("right")}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar mt-10"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="min-w-[320px] bg-[#f7f7f7] rounded-3xl overflow-hidden flex-shrink-0"
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-[220px] object-cover"
              />

              <div className="p-6 text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}