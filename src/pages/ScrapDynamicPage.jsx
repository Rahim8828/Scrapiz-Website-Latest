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

const normalizeSlugPart = (value = "") =>
  String(value)
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

const stripHyphen = (value = "") => normalizeSlugPart(value).replace(/-/g, "");

const materialAliases = {
  "e-waste": "ewaste",
  "e-wastes": "ewaste",
  "stainless-steel": "stainless",
  "stainless-steels": "stainless",
  "iron-steel": "iron",
  "washing-machine": "washingmachine",
};

const resolveMaterialKey = (rawMaterial) => {
  const normalized = normalizeSlugPart(rawMaterial);
  const compact = stripHyphen(rawMaterial);

  if (materialAliases[normalized] && scrapData[materialAliases[normalized]]) {
    return materialAliases[normalized];
  }

  if (scrapData[normalized]) return normalized;
  if (scrapData[compact]) return compact;

  return Object.keys(scrapData).find((key) => {
    const keyNormalized = normalizeSlugPart(key);
    return keyNormalized === normalized || stripHyphen(key) === compact;
  });
};

const resolveLocation = (rawLocation) => {
  const normalized = normalizeSlugPart(rawLocation);
  const compact = stripHyphen(rawLocation);

  return Object.values(locationData).find((loc) => {
    const candidates = [loc.slug, loc.id, loc.name, loc.displayName];
    return candidates.some((candidate) => {
      const candidateNormalized = normalizeSlugPart(candidate);
      return (
        candidateNormalized === normalized ||
        stripHyphen(candidateNormalized) === compact
      );
    });
  });
};

const parseDynamicSlug = (rawSlug = "") => {
  const slug = normalizeSlugPart(rawSlug);

  const sellMatch = slug.match(/^sell-(.+)-scrap-(.+)$/);
  if (sellMatch) {
    return {
      material: sellMatch[1],
      service: "sell",
      location: sellMatch[2],
    };
  }

  const commonMatch = slug.match(/^(.+)-scrap-(buyers|pickup|dealers)-(.+)$/);
  if (commonMatch) {
    return {
      material: commonMatch[1],
      service: commonMatch[2],
      location: commonMatch[3],
    };
  }

  return null;
};

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

  const materialKey = resolveMaterialKey(parsed.material);
  const serviceKey = normalizeSlugPart(parsed.service);
  const scrap = materialKey ? scrapData[materialKey] : null;
  const location = resolveLocation(parsed.location);

  const serviceType =
    serviceKey === "sell"
      ? { name: "Sell Scrap", slug: "sell" }
      : serviceData[serviceKey];

  if (!scrap || !location || !serviceType) {
    return <NotFound />;
  }

  const faqs = generateFAQs(location);

  // 🧠 SEO
  const title =
    serviceKey === "sell"
      ? `Sell ${scrap.name} Scrap in ${location.displayName} | Scrapiz`
      : `${scrap.name} ${serviceType.name} in ${location.displayName} | Scrapiz`;

  const description = `Looking for ${scrap.name.toLowerCase()} ${serviceType.slug} in ${location.displayName}? Scrapiz offers doorstep pickup, instant payment, and best scrap rates in ${location.displayName}.`;

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