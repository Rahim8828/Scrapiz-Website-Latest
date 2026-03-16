import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import { scrapData } from "../data/scrapData";
import { locationData } from "../data/locationData";
import { serviceData } from "../data/serviceData";

import LocationHero from "../components/LocationHero";
import LocationWhyChoose from "../components/LocationWhyChoose";
import LocationServices from "../components/LocationServices";
import LocationContact from "../components/LocationContact";
import LocationMap from "../components/LocationMap";
import LocationNearby from "../components/LocationNearby";
import LocationFAQ from "../components/LocationFAQ";

const ScrapDynamicPage = () => {
    const { slug } = useParams();

    const parts = slug.split("-");

    let material;
    let service;
    let city;
    
    if (parts[0] === "sell") {
    
      // sell-ewaste-scrap-bandra
      material = parts[1];
      service = "sell";
      city = parts.slice(3).join("-");
    
    } else {
    
      // copper-scrap-buyers-bandra
      material = parts[0];
      service = parts[2];
      city = parts.slice(3).join("-");
    
    }
    
    const scrap = scrapData[material];
    const location = locationData[city];
    const serviceType =
    service === "sell"
    ? { name: "Sell Scrap", slug: "sell" }
    : serviceData[service];


    // if (!slug) return <div>Page not found</div>;
  
    // const parts = slug.split("-");
  
    // const material = parts[0];
    // const service = parts[2];
    // const city = parts.slice(3).join("-");


    console.log({
      slug,
      material,
      service,
      city,
      scrap,
      location,
      serviceType
    });
      
      if (!scrap || !location || !serviceType) {
        return <div>Page not found</div>;
      }
  
    const title = `${scrap.name} ${serviceType.name} in ${location.displayName} | Scrapiz`;
  
    const description = `Looking for ${scrap.name.toLowerCase()} ${serviceType.slug} in ${location.displayName}? Scrapiz offers doorstep pickup, instant payment, and best scrap rates in ${location.displayName}.`;

    
  
    return (
      <>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <link
            rel="canonical"
            href={`https://www.scrapiz.in/${material}-scrap-${service}-${city}`}
          />
        </Helmet>
  
        <div className="bg-white text-gray-800">
            <LocationHero 
            location={location}
            scrap={scrap}
            service={serviceType}/>
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

export default ScrapDynamicPage;