import { motion } from "motion/react";
import { useState, useEffect } from "react";
import api from "../api";
import { useAuthStore } from "../store/authStore";
import confetti from "canvas-confetti";
import { toast } from "sonner";

const ACTION_PRESETS = [
  { category: "Transport", description: "Biked to work", co2_saved: 2.4, points_earned: 25, icon: "🚲" },
  { category: "Transport", description: "Used public transit", co2_saved: 1.8, points_earned: 20, icon: "🚌" },
  { category: "Energy", description: "Turned off unused lights", co2_saved: 0.5, points_earned: 10, icon: "💡" },
  { category: "Energy", description: "Air-dried laundry", co2_saved: 1.2, points_earned: 15, icon: "☀️" },
  { category: "Food", description: "Had a plant-based meal", co2_saved: 1.5, points_earned: 15, icon: "🥗" },
  { category: "Food", description: "Composted food waste", co2_saved: 0.8, points_earned: 10, icon: "🌿" },
  { category: "Shopping", description: "Used reusable bags", co2_saved: 0.3, points_earned: 5, icon: "🛍️" },
  { category: "Shopping", description: "Bought second-hand", co2_saved: 2.0, points_earned: 20, icon: "♻️" },
];

interface EcoActionItem {
  _id: string;
  category: string;
  description: string;
  co2_saved: number;
  points_earned: number;
  logged_at: string;
}

