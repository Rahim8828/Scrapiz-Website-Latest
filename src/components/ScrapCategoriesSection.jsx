import React, { useState, useMemo, useRef } from "react";
import { Sparkles, Plus, Minus, Trash2, ArrowRight, Phone, IndianRupee, FileText, Wrench, Recycle, Monitor, Home, MousePointerClick } from "lucide-react";

const categoryIcons = {
  paper: FileText,
  metals: Wrench,
  plastic: Recycle,
  ewaste: Monitor,
  appliances: Home,
};

const categories = [
  {
    id: "paper",
    label: "Paper",
    items: [
      { id: "newspaper", name: "Newspaper", minRate: 12, maxRate: 18, rate: 15, unit: "kg", image: "/assets-optimized/newspaper.png" },
      { id: "cardboard", name: "Cardboard", minRate: 8, maxRate: 14, rate: 11, unit: "kg", image: "/assets-optimized/cardboard.png" },
    ],
  },
  {
    id: "metals",
    label: "Metals",
    items: [
      { id: "iron", name: "Iron & Steel", minRate: 28, maxRate: 32, rate: 30, unit: "kg", image: "/assets-optimized/iron.png" },
      { id: "aluminium", name: "Aluminium", minRate: 110, maxRate: 120, rate: 115, unit: "kg", image: "/assets-optimized/aluminium.png" },
      { id: "copper", name: "Copper", minRate: 450, maxRate: 480, rate: 470, unit: "kg", image: "/assets-optimized/copper.png" },
      { id: "brass", name: "Brass", minRate: 320, maxRate: 340, rate: 330, unit: "kg", image: "/assets-optimized/brass.png" },
      { id: "stainless", name: "Stainless Steel", minRate: 50, maxRate: 60, rate: 55, unit: "kg", image: "/assets-optimized/stainlesssteel.png" },
    ],
  },
  {
    id: "plastic",
    label: "Plastic",
    items: [
      { id: "plastic", name: "Plastic (Hard)", minRate: 8, maxRate: 16, rate: 12, unit: "kg", image: "/assets-optimized/hardplastic.png" },
      { id: "pet", name: "PET Bottles", minRate: 12, maxRate: 20, rate: 16, unit: "kg", image: "/assets-optimized/petbottels.png" },
    ],
  },
  {
    id: "ewaste",
    label: "E-Waste",
    items: [
      { id: "ewaste", name: "E-Waste", minRate: 50, maxRate: 500, rate: 200, unit: "piece", image: "/assets-optimized/ewaste.jpg" },
    ],
  },
  {
    id: "appliances",
    label: "Appliances",
    items: [
      { id: "ac", name: "AC Scrap", minRate: 2000, maxRate: 8000, rate: 4000, unit: "piece", image: "/assets-optimized/ac.png" },
      { id: "fridge", name: "Refrigerator", minRate: 800, maxRate: 2500, rate: 1500, unit: "piece", image: "/assets-optimized/refrigerator.jpg" },
      { id: "washing", name: "Washing Machine", minRate: 500, maxRate: 1500, rate: 1000, unit: "piece", image: "/assets-optimized/washingmachine.png" },
      { id: "microwave", name: "Microwave", minRate: 200, maxRate: 500, rate: 350, unit: "piece", image: "/assets-optimized/microwave.jpg" },
    ],
  },
];

// flat lookup for estimator
const allItems = categories.flatMap(c => c.items);

