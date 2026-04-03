import React from "react";
import { useParams } from "react-router-dom";
import servicesData from "../data/services/index";
import ServicePageTemplate from "../components/ServicePageTemplate";

const ServicePage = ({ openModal }) => {
  const { serviceSlug } = useParams();
  const data = servicesData[serviceSlug];

  if (!data) {
    return (
      <div className="p-10 text-center text-xl font-semibold text-gray-700">
        Service not found.
      </div>
    );
  }

  // fallback: open WhatsApp if no modal provided
  const handleModal = openModal || ((serviceName) => {
    window.open(`https://wa.me/918828700630?text=Hi, I need help with ${encodeURIComponent(serviceName)}`, "_blank");
  });

  return <ServicePageTemplate data={data} openModal={handleModal} />;
};

export default ServicePage;
