
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronDown, Phone, ShieldCheck, IndianRupee, Clock } from 'lucide-react';

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

const ScrapCollectionPage = ({ openModal }) => {
  const pageTitle = "Scrap Collection in Mumbai | Scrapiz — Instant Pickup & Best Rates";
  const pageDescription = "Get the best rates for your scrap in Mumbai. Scrapiz offers hassle-free doorstep scrap collection for households and businesses. Schedule a pickup today for instant payment!";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Scrap Collection",
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
      "url": "https://www.scrapiz.in/services/scrap-collection"
    },
    "areaServed": { "@type": "City", "name": "Mumbai" },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Scrap Collection Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Household Scrap Collection" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial Scrap Collection" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "E-Waste Pickup" } }
      ]
    },
    "name": "Doorstep Scrap Collection",
    "description": "Convenient and reliable scrap collection service in Mumbai with transparent pricing and instant payment."
  };

  const faqs = [
    { question: "1. What are the benefits of selling scrap online vs to a local kabadiwala?", answer: "Selling online with Scrapiz offers transparency with digital weighing, competitive and standardized pricing, convenient doorstep pickup, and instant digital payments. It eliminates haggling and ensures you get the true value for your scrap." },
    { question: "2. Is there a minimum quantity for scrap collection in Mumbai?", answer: "We don't have a strict minimum quantity. However, for very small amounts, a nominal convenience fee 60/- Rupees might apply. For most household scrap accumulations (20-30 kg), the pickup is completely free." },
    { question: "3. How quickly can you pick up my scrap?", answer: "We offer same-day or next-day pickup across most of Mumbai. You can choose your preferred time slot when booking, and our team will be there as scheduled." },
    { question: "4. How do I get the best rates for my scrap materials?", answer: "Scrapiz constantly monitors market rates to offer you the most competitive prices. To maximize value, try to segregate materials like copper, aluminum, and paper, as they have different rates." },
    { question: "5. What happens to my scrap after collection?", answer: "Your scrap is transported to our certified recycling partners. We ensure that it is processed in an environmentally friendly manner, contributing to a circular economy and reducing landfill waste." }
  ];

  const serviceName = "Scrap Collection";

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.scrapiz.in/services/scrap-collection" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative bg-cover bg-center text-white py-24 md:py-32" style={{backgroundImage: "url('/scrap-collection-mumbai-Scrapiz.jpeg')"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-green-800/70"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Hassle-Free Scrap Collection in Mumbai</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light">Turn your trash into cash! We offer reliable doorstep pickup for all types of scrap with instant payment and the best market rates.</p>
            <div className="flex justify-center items-center flex-wrap gap-4 mb-8 text-sm">
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><ShieldCheck className="w-4 h-4 mr-2 text-green-300" /> Verified & Trusted</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><IndianRupee className="w-4 h-4 mr-2 text-green-300" /> Best Price Guarantee</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><Clock className="w-4 h-4 mr-2 text-green-300" /> On-Time Service</span>
            </div>
            <button
              onClick={() => openModal(serviceName)}
              aria-label="Schedule a scrap pickup"
              className="bg-white text-green-700 font-bold py-3 px-10 rounded-full shadow-2xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105"
            >
              Book a Free Pickup
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Your Trusted Online Kabadiwala</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">Scrapiz is revolutionizing the way Mumbai sells scrap. Forget the hassle of finding a local kabadiwala and haggling over prices. Our digital platform makes scrap collection simple, transparent, and rewarding.</p>
                 <p className="text-gray-600 mb-6 leading-relaxed">We come to your doorstep, use certified digital scales, and pay you instantly.</p>
                <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg">
                    <h4 className="font-bold">What to Prepare</h4>
                    <p className="text-sm">Segregate materials if possible and keep them in an accessible location for our team.</p>
                </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2}} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-semibold text-gray-800 mb-5">Materials We Collect:</h3>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-700">
                    <li>• Ferrous Metals (Iron, Steel)</li>
                    <li>• Non-Ferrous Metals (Copper)</li>
                    <li>• Aluminum & Tin</li>
                    <li>• Newspapers & Cardboard</li>
                    <li>• Plastic & Bottles</li>
                    <li>• E-Waste</li>
                    <li>• Old Batteries & Wires</li>
                    <li>• Old Appliances</li>
                </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Three Simple Steps</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">Our process is designed for your convenience.</p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1}} className="bg-white p-6 rounded-xl">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Schedule Pickup</h3>
              <p className="text-gray-600">Book a slot online. Just tell us your address and preferred time.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3}} className="bg-white p-6 rounded-xl">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Accurate Weighing</h3>
              <p className="text-gray-600">Our team arrives, weighs your scrap with a digital scale right in front of you.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5}} className="bg-white p-6 rounded-xl">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Paid Instantly</h3>
              <p className="text-gray-600">Receive payment immediately via UPI or bank transfer. No delays.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Trusted by Mumbaikars</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Alok Sharma</p>
                  <p className="text-sm text-gray-500">Andheri West</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"The Scrapiz team was so professional. They came on time, weighed everything transparently, and I got the money in my account before they even left. Highly recommended!"</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Priya Mehta</p>
                  <p className="text-sm text-gray-500">Ghatkopar East</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"Finally, an online kabadiwala that is reliable! It was so easy to book a pickup for my old newspapers and plastic bottles. Great service and fair prices."</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} question={faq.question} answer={faq.answer} />
              ))}
          </div>
        </div>
      </section>
      
      <section className="from-green-600 to-green-700 bg-gradient-to-r text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Ready to Sell Your Scrap?</h2>
              <p className="text-green-100 max-w-xl">Schedule a free pickup in minutes and get paid instantly. It's that simple.</p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Book a pickup now"
                className="w-full sm:w-auto bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105"
              >
                Book Now
              </button>
              <a href="tel:+918828700630" aria-label="Call Scrapiz" className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-600 transition-colors duration-300 inline-flex items-center justify-center">
                <Phone className="w-5 h-5 mr-3"/> Call Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrapCollectionPage;
