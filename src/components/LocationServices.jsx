import React from 'react';
import { motion } from 'framer-motion';

/**
 * LocationServices Component
 */
const LocationServices = ({ location }) => {
  if (!location) return null;

  const { name } = location;

  const services = [
    {
      title: 'Metal Scrap Collection',
      description: `We buy iron scrap, steel scrap, aluminum scrap, copper scrap, and brass scrap in ${name}. Get the best scrap rates for all metal materials.`,
      items: ['Iron & Steel', 'Aluminum', 'Copper', 'Brass', 'Stainless Steel'],
      image: '/assets-optimized/metalscrap.webp'
    },
    {
      title: 'E-Waste Pickup',
      description: `Professional e-waste pickup in ${name} for computers, laptops, mobile phones, and all electronic items. Eco-friendly recycling guaranteed.`,
      items: ['Computers', 'Laptops', 'Mobile Phones', 'Printers', 'Electronic Boards'],
      image: '/assets-optimized/ewaste.webp'
    },
    {
      title: 'Appliance Scrap',
      description: `Sell old appliances in ${name} - refrigerators, washing machines, ACs, and microwaves. Free doorstep pickup with instant payment.`,
      items: ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwaves', 'Water Heaters'],
      image: '/assets-optimized/Appliancescrap.webp'
    },
    {
      title: 'Paper & Cardboard',
      description: `We collect paper waste, cardboard, newspapers, and office documents in ${name}. Secure shredding services available.`,
      items: ['Newspapers', 'Cardboard Boxes', 'Office Paper', 'Books', 'Magazines'],
      image: '/assets-optimized/paperscrap.webp'
    },
    {
      title: 'Plastic Scrap',
      description: `Buy all types of plastic scrap in ${name} including bottles, containers, and industrial plastic waste at competitive rates.`,
      items: ['Plastic Bottles', 'Containers', 'PVC Pipes', 'Industrial Plastic', 'Packaging Material'],
      image: '/assets-optimized/plasitcscrap.webp'
    },
    {
      title: 'Furniture & Misc',
      description: `Remove old furniture, wooden items, and miscellaneous scrap from your home or office in ${name}. Hassle-free service.`,
      items: ['Old Furniture', 'Wooden Items', 'Glass', 'Rubber', 'Mixed Scrap'],
      image: '/assets-optimized/woodenscrap.webp'
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Scrap Collection Services in {name}
          </h2>

          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            As the leading online scrap dealer in {name}, we offer comprehensive scrap collection services 
            for all types of materials.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              
              <div className="h-56 bg-gray-50 flex items-center justify-center p-2">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LocationServices;
