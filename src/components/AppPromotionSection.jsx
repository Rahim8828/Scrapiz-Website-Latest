import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Star } from 'lucide-react';

const AppPromotionSection = () => {

  const handleAppStoreClick = () => {
    // Replace with actual App Store link when available
    window.open('https://apps.apple.com/app/scrapiz', '_blank');
  };

  const handlePlayStoreClick = () => {
    // Replace with actual Play Store link when available
    window.open('https://play.google.com/store/apps/details?id=com.scrapiz', '_blank');
  };

  const features = [
    'Instant Pickup Scheduling',
    'Real-Time Price Updates',
    'Secure Digital Payments',
    'Track Your Green Impact'
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50 to-green-50/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span className="text-sm font-bold">4.8 Rating</span>
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
              Sell Scrap in a Snap with the <span className="text-gradient">Scrapiz App</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0">
              Download the Scrapiz app to make selling your scrap easier than ever. Schedule pickups, track your earnings, and get paid instantly—all from your smartphone.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-8 lg:mb-10 max-w-xl mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-center lg:justify-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-sm lg:text-base text-gray-800">{feature}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-3 lg:gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={handlePlayStoreClick}
                className="w-auto"
              >
                <img 
                  width="150"
                  height="56"
                  className="h-14 lg:h-16 w-auto rounded-xl" 
                  alt="Get it on Google Play" 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  loading="lazy"
                  style={{ aspectRatio: '150/56' }}
                />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={handleAppStoreClick}
                className="w-auto"
              >
                <img 
                  width="150"
                  height="56"
                  className="h-14 lg:h-16 w-auto rounded-xl" 
                  alt="Download on the App Store" 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  loading="lazy"
                  style={{ aspectRatio: '150/56' }}
                />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
            className="flex justify-center items-center order-1 lg:order-2"
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-cyan-400/20 to-blue-500/30 rounded-[3rem] blur-3xl animate-pulse"></div>
              
              {/* Phone mockup container */}
              <div className="relative">
                <img
                  src="/Scrapiz-App-Screenshot.webp"
                  width="300"
                  height="600"
                  alt="Scrapiz App Interface - Schedule pickups and track earnings"
                  className="relative rounded-3xl lg:rounded-[2.5rem] shadow-2xl w-full object-cover hover:shadow-3xl transition-shadow duration-300"
                  loading="lazy"
                  style={{ aspectRatio: '1/2' }}
                />
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-75"></div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AppPromotionSection;