const ScrapCategoriesSection = () => {
  const [activeCategory, setActiveCategory] = useState("paper");
  const [selectedItems, setSelectedItems] = useState({});
  const estimatorRef = useRef(null);

  const handleAdd = (id) => {
    setSelectedItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setTimeout(() => {
      estimatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleIncrement = (id) => setSelectedItems(prev => ({ ...prev, [id]: prev[id] + 1 }));

  const handleDecrement = (id) => {
    setSelectedItems(prev => {
      const next = { ...prev };
      if (next[id] <= 1) delete next[id];
      else next[id] -= 1;
      return next;
    });
  };

  const handleRemove = (id) => {
    setSelectedItems(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const totalEstimate = useMemo(() => {
    return Object.entries(selectedItems).reduce((total, [id, qty]) => {
      const item = allItems.find(i => i.id === id);
      return total + (item ? item.rate * qty : 0);
    }, 0);
  }, [selectedItems]);

  const hasItems = Object.keys(selectedItems).length > 0;

  const handleGetQuote = () => {
    const itemsList = Object.entries(selectedItems)
      .map(([id, qty]) => {
        const item = allItems.find(i => i.id === id);
        return `• ${item.name}: ${qty} ${item.unit}`;
      })
      .join("\n");
    const message = `Hi, I want to sell scrap:\n\n${itemsList}\n\nEstimated Value: ₹${totalEstimate}`;
    window.open(`https://wa.me/918828700630?text=${encodeURIComponent(message)}`, "_blank");
  };

  const activeItems = categories.find(c => c.id === activeCategory)?.items ?? [];

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">What We Buy</span>
          </div>
          <h2 className="text-3xl font-bold">Sell Any Type of Scrap</h2>
          <p className="text-gray-500 mt-2 text-sm">Pick a category, then click items to add them to your estimate</p>
        </div>

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => {
            const catCount = cat.items.filter(i => selectedItems[i.id] > 0).length;
            const Icon = categoryIcons[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all
                  ${activeCategory === cat.id
                    ? "bg-green-600 text-white border-green-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
                {catCount > 0 && (
                  <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center
                    ${activeCategory === cat.id ? "bg-white text-green-600" : "bg-green-100 text-green-700"}`}>
                    {catCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ITEMS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {activeItems.map((item) => {
            const qty = selectedItems[item.id] || 0;
            const isSelected = qty > 0;
            return (
              <div
                key={item.id}
                onClick={() => handleAdd(item.id)}
                className={`cursor-pointer rounded-xl overflow-hidden transition-all group border
                  ${isSelected
                    ? "bg-green-50 border-green-500 shadow-md"
                    : "bg-white border-gray-200 hover:border-green-300 hover:shadow-md"
                  }`}
              >
                <div className="h-40 p-2 flex items-center justify-center bg-gray-50 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition" />
                  {isSelected && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {qty}
                    </span>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-sm text-gray-800">{item.name}</h3>
                  <p className="text-green-600 text-xs mt-0.5">₹{item.minRate}–{item.maxRate}/{item.unit}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ESTIMATOR */}
        <div ref={estimatorRef} className="max-w-5xl mx-auto scroll-mt-24">
          <h3 className="text-2xl font-bold text-center mb-6">Your Scrap Value Calculator</h3>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT — selected items */}
            <div className="lg:col-span-2 bg-gray-50 rounded-2xl p-6 min-h-[200px]">
              {hasItems ? (
                <div className="space-y-3">
                  {Object.entries(selectedItems).map(([id, qty]) => {
                    const item = allItems.find(i => i.id === id);
                    return (
                      <div key={id} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">₹{item.rate}/{item.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); handleDecrement(id); }} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{qty}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleIncrement(id); }} className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 text-green-700 flex items-center justify-center transition">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-green-700 w-20 text-right">₹{(item.rate * qty).toLocaleString()}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleRemove(id); }} className="text-gray-300 hover:text-red-400 transition ml-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                  <MousePointerClick className="w-10 h-10 mb-3 text-gray-300" />
                  <p className="text-sm">Click items above to add them here</p>
                </div>
              )}
            </div>

            {/* RIGHT — total + CTA */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h4 className="text-lg font-bold flex items-center gap-2 mb-5">
                  <IndianRupee className="w-5 h-5" />
                  Your Estimate
                  {hasItems && (
                    <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                      {Object.keys(selectedItems).length} items
                    </span>
                  )}
                </h4>

                <div className="bg-white/10 rounded-xl p-4 mb-5 text-center">
                  <p className="text-sm text-green-100 mb-1">Estimated Total</p>
                  <p className="text-4xl font-bold">{hasItems ? `₹${totalEstimate.toLocaleString()}` : "₹0"}</p>
                  {hasItems && <p className="text-xs text-green-200 mt-1">*Approximate value</p>}
                </div>

                <button
                  onClick={handleGetQuote}
                  disabled={!hasItems}
                  className="w-full bg-white text-green-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Get Quote on WhatsApp
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-5 pt-4 border-t border-white/20 text-center">
                  <a href="tel:+918828700630" className="flex items-center justify-center gap-2 text-sm hover:text-green-200 transition">
                    <Phone className="w-4 h-4" />
                    Need help? Call now
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default ScrapCategoriesSection;
