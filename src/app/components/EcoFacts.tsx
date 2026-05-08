import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const ECO_FACTS = [
  {
    fact: "The fashion industry produces 10% of all global carbon emissions — more than aviation and shipping combined.",
    category: "Fashion",
    icon: "👗",
    source: "UNEP",
  },
  {
    fact: "Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
    category: "Recycling",
    icon: "♻️",
    source: "EPA",
  },
  {
    fact: "Trees absorb approximately 48 lbs of CO₂ per year and can sequester 1 ton over its lifetime.",
    category: "Nature",
    icon: "🌳",
    source: "Arbor Day Foundation",
  },
  {
    fact: "A single transatlantic flight produces about 1.6 tonnes of CO₂ — roughly the same as the average person in India emits in an entire year.",
    category: "Transport",
    icon: "✈️",
    source: "Our World in Data",
  },
  {
    fact: "Producing 1 kg of beef requires 15,000 liters of water and generates 27 kg of CO₂.",
    category: "Food",
    icon: "🥩",
    source: "Water Footprint Network",
  },
  {
    fact: "If food waste were a country, it would be the third-largest emitter of greenhouse gases after China and the US.",
    category: "Waste",
    icon: "🗑️",
    source: "FAO",
  },
  {
    fact: "LED bulbs use 75% less energy and last 25 times longer than incandescent lighting.",
    category: "Energy",
    icon: "💡",
    source: "Energy.gov",
  },
  {
    fact: "The ocean absorbs about 30% of CO₂ produced by humans, making it increasingly acidic and threatening marine life.",
    category: "Ocean",
    icon: "🌊",
    source: "NOAA",
  },
];

export function EcoFacts() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ECO_FACTS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = ECO_FACTS[currentIndex];

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
            📚 Did You <span className="text-[#F59E0B]">Know?</span>
          </h2>
          <p className="text-white/50 mt-2 text-sm">
            Environmental facts for students, educators, and curious minds
          </p>
        </motion.div>

        <div className="relative backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden min-h-[180px]">
          {/* Ambient glow */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[120px] opacity-15"
            style={{ backgroundColor: "#F59E0B" }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{current.icon}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-[#F59E0B] font-medium">
                  {current.category}
                </span>
              </div>
              <p className="text-white/90 text-lg leading-relaxed mb-4" style={{ fontWeight: 500 }}>
                {current.fact}
              </p>
              <p className="text-white/30 text-xs">
                Source: {current.source}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {ECO_FACTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-[#F59E0B] w-6" : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
