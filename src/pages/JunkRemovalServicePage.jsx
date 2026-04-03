import React from "react";
import { Trash2, Clock, ShieldCheck } from "lucide-react";
import ServicePageTemplate from "../components/ServicePageTemplate";

const JunkRemovalServicePage = ({ openModal }) => (
  <ServicePageTemplate
    serviceName="Junk Removal Service"
    openModal={openModal}
    meta={{
      title: "Junk Removal Service in Mumbai | Scrapiz - Fast & Easy Cleanouts",
      description: "Need to get rid of unwanted junk? Scrapiz offers fast and affordable junk removal services in Mumbai. We take everything from old furniture and appliances to construction debris.",
      canonical: "https://www.scrapiz.in/services/junk-removal-service",
    }}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Junk Removal Service",
      provider: { "@type": "LocalBusiness", name: "Scrapiz", telephone: "+91-8828700630", url: "https://www.scrapiz.in/services/junk-removal-service", priceRange: "Contact for quote" },
      areaServed: { "@type": "City", name: "Mumbai" },
      name: "Residential & Commercial Junk Removal",
      description: "Fast, reliable, and eco-friendly removal of unwanted junk, furniture, appliances, and debris for homes and businesses in Mumbai.",
    }}
    hero={{
      heading: "Fast & Reliable Junk Removal in Mumbai",
      subheading: "Same-Day Service Available",
      description: "Reclaim your space! We haul away everything you don't need, from a single item to a full truckload. Same-day service available.",
      badges: [
        { icon: Clock, text: "Same-Day Service" },
        { icon: Trash2, text: "We Take Almost Anything" },
        { icon: ShieldCheck, text: "Professional & Insured" },
      ],
      ctaLabel: "Get a Free Estimate",
    }}
    stats={[
      { value: "Same Day", label: "Service Available" },
      { value: "Free", label: "Estimate" },
      { value: "100%", label: "Eco-Friendly" },
      { value: "All", label: "Items Accepted" },
    ]}
    about={{
      heading: "We Haul It All, So You Don't Have To",
      body: [
        "Whether you're cleaning out your garage, renovating your office, or disposing of old furniture, Scrapiz provides a full-service junk removal solution. Our trained and uniformed team does all the heavy lifting.",
        "We are committed to responsible disposal. We donate and recycle whatever we can, minimizing the amount of waste that ends up in Mumbai's landfills.",
      ],
      highlight: {
        title: "Full-Service Removal",
        text: "You just point, and the junk disappears! Our team handles all the heavy lifting from wherever items are located — basement, attic, or backyard.",
      },
      itemsHeading: "Commonly Removed Items:",
      items: [
        "Old Furniture & Sofas",
        "Appliances & Electronics",
        "Mattresses & Beds",
        "E-Waste",
        "Construction Debris",
        "Office Junk & Partitions",
        "Garden Waste",
        "General Clutter",
      ],
    }}
    steps={{
      heading: "Junk Gone in 3 Simple Steps",
      subheading: "Quick, safe and fully transparent process.",
      items: [
        { title: "Get a Free Estimate", desc: "Call us or send photos of your junk. We'll give you an upfront, all-inclusive price. No hidden fees." },
        { title: "We Arrive & Load", desc: "We schedule a 2-hour arrival window. Our team confirms the price on-site and gets to work loading your junk." },
        { title: "We Haul It Away", desc: "We sweep up the area and haul your junk away for responsible disposal, recycling, or donation." },
      ],
    }}
    benefits={[
      "Same-day service available",
      "Full-service — we do the heavy lifting",
      "Upfront pricing, no hidden fees",
      "Eco-friendly disposal & recycling",
      "Residential & commercial cleanouts",
      "Bulk loads accepted",
      "Professional & uniformed team",
      "Mumbai-wide coverage",
    ]}
    testimonials={[
      { name: "Aarti Rao", location: "Powai", text: "The Scrapiz team cleared out my old furniture in less than 30 minutes! They were polite, fast, and the price was very reasonable. My apartment feels so much bigger now. Thank you!" },
      { name: "Vikas Patel", location: "Borivali West", text: "We used Scrapiz to clear out construction debris after our office renovation. They were professional, on time, and handled all the waste responsibly. It saved my team a lot of time and effort." },
    ]}
    faqs={[
      { question: "How is junk removal different from regular scrap collection?", answer: "Scrap collection is for materials with recyclable value. Junk removal is a paid service to haul away items that have little to no scrap value (like old furniture, mattresses, general clutter) and require proper disposal." },
      { question: "Do I have to bring my junk to the curb?", answer: "No. Our service is full-service, which means we will remove the items from wherever they are located in your home or office — be it the basement, attic, or backyard." },
      { question: "Can you provide same-day junk removal in Mumbai?", answer: "Yes, we often can! Contact us in the morning, and we will do our best to schedule your junk removal for the same day, depending on our truck availability in your area." },
      { question: "What items are you not able to take?", answer: "For safety and regulatory reasons, we cannot accept hazardous materials like chemicals, paints, asbestos, oils, and pressurized containers." },
      { question: "How do you determine the price for junk removal?", answer: "The price is based on the amount of space your items take up in our truck. We always confirm the final price on-site before starting any work." },
    ]}
    ctaBanner={{
      heading: "Ready to Reclaim Your Space?",
      subheading: "Let us do the heavy lifting. Get your free, no-obligation estimate now.",
      primaryLabel: "Get My Estimate",
      secondaryLabel: "Call Now",
    }}
  />
);

export default JunkRemovalServicePage;
