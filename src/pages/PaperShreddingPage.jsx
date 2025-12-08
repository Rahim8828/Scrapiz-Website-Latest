
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileCheck2, Lock, Truck, Recycle, Phone, MessageCircle, ChevronDown } from 'lucide-react';

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


const PaperShreddingPage = ({ openModal }) => {
  const pageTitle = "Secure Paper Shredding Service in Mumbai | Scrapiz";
  const pageDescription = "Protect your confidential information with Scrapiz's secure paper shredding and document destruction services in Mumbai. On-site & off-site options available with certificate of destruction.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Paper Shredding Service",
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
      "url": "https://www.scrapiz.in/services/paper-shredding",
      "priceRange": "Contact for quote"
    },
    "areaServed": { "@type": "City", "name": "Mumbai" },
    "name": "Secure Document & Paper Shredding",
    "description": "NAID-certified shredding services for businesses and individuals to ensure confidential data is securely destroyed and recycled.",
    "aggregateRating": { 
      "@type": "AggregateRating", 
      "ratingValue": "5.0", 
      "reviewCount": "2",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Adv. Priya Sharma"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "As a law firm, document confidentiality is non-negotiable. Scrapiz provides a reliable and certified shredding service that meets our compliance needs. Their professionalism is commendable.",
        "datePublished": "2024-11-12"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "CA. Rajesh Gupta"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "We use their on-site shredding service quarterly. The mobile shredding truck is impressive and gives us complete peace of mind watching our sensitive financial documents being destroyed right before our eyes.",
        "datePublished": "2024-10-25"
      }
    ]
  };
  
  const faqs = [
    { question: "1. Why is professional paper shredding necessary?", answer: "Standard office shredders do not offer sufficient security. Professional services use cross-cut shredding technology that makes document reconstruction impossible, ensuring compliance with privacy laws like IT Act, 2000 and GDPR."},
    { question: "2. Do I receive proof that my documents were destroyed?", answer: "Yes. After every service, we issue a formal ‘Certificate of Destruction’. This legal document serves as your audit trail for compliance purposes, confirming the date and method of destruction."},
    { question: "3. What is the difference between on-site and off-site shredding?", answer: "On-site shredding involves our mobile shredding truck coming to your Mumbai location to destroy documents right there. Off-site shredding involves us securely transporting your documents to our facility for destruction. Both are highly secure."},
    { question: "4. Do I need to remove staples or paper clips?", answer: "No, you don't. Our industrial-grade shredders can easily handle staples, paper clips, binder clips, and file folders, saving you valuable time and effort."},
    { question: "5. What happens to the paper after it is shredded?", answer: "100% of the shredded paper is securely baled and transported to our recycling partners. It is then pulped and recycled into new paper products, contributing to a sustainable environment."}
  ];

  const serviceName = "Paper Shredding";

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.scrapiz.in/services/paper-shredding" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative bg-cover bg-center text-white py-24 md:py-32" style={{backgroundImage: "url('/secure-paper-shredding-service-Scrapiz.jpeg')"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-green-800/70"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Secure Paper Shredding in Mumbai</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light">Protect your business from data breaches. We provide compliant, reliable, and certified document destruction for your peace of mind.</p>
            <div className="flex justify-center items-center flex-wrap gap-4 mb-8 text-sm">
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><Lock className="w-4 h-4 mr-2 text-blue-300" /> 100% Secure & Confidential</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><FileCheck2 className="w-4 h-4 mr-2 text-blue-300" /> Certificate of Destruction</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><Recycle className="w-4 h-4 mr-2 text-blue-300" /> Eco-Friendly Recycling</span>
            </div>
            <button
              onClick={() => openModal(serviceName)}
              aria-label="Schedule a shredding service"
              className="bg-white text-green-700 font-bold py-3 px-10 rounded-full shadow-2xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
            >
              Schedule a Service
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Your Partner in Information Security</h2>
            <p className="text-gray-600 mb-16 leading-relaxed">In an era of data privacy, securely disposing of sensitive documents is a legal and ethical necessity. Scrapiz offers a professional paper shredding service for businesses and individuals in Mumbai, ensuring that confidential information is irreversibly destroyed.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-5">What We Shred:</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Bank Statements & Financial Reports</li>
                <li>• Legal Documents & Contracts</li>
                <li>• Customer & Employee Records</li>
                <li>• Medical Records (HIPAA)</li>
                <li>• Expired Cheques & Invoices</li>
                <li>• Blueprints & Business Plans</li>
                <li>• Tax Records</li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-semibold text-gray-800 mb-5">How to Prepare:</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start"><span className="text-green-500 font-bold text-xl mr-3 mt-1">✔</span> <div><span className="font-semibold">No Prep Needed:</span> No need to remove staples, paper clips, or binder clips. Our machines handle it.</div></li>
                <li className="flex items-start"><span className="text-green-500 font-bold text-xl mr-3 mt-1">✔</span> <div><span className="font-semibold">Gather Documents:</span> Place all papers in boxes or bags for our team to collect.</div></li>
                <li className="flex items-start"><span className="text-green-500 font-bold text-xl mr-3 mt-1">✔</span> <div><span className="font-semibold">Designate Space:</span> For on-site shredding, ensure a safe area for our mobile shredding truck.</div></li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Simple, Secure, and Transparent</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Choose the shredding plan that fits your security needs.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y:50 }} whileInView={{ opacity: 1, y:0 }} viewport={{ once: true }} transition={{ duration: 0.7}}>
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">How It Works</h3>
              <div className="space-y-6">
                <div className="flex items-start"><strong className="text-green-600 text-3xl mr-4">1.</strong><div><h4 className="font-semibold text-xl">Book & Choose</h4><p className="text-gray-600">Contact us to book a service. Choose on-site (we shred at your location) or off-site (we shred at our facility) services.</p></div></div>
                <div className="flex items-start"><strong className="text-green-600 text-3xl mr-4">2.</strong><div><h4 className="font-semibold text-xl">Secure Collection</h4><p className="text-gray-600">Our verified team collects documents in locked bins, ensuring a secure chain of custody from your door to ours.</p></div></div>
                <div className="flex items-start"><strong className="text-green-600 text-3xl mr-4">3.</strong><div><h4 className="font-semibold text-xl">Certified Destruction</h4><p className="text-gray-600">We shred documents to the highest security standards and provide a formal Certificate of Destruction for your records.</p></div></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2}} className="border rounded-xl p-8 bg-gray-50 shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Pricing & Plans</h3>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="pb-4 font-semibold text-gray-700">Service Option</th>
                    <th className="pb-4 font-semibold text-gray-700">Best For</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-t"><td className="py-3 font-semibold">One-Time Purge</td><td>Annual cleanouts, project-based shredding</td></tr>
                  <tr className="border-t"><td className="py-3 font-semibold">Subscription Service</td><td>Regular, scheduled shredding for ongoing needs</td></tr>
                  <tr className="border-t"><td className="py-3 font-semibold">On-Site Shredding</td><td>Maximum security and witnessing the process</td></tr>
                </tbody>
              </table>
              <button
                onClick={() => openModal(serviceName)}
                className="mt-6 inline-block bg-green-100 text-green-800 font-bold py-3 px-6 rounded-lg hover:bg-green-200"
              >
                Get a Custom Quote
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Our Commitment to Confidentiality</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Adv. Priya Sharma</p>
                  <p className="text-sm text-gray-500">Law Firm, Fort</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"As a law firm, document confidentiality is non-negotiable. Scrapiz provides a reliable and certified shredding service that meets our compliance needs. Their professionalism is commendable."</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">CA. Rajesh Gupta</p>
                  <p className="text-sm text-gray-500">Accounting Firm, Malad</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"We use their on-site shredding service quarterly. The mobile shredding truck is impressive and gives us complete peace of mind watching our sensitive financial documents being destroyed right before our eyes."</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Shredding Service FAQs</h2>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Protect Your Sensitive Data</h2>
              <p className="text-blue-100 max-w-xl">Get a quote for our secure shredding services in Mumbai.</p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Get a shredding quote"
                className="w-full sm:w-auto bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105"
              >
                Get a Free Quote
              </button>
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Chat on WhatsApp"
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

export default PaperShreddingPage;
