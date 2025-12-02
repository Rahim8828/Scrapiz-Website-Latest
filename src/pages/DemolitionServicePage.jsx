
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { HardHat, ShieldCheck, Clock, Phone, MessageCircle, ChevronDown, CheckCircle } from 'lucide-react';

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDown
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0, marginTop: isOpen ? '1rem' : '0rem' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-gray-600">{answer}</p>
      </motion.div>
    </div>
  );
};

const DemolitionServicePage = ({ openModal }) => {
  const pageTitle = "Professional Demolition Services in Mumbai | Scrapiz";
  const pageDescription = "Leading demolition contractors in Mumbai for commercial & residential projects. Scrapiz offers safe, insured, and eco-friendly demolition & site clearance services.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Demolition Service",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Scrapiz",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Mumbai",
        "addressLocality": "Mumbai",
        "addressRegion": "MH",
        "postalCode": "400001",
        "addressCountry": "IN"
      },
      "telephone": "+91-8828700630",
      "image": "https://www.scrapiz.in/logo.png",
      "url": "https://www.scrapiz.in/services/demolition-service",
       "priceRange": "Contact for quote"
    },
    "areaServed": { "@type": "City", "name": "Mumbai" },
    "name": "Building and Office Demolition Service",
    "description": "Safe, compliant, and efficient demolition services for structures of all sizes in the Mumbai metropolitan area.",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "75" }
  };
  
  const faqs = [
    { question: "1. How is the cost of a demolition project in Mumbai determined?", answer: "The cost depends on factors like the structure's size and material, location accessibility, required permits, and the amount of debris to be managed. We provide a detailed, no-obligation quote after a site survey."}, 
    { question: "2. Do you handle the necessary permissions for demolition?", answer: "Yes, our service includes assistance with acquiring all necessary demolition permits from the Brihanmumbai Municipal Corporation (BMC) and other relevant authorities to ensure full compliance."}, 
    { question: "3. Is your demolition process environmentally friendly?", answer: "Absolutely. We prioritize recycling. Demolition waste such as steel, concrete, and wood is segregated on-site and sent to certified recycling facilities, minimizing landfill impact."}, 
    { question: "4. How long does a typical demolition project take?", answer: "The timeline varies. A small residential structure might take a few days, while a larger commercial building could take several weeks. We provide a clear project timeline in our initial proposal."}, 
    { question: "5. Do you purchase the scrap generated from the demolition?", answer: "Yes, we do. The value of salvaged materials like steel, copper, and aluminum can be credited against the total cost of the demolition, often resulting in significant savings for you."}
  ];

  const serviceName = "Demolition Service";

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.scrapiz.in/services/demolition-service" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative bg-cover bg-center text-white py-24 md:py-32" style={{backgroundImage: "url('/building-demolition-in-Mumbai-Scrapiz.jpeg')"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-green-900/70"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Expert Demolition Services in Mumbai</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light">Safe, efficient, and compliant demolition for residential, commercial, and industrial structures. We handle everything from planning to site clearance.</p>
            <div className="flex justify-center items-center flex-wrap gap-4 mb-8 text-sm">
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><ShieldCheck className="w-4 h-4 mr-2 text-green-300" /> Fully Insured & Licensed</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><HardHat className="w-4 h-4 mr-2 text-green-300" /> Safety First Approach</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><Clock className="w-4 h-4 mr-2 text-green-300" /> On-Time Project Completion</span>
            </div>
            <button
              onClick={() => openModal(serviceName)}
              aria-label="Get a demolition quote"
              className="bg-white text-green-700 font-bold py-3 px-10 rounded-full shadow-2xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 transform hover:scale-105"
            >
              Get a Free Quote
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Precision Demolition, Responsible Cleanup</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">Scrapiz provides comprehensive demolition solutions across Mumbai. Our experienced team uses modern equipment and follows strict safety protocols to ensure every project is completed without a hitch. We specialize in controlled demolitions that minimize disruption to surrounding areas.</p>
            <p className="text-gray-600 mb-6 leading-relaxed">Post-demolition, we manage the responsible disposal and recycling of all debris, turning waste into valuable resources and ensuring a clean, ready-to-use site.</p>
            <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg">
              <h4 className="font-bold">Safety & Insurance at Core</h4>
              <p className="text-sm">All our demolition projects are fully insured. Our team is equipped with top-tier personal protective equipment (PPE) and trained in advanced safety procedures to manage all risks effectively.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2}} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-5">Our Demolition Capabilities</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-green-500" /> Full & Partial Building Demolition</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-green-500" /> Interior & Office Strip-Outs</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-green-500" /> Factory & Warehouse Demolition</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-green-500" /> Concrete & Foundation Breaking</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-green-500" /> Site Clearance & Debris Removal</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 mr-3 text-green-500" /> Salvage & Scrap Recovery</li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our 4-Step Demolition Process</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">A systematic approach for safe and timely completion.</p>
          <div className="grid md:grid-cols-4 gap-8 text-center">
             <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1}} className="relative bg-white p-6 rounded-xl">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Survey & Plan</h3>
              <p className="text-gray-600">We conduct a site assessment and create a detailed demolition plan with a transparent quote.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2}} className="relative bg-white p-6 rounded-xl">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Permits</h3>
              <p className="text-gray-600">Our team assists in securing all necessary permits from municipal authorities for a compliant operation.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3}} className="relative bg-white p-6 rounded-xl">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Safe Demolition</h3>
              <p className="text-gray-600">We execute the demolition using specialized machinery, adhering to the highest safety standards.</p>
            </motion.div>
             <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4}} className="relative bg-white p-6 rounded-xl">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2">Debris Management</h3>
              <p className="text-gray-600">We clear the site and transport all debris for recycling and responsible disposal, leaving the site ready.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">What Our Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Ravi Kumar</p>
                  <p className="text-sm text-gray-500">Project Manager, BKC</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"Scrapiz handled the demolition of our old office building in Bandra with utmost professionalism. The project was completed ahead of schedule, and their focus on safety was impressive."</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Sunita Desai</p>
                  <p className="text-sm text-gray-500">Property Owner, Juhu</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"I needed to demolish an old structure on my plot. The Scrapiz team was efficient, clean, and gave me a fair price for the salvaged scrap metal. I couldn't have asked for a smoother process."</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Demolition FAQs</h2>
          <div className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} question={faq.question} answer={faq.answer} />
              ))}
          </div>
        </div>
      </section>
      
      <section className="from-green-600 to-green-800 bg-gradient-to-r text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Plan Your Demolition Project</h2>
              <p className="text-red-100 max-w-xl">Contact our experts for a free consultation and site assessment today.</p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Contact us for a quote"
                className="w-full sm:w-auto bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 transform hover:scale-105"
              >
                Request a Quote
              </button>
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Chat on WhatsApp"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-600 transition-colors duration-300 inline-flex items-center justify-center">
                <MessageCircle className="w-5 h-5 mr-3"/> WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemolitionServicePage;
