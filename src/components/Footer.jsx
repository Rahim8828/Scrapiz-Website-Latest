import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <footer className="footer-main">
      <div className="footer-container">
        {/* ===== TOP GRID ===== */}
        <div className="footer-grid">

          {/* COL 1 — Brand + Contact Info */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <span className="footer-logo-text">Scrapiz</span>
            </div>

            <p className="footer-tagline">
              Mumbai's leading online scrap selling platform. We make recycling easy, profitable, and environmentally responsible.
            </p>

            <div className="footer-contact-info">
              <a href="tel:+918828284129" className="footer-contact-item">
                <Phone className="footer-contact-icon" size={16} />
                <span>+91 8828700630</span>
              </a>
              <a href="mailto:support@scrapiz.in" className="footer-contact-item">
                <Mail className="footer-contact-icon" size={16} />
                <span>support@scrapiz.in</span>
              </a>
              <div className="footer-contact-item footer-address">
                <MapPin className="footer-contact-icon" size={16} />
                <span>Shop No 08, A K Compound,<br/>Jogeshwari West, Mumbai, 400102</span>
              </div>
            </div>
          </div>

          {/* COL 2 — Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/scrapiz-partners">Partners</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/locations">Locations</Link></li>
            </ul>
          </div>

          {/* COL 3 — Our Services */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Our Services</h4>
            <ul className="footer-links-list">
              <li><Link to="/services/scrap-collection">Scrap Collection</Link></li>
              <li><Link to="/services/demolition">Demolition Service</Link></li>
              <li><Link to="/services/dismantling">Dismantling</Link></li>
              <li><Link to="/services/paper-shredding">Paper Shredding</Link></li>
              <li><Link to="/services/society-tie-up">Society Tie-Up</Link></li>
              <li><Link to="/services/junk-removal">Junk Removal</Link></li>
            </ul>
          </div>

          {/* COL 4 — Our Locations */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Our Locations</h4>
            <ul className="footer-links-list">
              <li><Link to="/locations/bandra">Scrap Buyers in Bandra</Link></li>
              <li><Link to="/locations/bandra-east">Scrap Buyers in Bandra East</Link></li>
              <li><Link to="/locations/dharavi">Scrap Buyers in Dharavi</Link></li>
              <li><Link to="/locations/dharavi-koliwada">Scrap Buyers in Dharavi Koliwada</Link></li>
              <li><Link to="/locations/goregaon">Scrap Buyers in Goregaon</Link></li>
              <li><Link to="/locations/jogeshwari">Scrap Buyers in Jogeshwari</Link></li>
              <li><Link to="/locations/kandivali">Scrap Buyers in Kandivali</Link></li>
              <li><Link to="/locations/mahim">Scrap Buyers in Mahim</Link></li>
              <li><Link to="/locations/nalasopara">Scrap Buyers in Nalasopara</Link></li>
            </ul>
          </div>

          {/* COL 5 — Stay Connected */}
          <div className="footer-links-col footer-social-col">
            <h4 className="footer-col-title">Stay Connected</h4>
            <p className="footer-social-tagline">
              Get updates on best scrap rates and eco-friendly tips.
            </p>

            {/* WhatsApp Subscribe Button */}
            <a
              href="https://wa.me/918828700630?text=Hi%20Scrapiz!%20I%27d%20like%20to%20subscribe%20for%20updates."
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp-btn"
            >
              <MessageCircle size={20} />
              Subscribe on WhatsApp
            </a>

            {/* Social Icons */}
            <div className="footer-social-icons">
              <a href="https://www.facebook.com/scrapiz" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/scrapiz.in/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/scrapiz/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@scrapiz" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="footer-social-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="footer-bottom">
          <span>© 2025 Scrapiz Greentech Private Limited. All rights reserved.</span>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
