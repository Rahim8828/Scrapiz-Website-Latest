import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Lazy-load all non-home pages to reduce initial bundle size
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Locations = lazy(() => import('./pages/Locations'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const RequestAccountDeletion = lazy(() => import('./pages/RequestAccountDeletion'));

// Service Pages (lazy)
const ScrapCollectionPage = lazy(() => import('./pages/ScrapCollectionPage'));
const DemolitionServicePage = lazy(() => import('./pages/DemolitionServicePage'));
const DismantlingPage = lazy(() => import('./pages/DismantlingPage'));
const PaperShreddingPage = lazy(() => import('./pages/PaperShreddingPage'));
const SocietyTieUpPage = lazy(() => import('./pages/SocietyTieUpPage'));
const JunkRemovalServicePage = lazy(() => import('./pages/JunkRemovalServicePage'));
const VehicleScrappingPage = lazy(() => import('./pages/VehicleScrappingPage'));

// Location Pages (lazy)
const Bandra = lazy(() => import('./pages/Bandra'));
const BandraEast = lazy(() => import('./pages/BandraEast'));
const Dharavi = lazy(() => import('./pages/Dharavi'));
const DharaviKoliwada = lazy(() => import('./pages/DharaviKoliwada'));
const Goregaon = lazy(() => import('./pages/Goregaon'));
const Jogeshwari = lazy(() => import('./pages/Jogeshwari'));
const Kandivali = lazy(() => import('./pages/Kandivali'));
const Mahim = lazy(() => import('./pages/Mahim'));
const Nalasopara = lazy(() => import('./pages/Nalasopara'));

// Extra Location Pages (lazy)
const ScrapDealerinAndheri = lazy(() => import('./Extra Location pages /ScrapDealerinAndheri'));
const ScrapDealerinAndheriEast = lazy(() => import('./Extra Location pages /ScrapDealerinAndheriEast'));
const ScrapDealerinBhandup = lazy(() => import('./Extra Location pages /ScrapDealerinBhandup'));
const ScrapDealerinByculla = lazy(() => import('./Extra Location pages /ScrapDealerinByculla'));
const ScrapDealerinChembur = lazy(() => import('./Extra Location pages /ScrapDealerinChembur'));
const ScrapDealerinColaba = lazy(() => import('./Extra Location pages /ScrapDealerinColaba'));
const ScrapDealerinCST = lazy(() => import('./Extra Location pages /ScrapDealerinCST'));
const ScrapDealerinDadarEast = lazy(() => import('./Extra Location pages /ScrapDealerinDadarEast'));
const ScrapDealerinDadarWest = lazy(() => import('./Extra Location pages /ScrapDealerinDadarWest'));
const ScrapDealerinFort = lazy(() => import('./Extra Location pages /ScrapDealerinFort'));
const ScrapDealerinGhatkoparEast = lazy(() => import('./Extra Location pages /ScrapDealerinGhatkoparEast'));
const ScrapDealerinGhatkoparWest = lazy(() => import('./Extra Location pages /ScrapDealerinGhatkoparWest'));
const ScrapDealerinGoregaonEast = lazy(() => import('./Extra Location pages /ScrapDealerinGoregaonEast'));
const ScrapDealerinGoregaonWest = lazy(() => import('./Extra Location pages /ScrapDealerinGoregaonWest'));
const ScrapDealerinGrantRoad = lazy(() => import('./Extra Location pages /ScrapDealerinGrantRoad'));
const ScrapDealerinJogeshwariEast = lazy(() => import('./Extra Location pages /ScrapDealerinJogeshwariEast'));
const ScrapDealerinJogeshwariWest = lazy(() => import('./Extra Location pages /ScrapDealerinJogeshwariWest'));
const ScrapDealerinKandivaliEast = lazy(() => import('./Extra Location pages /ScrapDealerinKandivaliEast'));
const ScrapDealerinKandivaliWest = lazy(() => import('./Extra Location pages /ScrapDealerinKandivaliWest'));
const ScrapDealerinKurla = lazy(() => import('./Extra Location pages /ScrapDealerinKurla'));
const ScrapDealerinLowerParel = lazy(() => import('./Extra Location pages /ScrapDealerinLowerParel'));
const ScrapDealerinMaladEast = lazy(() => import('./Extra Location pages /ScrapDealerinMaladEast'));
const ScrapDealerinMaladWest = lazy(() => import('./Extra Location pages /ScrapDealerinMaladWest'));
const ScrapDealerinMulund = lazy(() => import('./Extra Location pages /ScrapDealerinMulund'));
const ScrapDealerinSion = lazy(() => import('./Extra Location pages /ScrapDealerinSion'));
const ScrapDealerinVidyavihar = lazy(() => import('./Extra Location pages /ScrapDealerinVidyavihar'));
const ScrapDealerinVikhroli = lazy(() => import('./Extra Location pages /ScrapDealerinVikhroli'));
const ScrapDealerinWadala = lazy(() => import('./Extra Location pages /ScrapDealerinWadala'));
const ScrapDealerinWorli = lazy(() => import('./Extra Location pages /ScrapDealerinWorli'));

// Scrap Category Pages (lazy)
const ACScrapPage = lazy(() => import('./Scrap Category Pages/ACScrapPage'));
const AluminiumScrapPage = lazy(() => import('./Scrap Category Pages/AluminiumScrapPage'));
const BrassScrapPage = lazy(() => import('./Scrap Category Pages/BrassScrapPage'));
const CopperScrapPage = lazy(() => import('./Scrap Category Pages/CopperScrapPage'));
const EwasteScrapPage = lazy(() => import('./Scrap Category Pages/E-wasteScrapPage'));
const IronSteelScrapPage = lazy(() => import('./Scrap Category Pages/Iron&SteelScrapPage'));
const MicrowaveScrapPage = lazy(() => import('./Scrap Category Pages/MicrowaveScrapPage'));
const RefrigeratorScrapPage = lazy(() => import('./Scrap Category Pages/RefrigiratorScrapPage'));
const StainlessSteelScrapPage = lazy(() => import('./Scrap Category Pages/StainlessSteelScrapPage'));
const WashingMachineScrapPage = lazy(() => import('./Scrap Category Pages/WashingmachineScrapPage'));

const fallback = (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={fallback}>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Standard Pages */}
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          <Route path="/locations" element={<Layout><Locations /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/terms-and-conditions" element={<Layout><TermsAndConditions /></Layout>} />
          <Route path="/request-account-deletion" element={<Layout><RequestAccountDeletion /></Layout>} />

          {/* Service Routes */}
          <Route path="/services/scrap-collection" element={<Layout><ScrapCollectionPage /></Layout>} />
          <Route path="/services/demolition" element={<Layout><DemolitionServicePage /></Layout>} />
          <Route path="/services/demolition-service" element={<Layout><DemolitionServicePage /></Layout>} />
          <Route path="/services/dismantling" element={<Layout><DismantlingPage /></Layout>} />
          <Route path="/services/paper-shredding" element={<Layout><PaperShreddingPage /></Layout>} />
          <Route path="/services/society-tie-up" element={<Layout><SocietyTieUpPage /></Layout>} />
          <Route path="/services/junk-removal" element={<Layout><JunkRemovalServicePage /></Layout>} />
          <Route path="/services/junk-removal-service" element={<Layout><JunkRemovalServicePage /></Layout>} />
          <Route path="/services/vehicle-scrapping" element={<Layout><VehicleScrappingPage /></Layout>} />

          {/* Location Routes */}
          <Route path="/locations/bandra" element={<Layout><Bandra /></Layout>} />
          <Route path="/locations/bandra-east" element={<Layout><BandraEast /></Layout>} />
          <Route path="/locations/dharavi" element={<Layout><Dharavi /></Layout>} />
          <Route path="/locations/dharavi-koliwada" element={<Layout><DharaviKoliwada /></Layout>} />
          <Route path="/locations/goregaon" element={<Layout><Goregaon /></Layout>} />
          <Route path="/locations/jogeshwari" element={<Layout><Jogeshwari /></Layout>} />
          <Route path="/locations/kandivali" element={<Layout><Kandivali /></Layout>} />
          <Route path="/locations/mahim" element={<Layout><Mahim /></Layout>} />
          <Route path="/locations/nalasopara" element={<Layout><Nalasopara /></Layout>} />

          {/* Extra Location Routes */}
          <Route path="/locations/andheri" element={<Layout><ScrapDealerinAndheri /></Layout>} />
          <Route path="/locations/andheri-east" element={<Layout><ScrapDealerinAndheriEast /></Layout>} />
          <Route path="/locations/bhandup" element={<Layout><ScrapDealerinBhandup /></Layout>} />
          <Route path="/locations/byculla" element={<Layout><ScrapDealerinByculla /></Layout>} />
          <Route path="/locations/chembur" element={<Layout><ScrapDealerinChembur /></Layout>} />
          <Route path="/locations/colaba" element={<Layout><ScrapDealerinColaba /></Layout>} />
          <Route path="/locations/cst" element={<Layout><ScrapDealerinCST /></Layout>} />
          <Route path="/locations/dadar-east" element={<Layout><ScrapDealerinDadarEast /></Layout>} />
          <Route path="/locations/dadar-west" element={<Layout><ScrapDealerinDadarWest /></Layout>} />
          <Route path="/locations/fort" element={<Layout><ScrapDealerinFort /></Layout>} />
          <Route path="/locations/ghatkopar-east" element={<Layout><ScrapDealerinGhatkoparEast /></Layout>} />
          <Route path="/locations/ghatkopar-west" element={<Layout><ScrapDealerinGhatkoparWest /></Layout>} />
          <Route path="/locations/goregaon-east" element={<Layout><ScrapDealerinGoregaonEast /></Layout>} />
          <Route path="/locations/goregaon-west" element={<Layout><ScrapDealerinGoregaonWest /></Layout>} />
          <Route path="/locations/grant-road" element={<Layout><ScrapDealerinGrantRoad /></Layout>} />
          <Route path="/locations/jogeshwari-east" element={<Layout><ScrapDealerinJogeshwariEast /></Layout>} />
          <Route path="/locations/jogeshwari-west" element={<Layout><ScrapDealerinJogeshwariWest /></Layout>} />
          <Route path="/locations/kandivali-east" element={<Layout><ScrapDealerinKandivaliEast /></Layout>} />
          <Route path="/locations/kandivali-west" element={<Layout><ScrapDealerinKandivaliWest /></Layout>} />
          <Route path="/locations/kurla" element={<Layout><ScrapDealerinKurla /></Layout>} />
          <Route path="/locations/lower-parel" element={<Layout><ScrapDealerinLowerParel /></Layout>} />
          <Route path="/locations/malad-east" element={<Layout><ScrapDealerinMaladEast /></Layout>} />
          <Route path="/locations/malad-west" element={<Layout><ScrapDealerinMaladWest /></Layout>} />
          <Route path="/locations/mulund" element={<Layout><ScrapDealerinMulund /></Layout>} />
          <Route path="/locations/sion" element={<Layout><ScrapDealerinSion /></Layout>} />
          <Route path="/locations/vidyavihar" element={<Layout><ScrapDealerinVidyavihar /></Layout>} />
          <Route path="/locations/vikhroli" element={<Layout><ScrapDealerinVikhroli /></Layout>} />
          <Route path="/locations/wadala" element={<Layout><ScrapDealerinWadala /></Layout>} />
          <Route path="/locations/worli" element={<Layout><ScrapDealerinWorli /></Layout>} />

          {/* Scrap Category Routes */}
          <Route path="/sell-ac-scrap-mumbai" element={<Layout><ACScrapPage /></Layout>} />
          <Route path="/sell-aluminium-scrap-mumbai" element={<Layout><AluminiumScrapPage /></Layout>} />
          <Route path="/sell-brass-scrap-mumbai" element={<Layout><BrassScrapPage /></Layout>} />
          <Route path="/sell-copper-scrap-mumbai" element={<Layout><CopperScrapPage /></Layout>} />
          <Route path="/sell-e-waste-mumbai" element={<Layout><EwasteScrapPage /></Layout>} />
          <Route path="/sell-iron-steel-scrap-mumbai" element={<Layout><IronSteelScrapPage /></Layout>} />
          <Route path="/sell-microwave-scrap-mumbai" element={<Layout><MicrowaveScrapPage /></Layout>} />
          <Route path="/sell-refrigerator-scrap-mumbai" element={<Layout><RefrigeratorScrapPage /></Layout>} />
          <Route path="/sell-stainless-steel-scrap-mumbai" element={<Layout><StainlessSteelScrapPage /></Layout>} />
          <Route path="/sell-washing-machine-scrap-mumbai" element={<Layout><WashingMachineScrapPage /></Layout>} />

          {/* 404 Route */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

