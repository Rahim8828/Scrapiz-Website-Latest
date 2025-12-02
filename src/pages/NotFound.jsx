import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Recycle } from 'lucide-react';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Scrapiz</title>
        <meta name="description" content="The page you are looking for does not exist." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center hero-pattern">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4"
        >
          <Recycle className="mx-auto h-24 w-24 text-green-300 animate-spin-slow" />
          <h1 className="mt-8 text-6xl font-bold text-gray-800">404</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-700">Oops! Page Not Found.</p>
          <p className="mt-2 text-lg text-gray-500">
            It seems the page you're looking for has been recycled.
          </p>
          <Button asChild className="mt-8 scrapiz-gradient hover:shadow-lg transition-all duration-300 font-semibold text-lg">
            <Link to="/">Back to Homepage</Link>
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;