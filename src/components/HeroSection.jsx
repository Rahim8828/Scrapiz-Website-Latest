import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, User, Package, ArrowRight, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import OptimizedImage from './OptimizedImage';

const HeroSection = () => {
  const formRef = useRef();
  const [errors, setErrors] = useState({});

  const scrapTypes = [
    { value: "scrap-collection", label: "Scrap Collection" },
    { value: "demolition-service", label: "Demolition Service" },
    { value: "dismantling", label: "Dismantling" },
    { value: "paper-shredding", label: "Paper Shredding" },
    { value: "society-tie-up", label: "Society Tie-Up" },
    { value: "junk-removal", label: "Junk Removal Service" },
  ];
  
  const validateForm = (form) => {
    const newErrors = {};
    if (!form.name.value) newErrors.name = 'Full name is required.';
    if (!form.mobile.value) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\d{10}$/.test(form.mobile.value)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }
    if (!form.address.value) newErrors.address = 'Pickup address is required.';
    if (!form.scrapType.value) newErrors.scrapType = 'Please select a scrap type.';
    if (!form.date.value) newErrors.date = 'Please select a pickup date.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm(e.target.elements)) {
      const name = e.target.elements.name.value;
      const mobile = e.target.elements.mobile.value;
      const address = e.target.elements.address.value;
      const scrapType = e.target.elements.scrapType.value;
      const date = e.target.elements.date.value;

      const message = `New Pickup Request:\n\nName: ${name}\nMobile: ${mobile}\nAddress: ${address}\nService: ${scrapType}\nDate: ${date}`;
      const whatsappUrl = `https://wa.me/918828700630?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, '_blank');
      formRef.current.reset();
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center hero-pattern overflow-hidden pt-20 pb-12 lg:pt-20 lg:pb-0">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-green-100 rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-green-200 rounded-full opacity-30 animate-pulse-slow"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 lg:space-y-8"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full pl-2 pr-3 sm:pr-4 py-1.5 sm:py-2 shadow-md"
            >
              <img alt="Startup India Logo" width="120" height="40" className="h-8 sm:h-10 w-auto" src="https://horizons-cdn.hostinger.com/4ac3079d-8cee-4c39-b363-0d9dc8e58a65/3c8b5158057f3cfa9cb1ef802827f1dc.png" loading="eager" style={{ aspectRatio: '3/1' }} />
              <span className="font-semibold text-green-800 text-xs sm:text-sm">Recognized by Startup India</span>
            </motion.div>

            {/* Heading */}
            <div className="space-y-3 sm:space-y-4">
              <motion.h1 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Sell Your Scrap 
                <span className="text-gradient block">Online Easily</span>
                <span className="text-gray-700">with Scrapiz</span>
              </motion.h1>
              
              <motion.p 
                className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Instant pickup, best rates, hassle-free process. Turn your scrap into cash today!
              </motion.p>
            </div>

            {/* Features */}
            <motion.div 
              className="flex flex-wrap gap-4 sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { icon: Phone, text: 'Instant Pickup' },
                { icon: Package, text: 'Best Rates' },
                { icon: MapPin, text: 'Doorstep Service' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 scrapiz-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm sm:text-base">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
            className="form-container-card w-full max-w-xl mx-auto lg:max-w-none"
          >
            <div className="text-center mb-5 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Schedule a Free Pickup</h2>
              <p className="text-sm sm:text-base text-gray-500">Fast, easy, and convenient.</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
              {/* Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                    <Input 
                      type="text" 
                      name="name" 
                      placeholder="Full Name" 
                      className="pl-10 sm:pl-12 h-12 sm:h-14 text-base" 
                      required 
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Phone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                    <Input 
                      type="tel" 
                      name="mobile" 
                      placeholder="Mobile Number" 
                      className="pl-10 sm:pl-12 h-12 sm:h-14 text-base" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      required 
                    />
                  </div>
                  {errors.mobile && <p className="text-red-500 text-xs mt-1.5">{errors.mobile}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                  <Input 
                    type="text" 
                    name="address" 
                    placeholder="Pickup Address" 
                    className="pl-10 sm:pl-12 h-12 sm:h-14 text-base" 
                    required 
                  />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address}</p>}
              </div>

              {/* Service & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <div className="relative">
                    <Wrench className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none z-10" />
                    <Select 
                      name="scrapType" 
                      className="pl-10 sm:pl-12 h-12 sm:h-14 text-base appearance-none" 
                      required
                    >
                      <option value="">Select Service</option>
                      {scrapTypes.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                    </Select>
                  </div>
                  {errors.scrapType && <p className="text-red-500 text-xs mt-1.5">{errors.scrapType}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Calendar className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none z-10" />
                    <Input 
                      type="date" 
                      name="date" 
                      className="pl-10 sm:pl-12 h-12 sm:h-14 text-base" 
                      required 
                    />
                  </div>
                  {errors.date && <p className="text-red-500 text-xs mt-1.5">{errors.date}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold group">
                Book Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
