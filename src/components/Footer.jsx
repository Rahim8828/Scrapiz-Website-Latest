import { Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Logo Section */}
          <div>
            <h3 className="text-3xl font-bold text-green-700">Scrapiz</h3>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-700">Quick Links</h4>
            <ul className="space-y-2 text-gray-500">
              <li>About</li>
              <li>Scrap</li>
              <li>Contact</li>
              <li>Recycle Scrap</li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-700">Cities</h4>
            <ul className="space-y-2 text-gray-500">
              <li>Mumbai</li>
              <li>Delhi</li>
              <li>Bangalore</li>
              <li>Pune</li>
              <li>Hyderabad</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-700">Contact</h4>

            <p className="text-gray-600 flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-green-700" /> +91 75529 15253
            </p>

            <p className="text-gray-600 flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-700" /> 
              <span>allots@scrapiz.com</span>
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-12 pt-6 text-center text-gray-500 text-sm">
          © 2026 Scrapiz. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;