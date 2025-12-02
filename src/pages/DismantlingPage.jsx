
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Wrench, Recycle, ShieldCheck, IndianRupee, Phone, MessageCircle, ChevronDown, CheckCircle } from 'lucide-react';

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


const DismantlingPage = ({ openModal }) => {
  const pageTitle = "Expert Dismantling Services in Mumbai | Scrapiz Asset Recovery";
  const pageDescription = "Specialized dismantling services in Mumbai for industrial plants, machinery, offices, and IT infrastructure. Maximize asset recovery and ensure safe, compliant disposal with Scrapiz.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Dismantling Service",
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
      "url": "https://www.scrapiz.in/services/dismantling",
      "priceRange": "Contact for quote"
    },
    "areaServed": {
      "@type": "City",
      "name": "Mumbai"
    },
    "name": "Industrial and Commercial Dismantling Services",
    "description": "Professional dismantling of machinery, factories, and office setups with a focus on safety and maximum value recovery from scrap assets.",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "90"
      }
  };
  
  const faqs = [
      { question: "1. What's the difference between demolition and dismantling?", answer: "Demolition is about destroying a structure, while dismantling is the careful deconstruction of an asset (like machinery or a plant) to preserve its components for reuse or to maximize scrap value. Dismantling focuses on recovery."},
      { question: "2. Can you dismantle live or active factory environments?", answer: "Yes, we can. We specialize in planning and executing dismantling projects in live environments with minimal disruption to your ongoing operations by working during scheduled downtimes or off-hours."},
      { question: "3. How do you ensure maximum value for my dismantled assets?", answer: "Our expertise lies in identifying and segregating high-value materials like copper, aluminum, and specialized alloys. We have a direct network of recyclers, ensuring you get the best possible rates, bypassing middlemen."},
      { question: "4. Is Scrapiz equipped to handle large-scale industrial dismantling?", answer: "Absolutely. We have the technical expertise, specialized equipment (like plasma cutters and heavy lifting gear), and a trained workforce to manage large-scale industrial dismantling projects across Mumbai and Maharashtra."},
      { question: "5. What payment options are available for recovered scrap?", answer: "We offer flexible and instant payment options for the scrap recovered from dismantling. You can choose between UPI, bank transfer (RTGS/NEFT), or cheque as per your company's accounting norms."}
  ];

  const serviceName = "Dismantling Service";

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.scrapiz.in/services/dismantling" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero Section */}
       <section className="relative bg-cover bg-center text-white py-24 md:py-32" style={{backgroundImage: "url('/industrial-dismantling-services-Scrapiz.jpeg')"}}>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-gray-800/70"></div>
          <div className="container mx-auto px-4 relative">
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
              >
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                      Precision Dismantling Services in Mumbai
                  </h1>
                  <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light">
                      Unlock the hidden value in your old assets. We offer expert dismantling for industrial machinery, office infrastructure, and more, with a focus on asset recovery.
                  </p>
                  <div className="flex justify-center items-center flex-wrap gap-4 mb-8 text-sm">
                      <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><ShieldCheck className="w-4 h-4 mr-2 text-green-300" /> Safe & Compliant</span>
                      <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><Recycle className="w-4 h-4 mr-2 text-green-300" /> Maximum Asset Recovery</span>
                      <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><IndianRupee className="w-4 h-4 mr-2 text-green-300" /> Highest Scrap Value</span>
                  </div>
                  <button
                      onClick={() => openModal(serviceName)}
                      aria-label="Request a dismantling quote"
                      className="bg-white text-green-700 font-bold py-3 px-10 rounded-full shadow-2xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105"
                  >
                      Enquire Now
                  </button>
              </motion.div>
          </div>
      </section>

      {/* About the Service Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Strategic Dismantling & Asset Recovery</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
             Dismantling is more than just deconstruction; it's a strategic process of safely taking apart structures to recover maximum value. Scrapiz specializes in dismantling industrial plants, heavy machinery, office setups, and IT data centers.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
                 Our skilled technicians ensure that every component is carefully handled, segregated, and prepared for recycling or resale.
            </p>
            <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg">
                <h4 className="font-bold">Safety & Precision First</h4>
                <p className="text-sm">Our dismantling processes are meticulously planned to prevent accidents and damage to property. We use specialized tools and adhere to strict safety guidelines for every project.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2}} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-5">We Dismantle:</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start"><Wrench className="w-6 h-6 mr-4 text-green-600 flex-shrink-0" /> <div><strong>Industrial Machinery:</strong> Lathes, CNC machines, generators, turbines.</div></li>
              <li className="flex items-start"><Wrench className="w-6 h-6 mr-4 text-green-600 flex-shrink-0" /> <div><strong>Factory & Plant Units:</strong> Production lines, boilers, chillers, storage tanks.</div></li>
              <li className="flex items-start"><Wrench className="w-6 h-6 mr-4 text-green-600 flex-shrink-0" /> <div><strong>Office & IT Infra:</strong> Workstations, partitions, server racks, cabling.</div></li>
              <li className="flex items-start"><Wrench className="w-6 h-6 mr-4 text-green-600 flex-shrink-0" /> <div><strong>Electrical Systems:</strong> Transformers, control panels, high-voltage cables.</div></li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Dismantling Approach</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">A clear process from valuation to final payment.</p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
             <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1}} className="relative bg-white p-6 rounded-xl">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Asset Evaluation</h3>
              <p className="text-gray-600">We assess your assets (machinery, structures) to provide a comprehensive valuation and clear project scope.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3}} className="relative bg-white p-6 rounded-xl">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Systematic Dismantling</h3>
              <p className="text-gray-600">Our expert team carefully dismantles the equipment, segregating materials by type and value.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5}} className="relative bg-white p-6 rounded-xl">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Recovery & Payment</h3>
              <p className="text-gray-600">We weigh recovered scrap on-site and provide instant payment, maximizing your returns.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">From Our Industrial Clients</h2>
          <div className="grid md:grid-cols-2 gap-8">
             <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Anil Singh</p>
                  <p className="text-sm text-gray-500">Factory Head, Taloja</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"We hired Scrapiz to dismantle our old production line. Their team was incredibly efficient and professional. The asset recovery value they provided was much higher than other quotes."</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Meena Iyer</p>
                  <p className="text-sm text-gray-500">Admin Manager, Thane</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"The office dismantling service was seamless. They removed all old partitions, wiring, and furniture over a weekend, allowing us to renovate without any delays. Excellent work!"</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Dismantling & Recovery FAQs</h2>
           <div className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} question={faq.question} answer={faq.answer} />
              ))}
          </div>
        </div>
      </section>
      
      {/* CTA Strip */}
      <section className="from-green-500 to-green-700 bg-gradient-to-r text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Maximize Your Asset Value</h2>
              <p className="text-green-100 max-w-xl">Discuss your dismantling project with our engineers for a custom recovery plan.</p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => openModal(serviceName)}
                  aria-label="Contact us for a dismantling project"
                  className="w-full sm:w-auto bg-white text-green-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105"
                >
                  Get a Quote
                </button>
              <a href="tel:+918828700630" aria-label="Call Scrapiz" className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-700 transition-colors duration-300 inline-flex items-center justify-center">
                <Phone className="w-5 h-5 mr-3"/> Call an Expert
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DismantlingPage;
