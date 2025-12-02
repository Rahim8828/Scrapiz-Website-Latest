
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { locationData } from '@/data/locationData';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
    { name: 'Locations', path: '/locations' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Request Account Deletion', path: '/request-account-deletion' },
    { name: 'Terms & Conditions', path: '/terms-and-conditions' },
  ];

  const services = [
    { name: 'Scrap Collection', path: '/services/scrap-collection' },
    { name: 'Demolition Service', path: '/services/demolition-service' },
    { name: 'Dismantling', path: '/services/dismantling' },
    { name: 'Paper Shredding', path: '/services/paper-shredding' },
    { name: 'Society Tie-Up', path: '/services/society-tie-up' },
    { name: 'Junk Removal', path: '/services/junk-removal-service' },
  ];

  // Generate location links from locationData
  const locationLinks = Object.values(locationData).map(location => ({
    name: `Scrap Buyers in ${location.name}`,
    path: `/${location.slug}`
  }));

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61575801190925' },
    { icon: Instagram, name: 'Instagram', href: 'https://www.instagram.com/scrapiz.in/' },
    { icon: Linkedin, name: 'LinkedIn', href: 'https://www.linkedin.com/company/scrapiz/' },
    { icon: Youtube, name: 'YouTube', href: 'https://www.youtube.com/@Scrapiz/shorts' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-6">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3 sm:space-y-4"
          >
            <Link to="/" className="inline-block">
              <img 
                src="/optimized/scrapiz-logo1.webp" 
                alt="Scrapiz Logo" 
                width="100"
                height="80"
                className="h-16 sm:h-20 w-auto object-contain"
                loading="eager"
              />
            </Link>
            
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Mumbai's leading online scrap selling platform. We make recycling easy, profitable, and environmentally responsible.
            </p>

            <nav className="space-y-1.5 sm:space-y-2" aria-label="Contact Information">
              <a 
                href="tel:+918828700630" 
                className="flex items-center gap-2.5 sm:gap-3 text-gray-300 hover:text-green-400 transition-colors"
                aria-label="Call us at +91 8828700630"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">+91 8828700630</span>
              </a>
              <a 
                href="mailto:support@scrapiz.in" 
                className="flex items-center gap-2.5 sm:gap-3 text-gray-300 hover:text-green-400 transition-colors"
                aria-label="Email us at support@scrapiz.in"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">support@scrapiz.in</span>
              </a>
              <div className="flex items-start gap-2.5 sm:gap-3 text-gray-300">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-green-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm leading-snug">Shop No 08, A K Compound, Jogeshwari West, Mumbai, 400102</span>
              </div>
            </nav>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-3 sm:space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold text-white">Quick Links</h3>
            <nav className="flex flex-col gap-1.5 sm:gap-2" aria-label="Quick Links">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-200 inline-block"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-3 sm:space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold text-white">Our Services</h3>
            <nav className="flex flex-col gap-1.5 sm:gap-2" aria-label="Our Services">
              {services.map((service) => (
                <Link
                  key={service.path}
                  to={service.path}
                  className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-200 inline-block"
                >
                  {service.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Our Locations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="space-y-3 sm:space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold text-white">Our Locations</h3>
            <nav className="flex flex-col gap-1.5 sm:gap-2" aria-label="Our Locations">
              {locationLinks.map((location) => (
                <Link
                  key={location.path}
                  to={location.path}
                  className="text-sm sm:text-base text-gray-300 hover:text-green-400 transition-colors duration-200 inline-block"
                >
                  {location.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Stay Connected */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-3 sm:space-y-4"
          >
            <h3 className="text-base sm:text-lg font-semibold text-white">Stay Connected</h3>
            
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Get updates on best scrap rates and eco-friendly tips.
            </p>

            <a
              href="https://wa.me/918828700630"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center scrapiz-gradient py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:shadow-lg transition-all duration-300"
              aria-label="Subscribe on WhatsApp"
            >
              <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Subscribe on WhatsApp
            </a>

            <div className="flex gap-3 sm:gap-4" role="list" aria-label="Social Media Links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors duration-300 group"
                  aria-label={`Visit our ${social.name} page`}
                  onClick={(e) => {
                    if (social.href === '#') {
                      e.preventDefault();
                      toast({ title: `🚧 ${social.name} link is not available yet.` });
                    }
                  }}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-gray-400 text-center md:text-left text-xs sm:text-sm">
              Copyright © 2024 Scrapiz GreenTech Pvt. Ltd. All rights reserved.
            </p>
            
            <nav className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-400" aria-label="Legal Links">
              {legalLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="hover:text-green-400 transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
