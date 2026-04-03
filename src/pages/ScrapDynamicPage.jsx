import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { scrapData } from "../data/scrapData";
import { locationData } from "../data/locationData";
import { serviceData } from "../data/serviceData";
import { generateFAQs } from "../utils/faqs";

import Navbar from "../components/Header";
import Footer from "../components/Footer";

import LocationHero from "../components/LocationHero";
import LocationWhyChoose from "../components/LocationWhyChoose";
import LocationServices from "../components/LocationServices";
import LocationContact from "../components/LocationContact";
import LocationMap from "../components/LocationMap";
import LocationNearby from "../components/LocationNearby";
import LocationFAQ from "../components/LocationFAQ";

import SEOCTASection from "@/components/SEOCTASection";
import Testimonials from "@/components/TestimonialsSection";

import ScrapRatePage from "./ScrapRatePage";

const ScrapDynamicPage = () => {
  const { slug } = useParams();

  // 🔍 Detect rate pages
  const isRatePage =
    slug?.includes("rate") ||
    slug?.includes("price");

  if (isRatePage) {
    return <ScrapRatePage />;
  }

  const parts = slug?.split("-") || [];

  let material;
  let service;
  let city;

  if (parts[0] === "sell") {
    // sell-ewaste-scrap-bandra-east
    material = parts[1];
    service = "sell";
    city = parts.slice(3).join("-");
  } else {
    // copper-scrap-buyers-bandra-east
    material = parts[0];
    service = parts[2];
    city = parts.slice(3).join("-");
  }

  const scrap = scrapData[material];


  const location = Object.values(locationData).find(
    (loc) => loc.slug === city
  );

  const serviceType =
    service === "sell"
      ? { name: "Sell Scrap", slug: "sell" }
      : serviceData[service];

  if (!scrap || !location || !serviceType) {
    return <div>Page not found</div>;
  }

  const faqs = generateFAQs(location);

  // 🧠 SEO
  const title =
    service === "sell"
      ? `Sell ${scrap.name} Scrap in ${location.displayName} | Scrapiz`
      : `${scrap.name} ${serviceType.name} in ${location.displayName} | Scrapiz`;

  const description = `Looking for ${scrap.name.toLowerCase()} ${serviceType.slug} in ${location.displayName}? Scrapiz offers doorstep pickup, instant payment, and best scrap rates in ${location.displayName}.`;

  const canonicalUrl =
    service === "sell"
      ? `https://www.scrapiz.in/sell-${material}-scrap-${city}`
      : `https://www.scrapiz.in/${material}-scrap-${service}-${city}`;


  const getSafeMapUrl = (location) => {
    const lat = location?.geo?.latitude;
    const lng = location?.geo?.longitude;
    const url = location?.geo?.mapEmbedUrl;

    // f broken or pb param exists → FIX automatically
    if (!url || url.includes("pb=")) {
      return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    }

    return url;
  };

  // ✅ Create safe location object (non-mutating)
  const safeLocation = {
    ...location,
    geo: {
      ...location.geo,
      mapEmbedUrl: getSafeMapUrl(location)
    }
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="bg-white text-gray-800 font-sans">
        <Navbar />

        <LocationHero 
          location={safeLocation}
          scrap={scrap}
          service={serviceType}
        />

        <LocationWhyChoose location={safeLocation} />
        <LocationServices location={safeLocation} />
        <LocationContact location={safeLocation} />

        <LocationMap location={safeLocation} />

        <LocationNearby location={safeLocation} />

        <LocationFAQ faqs={faqs} name={safeLocation.name} />

        <SEOCTASection scrap={scrap} location={safeLocation} />
        <Testimonials />

        <Footer />
      </div>
    </>
  );
};

export default ScrapDynamicPage;