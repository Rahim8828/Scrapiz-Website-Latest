import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { locationData } from "../data/locationData";
import { generateLocationSchema } from "../utils/seoHelpers";
import { generateFAQs } from "../utils/faqs";

import LocationHero from "../components/LocationHero";
import LocationWhyChoose from "../components/LocationWhyChoose";
import LocationServices from "../components/LocationServices";
import LocationContact from "../components/LocationContact";
import LocationMap from "../components/LocationMap";
import LocationFAQ from "../components/LocationFAQ";
import LocationNearby from "../components/LocationNearby";
import NotFound from "./NotFound";

const LocationTemplate = () => {
  const { locationSlug } = useParams();

  const location = Object.values(locationData).find(
    (loc) => loc.slug === locationSlug
  );

  if (!location) {
    return <NotFound />;
  }

  const faqs = generateFAQs(location);
  const schema = generateLocationSchema(location);

  // 🔥 FAQ Schema for SEO
  const faqSchema = {
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

  return (
    <>
      <Helmet>
        <title>{location.seo.title}</title>
        <meta name="description" content={location.seo.description} />
        <meta name="keywords" content={location.seo.keywords} />
        <link rel="canonical" href={location.seo.canonical} />

        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="bg-white text-gray-800 font-sans">
        <LocationHero location={location} />
        <LocationWhyChoose location={location} />
        <LocationServices location={location} />
        <LocationContact location={location} />
        <LocationMap location={location} />
        <LocationNearby location={location} />
        <LocationFAQ faqs={faqs} name={location.name} />

        <div className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Explore Scrap Services in Nearby Areas
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {location.content.nearbyLocations.map((loc, index) => (
                <Link
                  key={index}
                  to={`/locations/${loc.slug}`}
                  className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-full font-medium hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 shadow-sm"
                >
                  Scrap Dealer in {loc.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationTemplate;