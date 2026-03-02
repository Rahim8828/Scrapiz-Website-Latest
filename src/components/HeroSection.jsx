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
//           India’s Smart Scrap <br />
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
import personImg from "../assets/man.png";
import truckImg from "../assets/truck.png";
import googlePlay from "../assets/google.png";
import appStore from "../assets/apple.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* Content Wrapper */}
      <div className="max-w-7xl mx-auto px-6 pt-40 relative z-10 text-center w-full">

        {/* Heading Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
        >
          India’s Smart Scrap <br />
          Pickup & Recycling Platform
        </motion.h1>

        {/* Subtext Animation */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-3xl text-gray-600 max-w-xl mx-auto"
        >
          Sell your scrap in minutes with instant doorstep pickup.
        </motion.p>

        {/* App Buttons Animation */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          <img
            src={googlePlay}
            alt="Google Play"
            className="h-14 cursor-pointer hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <img
            src={appStore}
            alt="App Store"
            className="h-14 cursor-pointer hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Left Person Image Animation */}
      <motion.div
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-10 hidden md:block"
      >
        <img
          src={personImg}
          alt="Scrapiz Representative"
          className="w-[380px] md:w-[350px] h-[500px]"
          loading="lazy"
        />
      </motion.div>

      {/* Right Truck Image Animation */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 right-0 hidden md:block"
      >
        <img
          src={truckImg}
          alt="Scrapiz Truck"
          className="w-[550px] md:w-[500px] h-[340px]"
          loading="lazy"
        />
      </motion.div>

    </section>
  );
}