import { motion } from "motion/react";
import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import * as Progress from "@radix-ui/react-progress";
import api from "../api";
import { useAuthStore } from "../store/authStore";

export function ImpactEngine() {
  const [transport, setTransport] = useState([200]);
  const [energy, setEnergy] = useState([300]);
  const [shopping, setShopping] = useState([150]);
  const [food, setFood] = useState('Omnivore');
  
  const [dailyScore, setDailyScore] = useState(78);
  const [calculatedTotal, setCalculatedTotal] = useState<number | null>(null);
  const [aiTip, setAiTip] = useState<string>("Ready to analyze your footprint.");
  const [isCalculating, setIsCalculating] = useState(false);

  const { isAuthenticated } = useAuthStore();

  const handleCalculate = async () => {
    if (!isAuthenticated) {
      alert("Please sign in to log your footprint!");
      return;
    }
    
    setIsCalculating(true);
    try {
      const response = await api.post('/footprint/calculate', {
        transport: transport[0],
        energy: energy[0],
        food,
        shopping: shopping[0]
      });
      
      setCalculatedTotal(response.data.footprintLog.total_co2);
      if (response.data.aiTip) {
        setAiTip(response.data.aiTip);
      } else {
        setAiTip("Great job logging your footprint! Small daily changes add up.");
      }
    } catch (error) {
      console.error("Failed to calculate footprint:", error);
      alert("Error calculating footprint. Are you logged in?");
    } finally {
      setIsCalculating(false);
    }
  };

  // Streak data (30 days)
  const streakData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    intensity: Math.floor(Math.random() * 5),
  }));

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Your Impact <span className="text-[#10B981]">Dashboard</span>
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Real-time tracking of your carbon footprint with AI-powered recommendations
          </p>
        </motion.div>

        {/* Bento Grid - 3x3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Carbon Calculator - spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-2 backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="mb-2" style={{ fontSize: '24px', fontWeight: 600 }}>Carbon Calculator</h3>
                <p className="text-white/60 text-sm">Log your monthly activities</p>
              </div>
              <div className="backdrop-blur-[24px] bg-[#10B981]/20 border border-[#10B981]/30 rounded-full p-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#10B981" />
                </svg>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transport Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Transport (km)</span>
                    <span className="text-[#3B82F6] font-bold">{transport[0]}</span>
                  </div>
                  <Slider.Root className="relative flex items-center select-none touch-none w-full h-5" value={transport} onValueChange={setTransport} max={1000} step={10}>
                    <Slider.Track className="bg-white/10 relative grow rounded-full h-2">
                      <Slider.Range className="absolute bg-[#3B82F6] h-full rounded-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-[#3B82F6] rounded-full hover:scale-110 transition-transform" />
                  </Slider.Root>
                </div>

                {/* Energy Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Energy (kWh)</span>
                    <span className="text-[#10B981] font-bold">{energy[0]}</span>
                  </div>
                  <Slider.Root className="relative flex items-center select-none touch-none w-full h-5" value={energy} onValueChange={setEnergy} max={1000} step={10}>
                    <Slider.Track className="bg-white/10 relative grow rounded-full h-2">
                      <Slider.Range className="absolute bg-[#10B981] h-full rounded-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-[#10B981] rounded-full hover:scale-110 transition-transform" />
                  </Slider.Root>
                </div>

                {/* Shopping Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Shopping ($)</span>
                    <span className="text-[#F59E0B] font-bold">{shopping[0]}</span>
                  </div>
                  <Slider.Root className="relative flex items-center select-none touch-none w-full h-5" value={shopping} onValueChange={setShopping} max={1000} step={10}>
                    <Slider.Track className="bg-white/10 relative grow rounded-full h-2">
                      <Slider.Range className="absolute bg-[#F59E0B] h-full rounded-full" />
                    </Slider.Track>
                    <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-[#F59E0B] rounded-full hover:scale-110 transition-transform" />
                  </Slider.Root>
                </div>

                {/* Diet Select */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Diet Type</span>
                    <span className="text-[#8B5CF6] font-bold">{food}</span>
                  </div>
                  <select 
                    value={food} 
                    onChange={(e) => setFood(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Vegan" className="bg-gray-900">Vegan</option>
                    <option value="Vegetarian" className="bg-gray-900">Vegetarian</option>
                    <option value="Omnivore" className="bg-gray-900">Omnivore</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
                <div>
                  <div className="text-white/60 text-sm">Total Footprint</div>
                  <div className="text-white text-2xl font-bold">
                    {calculatedTotal !== null ? `${calculatedTotal.toFixed(2)} kg CO₂` : '---'}
                  </div>
                </div>
                <button 
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="px-6 py-2 bg-gradient-to-r from-[#10B981] to-[#3B82F6] rounded-full text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isCalculating ? 'Calculating...' : 'Log Footprint'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Daily Score - Circular Progress */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 flex flex-col items-center justify-center"
          >
            <h3 className="mb-6 self-start" style={{ fontSize: '20px', fontWeight: 600 }}>Daily Score</h3>

            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - dailyScore / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[#10B981]" style={{ fontSize: '48px', fontWeight: 700 }}>{dailyScore}</span>
                <span className="text-white/60 text-sm">out of 100</span>
              </div>
            </div>

            <p className="text-white/60 text-sm text-center mt-6">
              🌟 Excellent! You're in the top 10%
            </p>
          </motion.div>

          {/* Streak Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-2 backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 600 }}>30-Day Streak</h3>
                <p className="text-white/60 text-sm mt-1">Your consistency journey</p>
              </div>
              <div className="text-right">
                <div className="text-[#10B981]" style={{ fontSize: '28px', fontWeight: 700 }}>24 days</div>
                <div className="text-white/60 text-xs">Current streak</div>
              </div>
            </div>

            <div className="grid grid-cols-10 gap-2">
              {streakData.map((day) => (
                <div
                  key={day.day}
                  className="aspect-square rounded-md transition-all duration-300 hover:scale-110"
                  style={{
                    backgroundColor: day.intensity === 0 ? 'rgba(255,255,255,0.05)' :
                                   day.intensity === 1 ? 'rgba(16,185,129,0.2)' :
                                   day.intensity === 2 ? 'rgba(16,185,129,0.4)' :
                                   day.intensity === 3 ? 'rgba(16,185,129,0.6)' :
                                   day.intensity === 4 ? 'rgba(16,185,129,0.8)' :
                                   '#10B981',
                  }}
                  title={`Day ${day.day}`}
                />
              ))}
            </div>
          </motion.div>

          {/* AI Assistant Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="backdrop-blur-[24px] bg-gradient-to-br from-[#10B981]/10 to-[#3B82F6]/10 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 relative overflow-hidden"
          >
            {/* Animated glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 right-0 w-32 h-32 bg-[#10B981] rounded-full blur-[80px]"
            />

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600 }}>AI Assistant</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[#10B981]"
                    />
                    <span className="text-white/60 text-xs">Online</span>
                  </div>
                </div>
              </div>

              <p className="text-white/80 text-sm mb-4">
                {aiTip}
              </p>

              <button 
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 text-sm"
              >
                {isCalculating ? "Generating..." : "Get Recommendations"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
