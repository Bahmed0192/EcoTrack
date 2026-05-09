import { motion } from "motion/react";
import { EarthAnimation } from "./EarthAnimation";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#10B981]/10 via-transparent to-transparent" />

      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Floating metric badges */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-8"
        >
          <div className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-full px-6 py-2">
            <span className="text-[#10B981]">1.2M Tons</span>
            <span className="text-white/60 ml-2">CO₂ Saved</span>
          </div>
          <div className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-full px-6 py-2">
            <span className="text-[#3B82F6]">342K</span>
            <span className="text-white/60 ml-2">Active Users</span>
          </div>
          <div className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-full px-6 py-2">
            <span className="text-[#10B981]">98%</span>
            <span className="text-white/60 ml-2">Impact Rate</span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
          style={{
            fontSize: 'clamp(48px, 8vw, 84px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          Track Your Planet's
          <br />
          <span className="bg-gradient-to-r from-[#10B981] via-[#3B82F6] to-[#10B981] bg-clip-text text-transparent">
            Carbon Footprint
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-white/60 max-w-2xl mx-auto mb-12"
          style={{ fontSize: '18px', lineHeight: '1.7' }}
        >
          Join the movement towards sustainable living. Monitor, analyze, and reduce your environmental impact with AI-powered insights and real-time global data.
        </motion.p>

        {/* 3D Earth Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="relative mx-auto mb-12"
          style={{ width: 'min(500px, 90vw)', height: 'min(500px, 90vw)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/30 via-[#3B82F6]/20 to-[#10B981]/30 rounded-full blur-[80px]" />
          <div className="relative w-full h-full">
            <EarthAnimation />
          </div>
        </motion.div>

        {/* CTA Button with radial glow */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <button className="group relative px-8 py-4 rounded-full bg-[#10B981] text-[#050505] overflow-hidden transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-[#10B981] to-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl bg-[#10B981] transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              Start Your Journey
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
