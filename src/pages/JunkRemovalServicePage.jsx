
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Sofa, Trash, Truck, Clock, Phone, MessageCircle, ShieldCheck, ChevronDown } from 'lucide-react';

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

const JunkRemovalServicePage = ({ openModal }) => {
  const pageTitle = "Junk Removal Service in Mumbai | Scrapiz - Fast & Easy Cleanouts";
  const pageDescription = "Need to get rid of unwanted junk? Scrapiz offers fast and affordable junk removal services in Mumbai. We take everything from old furniture and appliances to construction debris.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Junk Removal Service",
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
      "url": "https://www.scrapiz.in/services/junk-removal-service",
      "priceRange": "Contact for quote"
    },
    "areaServed": { "@type": "City", "name": "Mumbai" },
    "name": "Residential & Commercial Junk Removal",
    "description": "Fast, reliable, and eco-friendly removal of unwanted junk, furniture, appliances, and debris for homes and businesses in Mumbai.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Aarti Rao"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "The Scrapiz team cleared out my old furniture in less than 30 minutes! They were polite, fast, and the price was very reasonable. My apartment feels so much bigger now. Thank you!",
        "datePublished": "2024-11-05"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Vikas Patel"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4.8",
          "bestRating": "5"
        },
        "reviewBody": "We used Scrapiz to clear out construction debris after our office renovation. They were professional, on time, and handled all the waste responsibly. It saved my team a lot of time and effort.",
        "datePublished": "2024-10-28"
      }
    ]
  };
  
  const faqs = [
    { question: "1. How is junk removal different from regular scrap collection?", answer: "Scrap collection is for materials with recyclable value (like metal, paper). Junk removal is a paid service to haul away items that have little to no scrap value (like old furniture, mattresses, general clutter) and require proper disposal."},
    { question: "2. Do I have to bring my junk to the curb?", answer: "No, you don't. Our service is full-service, which means we will remove the items from wherever they are located in your home or office—be it the basement, attic, or backyard."},
    { question: "3. Can you provide same-day junk removal in Mumbai?", answer: "Yes, we often can! Contact us in the morning, and we will do our best to schedule your junk removal for the same day, depending on our truck availability in your area."},
    { question: "4. What items are you not able to take?", answer: "For safety and regulatory reasons, we cannot accept hazardous materials like chemicals, paints, asbestos, oils, and pressurized containers. Please contact your local municipal body for guidance on disposing of these items."},
    { question: "5. How do you determine the price for junk removal?", answer: "The price is based on the amount of space your items take up in our truck. We can often provide a reliable estimate over the phone with a good description or photos, and we always confirm the final price on-site before starting any work."}
  ];

  const serviceName = "Junk Removal Service";

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.scrapiz.in/services/junk-removal-service" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative bg-cover bg-center text-white py-24 md:py-32" style={{backgroundImage: "url('/junk-removal-service-mumbai-Scrapiz.jpeg')"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-green-800/70"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Fast & Reliable Junk Removal in Mumbai</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light">Reclaim your space! We haul away everything you don't need, from a single item to a full truckload. Same-day service available.</p>
            <div className="flex justify-center items-center flex-wrap gap-4 mb-8 text-sm">
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><Clock className="w-4 h-4 mr-2 text-orange-300" /> Same-Day Service</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><Trash className="w-4 h-4 mr-2 text-orange-300" /> We Take Almost Anything</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><ShieldCheck className="w-4 h-4 mr-2 text-orange-300" /> Professional & Insured</span>
            </div>
            <button
              onClick={() => openModal(serviceName)}
              aria-label="Get a free estimate for junk removal"
              className="bg-white text-green-700 font-bold py-3 px-10 rounded-full shadow-2xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300 transform hover:scale-105"
            >
              Get a Free Estimate
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">We Haul It All, So You Don't Have To</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">Whether you're cleaning out your garage, renovating your office, or disposing of old furniture, Scrapiz provides a full-service junk removal solution. Our trained and uniformed team does all the heavy lifting. You just point, and the junk disappears!</p>
            <p className="text-gray-600 mb-6 leading-relaxed">We are committed to responsible disposal. We donate and recycle whatever we can, minimizing the amount of waste that ends up in Mumbai's landfills.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2}} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-5">Commonly Removed Items:</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-gray-700">
              <li className="flex items-center"><Sofa className="w-5 h-5 mr-3 text-orange-500" />Old Furniture</li>
              <li className="flex items-center"><Trash className="w-5 h-5 mr-3 text-orange-500" />Appliances</li>
              <li className="flex items-center"><Trash className="w-5 h-5 mr-3 text-orange-500" />Mattresses & Beds</li>
              <li className="flex items-center"><Trash className="w-5 h-5 mr-3 text-orange-500" />E-waste</li>
              <li className="flex items-center"><Trash className="w-5 h-5 mr-3 text-orange-500" />Construction Debris</li>
              <li className="flex items-center"><Trash className="w-5 h-5 mr-3 text-orange-500" />Office Junk</li>
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Junk Removal Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Junk gone in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y:50 }} whileInView={{ opacity: 1, y:0 }} viewport={{ once: true }} transition={{ duration: 0.7}}>
              <div className="space-y-6">
                <div className="flex items-start"><strong className="text-green-600 text-3xl mr-4">1.</strong><div><h4 className="font-semibold text-xl">Get a Free Estimate</h4><p className="text-gray-600">Call us or send photos of your junk. We'll give you an upfront, all-inclusive price. No hidden fees.</p></div></div>
                <div className="flex items-start"><strong className="text-green-600 text-3xl mr-4">2.</strong><div><h4 className="font-semibold text-xl">We Arrive & Load</h4><p className="text-gray-600">We schedule a 2-hour arrival window. Our team confirms the price on-site and gets to work loading your junk.</p></div></div>
                <div className="flex items-start"><strong className="text-green-600 text-3xl mr-4">3.</strong><div><h4 className="font-semibold text-xl">We Haul It Away</h4><p className="text-gray-600">We sweep up the area and haul your junk away for responsible disposal, recycling, or donation.</p></div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2}} className="border rounded-xl p-8 bg-gray-50 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Transparent Pricing</h3>
              <p className="text-gray-600 mb-4">Our pricing is based on the volume your junk takes up in our truck. We offer several price points.</p>
              <ul className="space-y-2 text-gray-600">
                <li><span className="font-semibold text-green-700">Minimum Load:</span> For a few small items.</li>
                <li><span className="font-semibold text-green-700">1/4 Truckload:</span> Perfect for a small cleanout.</li>
                <li><span className="font-semibold text-green-700">1/2 Truckload:</span> Fits a sofa and more.</li>
                <li><span className="font-semibold text-green-700">Full Truckload:</span> For major cleanouts.</li>
              </ul>
              <button
                onClick={() => openModal(serviceName)}
                className="mt-6 inline-block bg-green-100 text-green-800 font-bold py-3 px-6 rounded-lg hover:bg-green-200"
              >
                Get Your Custom Quote
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Mumbaikars Love Their Clutter-Free Spaces</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Aarti Rao</p>
                  <p className="text-sm text-gray-500">Powai</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"The Scrapiz team cleared out my old furniture in less than 30 minutes! They were polite, fast, and the price was very reasonable. My apartment feels so much bigger now. Thank you!"</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Vikas Patel</p>
                  <p className="text-sm text-gray-500">Borivali West</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"We used Scrapiz to clear out construction debris after our office renovation. They were professional, on time, and handled all the waste responsibly. It saved my team a lot of time and effort."</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Junk Removal FAQs</h2>
          <div className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} question={faq.question} answer={faq.answer} />
              ))}
          </div>
        </div>
      </section>
      
      <section className="from-green-500 to-green-700 bg-gradient-to-r text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Ready to Reclaim Your Space?</h2>
              <p className="text-orange-100 max-w-xl">Let us do the heavy lifting. Get your free, no-obligation estimate now.</p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Get a free estimate"
                className="w-full sm:w-auto bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300 transform hover:scale-105"
              >
                Get My Estimate
              </button>
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Chat on WhatsApp for junk removal"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-600 transition-colors duration-300 inline-flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-3"/> WhatsApp for Quote
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JunkRemovalServicePage;
