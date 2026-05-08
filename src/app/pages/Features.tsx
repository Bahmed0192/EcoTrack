import { motion } from "motion/react";

export function Features() {
  const features = [
    {
      icon: "📊",
      title: "Real-Time Analytics",
      description: "Track your carbon footprint in real-time with AI-powered insights and personalized recommendations.",
      color: "#10B981",
    },
    {
      icon: "🌍",
      title: "Global Impact Map",
      description: "Visualize air quality and sustainability metrics across the globe with interactive data points.",
      color: "#3B82F6",
    },
    {
      icon: "🎯",
      title: "Smart Goals",
      description: "Set and achieve sustainability goals with intelligent tracking and milestone celebrations.",
      color: "#10B981",
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description: "Get personalized recommendations based on your habits and environmental impact patterns.",
      color: "#3B82F6",
    },
    {
      icon: "🏆",
      title: "Gamification",
      description: "Earn rewards, complete challenges, and compete with eco-warriors worldwide.",
      color: "#F59E0B",
    },
    {
      icon: "📱",
      title: "Mobile Ready",
      description: "Access your sustainability dashboard anywhere with our fully responsive platform.",
      color: "#10B981",
    },
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
            Powerful <span className="text-[#10B981]">Features</span>
          </h1>
          <p className="text-white/60 mt-6 max-w-3xl mx-auto text-lg">
            Everything you need to track, analyze, and reduce your environmental impact with cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 relative overflow-hidden group"
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{ backgroundColor: feature.color }}
              />

              <div className="relative">
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="mb-3" style={{ fontSize: '24px', fontWeight: 600 }}>
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Built For - Target User Personas */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24"
        >
          <h2 className="text-center mb-12" style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Built For <span className="text-[#10B981]">Everyone</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌿",
                title: "Eco-Conscious Individuals",
                features: ["Carbon footprint calculator", "Daily action logging with points", "AI-powered sustainability tips", "Gamified tier progression"],
                color: "#10B981",
              },
              {
                icon: "🏢",
                title: "Community Organizers / NGOs",
                features: ["Create & manage community challenges", "Role-based access (Organizer role)", "Team leaderboard & group impact", "Mobilize members for eco-goals"],
                color: "#3B82F6",
              },
              {
                icon: "🎓",
                title: "Students & Educators",
                features: ["Interactive global air quality map", "Real-time AQI data with science panels", "Rotating eco-facts with sources", "Visual carbon breakdown charts"],
                color: "#F59E0B",
              },
            ].map((persona, i) => (
              <motion.div
                key={persona.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
                whileHover={{ y: -5 }}
                className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[100px] opacity-10" style={{ backgroundColor: persona.color }} />
                <div className="relative">
                  <div className="text-5xl mb-4">{persona.icon}</div>
                  <h3 className="mb-4" style={{ fontSize: '20px', fontWeight: 600, color: persona.color }}>{persona.title}</h3>
                  <ul className="space-y-2">
                    {persona.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="text-[#10B981] mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Eco Knowledge Section for Educators */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-24"
        >
          <div className="text-center mb-12">
            <h2 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              📚 Eco <span className="text-[#F59E0B]">Knowledge Hub</span>
            </h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto">
              Interactive learning tools designed for classrooms and self-study
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: "🌡️",
                title: "Understanding AQI Levels",
                desc: "Our interactive Air Quality Map explains what PM2.5, Ozone, and other pollutants mean for your health, with WHO-referenced safety thresholds and actionable advice per AQI bracket.",
                color: "#EF4444",
              },
              {
                icon: "🧮",
                title: "Carbon Footprint Math",
                desc: "The Impact Engine breaks down CO₂ emissions into transport, energy, diet, and shopping using real emission factors (e.g., 0.21 kg CO₂/km for driving, 0.82 kg/kWh for electricity).",
                color: "#10B981",
              },
              {
                icon: "📖",
                title: "Did You Know? Eco-Facts",
                desc: "A rotating carousel of sourced environmental facts from UNEP, EPA, FAO, and more — perfect for classroom discussions or daily learning prompts.",
                color: "#F59E0B",
              },
              {
                icon: "🏅",
                title: "Gamified Learning",
                desc: "Students earn EcoPoints for sustainable habits, compete on leaderboards with tier progression (Bronze → Platinum), and build long-term environmental awareness through daily streaks.",
                color: "#3B82F6",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4"
              >
                <div className="text-4xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: item.color }}>{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-24 text-center backdrop-blur-[24px] bg-gradient-to-br from-[#10B981]/10 to-[#3B82F6]/10 border border-white/10 rounded-3xl p-16"
        >
          <h2 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em' }} className="mb-6">
            Ready to make an impact?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users making a difference for our planet every single day.
          </p>
          <button className="px-8 py-4 rounded-full bg-[#10B981] text-[#050505] hover:scale-105 transition-transform duration-300">
            Start Your Journey
          </button>
        </motion.div>
      </div>
    </div>
  );
}
