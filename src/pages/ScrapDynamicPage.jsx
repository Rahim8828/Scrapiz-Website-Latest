import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { scrapData } from "../data/scrapData";
import { locationData } from "../data/locationData";
import { serviceData } from "../data/serviceData";
import { generateFAQs } from "../utils/faqs";

import LocationHero from "../components/LocationHero";
import LocationWhyChoose from "../components/LocationWhyChoose";
import LocationServices from "../components/LocationServices";
import LocationContact from "../components/LocationContact";
import LocationMap from "../components/LocationMap";
import LocationNearby from "../components/LocationNearby";
import LocationFAQ from "../components/LocationFAQ";

import SEOCTASection from "@/components/SEOCTASection";
import Testimonials from "@/components/TestimonialsSection";

import NotFound from "./NotFound";
import ScrapRatePage from "./ScrapRatePage";


const ScrapDynamicPage = () => {
  const { slug = "" } = useParams();

  // 🔍 Detect rate pages
  const isRatePage =
    slug?.includes("rate") ||
    slug?.includes("price");

  if (isRatePage) {
    return <ScrapRatePage />;
  }

  const parsed = parseDynamicSlug(slug);
  if (!parsed) {
    return <NotFound />;
  }

  const scrap = scrapData[material];


  const location = Object.values(locationData).find(
    (loc) => loc.slug === city
  );
  const serviceType =
  service === "sell"
    ? {
        name: "Sell Scrap",
        slug: "sell",
        description:
          "Sell your scrap easily with doorstep pickup, instant payment, and best market rates. We handle all types of scrap efficiently and responsibly."
      }
    : serviceData[service];

  if (!scrap || !location || !serviceType) {
    return <NotFound />;
  }

  const faqs = generateFAQs(location);

  // 🧠 SEO
  const title =
  service === "sell"
    ? `Sell ${scrap.name} Scrap in ${location.displayName} | Instant Pickup | Scrapiz`
    : `${scrap.name} ${serviceType.name} in ${location.displayName} | Best Rates | Scrapiz`;

    const description = `${serviceType.description} In ${location.displayName}, we specialize in ${scrap.name.toLowerCase()} scrap with doorstep pickup, instant payment, and top market rates.`;

  const canonicalUrl =
    serviceKey === "sell"
      ? `https://www.scrapiz.in/sell-${materialKey}-scrap-${location.slug}`
      : `https://www.scrapiz.in/${materialKey}-scrap-${serviceType.slug}-${location.slug}`;


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
        <LocationHero 
          location={safeLocation}
          scrap={scrap}
          service={serviceType}
          description={description}
        />

        <LocationWhyChoose location={safeLocation} />
        <LocationServices location={safeLocation} />
        <LocationContact location={safeLocation} />

        <LocationMap location={safeLocation} />

        <LocationNearby location={safeLocation} />

        <LocationFAQ faqs={faqs} name={safeLocation.name} />

        <SEOCTASection scrap={scrap} location={safeLocation} />
        <Testimonials />
      </div>
    </>
  );
};

export default ScrapDynamicPage;