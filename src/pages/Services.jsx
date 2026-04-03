import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Recycle, Building, Wrench, FileText, Users, Package, ArrowRight, Car } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { locationData } from '../data/locationData';
import servicesData from '../data/services/index';
import ServicePageTemplate from '../components/ServicePageTemplate';
import LocationContact from '../components/LocationContact';
import LocationMap from '../components/LocationMap';

// ─── Service card definitions ─────────────────────────────────────────────────
const SERVICE_CARDS = [
  { icon: Recycle,   slug: 'scrap-collection',    title: 'Scrap Collection',     description: 'Doorstep scrap collection for metal, paper, plastic, e-waste, and more.' },
  { icon: Building,  slug: 'demolition-service',  title: 'Demolition Service',   description: 'Safe building and industrial demolition with complete debris removal.' },
  { icon: Wrench,    slug: 'dismantling',          title: 'Dismantling',          description: 'Professional dismantling of machinery, factories, and industrial equipment.' },
  { icon: FileText,  slug: 'paper-shredding',      title: 'Paper Shredding',      description: 'Secure document shredding for offices with full confidentiality.' },
  { icon: Users,     slug: 'society-tie-up',       title: 'Society Tie-Up',       description: 'Regular scrap collection programs for housing societies.' },
  { icon: Package,   slug: 'junk-removal-service', title: 'Junk Removal',         description: 'Quick removal of old furniture, appliances, and unwanted junk.' },
  { icon: Car,       slug: 'vehicle-scrapping',    title: 'Vehicle Scrapping',    description: 'RTO-approved scrapping for cars, bikes, and commercial vehicles.' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** "scrap-collection" → "Scrap Collection" */
const toTitleCase = (str) =>
  str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Parse slug like "scrap-collection-service-bandra" or "demolition-service-wadala"
 * Returns { serviceSlug, locationSlug }
 */
const parseSlug = (slug) => {
  if (!slug) return { serviceSlug: null, locationSlug: null };

  // Find the index of the word "service" in the parts
  const parts = slug.split('-');
  const serviceIdx = parts.lastIndexOf('service');

  if (serviceIdx === -1) {
    // No "service" keyword — treat whole thing as service slug, no location
    return { serviceSlug: slug, locationSlug: null };
  }

  const serviceSlug = parts.slice(0, serviceIdx + 1).join('-'); // e.g. "scrap-collection-service"
  const locationSlug = parts.slice(serviceIdx + 1).join('-') || null; // e.g. "bandra"

  // Normalise: "scrap-collection-service" → try exact match, then strip "-service"
  const normalised = servicesData[serviceSlug]
    ? serviceSlug
    : servicesData[serviceSlug.replace(/-service$/, '')]
    ? serviceSlug.replace(/-service$/, '')
    : serviceSlug;

  return { serviceSlug: normalised, locationSlug };
};

/** Resolve location from slug, fallback to Mumbai stub */
const resolveLocation = (locationSlug) => {
  if (!locationSlug) return null;
  return (
    Object.values(locationData).find((l) => l.slug === locationSlug) || null
  );
};

const MUMBAI_FALLBACK = { displayName: 'Mumbai', slug: 'mumbai' };

// ─── Services listing page ────────────────────────────────────────────────────
const ServicesListing = ({ locationSlug }) => {
  const loc =
    locationSlug
      ? resolveLocation(locationSlug) || MUMBAI_FALLBACK
      : MUMBAI_FALLBACK;

  const locationName = loc.displayName;
  const isDefault = locationName === 'Mumbai';

  const title = isDefault
    ? 'Scrap Collection & Recycling Services in Mumbai | Scrapiz'
    : `Scrap Services in ${locationName} | Scrapiz`;

  const description = isDefault
    ? 'Scrapiz offers scrap collection, demolition, dismantling, junk removal, vehicle scrapping, and paper shredding across Mumbai with free pickup.'
    : `Scrapiz offers scrap collection, demolition, junk removal, and more in ${locationName}. Free doorstep pickup and instant payment.`;

  const canonical = isDefault
    ? 'https://www.scrapiz.in/services'
    : `https://www.scrapiz.in/services/${locationSlug}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="bg-white font-sans">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-28 pb-12 text-center bg-gradient-to-br from-green-600 via-green-700 to-teal-700 text-white"
        >
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Scrap Services in {locationName}
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Free doorstep pickup, instant payment, and the best rates — across {locationName}.
            </p>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="py-16 container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CARDS.map((svc, i) => {
              const href = isDefault
                ? `/services/${svc.slug}`
                : `/services/${svc.slug}-${loc.slug}`;

              return (
                <motion.div
                  key={svc.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-md hover:shadow-xl transition group"
                >
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition">
                    <svc.icon className="w-8 h-8 text-green-600 group-hover:text-white transition" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{svc.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">{svc.description}</p>
                  <Link
                    to={href}
                    className="inline-flex items-center justify-center px-6 py-2.5 font-semibold rounded-full bg-green-600 hover:bg-green-700 text-white text-sm transition"
                  >
                    Learn More <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-gray-500 mt-12 text-sm">
            Looking for scrap services in another area?{' '}
            <Link to="/locations" className="text-green-600 font-semibold">
              Find dealers near you →
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
const Services = () => {
  const { slug } = useParams();

  // No slug → show listing for Mumbai
  if (!slug) return <ServicesListing locationSlug={null} />;

  const { serviceSlug, locationSlug } = parseSlug(slug);
  const serviceData = servicesData[serviceSlug];

  // Valid service slug → render service page template
  if (serviceData) {
    const loc = locationSlug ? resolveLocation(locationSlug) : null;
    const locationName = loc?.displayName || (locationSlug ? toTitleCase(locationSlug) : null);

    // Inject location into meta/hero if present
    const data = locationName
      ? {
          ...serviceData,
          serviceName: serviceData.serviceName,
          meta: {
            ...serviceData.meta,
            title: `${serviceData.serviceName} in ${locationName} | Scrapiz`,
            description: `${serviceData.serviceName} in ${locationName}. Free doorstep pickup, instant payment, and best rates with Scrapiz.`,
            canonical: `https://www.scrapiz.in/services/${slug}`,
          },
          hero: {
            ...serviceData.hero,
            heading: `${serviceData.hero.heading.replace('in Mumbai', `in ${locationName}`).replace('Mumbai', locationName)}`,
            subheading: serviceData.hero.subheading,
          },
        }
      : serviceData;

    const handleModal = (name) => {
      window.open(
        `https://wa.me/918828700630?text=Hi, I need help with ${encodeURIComponent(name)}${locationName ? ` in ${locationName}` : ''}`,
        '_blank'
      );
    };

    return <ServicePageTemplate data={data} openModal={handleModal} />;
  }

  // Slug looks like just a location (e.g. /services/bandra) → show listing for that location
  const possibleLocation = resolveLocation(slug);
  if (possibleLocation) return <ServicesListing locationSlug={slug} />;

  // Fallback — unknown slug → Mumbai listing
  return <ServicesListing locationSlug={null} />;
};

export default Services;
