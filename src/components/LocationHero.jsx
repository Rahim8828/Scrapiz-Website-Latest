import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Truck, IndianRupee, Clock, Star } from 'lucide-react';

const LocationHero = ({ location, scrap, service }) => {
  if (!location) return null;

  const { content, nap } = location;

  const heading = scrap && service
    ? service.slug === "sell"
      ? `Sell ${scrap.name} Scrap in ${location.displayName}`
      : `${scrap.name} ${service.name} in ${location.displayName}`
    : content.heroTitle;

  const subheading = scrap && service ? "Free Pickup & Best Price" : null;

  const description = scrap && service
    ? service.slug === "sell"
      ? `Sell your ${scrap.name.toLowerCase()} scrap in ${location.displayName} with Scrapiz. Doorstep pickup, digital weighing, and instant payment at the best rates.`
      : `Looking for ${scrap.name.toLowerCase()} ${service.name.toLowerCase()} in ${location.displayName}? Scrapiz offers doorstep pickup, instant payment, and the best scrap rates.`
    : content.heroDescription;

  return (
    <>
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-teal-700 text-white pt-24 pb-12 md:pt-28 md:pb-20">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">Trusted by 10,000+ Customers in Mumbai</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2 leading-tight">
            {heading}
          </h1>

          {subheading && (
            <p className="text-green-300 font-bold text-xl sm:text-2xl mb-5">{subheading}</p>
          )}

          <p className="text-sm sm:text-base max-w-2xl mx-auto mb-6 text-green-50 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-7">
            {[
              { icon: Truck, text: "Free Pickup" },
              { icon: IndianRupee, text: "Best Price" },
              { icon: Clock, text: "30 Min Service" },
            ].map((item, i) => (
              <span key={i} className="flex items-center bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm">
                <item.icon className="w-4 h-4 mr-1.5 text-green-300" />
                {item.text}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${nap.phone}`}
              className="bg-white text-green-700 font-bold py-3 px-8 rounded-full shadow-xl hover:bg-green-50 transition-all text-base inline-flex items-center justify-center"
            >
              Book Free Pickup
            </a>
            <a
              href={`tel:${nap.phone}`}
              className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-700 transition-all text-base inline-flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-2" /> {nap.phoneDisplay}
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    {/* QUICK STATS */}
    <div className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: "10,000+", label: "Happy Customers" },
            { value: "30 Min", label: "Avg. Pickup Time" },
            { value: "Free", label: "Doorstep Pickup" },
            { value: "100%", label: "Transparent Weighing" },
          ].map((stat, i) => (
            <div key={i} className="p-2">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  );
};

export default LocationHero;
