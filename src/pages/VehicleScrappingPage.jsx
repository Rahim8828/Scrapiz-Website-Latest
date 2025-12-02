
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Car, Wrench, ShieldCheck, Clock, Phone, MessageCircle, ChevronDown, FileText, Truck } from 'lucide-react';

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
        <p className="text-gray-600 pl-2">{answer}</p>
      </motion.div>
    </div>
  );
};

const VehicleScrappingPage = ({ openModal }) => {
  const pageTitle = "Vehicle Scrapping Service in Mumbai | Scrapiz - RTO Certified";
  const pageDescription = "Scrap your old car, bike, or commercial vehicle with Scrapiz, Mumbai's trusted and RTO-certified scrapping service. Get the best value and a hassle-free experience.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Vehicle Scrapping Service",
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
      "url": "https://www.scrapiz.in/services/vehicle-scrapping",
      "priceRange": "Contact for quote"
    },
    "areaServed": { "@type": "City", "name": "Mumbai" },
    "name": "RTO Certified Vehicle Scrapping",
    "description": "Safe, legal, and eco-friendly scrapping for cars, bikes, and commercial vehicles in Mumbai. We handle all paperwork and provide a Certificate of Destruction.",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "150" }
  };
  
  const faqs = [
      { question: "1. What is a Certificate of Destruction (COD)?", answer: "The Certificate of Destruction is an official document confirming that your vehicle has been legally scrapped at an authorized facility. This document is crucial for de-registering the vehicle from the RTO records, absolving you of all future liabilities."},
      { question: "2. How long does the vehicle scrapping process take?", answer: "The process is quick and efficient. Vehicle pickup is scheduled at your convenience. Once the vehicle reaches our facility, the scrapping and documentation process is typically completed within a few hours. The entire process from pickup to receiving your COD usually takes 2-3 business days."},
      { question: "3. Can you scrap a vehicle that is not in my name?", answer: "No. To scrap a vehicle, you must be the registered owner. We require the original RC (Registration Certificate) and a copy of the owner's ID to proceed. This is to prevent the scrapping of stolen or disputed vehicles."},
      { question: "4. What happens to my vehicle after it's scrapped?", answer: "Your vehicle is dismantled in an environmentally friendly manner. All hazardous materials like oils and batteries are safely removed. The metal body is then processed and recycled, ensuring minimal environmental impact and promoting a circular economy."},
      { question: "5. How is the value of my old vehicle determined?", answer: "The value is primarily based on the weight of the vehicle's metal body (kerb weight) at the current market rate for scrap metal. The condition of the engine and other parts is generally not a factor, as the vehicle is being destroyed, not resold."}
  ];

  const serviceName = "Vehicle Scrapping";

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.scrapiz.in/services/vehicle-scrapping" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative bg-cover bg-center text-white py-24 md:py-32" style={{backgroundImage: "url('/vehicle-scrapping-mumbai-scrapiz.jpg')"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-700/80 to-green-900/70"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Official Vehicle Scrapping in Mumbai</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light">End-of-life vehicle? Scrap your car, bike, or truck legally with our RTO-certified service. Get the best value, free pickup, and all paperwork handled.</p>
            <div className="flex justify-center items-center flex-wrap gap-4 mb-8 text-sm">
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><ShieldCheck className="w-4 h-4 mr-2 text-blue-300" /> RTO Certified</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><FileText className="w-4 h-4 mr-2 text-blue-300" /> All Paperwork Included</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><Clock className="w-4 h-4 mr-2 text-blue-300" /> Free Doorstep Pickup</span>
            </div>
            <button
              onClick={() => openModal(serviceName)}
              aria-label="Get a quote for vehicle scrapping"
              className="bg-white text-green-700 font-bold py-3 px-10 rounded-full shadow-2xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
            >
              Get a Free Quote
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Your Trusted, RTO-Authorised Partner</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">As per the government's new policy, vehicles older than 15 years must be scrapped at an authorised facility. Scrapiz is an RTO-approved scrapping center, ensuring your vehicle is retired legally and responsibly.</p>
            <p className="text-gray-600 mb-6 leading-relaxed">We manage the entire process, from towing your vehicle to our facility to handling all the complex RTO paperwork. We provide you with a Certificate of Destruction to formally de-register your vehicle, protecting you from future liabilities.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2}} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-5">Vehicles We Scrap:</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-700">
              <li className="flex items-center"><Car className="w-5 h-5 mr-3 text-blue-500" />Private Cars</li>
              <li className="flex items-center"><Car className="w-5 h-5 mr-3 text-blue-500" />Motorcycles & Scooters</li>
              <li className="flex items-center"><Truck className="w-5 h-5 mr-3 text-blue-500" />Commercial Trucks</li>
              <li className="flex items-center"><Truck className="w-5 h-5 mr-3 text-blue-500" />Buses & Vans</li>
              <li className="flex items-center"><Car className="w-5 h-5 mr-3 text-blue-500" />Three-Wheelers</li>
              <li className="flex items-center"><Wrench className="w-5 h-5 mr-3 text-blue-500" />All End-of-Life Vehicles</li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our 3-Step Scrapping Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Scrap your vehicle legally in three simple steps.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y:50 }} whileInView={{ opacity: 1, y:0 }} viewport={{ once: true }} transition={{ duration: 0.7}}>
              <div className="space-y-6">
                <div className="flex items-start"><strong className="text-green-600 text-3xl mr-4">1.</strong><div><h4 className="font-semibold text-xl">Request a Quote</h4><p className="text-gray-600">Contact us with your vehicle details. We provide a transparent quote based on your vehicle's weight and promise the best value.</p></div></div>
                <div className="flex items-start"><strong className="text-green-600 text-3xl mr-4">2.</strong><div><h4 className="font-semibold text-xl">Schedule Free Pickup</h4><p className="text-gray-600">We arrange for free towing of your vehicle from your location to our certified scrapping facility, at a time that works for you.</p></div></div>
                <div className="flex items-start"><strong className="text-green-600 text-3xl mr-4">3.</strong><div><h4 className="font-semibold text-xl">Get Paid & Certificate</h4><p className="text-gray-600">Receive payment and the official Certificate of Destruction (COD) after your vehicle is scrapped, releasing you from all future liability.</p></div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2}} className="border rounded-xl p-8 bg-gray-50 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Required Documents</h3>
              <p className="text-gray-600 mb-4">To ensure a legal and smooth process, please have the following ready:</p>
              <ul className="space-y-2 text-gray-600">
                <li><span className="font-semibold text-green-700">1. Original RC</span> (Registration Certificate) of the vehicle.</li>
                <li><span className="font-semibold text-green-700">2. Owner's Aadhaar Card</span> & Pan Card.</li>
                <li><span className="font-semibold text-green-700">3. Canceled Cheque</span> for payment transfer.</li>
                <li><span className="font-semibold text-green-700">4. Photos</span> of the vehicle and chassis number.</li>
              </ul>
              <button
                onClick={() => openModal(serviceName)}
                className="mt-6 inline-block bg-green-100 text-green-800 font-bold py-3 px-6 rounded-lg hover:bg-green-200"
              >
                Start the Process Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Happy Customers, Liability-Free</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Rajesh Sharma</p>
                  <p className="text-sm text-gray-500">Andheri East</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"My 18-year-old car was just sitting and rusting. Scrapiz made the entire scrapping process seamless. They handled all the RTO work, and I got the certificate as promised. Highly professional service."</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Priya Singh</p>
                  <p className="text-sm text-gray-500">Thane</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"I was worried about the paperwork, but the Scrapiz team was incredibly helpful. They explained everything clearly and took care of all formalities. It was completely hassle-free."</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Vehicle Scrapping FAQs</h2>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Ready to Scrap Your Old Vehicle?</h2>
              <p className="text-blue-100 max-w-xl">Get a fair value for your vehicle and ensure it's scrapped legally and responsibly.</p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Get a free quote"
                className="w-full sm:w-auto bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
              >
                Get My Quote
              </button>
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Chat on WhatsApp for vehicle scrapping"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-600 transition-colors duration-300 inline-flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-3"/> WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VehicleScrappingPage;
