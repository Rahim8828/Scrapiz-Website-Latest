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

// SEO Dynamic Pages
const ScrapDynamicPage = lazy(() => import('./pages/ScrapDynamicPage'));
const LocationTemplate = lazy(() => import('./pages/LocationPage'));

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
    </Router>
  );
}

export default App;