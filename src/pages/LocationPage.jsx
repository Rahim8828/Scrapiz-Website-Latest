import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { locationData } from "../data/locationData";
import { generateLocationSchema } from "../utils/seoHelpers";

import LocationHero from "../components/LocationHero";
import LocationWhyChoose from "../components/LocationWhyChoose";
import LocationServices from "../components/LocationServices";
import LocationContact from "../components/LocationContact";
import LocationMap from "../components/LocationMap";
import LocationFAQ from "../components/LocationFAQ";
import LocationNearby from "../components/LocationNearby";

const LocationTemplate = () => {
  const { locationSlug } = useParams();

  const location = locationData[locationSlug];

  if (!location) {
    return <div>Location not found</div>;
  }

  const schema = generateLocationSchema(location);

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
      </Helmet>

      <div className="bg-white text-gray-800">
        <LocationHero location={location} />
        <LocationWhyChoose location={location} />
        <LocationServices location={location} />
        <LocationContact location={location} />
        <LocationMap location={location} />
        <LocationNearby location={location} />
        <LocationFAQ location={location} />
      </div>
    </>
  );
};

export default LocationTemplate;