import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Locations from './pages/Locations';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import RequestAccountDeletion from './pages/RequestAccountDeletion';

// Service Pages
import ScrapCollectionPage from './pages/ScrapCollectionPage';
import DemolitionServicePage from './pages/DemolitionServicePage';
import DismantlingPage from './pages/DismantlingPage';
import PaperShreddingPage from './pages/PaperShreddingPage';
import SocietyTieUpPage from './pages/SocietyTieUpPage';
import JunkRemovalServicePage from './pages/JunkRemovalServicePage';
import VehicleScrappingPage from './pages/VehicleScrappingPage';

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
        
        {/* Location Routes */}
        <Route path="/locations/bandra" element={<Bandra />} />
        <Route path="/locations/bandra-east" element={<BandraEast />} />
        <Route path="/locations/dharavi" element={<Dharavi />} />
        <Route path="/locations/dharavi-koliwada" element={<DharaviKoliwada />} />
        <Route path="/locations/goregaon" element={<Goregaon />} />
        <Route path="/locations/jogeshwari" element={<Jogeshwari />} />
        <Route path="/locations/kandivali" element={<Kandivali />} />
        <Route path="/locations/mahim" element={<Mahim />} />
        <Route path="/locations/nalasopara" element={<Nalasopara />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
