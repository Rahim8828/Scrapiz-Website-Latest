import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronDown, Phone, IndianRupee, Clock, Truck, Scale, CheckCircle, MapPin, Recycle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// SEO-optimized FAQ Accordion
const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
    <button
      className="w-full flex justify-between items-center text-left p-4 md:p-5 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
      onClick={onClick}
      aria-expanded={isOpen}
    >
      <span className="font-semibold text-gray-800 text-base md:text-lg pr-4">{question}</span>
      <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <motion.div
      initial={false}
      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <p className="px-4 md:px-5 pb-4 md:pb-5 text-gray-600 text-sm md:text-base leading-relaxed">{answer}</p>
    </motion.div>
  </div>
);

const AluminiumScrapPage = ({ openModal }) => {
  const [openFaq, setOpenFaq] = useState(null);
  
  // SEO Meta Data
  const pageTitle = "Sell Aluminium Scrap in Mumbai – Free Pickup & Best Price | Scrapiz";
  const pageDescription = "Sell aluminium scrap in Mumbai at ₹80-₹220/kg. Free doorstep pickup, instant cash/UPI payment, digital weighing. We buy aluminium sheets, cans, utensils, wires, industrial scrap. Call +91 8828700630";
  const pageUrl = "https://www.scrapiz.in/sell-aluminium-scrap-mumbai";
  const pageImage = "https://www.scrapiz.in/aluminium-scrap-mumbai.jpg";

  const faqs = [
    { question: "Do you offer free aluminium scrap pickup in Mumbai?", answer: "Yes, pickup is 100% free across all areas of Mumbai including Andheri, Bandra, Thane, Navi Mumbai and more. No hidden charges." },
    { question: "What is the minimum quantity required for pickup?", answer: "No minimum quantity required — we pick up from 1 kg to bulk loads. Small household scrap to large industrial quantities, all accepted." },
    { question: "What types of aluminium scrap do you buy?", answer: "We buy all types: aluminium sheets, cans, utensils, wires, frames, profiles, industrial scrap, machine scrap, cast aluminium, and mixed aluminium metal." },
    { question: "How do you pay for aluminium scrap?", answer: "Instant payment via Cash, UPI (GPay, PhonePe, Paytm), or Bank Transfer — immediately after weighing. No delays." },
    { question: "How quickly can you come for pickup?", answer: "Usually within 30–45 minutes depending on your location and traffic conditions. Same-day pickup available." },
    { question: "What is today's aluminium scrap rate in Mumbai?", answer: "Rates vary daily based on market. Currently: Pure Aluminium ₹110-150/kg, Wire Scrap ₹160-220/kg, Mixed Scrap ₹80-120/kg. Call for exact rates." }
  ];

  // Enhanced JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        "name": "Aluminium Scrap Buying Service in Mumbai",
        "serviceType": "Aluminium Scrap Collection & Buying",
        "description": pageDescription,
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://www.scrapiz.in/#business",
          "name": "Scrapiz",
          "image": "https://www.scrapiz.in/Scrapiz-logo.webp",
          "telephone": "+91-8828700630",
          "email": "contact@scrapiz.in",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Shop No. 07, Dharavi",
            "addressLocality": "Mumbai",
            "addressRegion": "Maharashtra",
            "postalCode": "400017",
            "addressCountry": "IN"
          },
          "priceRange": "₹₹"
        },
        "areaServed": {
          "@type": "City",
          "name": "Mumbai"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.scrapiz.in" },
          { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.scrapiz.in/services" },
          { "@type": "ListItem", "position": 3, "name": "Aluminium Scrap", "item": pageUrl }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      }
    ]
  };

  const serviceName = "Aluminium Scrap";

  const aluminiumTypes = [
    "Aluminium sheets", "Aluminium cans", "Aluminium utensils", "Aluminium wires",
    "Aluminium frames", "Aluminium profiles", "Industrial aluminium",
    "Machine scrap", "Cast aluminium", "Mixed aluminium"
  ];

  const priceTable = [
    { type: "Pure Aluminium Scrap", price: "₹110 – ₹150/kg" },
    { type: "Aluminium Wire Scrap", price: "₹160 – ₹220/kg" },
    { type: "Industrial Aluminium Scrap", price: "₹125 – ₹170/kg" },
    { type: "Aluminium Mixed Scrap", price: "₹80 – ₹120/kg" },
    { type: "Cast Aluminium Scrap", price: "₹60 – ₹90/kg" },
    { type: "Aluminium Utensils Scrap", price: "₹80 – ₹110/kg" }
  ];

  const areas = {
    "Western Suburbs": ["Andheri", "Bandra", "Goregaon", "Malad", "Kandivali", "Borivali", "Jogeshwari"],
    "Central Mumbai": ["Dadar", "Sion", "Kurla", "Chembur", "Wadala", "Ghatkopar"],
    "South Mumbai": ["Byculla", "Parel", "Worli", "Lower Parel", "Fort", "Colaba"],
    "Extended Areas": ["Thane", "Navi Mumbai", "Mira Road", "Vasai-Virar", "Panvel"]
  };

  const scrapCategories = [
    { title: "Household Aluminium", items: ["Old utensils", "Foil rolls", "Broken items", "Rods & pipes"], icon: "🏠" },
    { title: "Commercial Aluminium", items: ["Frames", "ACP sheets", "Grills", "Signboards"], icon: "🏢" },
    { title: "Industrial Aluminium", items: ["CNC scrap", "Coils", "Die casting", "Turnings"], icon: "🏭" },
    { title: "Construction Aluminium", items: ["Window frames", "Door frames", "Profiles", "Shuttering"], icon: "🏗️" }
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Enhanced SEO Head */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="sell aluminium scrap mumbai, aluminium scrap price mumbai, aluminium kabadiwala mumbai, aluminium scrap buyer near me, best aluminium scrap rate mumbai, sell old aluminium mumbai" />
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={pageImage} />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Scrapiz" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="Scrapiz" />
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Mumbai" />
        
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Breadcrumb - SEO & Navigation */}
      <nav className="bg-gray-50 py-3 px-4 text-sm" aria-label="Breadcrumb">
        <div className="container mx-auto">
          <ol className="flex flex-wrap items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to="/" className="text-green-600 hover:underline" itemProp="item"><span itemProp="name">Home</span></Link>
              <meta itemProp="position" content="1" />
            </li>
            <li className="text-gray-400">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link to="/services" className="text-green-600 hover:underline" itemProp="item"><span itemProp="name">Services</span></Link>
              <meta itemProp="position" content="2" />
            </li>
            <li className="text-gray-400">/</li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span className="text-gray-600" itemProp="name">Aluminium Scrap</span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section - Mobile Optimized */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-teal-700 text-white py-12 md:py-20 lg:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="text-center max-w-4xl mx-auto"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">Trusted by 10,000+ Customers in Mumbai</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight">
              Sell Aluminium Scrap in Mumbai
              <span className="block text-green-200 text-2xl sm:text-3xl md:text-4xl mt-2">Free Pickup & Best Price</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 md:mb-8 text-green-50 leading-relaxed">
              Get <strong>₹80-₹220/kg</strong> for your aluminium scrap. Free doorstep pickup, instant cash payment, and certified digital weighing across Mumbai.
            </p>
            
            {/* Trust Indicators - Mobile Friendly */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: Truck, text: "Free Pickup" },
                { icon: IndianRupee, text: "Best Price" },
                { icon: Clock, text: "30 Min Service" }
              ].map((item, i) => (
                <span key={i} className="flex items-center bg-white/15 backdrop-blur-sm rounded-full px-3 py-2 text-sm">
                  <item.icon className="w-4 h-4 mr-2 text-green-300" />
                  {item.text}
                </span>
              ))}
            </div>
            
            {/* CTA Buttons - Touch Friendly */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openModal(serviceName)}
                className="bg-white text-green-700 font-bold py-4 px-8 rounded-full shadow-xl hover:bg-green-50 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 transform hover:scale-105 text-base md:text-lg"
                aria-label="Book free aluminium scrap pickup"
              >
                Book Free Pickup
              </button>
              <a 
                href="tel:+918828700630" 
                className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-green-700 transition-all duration-300 inline-flex items-center justify-center text-base md:text-lg"
                aria-label="Call Scrapiz for aluminium scrap pickup"
              >
                <Phone className="w-5 h-5 mr-2" />
                +91 8828700630
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Quick Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            {[
              { value: "10,000+", label: "Happy Customers" },
              { value: "₹80-220", label: "Per Kg Rate" },
              { value: "30 Min", label: "Avg. Pickup Time" },
              { value: "100%", label: "Free Pickup" }
            ].map((stat, i) => (
              <div key={i} className="p-4">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Buy Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Aluminium Scrap We Buy in Mumbai
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
              We purchase all types of aluminium scrap at the best market rates
            </p>
          </div>
          
          {/* Scrap Types Grid - Mobile Optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-10">
            {aluminiumTypes.map((type, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md hover:border-green-200 transition-all"
              >
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <span className="text-sm md:text-base text-gray-700 font-medium">{type}</span>
              </motion.div>
            ))}
          </div>

          {/* Categories Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scrapCategories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{cat.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item, j) => (
                    <li key={j} className="flex items-center text-gray-600 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Table Section - Mobile Optimized */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Today's Aluminium Scrap Rates in Mumbai
            </h2>
            <p className="text-gray-600">Market-based pricing • Updated daily</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              {/* Mobile-friendly table */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="py-4 px-6 text-left font-semibold">Aluminium Type</th>
                      <th className="py-4 px-6 text-right font-semibold">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceTable.map((item, i) => (
                      <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50 transition-colors`}>
                        <td className="py-4 px-6 text-gray-800 font-medium">{item.type}</td>
                        <td className="py-4 px-6 text-right text-green-600 font-bold text-lg">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {priceTable.map((item, i) => (
                  <div key={i} className="p-4 flex justify-between items-center hover:bg-green-50">
                    <span className="text-gray-800 font-medium text-sm">{item.type}</span>
                    <span className="text-green-600 font-bold">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rate Disclaimer */}
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800 mb-1">Important Note About Rates</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    <strong>These are tentative rates</strong> and may vary based on market conditions, material quality, quantity, and current metal prices. 
                    Rates are updated regularly but can fluctuate daily. For the most accurate and current pricing, please call us at 
                    <a href="tel:+918828700630" className="font-bold text-amber-900 hover:underline ml-1">+91 8828700630</a>.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-500 mt-4 text-sm">
              📞 Call <a href="tel:+918828700630" className="text-green-600 font-semibold hover:underline">+91 8828700630</a> for exact rates
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Sell Aluminium Scrap to Scrapiz?
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Truck, title: "Free Doorstep Pickup", desc: "We come to your location — home, office, factory, or construction site. No transport hassle." },
              { icon: IndianRupee, title: "Best Market Price", desc: "We track daily aluminium rates and pay the highest competitive price in Mumbai." },
              { icon: Scale, title: "Digital Weighing", desc: "Certified electronic scales ensure 100% accurate and transparent weighing." },
              { icon: Clock, title: "30-45 Min Pickup", desc: "Fast service across Mumbai. Book now, we reach quickly." },
              { icon: CheckCircle, title: "Instant Payment", desc: "Get paid immediately via Cash, UPI, or Bank Transfer. No delays." },
              { icon: Recycle, title: "Eco-Friendly Recycling", desc: "Your scrap is responsibly recycled, contributing to a greener environment." }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all"
              >
                <div className="bg-green-100 text-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Mobile Optimized */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Sell Aluminium Scrap
            </h2>
            <p className="text-gray-600">Simple 3-step process</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Book Pickup", desc: "Call us or fill the form with your location and scrap details" },
              { step: "2", title: "We Arrive", desc: "Our team reaches in 30-45 minutes with digital weighing scale" },
              { step: "3", title: "Get Paid", desc: "We weigh, confirm price, and pay you instantly" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="bg-green-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl md:text-3xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Aluminium Scrap Pickup Areas in Mumbai
            </h2>
            <p className="text-gray-600">We serve all Mumbai locations</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(areas).map(([region, locations], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <h3 className="font-bold text-green-600 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {region}
                </h3>
                <ul className="space-y-2">
                  {locations.map((loc, j) => (
                    <li key={j} className="text-gray-600 text-sm">{loc}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO Optimized */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">About selling aluminium scrap in Mumbai</p>
          </div>
          
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Sell Your Aluminium Scrap?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Free pickup • Best price • Instant payment
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => openModal(serviceName)}
              className="bg-white text-green-700 font-bold py-4 px-10 rounded-full shadow-xl hover:bg-green-50 transition-all text-lg"
            >
              Book Free Pickup
            </button>
            <a 
              href="tel:+918828700630" 
              className="border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-green-700 transition-all inline-flex items-center justify-center text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              +91 8828700630
            </a>
          </div>
          
          <p className="text-green-200 font-medium">
            Scrapiz — Mumbai's Most Trusted Aluminium Scrap Buyer
          </p>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:hidden z-50 shadow-lg">
        <div className="flex gap-3">
          <button
            onClick={() => openModal(serviceName)}
            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-full text-sm"
          >
            Book Pickup
          </button>
          <a 
            href="tel:+918828700630" 
            className="flex-1 bg-gray-100 text-gray-800 font-bold py-3 rounded-full text-sm inline-flex items-center justify-center"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </a>
        </div>
      </div>
      
      {/* Bottom padding for sticky CTA on mobile */}
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default AluminiumScrapPage;
