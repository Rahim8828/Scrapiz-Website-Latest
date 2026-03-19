import { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Header';
import Hero from '../components/HeroSection';

// Lazy-load below-the-fold sections to reduce initial JS payload
const SnapSection = lazy(() => import('../components/SnapSection'));
const WhyUS = lazy(() => import('../components/WhyChooseSection'));
const Services = lazy(() => import('../components/ServicesSection'));
const HowItWorks = lazy(() => import('../components/HowItWorks'));
const FAQs = lazy(() => import('../components/FAQSection'));
const Testimonials = lazy(() => import('../components/TestimonialsSection'));
const Contact = lazy(() => import('../components/Contact'));
const Footer = lazy(() => import('../components/Footer'));

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Scrapiz - Mumbai's Smart Scrap Pickup & Recycling Platform | Sell Scrap Online</title>
        <meta
          name="description"
          content="Scrapiz is Mumbai's smart scrap pickup and recycling platform. Sell scrap online and book instant doorstep collection for metals, paper, plastic, e-waste & more. Get best prices today!"
        />
        <link rel="canonical" href="https://www.scrapiz.in/" />
        <meta
          property="og:title"
          content="Scrapiz - Mumbai's Smart Scrap Pickup & Recycling Platform | Sell Scrap Online"
        />
        <meta
          property="og:description"
          content="Scrapiz is Mumbai's smart scrap pickup and recycling platform. Sell scrap online in Mumbai with instant doorstep collection. Get best prices for metal, paper, plastic, e-waste & more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.scrapiz.in/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Scrapiz - Mumbai's Smart Scrap Pickup & Recycling Platform | Sell Scrap Online"
        />
        <meta
          name="twitter:description"
          content="Scrapiz is Mumbai's smart scrap pickup and recycling platform. Sell scrap online in Mumbai with instant doorstep collection. Get best prices for metal, paper, plastic, e-waste & more."
        />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Scrapiz",
          "url": "https://www.scrapiz.in",
          "description": "Mumbai's smart scrap pickup and recycling platform. Sell scrap online with instant doorstep pickup across Mumbai.",
          "areaServed": "Mumbai, Maharashtra, India",
          "serviceType": ["Scrap Collection", "Recycling", "Doorstep Pickup"]
        })}</script>
      </Helmet>
      <div className="min-h-screen">
      
        <Navbar />
        <Hero />
        <Suspense fallback={<div className="min-h-[200px]" />}>
          <SnapSection />
          <Services />
          <HowItWorks />
          <WhyUS/>
          <Testimonials />
          <FAQs />
          <Contact />
          <Footer />
        </Suspense>
      </div>
    </>
  );
};

export default Home;
