import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const WorkGallerySection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const galleryItems = [
    {
      id: 1,
      category: 'residential',
      title: 'Society Scrap Collection - Bandra',
      description: 'Collected 500kg mixed scrap from residential society',
      beforeImage: '/scrapiz-facility.webp',
      afterImage: '/scrapiz-facility.webp',
      stats: { weight: '500 kg', earnings: '₹8,500' }
    },
    {
      id: 2,
      category: 'commercial',
      title: 'Office E-Waste Clearance - Andheri',
      description: 'Complete IT equipment disposal for corporate office',
      beforeImage: '/scrapiz-facility.webp',
      afterImage: '/scrapiz-facility.webp',
      stats: { weight: '200 kg', earnings: '₹15,000' }
    },
    {
      id: 3,
      category: 'industrial',
      title: 'Factory Metal Scrap - Goregaon',
      description: 'Industrial metal scrap collection and recycling',
      beforeImage: '/scrapiz-facility.webp',
      afterImage: '/scrapiz-facility.webp',
      stats: { weight: '2 Tons', earnings: '₹65,000' }
    },
    {
      id: 4,
      category: 'residential',
      title: 'Home Renovation Scrap - Kandivali',
      description: 'Old furniture and metal scrap from home renovation',
      beforeImage: '/scrapiz-facility.webp',
      afterImage: '/scrapiz-facility.webp',
      stats: { weight: '150 kg', earnings: '₹4,200' }
    },
    {
      id: 5,
      category: 'appliances',
      title: 'Old Appliances Pickup - Jogeshwari',
      description: 'AC, Fridge, and Washing Machine collection',
      beforeImage: '/scrapiz-facility.webp',
      afterImage: '/scrapiz-facility.webp',
      stats: { weight: '3 Items', earnings: '₹7,500' }
    },
    {
      id: 6,
      category: 'commercial',
      title: 'Restaurant Kitchen Scrap - Malad',
      description: 'Stainless steel and copper utensils collection',
      beforeImage: '/scrapiz-facility.webp',
      afterImage: '/scrapiz-facility.webp',
      stats: { weight: '80 kg', earnings: '₹12,000' }
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Work' },
    { id: 'residential', label: 'Residential' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'industrial', label: 'Industrial' },
    { id: 'appliances', label: 'Appliances' }
  ];

  const filteredItems = activeTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeTab);

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full mb-3">
            <Camera className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span className="text-xs font-semibold">Our Work</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            See Our <span className="text-gradient">Work in Action</span>
          </h2>
          <p className="text-sm lg:text-base text-gray-600 max-w-xl mx-auto">
            Real pickups, real customers, real results.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-md">
                  <OptimizedImage
                    src={item.beforeImage}
                    width={600}
                    height={400}
                    alt={item.title}
                    className="w-full h-40 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-gray-300 text-xs mb-2 line-clamp-1 hidden sm:block">{item.description}</p>
                      <div className="flex gap-2">
                        <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                          {item.stats.weight}
                        </span>
                        <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {item.stats.earnings}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-white/90 text-gray-800 text-[10px] px-2 py-0.5 rounded-full font-medium capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Video CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <a
            href="https://www.instagram.com/scrapiz.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg transition-all"
          >
            <Play className="w-4 h-4" />
            Watch More on Instagram
          </a>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={selectedImage.beforeImage}
                width={800}
                height={600}
                alt={selectedImage.title}
                className="w-full h-96 object-cover"
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedImage.title}</h3>
                <p className="text-gray-600 mb-4">{selectedImage.description}</p>
                <div className="flex gap-4">
                  <div className="bg-green-100 px-4 py-2 rounded-lg">
                    <span className="text-sm text-gray-600">Weight Collected</span>
                    <p className="text-xl font-bold text-green-600">{selectedImage.stats.weight}</p>
                  </div>
                  <div className="bg-yellow-100 px-4 py-2 rounded-lg">
                    <span className="text-sm text-gray-600">Customer Earned</span>
                    <p className="text-xl font-bold text-yellow-600">{selectedImage.stats.earnings}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WorkGallerySection;
