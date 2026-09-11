import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Truck, IndianRupee, Clock, Star, Phone, CheckCircle } from "lucide-react";

import { scrapData } from "../data/scrapData";
import { locationData } from "../data/locationData";

import ScrapCategoriesSection from "../components/ScrapCategoriesSection";
import SEOCTASection from "@/components/SEOCTASection";
import Testimonials from "@/components/TestimonialsSection";
import LocationMap from "@/components/LocationMap";
import ScrapRateFAQ from "@/components/ScrapRateFAQ";
import NotFound from "./NotFound";

const synonymMap = {
  fridge: "refrigerator", refrigerator: "refrigerator",
  "washing-machine": "washingmachine", washingmachine: "washingmachine",
  "e-waste": "ewaste", ewaste: "ewaste", electronics: "ewaste",
  ss: "stainless", "stainless-steel": "stainless", stainless: "stainless",
  iron: "iron", steel: "iron",
  ac: "ac", airconditioner: "ac",
  copper: "copper", aluminium: "aluminium", brass: "brass", microwave: "microwave",
};

const resolveFromSlug = (slug, scrapData, locationData) => {
  const lowerSlug = slug.toLowerCase();
  let material = null;
  let location = null;

  for (const word in synonymMap) {
    if (new RegExp(`\\b${word}\\b`).test(lowerSlug)) {
      material = synonymMap[word];
      break;
    }
  }
  if (!material) {
    for (const key of Object.keys(scrapData).sort((a, b) => b.length - a.length)) {
      if (new RegExp(`\\b${key}\\b`).test(lowerSlug)) { material = key; break; }
    }
  }
  for (const key of Object.keys(locationData)) {
    if (new RegExp(`\\b${key}\\b`).test(lowerSlug)) { location = key; break; }
  }
  return { material, location };
};

const ScrapRatePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { material, location } = resolveFromSlug(slug, scrapData, locationData);

  if (!material) {
    return <NotFound />;
  }

  const locationObj = locationData[location];
  const scrap = scrapData[material];

  useEffect(() => {
    const correctSlug = location ? `${material}-scrap-rate-${location}` : `${material}-scrap-rate`;
    if (slug !== correctSlug) navigate(`/${correctSlug}`, { replace: true });
  }, [slug, material, location, navigate]);

  const cleanName = scrap.name.replace("Scrap", "").trim();
  const lowerName = cleanName.toLowerCase();
  const locationName = locationObj?.displayName;

  const title = locationName
    ? `${cleanName} Scrap Price & Rate in ${locationName} (Per Kg) | Scrapiz`
    : `${cleanName} Scrap Price & Rate Today (Per Kg) | Scrapiz`;

  const description = locationName
    ? `Check latest ${lowerName} scrap price per kg in ${locationName}. Get best rates, instant payment, and free doorstep pickup with Scrapiz.`
    : `Check latest ${lowerName} scrap price per kg. Get best rates, instant payment, and free doorstep pickup with Scrapiz.`;

  const canonicalUrl = location
    ? `https://www.scrapiz.in/${material}-scrap-rate-${location}`
    : `https://www.scrapiz.in/${material}-scrap-rate`;

