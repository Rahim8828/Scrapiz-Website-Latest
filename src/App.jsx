import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Lazy-loaded pages
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

// Service Pages — single dynamic page
const ServicePage = lazy(() => import('./pages/ServicePage'));

// SEO Dynamic Pages
const ScrapDynamicPage = lazy(() => import('./pages/ScrapDynamicPage'));
const LocationTemplate = lazy(() => import('./pages/LocationPage'));

// ExtraLocationPages (lazy)
const ScrapDealerinAndheri = lazy(() => import('./ExtraLocationPages/ScrapDealerinAndheri'));
const ScrapDealerinAndheriEast = lazy(() => import('./ExtraLocationPages/ScrapDealerinAndheriEast'));
const ScrapDealerinBhandup = lazy(() => import('./ExtraLocationPages/ScrapDealerinBhandup'));
const ScrapDealerinByculla = lazy(() => import('./ExtraLocationPages/ScrapDealerinByculla'));
const ScrapDealerinChembur = lazy(() => import('./ExtraLocationPages/ScrapDealerinChembur'));
const ScrapDealerinColaba = lazy(() => import('./ExtraLocationPages/ScrapDealerinColaba'));
const ScrapDealerinCST = lazy(() => import('./ExtraLocationPages/ScrapDealerinCST'));
const ScrapDealerinDadarEast = lazy(() => import('./ExtraLocationPages/ScrapDealerinDadarEast'));
const ScrapDealerinDadarWest = lazy(() => import('./ExtraLocationPages/ScrapDealerinDadarWest'));
const ScrapDealerinFort = lazy(() => import('./ExtraLocationPages/ScrapDealerinFort'));
const ScrapDealerinGhatkoparEast = lazy(() => import('./ExtraLocationPages/ScrapDealerinGhatkoparEast'));
const ScrapDealerinGhatkoparWest = lazy(() => import('./ExtraLocationPages/ScrapDealerinGhatkoparWest'));
const ScrapDealerinGoregaonEast = lazy(() => import('./ExtraLocationPages/ScrapDealerinGoregaonEast'));
const ScrapDealerinGoregaonWest = lazy(() => import('./ExtraLocationPages/ScrapDealerinGoregaonWest'));
const ScrapDealerinGrantRoad = lazy(() => import('./ExtraLocationPages/ScrapDealerinGrantRoad'));
const ScrapDealerinJogeshwariEast = lazy(() => import('./ExtraLocationPages/ScrapDealerinJogeshwariEast'));
const ScrapDealerinJogeshwariWest = lazy(() => import('./ExtraLocationPages/ScrapDealerinJogeshwariWest'));
const ScrapDealerinKandivaliEast = lazy(() => import('./ExtraLocationPages/ScrapDealerinKandivaliEast'));
const ScrapDealerinKandivaliWest = lazy(() => import('./ExtraLocationPages/ScrapDealerinKandivaliWest'));
const ScrapDealerinKurla = lazy(() => import('./ExtraLocationPages/ScrapDealerinKurla'));
const ScrapDealerinLowerParel = lazy(() => import('./ExtraLocationPages/ScrapDealerinLowerParel'));
const ScrapDealerinMaladEast = lazy(() => import('./ExtraLocationPages/ScrapDealerinMaladEast'));
const ScrapDealerinMaladWest = lazy(() => import('./ExtraLocationPages/ScrapDealerinMaladWest'));
const ScrapDealerinMulund = lazy(() => import('./ExtraLocationPages/ScrapDealerinMulund'));
const ScrapDealerinSion = lazy(() => import('./ExtraLocationPages/ScrapDealerinSion'));
const ScrapDealerinVidyavihar = lazy(() => import('./ExtraLocationPages/ScrapDealerinVidyavihar'));
const ScrapDealerinVikhroli = lazy(() => import('./ExtraLocationPages/ScrapDealerinVikhroli'));
const ScrapDealerinWadala = lazy(() => import('./ExtraLocationPages/ScrapDealerinWadala'));
const ScrapDealerinWorli = lazy(() => import('./ExtraLocationPages/ScrapDealerinWorli'));

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

// Location Pages (lazy — converted from static imports)
const Bandra = lazy(() => import('./pages/Bandra'));
const BandraEast = lazy(() => import('./pages/BandraEast'));
const Dharavi = lazy(() => import('./pages/Dharavi'));
const DharaviKoliwada = lazy(() => import('./pages/DharaviKoliwada'));
const Goregaon = lazy(() => import('./pages/Goregaon'));
const Jogeshwari = lazy(() => import('./pages/Jogeshwari'));
const Kandivali = lazy(() => import('./pages/Kandivali'));
const Mahim = lazy(() => import('./pages/Mahim'));
const Nalasopara = lazy(() => import('./pages/Nalasopara'));

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

          {/* Home */}
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

          {/* Service Routes — single dynamic route */}
          <Route path="/services/:serviceSlug" element={<Layout><ServicePage /></Layout>} />

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

          {/* Your local Location Pages */}
          <Route path="/locations/bandra" element={<Layout><Bandra /></Layout>} />
          <Route path="/locations/bandra-east" element={<Layout><BandraEast /></Layout>} />
          <Route path="/locations/dharavi" element={<Layout><Dharavi /></Layout>} />
          <Route path="/locations/dharavi-koliwada" element={<Layout><DharaviKoliwada /></Layout>} />
          <Route path="/locations/goregaon" element={<Layout><Goregaon /></Layout>} />
          <Route path="/locations/jogeshwari" element={<Layout><Jogeshwari /></Layout>} />
          <Route path="/locations/kandivali" element={<Layout><Kandivali /></Layout>} />
          <Route path="/locations/mahim" element={<Layout><Mahim /></Layout>} />
          <Route path="/locations/nalasopara" element={<Layout><Nalasopara /></Layout>} />

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

          {/* Dynamic Location Route — must be after all specific /locations/* routes */}
          <Route path="/locations/:locationSlug" element={<Layout><LocationTemplate /></Layout>} />

          {/* Dynamic SEO Route — must be second to last */}
          <Route path="/:slug" element={<Layout><ScrapDynamicPage /></Layout>} />

          {/* 404 */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;