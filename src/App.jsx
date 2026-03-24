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

// Service Pages
const ScrapCollectionPage = lazy(() => import('./pages/ScrapCollectionPage'));
const DemolitionServicePage = lazy(() => import('./pages/DemolitionServicePage'));
const DismantlingPage = lazy(() => import('./pages/DismantlingPage'));
const PaperShreddingPage = lazy(() => import('./pages/PaperShreddingPage'));
const SocietyTieUpPage = lazy(() => import('./pages/SocietyTieUpPage'));
const JunkRemovalServicePage = lazy(() => import('./pages/JunkRemovalServicePage'));
const VehicleScrappingPage = lazy(() => import('./pages/VehicleScrappingPage'));

<<<<<<< HEAD
// SEO Dynamic Pages
const ScrapDynamicPage = lazy(() => import('./pages/ScrapDynamicPage'));
const LocationTemplate = lazy(() => import('./pages/LocationPage'));
=======
>>>>>>> b62106b (Resolved merge conflict: merged SEO dynamic routing with main layout system)

const fallback = (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
<<<<<<< HEAD
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

          {/* Dynamic Location Route */}
          <Route path="/locations/:locationSlug" element={<Layout><LocationTemplate /></Layout>} />

          {/* Dynamic SEO Route (VERY IMPORTANT: keep near bottom) */}
          <Route path="/:slug" element={<Layout><ScrapDynamicPage /></Layout>} />

          {/* 404 */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />

        </Routes>
      </Suspense>
=======
      <Routes>
        {/* Static Routes FIRST */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/request-account-deletion" element={<RequestAccountDeletion />} />
        
        {/* Service Routes */}
        <Route path="/services/scrap-collection" element={<ScrapCollectionPage />} />
        <Route path="/services/demolition" element={<DemolitionServicePage />} />
        <Route path="/services/demolition-service" element={<DemolitionServicePage />} />
        <Route path="/services/dismantling" element={<DismantlingPage />} />
        <Route path="/services/paper-shredding" element={<PaperShreddingPage />} />
        <Route path="/services/society-tie-up" element={<SocietyTieUpPage />} />
        <Route path="/services/junk-removal" element={<JunkRemovalServicePage />} />
        <Route path="/services/vehicle-scrapping" element={<VehicleScrappingPage />} />
        
        {/* Dynamic Routes */}
        <Route path="/locations/:locationSlug" element={<LocationTemplate />} />
        <Route path="/:slug" element={<ScrapDynamicPage />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
>>>>>>> b62106b (Resolved merge conflict: merged SEO dynamic routing with main layout system)
    </Router>
  );
}

export default App;