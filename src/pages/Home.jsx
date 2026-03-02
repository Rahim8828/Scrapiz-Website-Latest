import Navbar from '../components/Header';
import Hero from '../components/HeroSection';
import SnapSection from '../components/SnapSection';
import WhyUS from '../components/WhyChooseSection';
import Services from '../components/ServicesSection';
import HowItWorks from '../components/HowItWorks';
import FAQs from '../components/FAQSection';
import Testimonials from '../components/TestimonialsSection';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SnapSection />
      <Services />
      <HowItWorks />
      <WhyUS/>
      <Testimonials />
      <FAQs />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
