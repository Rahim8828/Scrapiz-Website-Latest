import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';

/**
 * LocationHero Component
 * Displays hero section with location-specific title, description, and contact CTAs
 * @param {Object} location - Location data object from locationData.js
 */
const LocationHero = ({ location, scrap, service }) => {
  if (!location) return null;

  const { content, nap } = location;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-24 pb-16 text-center bg-gradient-to-br from-green-600 to-green-700 text-white"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
        {scrap && service
        ? service.slug === "sell"
        ? `Sell ${scrap.name} Scrap in ${location.displayName}`
        : `${scrap.name} ${service.name} in ${location.displayName}`
        : content.heroTitle}
        </h1>
        <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
        {scrap && service
        ? service.slug === "sell"
        ? `Sell your ${scrap.name.toLowerCase()} scrap in ${location.displayName} with Scrapiz. We offer doorstep pickup, digital weighing, and instant payment at the best scrap rates in ${location.displayName}.`
        : `Looking for ${scrap.name.toLowerCase()} ${service.name.toLowerCase()} in ${location.displayName}? Scrapiz offers doorstep pickup, instant payment, and the best scrap rates in ${location.displayName}.`
        : content.heroDescription}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <a
            href={`tel:${nap.phone}`}
            className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Phone className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Call Now: {nap.phoneDisplay}</span>
          </a>
          <a
            href={`https://wa.me/${nap.phone.replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-400 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">WhatsApp: {nap.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default LocationHero;
