import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import { scrapData } from "../data/scrapData";
import { locationData } from "../data/locationData";

import TopInfoBar from "../components/TopInfoBar";
import Navbar from "../components/Header";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowItWorks";
import ScrapCategoriesSection from "../components/ScrapCategoriesSection"; 
import SEOCTASection from "@/components/SEOCTASection";
import Testimonials from "@/components/TestimonialsSection";
import PriceEstimatorSection from "@/components/PriceEstimatorSection";
import LocationMap from "@/components/LocationMap";
import ScrapRateFAQ from "@/components/ScrapRateFAQ";


const synonymMap = {
    fridge: "refrigerator",
    refrigerator: "refrigerator",
  
    "washing-machine": "washingmachine",
    washingmachine: "washingmachine",
  
    "e-waste": "ewaste",
    ewaste: "ewaste",
    electronics: "ewaste",
  
    ss: "stainless",
    "stainless-steel": "stainless",
    stainless: "stainless",
  
    iron: "iron",
    steel: "iron",
  
    ac: "ac",
    airconditioner: "ac",
  
    copper: "copper",
    aluminium: "aluminium",
    brass: "brass",
    microwave: "microwave"
  };
  

const resolveFromSlug = (slug, scrapData, locationData) => {
    const lowerSlug = slug.toLowerCase();
  
    let material = null;
    let location = null;
  
    // 🔹 Scrap detection (existing logic)
    for (const word in synonymMap) {
      const regex = new RegExp(`\\b${word}\\b`);
      if (regex.test(lowerSlug)) {
        material = synonymMap[word];
        break;
      }
    }
  
    if (!material) {
      const keys = Object.keys(scrapData).sort((a, b) => b.length - a.length);
      for (const key of keys) {
        const regex = new RegExp(`\\b${key}\\b`);
        if (regex.test(lowerSlug)) {
          material = key;
          break;
        }
      }
    }
  
    // 🔹 Location detection
    const locationKeys = Object.keys(locationData);
  
    for (const key of locationKeys) {
      const regex = new RegExp(`\\b${key}\\b`);
      if (regex.test(lowerSlug)) {
        location = key;
        break;
      }
    }
  
    return { material, location };
  };

const ScrapRatePage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
      
      // Get material using smart resolver
      const { material, location } = resolveFromSlug(
        slug,
        scrapData,
        locationData
      );
    

      
      // ❌ Invalid URL → 404
      if (!material) {
          return (
              <div className="p-10 text-center text-xl font-semibold">
          Page not found
        </div>
      );
    }
    
   
    const locationObj = locationData[location];
    const scrap = scrapData[material];
    
    
    useEffect(() => {
        const correctSlug = location
        ? `${material}-scrap-rate-${location}`
        : `${material}-scrap-rate`;

    
        if (slug !== correctSlug) {
          navigate(`/${correctSlug}`, { replace: true });
        }
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


    const generateFAQSchema = (scrap, locationObj) => {
        if (!scrap) return null;
        
        const cleanName = scrap.name.replace("Scrap", "").trim();
        const lowerName = cleanName.toLowerCase();
        const locationName = locationObj?.displayName;
        
        const faqs = [
            {
            question: `What is the ${lowerName} scrap rate ${
                locationName ? `in ${locationName}` : "today"
            }?`,
            answer: `The current ${lowerName} scrap rate is around ₹${scrap.pricePerKg} per ${scrap.unit}. Prices may vary based on quality and quantity.`,
            },
            {
            question: `Where can I sell ${lowerName} scrap ${
                locationName ? `in ${locationName}` : "near me"
            }?`,
            answer: `You can sell your ${lowerName} scrap with Scrapiz. We offer doorstep pickup and instant payment ${
                locationName ? `in ${locationName}` : ""
            }.`,
            },
            {
            question: `How is ${lowerName} scrap price calculated?`,
            answer: `Scrap prices depend on weight, purity, and current market demand.`,
            },
            {
            question: `Do you provide scrap pickup ${
                locationName ? `in ${locationName}` : ""
            }?`,
            answer: `Yes, we provide free doorstep pickup and instant payment.`,
            },
        ];
        
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
            })),
        };
        };

        const generateProductSchema = (scrap, locationObj) => {
            if (!scrap) return null;
          
            const locationName = locationObj?.displayName;
          
            return {
              "@context": "https://schema.org",
              "@type": "Product",
              name: `${scrap.name} Scrap ${locationName ? `in ${locationName}` : ""}`,
              description: `Latest ${scrap.name.toLowerCase()} scrap rate per ${scrap.unit}`,
              brand: {
                "@type": "Brand",
                name: "Scrapiz",
              },
              offers: {
                "@type": "Offer",
                price: scrap.pricePerKg,
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                seller: {
                  "@type": "Organization",
                  name: "Scrapiz",
                },
              },
            };
          };

          const generateLocalBusinessSchema = (locationObj) => {
            if (!locationObj) return null;
          
            return {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Scrapiz",
              image: "https://www.scrapiz.in/logo.png", // optional
              telephone: "+918828700630",
              address: {
                "@type": "PostalAddress",
                streetAddress: locationObj?.nap?.address?.street || "",
                addressLocality: locationObj?.name,
                addressRegion: "Maharashtra",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: locationObj?.geo?.latitude,
                longitude: locationObj?.geo?.longitude,
              },
              areaServed: {
                "@type": "Place",
                name: locationObj?.displayName,
              },
            };
          };

          const faqSchema = generateFAQSchema(scrap, locationObj);
