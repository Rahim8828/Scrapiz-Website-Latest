import { Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-[#fafafa] mt-24">
      <div className="max-w-7xl mx-auto px-10 py-8">
        {/* MAIN GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Logo */}
          <div>
            <h3 className="font-league text-5xl font-extrabold text-green-700">
              Scrapiz
            </h3>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-700 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-600">
              <li>About</li>
              <li>Scrap</li>
              <li>Contact us</li>
              <li>Recycle Scrap</li>
            </ul>
          </div>

          {/* Cities - 2 Columns EXACTLY LIKE IMAGE */}
          <div className="flex gap-10">
            <ul className="space-y-2 text-gray-600">
              <li>Mumbai</li>
              <li>Delhi</li>
              <li>Bangalore</li>
              <li>Pune</li>
              <li>Hyderabad</li>
            </ul>

            <ul className="space-y-2 text-gray-600">
              <li>Duorto</li>
              <li>Contact</li>
              <li>Pone</li>
              <li>Hydsrabed</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-gray-700 mb-4">Contact</h4>

            <p className="text-gray-600 flex items-center gap-2 mb-2">
              <Phone className="w-5 h-5 text-green-700" strokeWidth={3} />
              +91 75529 15253
            </p>

            <p className="text-gray-600 flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-700" strokeWidth={3} />
              allots@scrapiz.com
            </p>
          </div>
        </div>

        {/* BOTTOM AREA */}
        <div className="border-t mt-8 pt-4 text-sm text-gray-500 flex justify-between">
          <span>© 2023 Medinge Solutions. Co., Ltd.</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
