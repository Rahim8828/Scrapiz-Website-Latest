import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone } from 'lucide-react';

const FloatingWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '918828700630';
  
  const quickMessages = [
    { text: 'I want to sell scrap', message: 'Hi! I want to sell my scrap. Please help.' },
    { text: 'Get today\'s rates', message: 'Hi! What are today\'s scrap rates?' },
    { text: 'Schedule pickup', message: 'Hi! I want to schedule a scrap pickup.' },
    { text: 'Bulk scrap inquiry', message: 'Hi! I have bulk scrap to sell. Please share details.' }
  ];

  const handleWhatsAppClick = (message = 'Hi! I want to sell my scrap.') => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+918828700630';
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-4">
      {/* Phone Call Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePhoneClick}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-2xl flex items-center justify-center transition-all relative"
        aria-label="Call us"
      >
        <Phone className="w-7 h-7 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-600 p-3 text-white">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                  <img src="/scrapiz-logo1.webp" alt="Scrapiz" width="28" height="28" className="w-7 h-7 object-contain" loading="eager" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Scrapiz Support</h4>
                  <p className="text-[10px] text-green-100">Usually replies instantly</p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-3 bg-gray-50">
              <div className="bg-white p-2 rounded-lg shadow-sm mb-3">
                <p className="text-xs text-gray-700">
                  👋 Hi! How can we help you today?
                </p>
              </div>

              {/* Quick Options */}
              <div className="space-y-1.5">
                {quickMessages.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleWhatsAppClick(item.message)}
                    className="w-full text-left p-2 bg-white rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all text-xs font-medium text-gray-700"
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={() => handleWhatsAppClick()}
                className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                Start Chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-colors ${
          isOpen ? 'bg-gray-700' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
      </motion.button>

      {/* Pulse Animation */}
      {!isOpen && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
      )}
    </div>
  );
};

export default FloatingWhatsApp;
