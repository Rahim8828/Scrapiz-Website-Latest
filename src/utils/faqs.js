export const generateFAQs = (location) => {
    const { name, nap } = location;
  
    return [
      {
        question: `Q1: Do you provide doorstep scrap pickup in ${name}, and is there a minimum quantity required for pickup?`,
        answer: `Yes, Scrapiz offers free doorstep scrap pickup in ${name}. There is no strict minimum quantity — most normal household scrap (20–30 kg) is picked up for free. For very small quantities, a nominal ₹60 convenience fee may apply.`
      },
      {
        question: `Q2: What scrap items do you buy in ${name}?`,
        answer: `We buy all types of scrap in ${name} including iron, steel, aluminum, copper, paper, plastic, furniture, and electronic e-waste.`
      },
      {
        question: `Q3: How can I book scrap pickup in ${name}?`,
        answer: `You can easily book scrap pickup in ${name} by calling us at ${nap.phoneDisplay} or contacting us on WhatsApp for instant service.`
      },
      {
        question: `Q4: Do you offer the best scrap rates in ${name}?`,
        answer: `Yes, Scrapiz provides the most competitive and updated scrap prices in ${name}. We ensure fair pricing based on current market rates.`
      },
      {
        question: `Q5: Do you provide scrap pickup in nearby areas of ${name}?`,
        answer: `Yes, along with ${name}, we also provide scrap pickup services in nearby areas and suburbs.`
      },
      {
        question: `Q6: How quickly can scrap be picked up in ${name}?`,
        answer: `In most cases, we offer same-day or next-day scrap pickup in ${name}, depending on availability.`
      },
      {
        question: `Q7: Is payment instant after scrap pickup?`,
        answer: `Yes, we provide instant payment via UPI, bank transfer, or cash immediately after weighing your scrap.`
      },
      {
        question: `Q8: Do I need to separate scrap before pickup in ${name}?`,
        answer: `No, you don’t need to separate scrap before pickup in ${name}. Our team will handle sorting and ensure proper categorization for accurate pricing.`
      },
      {
        question: `Q9: Do you provide bulk scrap pickup for offices or businesses in ${name}?`,
        answer: `Yes, we offer bulk scrap pickup services in ${name} for offices, warehouses, societies, and industries. We also provide special pricing for large quantities.`
      },
      {
        question: `Q10: Is Scrapiz an eco-friendly scrap recycling service in ${name}?`,
        answer: `Yes, Scrapiz follows eco-friendly recycling practices in ${name}. All collected scrap is sent to authorized recycling facilities to reduce environmental impact.`
      },
      {
        question: `Q11: Can I schedule scrap pickup for a specific time in ${name}?`,
        answer: `Yes, you can schedule scrap pickup at your preferred time in ${name}. We offer flexible time slots for your convenience.`
      },
      {
        question: `Q12: Do you charge any hidden fees for scrap pickup in ${name}?`,
        answer: `No, Scrapiz maintains complete transparency. There are no hidden charges for scrap pickup in ${name}. You only pay a small fee for very low quantities if applicable.`
      },
      {
        question: `Q13: What happens to the scrap after collection?`,
        answer: `After collection, scrap is sorted, processed, and sent to authorized recycling units. This ensures safe disposal and maximum reuse of materials.`
      },
      {
        question: `Q14: Can I sell old electronics and e-waste in ${name}?`,
        answer: `Yes, we accept all types of e-waste in ${name} including laptops, computers, mobile phones, printers, and other electronic devices.`
      },
      {
        question: `Q15: Do you provide scrap pickup on weekends in ${name}?`,
        answer: `Yes, Scrapiz provides scrap pickup services in ${name} on weekends as well, subject to availability.`
      }
    ];
  };