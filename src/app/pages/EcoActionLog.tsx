import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import api from "../api";
import { useAuthStore } from "../store/authStore";
import confetti from "canvas-confetti";
import { toast } from "sonner";

const ACTION_PRESETS = [
  { category: "Transport", description: "Biked to work",            co2_saved: 2.4, points_earned: 25, icon: "🚲" },
  { category: "Transport", description: "Used public transit",      co2_saved: 1.8, points_earned: 20, icon: "🚌" },
  { category: "Energy",    description: "Turned off unused lights", co2_saved: 0.5, points_earned: 10, icon: "💡" },
  { category: "Energy",    description: "Air-dried laundry",        co2_saved: 1.2, points_earned: 15, icon: "☀️" },
  { category: "Food",      description: "Had a plant-based meal",   co2_saved: 1.5, points_earned: 15, icon: "🥗" },
  { category: "Food",      description: "Composted food waste",     co2_saved: 0.8, points_earned: 10, icon: "🌿" },
  { category: "Shopping",  description: "Used reusable bags",       co2_saved: 0.3, points_earned: 5,  icon: "🛍️" },
  { category: "Shopping",  description: "Bought second-hand",       co2_saved: 2.0, points_earned: 20, icon: "♻️" },
];

const CATEGORY_EXAMPLES: Record<string, string> = {
  Transport: "e.g. Walked 2km to the grocery store, Took the bus instead of driving",
  Energy:    "e.g. Installed LED bulbs at home, Kept AC at 26°C instead of 20°C",
  Food:      "e.g. Cooked a vegetarian dinner for the family, Avoided food waste today",
  Shopping:  "e.g. Bought a second-hand jacket, Used my reusable water bottle all day",
  Other:     "e.g. Planted a tree, Joined a local cleanup drive",
};

interface EcoActionItem {
  _id: string;
  category: string;
  description: string;
  co2_saved: number;
  points_earned: number;
  logged_at: string;
}

interface AIPreview {
  category: string;
  co2_saved: number;
  points_earned: number;
  tip: string;
}

