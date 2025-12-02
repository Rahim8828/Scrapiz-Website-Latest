import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { locationData } from '../data/locationData';

const Locations = () => {
  // Convert locationData object to array for mapping
  const allLocations = Object.values(locationData);

  return (
    <>
      <Helmet>
        <title>Our Locations - Scrapiz Scrap Buyers in Mumbai</title>
        <meta name="description" content="Find Scrapiz scrap buyers across Mumbai. We serve Bandra, Dharavi, Goregaon, Jogeshwari, Kandivali, Mahim, Nalasopara and more with doorstep pickup and best rates." />
        <link rel="canonical" href="https://www.scrapiz.in/locations" />
      </Helmet>
      <div className="bg-white">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-24 pb-16 text-center hero-pattern"
        >
          <div className="container mx-auto px-4">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4"
            >
              Our <span className="text-gradient">Locations</span> in Mumbai
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              We serve 9 locations across Mumbai with doorstep scrap pickup, instant payment, and the best scrap rates. Find a Scrapiz center near you.
            </motion.p>
          </div>
        </motion.div>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allLocations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden scrapiz-hover-shadow border border-gray-200 hover:border-green-500 transition-all duration-300"
                >
                  {/* Location Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={location.images.hero}
                      alt={location.images.alt}
                      width="600"
                      height="400"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      style={{ aspectRatio: '3/2' }}
                    />
                  </div>

                  {/* Location Details */}
                  <div className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <MapPin className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          Scrap Buyers in {location.displayName}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {location.nap.address.fullAddress}
                        </p>
                      </div>
                    </div>

                    <a 
                      href={`tel:${location.nap.phone}`}
                      className="flex items-center gap-2 mb-6 text-green-600 hover:text-green-700 transition-colors w-fit"
                    >
                      <Phone className="w-5 h-5 flex-shrink-0" />
                      <span className="font-semibold whitespace-nowrap">
                        {location.nap.phoneDisplay}
                      </span>
                    </a>

                    <Link 
                      to={`/${location.slug}`}
                      className="block w-full text-center py-3 px-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      View Scrap Buyers in {location.displayName}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-600 via-green-600 to-green-700 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl"
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Don't see your Location?
              </h3>
              <p className="text-base sm:text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                We are growing fast! Let us know where you'd like to see us next. Your feedback helps us expand our services.
              </p>
              <a 
                href="https://wa.me/918828700630?text=I'd%20like%20to%20request%20scrap%20pickup%20from%20a%20new%20location."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-green-600 hover:bg-green-50 font-bold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Request a New Location
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Locations;
