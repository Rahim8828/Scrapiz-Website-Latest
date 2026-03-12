import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, Star } from "lucide-react"

const testimonials = [
  {
    name: "Ridhi Saluja",
    location: "Mumbai",
    review:
      "The service has definitely improved from the first time. Pricing was clear and pickup was smooth. Highly recommend Scrapiz!",
  },
  {
    name: "Kirti Sharma",
    location: "Andheri",
    review:
      "Great value for money. The pickup team was professional and very punctual. Really satisfied with Scrapiz.",
  },
  {
    name: "Sameer Khan",
    location: "Bandra",
    review:
      "Booking took less than 2 minutes. Pickup was on time and payment was instant. Super convenient experience.",
  },
  {
    name: "Aisha Mehta",
    location: "Powai",
    review:
      "Very transparent pricing and polite staff. This is the easiest way to sell scrap in the city.",
  },
  {
    name: "Rahul Verma",
    location: "Goregaon",
    review:
      "I loved how simple the app is. Scheduled pickup and everything was handled professionally.",
  },
  {
    name: "Neha Kapoor",
    location: "Malad",
    review:
      "The heavy lifting was completely handled by them. Hassle-free and quick service.",
  },
]

export default function Testimonials() {
  return (
    <section className="min-h-screen mt-24 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-green-600 font-medium mb-3">
            Our Testimonials
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            What Our Users Say
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands across Mumbai for fast, transparent,
            and reliable scrap pickup services.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">

          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <Card className="rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                <CardContent className="p-8 relative">

                  {/* Quote Icon */}
                  <Quote className="absolute top-6 right-6 text-gray-200 w-10 h-10" />

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-green-600 fill-green-600"
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {item.review}
                  </p>

                  {/* User Info */}
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {item.location}
                    </p>
                  </div>

                </CardContent>
              </Card>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  )
}