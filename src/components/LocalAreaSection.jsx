import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Clock, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const LocalAreaSection = () => {
  const popularAreas = [
    {
      name: 'Bandra',
      path: '/bandra',
      pickupTime: '2-3 hrs',
      highlight: 'Most Popular',
      image: '/Scrapiz-Bandra.webp'
    },
    {
      name: 'Jogeshwari',
      path: '/jogeshwari',
      pickupTime: '1-2 hrs',
      highlight: 'Fastest Pickup',
      image: '/Scrapiz-Jogeshwari.webp'
    },
    {
      name: 'Goregaon',
      path: '/goregaon',
      pickupTime: '2-3 hrs',
      highlight: 'High Demand',
      image: '/Scrapiz-Goregaon.webp'
    },
    {
      name: 'Kandivali',
      path: '/kandivali',
      pickupTime: '2-4 hrs',
      highlight: 'Best Rates',
      image: '/Scrapiz-Kandivali.webp'
    },
    {
      name: 'Dharavi',
      path: '/dharavi',
      pickupTime: '1-2 hrs',
      highlight: 'Bulk Pickup',
      image: '/Scrapiz-dharavi.webp'
    },
    {
      name: 'Andheri',
      path: '/locations',
      pickupTime: '2-3 hrs',
      highlight: 'Corporate Hub',
      image: '/scrapiz-facility.webp'
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full mb-4">
            <MapPin className="w-4 h-4" strokeWidth={2.5} />
            <span className="text-sm font-semibold">Scrap Pickup Near You</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            Serving All of <span className="text-green-400">Mumbai</span>
          </h2>
          <p className="text-base lg:text-lg text-gray-400 max-w-2xl mx-auto">
            Find scrap collection services in your area. Same-day pickup available.
          </p>
        </motion.div>

        {/* Area Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mb-8">
          {popularAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                to={area.path}
                className="block group relative overflow-hidden rounded-xl h-44 lg:h-48"
              >
                <img
                  src={area.image}
                  width="400"
                  height="300"
                  alt={`Scrap collection in ${area.name}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  style={{ aspectRatio: '4/3' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                
                {/* Highlight Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-green-500 text-white text-[10px] lg:text-xs px-2 py-1 rounded-full font-bold">
                    {area.highlight}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
                  <h3 className="text-white font-bold text-base lg:text-lg mb-1 group-hover:text-green-400 transition-colors">
                    {area.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-300 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{area.pickupTime}</span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute top-3 right-3 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Contact Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3"
        >
          <div className="text-center md:text-left">
            <h3 className="text-base lg:text-lg font-bold mb-0.5">Can't find your area?</h3>
            <p className="text-green-100 text-xs lg:text-sm">We're expanding fast! Call us to check availability.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="tel:+918828700630"
              className="flex items-center gap-1.5 bg-white text-green-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +91 8828700630
            </a>
            <Link
              to="/locations"
              className="flex items-center gap-1.5 bg-green-800 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-green-900 transition-colors"
            >
              All Locations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocalAreaSection;
