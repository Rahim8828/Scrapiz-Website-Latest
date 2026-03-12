// import personImg from "../assets/man.jpg";
// import truckImg from "../assets/truck.png";
// import googlePlay from "../assets/google.png";
// import appStore from "../assets/apple.png";

// export default function Hero() {
//   return (
//     <section className="relative bg-[#f3f3f3] min-h-screen overflow-hidden">

//       {/* Content Wrapper */}
//       <div className="max-w-7xl mx-auto px-6 pt-40 relative z-10 text-center">

//         {/* Heading */}
//         <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
//           India's Smart Scrap <br />
//           Pickup & Recycling Platform
//         </h1>

//         {/* Subtext */}
//         <p className="mt-6 text-3xl text-gray-600 max-w-xl mx-auto">
//           Sell your scrap in minutes with instant doorstep pickup.
//         </p>

//         {/* App Buttons */}
//         <div className="mt-8 flex justify-center gap-4">
//           <img
//             src={googlePlay}
//             alt="Google Play"
//             className="h-14 cursor-pointer"
//             loading="lazy"
//           />
//           <img
//             src={appStore}
//             alt="App Store"
//             className="h-14 cursor-pointer"
//             loading="lazy"
//           />
//         </div>
//       </div>

//       {/* Left Person Image */}
//       <div className="absolute bottom-0 left-10 hidden md:block">
//         <img
//           src={personImg}
//           alt="Scrapiz Representative"
//           className="w-[380px] md:w-[350px] h-[500px]"
//           loading="lazy"
//         />
//       </div>

//       {/* Right Truck Image */}
//       <div className="absolute bottom-0 right-0 hidden md:block">
//         <img
//           src={truckImg}
//           alt="Scrapiz Truck"
//           className="w-[550px] md:w-[500px] h-[340px]"
//           loading="lazy"
//         />
//       </div>

//     </section>
//   );
// }

import { motion } from "framer-motion";
import ResponsiveAssetImage from "../components/ResponsiveAssetImage";
import googlePlay from "../assets/google.png";
import appStore from "../assets/apple.png";

export default function Hero() {
  return (
    <section className="hero-section relative overflow-hidden bg-gradient-to-b from-gray-50 to-white md:min-h-screen">
      {/* Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 pt-24 md:pt-40 relative z-10 text-center w-full">
        {/* Heading Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-title text-3xl md:text-5xl font-bold text-gray-900 leading-tight px-2"
        >
          India's Smart Scrap <br />
          Pickup & Recycling Platform
        </motion.h1>

        {/* Subtext Animation */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="hero-subtitle mt-3 md:mt-6 text-lg md:text-3xl text-gray-600 max-w-xl mx-auto px-4"
        >
          Sell your scrap in minutes with instant doorstep pickup.
        </motion.p>

        {/* Mobile Layout: Person Image + App Buttons Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6 md:hidden flex items-center justify-center gap-4 px-4"
        >
          {/* Person Image on Left */}
          <div className="flex-shrink-0">
            <ResponsiveAssetImage
              src="man.png"
              alt="Scrapiz Representative"
              className="hero-man-img w-32 h-auto object-contain"
              loading="eager"
            />
          </div>

          {/* App Buttons on Right */}
          <div className="flex flex-col gap-3 flex-shrink-0">
            <a
              href="https://play.google.com/store/apps/details?id=com.scrapiz.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex hover:scale-105 transition-transform duration-300"
            >
              <img
                src={googlePlay}
                alt="Get it on Google Play"
                className="h-14 w-auto object-contain"
                loading="lazy"
              />
            </a>
            <a
              href="https://apps.apple.com/in/app/scrapiz-sell-scrap-online/id6756441850"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex hover:scale-105 transition-transform duration-300"
            >
              <img
                src={appStore}
                alt="Download on the App Store"
                className="h-14 w-auto object-contain"
                loading="lazy"
              />
            </a>
          </div>
        </motion.div>

        {/* Desktop App Buttons - Hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 hidden md:flex justify-center items-center gap-4"
        >
          <a
            href="https://play.google.com/store/apps/details?id=com.scrapiz.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex hover:scale-105 transition-transform duration-300"
          >
            <img
              src={googlePlay}
              alt="Get it on Google Play"
              className="h-14 lg:h-16 w-auto object-contain"
              loading="lazy"
            />
          </a>
          <a
            href="https://apps.apple.com/in/app/scrapiz-sell-scrap-online/id6756441850"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex hover:scale-105 transition-transform duration-300"
          >
            <img
              src={appStore}
              alt="Download on the App Store"
              className="h-14 lg:h-16 w-auto object-contain"
              loading="lazy"
            />
          </a>
        </motion.div>
      </div>

      {/* Desktop Left Person Image Animation - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-10 hidden md:block"
      >
        <ResponsiveAssetImage
          src="man.png"
          alt="Scrapiz Representative"
          className="w-[380px] md:w-[350px] h-[500px]"
          loading="eager"
        />
      </motion.div>

      {/* Desktop Right Truck Image Animation - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 right-0 hidden md:block"
      >
        <ResponsiveAssetImage
          src="truck.png"
          alt="Scrapiz Truck"
          className="w-[550px] md:w-[500px] h-[340px]"
          loading="lazy"
        />
      </motion.div>
    </section>
  );
}
