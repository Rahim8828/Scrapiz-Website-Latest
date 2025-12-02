import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import { Toaster } from './components/ui/toaster';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import PerformanceMonitor from './components/PerformanceMonitor';
import { preconnect, dnsPrefetch } from './utils/thirdPartyScripts';

// Lazy load all pages for better code splitting
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Locations = lazy(() => import('./pages/Locations'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const RequestAccountDeletion = lazy(() => import('./pages/RequestAccountDeletion'));
const Bandra = lazy(() => import('./pages/Bandra'));
const Jogeshwari = lazy(() => import('./pages/Jogeshwari'));
const Kandivali = lazy(() => import('./pages/Kandivali'));
const Mahim = lazy(() => import('./pages/Mahim'));
const BandraEast = lazy(() => import('./pages/BandraEast'));
const Dharavi = lazy(() => import('./pages/Dharavi'));
const Nalasopara = lazy(() => import('./pages/Nalasopara'));
const DharaviKoliwada = lazy(() => import('./pages/DharaviKoliwada'));
const Goregaon = lazy(() => import('./pages/Goregaon'));
const AndheriWest = lazy(() => import('./Extra Location pages /ScrapDealerinAndheri'));
const AndheriEast = lazy(() => import('./Extra Location pages /ScrapDealerinAndheriEast'));
const JogeshwariWest = lazy(() => import('./Extra Location pages /ScrapDealerinJogeshwariWest'));
const JogeshwariEast = lazy(() => import('./Extra Location pages /ScrapDealerinJogeshwariEast'));
const GoregaonEast = lazy(() => import('./Extra Location pages /ScrapDealerinGoregaonEast'));
const GoregaonWest = lazy(() => import('./Extra Location pages /ScrapDealerinGoregaonWest'));
const MaladEast = lazy(() => import('./Extra Location pages /ScrapDealerinMaladEast'));
const MaladWest = lazy(() => import('./Extra Location pages /ScrapDealerinMaladWest'));
const KandivaliEast = lazy(() => import('./Extra Location pages /ScrapDealerinKandivaliEast'));
const KandivaliWest = lazy(() => import('./Extra Location pages /ScrapDealerinKandivaliWest'));
const Sion = lazy(() => import('./Extra Location pages /ScrapDealerinSion'));
const Kurla = lazy(() => import('./Extra Location pages /ScrapDealerinKurla'));
const Chembur = lazy(() => import('./Extra Location pages /ScrapDealerinChembur'));
const GhatkoparEast = lazy(() => import('./Extra Location pages /ScrapDealerinGhatkoparEast'));
const GhatkoparWest = lazy(() => import('./Extra Location pages /ScrapDealerinGhatkoparWest'));
const Vidyavihar = lazy(() => import('./Extra Location pages /ScrapDealerinVidyavihar'));
const Mulund = lazy(() => import('./Extra Location pages /ScrapDealerinMulund'));
const Bhandup = lazy(() => import('./Extra Location pages /ScrapDealerinBhandup'));
const Vikhroli = lazy(() => import('./Extra Location pages /ScrapDealerinVikhroli'));
const Wadala = lazy(() => import('./Extra Location pages /ScrapDealerinWadala'));
const LowerParel = lazy(() => import('./Extra Location pages /ScrapDealerinLowerParel'));
const Worli = lazy(() => import('./Extra Location pages /ScrapDealerinWorli'));
const Byculla = lazy(() => import('./Extra Location pages /ScrapDealerinByculla'));
const GrantRoad = lazy(() => import('./Extra Location pages /ScrapDealerinGrantRoad'));
const CST = lazy(() => import('./Extra Location pages /ScrapDealerinCST'));
const Colaba = lazy(() => import('./Extra Location pages /ScrapDealerinColaba'));
const Fort = lazy(() => import('./Extra Location pages /ScrapDealerinFort'));
const DadarEast = lazy(() => import('./Extra Location pages /ScrapDealerinDadarEast'));
const DadarWest = lazy(() => import('./Extra Location pages /ScrapDealerinDadarWest'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ScrapCollectionPage = lazy(() => import('./pages/ScrapCollectionPage'));
const DemolitionServicePage = lazy(() => import('./pages/DemolitionServicePage'));
const DismantlingPage = lazy(() => import('./pages/DismantlingPage'));
const PaperShreddingPage = lazy(() => import('./pages/PaperShreddingPage'));
const SocietyTieUpPage = lazy(() => import('./pages/SocietyTieUpPage'));
const JunkRemovalServicePage = lazy(() => import('./pages/JunkRemovalServicePage'));
const VehicleScrappingPage = lazy(() => import('./pages/VehicleScrappingPage'));
// Scrap Category Pages
const AluminiumScrapPage = lazy(() => import('./Scrap Category Pages/AluminiumScrapPage'));
const CopperScrapPage = lazy(() => import('./Scrap Category Pages/CopperScrapPage'));
const BrassScrapPage = lazy(() => import('./Scrap Category Pages/BrassScrapPage'));
const IronSteelScrapPage = lazy(() => import('./Scrap Category Pages/Iron&SteelScrapPage'));
const StainlessSteelScrapPage = lazy(() => import('./Scrap Category Pages/StainlessSteelScrappage'));
const EWastePage = lazy(() => import('./Scrap Category Pages/E-wasteScrapPage'));
const ACScrapPage = lazy(() => import('./Scrap Category Pages/ACScrapPage'));
const RefrigeratorScrapPage = lazy(() => import('./Scrap Category Pages/RefrigiratorScrapPage'));
const WashingMachineScrapPage = lazy(() => import('./Scrap Category Pages/WashingmachineScrapPage'));
const MicrowaveScrapPage = lazy(() => import('./Scrap Category Pages/MicrowaveScrapPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);

    // GA4 Page View Tracking
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'pageview',
      page: pathname,
    });
    
  }, [pathname]);
  return null;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialService, setInitialService] = useState('');

  // Preconnect to third-party domains for better performance
  useEffect(() => {
    // Preconnect to WhatsApp API domain
    preconnect('https://wa.me');
    dnsPrefetch('https://wa.me');
    
    // Already preconnected in HTML: GTM and Google Fonts
  }, []);

  const openModal = (service = '') => {
    setInitialService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInitialService('');
  };

  // Wrapper to pass props to route elements
  const renderWithProps = (element, props) => {
    return React.cloneElement(element, props);
  };

  return (
    <Router>
      <ScrollToTop />
      <PerformanceMonitor />
      <div className="min-h-screen flex flex-col bg-white">
        <Header openModal={openModal} />
        <main className="flex-grow">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={renderWithProps(<Home />, { openModal })} />
              <Route path="/services" element={renderWithProps(<Services />, { openModal })} />
              <Route path="/about" element={renderWithProps(<About />, { openModal })} />
              <Route path="/contact" element={renderWithProps(<Contact />, { openModal })} />
              <Route path="/locations" element={renderWithProps(<Locations />, { openModal })} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/request-account-deletion" element={<RequestAccountDeletion />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/bandra" element={renderWithProps(<Bandra />, { openModal })} />
              <Route path="/jogeshwari" element={renderWithProps(<Jogeshwari />, { openModal })} />
              <Route path="/kandivali" element={renderWithProps(<Kandivali />, { openModal })} />
              <Route path="/mahim" element={renderWithProps(<Mahim />, { openModal })} />
              <Route path="/bandra-east" element={renderWithProps(<BandraEast />, { openModal })} />
              <Route path="/dharavi" element={renderWithProps(<Dharavi />, { openModal })} />
              <Route path="/nalasopara" element={renderWithProps(<Nalasopara />, { openModal })} />
              <Route path="/dharavi-koliwada" element={renderWithProps(<DharaviKoliwada />, { openModal })} />
              <Route path="/goregaon" element={renderWithProps(<Goregaon />, { openModal })} />
              <Route path="/scrap-dealer-in-andheri" element={renderWithProps(<AndheriWest />, { openModal })} />
              <Route path="/scrap-dealer-in-andheri-east" element={renderWithProps(<AndheriEast />, { openModal })} />
              <Route path="/scrap-dealer-in-jogeshwari-west" element={renderWithProps(<JogeshwariWest />, { openModal })} />
              <Route path="/scrap-dealer-in-jogeshwari-east" element={renderWithProps(<JogeshwariEast />, { openModal })} />
              <Route path="/scrap-dealer-in-goregaon-east" element={renderWithProps(<GoregaonEast />, { openModal })} />
              <Route path="/scrap-dealer-in-goregaon-west" element={renderWithProps(<GoregaonWest />, { openModal })} />
              <Route path="/scrap-dealer-in-malad-east" element={renderWithProps(<MaladEast />, { openModal })} />
              <Route path="/scrap-dealer-in-malad-west" element={renderWithProps(<MaladWest />, { openModal })} />
              <Route path="/scrap-dealer-in-kandivali-east" element={renderWithProps(<KandivaliEast />, { openModal })} />
              <Route path="/scrap-dealer-in-kandivali-west" element={renderWithProps(<KandivaliWest />, { openModal })} />
              <Route path="/scrap-dealer-in-sion" element={renderWithProps(<Sion />, { openModal })} />
              <Route path="/scrap-dealer-in-kurla" element={renderWithProps(<Kurla />, { openModal })} />
              <Route path="/scrap-dealer-in-chembur" element={renderWithProps(<Chembur />, { openModal })} />
              <Route path="/scrap-dealer-in-ghatkopar-east" element={renderWithProps(<GhatkoparEast />, { openModal })} />
              <Route path="/scrap-dealer-in-ghatkopar-west" element={renderWithProps(<GhatkoparWest />, { openModal })} />
              <Route path="/scrap-dealer-in-vidyavihar" element={renderWithProps(<Vidyavihar />, { openModal })} />
              <Route path="/scrap-dealer-in-mulund" element={renderWithProps(<Mulund />, { openModal })} />
              <Route path="/scrap-dealer-in-bhandup" element={renderWithProps(<Bhandup />, { openModal })} />
              <Route path="/scrap-dealer-in-vikhroli" element={renderWithProps(<Vikhroli />, { openModal })} />
              <Route path="/scrap-dealer-in-wadala" element={renderWithProps(<Wadala />, { openModal })} />
              <Route path="/scrap-dealer-in-lower-parel" element={renderWithProps(<LowerParel />, { openModal })} />
              <Route path="/scrap-dealer-in-worli" element={renderWithProps(<Worli />, { openModal })} />
              <Route path="/scrap-dealer-in-byculla" element={renderWithProps(<Byculla />, { openModal })} />
              <Route path="/scrap-dealer-in-grant-road" element={renderWithProps(<GrantRoad />, { openModal })} />
              <Route path="/scrap-dealer-in-cst" element={renderWithProps(<CST />, { openModal })} />
              <Route path="/scrap-dealer-in-colaba" element={renderWithProps(<Colaba />, { openModal })} />
              <Route path="/scrap-dealer-in-fort" element={renderWithProps(<Fort />, { openModal })} />
              <Route path="/scrap-dealer-in-dadar-east" element={renderWithProps(<DadarEast />, { openModal })} />
              <Route path="/scrap-dealer-in-dadar-west" element={renderWithProps(<DadarWest />, { openModal })} />
              <Route path="/blog" element={renderWithProps(<Blog />, { openModal })} />
              <Route path="/blog/:slug" element={renderWithProps(<BlogPost />, { openModal })} />
              <Route path="/services/scrap-collection" element={renderWithProps(<ScrapCollectionPage />, { openModal })} />
              <Route path="/services/demolition-service" element={renderWithProps(<DemolitionServicePage />, { openModal })} />
              <Route path="/services/dismantling" element={renderWithProps(<DismantlingPage />, { openModal })} />
              <Route path="/services/paper-shredding" element={renderWithProps(<PaperShreddingPage />, { openModal })} />
              <Route path="/services/society-tie-up" element={renderWithProps(<SocietyTieUpPage />, { openModal })} />
              <Route path="/services/junk-removal-service" element={renderWithProps(<JunkRemovalServicePage />, { openModal })} />
              <Route path="/services/vehicle-scrapping" element={renderWithProps(<VehicleScrappingPage />, { openModal })} />
              <Route path="/sell-aluminium-scrap-mumbai" element={renderWithProps(<AluminiumScrapPage />, { openModal })} />
              <Route path="/sell-copper-scrap-mumbai" element={renderWithProps(<CopperScrapPage />, { openModal })} />
              <Route path="/sell-brass-scrap-mumbai" element={renderWithProps(<BrassScrapPage />, { openModal })} />
              <Route path="/sell-iron-steel-scrap-mumbai" element={renderWithProps(<IronSteelScrapPage />, { openModal })} />
              <Route path="/sell-stainless-steel-scrap-mumbai" element={renderWithProps(<StainlessSteelScrapPage />, { openModal })} />
              <Route path="/sell-e-waste-mumbai" element={renderWithProps(<EWastePage />, { openModal })} />
              <Route path="/sell-ac-scrap-mumbai" element={renderWithProps(<ACScrapPage />, { openModal })} />
              <Route path="/sell-refrigerator-scrap-mumbai" element={renderWithProps(<RefrigeratorScrapPage />, { openModal })} />
              <Route path="/sell-washing-machine-scrap-mumbai" element={renderWithProps(<WashingMachineScrapPage />, { openModal })} />
              <Route path="/sell-microwave-scrap-mumbai" element={renderWithProps(<MicrowaveScrapPage />, { openModal })} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <BookingModal isOpen={isModalOpen} onClose={closeModal} initialService={initialService} />
        <Toaster />
        <FloatingWhatsApp />
      </div>
    </Router>
  );
}

export default App;
