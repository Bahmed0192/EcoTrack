import { motion } from "motion/react";
import { useState, useEffect } from "react";
import api from "../api";

interface LeaderboardUser {
  _id: string;
  name: string;
  total_eco_points: number;
  streak_days: number;
  city?: string;
}

export function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [period, setPeriod] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/leaderboard?period=${period}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getBadge = (rank: number) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `#${rank + 1}`;
  };

  const getLevel = (points: number) => {
    if (points >= 50000) return { name: "Platinum", color: "#E5E7EB", icon: "💎" };
    if (points >= 25000) return { name: "Gold", color: "#F59E0B", icon: "🏆" };
    if (points >= 10000) return { name: "Silver", color: "#9CA3AF", icon: "🥈" };
    return { name: "Bronze", color: "#CD7F32", icon: "🥉" };
  };

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            🏆 <span className="text-[#10B981]">Leaderboard</span>
          </h1>
          <p className="text-white/60 mt-4">Community ranking by eco-points. Rise through the ranks!</p>
        </motion.div>

        {/* Time Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="flex justify-center gap-2 mb-10">
          {[
            { key: "week", label: "This Week" },
            { key: "month", label: "This Month" },
            { key: "all", label: "All Time" },
          ].map((f) => (
            <button key={f.key} onClick={() => setPeriod(f.key)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                period === f.key
                  ? "bg-[#10B981] text-[#050505]"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
              }`}>
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Leaderboard Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/20 border-t-[#10B981] rounded-full" />
          </div>
        ) : users.length === 0 ? (
          <div className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-16 text-center text-white/40">
            <div className="text-5xl mb-4">🌍</div>
            <p>No users found for this period. Be the first to earn eco-points!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user, index) => {
              const level = getLevel(user.total_eco_points);
              return (
                <motion.div key={user._id}
                  initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                  className={`backdrop-blur-[24px] border rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:bg-white/[0.07] ${
                    index < 3 ? 'bg-white/[0.06] border-[#10B981]/20' : 'bg-white/5 border-white/10'
                  }`}>
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                    index < 3 ? 'text-2xl' : 'text-lg text-white/60 bg-white/5'
                  }`}>
                    {getBadge(index)}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{user.name}</div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      {user.city && <span>📍 {user.city}</span>}
                      <span>🔥 {user.streak_days} day streak</span>
                    </div>
                  </div>

                  {/* Level Badge */}
                  <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs" style={{ color: level.color }}>
                    {level.icon} {level.name}
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <div className="text-[#10B981] font-bold" style={{ fontSize: '20px' }}>
                      {user.total_eco_points.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/40">eco-pts</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
