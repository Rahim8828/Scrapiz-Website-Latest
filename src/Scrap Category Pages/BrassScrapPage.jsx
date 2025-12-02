import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronDown, Phone, IndianRupee, Clock, Truck, Scale, CheckCircle, MapPin, Recycle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const AccordionItem = ({ question, answer, isOpen, onClick }) => (
  <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
    <button className="w-full flex justify-between items-center text-left p-4 md:p-5 bg-white hover:bg-gray-50 transition-colors focus:outline-none" onClick={onClick} aria-expanded={isOpen}>
      <span className="font-semibold text-gray-800 text-base md:text-lg pr-4">{question}</span>
      <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
      <p className="px-4 md:px-5 pb-4 md:pb-5 text-gray-600 text-sm md:text-base leading-relaxed">{answer}</p>
    </motion.div>
  </div>
);

const BrassScrapPage = ({ openModal }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const pageTitle = "Sell Brass Scrap in Mumbai – Instant Cash & Free Pickup | Scrapiz";
  const pageDescription = "Sell brass scrap in Mumbai at ₹140-₹420/kg. Free doorstep pickup, instant cash/UPI payment, digital weighing. We buy brass fittings, pipes, valves, sheets, radiators, industrial brass scrap. Call +91 8828700630";
  const pageUrl = "https://www.scrapiz.in/sell-brass-scrap-mumbai";

  const faqs = [
    { question: "Do you offer free brass scrap pickup?", answer: "Yes, we provide free doorstep pickup across Mumbai for all brass scrap." },
    { question: "What brass scrap do you accept?", answer: "We accept brass fittings, pipes, radiators, sheets, valves, copper-brass mixed items and industrial brass scrap." },
    { question: "How do you pay for brass scrap?", answer: "Instant payment via Cash, UPI or Bank Transfer right after weighing." },
    { question: "Do you buy mixed metal with brass?", answer: "Yes, we evaluate mixed loads and give the best market price based on composition." },
    { question: "How quickly can you arrive?", answer: "Typically within 30–45 minutes depending on your location." },
    { question: "Do you handle bulk factory brass scrap?", answer: "Yes — we handle bulk loads, factory scrap and project clearances with documentation." }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { 
        "@type": "Service", 
        "name": "Brass Scrap Buying Service Mumbai", 
        "description": pageDescription, 
        "provider": { 
          "@type": "LocalBusiness", 
          "name": "Scrapiz", 
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
        "areaServed": { "@type": "City", "name": "Mumbai" } 
      },
      { "@type": "FAQPage", "mainEntity": faqs.map(faq => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } })) }
    ]
  };

  const serviceName = "Brass Scrap";
  const brassTypes = ["Brass fittings", "Brass pipes", "Brass sheets", "Brass radiators", "Brass rods", "Brass castings", "Brass hardware", "Brass utensils", "Industrial brass", "Mixed brass"];
  const priceTable = [
    { type: "Pure Brass Scrap", price: "₹300 – ₹420/kg" },
    { type: "Brass Alloy Scrap", price: "₹220 – ₹350/kg" },
    { type: "Brass Radiator Scrap", price: "₹180 – ₹300/kg" },
    { type: "Brass Pipe & Fitting", price: "₹200 – ₹340/kg" },
    { type: "Mixed Brass Scrap", price: "₹140 – ₹240/kg" },
    { type: "Brass Utensils Scrap", price: "₹160 – ₹260/kg" }
  ];
  const areas = {
    "Western Suburbs": ["Andheri", "Bandra", "Jogeshwari", "Goregaon", "Malad", "Kandivali", "Borivali"],
    "Central Mumbai": ["Dadar", "Sion", "Kurla", "Ghatkopar", "Vidyavihar", "Chembur"],
    "South Mumbai": ["Wadala", "Byculla", "Parel", "Worli", "Lower Parel", "Fort"],
    "Extended Areas": ["Thane", "Mira Road", "Vasai-Virar", "Navi Mumbai"]
  };
  const scrapCategories = [
    { title: "Brass Fittings & Valves", items: ["Brass valves", "Pipe fittings", "Couplings", "Tap fittings"], icon: "🔧" },
    { title: "Brass Pipes & Tubes", items: ["Brass pipes", "Tubing", "Plumbing brass"], icon: "🔌" },
    { title: "Industrial Brass", items: ["Machine parts", "Turnings", "Manufacturing scrap"], icon: "🏭" },
    { title: "Household Brass", items: ["Utensils", "Decor items", "Old hardware"], icon: "🏠" }
  ];

  return (
    <div className="bg-white text-gray-800">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="sell brass scrap mumbai, brass scrap price mumbai, brass scrap buyer, brass fittings scrap rate" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <nav className="bg-gray-50 py-3 px-4 text-sm">
        <div className="container mx-auto">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="text-amber-600 hover:underline">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link to="/services" className="text-amber-600 hover:underline">Services</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600">Brass Scrap</li>
          </ol>
        </div>
      </nav>

      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-teal-700 text-white py-12 md:py-20 lg:py-28">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">Best Brass Rates in Mumbai</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
              Sell Brass Scrap in Mumbai
              <span className="block text-green-200 text-2xl sm:text-3xl md:text-4xl mt-2">Instant Cash & Free Pickup</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 text-green-50 leading-relaxed">
              Get <strong>₹140-₹420/kg</strong> for your brass scrap. Free doorstep pickup, instant cash payment across Mumbai.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[{ icon: Truck, text: "Free Pickup" }, { icon: IndianRupee, text: "Best Price" }, { icon: Clock, text: "30 Min Service" }].map((item, i) => (
                <span key={i} className="flex items-center bg-white/15 backdrop-blur-sm rounded-full px-3 py-2 text-sm"><item.icon className="w-4 h-4 mr-2 text-green-300" />{item.text}</span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => openModal(serviceName)} className="bg-white text-green-700 font-bold py-4 px-8 rounded-full shadow-xl hover:bg-green-50 transition-all text-base md:text-lg">Book Free Pickup</button>
              <a href="tel:+918828700630" className="bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-green-700 transition-all inline-flex items-center justify-center"><Phone className="w-5 h-5 mr-2" />+91 8828700630</a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[{ value: "₹140-420", label: "Per Kg Rate" }, { value: "10,000+", label: "Happy Customers" }, { value: "30 Min", label: "Pickup Time" }, { value: "100%", label: "Free Pickup" }].map((stat, i) => (
              <div key={i} className="p-4"><div className="text-2xl md:text-3xl font-bold text-green-600">{stat.value}</div><div className="text-sm text-gray-600 mt-1">{stat.label}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Brass Scrap We Buy in Mumbai</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
            {brassTypes.map((type, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white p-4 rounded-xl shadow-sm border text-center hover:shadow-md hover:border-amber-200 transition-all">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" /><span className="text-sm text-gray-700 font-medium">{type}</span>
              </motion.div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scrapCategories.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{cat.icon}</div><h3 className="text-lg font-bold text-gray-800 mb-3">{cat.title}</h3>
                <ul className="space-y-2">{cat.items.map((item, j) => (<li key={j} className="flex items-center text-gray-600 text-sm"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />{item}</li>))}</ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Today's Brass Scrap Rates in Mumbai</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className="bg-green-600 text-white"><tr><th className="py-4 px-6 text-left font-semibold">Brass Type</th><th className="py-4 px-6 text-right font-semibold">Rate</th></tr></thead>
                  <tbody>{priceTable.map((item, i) => (<tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-green-50`}><td className="py-4 px-6 text-gray-800 font-medium">{item.type}</td><td className="py-4 px-6 text-right text-green-600 font-bold text-lg">{item.price}</td></tr>))}</tbody>
                </table>
              </div>
              <div className="md:hidden divide-y">{priceTable.map((item, i) => (<div key={i} className="p-4 flex justify-between items-center"><span className="text-gray-800 font-medium text-sm">{item.type}</span><span className="text-green-600 font-bold">{item.price}</span></div>))}</div>
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

            <p className="text-center text-gray-500 mt-4 text-sm">📞 Call <a href="tel:+918828700630" className="text-green-600 font-semibold hover:underline">+91 8828700630</a> for exact rates</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Why Sell Brass Scrap to Scrapiz?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ icon: Truck, title: "Free Doorstep Pickup", desc: "We collect from your location — no transport hassle." }, { icon: IndianRupee, title: "Best Brass Price", desc: "We pay competitive prices for quality brass scrap." }, { icon: Scale, title: "Digital Weighing", desc: "Certified scales ensure transparent transactions." }, { icon: Clock, title: "30-45 Min Pickup", desc: "Fast service across Mumbai." }, { icon: CheckCircle, title: "Instant Payment", desc: "Cash, UPI or Bank transfer immediately." }, { icon: Recycle, title: "Eco-Friendly", desc: "Responsible recycling process." }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-2xl shadow-md border hover:shadow-lg transition-all">
                <div className="bg-green-100 text-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-5"><item.icon className="w-7 h-7" /></div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">{item.title}</h3><p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">How to Sell Brass Scrap</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[{ step: "1", title: "Book Pickup", desc: "Call or fill form with details" }, { step: "2", title: "We Arrive", desc: "Team reaches in 30-45 minutes" }, { step: "3", title: "Get Paid", desc: "Instant payment after weighing" }].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl md:text-3xl font-bold shadow-lg">{item.step}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3><p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Brass Scrap Pickup Areas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(areas).map(([region, locations], i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="font-bold text-green-600 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2" />{region}</h3>
                <ul className="space-y-2">{locations.map((loc, j) => (<li key={j} className="text-gray-600 text-sm">{loc}</li>))}</ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">{faqs.map((faq, i) => (<AccordionItem key={i} question={faq.question} answer={faq.answer} isOpen={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} />))}</div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Sell Your Brass Scrap?</h2>
          <p className="text-green-100 mb-8 text-lg">Free pickup • Best price • Instant payment</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button onClick={() => openModal(serviceName)} className="bg-white text-green-700 font-bold py-4 px-10 rounded-full shadow-xl hover:bg-green-50 transition-all text-lg">Book Free Pickup</button>
            <a href="tel:+918828700630" className="border-2 border-white text-white font-bold py-4 px-10 rounded-full hover:bg-white hover:text-green-700 transition-all inline-flex items-center justify-center text-lg"><Phone className="w-5 h-5 mr-2" />+91 8828700630</a>
          </div>
          <p className="text-green-200 font-medium">Scrapiz — Mumbai's Trusted Brass Scrap Buyer</p>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 md:hidden z-50 shadow-lg">
        <div className="flex gap-3">
          <button onClick={() => openModal(serviceName)} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-full text-sm">Book Pickup</button>
          <a href="tel:+918828700630" className="flex-1 bg-gray-100 text-gray-800 font-bold py-3 rounded-full text-sm inline-flex items-center justify-center"><Phone className="w-4 h-4 mr-2" />Call Now</a>
        </div>
      </div>
      <div className="h-20 md:hidden"></div>
    </div>
  );
};

export default BrassScrapPage;
