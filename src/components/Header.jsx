import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      scrollToSection(sectionId);
    } else {
      // Navigate to home with hash, then scroll after page loads
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const handlePartnersClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === "/scrapiz-partners") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate("/scrapiz-partners");
  };

  // Handle scrolling after navigation to home page
  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      // Small delay to let page render
      const timer = setTimeout(() => {
        scrollToSection(sectionId);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      {/* Desktop & Tablet Navbar */}
      <div
        className={`hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 
        transition-all duration-500 ease-in-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-32"}`}
      >
        <div className="bg-white shadow-lg rounded-full px-6 xl:px-12 py-3 flex items-center gap-8">
          {/* Left items */}
          <div className="flex gap-6 text-gray-700 text-base xl:text-lg font-medium">
            <button
              onClick={() => handleNavClick("services")}
              className="hover:text-green-600 transition"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick("how-it-works")}
              className="hover:text-green-600 transition"
            >
              How it works
            </button>
          </div>

          {/* Logo */}
          <button
            onClick={handleLogoClick}
            className="font-league text-3xl xl:text-4xl font-extrabold text-green-700 tracking-tight hover:scale-105 transition-transform"
          >
            Scrapiz
          </button>

          {/* Right items */}
          <div className="flex gap-6 text-gray-700 text-base xl:text-lg font-medium">
            <button
              onClick={() => handleNavClick("faqs")}
              className="hover:text-green-600 transition"
            >
              FAQs
            </button>
            <button
              onClick={handlePartnersClick}
              className="hover:text-green-600 transition"
            >
              Partners
            </button>
            <button
              onClick={() => handleNavClick("contact-us")}
              className="hover:text-green-600 transition"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="flex justify-between items-center px-5 py-4">
          <button
            onClick={handleLogoClick}
            className="font-league text-3xl xl:text-4xl font-extrabold text-green-600 tracking-tight hover:scale-105 transition-transform"
          >
            Scrapiz
          </button>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen((p) => !p)}>
            <svg
              className="w-7 h-7 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`transition-all duration-300 overflow-hidden bg-white 
          ${mobileMenuOpen ? "max-h-96 border-t border-gray-200" : "max-h-0"}`}
        >
          <div className="flex flex-col px-5 py-4 gap-4">
            <button
              onClick={() => handleNavClick("services")}
              className="text-left text-gray-700 text-lg py-2 hover:text-green-600"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick("how-it-works")}
              className="text-left text-gray-700 text-lg py-2 hover:text-green-600"
            >
              How it works
            </button>
            <button
              onClick={() => handleNavClick("faqs")}
              className="text-left text-gray-700 text-lg py-2 hover:text-green-600"
            >
              FAQs
            </button>
            <button
              onClick={handlePartnersClick}
              className="text-left text-gray-700 text-lg py-2 hover:text-green-600"
            >
              Partners
            </button>
            <button
              onClick={() => handleNavClick("contact-us")}
              className="text-left text-gray-700 text-lg py-2 hover:text-green-600"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
