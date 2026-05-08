import { CommunityHub } from "../components/CommunityHub";
import { motion } from "motion/react";

export function Community() {
  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Community <span className="text-[#10B981]">Challenges</span>
          </h1>
          <p className="text-white/60 mt-6 max-w-3xl mx-auto text-lg">
            Join millions of eco-warriors making a real impact. Complete challenges, earn rewards, and climb the leaderboard.
          </p>
        </motion.div>

        <CommunityHub />

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Active Members", value: "342K+", icon: "👥" },
            { label: "Challenges Completed", value: "1.2M", icon: "✅" },
            { label: "CO₂ Saved Together", value: "5.8M tons", icon: "🌍" },
            { label: "Trees Planted", value: "456K", icon: "🌳" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="text-[#10B981] mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>
                {stat.value}
              </div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
