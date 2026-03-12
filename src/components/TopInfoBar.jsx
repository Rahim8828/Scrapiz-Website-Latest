import { Mail, Phone } from "lucide-react";

const TopInfoBar = () => {
  return (
    <div className="bg-gray-900 text-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-center md:justify-end items-center gap-6 text-sm">
        <a 
          href="mailto:support@scrapiz.in" 
          className="flex items-center gap-2 hover:text-green-400 transition-colors"
        >
          <Mail size={16} />
          <span>support@scrapiz.in</span>
        </a>
        <a 
          href="tel:+918828700630" 
          className="flex items-center gap-2 hover:text-green-400 transition-colors"
        >
          <Phone size={16} />
          <span>+91 8828700630</span>
        </a>
      </div>
    </div>
  );
};

export default TopInfoBar;
