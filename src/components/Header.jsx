
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink, useLocation } from 'react-router-dom';

const Header = ({ openModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Locations', path: '/locations' },
    { name: 'Contact', path: '/contact' },
    { name: 'About Us', path: '/about' },
    { name: 'Blog', path: '/blog' },
  ];

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group ${
          isActive ? 'text-green-600' : ''
        }`
      }
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full"></span>
    </NavLink>
  );

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== '/' ? 'glass-effect shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/">
            <motion.div whileHover={{ scale: 1.05 }}>
              <img 
                src="/optimized/scrapiz-logo1.webp" 
                alt="Scrapiz Logo" 
                width="120"
                height="96"
                className="h-20 md:h-24 w-auto object-contain"
                loading="eager"
              />
            </motion.div>
          </NavLink>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavItem key={link.name} to={link.path}>
                {link.name}
              </NavItem>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Button 
              onClick={() => window.open('https://play.google.com/store/apps/details?id=com.scrapiz.app', '_blank')}
              variant="outline"
              className="border-green-600 bg-green-600 text-white hover:bg-green-700 hover:border-green-700"
            >
              <Download className="mr-2 h-5 w-5" /> 
              Download Now
            </Button>
            <Button 
              onClick={() => openModal()} // Use openModal prop
            >
              <Calendar className="mr-2 h-5 w-5" /> 
              Book Now
            </Button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 py-4"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-left px-4 py-2 font-medium transition-colors duration-200 ${
                      isActive ? 'text-green-600 bg-green-50 rounded-md' : 'text-gray-700 hover:text-green-600'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <Button 
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.scrapiz.app', '_blank')}
                variant="outline"
                className="mx-4 mt-2 border-green-600 bg-green-600 text-white hover:bg-green-700 hover:border-green-700"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Now
              </Button>
              <Button 
                onClick={() => openModal()} // Use openModal prop
                className="mx-4 mt-2"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Now
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
