import { motion } from "motion/react";

export function About() {
  const team = [
    { name: "Sarah Chen", role: "CEO & Founder", avatar: "👩‍💼" },
    { name: "Michael Rodriguez", role: "CTO", avatar: "👨‍💻" },
    { name: "Emma Thompson", role: "Head of Sustainability", avatar: "👩‍🔬" },
    { name: "David Kim", role: "Lead Designer", avatar: "👨‍🎨" },
  ];

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
            About <span className="text-[#10B981]">EcoTrack</span>
          </h1>
          <p className="text-white/60 mt-6 max-w-3xl mx-auto text-lg">
            We're on a mission to make sustainability accessible, engaging, and impactful for everyone.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="backdrop-blur-[24px] bg-gradient-to-br from-[#10B981]/10 to-[#3B82F6]/10 border border-white/10 rounded-3xl p-12 mb-16"
        >
          <h2 className="mb-6" style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700 }}>
            Our Mission
          </h2>
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            Founded in 2024, EcoTrack was born from a simple belief: individual actions, when multiplied by millions, can transform our planet. We combine cutting-edge AI technology with behavioral science to help people understand and reduce their environmental impact.
          </p>
          <p className="text-white/80 text-lg leading-relaxed">
            Today, we're proud to serve over 342,000 users across 156 countries, collectively saving millions of tons of CO₂ and building a more sustainable future together.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="mb-16">
          <h2 className="text-center mb-12" style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700 }}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌍",
                title: "Planet First",
                description: "Every decision we make considers its environmental impact first.",
              },
              {
                icon: "📊",
                title: "Data-Driven",
                description: "We use science and real-time data to guide sustainable choices.",
              },
              {
                icon: "🤝",
                title: "Community Powered",
                description: "Together we're stronger. Collaboration drives real change.",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="text-6xl mb-6">{value.icon}</div>
                <h3 className="mb-3" style={{ fontSize: '24px', fontWeight: 600 }}>
                  {value.title}
                </h3>
                <p className="text-white/60">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-center mb-12" style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700 }}>
            Meet the Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:bg-white/[0.07] transition-all duration-300 group"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>
                <h3 className="mb-2" style={{ fontSize: '20px', fontWeight: 600 }}>
                  {member.name}
                </h3>
                <p className="text-white/60 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 text-center backdrop-blur-[24px] bg-gradient-to-br from-[#10B981]/10 to-[#3B82F6]/10 border border-white/10 rounded-3xl p-16"
        >
          <h2 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em' }} className="mb-6">
            Join Our Journey
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            We're always looking for passionate individuals who want to make a difference.
          </p>
          <button className="px-8 py-4 rounded-full bg-[#10B981] text-[#050505] hover:scale-105 transition-transform duration-300">
            View Open Positions
          </button>
        </motion.div>
      </div>
    </div>
  );
}
