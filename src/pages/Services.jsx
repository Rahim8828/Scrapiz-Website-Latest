import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Recycle, Building, Wrench, FileText, Users, Package, ArrowRight, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Recycle,
    title: 'Scrap Collection',
    description: 'Efficient and timely collection of all types of scrap materials from your doorstep. We handle everything from segregation to transportation.',
    color: 'from-green-500 to-green-600',
    path: '/services/scrap-collection'
  },
  {
    icon: Building,
    title: 'Demolition Service',
    description: 'Safe and professional demolition services for buildings, structures, and industrial sites. We manage the entire process, including debris removal.',
    color: 'from-green-500 to-green-600',
    path: '/services/demolition-service'
  },
  {
    icon: Wrench,
    title: 'Dismantling',
    description: 'Expert dismantling of machinery, industrial equipment, and large structures. Our team ensures a safe and systematic process.',
    color: 'from-green-500 to-green-600',
    path: '/services/dismantling'
  },
  {
    icon: FileText,
    title: 'Paper Shredding',
    description: 'Secure and confidential paper shredding services for businesses and individuals. Protect your sensitive information while recycling.',
    color: 'from-green-500 to-green-600',
    path: '/services/paper-shredding'
  },
  {
    icon: Users,
    title: 'Society Tie-Up',
    description: 'Exclusive scrap collection programs for residential societies. We provide dedicated bins and regular collection schedules.',
    color: 'from-green-500 to-green-600',
    path: '/services/society-tie-up'
  },
  {
    icon: Package,
    title: 'Junk Removal Service',
    description: 'Hassle-free removal of all unwanted junk, old furniture, and appliances. Clear out your space with our quick and reliable service.',
    color: 'from-green-500 to-green-600',
    path: '/services/junk-removal-service'
  },
  {
    icon: Car,
    title: 'Vehicle Scrapping',
    description: 'RTO-certified scrapping for old cars, bikes, and commercial vehicles. We handle all paperwork and ensure eco-friendly disposal.',
    color: 'from-green-500 to-green-600',
    path: '/services/vehicle-scrapping'
  }
];

const Services = () => {
  return (
    <>
      <Helmet>
        <title>Our Services - Scrapiz</title>
        <meta name="description" content="Explore the wide range of services offered by Scrapiz, including scrap collection, demolition, dismantling, paper shredding, and more." />
        <link rel="canonical" href="https://www.scrapiz.in/services" />
      </Helmet>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-20 pb-10 sm:pt-24 sm:pb-12 lg:pb-16 text-center hero-pattern"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-3 sm:mb-4"
            >
              Our <span className="text-gradient">Services</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4"
            >
              Comprehensive solutions for all your scrap management and recycling needs. We are committed to providing reliable, efficient, and eco-friendly services.
            </motion.p>
          </div>
        </motion.div>

        {/* Services Grid */}
        <div className="py-10 sm:py-12 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center border border-gray-100 flex flex-col transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">{service.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">{service.description}</p>
                  
                  <div className="mt-auto pt-5 sm:pt-6">
                    <Link
                      to={service.path}
                      className="group/button w-full inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-center rounded-full transition-all duration-300 bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/button:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="pb-10 sm:pb-12 lg:pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-white text-center"
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Have a Custom Requirement?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto">
                Our team is equipped to handle unique and large-scale projects. Contact us today for a personalized consultation and quote.
              </p>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 sm:px-8 h-12 sm:h-14 rounded-full"
              >
                <Link to="/contact" className="flex items-center justify-center">
                  Get in Touch
                  <ArrowRight className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
