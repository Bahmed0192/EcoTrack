import { motion } from "motion/react";
import { Link } from "react-router";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-9xl mb-8"
        >
          🌍
        </motion.div>

        <h1 style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 700, letterSpacing: '-0.02em' }} className="mb-6">
          404
        </h1>

        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 600 }} className="mb-4">
          Page Not Found
        </h2>

        <p className="text-white/60 text-lg mb-12 max-w-md mx-auto">
          Looks like this page took a detour to save the planet. Let's get you back on track.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#10B981] text-[#050505] hover:scale-105 transition-transform duration-300"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
