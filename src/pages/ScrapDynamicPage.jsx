import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import { scrapData } from "../data/scrapData";
import { locationData } from "../data/locationData";
import { serviceData } from "../data/serviceData";

import TopInfoBar from "../components/TopInfoBar";
import Navbar from "../components/Header";
import Footer from "../components/Footer";
import HowItWorks from "../components/HowItWorks";

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

    const title =
    service === "sell"
    ? `Sell ${scrap.name} Scrap in ${location.displayName} | Scrapiz`
    : `${scrap.name} ${serviceType.name} in ${location.displayName} | Scrapiz`;
  
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
            <TopInfoBar />
            <Navbar />
            <LocationHero 
            location={location}
            scrap={scrap}
            service={serviceType}/>
            <LocationWhyChoose location={location} />
            <LocationServices location={location} />
            <HowItWorks />
            <LocationContact location={location} />
            <LocationMap location={location} />
            <LocationNearby location={location} />
            <LocationFAQ location={location} />
            <Footer />
        </div>
      </>
    );
  };

export default ScrapDynamicPage;