const productSchema = generateProductSchema(scrap, locationObj);
const localBusinessSchema = generateLocalBusinessSchema(locationObj);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />

        {faqSchema && (
        <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
        </script>
        )}

        {productSchema && (
        <script type="application/ld+json">
        {JSON.stringify(productSchema)}
        </script>
        )}

        {locationObj && localBusinessSchema && (
        <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
        </script>
        )}
      </Helmet>

      <div className="bg-white text-gray-800">
        <TopInfoBar />
        <Navbar />


        {/* HERO */}
        <section className="px-6 py-12 pt-28 text-center text-white bg-green-600">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {locationName
            ? `${cleanName} Scrap Rate in ${locationName} (Per Kg)`
            : `${cleanName} Scrap Rate Today (Per Kg)`
            }
        </h1>

        <p className="text-lg text-green-100 max-w-2xl mx-auto">
            {locationName
            ? `Get the latest ${lowerName} scrap price per kg in ${locationName} with Scrapiz. We offer the best rates, instant payment, and doorstep pickup.`
            : `Get the latest ${lowerName} scrap price per kg with Scrapiz. We offer the best rates, instant payment, and doorstep pickup.`
            }
        </p>
        </section>

        {/* PRICE CARD */}
        <section className="px-6 py-10">
          <div className="max-w-4xl mx-auto bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">
              Current {scrap.name} Scrap Price
            </h2>
            <p className="text-4xl font-bold text-green-600">
            ₹{scrap.pricePerKg} / {scrap.unit}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              *Prices may vary based on quantity and quality
            </p>
          </div>
        </section>

        {/* scrap categories section */}
        <ScrapCategoriesSection />

        {/* PRICE ESTIMATOR */}
        <PriceEstimatorSection scrap={scrap} />


        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* LOCATION MAP */}
        {locationObj && <LocationMap location={locationObj} />}

        {/* FAQ */}
        <ScrapRateFAQ scrap={scrap} location={locationObj} />
    
        {/* CTA */}
        <SEOCTASection scrap={scrap} location={locationObj} />

        {/* TESTIMONIALS */}
        <Testimonials />
        
        <Footer />
      </div>
    </>
  );
};

export default ScrapRatePage;

// /copper-scrap-rate