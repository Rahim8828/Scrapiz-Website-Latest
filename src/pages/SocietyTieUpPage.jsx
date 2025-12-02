
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Users, Gift, TrendingUp, BarChart, Phone, MessageCircle, ShieldCheck, ChevronDown } from 'lucide-react';

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

const SocietyTieUpPage = ({ openModal }) => {
  const pageTitle = "Housing Society Scrap Collection in Mumbai | Scrapiz Tie-Up";
  const pageDescription = "Partner with Scrapiz for a streamlined scrap management solution for your housing society in Mumbai. We organize collection drives, offer rewards, and ensure transparent processing.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Society Scrap Collection Program",
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
      "url": "https://www.scrapiz.in/services/society-tie-up"
    },
    "areaServed": { "@type": "City", "name": "Mumbai" },
    "name": "Housing Society Recycling and Scrap Collection Tie-Up",
    "description": "A comprehensive waste management partnership for housing societies, including regular collections, e-waste drives, and transparent revenue sharing.",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "150" }
  };
  
  const faqs = [
    { question: "1. Is there any cost for the housing society to partner with Scrapiz?", answer: "No, there are absolutely no charges or hidden fees for the society. Our partnership is based on a revenue-sharing model where the society earns from the scrap it collects." },
    { question: "2. How is the payment made to the society?", answer: "After each collection drive, we calculate the total value of the scrap and make a single, consolidated payment to the society's official bank account. We provide a detailed statement for your records." },
    { question: "3. Can you also collect e-waste from our society?", answer: "Yes! We strongly encourage and facilitate e-waste collection drives. We can set up special collection bins for items like old phones, laptops, and batteries, ensuring they are recycled responsibly." },
    { question: "4. What support does Scrapiz provide to promote the collection drives?", answer: "We provide a complete promotional kit, including posters for notice boards, and digital creatives (images/messages) that you can share on your society's WhatsApp or Telegram groups." },
    { question: "5. Which areas in Mumbai do you offer the society tie-up program?", answer: "Our society partnership program is available across the entire Mumbai Metropolitan Region (MMR), including Thane, Navi Mumbai, and all suburbs of Mumbai." }
  ];

  const serviceName = "Society Tie-Up";

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://www.scrapiz.in/services/society-tie-up" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative bg-cover bg-center text-white py-24 md:py-32" style={{backgroundImage: "url('/housing-society-scrap-collection-Scrapiz.jpeg')"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-green-800/70"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">Partner with Scrapiz for Your Society</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light">Empower your housing society in Mumbai with an organized, rewarding, and eco-friendly scrap management program. Let's build a greener community together.</p>
            <div className="flex justify-center items-center flex-wrap gap-4 mb-8 text-sm">
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><Users className="w-4 h-4 mr-2 text-green-300" /> Hassle-Free for Residents</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><Gift className="w-4 h-4 mr-2 text-green-300" /> Exclusive Society Rewards</span>
              <span className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"><TrendingUp className="w-4 h-4 mr-2 text-green-300" /> Generate Extra Revenue</span>
            </div>
            <button
              onClick={() => openModal(serviceName)}
              aria-label="Partner with us for your society"
              className="bg-white text-green-700 font-bold py-3 px-10 rounded-full shadow-2xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105"
            >
              Partner with Us
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">A Win-Win for Your Society & the Planet</h2>
            <p className="text-gray-600 leading-relaxed">Managing scrap in a large housing complex can be chaotic. Our Society Tie-Up program brings structure, transparency, and financial benefits to your community's recycling efforts.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1}} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <Users className="mx-auto w-14 h-14 text-green-600 mb-5" />
              <h3 className="text-xl font-semibold mb-2">Organized Collection Drives</h3>
              <p className="text-gray-600">We schedule regular, dedicated pickup drives for your society, so residents know when and where to bring their scrap.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3}} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <BarChart className="mx-auto w-14 h-14 text-green-600 mb-5" />
              <h3 className="text-xl font-semibold mb-2">Transparent Reporting</h3>
              <p className="text-gray-600">Get detailed reports on scrap collected and revenue generated, which can be used for society welfare.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5}} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <Gift className="mx-auto w-14 h-14 text-green-600 mb-5" />
              <h3 className="text-xl font-semibold mb-2">Rewards & Incentives</h3>
              <p className="text-gray-600">We offer special rewards and can contribute to society events or green initiatives as a recycling partner.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our 3-Step Partnership Process</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">Setting up your society's green program is easy.</p>
          <div className="grid md:grid-cols-3 gap-8 text-center relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5">
              <div className="w-1/3 h-full inline-block"></div>
              <div className="w-1/3 h-full inline-block border-t-2 border-dashed border-gray-300"></div>
              <div className="w-1/3 h-full inline-block"></div>
            </div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1}} className="relative bg-white p-6 rounded-xl z-10">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Sign Up & Plan</h3>
              <p className="text-gray-600">The society committee contacts us. We sign a simple MoU and plan the first collection drive calendar.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3}} className="relative bg-white p-6 rounded-xl z-10">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Promote & Collect</h3>
              <p className="text-gray-600">We provide posters and creatives. Our team sets up a collection point in your society on the scheduled day.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5}} className="relative bg-white p-6 rounded-xl z-10">
              <div className="bg-green-100 text-green-600 w-16 h-16 mx-.auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Consolidate & Pay</h3>
              <p className="text-gray-600">We weigh all scrap transparently and make a consolidated payment to the society committee.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Helping Mumbai Societies Go Green</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Mr. S. K. Sharma</p>
                  <p className="text-sm text-gray-500">Secretary, Pleasant Park CHS, Chembur</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"Partnering with Scrapiz has been fantastic. The collection drives are well-organized, and the revenue we generate helps fund our children's play area. Highly recommended!"</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7}} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Mrs. Maria D'Souza</p>
                  <p className="text-sm text-gray-500">Committee Member, Sea View Apts, Bandra</p>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"The best part is the transparency. Scrapiz provides a full breakdown of the collection, and the funds are transferred promptly. They also conducted a great e-waste awareness session."</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Society Program FAQs</h2>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Make Your Society a Green Champion</h2>
              <p className="text-green-100 max-w-xl">Let's connect and create a custom recycling program for your residents.</p>
            </div>
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Contact us to partner"
                className="w-full sm:w-auto bg-white text-green-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 transform hover:scale-105"
              >
                Enquire Now
              </button>
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Call Scrapiz Society Team"
                className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-600 transition-colors duration-300 inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-3"/> Call for Societies
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SocietyTieUpPage;
