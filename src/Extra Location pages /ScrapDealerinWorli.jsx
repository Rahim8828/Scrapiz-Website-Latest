import { Helmet } from 'react-helmet-async';
import { 
  Phone, MapPin, Clock, Mail, CheckCircle, TrendingUp, 
  Shield, Zap, Users, Award, Recycle, Truck, IndianRupee,
  Star, MapPinned, Building2
} from 'lucide-react';

const ScrapDealerinWorli = ({ openModal }) => {
  const locationData = {
    name: 'Worli',
    address: 'Shop No. 07, Worli, Mumbai',
    title: 'Scrap Dealer in Worli – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Worli with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates. We buy metal scrap, e-waste, AC, copper, furniture & more.',
    phone: '8828700630',
        email: 'support@scrapiz.in',
    hours: '9:00 AM – 10:00 PM',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA3JzI0LjQiTiA3MsKwNDknMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890',
    areas: [
      'Worli Station', 'Worli Naka', 'Worli Sea Face', 'Prabhadevi', 'Lower Parel', 'Annie Besant Road', 'Worli Village', 'BDD Chawl', 'Lotus Mills', 'Worli Koliwada', 'Acharya Atre Chowk', 'Worli Dairy', 'Nehru Planetarium Area', 'Haji Ali', 'Mahalaxmi'
    ],
    landmarks: [
      'Worli Sea Face', 'Haji Ali Dargah', 'Nehru Planetarium', 'Worli Naka', 'BDD Chawl', 'Worli Village', 'Lotus Mills', 'Acharya Atre Chowk'
    ],
    scrapTypes: [
      { name: 'Metal Scrap', items: 'Iron, Steel, Copper, Aluminium, Brass, Stainless Steel' },
      { name: 'E-Waste', items: 'Mobiles, Computers, Laptops, Printers, Electronics' },
      { name: 'Home Appliances', items: 'AC, Fridge, Washing Machine, Microwave, TV' },
      { name: 'Office Scrap', items: 'Furniture, IT Equipment, Cables, Dismantling Services' },
      { name: 'Commercial Scrap', items: 'Showrooms, Studios, Shops, Restaurants' },
      { name: 'Bulk Scrap', items: 'Societies, Buildings, Construction Sites' },
      { name: 'Plastic & Paper', items: 'Plastic Bottles, Newspapers, Cardboard, Books' },
      { name: 'Furniture', items: 'Old Furniture, Wooden Items, Office Chairs, Tables' }
    ]
  };

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: 'Best Scrap Rates',
      description: 'Get the highest market rates for all types of scrap materials in Worli.',
      highlight: 'Up to 20% more'
    },
    {
      icon: <Truck className="w-8 h-8 text-green-600" />,
      title: 'Free Doorstep Pickup',
      description: 'Completely free pickup service from homes, offices, shops & societies.',
      highlight: '100% Free'
    },
    {
      icon: <Zap className="w-8 h-8 text-green-600" />,
      title: 'Instant Payment',
      description: 'Get paid immediately via UPI, Cash, or Bank Transfer after weighing.',
      highlight: 'Same Day'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: 'Trusted & Licensed',
      description: 'Certified scrap dealer with transparent digital weighing system.',
      highlight: 'Verified'
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: 'Professional Team',
      description: 'Experienced and courteous staff for hassle-free scrap collection.',
      highlight: '500+ Happy Customers'
    },
    {
      icon: <Recycle className="w-8 h-8 text-green-600" />,
      title: 'Eco-Friendly',
      description: 'Responsible recycling practices for a sustainable environment.',
      highlight: 'Green Certified'
    }
  ];

  const testimonials = [
    {
      name: 'Sameer Desai',
      area: 'Worli Sea Face',
      rating: 5,
      text: 'Best scrap dealer in Worli! Got excellent rates for my old AC and fridge. Team was very professional.'
    },
    {
      name: 'Priya Nair',
      area: 'Prabhadevi',
      rating: 5,
      text: 'Quick service and instant payment. Sold office furniture and e-waste. Highly recommended!'
    },
    {
      name: 'Vikram Joshi',
      area: 'Worli Naka',
      rating: 5,
      text: 'Called them for society bulk scrap pickup. They handled everything smoothly. Great rates!'
    }
  ];

  const faqs = [
    {
      question: 'Do you offer free scrap pickup in Worli?',
      answer: 'Yes, Scrapiz provides 100% free doorstep pickup service anywhere in Worli. We don\'t have a strict minimum quantity. However, for very small amounts, a nominal convenience fee of ₹60 might apply. For most household scrap accumulations (20-30 kg), the pickup is completely free. No hidden charges!'
    },
    {
      question: 'How fast can your team reach for scrap pickup?',
      answer: 'Our team usually reaches within 30-45 minutes in Worli area, depending on traffic conditions. We offer same-day pickup service for urgent requirements.'
    },
    {
      question: 'What types of scrap do you buy in Worli?',
      answer: 'We buy all types of scrap including metal scrap (iron, steel, copper, aluminium, brass), e-waste, home appliances (AC, fridge, washing machine), office scrap, furniture, plastic, paper, and commercial scrap.'
    },
    {
      question: 'Do you provide bulk scrap pickup for societies and buildings?',
      answer: 'Yes, we specialize in bulk scrap pickup for residential societies, commercial buildings, offices, shops, studios, and restaurants in Worli. We handle large quantities efficiently.'
    },
    {
      question: 'How do you calculate scrap rates?',
      answer: 'We offer the best market rates based on current scrap prices. All items are weighed on certified digital scales in front of you for complete transparency.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We provide instant payment via UPI, Cash, Bank Transfer (NEFT/IMPS), or Cheque - whatever is convenient for you. Payment is made immediately after weighing.'
    },
    {
      question: 'Do you buy old AC and refrigerator scrap?',
      answer: 'Yes, we buy all types of old and non-working AC units, refrigerators, washing machines, microwaves, and other home appliances at the best rates in Worli.'
    },
    {
      question: 'Is there any minimum quantity requirement?',
      answer: 'No minimum quantity required! Whether you have a small bag of newspapers or a truckload of metal scrap, we accept all quantities.'
    }
  ];

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.scrapiz.in/scrap-dealer-in-worli#business",
        "name": "Scrapiz - Scrap Dealer in Worli",
        "image": "https://www.scrapiz.in/Scrapiz-logo.webp",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": locationData.address,
          "addressLocality": "Worli",
          "addressRegion": "Maharashtra",
          "postalCode": "400001",
          "addressCountry": "IN",
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "19.0176",
          "longitude": "72.8170"
        }
        },
        "telephone": locationData.phone,
        "email": locationData.email,
        "url": "https://www.scrapiz.in/scrap-dealer-in-worli",
        "areaServed": "Worli, Mumbai",
        "priceRange": "₹₹",
        "openingHours": "Mo-Su 09:00-22:00",
        "description": locationData.description,
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Local Customer"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "Excellent service and best rates in the area. Highly professional team.",
            "datePublished": "2024-11-15"
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Satisfied Client"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "4.8",
              "bestRating": "5"
            },
            "reviewBody": "Quick pickup and instant payment. Very transparent process.",
            "datePublished": "2024-10-28"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "2",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.scrapiz.in/scrap-dealer-in-worli#faq",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.scrapiz.in/scrap-dealer-in-worli#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.scrapiz.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Locations",
            "item": "https://www.scrapiz.in/locations"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Worli",
            "item": "https://www.scrapiz.in/scrap-dealer-in-worli"
          }
        ]
      }
    ]
  }

  return (
    <>
      <Helmet>
        <title>{locationData.title}</title>
        <meta name="description" content={locationData.description} />
        <meta name="keywords" content="scrap dealer worli, scrap buyer worli, kabadiwala worli, sell scrap worli, scrap pickup worli, worli scrap dealer, best scrap rates worli, scrap collection worli" />
        <link rel="canonical" href="https://www.scrapiz.in/scrap-dealer-in-worli" />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <MapPinned className="w-6 h-6 text-green-600" />
            <span className="text-green-700 font-semibold">Serving Worli & Nearby Areas</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            #1 Scrap Dealer in<br />
            <span className="text-green-600">{locationData.name}</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 max-w-3xl leading-relaxed">
            Looking to <strong>sell scrap in Worli</strong>? Scrapiz offers <strong>free doorstep pickup</strong>, 
            instant payment, and the <strong>best scrap rates</strong> in your area. Whether you're near{' '}
            <strong>Lokhandwala, DN Nagar, Versova, or Four Bungalows</strong>, 
            our team reaches the same day for pickup.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-8">
            <a 
              href={`tel:${locationData.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5" />
              Call: {locationData.phone}
            </a>
            <a 
              href={`https://wa.me/91${locationData.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold border-2 border-green-600 hover:bg-green-50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
            {openModal && (
              <button
                onClick={() => openModal('Scrap Pickup - Worli')}
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Truck className="w-5 h-5" />
                Book Free Pickup
              </button>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>500+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              <span>Licensed & Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Enhanced */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Scrapiz in {locationData.name}?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mumbai's most trusted scrap dealer with transparent pricing and professional service
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl group-hover:bg-green-100 transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">{feature.title}</h3>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                        {feature.highlight}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Content Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Professional Scrap Collection Services in Worli
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p>
                  <strong>Scrapiz</strong> is the most trusted and reliable <strong>scrap dealer in Worli</strong>, 
                  serving thousands of satisfied customers across Lokhandwala, Versova, DN Nagar, Four Bungalows, 
                  Oshiwara, and surrounding areas.
                </p>
                <p>
                  We specialize in buying all types of scrap materials at the <strong>best market rates</strong> with 
                  complete transparency. Our professional team ensures a hassle-free experience from booking to payment.
                </p>
                <p>
                  Whether you want to <strong>sell scrap from your home, office, shop, or society</strong>, we provide 
                  free doorstep pickup service with instant payment. No hidden charges, no waiting time!
                </p>
                <p>
                  Our services include residential scrap pickup, commercial scrap collection, bulk scrap removal for 
                  societies and buildings, office dismantling, and e-waste recycling. We handle everything from small 
                  quantities to large-scale scrap removal projects.
                </p>
              </div>

              <div className="mt-8 p-6 bg-white rounded-xl shadow-md border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                  Best Scrap Rates Guaranteed
                </h3>
                <p className="text-gray-700">
                  We offer the highest scrap rates in Worli based on current market prices. 
                  All items are weighed on certified digital scales in your presence for complete transparency.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  Areas We Serve
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Complete scrap pickup coverage across Worli:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {locationData.areas.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg text-white">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Quick Contact</h3>
                <div className="space-y-2.5 sm:space-y-3">
                  <a href={`tel:${locationData.phone}`} className="flex items-center gap-2 sm:gap-3 hover:underline">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-base sm:text-lg font-semibold">{locationData.phone}</span>
                  </a>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{locationData.hours}</span>
                  </div>
                  <a href={`mailto:${locationData.email}`} className="flex items-center gap-2 sm:gap-3 hover:underline break-all">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{locationData.email}</span>
                  </a>
                </div>
                <button
                  onClick={() => openModal && openModal('Quick Booking')}
                  className="mt-5 sm:mt-6 w-full bg-white text-green-600 px-5 sm:px-6 py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-100 transition-colors"
                >
                  Schedule Pickup Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Scrap - Enhanced */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Types of Scrap We Buy in {locationData.name}
            </h2>
            <p className="text-lg text-gray-600">
              We accept all types of scrap materials at competitive prices
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {locationData.scrapTypes.map((type, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Recycle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">{type.name}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{type.items}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-6">
              Don't see your item listed? <strong>We buy almost everything!</strong> Call us to check.
            </p>
            <a 
              href={`tel:${locationData.phone}`}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Call for Instant Quote
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by 500+ customers in Worli
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-base sm:text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-gray-900">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{testimonial.area}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Enhanced */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our scrap collection service
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details 
                key={index}
                className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <summary className="flex items-start justify-between cursor-pointer list-none">
                  <h3 className="text-lg font-bold text-gray-900 pr-4 flex-1">
                    {faq.question}
                  </h3>
                  <span className="text-green-600 text-2xl group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-green-50 rounded-2xl border-2 border-green-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Still Have Questions?
            </h3>
            <p className="text-gray-700 mb-6">
              Our team is here to help! Call us now for instant answers.
            </p>
            <a 
              href={`tel:${locationData.phone}`}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              <Phone className="w-5 h-5" />
              {locationData.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Contact Information - Enhanced */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 p-8 sm:p-12">
              <div className="text-white">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Contact Scrapiz {locationData.name}
                </h2>
                <p className="text-green-50 mb-8 text-lg">
                  Get in touch with us for the best scrap rates and free pickup service
                </p>

                <div className="space-y-6">
                  

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a href={`tel:${locationData.phone}`} className="text-green-50 hover:text-white text-lg">
                        {locationData.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Working Hours</h3>
                      <p className="text-green-50">{locationData.hours}</p>
                      <p className="text-green-50 text-sm mt-1">Open 7 Days a Week</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href={`mailto:${locationData.email}`} className="text-green-50 hover:text-white">
                        {locationData.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Booking Form
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type of Scrap
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option>Select scrap type</option>
                      <option>Metal Scrap</option>
                      <option>E-Waste</option>
                      <option>Home Appliances</option>
                      <option>Office Scrap</option>
                      <option>Furniture</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <button
                    onClick={() => openModal && openModal('Contact Form')}
                    className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                  >
                    Request Free Pickup
                  </button>
                  <p className="text-sm text-gray-600 text-center">
                    Or call us directly at <a href={`tel:${locationData.phone}`} className="text-green-600 font-semibold">{locationData.phone}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="py-12 sm:py-16 px-4 bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Ready to Sell Your Scrap?
          </h2>
          <p className="text-xl sm:text-2xl mb-2 text-green-50">
            Call Now: <a href={`tel:${locationData.phone}`} className="font-bold hover:underline">{locationData.phone}</a>
          </p>
          <p className="text-lg sm:text-xl mb-8 text-green-50">
            🚚 Free Pickup | 🔥 Best Rates | 💸 Instant Cash | ⭐ 500+ Happy Customers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`tel:${locationData.phone}`}
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-xl text-lg"
            >
              <Phone className="w-6 h-6" />
              Call Now
            </a>
            <a 
              href={`https://wa.me/91${locationData.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-xl text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
          <p className="text-xl font-semibold mt-8 text-green-50">
            Scrapiz – #1 Trusted Scrap Dealer in {locationData.name}
          </p>
        </div>
      </section>
    </>
  );
};

export default ScrapDealerinWorli;
