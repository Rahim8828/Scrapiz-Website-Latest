import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronDown, Phone, IndianRupee, Clock, Truck, Scale, CheckCircle, MapPin, Recycle } from 'lucide-react';

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

const IronSteelScrapPage = ({ openModal }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const pageTitle = "Sell Iron & Steel Scrap in Mumbai – Free Pickup & Best Price | Scrapiz";
  const pageDescription = "Sell iron and steel scrap in Mumbai at ₹20-₹50/kg. Free doorstep pickup, instant cash/UPI payment, certified weighing. We buy MS, GI, structural steel, plates, turnings, industrial steel scrap. Call +91 8828700630";
  const pageUrl = "https://www.scrapiz.in/sell-iron-steel-scrap-mumbai";

  const faqs = [
    { question: "Do you offer free iron & steel scrap pickup?", answer: "Yes — free doorstep pickup available across Mumbai for iron and steel scrap." },
    { question: "What steel types do you accept?", answer: "We accept MS (mild steel), GI, structural steel, plates, pipes, beams, turnings, shredded scrap and mixed ferrous loads." },
    { question: "How quickly can you arrive?", answer: "Usually within 30–45 minutes depending on location and traffic." },
    { question: "How is payment made?", answer: "Instant payment via Cash, UPI or Bank Transfer after weighing." },
    { question: "Do you handle bulk factory clearances?", answer: "Yes — we manage large industrial pickups, factory clearances and project dismantling." },
    { question: "Do you provide pickup for construction scrap?", answer: "Yes — we pick up construction site ferrous scrap and provide site clearance services." }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { 
        "@type": "Service", 
        "name": "Iron & Steel Scrap Buying Service Mumbai", 
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

  const serviceName = "Iron & Steel Scrap";
  
  const ironSteelTypes = [
    "Mild Steel (MS) Scrap", "Structural Steel (Beams, Channels)", "GI Scrap (Galvanized Iron)",
    "Steel Plates & Sheets", "Steel Pipes & Tubes", "Turnings & Shavings",
    "MS Frames & Fabrication Waste", "Rebar / TMT Scrap", "Vehicle Frame Scrap", "Mixed Ferrous Scrap"
  ];

  const priceTable = [
    { type: "Mild Steel (MS) Scrap", price: "₹35 – ₹50 per kg" },
    { type: "GI / Galvanized Iron Scrap", price: "₹30 – ₹45 per kg" },
    { type: "Structural Steel (Beams, Channels)", price: "₹28 – ₹45 per kg" },
    { type: "Steel Plates & Sheets", price: "₹30 – ₹48 per kg" },
    { type: "Turnings & Shavings (Heavy)", price: "₹20 – ₹38 per kg" },
    { type: "Rebar / TMT Scrap", price: "₹32 – ₹46 per kg" }
  ];

  const areas = {
    "Western Suburbs": ["Andheri", "Bandra", "Jogeshwari", "Goregaon", "Malad", "Kandivali", "Borivali", "Dahisar"],
    "Central Mumbai": ["Dadar", "Sion", "Kurla", "Ghatkopar", "Vidyavihar", "Chembur"],
    "Harbour & South Mumbai": ["Wadala", "Byculla", "Parel", "Worli", "Lower Parel", "CST", "Fort"],
    "Extended Mumbai": ["Thane", "Mira Road", "Vasai–Virar", "Navi Mumbai (Vashi, Nerul, Airoli, Panvel)"]
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="sell iron scrap mumbai, sell steel scrap mumbai, iron scrap buyer mumbai, steel scrap pickup mumbai, ms scrap mumbai, gi scrap mumbai" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-800 to-gray-900 text-white py-24 md:py-32">
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Sell Iron & Steel Scrap in Mumbai – Free Pickup & Best Price
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 font-light">
              Get the best iron & steel scrap prices in Mumbai with free doorstep pickup, instant cash/UPI payment, and certified digital weighing. We buy MS, GI, structural steel, plates, turnings and industrial ferrous scrap.
            </p>
            <div className="flex justify-center items-center flex-wrap gap-4 mb-8 text-sm">
              <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1"><Truck className="w-4 h-4 mr-2 text-gray-300" /> Free Doorstep Pickup</span>
              <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1"><IndianRupee className="w-4 h-4 mr-2 text-gray-300" /> Best Price Guarantee</span>
              <span className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1"><Clock className="w-4 h-4 mr-2 text-gray-300" /> 30-45 Min Pickup</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Schedule iron & steel scrap pickup"
                className="bg-white text-gray-900 font-bold py-3 px-10 rounded-full shadow-2xl hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-600 transition-all duration-300 transform hover:scale-105"
              >
                Book Free Pickup
              </button>
              <a href="tel:+918828700630" className="bg-transparent border-2 border-white text-white font-bold py-3 px-10 rounded-full hover:bg-white hover:text-gray-900 transition-colors duration-300 inline-flex items-center justify-center">
                <Phone className="w-5 h-5 mr-2"/> +91 8828700630
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
              ⭐ Sell Iron & Steel Scrap in Mumbai with Free Doorstep Pickup
            </h2>
            <p className="text-gray-600 text-lg text-center max-w-4xl mx-auto mb-8">
              Scrapiz buys iron and steel scrap from homes, workshops, construction sites and factories across Mumbai. We ensure quick pickup, transparent weighing and top market prices for every load.
            </p>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-5">We buy all types of iron & steel scrap:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {ironSteelTypes.map((type, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-gray-600 mr-2 flex-shrink-0" />
                    <span className="text-sm">{type}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 mt-6 text-center">
                Scrapiz guarantees <strong>best iron & steel scrap rates in Mumbai</strong>, fast pickup, and honest weighing.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            ⭐ Why Choose Scrapiz for Iron & Steel Scrap?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: IndianRupee, title: "Best Iron & Steel Prices", desc: "We monitor market movements and offer competitive pricing for clean and industrial ferrous scrap." },
              { icon: Truck, title: "Free Doorstep Pickup", desc: "No transport hassle — our team collects scrap directly from your location." },
              { icon: CheckCircle, title: "Instant Payment (Cash / UPI / Bank)", desc: "Receive payment on the spot after weighing." },
              { icon: Scale, title: "Certified Digital Weighing", desc: "We use verified scales to ensure transparent transactions." },
              { icon: Recycle, title: "We Buy All Ferrous Types", desc: "From MS and GI to structural steel and turnings, we accept all ferrous scrap." },
              { icon: Clock, title: "Mumbai-wide Coverage", desc: "Fast pickup across suburbs, construction zones and industrial areas." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="bg-gray-100 text-gray-700 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Types of Iron & Steel Scrap */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            ⭐ Types of Iron & Steel Scrap We Buy
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "🟫 Mild Steel & MS Scrap", items: ["MS sheets", "MS frames", "Fabrication waste"] },
              { title: "🟫 Structural & Plate Scrap", items: ["Beams, channels, plates", "Cut-offs & offcuts"] },
              { title: "🟫 GI & Coated Ferrous", items: ["Galvanized sheets & pipes", "Coated metal scrap"] },
              { title: "🟫 Pipes, Tubes & Rebars", items: ["Steel pipes & tubes", "Rebar / TMT scrap"] },
              { title: "🟫 Turnings, Shavings & Heavy", items: ["Machine turnings", "Shavings", "Heavy ferrous"] },
              { title: "🟫 Mixed Ferrous Loads", items: ["Mixed MS/GI/Steel loads", "Construction & demolition scrap"] }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <CheckCircle className="w-4 h-4 text-gray-600 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xl font-semibold text-gray-700 mt-12">Ferrous metal in any form — Scrapiz will buy it.</p>
        </div>
      </section>

      {/* Price Table Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
            ⭐ Iron & Steel Scrap Rates in Mumbai (Approx.)
          </h2>
          <p className="text-gray-600 text-center mb-12">(Daily market-based pricing — can change)</p>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold">Type of Iron & Steel Scrap</th>
                    <th className="py-4 px-6 text-right font-semibold">Price (Approx.)</th>
                  </tr>
                </thead>
                <tbody>
                  {priceTable.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-4 px-6 text-gray-800">{item.type}</td>
                      <td className="py-4 px-6 text-right text-gray-800 font-semibold">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

            <p className="text-center text-gray-500 mt-4 text-sm">📌 Prices depend on grade, purity, weight & market rate.</p>
          </div>
        </div>
      </section>

      {/* Areas Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
            ⭐ Areas We Serve for Iron & Steel Scrap Pickup
          </h2>
          <p className="text-gray-600 text-center mb-12">We provide iron & steel scrap pickup all across Mumbai:</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(areas).map(([region, locations], index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {region}
                </h3>
                <ul className="space-y-2">
                  {locations.map((loc, idx) => (
                    <li key={idx} className="text-gray-600 text-sm">{loc}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-xl font-semibold text-gray-700 mt-12">Wherever you are → Scrapiz reaches you.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">⭐ How Iron & Steel Scrap Pickup Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16">Fast, simple, and fully transparent.</p>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-gray-100 text-gray-700 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">1️⃣</div>
              <h3 className="text-xl font-semibold mb-2">Request Pickup</h3>
              <p className="text-gray-600">Call or fill the online form with details.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-gray-100 text-gray-700 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">2️⃣</div>
              <h3 className="text-xl font-semibold mb-2">Pickup Team Arrives</h3>
              <p className="text-gray-600">Our team reaches with weighing machine and loads the scrap safely.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }} className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-gray-100 text-gray-700 w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl font-bold">3️⃣</div>
              <h3 className="text-xl font-semibold mb-2">Instant Payment</h3>
              <p className="text-gray-600">We weigh the scrap → confirm the rate → pay instantly via your chosen method.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            ⭐ Benefits of Selling Iron & Steel Scrap to Scrapiz
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              "Best ferrous price guaranteed",
              "Quick Mumbai-wide service",
              "Free doorstep collection",
              "Accurate digital weighing",
              "Professional & verified team",
              "We handle bulk loads",
              "No hidden charges",
              "Same-day service"
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center"
              >
                <CheckCircle className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">⭐ FAQ – Sell Iron & Steel Scrap in Mumbai</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer} 
                isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="from-gray-800 to-gray-900 bg-gradient-to-r text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">📞 Call Now for Iron & Steel Scrap Pickup: +91 8828700630</h2>
            <p className="text-xl mb-2">🚚 Free Pickup | Best Price | Instant Payment</p>
            <p className="text-gray-300 mb-8">🔥 Scrapiz – Mumbai's Trusted Iron & Steel Scrap Buyer</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openModal(serviceName)}
                aria-label="Book iron & steel scrap pickup now"
                className="bg-white text-gray-900 font-bold py-3 px-10 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-600 transition-all duration-300 transform hover:scale-105"
              >
                Book Free Pickup Now
              </button>
              <a href="tel:+918828700630" aria-label="Call Scrapiz" className="bg-transparent border-2 border-white text-white font-bold py-3 px-10 rounded-full hover:bg-white hover:text-gray-900 transition-colors duration-300 inline-flex items-center justify-center">
                <Phone className="w-5 h-5 mr-3"/> Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IronSteelScrapPage;