export function EcoActionLog() {
  const { isAuthenticated } = useAuthStore();
  const [actions, setActions] = useState<EcoActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [justLogged, setJustLogged] = useState<string | null>(null);
  const [customMode, setCustomMode] = useState(false);
  const [custom, setCustom] = useState({ category: "Transport", description: "", co2_saved: 1, points_earned: 10 });

  useEffect(() => {
    if (isAuthenticated) fetchActions();
  }, [isAuthenticated]);

  const fetchActions = async () => {
    try {
      const res = await api.get("/actions");
      setActions(res.data);
    } catch (err) {
      console.error("Failed to fetch actions:", err);
    }
  };

  const logAction = async (preset: typeof ACTION_PRESETS[0]) => {
    if (!isAuthenticated) { toast.error("Please sign in first!"); return; }
    setIsLoading(true);
    try {
      const res = await api.post("/actions", {
        category: preset.category,
        description: preset.description,
        co2_saved: preset.co2_saved,
        points_earned: preset.points_earned,
      });
      const { action, user: updatedUser } = res.data;
      setActions([action, ...actions]);
      setJustLogged(action._id);
      
      // Refresh store with updated streak & points
      if (updatedUser) {
        useAuthStore.getState().updateUser({
          total_eco_points: updatedUser.total_eco_points,
          streak_days: updatedUser.streak_days,
        });
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F59E0B']
      });
      toast.success(`Awesome! You earned ${action.points_earned} points! 🌱 Streak: ${updatedUser?.streak_days || 0} days 🔥`);
      
      setTimeout(() => setJustLogged(null), 2000);
    } catch (err) {
      console.error("Failed to log action:", err);
      toast.error("Failed to log action.");
    } finally {
      setIsLoading(false);
    }
  };

  const logCustomAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error("Please sign in first!"); return; }
    setIsLoading(true);
    try {
      const res = await api.post("/actions", custom);
      const { action, user: updatedUser } = res.data;
      setActions([action, ...actions]);
      setJustLogged(action._id);
      setCustom({ category: "Transport", description: "", co2_saved: 1, points_earned: 10 });
      setCustomMode(false);
      
      // Refresh store with updated streak & points
      if (updatedUser) {
        useAuthStore.getState().updateUser({
          total_eco_points: updatedUser.total_eco_points,
          streak_days: updatedUser.streak_days,
        });
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#F59E0B']
      });
      toast.success(`Great job! You earned ${action.points_earned} points! 🌍`);
      
      setTimeout(() => setJustLogged(null), 2000);
    } catch (err) {
      console.error("Failed to log action:", err);
      toast.error("Failed to log custom action.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPoints = actions.reduce((sum, a) => sum + a.points_earned, 0);
  const totalCO2 = actions.reduce((sum, a) => sum + a.co2_saved, 0);

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Eco-Action <span className="text-[#10B981]">Log</span>
          </h1>
          <p className="text-white/60 mt-4">Log sustainable actions, earn points, and track your positive impact.</p>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: "Actions Logged", value: actions.length, icon: "📝", color: "#3B82F6" },
            { label: "Points Earned", value: totalPoints.toLocaleString(), icon: "⭐", color: "#10B981" },
            { label: "CO₂ Saved (kg)", value: totalCO2.toFixed(1), icon: "🌍", color: "#F59E0B" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <div className="text-white/60 text-sm">{s.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick-Log Presets */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: '22px', fontWeight: 600 }}>Quick Log</h2>
            <button onClick={() => setCustomMode(!customMode)} className="text-sm text-[#10B981] hover:underline">
              {customMode ? "← Back to presets" : "+ Custom Action"}
            </button>
          </div>

          {customMode ? (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={logCustomAction}
              className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={custom.category} onChange={e => setCustom({ ...custom, category: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#10B981]">
                  {["Transport", "Energy", "Food", "Shopping", "Other"].map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                </select>
                <input value={custom.description} onChange={e => setCustom({ ...custom, description: e.target.value })}
                  placeholder="What did you do?" required
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#10B981]" />
                <input type="number" step="0.1" min="0" value={custom.co2_saved} onChange={e => setCustom({ ...custom, co2_saved: +e.target.value })}
                  placeholder="CO₂ saved (kg)"
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#10B981]" />
                <input type="number" min="0" value={custom.points_earned} onChange={e => setCustom({ ...custom, points_earned: +e.target.value })}
                  placeholder="Points"
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#10B981]" />
              </div>
              <button type="submit" disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#10B981] text-[#050505] font-semibold hover:scale-[1.01] transition-transform disabled:opacity-50">
                {isLoading ? "Logging..." : "Log Custom Action 🌿"}
              </button>
            </motion.form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ACTION_PRESETS.map((preset, i) => (
                <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => logAction(preset)} disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="backdrop-blur-[24px] bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-5 text-left hover:border-[#10B981]/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 group disabled:opacity-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl bg-white/5 p-2 rounded-lg group-hover:scale-110 transition-transform">{preset.icon}</div>
                    <span className="text-xs text-[#10B981] uppercase tracking-wider font-semibold">{preset.category}</span>
                  </div>
                  <div className="text-base font-semibold mb-2 group-hover:text-white transition-colors">{preset.description}</div>
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                    <span className="text-[#10B981] font-bold text-sm bg-[#10B981]/10 px-2 py-1 rounded-md">+{preset.points_earned} pts</span>
                    <span className="text-[#3B82F6] text-xs font-medium">-{preset.co2_saved} kg CO₂</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Action History */}
        <div>
          <h2 className="mb-4" style={{ fontSize: '22px', fontWeight: 600 }}>History</h2>
          {actions.length === 0 ? (
            <div className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-white/40">
              <div className="text-5xl mb-4">🌱</div>
              <p>No actions logged yet. Start by tapping a quick-log card above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actions.map((action, i) => (
                <motion.div key={action._id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className={`backdrop-blur-[24px] border rounded-xl p-4 flex items-center gap-4 transition-all duration-500 ${
                    justLogged === action._id ? 'bg-[#10B981]/10 border-[#10B981]/30' : 'bg-white/5 border-white/10'
                  }`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/60">{action.category}</span>
                      <span className="text-sm font-medium">{action.description}</span>
                    </div>
                    <div className="text-xs text-white/40">{new Date(action.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#10B981] font-bold text-sm">+{action.points_earned} pts</div>
                    <div className="text-[#3B82F6] text-xs">-{action.co2_saved} kg</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
