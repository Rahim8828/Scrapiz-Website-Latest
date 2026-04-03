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


// Location Pages
import Bandra from './pages/Bandra';
import BandraEast from './pages/BandraEast';
import Dharavi from './pages/Dharavi';
import DharaviKoliwada from './pages/DharaviKoliwada';
import Goregaon from './pages/Goregaon';
import Jogeshwari from './pages/Jogeshwari';
import Kandivali from './pages/Kandivali';
import Mahim from './pages/Mahim';
import Nalasopara from './pages/Nalasopara';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;