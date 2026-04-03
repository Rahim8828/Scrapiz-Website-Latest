import React from "react";
import { FileCheck2, Lock, Recycle } from "lucide-react";
import ServicePageTemplate from "../components/ServicePageTemplate";

const PaperShreddingPage = ({ openModal }) => (
  <ServicePageTemplate
    serviceName="Paper Shredding"
    openModal={openModal}
    meta={{
      title: "Secure Paper Shredding Service in Mumbai | Scrapiz",
      description: "Protect your confidential information with Scrapiz's secure paper shredding and document destruction services in Mumbai. On-site & off-site options with certificate of destruction.",
      canonical: "https://www.scrapiz.in/services/paper-shredding",
    }}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Paper Shredding Service",
      provider: { "@type": "LocalBusiness", name: "Scrapiz", telephone: "+91-8828700630", url: "https://www.scrapiz.in/services/paper-shredding", priceRange: "Contact for quote" },
      areaServed: { "@type": "City", name: "Mumbai" },
      name: "Secure Document & Paper Shredding",
      description: "Certified shredding services for businesses and individuals to ensure confidential data is securely destroyed and recycled.",
    }}
    hero={{
      heading: "Secure Paper Shredding in Mumbai",
      subheading: "Certified Document Destruction",
      description: "Protect your business from data breaches. We provide compliant, reliable, and certified document destruction for your peace of mind.",
      badges: [
        { icon: Lock, text: "100% Secure & Confidential" },
        { icon: FileCheck2, text: "Certificate of Destruction" },
        { icon: Recycle, text: "Eco-Friendly Recycling" },
      ],
      ctaLabel: "Schedule a Service",
    }}
    stats={[
      { value: "100%", label: "Secure Destruction" },
      { value: "COD", label: "Certificate Provided" },
      { value: "On-Site", label: "Option Available" },
      { value: "Free", label: "Pickup" },
    ]}
    about={{
      heading: "Your Partner in Information Security",
      body: [
        "In an era of data privacy, securely disposing of sensitive documents is a legal and ethical necessity. Scrapiz offers a professional paper shredding service for businesses and individuals in Mumbai.",
        "We ensure that confidential information is irreversibly destroyed using cross-cut shredding technology that makes document reconstruction impossible.",
      ],
      highlight: {
        title: "No Prep Needed",
        text: "No need to remove staples, paper clips, or binder clips. Our industrial-grade shredders handle everything.",
      },
      itemsHeading: "What We Shred:",
      items: [
        "Bank Statements & Financial Reports",
        "Legal Documents & Contracts",
        "Customer & Employee Records",
        "Medical Records",
        "Expired Cheques & Invoices",
        "Blueprints & Business Plans",
        "Tax Records",
        "Confidential Correspondence",
      ],
    }}
    steps={{
      heading: "Simple, Secure, and Transparent",
      subheading: "Three steps to complete document security.",
      items: [
        { title: "Book & Choose", desc: "Contact us to book a service. Choose on-site (we shred at your location) or off-site options." },
        { title: "Secure Collection", desc: "Our verified team collects documents in locked bins, ensuring a secure chain of custody." },
        { title: "Certified Destruction", desc: "We shred to the highest security standards and provide a formal Certificate of Destruction." },
      ],
    }}
    benefits={[
      "Cross-cut shredding — reconstruction impossible",
      "Certificate of Destruction issued",
      "On-site mobile shredding truck",
      "Off-site secure facility option",
      "Handles staples & paper clips",
      "100% recycled after shredding",
      "Quarterly subscription available",
      "Compliant with IT Act & GDPR",
    ]}
    testimonials={[
      { name: "Adv. Priya Sharma", location: "Law Firm, Fort", text: "As a law firm, document confidentiality is non-negotiable. Scrapiz provides a reliable and certified shredding service that meets our compliance needs. Their professionalism is commendable." },
      { name: "CA. Rajesh Gupta", location: "Accounting Firm, Malad", text: "We use their on-site shredding service quarterly. The mobile shredding truck is impressive and gives us complete peace of mind watching our sensitive financial documents being destroyed right before our eyes." },
    ]}
    faqs={[
      { question: "Why is professional paper shredding necessary?", answer: "Standard office shredders do not offer sufficient security. Professional services use cross-cut shredding technology that makes document reconstruction impossible, ensuring compliance with privacy laws." },
      { question: "Do I receive proof that my documents were destroyed?", answer: "Yes. After every service, we issue a formal Certificate of Destruction. This legal document serves as your audit trail for compliance purposes." },
      { question: "What is the difference between on-site and off-site shredding?", answer: "On-site shredding involves our mobile shredding truck coming to your location to destroy documents right there. Off-site involves us securely transporting your documents to our facility. Both are highly secure." },
      { question: "Do I need to remove staples or paper clips?", answer: "No. Our industrial-grade shredders can easily handle staples, paper clips, binder clips, and file folders, saving you valuable time." },
      { question: "What happens to the paper after it is shredded?", answer: "100% of the shredded paper is securely baled and transported to our recycling partners. It is then pulped and recycled into new paper products." },
    ]}
    ctaBanner={{
      heading: "Protect Your Sensitive Data",
      subheading: "Get a quote for our secure shredding services in Mumbai.",
      primaryLabel: "Get a Free Quote",
      secondaryLabel: "WhatsApp Us",
    }}
  />
);

export default PaperShreddingPage;
