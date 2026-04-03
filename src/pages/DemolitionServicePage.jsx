import React from "react";
import { HardHat, ShieldCheck, Clock } from "lucide-react";
import ServicePageTemplate from "../components/ServicePageTemplate";

const DemolitionServicePage = ({ openModal }) => (
  <ServicePageTemplate
    serviceName="Demolition Service"
    openModal={openModal}
    meta={{
      title: "Professional Demolition Services in Mumbai | Scrapiz",
      description: "Leading demolition contractors in Mumbai for commercial & residential projects. Scrapiz offers safe, insured, and eco-friendly demolition & site clearance services.",
      canonical: "https://www.scrapiz.in/services/demolition-service",
    }}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Demolition Service",
      provider: { "@type": "LocalBusiness", name: "Scrapiz", telephone: "+91-8828700630", url: "https://www.scrapiz.in/services/demolition-service", priceRange: "Contact for quote" },
      areaServed: { "@type": "City", name: "Mumbai" },
      name: "Building and Office Demolition Service",
      description: "Safe, compliant, and efficient demolition services for structures of all sizes in the Mumbai metropolitan area.",
    }}
    hero={{
      heading: "Expert Demolition Services in Mumbai",
      subheading: "Safe, Compliant & Eco-Friendly",
      description: "Safe, efficient, and compliant demolition for residential, commercial, and industrial structures. We handle everything from planning to site clearance.",
      badges: [
        { icon: ShieldCheck, text: "Fully Insured & Licensed" },
        { icon: HardHat, text: "Safety First Approach" },
        { icon: Clock, text: "On-Time Project Completion" },
      ],
      ctaLabel: "Get a Free Quote",
    }}
    stats={[
      { value: "500+", label: "Projects Completed" },
      { value: "100%", label: "Safety Record" },
      { value: "Free", label: "Site Survey" },
      { value: "Instant", label: "Scrap Payment" },
    ]}
    about={{
      heading: "Precision Demolition, Responsible Cleanup",
      body: [
        "Scrapiz provides comprehensive demolition solutions across Mumbai. Our experienced team uses modern equipment and follows strict safety protocols to ensure every project is completed without a hitch.",
        "Post-demolition, we manage the responsible disposal and recycling of all debris, turning waste into valuable resources and ensuring a clean, ready-to-use site.",
      ],
      highlight: {
        title: "Safety & Insurance at Core",
        text: "All our demolition projects are fully insured. Our team is equipped with top-tier PPE and trained in advanced safety procedures.",
      },
      itemsHeading: "Our Demolition Capabilities:",
      items: [
        "Full & Partial Building Demolition",
        "Interior & Office Strip-Outs",
        "Factory & Warehouse Demolition",
        "Concrete & Foundation Breaking",
        "Site Clearance & Debris Removal",
        "Salvage & Scrap Recovery",
      ],
    }}
    steps={{
      heading: "Our 4-Step Demolition Process",
      subheading: "A systematic approach for safe and timely completion.",
      items: [
        { title: "Survey & Plan", desc: "We conduct a site assessment and create a detailed demolition plan with a transparent quote." },
        { title: "Permits", desc: "Our team assists in securing all necessary permits from municipal authorities." },
        { title: "Safe Demolition", desc: "We execute the demolition using specialized machinery, adhering to the highest safety standards." },
        { title: "Debris Management", desc: "We clear the site and transport all debris for recycling and responsible disposal." },
      ],
    }}
    benefits={[
      "Fully insured & licensed team",
      "BMC permit assistance included",
      "Eco-friendly debris recycling",
      "Scrap value credited to your bill",
      "Residential & commercial projects",
      "On-time project completion",
      "Minimal disruption to surroundings",
      "Free site survey & quote",
    ]}
    testimonials={[
      { name: "Ravi Kumar", location: "Project Manager, BKC", text: "Scrapiz handled the demolition of our old office building in Bandra with utmost professionalism. The project was completed ahead of schedule, and their focus on safety was impressive." },
      { name: "Sunita Desai", location: "Property Owner, Juhu", text: "I needed to demolish an old structure on my plot. The Scrapiz team was efficient, clean, and gave me a fair price for the salvaged scrap metal. I couldn't have asked for a smoother process." },
    ]}
    faqs={[
      { question: "How is the cost of a demolition project in Mumbai determined?", answer: "The cost depends on factors like the structure's size and material, location accessibility, required permits, and the amount of debris to be managed. We provide a detailed, no-obligation quote after a site survey." },
      { question: "Do you handle the necessary permissions for demolition?", answer: "Yes, our service includes assistance with acquiring all necessary demolition permits from the BMC and other relevant authorities to ensure full compliance." },
      { question: "Is your demolition process environmentally friendly?", answer: "Absolutely. We prioritize recycling. Demolition waste such as steel, concrete, and wood is segregated on-site and sent to certified recycling facilities." },
      { question: "How long does a typical demolition project take?", answer: "A small residential structure might take a few days, while a larger commercial building could take several weeks. We provide a clear project timeline in our initial proposal." },
      { question: "Do you purchase the scrap generated from the demolition?", answer: "Yes. The value of salvaged materials like steel, copper, and aluminum can be credited against the total cost of the demolition, often resulting in significant savings." },
    ]}
    ctaBanner={{
      heading: "Plan Your Demolition Project",
      subheading: "Contact our experts for a free consultation and site assessment today.",
      primaryLabel: "Request a Quote",
      secondaryLabel: "Call an Expert",
    }}
  />
);

export default DemolitionServicePage;