export function EcoActionLog() {
  const { isAuthenticated } = useAuthStore();
  const [actions, setActions] = useState<EcoActionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [justLogged, setJustLogged] = useState<string | null>(null);
  const [customMode, setCustomMode] = useState(false);

  // Custom action state
  const [customText, setCustomText] = useState("");
  const [customCategory, setCustomCategory] = useState("Transport");
  const [aiPreview, setAiPreview] = useState<AIPreview | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

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

  const hasLoggedToday = (description: string) => {
    const today = new Date().toDateString();
    return actions.some(
      (a) => a.description === description && new Date(a.logged_at).toDateString() === today
    );
  };

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ["#10B981", "#3B82F6", "#F59E0B"] });
  };

  const handleStreakUpdate = (updatedUser: any) => {
    if (updatedUser) {
      useAuthStore.getState().updateUser({
        total_eco_points: updatedUser.total_eco_points,
        streak_days: updatedUser.streak_days,
      });
    }
  };

  // ── Preset quick-log ───────────────────────────────────────
  const logAction = async (preset: typeof ACTION_PRESETS[0]) => {
    if (!isAuthenticated) { toast.error("Please sign in first!"); return; }
    setIsLoading(true);
    try {
      const res = await api.post("/actions", {
        category: preset.category,
        description: preset.description,
        co2_saved: preset.co2_saved,
        points_earned: preset.points_earned,
        isCustom: false,
      });
      const { action, user: updatedUser } = res.data;
      setActions([action, ...actions]);
      setJustLogged(action._id);
      handleStreakUpdate(updatedUser);
      fireConfetti();
      toast.success(`+${action.points_earned} pts! Saved ${action.co2_saved} kg CO₂ 🌱 Streak: ${updatedUser?.streak_days || 0} days 🔥`);
      setTimeout(() => setJustLogged(null), 2000);
    } catch (err) {
      console.error("Failed to log action:", err);
      toast.error("Failed to log action.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── AI Preview step ────────────────────────────────────────
  const handleAICalculate = async () => {
    if (!customText.trim() || customText.trim().length < 5) {
      toast.error("Please describe your action in a bit more detail.");
      return;
    }
    if (!isAuthenticated) { toast.error("Please sign in first!"); return; }
    setIsCalculating(true);
    setAiPreview(null);
    try {
      const res = await api.post("/actions/calculate", { description: customText.trim() });
      setAiPreview(res.data);
    } catch (err) {
      toast.error("AI calculation failed. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  // ── Confirm & log the AI-calculated action ─────────────────
  const handleConfirmLog = async () => {
    if (!aiPreview || !isAuthenticated) return;
    setIsLoading(true);
    try {
      const res = await api.post("/actions", {
        description: customText.trim(),
        isCustom: true,
      });
      const { action, user: updatedUser } = res.data;
      setActions([action, ...actions]);
      setJustLogged(action._id);
      handleStreakUpdate(updatedUser);
      fireConfetti();
      toast.success(`+${action.points_earned} pts! Saved ${action.co2_saved} kg CO₂ 🌍`);
      // Reset
      setCustomText("");
      setAiPreview(null);
      setCustomMode(false);
      setTimeout(() => setJustLogged(null), 2000);
    } catch (err) {
      console.error("Failed to log custom action:", err);
      toast.error("Failed to log action.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPoints = actions.reduce((sum, a) => sum + a.points_earned, 0);
  const totalCO2 = actions.reduce((sum, a) => sum + a.co2_saved, 0);

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <h1 style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 700, letterSpacing: "-0.02em" }}>
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
                <div style={{ fontSize: "28px", fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick-Log Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: "22px", fontWeight: 600 }}>Quick Log</h2>
            <button
              onClick={() => { setCustomMode(!customMode); setAiPreview(null); setCustomText(""); }}
              className="text-sm text-[#10B981] hover:underline"
            >
              {customMode ? "← Back to presets" : "+ Custom Action (AI-powered)"}
            </button>
          </div>

          {customMode ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">

              {/* Category selector */}
              <div>
                <label className="block text-xs text-white/60 mb-1 ml-1">Category</label>
                <select
                  value={customCategory}
                  onChange={e => { setCustomCategory(e.target.value); setAiPreview(null); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#10B981]"
                >
                  {Object.keys(CATEGORY_EXAMPLES).map(c => (
                    <option key={c} value={c} className="bg-gray-900">{c}</option>
                  ))}
                </select>
              </div>

              {/* Action description */}
              <div>
                <label className="block text-xs text-white/60 mb-1 ml-1">Describe your eco action</label>
                <textarea
                  value={customText}
                  onChange={e => { setCustomText(e.target.value); setAiPreview(null); }}
                  placeholder={CATEGORY_EXAMPLES[customCategory]}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-[#10B981] resize-none"
                />
                <p className="text-xs text-white/40 mt-1 ml-1">
                  🤖 Our AI will calculate CO₂ saved and points based on your description.
                </p>
              </div>

              {/* AI Preview Result */}
              <AnimatePresence>
                {aiPreview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gradient-to-br from-[#10B981]/10 to-[#3B82F6]/10 border border-[#10B981]/30 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-[#10B981]">🤖 AI Estimate</span>
                      <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{aiPreview.category}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-[#10B981]">+{aiPreview.points_earned}</div>
                        <div className="text-xs text-white/60 mt-1">Points to Earn</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-[#3B82F6]">{aiPreview.co2_saved} kg</div>
                        <div className="text-xs text-white/60 mt-1">CO₂ Saved</div>
                      </div>
                    </div>
                    <p className="text-sm text-white/70 italic">💬 {aiPreview.tip}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons */}
              <div className="flex gap-3">
                {!aiPreview ? (
                  <button
                    onClick={handleAICalculate}
                    disabled={isCalculating || customText.trim().length < 5}
                    className="flex-1 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all disabled:opacity-40"
                  >
                    {isCalculating ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        AI is calculating…
                      </span>
                    ) : "🤖 Calculate with AI"}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setAiPreview(null); }}
                      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all"
                    >
                      ← Recalculate
                    </button>
                    <button
                      onClick={handleConfirmLog}
                      disabled={isLoading}
                      className="flex-1 py-3 rounded-xl bg-[#10B981] text-[#050505] font-semibold hover:scale-[1.01] transition-transform disabled:opacity-50"
                    >
                      {isLoading ? "Logging…" : `Confirm & Log Action 🌿 (+${aiPreview.points_earned} pts)`}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ACTION_PRESETS.map((preset, i) => {
                const alreadyLogged = hasLoggedToday(preset.description);
                return (
                  <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => logAction(preset)} disabled={isLoading || alreadyLogged}
                    whileHover={alreadyLogged ? {} : { scale: 1.02 }}
                    whileTap={alreadyLogged ? {} : { scale: 0.98 }}
                    className={`backdrop-blur-[24px] bg-gradient-to-br border rounded-xl p-5 text-left transition-all duration-300 group ${
                      alreadyLogged
                        ? "from-[#10B981]/10 to-[#10B981]/5 border-[#10B981]/30 opacity-70 cursor-not-allowed"
                        : "from-white/5 to-white/[0.02] border-white/10 hover:border-[#10B981]/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] disabled:opacity-50"
                    }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl bg-white/5 p-2 rounded-lg group-hover:scale-110 transition-transform">{preset.icon}</div>
                      <span className="text-xs text-[#10B981] uppercase tracking-wider font-semibold">
                        {preset.category} {alreadyLogged && "✓ Done Today"}
                      </span>
                    </div>
                    <div className={`text-base font-semibold mb-2 transition-colors ${alreadyLogged ? "text-white/60" : "group-hover:text-white"}`}>
                      {preset.description}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                      <span className="text-[#10B981] font-bold text-sm bg-[#10B981]/10 px-2 py-1 rounded-md">+{preset.points_earned} pts</span>
                      <span className="text-[#3B82F6] text-xs font-medium">-{preset.co2_saved} kg CO₂</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Action History */}
        <div>
          <h2 className="mb-4" style={{ fontSize: "22px", fontWeight: 600 }}>History</h2>
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
                    justLogged === action._id ? "bg-[#10B981]/10 border-[#10B981]/30" : "bg-white/5 border-white/10"
                  }`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/60">{action.category}</span>
                      <span className="text-sm font-medium">{action.description}</span>
                    </div>
                    <div className="text-xs text-white/40">
                      {new Date(action.logged_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
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
