/**
 * Centralized Location Data Configuration
 * Contains all location-specific data for SEO optimization
 * This data must match GMB listings exactly for NAP consistency
 */

export const locationData = {
  bandra: {
    id: 'bandra',
    name: 'Bandra',
    displayName: 'Bandra',
    slug: 'bandra',
    
    // NAP Data (must match GMB exactly)
    nap: {
      businessName: 'Scrapiz Bandra - Scrap Buyers & Scrap Dealers in Mumbai',
      address: {
        street: 'R15, Service Road Y Colony, Bandra East',
        locality: 'Mumbai',
        region: 'Maharashtra',
        postalCode: '400051',
        fullAddress: 'R15, Service Road Y Colony, Bandra East, Mumbai, Maharashtra 400051'
      },
      phone: '+918828795435',
      phoneDisplay: '8828795435',
      email: 'Contact@scrapiz.in',
      hours: [
        { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
      ]
    },
    
    // Geographic Data
    geo: {
      latitude: 19.045566,
      longitude: 72.771573,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57985.476447900226!2d72.77157334863281!3d19.045566400000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c98b02f3e191%3A0x20e6ed1af35d3949!2sScrapiz!5e1!3m2!1sen!2sin!4v1757275021931!5m2!1sen!2sin'
    },
    
    // Local Content
    content: {
      heroTitle: 'Scrap buyers in Bandra',
      heroDescription: 'Looking to sell scrap in Bandra? Scrapiz makes it easy with doorstep pickup, instant payment, and best scrap rates. Whether you\'re in Bandra West or Bandra East, our team reaches you the same day.',
      
      whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Bandra, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve both Bandra East and Bandra West, covering areas like Pali Hill, Carter Road, and Bandstand.',
      
      whyChooseDetails: 'Whether you want to sell scrap in Bandra from your home, office, or shop, our team makes the process fast and hassle-free. From iron, steel, aluminum, and copper to plastic, paper, e-waste, and old furniture, we buy all types of scrap at the highest prices.',
      
      landmarks: [
        'Pali Hill',
        'Carter Road',
        'Bandstand',
        'Linking Road',
        'Bandra-Worli Sea Link',
        'Mount Mary Church',
        'Bandra Fort',
        'Lilavati Hospital'
      ],
      
      subAreas: [
        'Bandra West',
        'Bandra East',
        'Pali Hill',
        'Carter Road',
        'Bandstand',
        'Khar Danda',
        'Bandra Reclamation',
        'Kalanagar'
      ],
      
      nearbyLocations: [
        { name: 'Bandra East', slug: 'bandra-east' },
        { name: 'Mahim', slug: 'mahim' },
        { name: 'Dharavi', slug: 'dharavi' }
      ]
    },
    
    // Local Keywords
    keywords: {
      primary: 'scrap buyers in Bandra',
      secondary: [
        'scrap dealer in Bandra',
        'kabadiwala Bandra',
        'scrap buyer near Linking Road',
        'sell scrap in Bandra West',
        'scrap pickup Bandra East',
        'best scrap rates Bandra',
        'online scrap dealer Bandra',
        'scrap collection Bandra',
        'e-waste pickup Bandra',
        'copper scrap buyer Bandra',
        'scrap dealer near me Bandra',
        'scrap recycling Bandra'
      ]
    },
    
    // SEO Meta
    seo: {
      title: 'Scrapiz Bandra - Scrap Buying and Recycling Services',
      description: 'Sell your scrap in Bandra with Scrapiz – reliable scrap buyers in Mumbai. We provide free pickup, digital weighing, and eco-friendly recycling',
      keywords: 'scrap dealer near me, scrap buyer, Bandra, Mumbai, scrap recycling, best scrap rates, free pickup, Online kabadiwala, scrap dealer near me, scrap dealer in bandra',
      canonical: 'https://www.scrapiz.in/bandra'
    },
    images: {
      hero: '/optimized/Scrapiz-Bandra.webp',
      alt: 'Scrapiz Bandra Shop'
    }
  },

  bandraEast: {
    id: 'bandra-east',
    name: 'Bandra East',
    displayName: 'Bandra East',
    slug: 'bandra-east',
    
    nap: {
      businessName: 'Scrapiz Bandra East - Scrap Buyers & Scrap Dealers in Mumbai',
      address: {
        street: 'Shop No 9, F Block Bandra Kurla Complex, Maharashtra Nagar, Sant Dnyaneshwar Nagar, Bandra East',
        locality: 'Mumbai',
        region: 'Maharashtra',
        postalCode: '400051',
        fullAddress: 'Shop No 9, F Block Bandra Kurla Complex, Maharashtra Nagar, Sant Dnyaneshwar Nagar, Bandra East, Mumbai, Maharashtra 400051'
      },
      phone: '+918828795413',
      phoneDisplay: '8828795413',
      email: 'Contact@scrapiz.in',
      hours: [
        { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
      ]
    },
    
    geo: {
      latitude: 19.0626,
      longitude: 72.8677,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.2!2d72.8677!3d19.0626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c98b02f3e191%3A0x20e6ed1af35d3949!2sScrapiz%20Bandra%20East!5e0!3m2!1sen!2sin!4v1757275021931!5m2!1sen!2sin'
    },
    
    content: {
      heroTitle: 'Scrap buyers in Bandra East',
      heroDescription: 'Looking to sell scrap in Bandra East? Scrapiz makes it easy with doorstep pickup, instant payment, and best scrap rates. Whether you\'re in Bandra West or Bandra East, our team reaches you the same day.',
      
      whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Bandra East, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve Bandra East, covering areas like Kalanagar, MIG Colony, and Government Colony.',
      
      whyChooseDetails: 'Whether you want to sell scrap in Bandra East from your home, office, or shop, our team makes the process fast and hassle-free. From iron, steel, aluminum, and copper to plastic, paper, e-waste, and old furniture, we buy all types of scrap at the highest prices.',
      
      landmarks: [
        'Bandra Kurla Complex',
        'Kalanagar',
        'MIG Colony',
        'Government Colony',
        'BKC Metro Station',
        'MMRDA Grounds'
      ],
      
      subAreas: [
        'Bandra East',
        'Kalanagar',
        'MIG Colony',
        'Government Colony',
        'BKC',
        'Sant Dnyaneshwar Nagar',
        'Maharashtra Nagar'
      ],
      
      nearbyLocations: [
        { name: 'Bandra', slug: 'bandra' },
        { name: 'Mahim', slug: 'mahim' },
        { name: 'Dharavi', slug: 'dharavi' }
      ]
    },
    
    keywords: {
      primary: 'scrap buyers in Bandra East',
      secondary: [
        'scrap dealer in Bandra East',
        'kabadiwala Bandra East',
        'scrap buyer near Kalanagar',
        'sell scrap in Bandra East',
        'scrap pickup Bandra East',
        'best scrap rates Bandra East',
        'online scrap dealer Bandra East',
        'scrap collection Bandra East',
        'e-waste pickup Bandra East',
        'BKC scrap buyer',
        'scrap dealer near me Bandra East',
        'scrap recycling Bandra East'
      ]
    },
    
    seo: {
      title: 'Scrapiz Bandra East - Scrap Buying and Recycling Services',
      description: 'Sell your scrap in Bandra East with Scrapiz – reliable scrap buyers in Mumbai. We provide free pickup, digital weighing, and eco-friendly recycling',
      keywords: 'scrap dealer near me, scrap buyer, Bandra East, Mumbai, scrap recycling, best scrap rates, free pickup, Online kabadiwala, scrap dealer in bandra east',
      canonical: 'https://www.scrapiz.in/bandra-east'
    },
    images: {
      hero: '/optimized/Scrapiz-Bandra-East.webp',
      alt: 'Scrapiz Bandra East Shop'
    }
  },

  dharavi: {
    id: 'dharavi',
    name: 'Dharavi',
    displayName: 'Dharavi',
    slug: 'dharavi',
    
    nap: {
      businessName: 'Scrapiz Dharavi - Scrap Buyers & Scrap Dealers in Mumbai',
      address: {
        street: 'Shop No 07, Mahim - Sion Link Rd, Naya Nagar, Navrang Compound, Dharavi',
        locality: 'Mumbai',
        region: 'Maharashtra',
        postalCode: '400017',
        fullAddress: 'Shop No 07, Mahim - Sion Link Rd, Naya Nagar, Navrang Compound, Dharavi, Mumbai, Maharashtra 400017'
      },
      phone: '+919892304748',
      phoneDisplay: '9892304748',
      email: 'Contact@scrapiz.in',
      hours: [
        { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
      ]
    },
    
    geo: {
      latitude: 19.0423,
      longitude: 72.8570,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8!2d72.8570!3d19.0423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c95b726c559d%3A0x1fab52f480798e0e!2sScrapiz%20Dharavi!5e0!3m2!1sen!2sin!4v1757274965391!5m2!1sen!2sin'
    },
    
    content: {
      heroTitle: 'Scrap buyers in Dharavi',
      heroDescription: 'Looking to sell scrap in Dharavi? Scrapiz makes it easy with doorstep pickup, instant payment, and best scrap rates. Whether you\'re in Dharavi, our team reaches you the same day.',
      
      whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Dharavi, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve Dharavi, covering areas like Kumbharwada, Kala Killa, and the leather and pottery markets.',
      
      whyChooseDetails: 'Whether you want to sell scrap in Dharavi from your home, office, or shop, our team makes the process fast and hassle-free. From iron, steel, aluminum, and copper to plastic, paper, e-waste, and old furniture, we buy all types of scrap at the highest prices.',
      
      landmarks: [
        'Kumbharwada',
        'Kala Killa',
        'Mahim - Sion Link Road',
        'Dharavi Market',
        'Leather Market',
        'Pottery Market'
      ],
      
      subAreas: [
        'Kumbharwada',
        'Kala Killa',
        'Naya Nagar',
        'Navrang Compound',
        'Dharavi Main Road',
        'Transit Camp'
      ],
      
      nearbyLocations: [
        { name: 'Mahim', slug: 'mahim' },
        { name: 'Bandra East', slug: 'bandra-east' },
        { name: 'Dharavi Koliwada', slug: 'dharavi-koliwada' }
      ]
    },
    
    keywords: {
      primary: 'scrap buyers in Dharavi',
      secondary: [
        'scrap dealer in Dharavi',
        'kabadiwala Dharavi',
        'scrap buyer near Kumbharwada',
        'sell scrap in Dharavi',
        'scrap pickup Dharavi',
        'best scrap rates Dharavi',
        'online scrap dealer Dharavi',
        'scrap collection Dharavi',
        'e-waste pickup Dharavi',
        'leather scrap buyer Dharavi',
        'scrap dealer near me Dharavi',
        'scrap recycling Dharavi'
      ]
    },
    
    seo: {
      title: 'Scrapiz Dharavi - Scrap Buying and Recycling Services',
      description: 'Sell your scrap in Dharavi with Scrapiz – reliable scrap buyers in Mumbai. We provide free pickup, digital weighing, and eco-friendly recycling',
      keywords: 'scrap dealer near me, scrap buyer, Dharavi, Mumbai, scrap recycling, best scrap rates, free pickup, Online kabadiwala, scrap dealer near me, scrap dealer in dharavi',
      canonical: 'https://www.scrapiz.in/dharavi'
    },
    images: {
      hero: '/optimized/Shop-No-07-Dharavi.webp',
      alt: 'Scrapiz Dharavi Shop'
    }
  },

  dharaviKoliwada: {
    id: 'dharavi-koliwada',
    name: 'Dharavi Koliwada',
    displayName: 'Dharavi Koliwada',
    slug: 'dharavi-koliwada',
    
    nap: {
      businessName: 'Scrapiz Dharavi Koliwada - Scrap Buying and Recycling Services',
      address: {
        street: 'Shop No, 13, Machchhi Gali, Baba Saheb Ambedkar Chawl, Dharavi',
        locality: 'Mumbai',
        region: 'Maharashtra',
        postalCode: '400017',
        fullAddress: 'Shop No, 13, Machchhi Gali, Baba Saheb Ambedkar Chawl, Dharavi, Mumbai, Maharashtra 400017'
      },
      phone: '+919004826378',
      phoneDisplay: '9004826378',
      email: 'Contact@scrapiz.in',
      hours: [
        { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
      ]
    },
    
    geo: {
      latitude: 19.0380,
      longitude: 72.8520,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.0!2d72.8520!3d19.0380!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c929153d64bb%3A0x85a35777d177a926!2sScrapiz%20Dharavi%20Koliwada!5e0!3m2!1sen!2sin!4v1757275419127!5m2!1sen!2sin'
    },
    
    content: {
      heroTitle: 'Scrapiz Dharavi Koliwada',
      heroDescription: 'Premium scrap buying and recycling services in Dharavi Koliwada, Mumbai. Located near Machchhi Gali and Baba Saheb Ambedkar Chawl, we offer the best rates for all types of scrap materials.',
      
      whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Dharavi Koliwada, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve Dharavi Koliwada, covering the Koliwada Fishing Village and surrounding areas near Dharavi Creek.',
      
      whyChooseDetails: 'Whether you want to sell scrap in Dharavi Koliwada from your home, office, or shop near Mahim Creek, our team makes the process fast and hassle-free. From iron, steel, aluminum, and copper to plastic, paper, e-waste, and old furniture, we buy all types of scrap at the highest prices.',
      
      landmarks: [
        'Machchhi Gali',
        'Baba Saheb Ambedkar Chawl',
        'Koliwada Fishing Village',
        'Dharavi Creek',
        'Mahim Creek'
      ],
      
      subAreas: [
        'Dharavi Koliwada',
        'Machchhi Gali',
        'Baba Saheb Ambedkar Chawl',
        'Fishing Village Area',
        'Creek Side'
      ],
      
      nearbyLocations: [
        { name: 'Dharavi', slug: 'dharavi' },
        { name: 'Mahim', slug: 'mahim' },
        { name: 'Bandra East', slug: 'bandra-east' }
      ]
    },
    
    keywords: {
      primary: 'scrap buyers in Dharavi Koliwada',
      secondary: [
        'scrap dealer in Dharavi Koliwada',
        'kabadiwala Dharavi Koliwada',
        'scrap buyer near Machchhi Gali',
        'sell scrap in Dharavi Koliwada',
        'scrap pickup Dharavi Koliwada',
        'best scrap rates Dharavi Koliwada',
        'online scrap dealer Dharavi Koliwada',
        'scrap collection Dharavi Koliwada',
        'e-waste pickup Dharavi Koliwada',
        'Koliwada scrap buyer',
        'scrap dealer near me Dharavi Koliwada',
        'scrap recycling Dharavi Koliwada'
      ]
    },
    
    seo: {
      title: 'Scrapiz Dharavi Koliwada - Scrap Buying and Recycling Services',
      description: 'Premium scrap buying and recycling services in Dharavi Koliwada, Mumbai. We offer the best rates for all types of scrap materials.',
      keywords: 'scrap buyer, Dharavi Koliwada, Mumbai, scrap recycling, best scrap rates, free pickup',
      canonical: 'https://www.scrapiz.in/dharavi-koliwada'
    },
    images: {
      hero: '/optimized/Dharavi-Koliwada.webp',
      alt: 'Scrapiz Dharavi Koliwada Shop'
    }
  },

  goregaon: {
    id: 'goregaon',
    name: 'Goregaon',
    displayName: 'Goregaon',
    slug: 'goregaon',
    
    nap: {
      businessName: 'Scrapiz Goregaon - Scrap Buyers & Scrap Dealers in Mumbai',
      address: {
        street: 'Shop No 04, Motilal Nagar No. 1, behind Fire Brigade, Goregaon West',
        locality: 'Mumbai',
        region: 'Maharashtra',
        postalCode: '400104',
        fullAddress: 'Shop No 04, Motilal Nagar No. 1, behind Fire Brigade, Goregaon West, Mumbai, Maharashtra 400104'
      },
      phone: '+918828671305',
      phoneDisplay: '8828671305',
      email: 'Contact@scrapiz.in',
      hours: [
        { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
      ]
    },
    
    geo: {
      latitude: 19.1535765,
      longitude: 72.78687398187212,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57947.63762767882!2d72.78687398187212!3d19.1535765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7dea0834aaf%3A0xffbd0210bacc024c!2sScrapiz!5e1!3m2!1sen!2sin!4v1757270779121!5m2!1sen!2sin'
    },
    
    content: {
      heroTitle: 'Scrap buyers in Goregaon',
      heroDescription: 'Looking to sell scrap in Goregaon? Scrapiz makes it easy with doorstep pickup, instant payment, and best scrap rates.Whether you\'re in Goregaon West or Goregaon East. our team reaches you the same day.',
      
      whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Goregaon, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve Goregaon West, covering areas like Oshiwara, Motilal Nagar, and Bangur Nagar.',
      
      whyChooseDetails: 'Whether you want to sell scrap in Goregaon from your home, office, or shop, our team makes the process fast and hassle-free. From iron, steel, aluminum, and copper to plastic, paper, e-waste, and old furniture, we buy all types of scrap at the highest prices.',
      
      landmarks: [
        'Oshiwara',
        'Motilal Nagar',
        'Bangur Nagar',
        'Film City Road',
        'Goregaon Sports Club',
        'Oberoi Mall'
      ],
      
      subAreas: [
        'Goregaon West',
        'Goregaon East',
        'Oshiwara',
        'Motilal Nagar',
        'Bangur Nagar',
        'Jawahar Nagar',
        'Vanrai Colony'
      ],
      
      nearbyLocations: [
        { name: 'Jogeshwari', slug: 'jogeshwari' },
        { name: 'Kandivali', slug: 'kandivali' },
        { name: 'Malad', slug: 'malad' }
      ]
    },
    
    keywords: {
      primary: 'scrap buyers in Goregaon',
      secondary: [
        'scrap dealer in Goregaon',
        'kabadiwala Goregaon',
        'scrap buyer near Oshiwara',
        'sell scrap in Goregaon West',
        'scrap pickup Goregaon East',
        'best scrap rates Goregaon',
        'online scrap dealer Goregaon',
        'scrap collection Goregaon',
        'e-waste pickup Goregaon',
        'Motilal Nagar scrap buyer',
        'scrap dealer near me Goregaon',
        'scrap recycling Goregaon'
      ]
    },
    
    seo: {
      title: 'Scrapiz Goregaon - Scrap Buying and Recycling Services',
      description: 'Sell your scrap in Goregaon with Scrapiz – reliable scrap buyers in Mumbai. We provide free pickup, digital weighing, and eco-friendly recycling',
      keywords: 'scrap buyer, Goregaon, Mumbai, scrap recycling, best scrap rates, free pickup, Online kabadiwala, scrap dealer near me, scrap dealer in goregaon',
      canonical: 'https://www.scrapiz.in/goregaon'
    },
    images: {
      hero: '/optimized/Scrapiz-Goregaon.webp',
      alt: 'Scrapiz Goregaon Shop'
    }
  },

  jogeshwari: {
    id: 'jogeshwari',
    name: 'Jogeshwari',
    displayName: 'Jogeshwari',
    slug: 'jogeshwari',
    
    nap: {
      businessName: 'Scrapiz Jogeshwari - Scrap Buyers & Scrap Dealers in Mumbai',
      address: {
        street: 'Shop No 08, A K Compound, Behram Baug Rd, near Tech Web Center, Anand Nagar, Jogeshwari West',
        locality: 'Mumbai',
        region: 'Maharashtra',
        postalCode: '400102',
        fullAddress: 'Shop No 08, A K Compound, Behram Baug Rd, near Tech Web Center, Anand Nagar, Jogeshwari West, Mumbai, Maharashtra 400102'
      },
      phone: '+917607803670',
      phoneDisplay: '7607803670',
      email: 'Contact@scrapiz.in',
      hours: [
        { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
      ]
    },
    
    geo: {
      latitude: 19.14779949999999,
      longitude: 72.81720808715819,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14487.416669682882!2d72.81720808715819!3d19.14779949999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b76fbfb1cb87%3A0xa21b6aa43e2b02af!2sScrapiz!5e1!3m2!1sen!2sin!4v1757269451930!5m2!1sen!2sin'
    },
    
    content: {
      heroTitle: 'Scrap buyers in Jogeshwari',
      heroDescription: 'Looking to sell scrap in Jogeshwari? Scrapiz makes it easy with doorstep pickup, instant payment, and best scrap rates.Whether you\'re in Jogeshwari West or Jogeshwari East. our team reaches you the same day.',
      
      whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Jogeshwari, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve both Jogeshwari East and Jogeshwari West, covering areas like RM Road, Gulshan Nagar, Anand Nagar, and Badi Masjid.',
      
      whyChooseDetails: 'Whether you want to sell scrap in Jogeshwari from your home, office, or shop, our team makes the process fast and hassle-free. From iron, steel, aluminum, and copper to plastic, paper, e-waste, and old furniture, we buy all types of scrap at the highest prices.',
      
      landmarks: [
        'RM Road',
        'Gulshan Nagar',
        'Anand Nagar',
        'Badi Masjid',
        'Behram Baug Road',
        'Jogeshwari Caves'
      ],
      
      subAreas: [
        'Jogeshwari West',
        'Jogeshwari East',
        'Anand Nagar',
        'Gulshan Nagar',
        'RM Road',
        'Behram Baug',
        'Meghwadi'
      ],
      
      nearbyLocations: [
        { name: 'Goregaon', slug: 'goregaon' },
        { name: 'Kandivali', slug: 'kandivali' },
        { name: 'Andheri', slug: 'andheri' }
      ]
    },
    
    keywords: {
      primary: 'scrap buyers in Jogeshwari',
      secondary: [
        'scrap dealer in Jogeshwari',
        'kabadiwala Jogeshwari',
        'scrap buyer near RM Road',
        'sell scrap in Jogeshwari West',
        'scrap pickup Jogeshwari East',
        'best scrap rates Jogeshwari',
        'online scrap dealer Jogeshwari',
        'scrap collection Jogeshwari',
        'e-waste pickup Jogeshwari',
        'Anand Nagar scrap buyer',
        'scrap dealer near me Jogeshwari',
        'scrap recycling Jogeshwari'
      ]
    },
    
    seo: {
      title: 'Scrapiz Jogeshwari - Scrap Buying and Recycling Services',
      description: 'Sell your scrap in Jogeshwari with Scrapiz – reliable scrap buyers in Mumbai. We provide free pickup, digital weighing, and eco-friendly recycling',
      keywords: 'scrap buyer, Jogeshwari, Mumbai, scrap recycling, best scrap rates, free pickup, Online kabadiwala, scrap dealer near me, scrap dealer in jogeshwari',
      canonical: 'https://www.scrapiz.in/jogeshwari'
    },
    images: {
      hero: '/optimized/Scrapiz-Jogeshwari.webp',
      alt: 'Scrapiz Jogeshwari'
    }
  },

  kandivali: {
    id: 'kandivali',
    name: 'Kandivali',
    displayName: 'Kandivali',
    slug: 'kandivali',
    
    nap: {
      businessName: 'Scrapiz Kandivali - Scrap Buyers & Scrap Dealers in Mumbai',
      address: {
        street: 'Shop No 11, Durga Seva Samiti, behind Krishna Hotel, Kandivali, Bhut Nagar, Kandivali West',
        locality: 'Mumbai',
        region: 'Maharashtra',
        postalCode: '400067',
        fullAddress: 'Shop No 11, Durga Seva Samiti, behind Krishna Hotel, Kandivali, Bhut Nagar, Kandivali West, Mumbai, Maharashtra 400067'
      },
      phone: '+918828700630',
      phoneDisplay: '8828700630',
      email: 'Contact@scrapiz.in',
      hours: [
        { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
      ]
    },
    
    geo: {
      latitude: 19.21252062847649,
      longitude: 72.80468673779062,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40960.504554249266!2d72.80468673779062!3d19.21252062847649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7b863069eed%3A0x561c3b72781efc45!2sScrapiz!5e1!3m2!1sen!2sin!4v1757270630424!5m2!1sen!2sin'
    },
    
    content: {
      heroTitle: 'Scrap buyers in Kandivali',
      heroDescription: 'Looking to sell scrap in Kandivali? Scrapiz makes it easy with doorstep pickup, instant payment, and best scrap rates. Whether you\'re in Kandivali West near Thakur Complex or Kandivali East, our team reaches you the same day.',
      
      whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Kandivali, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve Kandivali, covering areas like Thakur Complex, Bhut Nagar, and Mahavir Nagar.',
      
      whyChooseDetails: 'Whether you want to sell scrap in Kandivali from your home, office, or shop near Poisar or Akurli Road, our team makes the process fast and hassle-free. From iron, steel, aluminum, and copper to plastic, paper, e-waste, and old furniture, we buy all types of scrap at the highest prices.',
      
      landmarks: [
        'Bhut Nagar',
        'Thakur Complex',
        'Kandivali Station',
        'Mahavir Nagar',
        'Poisar',
        'Akurli Road'
      ],
      
      subAreas: [
        'Kandivali West',
        'Kandivali East',
        'Bhut Nagar',
        'Thakur Complex',
        'Mahavir Nagar',
        'Poisar',
        'Akurli Road',
        'Lokhandwala'
      ],
      
      nearbyLocations: [
        { name: 'Goregaon', slug: 'goregaon' },
        { name: 'Jogeshwari', slug: 'jogeshwari' },
        { name: 'Borivali', slug: 'borivali' }
      ]
    },
    
    keywords: {
      primary: 'scrap buyers in Kandivali',
      secondary: [
        'scrap dealer in Kandivali',
        'kabadiwala Kandivali',
        'scrap buyer near Thakur Complex',
        'sell scrap in Kandivali West',
        'scrap pickup Kandivali East',
        'best scrap rates Kandivali',
        'online scrap dealer Kandivali',
        'scrap collection Kandivali',
        'e-waste pickup Kandivali',
        'Bhut Nagar scrap buyer',
        'scrap dealer near me Kandivali',
        'scrap recycling Kandivali'
      ]
    },
    
    seo: {
      title: 'Scrapiz Kandivali - Scrap Buying and Recycling Services',
      description: 'Sell your scrap in Kandivali with Scrapiz – reliable scrap buyers in Mumbai. We provide free pickup, digital weighing, and eco-friendly recycling',
      keywords: 'scrap buyer, Kandivali, Mumbai, scrap recycling, best scrap rates, free pickup, Online kabadiwala, scrap dealer near me, scrap dealer in kandivali',
      canonical: 'https://www.scrapiz.in/kandivali'
    },
    images: {
      hero: '/optimized/Scrapiz-Kandivali.webp',
      alt: 'Scrapiz Kandivali Shop'
    }
  },

  mahim: {
    id: 'mahim',
    name: 'Mahim',
    displayName: 'Mahim',
    slug: 'mahim',
    
    nap: {
      businessName: 'Scrapiz Mahim - Scrap Buyers & Scrap Dealers in Mumbai',
      address: {
        street: 'Shop No 1, Mustafa Building, Old Cadel Rd, Kapad Bazar, Mahim West, Mahim',
        locality: 'Mumbai',
        region: 'Maharashtra',
        postalCode: '400016',
        fullAddress: 'Shop No 1, Mustafa Building, Old Cadel Rd, Kapad Bazar, Mahim West, Mahim, Mumbai, Maharashtra 400016'
      },
      phone: '+919920389656',
      phoneDisplay: '9920389656',
      email: 'Contact@scrapiz.in',
      hours: [
        { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
      ]
    },
    
    geo: {
      latitude: 19.02741548711588,
      longitude: 72.84156431489993,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.823939158654!2d72.84156431489993!3d19.02741548711588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce87393430c3%3A0x88df6933589a16b!2sScrapiz%20-%20Scrap%20Dealer%20in%20Mahim!5e0!3m2!1sen!2sin!4v1676903212894!5m2!1sen!2sin'
    },
    
    content: {
      heroTitle: 'Scrap buyers in Mahim',
      heroDescription: 'Looking to sell scrap in Mahim? Scrapiz makes it easy with doorstep pickup, instant payment, and best scrap rates. Whether you\'re in Mahim West or Mahim East, our team reaches you the same day.',
      
      whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Mahim, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve Mahim, covering areas like Mahim Bay, Shivaji Park, and Hindu Colony.',
      
      whyChooseDetails: 'Whether you want to sell scrap in Mahim from your home, office, or shop, our team makes the process fast and hassle-free. From iron, steel, aluminum, and copper to plastic, paper, e-waste, and old furniture, we buy all types of scrap at the highest prices.',
      
      landmarks: [
        'Mahim Bay',
        'Shivaji Park',
        'Hindu Colony',
        'Mahim Dargah',
        'Mahim Causeway',
        'Kapad Bazar'
      ],
      
      subAreas: [
        'Mahim West',
        'Mahim East',
        'Shivaji Park',
        'Hindu Colony',
        'Kapad Bazar',
        'Mahim Causeway',
        'Lady Jamshedji Road'
      ],
      
      nearbyLocations: [
        { name: 'Bandra', slug: 'bandra' },
        { name: 'Dharavi', slug: 'dharavi' },
        { name: 'Bandra East', slug: 'bandra-east' }
      ]
    },
    
    keywords: {
      primary: 'scrap buyers in Mahim',
      secondary: [
        'scrap dealer in Mahim',
        'kabadiwala Mahim',
        'scrap buyer near Shivaji Park',
        'sell scrap in Mahim West',
        'scrap pickup Mahim East',
        'best scrap rates Mahim',
        'online scrap dealer Mahim',
        'scrap collection Mahim',
        'e-waste pickup Mahim',
        'Mahim Bay scrap buyer',
        'scrap dealer near me Mahim',
        'scrap recycling Mahim'
      ]
    },
    
    seo: {
      title: 'Scrapiz Mahim - Scrap Buying and Recycling Services',
      description: 'Sell your scrap in Mahim with Scrapiz – reliable scrap buyers in Mumbai. We provide free pickup, digital weighing, and eco-friendly recycling',
      keywords: 'scrap buyer, Mahim, Mumbai, scrap recycling, best scrap rates, free pickup, Online kabadiwala, scrap dealer near me, scrap dealer in mahim',
      canonical: 'https://www.scrapiz.in/mahim'
    },
    images: {
      hero: '/optimized/Mahim-West.webp',
      alt: 'Scrapiz Mahim Shop'
    }
  },

  nalasopara: {
    id: 'nalasopara',
    name: 'Nalasopara',
    displayName: 'Nalasopara',
    slug: 'nalasopara',
    
    nap: {
      businessName: 'Scrapiz Nalasopara - Scrap Buyers & Scrap Dealers in Mumbai',
      address: {
        street: 'SHOP NO 16, PALSACHA PADA, PELHAR, VISHWAKARMA BAUG, Nala Sopara',
        locality: 'VASAI-VIRAR',
        region: 'Maharashtra',
        postalCode: '401208',
        fullAddress: 'SHOP NO 16, PALSACHA PADA, PELHAR, VISHWAKARMA BAUG, Nala Sopara, VASAI-VIRAR, Maharashtra 401208'
      },
      phone: '+919619814097',
      phoneDisplay: '9619814097',
      email: 'Contact@scrapiz.in',
      hours: [
        { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
        { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
      ]
    },
    
    geo: {
      latitude: 19.4501165,
      longitude: 72.8008333486328,
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57842.69335263032!2d72.8008333486328!3d19.4501165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7a96c76504d19%3A0xead93aa3edf31990!2sScrapiz!5e1!3m2!1sen!2sin!4v1757271109536!5m2!1sen!2sin'
    },
    
    content: {
      heroTitle: 'Scrap buyers in Nalasopara',
      heroDescription: 'Looking to sell scrap in Nalasopara? Scrapiz makes it easy with doorstep pickup, instant payment, and best scrap rates.Whether you\'re in Nalasopara West or Nalasopara East. our team reaches you the same day.',
      
      whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Nalasopara, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve both Nalasopara East and Nalasopara West, covering areas like Tulinj, and Nagindas Pada.',
      
      whyChooseDetails: 'Whether you want to sell scrap in Nalasopara from your home, office, or shop, our team makes the process fast and hassle-free. From iron, steel, aluminum, and copper to plastic, paper, e-waste, and old furniture, we buy all types of scrap at the highest prices.',
      
      landmarks: [
        'Tulinj',
        'Nagindas Pada',
        'Pelhar',
        'Vishwakarma Baug',
        'Nalasopara Station',
        'Achole Road'
      ],
      
      subAreas: [
        'Nalasopara West',
        'Nalasopara East',
        'Tulinj',
        'Nagindas Pada',
        'Pelhar',
        'Vishwakarma Baug',
        'Palsacha Pada'
      ],
      
      nearbyLocations: [
        { name: 'Vasai', slug: 'vasai' },
        { name: 'Virar', slug: 'virar' },
        { name: 'Bhayandar', slug: 'bhayandar' }
      ]
    },
    
    keywords: {
      primary: 'scrap buyers in Nalasopara',
      secondary: [
        'scrap dealer in Nalasopara',
        'kabadiwala Nalasopara',
        'scrap buyer near Tulinj',
        'sell scrap in Nalasopara West',
        'scrap pickup Nalasopara East',
        'best scrap rates Nalasopara',
        'online scrap dealer Nalasopara',
        'scrap collection Nalasopara',
        'e-waste pickup Nalasopara',
        'Pelhar scrap buyer',
        'scrap dealer near me Nalasopara',
        'scrap recycling Nalasopara'
      ]
    },
    
    seo: {
      title: 'Scrapiz Nalasopara - Scrap Buying and Recycling Services',
      description: 'Sell your scrap in Nalasopara with Scrapiz – reliable scrap buyers in Mumbai. We provide free pickup, digital weighing, and eco-friendly recycling',
      keywords: 'scrap buyer, Nalasopara, Mumbai, scrap recycling, best scrap rates, free pickup, Online kabadiwala, scrap dealer near me, scrap dealer in nalasopara',
      canonical: 'https://www.scrapiz.in/nalasopara'
    },
    images: {
      hero: '/optimized/Scrapiz-Nalasopara.webp',
      alt: 'Scrapiz Nalasopara Shop'
    }
  },
  
  andheriWest: {
  id: 'andheri-west',
  name: 'Andheri West',
  displayName: 'Andheri West',
  slug: 'andheri-west',
  
  nap: {
    businessName: 'Scrapiz Andheri West - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Andheri West',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Andheri West, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },
  
  geo: {
    latitude: 19.1234567,
    longitude: 72.8234567,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },
  
  content: {
    heroTitle: 'Scrap buyers in Andheri West',
    heroDescription: 'Looking to sell scrap in Andheri West? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Lokhandwala, Versova, DN Nagar, or Four Bungalows, our team reaches you the same day.',
    
    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Andheri West, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Lokhandwala, Versova, DN Nagar, Oshiwara, and Four Bungalows.',
    
    whyChooseDetails: 'Whether you want to sell scrap in Andheri West from your home, office, shop, or society, our team ensures a fast and hassle-free process. From iron, steel, aluminum, and copper to plastic, paper, e-waste, furniture, and appliances, we buy all types of scrap at the highest prices.',
    
    landmarks: [
      'Lokhandwala Market',
      'Infiniti Mall',
      'DN Nagar Metro Station',
      'Four Bungalows Market',
      'Yari Road',
      'Mega Mall Oshiwara',
      'Versova Beach',
      'Andheri Sports Complex'
    ],

    subAreas: [
      'Lokhandwala',
      'Versova',
      'DN Nagar',
      'Four Bungalows',
      'Oshiwara',
      'Juhu Lane',
      'Amboli',
      'Gilbert Hill',
      'Upper Juhu',
      'Andheri Link Road',
      'Yari Road',
      'JP Road',
      'Veera Desai Road',
      'New Link Road'
    ],

    nearbyLocations: [
      { name: 'Jogeshwari', slug: 'jogeshwari' },
      { name: 'Goregaon', slug: 'goregaon' },
      { name: 'Vile Parle', slug: 'vile-parle' }
    ]
  },
  
  keywords: {
    primary: 'scrap buyers in Andheri West',
    secondary: [
      'scrap dealer in Andheri West',
      'kabadiwala Andheri West',
      'scrap buyer near Lokhandwala',
      'sell scrap in Andheri West',
      'scrap pickup Versova',
      'best scrap rates Andheri West',
      'online scrap dealer Andheri',
      'scrap collection Andheri West',
      'e-waste pickup Andheri West',
      'scrap dealer near me Andheri West',
      'scrap recycling Andheri West'
    ]
  },
  
  seo: {
    title: 'Scrap Buyer in Andheri West & Best Price | Scrapiz',
    description: 'Sell scrap in Andheri West with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer andheri west, scrap buyer andheri, kabadiwala andheri west, sell scrap andheri, scrap pickup lokhandwala, versova scrap dealer',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-andheri-west'
  },
  
  images: {
    hero: '/optimized/Scrapiz-Andheri-West.webp',
    alt: 'Scrapiz Andheri West Scrap Shop'
  }
},

andheriEast: {
  id: 'andheri-east',
  name: 'Andheri East',
  displayName: 'Andheri East',
  slug: 'andheri-east',
  
  nap: {
    businessName: 'Scrapiz Andheri East - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Andheri East',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Andheri East, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.1197,
    longitude: 72.8682,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },
  
  content: {
    heroTitle: 'Scrap buyers in Andheri East',
    heroDescription: 'Looking to sell scrap in Andheri East? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Chakala, Marol, Saki Naka, or JB Nagar, our team reaches you the same day.',
    
    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Andheri East, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Chakala, Marol, Saki Naka, MIDC, and JB Nagar.',
    
    whyChooseDetails: 'Whether you want to sell scrap in Andheri East from your home, office, shop, or society, our team ensures a fast and hassle-free process. From iron, steel, aluminum, and copper to plastic, paper, e-waste, furniture, and appliances, we buy all types of scrap at the highest prices.',
    
    landmarks: [
      'Andheri Railway Station',
      'WEH Metro Station',
      'Saki Naka Junction',
      'Marol Naka',
      'MIDC Andheri',
      'Chakala Market',
      'JB Nagar Market',
      'Andheri Sports Complex'
    ],

    subAreas: [
      'Chakala',
      'Marol',
      'Saki Naka',
      'JB Nagar',
      'MIDC',
      'Andheri Kurla Road',
      'Sahar',
      'Airport Area',
      'WEH Metro',
      'Asalpha',
      'Gundavali',
      'Vijay Nagar',
      'Marol Naka',
      'Kondivita',
      'Pump House'
    ],

    nearbyLocations: [
      { name: 'Andheri West', slug: 'andheri-west' },
      { name: 'Jogeshwari', slug: 'jogeshwari' },
      { name: 'Vile Parle', slug: 'vile-parle' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Andheri East',
    secondary: [
      'scrap dealer in Andheri East',
      'kabadiwala Andheri East',
      'scrap buyer near Chakala',
      'sell scrap in Andheri East',
      'scrap pickup Marol',
      'best scrap rates Andheri East',
      'online scrap dealer Andheri East',
      'scrap collection Andheri East',
      'e-waste pickup Andheri East',
      'scrap dealer near me Andheri East',
      'scrap recycling Andheri East'
    ]
  },
  
  seo: {
    title: 'Scrap Buyer in Andheri East & Best Price | Scrapiz',
    description: 'Sell scrap in Andheri East with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer andheri east, scrap buyer andheri east, kabadiwala andheri east, sell scrap andheri east, scrap pickup andheri east',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-andheri-east'
  },
  
  images: {
    hero: '/optimized/Scrapiz-Andheri-East.webp',
    alt: 'Scrapiz Andheri East Scrap Shop'
  }
},

bhandup: {
  id: 'bhandup',
  name: 'Bhandup',
  displayName: 'Bhandup',
  slug: 'bhandup',

  nap: {
    businessName: 'Scrapiz Bhandup - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Bhandup',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Bhandup, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.1458,
    longitude: 72.9394,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },
  
  content: {
    heroTitle: 'Scrap buyers in Bhandup',
    heroDescription: 'Looking to sell scrap in Bhandup? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Bhandup East, Kanjur Marg, Nahur, or Sonapur, our team reaches you the same day.',
    
    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Bhandup, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Bhandup East, Bhandup West, Kanjur Marg, Nahur, and LBS Marg.',
    
    whyChooseDetails: 'Whether you want to sell scrap in Bhandup from your home, office, shop, or society, our team ensures a fast and hassle-free process. From iron, steel, aluminum, and copper to plastic, paper, e-waste, furniture, and appliances, we buy all types of scrap at the highest prices.',
    
    landmarks: [
      'Bhandup Railway Station',
      'Kanjur Marg Station',
      'Bhandup Village',
      'Sonapur Market',
      'LBS Marg',
      'Powai Link Road',
      'Nahur Junction',
      'Godrej Hill'
    ],
    
    subAreas: [
      'Bhandup Station',
      'Bhandup East',
      'Bhandup West',
      'Kanjur Marg',
      'LBS Marg',
      'Sonapur',
      'Bhandup Village',
      'Powai Link Road',
      'Vikhroli Link Road',
      'Nahur',
      'Mulund Link Road',
      'Bhandup Industrial Estate',
      'Kannamwar Nagar',
      'Kanjur Village',
      'Godrej Hill'
    ],
    
    nearbyLocations: [
      { name: 'Mulund', slug: 'mulund' },
      { name: 'Kanjurmarg', slug: 'kanjurmarg' },
      { name: 'Vikhroli', slug: 'vikhroli' }
    ]
  },
  
  keywords: {
    primary: 'scrap buyers in Bhandup',
    secondary: [
      'scrap dealer in Bhandup',
      'kabadiwala Bhandup',
      'scrap buyer near Bhandup East',
      'sell scrap in Bhandup',
      'scrap pickup Kanjur Marg',
      'best scrap rates Bhandup',
      'online scrap dealer Bhandup',
      'scrap collection Bhandup',
      'e-waste pickup Bhandup',
      'scrap dealer near me Bhandup',
      'scrap recycling Bhandup'
    ]
  },

  seo: {
    title: 'Scrap Dealer in Bhandup – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Bhandup with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer bhandup, scrap buyer bhandup, kabadiwala bhandup, sell scrap bhandup, scrap pickup bhandup',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-bhandup'
  },
  
  images: {
    hero: '/optimized/Scrapiz-Bhandup.webp',
    alt: 'Scrapiz Bhandup Scrap Shop'
  }
},

byculla: {
  id: 'byculla',
  name: 'Byculla',
  displayName: 'Byculla',
  slug: 'byculla',
  
  nap: {
    businessName: 'Scrapiz Byculla - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Byculla',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Byculla, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 18.9796,
    longitude: 72.8326,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },
  
  content: {
    heroTitle: 'Scrap buyers in Byculla',
    heroDescription: 'Looking to sell scrap in Byculla? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Mazgaon, Agripada, Dockyard Road, or Sandhurst Road, our team reaches you the same day.',
    
    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Byculla, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Mazgaon, Agripada, Dockyard Road, Sandhurst Road, and Mandvi.',
    
    whyChooseDetails: 'Whether you want to sell scrap in Byculla from your home, office, shop, or society, our team ensures a fast and hassle-free process. From iron, steel, aluminum, and copper to plastic, paper, e-waste, furniture, and appliances, we buy all types of scrap at the highest prices.',
    
    landmarks: [
      'Byculla Railway Station',
      'Byculla Zoo',
      'Gloria Church',
      'Mazgaon Dock',
      'Dockyard Road Station',
      'Sandhurst Road Station',
      'Agripada Market',
      'Jijamata Udyan'
    ],

    subAreas: [
      'Byculla Station',
      'Byculla East',
      'Byculla West',
      'Mazgaon',
      'Dockyard Road',
      'Sandhurst Road',
      'Agripada',
      'Clare Road',
      'Mandvi',
      'Bharat Nagar',
      'Gloria Church Area',
      'Byculla Zoo Area',
      'Nesbit Road',
      'Jijamata Udyan',
      'Mazgaon Dock'
    ],
    
    nearbyLocations: [
      { name: 'Mazgaon', slug: 'mazgaon' },
      { name: 'Agripada', slug: 'agripada' },
      { name: 'Mumbai Central', slug: 'mumbai-central' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Byculla',
    secondary: [
      'scrap dealer in Byculla',
      'kabadiwala Byculla',
      'scrap buyer near Mazgaon',
      'sell scrap in Byculla',
      'scrap pickup Agripada',
      'best scrap rates Byculla',
      'online scrap dealer Byculla',
      'scrap collection Byculla',
      'e-waste pickup Byculla',
      'scrap dealer near me Byculla',
      'scrap recycling Byculla'
    ]
  },

  seo: {
    title: 'Scrap Dealer in Byculla – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Byculla with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer byculla, scrap buyer byculla, kabadiwala byculla, sell scrap byculla, scrap pickup byculla',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-byculla'
  },
  
  images: {
    hero: '/optimized/Scrapiz-Byculla.webp',
    alt: 'Scrapiz Byculla Scrap Shop'
  }
},

chembur: {
  id: 'chembur',
  name: 'Chembur',
  displayName: 'Chembur',
  slug: 'chembur',
  
  nap: {
    businessName: 'Scrapiz Chembur - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Chembur',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Chembur, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },
  
  geo: {
    latitude: 19.0622,
    longitude: 72.8993,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },
  
  content: {
    heroTitle: 'Scrap buyers in Chembur',
    heroDescription: 'Looking to sell scrap in Chembur? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Tilak Nagar, Deonar, Govandi, or Mankhurd, our team reaches you the same day.',
    
    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Chembur, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Tilak Nagar, Deonar, Govandi, Mankhurd, and Sindhi Society.',

    whyChooseDetails: 'Whether you want to sell scrap in Chembur from your home, office, shop, or society, our team ensures a fast and hassle-free process. From iron, steel, aluminum, and copper to plastic, paper, e-waste, furniture, and appliances, we buy all types of scrap at the highest prices.',
    
    landmarks: [
      'Chembur Railway Station',
      'Chembur Naka',
      'Tilak Nagar Market',
      'RCF Colony',
      'Diamond Garden',
      'Basant Park',
      'Sindhi Society',
      'Chembur Camp'
    ],

    subAreas: [
      'Chembur Station',
      'Chembur East',
      'Chembur West',
      'Tilak Nagar',
      'Deonar',
      'Govandi',
      'Mankhurd',
      'VN Purav Marg',
      'Swami Samarth Nagar',
      'Sindhi Society',
      'RCF Colony',
      'Basant Park',
      'Diamond Garden',
      'Chembur Camp',
      'Mahul Road'
    ],

    nearbyLocations: [
      { name: 'Govandi', slug: 'govandi' },
      { name: 'Mankhurd', slug: 'mankhurd' },
      { name: 'Kurla', slug: 'kurla' }
    ]
  },
  
  keywords: {
    primary: 'scrap buyers in Chembur',
    secondary: [
      'scrap dealer in Chembur',
      'kabadiwala Chembur',
      'scrap buyer near Tilak Nagar',
      'sell scrap in Chembur',
      'scrap pickup Govandi',
      'best scrap rates Chembur',
      'online scrap dealer Chembur',
      'scrap collection Chembur',
      'e-waste pickup Chembur',
      'scrap dealer near me Chembur',
      'scrap recycling Chembur'
    ]
  },

  seo: {
    title: 'Scrap Dealer in Chembur – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Chembur with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer chembur, scrap buyer chembur, kabadiwala chembur, sell scrap chembur, scrap pickup chembur',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-chembur'
  },
  
  images: {
    hero: '/optimized/Scrapiz-Chembur.webp',
    alt: 'Scrapiz Chembur Scrap Shop'
  }
},

colaba: {
  id: 'colaba',
  name: 'Colaba',
  displayName: 'Colaba',
  slug: 'colaba',
  
  nap: {
    businessName: 'Scrapiz Colaba - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Colaba',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Colaba, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },
  
  geo: {
    latitude: 18.9067,
    longitude: 72.8147,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },
  
  content: {
    heroTitle: 'Scrap buyers in Colaba',
    heroDescription: 'Looking to sell scrap in Colaba? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Cuffe Parade, Navy Nagar, or Colaba Causeway, our team reaches you the same day.',
    
    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Colaba, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Cuffe Parade, Navy Nagar, Badhwar Park, and Colaba Market.',
    
    whyChooseDetails: 'Whether you want to sell scrap in Colaba from your home, office, shop, or society, our team ensures a fast and hassle-free process. From iron, steel, aluminum, and copper to plastic, paper, e-waste, furniture, and appliances, we buy all types of scrap at the highest prices.',

    landmarks: [
      'Gateway of India',
      'Taj Mahal Palace Hotel',
      'Colaba Causeway',
      'Regal Cinema',
      'Sassoon Dock',
      'Cuffe Parade',
      'World Trade Center',
      'Afghan Church'
    ],

    subAreas: [
      'Colaba Causeway',
      'Cuffe Parade',
      'Navy Nagar',
      'Badhwar Park',
      'Colaba Market',
      'Sassoon Dock',
      'Gateway of India',
      'Regal Cinema Area',
      'Wodehouse Road',
      'Strand Road',
      'Apollo Bunder',
      'World Trade Center',
      'Taj Mahal Hotel Area',
      'Colaba Bus Depot',
      'Afghan Church'
    ],

    nearbyLocations: [
      { name: 'Nariman Point', slug: 'nariman-point' },
      { name: 'Churchgate', slug: 'churchgate' },
      { name: 'Fort', slug: 'fort' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Colaba',
    secondary: [
      'scrap dealer in Colaba',
      'kabadiwala Colaba',
      'scrap buyer near Cuffe Parade',
      'sell scrap in Colaba',
      'scrap pickup Navy Nagar',
      'best scrap rates Colaba',
      'online scrap dealer Colaba',
      'scrap collection Colaba',
      'e-waste pickup Colaba',
      'scrap dealer near me Colaba',
      'scrap recycling Colaba'
    ]
  },

  seo: {
    title: 'Scrap Dealer in Colaba – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Colaba with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer colaba, scrap buyer colaba, kabadiwala colaba, sell scrap colaba, scrap pickup colaba',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-colaba'
  },
  
  images: {
    hero: '/optimized/Scrapiz-Colaba.webp',
    alt: 'Scrapiz Colaba Scrap Shop'
  }
},

cst: {
  id: 'cst',
  name: 'CST',
  displayName: 'CST',
  slug: 'cst',
  
  nap: {
    businessName: 'Scrapiz CST - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, CST',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, CST, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },
  
  geo: {
    latitude: 18.9398,
    longitude: 72.8355,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },
  
  content: {
    heroTitle: 'Scrap buyers in CST',
    heroDescription: 'Looking to sell scrap in CST? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Fort, Kala Ghoda, Ballard Estate, or Churchgate, our team reaches you the same day.',
    
    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in CST, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Fort, Kala Ghoda, Ballard Estate, and Marine Lines.',
    
    whyChooseDetails: 'Whether you want to sell scrap in CST from your home, office, shop, or society, our team ensures a fast and hassle-free process. From iron, steel, aluminum, and copper to plastic, paper, e-waste, furniture, and appliances, we buy all types of scrap at the highest prices.',
    
    landmarks: [
      'CST Railway Station',
      'Flora Fountain',
      'Horniman Circle',
      'Azad Maidan',
      'Kala Ghoda',
      'Ballard Estate',
      'Mantralaya',
      'BMC Building'
    ],

    subAreas: [
      'CST Station',
      'Chhatrapati Shivaji Terminus',
      'Fort',
      'Kala Ghoda',
      'Ballard Estate',
      'Azad Maidan',
      'Cross Maidan',
      'Horniman Circle',
      'Flora Fountain',
      'VT Area',
      'DN Road',
      'Mahatma Gandhi Road',
      'Churchgate',
      'Marine Lines',
      'Mantralaya'
    ],

    nearbyLocations: [
      { name: 'Fort', slug: 'fort' },
      { name: 'Churchgate', slug: 'churchgate' },
      { name: 'Marine Lines', slug: 'marine-lines' }
    ]
  },
  
  keywords: {
    primary: 'scrap buyers in CST',
    secondary: [
      'scrap dealer in CST',
      'kabadiwala CST',
      'scrap buyer near Fort Mumbai',
      'sell scrap in CST',
      'scrap pickup Churchgate',
      'best scrap rates CST',
      'online scrap dealer CST',
      'scrap collection CST',
      'e-waste pickup CST',
      'scrap dealer near me CST',
      'scrap recycling CST'
    ]
  },
  
  seo: {
    title: 'Scrap Buyer in CST Mumbai – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in CST with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer cst, scrap buyer cst, kabadiwala cst, sell scrap cst, scrap pickup cst',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-cst'
  },
  
  images: {
    hero: '/optimized/Scrapiz-CST.webp',
    alt: 'Scrapiz CST Scrap Shop'
  }
}
,

dadarEast: {
  id: 'dadar-east',
  name: 'Dadar East',
  displayName: 'Dadar East',
  slug: 'dadar-east',
  
  nap: {
    businessName: 'Scrapiz Dadar East - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Dadar East',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Dadar East, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.0189,
    longitude: 72.8478,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },
  
  content: {
    heroTitle: 'Scrap buyers in Dadar East',
    heroDescription: 'Looking to sell scrap in Dadar East? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Parel, Naigaon, Wadala, or Sewri, our team reaches you the same day.',
    
    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Dadar East, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Parel, Naigaon, Wadala, Antop Hill, and Dadar TT.',
    
    whyChooseDetails: 'Whether you want to sell scrap in Dadar East from your home, office, shop, or society, our team ensures a fast and hassle-free process. From iron, steel, aluminum, and copper to plastic, paper, e-waste, furniture, and appliances, we buy all types of scrap at the highest prices.',
    
    landmarks: [
      'Dadar Railway Station',
      'Dadar Flower Market',
      'Dadar TT Circle',
      'Portuguese Church',
      'Hindmata Cinema',
      'Kohinoor Mills',
      'Tilak Bridge',
      'Kabutarkhana'
    ],

    subAreas: [
      'Dadar Station East',
      'Dadar TT',
      'Parel',
      'Naigaon',
      'Sewri',
      'Wadala',
      'Antop Hill',
      'Kohinoor Mills',
      'Hindmata',
      'Portuguese Church',
      'Dadar Market',
      'Tilak Bridge',
      'Kabutarkhana',
      'Dadar Parsi Colony',
      'Dadar Flower Market'
    ],

    nearbyLocations: [
      { name: 'Dadar West', slug: 'dadar-west' },
      { name: 'Parel', slug: 'parel' },
      { name: 'Wadala', slug: 'wadala' }
    ]
  },
  
  keywords: {
    primary: 'scrap buyers in Dadar East',
    secondary: [
      'scrap dealer in Dadar East',
      'kabadiwala Dadar East',
      'scrap buyer near Parel',
      'sell scrap in Dadar East',
      'scrap pickup Wadala',
      'best scrap rates Dadar East',
      'online scrap dealer Dadar East',

      'scrap collection Dadar East',
      'e-waste pickup Dadar East',
      'scrap dealer near me Dadar East',
      'scrap recycling Dadar East'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Dadar East – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Dadar East with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer dadar east, scrap buyer dadar east, kabadiwala dadar east, sell scrap dadar east, scrap pickup dadar east',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-dadar-east'
  },

  images: {
    hero: '/optimized/Scrapiz-Dadar-East.webp',
    alt: 'Scrapiz Dadar East Scrap Shop'
  }
},

dadarWest: {
  id: 'dadar-west',
  name: 'Dadar West',
  displayName: 'Dadar West',
  slug: 'dadar-west',

  nap: {
    businessName: 'Scrapiz Dadar West - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Dadar West',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Dadar West, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.0176,
    longitude: 72.8432,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Dadar West',
    heroDescription: 'Looking to sell scrap in Dadar West? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Shivaji Park, Mahim, Prabhadevi, or Worli, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Dadar West, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Shivaji Park, Mahim, Prabhadevi, Worli, and Dadar Station West.',

    whyChooseDetails: 'Whether you want to sell scrap in Dadar West from your home, office, shop, or society, our team ensures a fast and hassle-free process. From iron, steel, aluminum, and copper to plastic, paper, e-waste, furniture, and appliances, we buy all types of scrap at the highest prices.',

    landmarks: [
      'Shivaji Park',
      'Siddhivinayak Temple',
      'Chaityabhoomi',
      'Dadar Beach',
      'Plaza Cinema',
      'Kohinoor Square',
      'Shivaji Park Gymkhana',
      'Gokhale Road'
    ],

    subAreas: [
      'Dadar Station West',
      'Shivaji Park',
      'Mahim',
      'Prabhadevi',
      'Worli',
      'Dadar Parsi Colony',
      'Gokhale Road',
      'Ranade Road',
      'Veer Savarkar Marg',
      'Chaityabhoomi',
      'Siddhivinayak Temple Area',
      'Dadar Beach',
      'Plaza Cinema',
      'Kohinoor Square',
      'Shivaji Park Gymkhana'
    ],

    nearbyLocations: [
      { name: 'Dadar East', slug: 'dadar-east' },
      { name: 'Mahim', slug: 'mahim' },
      { name: 'Prabhadevi', slug: 'prabhadevi' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Dadar West',
    secondary: [
      'scrap dealer in Dadar West',
      'kabadiwala Dadar West',
      'scrap buyer near Shivaji Park',
      'sell scrap in Dadar West',
      'scrap pickup Mahim',
      'best scrap rates Dadar West',
      'online scrap dealer Dadar West',
      'scrap collection Dadar West',
      'e-waste pickup Dadar West',
      'scrap dealer near me Dadar West',
      'scrap recycling Dadar West'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Dadar West – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Dadar West with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer dadar west, scrap buyer dadar west, kabadiwala dadar west, sell scrap dadar west, scrap pickup dadar west',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-dadar-west'
  },

  images: {
    hero: '/optimized/Scrapiz-Dadar-West.webp',
    alt: 'Scrapiz Dadar West Scrap Shop'
  }
},

fort: {
  id: 'fort',
  name: 'Fort',
  displayName: 'Fort',
  slug: 'fort',

  nap: {
    businessName: 'Scrapiz Fort - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Fort',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Fort, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 18.9338,
    longitude: 72.8356,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Fort Mumbai',
    heroDescription: 'Looking to sell scrap in Fort? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Kala Ghoda, Ballard Estate, Nariman Point, or Churchgate, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Fort Mumbai, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Kala Ghoda, Ballard Estate, Nariman Point, and Churchgate.',

    whyChooseDetails: 'Whether you want to sell scrap in Fort from your office, shop, showroom, or building, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk office scrap, we buy all types at the highest prices.',

    landmarks: [
      'Flora Fountain',
      'Horniman Circle',
      'Kala Ghoda',
      'Bombay Stock Exchange',
      'Churchgate Station',
      'Marine Lines Station',
      'Nariman Point',
      'Oval Maidan'
    ],

    subAreas: [
      'Fort Area',
      'Kala Ghoda',
      'Ballard Estate',
      'Horniman Circle',
      'Flora Fountain',
      'DN Road',
      'Mahatma Gandhi Road',
      'Churchgate',
      'Marine Lines',
      'Nariman Point',
      'Oval Maidan',
      'Cross Maidan',
      'Mantralaya',
      'Hutatma Chowk',
      'Bombay Stock Exchange Area'
    ],

    nearbyLocations: [
      { name: 'CST', slug: 'cst' },
      { name: 'Colaba', slug: 'colaba' },
      { name: 'Marine Lines', slug: 'marine-lines' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Fort Mumbai',
    secondary: [
      'scrap dealer in Fort',
      'kabadiwala Fort Mumbai',
      'scrap buyer near Kala Ghoda',
      'sell scrap in Fort',
      'scrap pickup Nariman Point',
      'office scrap dealer Fort',
      'bulk scrap Fort Mumbai',
      'scrap collection Fort',
      'e-waste pickup Fort',
      'scrap dealer near me Fort',
      'commercial scrap Fort'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Fort Mumbai – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Fort Mumbai with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, office scrap & more.',
    keywords: 'scrap dealer fort mumbai, scrap buyer fort, kabadiwala fort, office scrap fort, bulk scrap fort',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-fort'
  },

  images: {
    hero: '/optimized/Scrapiz-Fort.webp',
    alt: 'Scrapiz Fort Scrap Shop'
  }
},

ghatkoparEast: {
  id: 'ghatkopar-east',
  name: 'Ghatkopar East',
  displayName: 'Ghatkopar East',
  slug: 'ghatkopar-east',

  nap: {
    businessName: 'Scrapiz Ghatkopar East - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Ghatkopar East',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Ghatkopar East, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.0860,
    longitude: 72.9081,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Ghatkopar East',
    heroDescription: 'Looking to sell scrap in Ghatkopar East? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Pant Nagar, Garodia Nagar, Tilak Nagar, or Asalpha, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Ghatkopar East, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Pant Nagar, Garodia Nagar, Rajawadi, Tilak Nagar, and Asalpha.',

    whyChooseDetails: 'Whether you want to sell scrap in Ghatkopar East from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk scrap, we buy all types at the highest prices.',

    landmarks: [
      'Ghatkopar Railway Station',
      'R City Mall',
      'Rajawadi Hospital',
      'Garodia Nagar',
      'Pant Nagar Market',
      'Asalpha Metro Station',
      'Jagruti Nagar',
      'LBS Marg'
    ],

    subAreas: [
      'Ghatkopar Station East',
      'Rajawadi',
      'Pant Nagar',
      'Asalpha',
      'Garodia Nagar',
      'LBS Marg',
      'Vikhroli Link Road',
      'Jagruti Nagar',
      'Sarvodaya Nagar',
      'Ramabai Nagar',
      'Amrut Nagar',
      'Pantnagar',
      'Tilak Nagar',
      'Ghatkopar Industrial Estate',
      'Laxmi Nagar'
    ],

    nearbyLocations: [
      { name: 'Ghatkopar West', slug: 'ghatkopar-west' },
      { name: 'Vikhroli', slug: 'vikhroli' },
      { name: 'Tilak Nagar', slug: 'tilak-nagar' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Ghatkopar East',
    secondary: [
      'scrap dealer in Ghatkopar East',
      'kabadiwala Ghatkopar East',
      'scrap buyer near Pant Nagar',
      'sell scrap in Ghatkopar East',
      'scrap pickup Garodia Nagar',
      'best scrap rates Ghatkopar East',
      'online scrap dealer Ghatkopar East',
      'scrap collection Ghatkopar East',
      'e-waste pickup Ghatkopar East',
      'scrap dealer near me Ghatkopar East',
      'industrial scrap Ghatkopar East'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Ghatkopar East – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Ghatkopar East with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer ghatkopar east, scrap buyer ghatkopar east, kabadiwala ghatkopar east, sell scrap ghatkopar east, scrap pickup ghatkopar east',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-ghatkopar-east'
  },

  images: {
    hero: '/optimized/Scrapiz-Ghatkopar-East.webp',
    alt: 'Scrapiz Ghatkopar East Scrap Shop'
  }
},

ghatkoparWest: {
  id: 'ghatkopar-west',
  name: 'Ghatkopar West',
  displayName: 'Ghatkopar West',
  slug: 'ghatkopar-west',

  nap: {
    businessName: 'Scrapiz Ghatkopar West - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Ghatkopar West',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Ghatkopar West, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.0896,
    longitude: 72.9081,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Ghatkopar West',
    heroDescription: 'Looking to sell scrap in Ghatkopar West? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Cama Lane, Panchsheel Nagar, Kamgar Nagar, or Pestom Sagar, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Ghatkopar West, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Cama Lane, Panchsheel Nagar, Kamgar Nagar, Vallabh Baug, and Pestom Sagar.',

    whyChooseDetails: 'Whether you want to sell scrap in Ghatkopar West from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk scrap, we buy all types at the highest prices.',

    landmarks: [
      'Ghatkopar Railway Station',
      'Shreyas Cinema',
      'Cama Lane Market',
      'Jain Mandir',
      'Nalanda School',
      'Vallabh Baug',
      'Pestom Sagar',
      'Rajawadi Village'
    ],

    subAreas: [
      'Ghatkopar Station West',
      'Cama Lane',
      'Kanjur Marg Link Road',
      'Jain Mandir Road',
      'Sarvodaya Nagar',
      'Panchsheel Nagar',
      'Kamgar Nagar',
      'Vallabh Baug Lane',
      'Nalanda School Area',
      'Ghatkopar Pipe Line',
      'Shreyas Cinema Area',
      'Rajawadi Village',
      'Pestom Sagar',
      'Chhedanagar',
      'Laxmi Nagar'
    ],

    nearbyLocations: [
      { name: 'Ghatkopar East', slug: 'ghatkopar-east' },
      { name: 'Vikhroli', slug: 'vikhroli' },
      { name: 'Kanjurmarg', slug: 'kanjurmarg' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Ghatkopar West',
    secondary: [
      'scrap dealer in Ghatkopar West',
      'kabadiwala Ghatkopar West',
      'scrap buyer near Cama Lane',
      'sell scrap in Ghatkopar West',
      'scrap pickup Panchsheel Nagar',
      'best scrap rates Ghatkopar West',
      'online scrap dealer Ghatkopar West',
      'scrap collection Ghatkopar West',
      'e-waste pickup Ghatkopar West',
      'scrap dealer near me Ghatkopar West',
      'bulk scrap Ghatkopar West'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Ghatkopar West – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Ghatkopar West with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer ghatkopar west, scrap buyer ghatkopar west, kabadiwala ghatkopar west, sell scrap ghatkopar west, scrap pickup ghatkopar west',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-ghatkopar-west'
  },

  images: {
    hero: '/optimized/Scrapiz-Ghatkopar-West.webp',
    alt: 'Scrapiz Ghatkopar West Scrap Shop'
  }
},

goregaonEast: {
  id: 'goregaon-east',
  name: 'Goregaon East',
  displayName: 'Goregaon East',
  slug: 'goregaon-east',

  nap: {
    businessName: 'Scrapiz Goregaon East - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Goregaon East',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Goregaon East, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.1663,
    longitude: 72.8526,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Goregaon East',
    heroDescription: 'Looking to sell scrap in Goregaon East? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Aarey Colony, Dindoshi, Film City, or Gokuldham, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Goregaon East, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Aarey Colony, Dindoshi, Film City, Bangur Nagar, and Gokuldham.',

    whyChooseDetails: 'Whether you want to sell scrap in Goregaon East from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk scrap, we buy all types at the highest prices.',

    landmarks: [
      'Goregaon East Station',
      'Film City',
      'Aarey Colony',
      'Oberoi Mall',
      'Dindoshi Bus Depot',
      'Bangur Nagar Market',
      'Jawahar Nagar',
      'Sanjay Gandhi National Park Gate'
    ],

    subAreas: [
      'Aarey Colony',
      'Film City',
      'Dindoshi',
      'Bangur Nagar',
      'Jawahar Nagar',
      'Motilal Nagar',
      'Gokuldham',
      'Sanjay Gandhi National Park',
      'Aarey Milk Colony',
      'Vanrai',
      'Hanuman Nagar',
      'Shanti Nagar',
      'Siddharth Nagar',
      'Yashodham',
      'Oberoi Mall Area'
    ],

    nearbyLocations: [
      { name: 'Goregaon West', slug: 'goregaon-west' },
      { name: 'Malad', slug: 'malad' },
      { name: 'Jogeshwari', slug: 'jogeshwari' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Goregaon East',
    secondary: [
      'scrap dealer in Goregaon East',
      'kabadiwala Goregaon East',
      'scrap buyer near Film City',
      'sell scrap in Goregaon East',
      'scrap pickup Dindoshi',
      'best scrap rates Goregaon East',
      'online scrap dealer Goregaon East',
      'scrap collection Goregaon East',
      'e-waste pickup Goregaon East',
      'scrap dealer near me Goregaon East',
      'bulk scrap Goregaon East'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Goregaon East – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Goregaon East with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer goregaon east, scrap buyer goregaon east, kabadiwala goregaon east, sell scrap goregaon east, scrap pickup goregaon east',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-goregaon-east'
  },

  images: {
    hero: '/optimized/Scrapiz-Goregaon-East.webp',
    alt: 'Scrapiz Goregaon East Scrap Shop'
  }
},

goregaonWest: {
  id: 'goregaon-west',
  name: 'Goregaon West',
  displayName: 'Goregaon West',
  slug: 'goregaon-west',

  nap: {
    businessName: 'Scrapiz Goregaon West - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Goregaon West',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Goregaon West, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.1663,
    longitude: 72.8526,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Goregaon West',
    heroDescription: 'Looking to sell scrap in Goregaon West? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Link Road, Bangur Nagar, Oshiwara, or Mindspace, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Goregaon West, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Link Road, Bangur Nagar, Oshiwara, Motilal Nagar, and Mindspace.',

    whyChooseDetails: 'Whether you want to sell scrap in Goregaon West from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk scrap, we buy all types at the highest prices.',

    landmarks: [
      'Goregaon Railway Station',
      'Inorbit Mall',
      'Oberoi Mall',
      'Mindspace IT Park',
      'Nesco Exhibition Center',
      'Patkar College',
      'Link Road Junction',
      'Goregaon Sports Club'
    ],

    subAreas: [
      'Goregaon Station West',
      'Link Road',
      'Patkar College Area',
      'Siddharth Nagar',
      'Motilal Nagar',
      'Vanrai',
      'Jawahar Nagar',
      'Bangur Nagar',
      'Oshiwara',
      'Malad Link Road',
      'Mindspace',
      'Nesco',
      'Inorbit Mall Area',
      'Oberoi Garden City',
      'Goregaon Sports Club Area'
    ],

    nearbyLocations: [
      { name: 'Goregaon East', slug: 'goregaon-east' },
      { name: 'Malad', slug: 'malad' },
      { name: 'Jogeshwari', slug: 'jogeshwari' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Goregaon West',
    secondary: [
      'scrap dealer in Goregaon West',
      'kabadiwala Goregaon West',
      'scrap buyer near Mindspace',
      'sell scrap in Goregaon West',
      'scrap pickup Bangur Nagar',
      'best scrap rates Goregaon West',
      'online scrap dealer Goregaon West',
      'scrap collection Goregaon West',
      'e-waste pickup Goregaon West',
      'scrap dealer near me Goregaon West',
      'commercial scrap Goregaon West'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Goregaon West – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Goregaon West with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer goregaon west, scrap buyer goregaon west, kabadiwala goregaon west, sell scrap goregaon west, scrap pickup goregaon west',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-goregaon-west'
  },

  images: {
    hero: '/optimized/Scrapiz-Goregaon-West.webp',
    alt: 'Scrapiz Goregaon West Scrap Shop'
  }
},

grantRoad: {
  id: 'grant-road',
  name: 'Grant Road',
  displayName: 'Grant Road',
  slug: 'grant-road',

  nap: {
    businessName: 'Scrapiz Grant Road - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Grant Road',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Grant Road, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 18.9647,
    longitude: 72.8150,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Grant Road',
    heroDescription: 'Looking to sell scrap in Grant Road? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Tardeo, Charni Road, Opera House, or Gamdevi, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Grant Road, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Tardeo, Charni Road, Opera House, Nana Chowk, and Gamdevi.',

    whyChooseDetails: 'Whether you want to sell scrap in Grant Road from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk scrap, we buy all types at the highest prices.',

    landmarks: [
      'Grant Road Railway Station',
      'Nana Chowk',
      'Babulnath Temple',
      'Opera House',
      'Charni Road Station',
      'Gamdevi Market',
      'Tardeo Junction',
      'August Kranti Maidan'
    ],

    subAreas: [
      'Grant Road East',
      'Grant Road West',
      'Tardeo',
      'Charni Road',
      'Opera House',
      'Girgaon',
      'Gamdevi',
      'Nana Chowk',
      'Babulnath',
      'Malabar Hill',
      'Walkeshwar',
      'Teen Batti',
      'Kemps Corner',
      'August Kranti Maidan',
      'Grant Road Station Area'
    ],

    nearbyLocations: [
      { name: 'Charni Road', slug: 'charni-road' },
      { name: 'Mumbai Central', slug: 'mumbai-central' },
      { name: 'Marine Lines', slug: 'marine-lines' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Grant Road',
    secondary: [
      'scrap dealer in Grant Road',
      'kabadiwala Grant Road',
      'scrap buyer near Tardeo',
      'sell scrap in Grant Road',
      'scrap pickup Opera House',
      'best scrap rates Grant Road',
      'online scrap dealer Grant Road',
      'scrap collection Grant Road',
      'e-waste pickup Grant Road',
      'scrap dealer near me Grant Road',
      'commercial scrap Grant Road'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Grant Road – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Grant Road with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer grant road, scrap buyer grant road, kabadiwala grant road, sell scrap grant road, scrap pickup grant road',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-grant-road'
  },

  images: {
    hero: '/optimized/Scrapiz-Grant-Road.webp',
    alt: 'Scrapiz Grant Road Scrap Shop'
  }
},


jogeshwariEast: {
  id: 'jogeshwari-east',
  name: 'Jogeshwari East',
  displayName: 'Jogeshwari East',
  slug: 'jogeshwari-east',

  nap: {
    businessName: 'Scrapiz Jogeshwari East - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Jogeshwari East',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Jogeshwari East, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.1383,
    longitude: 72.8526,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Jogeshwari East',
    heroDescription: 'Looking to sell scrap in Jogeshwari East? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Mahakali Caves, JVLR, Majas, or Laxmi Industrial Estate, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Jogeshwari East, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Mahakali Caves, JVLR, Majas, Adarsh Nagar, and Laxmi Industrial Estate.',

    whyChooseDetails: 'Whether you want to sell scrap in Jogeshwari East from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk industrial scrap, we buy all types at the highest prices.',

    landmarks: [
      'Jogeshwari East Railway Station',
      'Mahakali Caves',
      'Laxmi Industrial Estate',
      'JVLR Road',
      'Majas Depot',
      'Adarsh Nagar Market',
      'Patel Nagar Junction',
      'Rajawadi Market'
    ],

    subAreas: [
      'Jogeshwari East Station',
      'Mahakali Caves Road',
      'Jogeshwari Vikhroli Link Road',
      'Laxmi Industrial Estate',
      'Majas',
      'Adarsh Nagar',
      'Sahyadri Nagar',
      'Patel Nagar',
      'Shankar Nagar',
      'Indira Nagar',
      'Jagruti Nagar',
      'Sarvodaya Nagar',
      'Laxmi Nagar',
      'Rajawadi Area',
      'JVLR Belt'
    ],

    nearbyLocations: [
      { name: 'Jogeshwari West', slug: 'jogeshwari-west' },
      { name: 'Andheri East', slug: 'andheri-east' },
      { name: 'Goregaon East', slug: 'goregaon-east' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Jogeshwari East',
    secondary: [
      'scrap dealer in Jogeshwari East',
      'kabadiwala Jogeshwari East',
      'scrap buyer near Mahakali Caves',
      'sell scrap in Jogeshwari East',
      'scrap pickup JVLR',
      'industrial scrap Jogeshwari East',
      'best scrap rates Jogeshwari East',
      'online scrap dealer Jogeshwari East',
      'scrap collection Jogeshwari East',
      'e-waste pickup Jogeshwari East',
      'bulk scrap Jogeshwari East'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Jogeshwari East – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Jogeshwari East with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer jogeshwari east, scrap buyer jogeshwari east, kabadiwala jogeshwari east, sell scrap jogeshwari east, scrap pickup jogeshwari east',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-jogeshwari-east'
  },

  images: {
    hero: '/optimized/Scrapiz-Jogeshwari-East.webp',
    alt: 'Scrapiz Jogeshwari East Scrap Shop'
  }
},

jogeshwariWest: {
  id: 'jogeshwari-west',
  name: 'Jogeshwari West',
  displayName: 'Jogeshwari West',
  slug: 'jogeshwari-west',

  nap: {
    businessName: 'Scrapiz Jogeshwari West - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Jogeshwari West',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Jogeshwari West, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.1383,
    longitude: 72.8425,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Jogeshwari West',
    heroDescription: 'Looking to sell scrap in Jogeshwari West? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Meghwadi, Aram Nagar, Behram Baug, or Prakash Nagar, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Jogeshwari West, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Meghwadi, Aram Nagar, Behram Baug, Shastri Nagar, and Prakash Nagar.',

    whyChooseDetails: 'Whether you want to sell scrap in Jogeshwari West from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk scrap, we buy all types at the highest prices.',

    landmarks: [
      'Jogeshwari Railway Station',
      'Jogeshwari Metro Station',
      'Aram Nagar Film Studios',
      'Meghwadi Market',
      'Jogeshwari Caves',
      'Ismail Nagar Market',
      'Prakash Nagar Junction',
      'Behram Baug Area'
    ],

    subAreas: [
      'Jogeshwari Station West',
      'Meghwadi',
      'Aram Nagar',
      'Prakash Nagar',
      'Shastri Nagar',
      'Ismail Nagar',
      'Siddharth Nagar',
      'Ambedkar Nagar',
      'Behram Baug',
      'Jain Society',
      'Laljipada',
      'Navpada',
      'Shimpoli',
      'Jogeshwari Caves Area',
      'SV Road Belt'
    ],

    nearbyLocations: [
      { name: 'Jogeshwari East', slug: 'jogeshwari-east' },
      { name: 'Andheri West', slug: 'andheri-west' },
      { name: 'Goregaon West', slug: 'goregaon-west' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Jogeshwari West',
    secondary: [
      'scrap dealer in Jogeshwari West',
      'kabadiwala Jogeshwari West',
      'scrap buyer near Aram Nagar',
      'sell scrap in Jogeshwari West',
      'scrap pickup Meghwadi',
      'best scrap rates Jogeshwari West',
      'online scrap dealer Jogeshwari West',
      'scrap collection Jogeshwari West',
      'e-waste pickup Jogeshwari West',
      'scrap dealer near me Jogeshwari West',
      'commercial scrap Jogeshwari West'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Jogeshwari West – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Jogeshwari West with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer jogeshwari west, scrap buyer jogeshwari west, kabadiwala jogeshwari west, sell scrap jogeshwari west, scrap pickup jogeshwari west',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-jogeshwari-west'
  },

  images: {
    hero: '/optimized/Scrapiz-Jogeshwari-West.webp',
    alt: 'Scrapiz Jogeshwari West Scrap Shop'
  }
},

kandivaliEast: {
  id: 'kandivali-east',
  name: 'Kandivali East',
  displayName: 'Kandivali East',
  slug: 'kandivali-east',

  nap: {
    businessName: 'Scrapiz Kandivali East - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Kandivali East',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Kandivali East, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.2074,
    longitude: 72.8682,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Kandivali East',
    heroDescription: 'Looking to sell scrap in Kandivali East? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Thakur Complex, Thakur Village, Akurli, or Samta Nagar, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Kandivali East, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Thakur Complex, Thakur Village, Akurli, Samta Nagar, and Mahavir Nagar.',

    whyChooseDetails: 'Whether you want to sell scrap in Kandivali East from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk scrap, we buy all types at the highest prices.',

    landmarks: [
      'Kandivali Railway Station',
      'Thakur Complex',
      'Thakur Village',
      'Growels 101 Mall',
      'Lokhandwala Township',
      'Mahavir Nagar Market',
      'Poisar Depot',
      'Akurli Road'
    ],

    subAreas: [
      'Kandivali Station East',
      'Thakur Complex',
      'Thakur Village',
      'Lokhandwala Township',
      'Growels 101 Mall Area',
      'Hanuman Nagar',
      'Poisar',
      'Samta Nagar',
      'Akurli',
      'Mahavir Nagar',
      'Charkop Naka',
      'Shanti Nagar',
      'Damu Nagar',
      'Ganesh Nagar',
      'Akurli Industrial Area'
    ],

    nearbyLocations: [
      { name: 'Kandivali West', slug: 'kandivali-west' },
      { name: 'Malad', slug: 'malad' },
      { name: 'Borivali', slug: 'borivali' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Kandivali East',
    secondary: [
      'scrap dealer in Kandivali East',
      'kabadiwala Kandivali East',
      'scrap buyer near Thakur Village',
      'sell scrap in Kandivali East',
      'scrap pickup Thakur Complex',
      'best scrap rates Kandivali East',
      'online scrap dealer Kandivali East',
      'scrap collection Kandivali East',
      'e-waste pickup Kandivali East',
      'scrap dealer near me Kandivali East',
      'bulk scrap Kandivali East'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Kandivali East – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Kandivali East with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer kandivali east, scrap buyer kandivali east, kabadiwala kandivali east, sell scrap kandivali east, scrap pickup kandivali east',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-kandivali-east'
  },

  images: {
    hero: '/optimized/Scrapiz-Kandivali-East.webp',
    alt: 'Scrapiz Kandivali East Scrap Shop'
  }
},

kandivaliWest: {
  id: 'kandivali-west',
  name: 'Kandivali West',
  displayName: 'Kandivali West',
  slug: 'kandivali-west',

  nap: {
    businessName: 'Scrapiz Kandivali West - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Kandivali West',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Kandivali West, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.2074,
    longitude: 72.8425,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Kandivali West',
    heroDescription: 'Looking to sell scrap in Kandivali West? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Charkop, Mahavir Nagar, Poisaar, or Dattani Park, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Kandivali West, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Charkop, Mahavir Nagar, Poisaar, Dattani Park, and Shanti Nagar.',

    whyChooseDetails: 'Whether you want to sell scrap in Kandivali West from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk scrap, we buy all types at the highest prices.',

    landmarks: [
      'Kandivali Railway Station',
      'Raghuleela Mall',
      'Charkop Market',
      'Mahavir Nagar',
      'Poisar Bus Depot',
      'Akurli Road',
      'Dattani Park',
      'Mandpeshwar Caves'
    ],

    subAreas: [
      'Kandivali Station West',
      'Charkop',
      'Mahavir Nagar',
      'Poisar',
      'Dattani Park',
      'Shanti Nagar',
      'Hanuman Tekdi',
      'Ganesh Nagar',
      'Laljipada',
      'Samta Nagar',
      'Damu Nagar',
      'Magathane',
      'Mandpeshwar',
      'Charkop Sector 1-4',
      'Link Road Belt'
    ],

    nearbyLocations: [
      { name: 'Kandivali East', slug: 'kandivali-east' },
      { name: 'Borivali', slug: 'borivali' },
      { name: 'Malad', slug: 'malad' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Kandivali West',
    secondary: [
      'scrap dealer in Kandivali West',
      'kabadiwala Kandivali West',
      'scrap buyer near Charkop',
      'sell scrap in Kandivali West',
      'scrap pickup Mahavir Nagar',
      'best scrap rates Kandivali West',
      'online scrap dealer Kandivali West',
      'scrap collection Kandivali West',
      'e-waste pickup Kandivali West',
      'scrap dealer near me Kandivali West',
      'bulk scrap Kandivali West'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Kandivali West – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Kandivali West with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer kandivali west, scrap buyer kandivali west, kabadiwala kandivali west, sell scrap kandivali west, scrap pickup kandivali west',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-kandivali-west'
  },

  images: {
    hero: '/optimized/Scrapiz-Kandivali-West.webp',
    alt: 'Scrapiz Kandivali West Scrap Shop'
  }
},

kurla: {
  id: 'kurla',
  name: 'Kurla',
  displayName: 'Kurla',
  slug: 'kurla',

  nap: {
    businessName: 'Scrapiz Kurla - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Kurla',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Kurla, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.0728,
    longitude: 72.8826,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Kurla',
    heroDescription: 'Looking to sell scrap in Kurla? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Nehru Nagar, Kamani, Chunabhatti, or Phoenix Market City area, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Kurla, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Nehru Nagar, Kamani, Chunabhatti, Tilak Nagar, and LBS Marg.',

    whyChooseDetails: 'Whether you want to sell scrap in Kurla from your home, office, shop, or industrial unit, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk industrial scrap, we buy all types at the highest prices.',

    landmarks: [
      'Kurla Railway Station',
      'Phoenix Market City',
      'Kurla Bus Depot',
      'LBS Marg',
      'Nehru Nagar Market',
      'Kamani Junction',
      'Tilak Nagar',
      'CST Road'
    ],

    subAreas: [
      'Kurla Station',
      'Kurla East',
      'Kurla West',
      'LBS Marg',
      'Nehru Nagar',
      'Kamani',
      'Chunabhatti',
      'Tilak Nagar',
      'CST Road',
      'Kurla Industrial Estate',
      'Phoenix Market City Area',
      'Naupada',
      'Ghatkopar Link Road',
      'Kamgar Nagar',
      'Saki Vihar Road'
    ],

    nearbyLocations: [
      { name: 'Ghatkopar', slug: 'ghatkopar' },
      { name: 'Chembur', slug: 'chembur' },
      { name: 'Sion', slug: 'sion' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Kurla',
    secondary: [
      'scrap dealer in Kurla',
      'kabadiwala Kurla',
      'scrap buyer near Nehru Nagar',
      'sell scrap in Kurla',
      'scrap pickup Kurla East',
      'industrial scrap Kurla',
      'best scrap rates Kurla',
      'online scrap dealer Kurla',
      'scrap collection Kurla',
      'e-waste pickup Kurla',
      'bulk scrap Kurla'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Kurla – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Kurla with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer kurla, scrap buyer kurla, kabadiwala kurla, sell scrap kurla, scrap pickup kurla',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-kurla'
  },

  images: {
    hero: '/optimized/Scrapiz-Kurla.webp',
    alt: 'Scrapiz Kurla Scrap Shop'
  }
},

lowerParel: {
  id: 'lower-parel',
  name: 'Lower Parel',
  displayName: 'Lower Parel',
  slug: 'lower-parel',

  nap: {
    businessName: 'Scrapiz Lower Parel - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Lower Parel',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Lower Parel, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 18.9975,
    longitude: 72.8305,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Lower Parel',
    heroDescription: 'Looking to sell scrap in Lower Parel? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Kamala Mills, Lodha Park, Phoenix Mills, or Prabhadevi, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Lower Parel, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Kamala Mills, Phoenix Mills, Lodha Park, Prabhadevi, and Curry Road.',

    whyChooseDetails: 'Whether you want to sell scrap in Lower Parel from your home, office, corporate building, or commercial complex, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk corporate scrap, we buy all types at the highest prices.',

    landmarks: [
      'Lower Parel Railway Station',
      'High Street Phoenix Mall',
      'Palladium Mall',
      'Kamala Mills',
      'Lodha Park',
      'Elphinstone Road Station',
      'Parel Station',
      'Curry Road'
    ],

    subAreas: [
      'Lower Parel Station',
      'Elphinstone Road',
      'Parel',
      'Worli',
      'Phoenix Mills',
      'Kamala Mills',
      'Lodha Park',
      'Prabhadevi',
      'Curry Road',
      'Delisle Road',
      'High Street Phoenix Area',
      'Palladium Mall Area',
      'Raghuvanshi Mills',
      'Corporate Parks Belt'
    ],

    nearbyLocations: [
      { name: 'Dadar', slug: 'dadar' },
      { name: 'Worli', slug: 'worli' },
      { name: 'Prabhadevi', slug: 'prabhadevi' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Lower Parel',
    secondary: [
      'scrap dealer in Lower Parel',
      'kabadiwala Lower Parel',
      'scrap buyer near Kamala Mills',
      'sell scrap in Lower Parel',
      'scrap pickup Phoenix Mills',
      'corporate scrap Lower Parel',
      'office scrap Lower Parel',
      'best scrap rates Lower Parel',
      'e-waste pickup Lower Parel',
      'scrap collection Lower Parel',
      'bulk scrap Lower Parel'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Lower Parel – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Lower Parel with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer lower parel, scrap buyer lower parel, kabadiwala lower parel, sell scrap lower parel, scrap pickup lower parel',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-lower-parel'
  },

  images: {
    hero: '/optimized/Scrapiz-Lower-Parel.webp',
    alt: 'Scrapiz Lower Parel Scrap Shop'
  }
},

maladEast: {
  id: 'malad-east',
  name: 'Malad East',
  displayName: 'Malad East',
  slug: 'malad-east',

  nap: {
    businessName: 'Scrapiz Malad East - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Malad East',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Malad East, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.1868,
    longitude: 72.8682,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Malad East',
    heroDescription: 'Looking to sell scrap in Malad East? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Kurar Village, Dindoshi, Evershine Nagar, or Pushpa Park, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Malad East, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Kurar Village, Dindoshi, Evershine Nagar, Jankalyan Nagar, and Pushpa Park.',

    whyChooseDetails: 'Whether you want to sell scrap in Malad East from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk scrap, we buy all types at the highest prices.',

    landmarks: [
      'Malad East Railway Station',
      'Dindoshi Bus Depot',
      'Kurar Village',
      'Evershine Nagar Market',
      'Jankalyan Nagar',
      'Pushpa Park',
      'Akurli Road',
      'Malvani Market'
    ],

    subAreas: [
      'Malad Station East',
      'Kurar Village',
      'Dindoshi',
      'Jankalyan Nagar',
      'Evershine Nagar',
      'Pushpa Park',
      'Akurli',
      'Gaikwad Nagar',
      'Shanti Nagar',
      'Prakash Nagar',
      'Hanuman Tekdi',
      'Rathodi',
      'Chincholi Bunder',
      'Malvani Belt',
      'Dindoshi Industrial Area'
    ],

    nearbyLocations: [
      { name: 'Malad West', slug: 'malad-west' },
      { name: 'Goregaon East', slug: 'goregaon-east' },
      { name: 'Kandivali East', slug: 'kandivali-east' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Malad East',
    secondary: [
      'scrap dealer in Malad East',
      'kabadiwala Malad East',
      'scrap buyer near Dindoshi',
      'sell scrap in Malad East',
      'scrap pickup Kurar Village',
      'best scrap rates Malad East',
      'online scrap dealer Malad East',
      'scrap collection Malad East',
      'e-waste pickup Malad East',
      'scrap dealer near me Malad East',
      'bulk scrap Malad East'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Malad East – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Malad East with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer malad east, scrap buyer malad east, kabadiwala malad east, sell scrap malad east, scrap pickup malad east',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-malad-east'
  },

  images: {
    hero: '/optimized/Scrapiz-Malad-East.webp',
    alt: 'Scrapiz Malad East Scrap Shop'
  }
},

maladWest: {
  id: 'malad-west',
  name: 'Malad West',
  displayName: 'Malad West',
  slug: 'malad-west',

  nap: {
    businessName: 'Scrapiz Malad West - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Malad West',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Malad West, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.1868,
    longitude: 72.8425,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Malad West',
    heroDescription: 'Looking to sell scrap in Malad West? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Orlem, Mindspace, Marve Road, or Evershine City, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Malad West, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Orlem, Mindspace, Marve Road, Malad Link Road, and Evershine City.',

    whyChooseDetails: 'Whether you want to sell scrap in Malad West from your home, office, shop, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk commercial scrap, we buy all types at the highest prices.',

    landmarks: [
      'Malad Railway Station',
      'Inorbit Mall',
      'Infiniti Mall Malad',
      'Mindspace Malad',
      'Orlem Church',
      'Marve Beach',
      'Aksa Beach',
      'Madh Island',
      'Malad Link Road'
    ],

    subAreas: [
      'Malad Station West',
      'Orlem',
      'Malad Link Road',
      'Chincholi Bunder',
      'Marve Road',
      'Madh Island',
      'Aksa Beach Area',
      'Erangal',
      'Mindspace',
      'Malad Industrial Area',
      'Poisar',
      'Evershine City',
      'Infiniti Mall Area',
      'Inorbit Mall Area',
      'Mindspace Corporate Belt'
    ],

    nearbyLocations: [
      { name: 'Malad East', slug: 'malad-east' },
      { name: 'Goregaon West', slug: 'goregaon-west' },
      { name: 'Kandivali West', slug: 'kandivali-west' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Malad West',
    secondary: [
      'scrap dealer in Malad West',
      'kabadiwala Malad West',
      'scrap buyer near Mindspace',
      'sell scrap in Malad West',
      'scrap pickup Orlem',
      'best scrap rates Malad West',
      'online scrap dealer Malad West',
      'scrap collection Malad West',
      'e-waste pickup Malad West',
      'scrap dealer near me Malad West',
      'commercial scrap Malad West'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Malad West – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Malad West with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer malad west, scrap buyer malad west, kabadiwala malad west, sell scrap malad west, scrap pickup malad west',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-malad-west'
  },

  images: {
    hero: '/optimized/Scrapiz-Malad-West.webp',
    alt: 'Scrapiz Malad West Scrap Shop'
  }
},

mulund: {
  id: 'mulund',
  name: 'Mulund',
  displayName: 'Mulund',
  slug: 'mulund',

  nap: {
    businessName: 'Scrapiz Mulund - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Mulund',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Mulund, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.1722,
    longitude: 72.9565,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Mulund',
    heroDescription: 'Looking to sell scrap in Mulund? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Mulund East, Mulund West, Nahur, or LBS Marg, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Mulund, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Mulund East, Mulund West, Nahur, Veena Nagar, and Yogi Nagar.',

    whyChooseDetails: 'Whether you want to sell scrap in Mulund from your home, office, shop, society, or industrial unit, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk industrial scrap, we buy all types at the highest prices.',

    landmarks: [
      'Mulund Railway Station',
      'Nahur Station',
      'R Mall Mulund',
      'Johnson & Johnson',
      'Mulund Check Naka',
      'Veena Nagar Market',
      'Yogi Nagar',
      'LBS Marg'
    ],

    subAreas: [
      'Mulund Station',
      'Mulund East',
      'Mulund West',
      'Nahur',
      'LBS Marg',
      'Mulund Colony',
      'Veena Nagar',
      'Yogi Nagar',
      'Nirmal Nagar',
      'Johnson & Johnson Area',
      'Mulund Industrial Estate',
      'Gavanpada',
      'Dumping Road',
      'Mulund Check Naka',
      'Airoli Link Road'
    ],

    nearbyLocations: [
      { name: 'Ghatkopar', slug: 'ghatkopar' },
      { name: 'Vikhroli', slug: 'vikhroli' },
      { name: 'Thane', slug: 'thane' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Mulund',
    secondary: [
      'scrap dealer in Mulund',
      'kabadiwala Mulund',
      'scrap buyer near Mulund East',
      'sell scrap in Mulund',
      'scrap pickup Mulund West',
      'industrial scrap Mulund',
      'best scrap rates Mulund',
      'online scrap dealer Mulund',
      'scrap collection Mulund',
      'e-waste pickup Mulund',
      'bulk scrap Mulund'
    ]
  },

  seo: {
    title: 'Scrap Dealer in Mulund – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Mulund with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer mulund, scrap buyer mulund, kabadiwala mulund, sell scrap mulund, scrap pickup mulund',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-mulund'
  },

  images: {
    hero: '/optimized/Scrapiz-Mulund.webp',
    alt: 'Scrapiz Mulund Scrap Shop'
  }
},

sion: {
  id: 'sion',
  name: 'Sion',
  displayName: 'Sion',
  slug: 'sion',

  nap: {
    businessName: 'Scrapiz Sion - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Sion',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Sion, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.0433,
    longitude: 72.8626,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Sion',
    heroDescription: 'Looking to sell scrap in Sion? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Sion East, Sion West, Dharavi, or Antop Hill, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Sion, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Sion East, Sion West, Dharavi, Antop Hill, and Wadala.',

    whyChooseDetails: 'Whether you want to sell scrap in Sion from your home, office, shop, society, or industrial unit, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk industrial scrap, we buy all types at the highest prices.',

    landmarks: [
      'Sion Railway Station',
      'Sion Circle',
      'Sion Hospital',
      'Sion Fort',
      'GTB Nagar',
      'Antop Hill',
      'Pratiksha Nagar Market',
      'Chunabhatti Junction'
    ],

    subAreas: [
      'Sion Station',
      'Sion East',
      'Sion West',
      'Sion Circle',
      'Sion Koliwada',
      'Dharavi',
      'Antop Hill',
      'Wadala',
      'GTB Nagar',
      'Chunabhatti',
      'Pratiksha Nagar',
      'Amar Mahal',
      'Sion Hospital Area',
      'Sion Fort',
      'Rafi Ahmed Kidwai Road'
    ],

    nearbyLocations: [
      { name: 'Kurla', slug: 'kurla' },
      { name: 'Dadar', slug: 'dadar' },
      { name: 'Chembur', slug: 'chembur' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Sion',
    secondary: [
      'scrap dealer in Sion',
      'kabadiwala Sion',
      'scrap buyer near Dharavi',
      'sell scrap in Sion',
      'scrap pickup Sion East',
      'industrial scrap Sion',
      'best scrap rates Sion',
      'online scrap dealer Sion',
      'scrap collection Sion',
      'e-waste pickup Sion',
      'bulk scrap Sion'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Sion Mumbai – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Sion with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer sion, scrap buyer sion, kabadiwala sion, sell scrap sion, scrap pickup sion',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-sion'
  },

  images: {
    hero: '/optimized/Scrapiz-Sion.webp',
    alt: 'Scrapiz Sion Scrap Shop'
  }
},

vidyavihar: {
  id: 'vidyavihar',
  name: 'Vidyavihar',
  displayName: 'Vidyavihar',
  slug: 'vidyavihar',

  nap: {
    businessName: 'Scrapiz Vidyavihar - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Vidyavihar',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Vidyavihar, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.0822,
    longitude: 72.8978,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Vidyavihar',
    heroDescription: 'Looking to sell scrap in Vidyavihar? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Kannamwar Nagar, Amar Mahal, or Tilak Nagar, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Vidyavihar, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Kannamwar Nagar, Amar Mahal, Tilak Nagar, and Vikhroli Link Road.',

    whyChooseDetails: 'Whether you want to sell scrap in Vidyavihar from your home, office, shop, society, or commercial unit, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk scrap, we buy all types at the highest prices.',

    landmarks: [
      'Vidyavihar Railway Station',
      'Kannamwar Nagar',
      'Amar Mahal Junction',
      'Sonapur Market',
      'Tagore Nagar',
      'Vikhroli Link Road',
      'Tilak Nagar',
      'VN Purav Marg'
    ],

    subAreas: [
      'Vidyavihar Station',
      'Vidyavihar East',
      'Vidyavihar West',
      'Kannamwar Nagar',
      'Amar Mahal',
      'Vikhroli Link Road',
      'Ghatkopar Link Road',
      'Sonapur',
      'Tilak Nagar',
      'VN Purav Marg',
      'Rajawadi',
      'Kannamwar Nagar 1',
      'Kannamwar Nagar 2',
      'Tagore Nagar',
      'Deonar'
    ],

    nearbyLocations: [
      { name: 'Ghatkopar', slug: 'ghatkopar' },
      { name: 'Kurla', slug: 'kurla' },
      { name: 'Chembur', slug: 'chembur' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Vidyavihar',
    secondary: [
      'scrap dealer in Vidyavihar',
      'kabadiwala Vidyavihar',
      'scrap buyer near Kannamwar Nagar',
      'sell scrap in Vidyavihar',
      'scrap pickup Amar Mahal',
      'best scrap rates Vidyavihar',
      'online scrap dealer Vidyavihar',
      'scrap collection Vidyavihar',
      'e-waste pickup Vidyavihar',
      'scrap dealer near me Vidyavihar',
      'bulk scrap Vidyavihar'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Vidyavihar – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Vidyavihar with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer vidyavihar, scrap buyer vidyavihar, kabadiwala vidyavihar, sell scrap vidyavihar, scrap pickup vidyavihar',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-vidyavihar'
  },

  images: {
    hero: '/optimized/Scrapiz-Vidyavihar.webp',
    alt: 'Scrapiz Vidyavihar Scrap Shop'
  }
},

vikhroli: {
  id: 'vikhroli',
  name: 'Vikhroli',
  displayName: 'Vikhroli',
  slug: 'vikhroli',

  nap: {
    businessName: 'Scrapiz Vikhroli - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Vikhroli',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Vikhroli, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.1076,
    longitude: 72.9252,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Vikhroli',
    heroDescription: 'Looking to sell scrap in Vikhroli? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Vikhroli East, Parksite, Kannamwar Nagar, or Tagore Nagar, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Vikhroli, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Vikhroli East, Vikhroli West, Parksite, Kannamwar Nagar, and Tagore Nagar.',

    whyChooseDetails: 'Whether you want to sell scrap in Vikhroli from your home, office, shop, society, or industrial unit, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk industrial scrap, we buy all types at the highest prices.',

    landmarks: [
      'Vikhroli Railway Station',
      'Godrej Memorial Hospital',
      'Parksite Colony',
      'Kannamwar Nagar',
      'Tagore Nagar Market',
      'Nirlon Colony',
      'LBS Marg',
      'Powai Link Road'
    ],

    subAreas: [
      'Vikhroli Station',
      'Vikhroli East',
      'Vikhroli West',
      'Kannamwar Nagar',
      'Tagore Nagar',
      'Godrej Hill',
      'Parksite',
      'Vikhroli Industrial Estate',
      'LBS Marg',
      'Powai Link Road',
      'Kanjur Marg Link Road',
      'Nirlon Colony',
      'Kannamwar Nagar 1',
      'Kannamwar Nagar 2',
      'Vikhroli Park Site'
    ],

    nearbyLocations: [
      { name: 'Ghatkopar', slug: 'ghatkopar' },
      { name: 'Vidyavihar', slug: 'vidyavihar' },
      { name: 'Powai', slug: 'powai' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Vikhroli',
    secondary: [
      'scrap dealer in Vikhroli',
      'kabadiwala Vikhroli',
      'scrap buyer near Parksite',
      'sell scrap in Vikhroli',
      'industrial scrap Vikhroli',
      'scrap pickup Vikhroli East',
      'best scrap rates Vikhroli',
      'online scrap dealer Vikhroli',
      'scrap collection Vikhroli',
      'e-waste pickup Vikhroli',
      'bulk scrap Vikhroli'
    ]
  },

  seo: {
    title: 'Scrap Buyer in Vikhroli – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Vikhroli with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer vikhroli, scrap buyer vikhroli, kabadiwala vikhroli, sell scrap vikhroli, scrap pickup vikhroli',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-vikhroli'
  },

  images: {
    hero: '/optimized/Scrapiz-Vikhroli.webp',
    alt: 'Scrapiz Vikhroli Scrap Shop'
  }
},

wadala: {
  id: 'wadala',
  name: 'Wadala',
  displayName: 'Wadala',
  slug: 'wadala',

  nap: {
    businessName: 'Scrapiz Wadala - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Wadala',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Wadala, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.0176,
    longitude: 72.8561,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Wadala',
    heroDescription: 'Looking to sell scrap in Wadala? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Wadala East, Antop Hill, Sewri, or Bhakti Park, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Wadala, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Wadala East, Wadala West, Antop Hill, Sewri, and Bhakti Park.',

    whyChooseDetails: 'Whether you want to sell scrap in Wadala from your home, office, shop, society, or industrial unit, our team ensures a fast and hassle-free process. From metal scrap and e-waste to furniture, appliances, and bulk industrial scrap, we buy all types at the highest prices.',

    landmarks: [
      'Wadala Railway Station',
      'Phoenix Market City',
      'Antop Hill',
      'Sewri Fort',
      'BPT Colony',
      'Bhakti Park',
      'Cotton Green',
      'Wadala Bridge'
    ],

    subAreas: [
      'Wadala Station',
      'Wadala East',
      'Wadala West',
      'Antop Hill',
      'Sewri',
      'Dadar TT',
      'BPT Colony',
      'Wadala Truck Terminal',
      'Anik Depot',
      'Bhakti Park',
      'Naigaon',
      'Cotton Green',
      'Reay Road',
      'Wadala Bridge',
      'Phoenix Mills Area'
    ],

    nearbyLocations: [
      { name: 'Sion', slug: 'sion' },
      { name: 'Dadar', slug: 'dadar' },
      { name: 'Chembur', slug: 'chembur' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Wadala',
    secondary: [
      'scrap dealer in Wadala',
      'kabadiwala Wadala',
      'scrap buyer near Sewri',
      'sell scrap in Wadala',
      'industrial scrap Wadala',
      'scrap pickup Antop Hill',
      'best scrap rates Wadala',
      'online scrap dealer Wadala',
      'scrap collection Wadala',
      'e-waste pickup Wadala',
      'bulk scrap Wadala'
    ]
  },

  seo: {
    title: 'Scrap Dealer in Wadala – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Wadala with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, appliances, furniture & more.',
    keywords: 'scrap dealer wadala, scrap buyer wadala, kabadiwala wadala, sell scrap wadala, scrap pickup wadala',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-wadala'
  },

  images: {
    hero: '/optimized/Scrapiz-Wadala.webp',
    alt: 'Scrapiz Wadala Scrap Shop'
  }
},

worli: {
  id: 'worli',
  name: 'Worli',
  displayName: 'Worli',
  slug: 'worli',

  nap: {
    businessName: 'Scrapiz Worli - Scrap Buyers & Scrap Dealers in Mumbai',
    address: {
      street: 'Shop No. 07, Worli',
      locality: 'Mumbai',
      region: 'Maharashtra',
      postalCode: '400001',
      fullAddress: 'Shop No. 07, Worli, Mumbai, Maharashtra 400001'
    },
    phone: '+918828700630',
    phoneDisplay: '8828700630',
    email: 'support@scrapiz.in',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Saturday', hours: '9:00 AM - 10:00 PM' },
      { day: 'Sunday', hours: '9:00 AM - 10:00 PM' },
    ]
  },

  geo: {
    latitude: 19.0176,
    longitude: 72.8170,
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.1234567890!2d72.8234567!3d19.1234567'
  },

  content: {
    heroTitle: 'Scrap buyers in Worli',
    heroDescription: 'Looking to sell scrap in Worli? Scrapiz offers free doorstep pickup, instant payment, and the best scrap rates. Whether you\'re in Worli Sea Face, Prabhadevi, Lower Parel, or Mahalaxmi, our team reaches you the same day.',

    whyChooseIntro: 'Scrapiz is the most trusted scrap dealer in Worli, offering free doorstep scrap pickup, instant payment, and the best scrap rates. We proudly serve areas like Worli Sea Face, Worli Naka, Prabhadevi, Lower Parel, and Mahalaxmi.',

    whyChooseDetails: 'Whether you want to sell scrap in Worli from your home, office, corporate building, or society, our team ensures a fast and hassle-free process. From metal scrap and e-waste to office furniture, IT equipment, and bulk commercial scrap, we buy all types at the highest prices.',

    landmarks: [
      'Worli Sea Face',
      'Haji Ali Dargah',
      'Nehru Planetarium',
      'Worli Naka',
      'BDD Chawl',
      'Worli Village',
      'Lotus Mills',
      'Acharya Atre Chowk'
    ],

    subAreas: [
      'Worli Station',
      'Worli Naka',
      'Worli Sea Face',
      'Prabhadevi',
      'Lower Parel',
      'Annie Besant Road',
      'Worli Village',
      'BDD Chawl',
      'Lotus Mills',
      'Worli Koliwada',
      'Acharya Atre Chowk',
      'Worli Dairy',
      'Nehru Planetarium Area',
      'Haji Ali',
      'Mahalaxmi'
    ],

    nearbyLocations: [
      { name: 'Lower Parel', slug: 'lower-parel' },
      { name: 'Dadar', slug: 'dadar' },
      { name: 'Prabhadevi', slug: 'prabhadevi' }
    ]
  },

  keywords: {
    primary: 'scrap buyers in Worli',
    secondary: [
      'scrap dealer in Worli',
      'kabadiwala Worli',
      'scrap buyer near Worli Sea Face',
      'sell scrap in Worli',
      'office scrap Worli',
      'corporate scrap Worli',
      'best scrap rates Worli',
      'online scrap dealer Worli',
      'scrap collection Worli',
      'e-waste pickup Worli',
      'bulk scrap Worli'
    ]
  },

  seo: {
    title: 'Scrap Dealer in Worli – Free Pickup & Best Price | Scrapiz',
    description: 'Sell scrap in Worli with Scrapiz. Free doorstep pickup, instant cash, and best scrap rates for metal, e-waste, office scrap & more.',
    keywords: 'scrap dealer worli, scrap buyer worli, kabadiwala worli, sell scrap worli, scrap pickup worli',
    canonical: 'https://www.scrapiz.in/scrap-dealer-in-worli'
  },

  images: {
    hero: '/optimized/Scrapiz-Worli.webp',
    alt: 'Scrapiz Worli Scrap Shop'
  }
}
    };