const faqItems = [
  {
    question: `What is the ${lowerName} scrap rate ${locationName ? `in ${locationName}` : "today"}?`,
    answer: `The current ${lowerName} scrap rate is around ₹${scrap.pricePerKg} per ${scrap.unit}. Prices may vary based on quality and quantity.`,
  },
  {
    question: `Where can I sell ${lowerName} scrap ${locationName ? `in ${locationName}` : "near me"}?`,
    answer: `You can sell your ${lowerName} scrap with Scrapiz. We offer doorstep pickup and instant payment${locationName ? ` in ${locationName}` : ""}.`,
  },
  {
    question: `How is ${lowerName} scrap price calculated?`,
    answer: `Scrap prices depend on weight, purity, and current market demand.`,
  },
  {
    question: `Do you provide scrap pickup${locationName ? ` in ${locationName}` : ""}?`,
    answer: `Yes, we provide free doorstep pickup and instant payment.`,
  },
  {
    question: `What is the minimum quantity required to sell ${lowerName} scrap?`,
    answer: `We usually accept small to large quantities. However, higher quantities may get better pricing.`,
  },
  {
    question: `Do you offer same-day pickup for ${lowerName} scrap?`,
    answer: `Yes, we provide same-day or within 24 hours pickup depending on availability.`,
  },
  {
    question: `How do I book a ${lowerName} scrap pickup?`,
    answer: `You can call us or book directly through our website. Our team will schedule a pickup at your convenience.`,
  },
  {
    question: `Do you provide digital weighing for scrap?`,
    answer: `Yes, we use certified digital weighing machines to ensure transparency and accuracy.`,
  },
  {
    question: `What payment methods do you offer?`,
    answer: `We offer instant payment via Cash, UPI, or Bank Transfer after weighing.`,
  },
  {
    question: `Can I get a better price for bulk ${lowerName} scrap?`,
    answer: `Yes, bulk scrap usually gets higher rates depending on quantity and quality.`,
  },
  {
    question: `Do you accept mixed scrap materials along with ${lowerName}?`,
    answer: `Yes, we accept multiple types of scrap including metal, paper, e-waste, and appliances.`,
  },
  {
    question: `Is there any pickup charge?`,
    answer: `No, our pickup service is completely free with no hidden charges.`,
  },
  {
    question: `Why should I choose Scrapiz for selling ${lowerName} scrap?`,
    answer: `We provide best market rates, fast pickup, instant payment, and trusted service across Mumbai.`,
  },
  {
    question: `Do scrap rates change daily?`,
    answer: `Yes, scrap prices fluctuate based on market demand, material quality, and global rates.`,
  },
  {
    question: `Can businesses sell ${lowerName} scrap in bulk?`,
    answer: `Yes, we work with offices, warehouses, and industries for bulk scrap collection.`,
  },
];

  // @graph schema — matches AluminiumScrapPage pattern
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": `${cleanName} Scrap Buying Service${locationName ? ` in ${locationName}` : " in Mumbai"}`,
        "serviceType": `${cleanName} Scrap Collection & Buying`,
        "description": description,
        "provider": {
          "@type": "LocalBusiness",
          "name": "Scrapiz",
          "telephone": "+91-8828700630",
          "image": "https://www.scrapiz.in/logo.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": locationObj?.nap?.address?.street || "Mumbai",
            "addressLocality": locationObj?.name || "Mumbai",
            "addressRegion": "Maharashtra",
            "postalCode": "400001",
            "addressCountry": "IN",
          },
          ...(locationObj?.geo && {
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": locationObj.geo.latitude,
              "longitude": locationObj.geo.longitude,
            },
          }),
        },
        "areaServed": { "@type": "City", "name": locationName || "Mumbai" },
        "offers": {
          "@type": "Offer",
          "price": scrap.pricePerKg,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
        },
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.scrapiz.in" },
          { "@type": "ListItem", "position": 2, "name": "Scrap Rates", "item": "https://www.scrapiz.in/scrap-rates" },
          { "@type": "ListItem", "position": 3, "name": `${cleanName} Scrap Rate`, "item": canonicalUrl },
        ],
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`sell ${lowerName} scrap mumbai, ${lowerName} scrap price today, ${lowerName} scrap buyer near me, best ${lowerName} scrap rate`} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content={locationName || "Mumbai"} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="bg-white text-gray-800 font-sans">
        {/* HERO */}
        <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-teal-700 text-white pt-24 pb-12 md:pt-28 md:pb-20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">Trusted by 10,000+ Customers in Mumbai</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2 leading-tight">
                {locationName ? `${cleanName} Scrap Rate in ${locationName}` : `${cleanName} Scrap Rate Today`}
              </h1>
              <p className="text-green-300 font-bold text-xl sm:text-2xl mb-5">
                Free Pickup & Best Price
              </p>

              <p className="text-sm sm:text-base max-w-2xl mx-auto mb-6 text-green-50 leading-relaxed">
                {locationName
                  ? `Get the latest ${lowerName} scrap price per kg in ${locationName} with Scrapiz. Best rates, instant payment, and doorstep pickup.`
                  : `Get the latest ${lowerName} scrap price per kg with Scrapiz. Best rates, instant payment, and doorstep pickup.`}
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-7">
                {[
                  { icon: Truck, text: "Free Pickup" },
                  { icon: IndianRupee, text: "Best Price" },
                  { icon: Clock, text: "30 Min Service" },
                ].map((item, i) => (
                  <span key={i} className="flex items-center bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm">
                    <item.icon className="w-4 h-4 mr-1.5 text-green-300" />
                    {item.text}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:+918828700630"
                  className="bg-white text-green-700 font-bold py-3 px-8 rounded-full shadow-xl hover:bg-green-50 transition-all text-base inline-flex items-center justify-center"
                >
                  Book Free Pickup
                </a>
                <a
                  href="tel:+918828700630"
                  className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-700 transition-all text-base inline-flex items-center justify-center"
                >
                  <Phone className="w-4 h-4 mr-2" /> +91 8828700630
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* QUICK STATS — white bar below hero */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { value: "10,000+", label: "Happy Customers" },
                { value: `₹${scrap.pricePerKg}`, label: `Per ${scrap.unit} Rate` },
                { value: "30 Min", label: "Avg. Pickup Time" },
                { value: "Free", label: "Doorstep Pickup" },
              ].map((stat, i) => (
                <div key={i} className="p-2">
                  <div className="text-2xl md:text-3xl font-bold text-green-600">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* WHY CHOOSE */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">
              Why Sell {cleanName} Scrap to Scrapiz?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Truck, title: "Free Doorstep Pickup", desc: "We come to your home, office, or site. No transport hassle." },
                { icon: IndianRupee, title: "Best Market Price", desc: "We track daily rates and pay the highest competitive price in Mumbai." },
                { icon: Clock, title: "30–45 Min Pickup", desc: "Fast service across Mumbai. Book now, we reach quickly." },
                { icon: CheckCircle, title: "Instant Payment", desc: "Get paid immediately via Cash, UPI, or Bank Transfer." },
                { icon: Star, title: "Certified Weighing", desc: "Digital scales ensure 100% accurate and transparent weighing." },
                { icon: CheckCircle, title: "No Hidden Charges", desc: "Transparent pricing with no surprises. What we quote, we pay." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all"
                >
                  <div className="bg-green-100 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SCRAP CATEGORIES + ESTIMATOR */}
        <ScrapCategoriesSection />

        {/* LOCATION MAP */}
        {locationObj && <LocationMap location={locationObj} />}

        {/* FAQ */}
        <ScrapRateFAQ scrap={scrap} location={locationObj} faqs={faqItems} />

        {/* CTA */}
        <SEOCTASection scrap={scrap} location={locationObj} />

        {/* TESTIMONIALS */}
        <Testimonials />
      </div>

      {/* STICKY MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 md:hidden z-50 shadow-lg">
        <div className="flex gap-3">
          <a
            href="tel:+918828700630"
            className="flex-1 bg-green-600 text-white font-bold py-3 rounded-full text-sm inline-flex items-center justify-center"
          >
            Book Pickup
          </a>
          <a
            href={`https://wa.me/918828700630?text=Hi, I want to sell ${cleanName} scrap`}
            className="flex-1 bg-gray-100 text-gray-800 font-bold py-3 rounded-full text-sm inline-flex items-center justify-center"
          >
            <Phone className="w-4 h-4 mr-2" /> Call Now
          </a>
        </div>
      </div>
      <div className="h-20 md:hidden"></div>
    </>
  );
};

export default ScrapRatePage;
