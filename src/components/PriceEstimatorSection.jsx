import React from "react";
import { IndianRupee, ArrowRight, Phone } from "lucide-react";

const PriceEstimatorSection = ({
  selectedItems,
  scrapItems,
  totalEstimate,
  onGetQuote
}) => {
  const hasItems = Object.values(selectedItems).some(v => v > 0);

  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl shadow-2xl p-6 sticky top-24">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <IndianRupee className="w-5 h-5" />
          Your Estimate
        </h3>

        {hasItems && (
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
            {Object.values(selectedItems).filter(v => v > 0).length} items
          </span>
        )}
      </div>

      {/* ITEMS LIST */}
      {hasItems ? (
        <>
          <div className="space-y-2 mb-5 max-h-48 overflow-y-auto">

            {Object.entries(selectedItems)
              .filter(([_, qty]) => qty > 0)
              .map(([id, qty]) => {
                const item = scrapItems.find(i => i.id === id);

                return (
                  <div
                    key={id}
                    className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-green-200">
                        {qty} {item.unit}
                      </p>
                    </div>

                    <span className="font-bold">
                      ₹{(item.rate * qty).toLocaleString()}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* TOTAL */}
          <div className="bg-white/10 rounded-xl p-4 mb-5 text-center">
            <p className="text-sm text-green-100 mb-1">Estimated Total</p>
            <h2 className="text-3xl font-bold">
              ₹{totalEstimate.toLocaleString()}
            </h2>
          </div>

          {/* CTA */}
          <button
            onClick={onGetQuote}
            className="w-full bg-white text-green-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition"
          >
            Get Quote on WhatsApp
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      ) : (
        /* EMPTY STATE */
        <div className="text-center py-10">
          <div className="text-4xl mb-3">🧮</div>
          <p className="text-sm text-green-100">
            Select items to calculate price
          </p>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-5 pt-4 border-t border-white/20 text-center">
        <a
          href="tel:+918828700630"
          className="flex items-center justify-center gap-2 text-sm hover:text-green-200"
        >
          <Phone className="w-4 h-4" />
          Need help? Call now
        </a>
      </div>
    </div>
  );
};

export default PriceEstimatorSection;