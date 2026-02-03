import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Eye, Gem, Award, Users, TrendingUp } from 'lucide-react';

const About = () => {
  const milestones = [
    { year: '2024', event: 'The Vision Begins', description: 'Identified the need to digitize India\'s unorganized scrap industry and create a transparent, technology-driven ecosystem for waste management.' },
    { year: '2025', event: 'Scrapiz Founded', description: 'Scrapiz GreenTech Pvt. Ltd. officially incorporated with a mission to revolutionize scrap collection and recycling across India.' },
    { year: '2025', event: 'Startup India Recognition', description: 'Achieved official recognition under the Startup India initiative, validating our innovative approach to circular economy and waste management.' },
    { year: '2025', event: 'Platform Launch', description: 'Successfully launched our online platform with advanced features including real-time pricing, doorstep pickup scheduling, and instant payments.' },
    { year: '2025', event: '1000+ Tons Milestone', description: 'Crossed the milestone of recycling over 1000 tons of scrap materials, making a significant positive environmental impact.' },
    { year: '2025', event: 'Mumbai Expansion', description: 'Expanded services across multiple Mumbai locations including Bandra, Dharavi, Goregaon, Jogeshwari, Kandivali, and Mahim.' },
  ];

  const coreValues = [
    { icon: Gem, title: 'Integrity', description: 'We operate with complete honesty, transparency, and ethical practices in all our business dealings and customer interactions.' },
    { icon: Award, title: 'Excellence', description: 'We strive for the highest quality in our services, technology, and customer support, continuously raising industry standards.' },
    { icon: TrendingUp, title: 'Innovation', description: 'We embrace cutting-edge technology and creative solutions to continuously improve our platform and services.' },
    { icon: Users, title: 'Customer-Centric', description: 'Our customers are at the heart of everything we do. We prioritize their needs, convenience, and satisfaction above all.' },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Scrapiz",
    "url": "https://www.scrapiz.in",
    "logo": "https://www.scrapiz.in/logo.png",
    "description": "Scrapiz is a leading online scrap selling platform in India, offering hassle-free doorstep pickup for all types of scrap materials."
  };

  return (
    <>
      <Helmet>
        <title>About Us - Scrapiz</title>
        <meta name="description" content="Learn about Scrapiz, our mission, vision, and our journey to become Mumbai's leading online scrap selling platform." />
        <link rel="canonical" href="https://www.scrapiz.in/about" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <div className="bg-white">
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
              About <span className="text-gradient">Scrapiz</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Pioneering a sustainable future by transforming waste into value, one scrap at a time.
            </motion.p>
          </div>
        </motion.div>

        <section className="py-10 sm:py-12 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="overflow-hidden rounded-2xl shadow-lg"
              >
                <img
                  className="w-full h-auto object-cover"
                  alt="Scrapiz processing facility with a truck unloading scrap"
                  src="/optimized/scrapiz-facility.webp"
                  width="800"
                  height="600"
                  loading="lazy"
                  style={{ aspectRatio: '4/3' }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-4 sm:space-y-6"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Our Story</h2>
                <p className="text-base sm:text-lg text-gray-600">
                  Founded in 2025, Scrapiz emerged from a simple yet powerful idea: to make scrap selling as convenient as online shopping while promoting environmental sustainability. We recognized the challenges in India's fragmented scrap industry - lack of transparency, unfair pricing, and inconvenient processes - and envisioned a digital platform that could transform this entire ecosystem.
                </p>
                <p className="text-gray-600">
                  Today, Scrapiz stands as a pioneering force in India's circular economy, trusted by thousands of households and businesses across Mumbai and beyond. Our technology-driven approach has revolutionized the entire scrap management process - from instant online booking and transparent pricing to doorstep pickup and immediate payments. We're not just a scrap collection service; we're building a sustainable future where waste becomes a valuable resource.
                </p>
                <p className="text-gray-600">
                  With official recognition under the Startup India initiative and having successfully recycled over 1000 tons of materials, we continue to expand our impact, making responsible waste management accessible to everyone while contributing to India's environmental goals.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-3 sm:space-y-4 bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-md"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Our Vision</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">To be India's most trusted and comprehensive circular economy platform, creating a zero-waste ecosystem that transforms how the nation manages resources for a sustainable future.</p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-3 sm:space-y-4 bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-md"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Our Mission</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600">To empower individuals and businesses to manage waste responsibly by providing a seamless, transparent, and rewarding digital platform that makes scrap selling convenient while promoting environmental sustainability.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-12 lg:py-20">
            <div className="container mx-auto px-4 sm:px-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12 lg:mb-16">Our Milestones</h2>
                <div className="relative">
                    {/* The vertical timeline bar */}
                    <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-0.5 bg-green-300 rounded-full"></div>

                    {milestones.map((milestone, index) => (
                        <div key={index} className="relative mb-6 sm:mb-8 md:mb-12">
                            {/* The timeline dot */}
                            <div className="absolute left-4 md:left-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full z-10 transform -translate-x-1/2 mt-1 border-2 sm:border-4 border-white"></div>

                            {/* The timeline content card container */}
                            <div
                                className={`
                                w-full md:w-1/2
                                ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:ml-auto'}
                                `}
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40, y: 20 }}
                                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="ml-8 sm:ml-10 md:ml-0 bg-white p-4 sm:p-6 rounded-lg shadow-lg border border-gray-100"
                                >
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 mb-1">{milestone.year}</p>
                                    <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-2">{milestone.event}</h4>
                                    <p className="text-gray-600 text-sm sm:text-base">{milestone.description}</p>
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-10 sm:py-12 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12 lg:mb-16">Our Core Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
              {coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-5 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-md"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <value.icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{value.title}</h4>
                  <p className="text-sm sm:text-base text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
