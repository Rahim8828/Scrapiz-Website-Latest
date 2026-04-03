import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  ChevronDown, Phone, ArrowRight, CheckCircle, Star,
  ShieldCheck, IndianRupee, Clock, Truck, Recycle,
  Lock, FileCheck2, FileText, Users, Gift, TrendingUp,
  HardHat, Trash2, Wrench,
} from "lucide-react";
import SEOCTASection from "./SEOCTASection";

const ICONS = {
  ShieldCheck, IndianRupee, Clock, Truck, Recycle,
  Lock, FileCheck2, FileText, Users, Gift, TrendingUp,
  HardHat, Trash2, Wrench, Star, CheckCircle,
};

const Icon = ({ name, className }) => {
  const C = ICONS[name];
  return C ? <C className={className} /> : null;
};

const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full flex justify-between items-center text-left px-6 py-5 font-semibold text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="flex-1 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-green-600 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 pt-4 text-gray-600 leading-relaxed border-t border-gray-100">{answer}</p>
      </motion.div>
    </div>
  );
};

// Accepts a single `data` prop (from src/data/services/*.js) + openModal fn
const ServicePageTemplate = ({ data, openModal }) => {
  const { meta, hero, stats, about, steps, benefits, testimonials, faqs, serviceName } = data;

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        {meta.keywords && <meta name="keywords" content={meta.keywords} />}
        <link rel="canonical" href={meta.canonical} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* HERO */}
      <section className="relative text-white pt-24 pb-12 md:pt-28 md:pb-20 bg-gradient-to-br from-green-600 via-green-700 to-teal-700">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">Trusted by 10,000+ Customers in Mumbai</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2 leading-tight">
              {hero.heading}
            </h1>
            {hero.subheading && (
              <p className="text-green-300 font-bold text-xl sm:text-2xl mb-5">{hero.subheading}</p>
            )}
            <p className="text-sm sm:text-base max-w-2xl mx-auto mb-6 text-green-50 leading-relaxed">
              {hero.description}
            </p>
            {hero.badges?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-7">
                {hero.badges.map((b, i) => (
                  <span key={i} className="flex items-center bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm">
                    <Icon name={b.icon} className="w-4 h-4 mr-1.5 text-green-300" />
                    {b.text}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => openModal(serviceName)}
                className="bg-white text-green-700 font-bold py-3 px-8 rounded-full shadow-xl hover:bg-green-50 transition-all text-base inline-flex items-center justify-center"
              >
                {hero.ctaLabel || "Get a Free Quote"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <a
                href="tel:+918828700630"
                className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-green-700 transition-all text-base inline-flex items-center justify-center"
              >
                <Phone className="w-4 h-4 mr-2" /> +91 8828700630
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      {stats?.length > 0 && (
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {stats.map((s, i) => (
                <div key={i} className="p-2">
                  <div className="text-2xl md:text-3xl font-bold text-green-600">{s.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{about.heading}</h2>
            {about.body.map((p, i) => (
              <p key={i} className="text-gray-600 mb-4 leading-relaxed">{p}</p>
            ))}
            {about.highlight && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg mt-2">
                <h4 className="font-bold">{about.highlight.title}</h4>
                <p className="text-sm">{about.highlight.text}</p>
              </div>
            )}
          </motion.div>
          {about.items?.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              {about.itemsHeading && <h3 className="text-2xl font-semibold text-gray-800 mb-5">{about.itemsHeading}</h3>}
              <ul className="space-y-3">
                {about.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </section>

      {/* STEPS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{steps.heading}</h2>
            {steps.subheading && <p className="text-gray-500 max-w-2xl mx-auto">{steps.subheading}</p>}
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.items.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center border border-gray-200 rounded-2xl p-6"
              >
                <div className="bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl font-bold shadow-md">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      {benefits?.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Why Choose Scrapiz?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{b}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {testimonials?.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-white p-8 rounded-2xl border border-gray-200"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-gray-600 italic leading-relaxed mb-4">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-gray-800">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs?.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Frequently Asked Questions</h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <SEOCTASection />
    </div>
  );
};

export default ServicePageTemplate;
