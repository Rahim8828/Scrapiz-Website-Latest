import React from "react";
import { Users, Gift, TrendingUp } from "lucide-react";
import ServicePageTemplate from "../components/ServicePageTemplate";

const SocietyTieUpPage = ({ openModal }) => (
  <ServicePageTemplate
    serviceName="Society Tie-Up"
    openModal={openModal}
    meta={{
      title: "Housing Society Scrap Collection in Mumbai | Scrapiz Tie-Up",
      description: "Partner with Scrapiz for a streamlined scrap management solution for your housing society in Mumbai. We organize collection drives, offer rewards, and ensure transparent processing.",
      canonical: "https://www.scrapiz.in/services/society-tie-up",
    }}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Society Scrap Collection Program",
      provider: { "@type": "LocalBusiness", name: "Scrapiz", telephone: "+91-8828700630", url: "https://www.scrapiz.in/services/society-tie-up" },
      areaServed: { "@type": "City", name: "Mumbai" },
      name: "Housing Society Recycling and Scrap Collection Tie-Up",
      description: "A comprehensive waste management partnership for housing societies, including regular collections, e-waste drives, and transparent revenue sharing.",
    }}
    hero={{
      heading: "Partner with Scrapiz for Your Society",
      subheading: "Earn Revenue & Go Green",
      description: "Empower your housing society in Mumbai with an organized, rewarding, and eco-friendly scrap management program. Let's build a greener community together.",
      badges: [
        { icon: Users, text: "Hassle-Free for Residents" },
        { icon: Gift, text: "Exclusive Society Rewards" },
        { icon: TrendingUp, text: "Generate Extra Revenue" },
      ],
      ctaLabel: "Partner with Us",
    }}
    stats={[
      { value: "50+", label: "Societies Partnered" },
      { value: "Free", label: "No Setup Cost" },
      { value: "Monthly", label: "Collection Drives" },
      { value: "100%", label: "Transparent" },
    ]}
    about={{
      heading: "A Win-Win for Your Society & the Planet",
      body: [
        "Managing scrap in a large housing complex can be chaotic. Our Society Tie-Up program brings structure, transparency, and financial benefits to your community's recycling efforts.",
        "We schedule regular collection drives, provide promotional materials, and make consolidated payments directly to the society's bank account.",
      ],
      highlight: {
        title: "Zero Cost to the Society",
        text: "There are absolutely no charges or hidden fees. Our partnership is based on a revenue-sharing model where the society earns from the scrap it collects.",
      },
      itemsHeading: "What We Offer:",
      items: [
        "Scheduled monthly collection drives",
        "Promotional posters & digital creatives",
        "E-waste collection bins",
        "Transparent weight & rate reporting",
        "Consolidated payment to society account",
        "E-waste awareness sessions",
        "Green initiative contributions",
        "Dedicated relationship manager",
      ],
    }}
    steps={{
      heading: "Our 3-Step Partnership Process",
      subheading: "Setting up your society's green program is easy.",
      items: [
        { title: "Sign Up & Plan", desc: "The society committee contacts us. We sign a simple MoU and plan the first collection drive calendar." },
        { title: "Promote & Collect", desc: "We provide posters and creatives. Our team sets up a collection point in your society on the scheduled day." },
        { title: "Consolidate & Pay", desc: "We weigh all scrap transparently and make a consolidated payment to the society committee." },
      ],
    }}
    benefits={[
      "Zero cost to the society",
      "Revenue for society welfare fund",
      "Organized & scheduled drives",
      "E-waste collection included",
      "Transparent digital reporting",
      "Promotional support provided",
      "Available across Mumbai MMR",
      "Dedicated support team",
    ]}
    testimonials={[
      { name: "Mr. S. K. Sharma", location: "Secretary, Pleasant Park CHS, Chembur", text: "Partnering with Scrapiz has been fantastic. The collection drives are well-organized, and the revenue we generate helps fund our children's play area. Highly recommended!" },
      { name: "Mrs. Maria D'Souza", location: "Committee Member, Sea View Apts, Bandra", text: "The best part is the transparency. Scrapiz provides a full breakdown of the collection, and the funds are transferred promptly. They also conducted a great e-waste awareness session." },
    ]}
    faqs={[
      { question: "Is there any cost for the housing society to partner with Scrapiz?", answer: "No, there are absolutely no charges or hidden fees for the society. Our partnership is based on a revenue-sharing model where the society earns from the scrap it collects." },
      { question: "How is the payment made to the society?", answer: "After each collection drive, we calculate the total value of the scrap and make a single, consolidated payment to the society's official bank account with a detailed statement." },
      { question: "Can you also collect e-waste from our society?", answer: "Yes! We strongly encourage and facilitate e-waste collection drives. We can set up special collection bins for items like old phones, laptops, and batteries." },
      { question: "What support does Scrapiz provide to promote the collection drives?", answer: "We provide a complete promotional kit, including posters for notice boards, and digital creatives that you can share on your society's WhatsApp or Telegram groups." },
      { question: "Which areas in Mumbai do you offer the society tie-up program?", answer: "Our society partnership program is available across the entire Mumbai Metropolitan Region (MMR), including Thane, Navi Mumbai, and all suburbs of Mumbai." },
    ]}
    ctaBanner={{
      heading: "Make Your Society a Green Champion",
      subheading: "Let's connect and create a custom recycling program for your residents.",
      primaryLabel: "Enquire Now",
      secondaryLabel: "Call for Societies",
    }}
  />
);

export default SocietyTieUpPage;
