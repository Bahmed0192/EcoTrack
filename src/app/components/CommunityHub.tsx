import { motion } from "motion/react";
import { useState, useEffect } from "react";
import api from "../api";
import { useAuthStore } from "../store/authStore";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  participant_count: number;
  target_metric: string;
  end_date: string;
  creator_id?: { name: string };
}

// Fallback challenges shown when backend has no data yet
const SEED_CHALLENGES = [
  { _id: "seed1", title: "Zero Waste Week", description: "Eliminate single-use plastics for 7 consecutive days", participant_count: 12450, target_metric: "500 EcoPoints", end_date: "2026-06-01", icon: "♻️", difficulty: "Medium", color: "#10B981", progress: 65 },
  { _id: "seed2", title: "Public Transit Champion", description: "Use public transport for all trips this month", participant_count: 8920, target_metric: "750 EcoPoints", end_date: "2026-06-15", icon: "🚇", difficulty: "Hard", color: "#3B82F6", progress: 42 },
  { _id: "seed3", title: "Plant-Based Power", description: "Try a plant-based diet for 3 days", participant_count: 15680, target_metric: "300 EcoPoints", end_date: "2026-05-20", icon: "🌱", difficulty: "Easy", color: "#10B981", progress: 88 },
  { _id: "seed4", title: "Energy Saver", description: "Reduce home energy consumption by 20%", participant_count: 6340, target_metric: "600 EcoPoints", end_date: "2026-06-30", icon: "⚡", difficulty: "Medium", color: "#F59E0B", progress: 35 },
];

const ICONS = ["♻️", "🚇", "🌱", "⚡", "🌍", "💧"];
const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"];

interface LeaderboardUser {
  _id: string;
  name: string;
  total_eco_points: number;
}

export function CommunityHub() {
  const { isAuthenticated } = useAuthStore();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<any[]>(SEED_CHALLENGES);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    target_metric: "",
    end_date: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Team leaderboard state
  const [topTeams, setTopTeams] = useState<any[]>([]);
  const [leaderboardTab, setLeaderboardTab] = useState<'individual' | 'teams'>('individual');

  useEffect(() => {
    fetchChallenges();
    fetchTopUsers();
    fetchTopTeams();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await api.get("/challenges");
      if (res.data.length > 0) {
        const mapped = res.data.map((c: Challenge, i: number) => ({
          ...c,
          icon: ICONS[i % ICONS.length],
          color: COLORS[i % COLORS.length],
          difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
          progress: Math.floor(Math.random() * 60 + 20),
        }));
        setChallenges(mapped);
      }
    } catch (err) {
      // Keep seed data on error
    }
  };

  const fetchTopUsers = async () => {
    try {
      const res = await api.get("/leaderboard?period=all");
      setTopUsers(res.data.slice(0, 3));
    } catch (err) {
      // Fallback handled in render
    }
  };

  const fetchTopTeams = async () => {
    try {
      const res = await api.get("/leaderboard/teams");
      setTopTeams(res.data);
    } catch (err) {
      // Fallback handled in render
    }
  };

  const handleJoinLeave = async (challengeId: string) => {
    if (!isAuthenticated) { alert("Please sign in to join challenges!"); return; }
    
    const isJoined = joinedIds.has(challengeId);
    try {
      if (isJoined) {
        await api.put(`/challenges/${challengeId}/leave`);
        setJoinedIds(prev => { const n = new Set(prev); n.delete(challengeId); return n; });
        setChallenges(prev => prev.map(c => c._id === challengeId ? { ...c, participant_count: c.participant_count - 1 } : c));
      } else {
        await api.put(`/challenges/${challengeId}/join`);
        setJoinedIds(prev => new Set(prev).add(challengeId));
        setChallenges(prev => prev.map(c => c._id === challengeId ? { ...c, participant_count: c.participant_count + 1 } : c));
      }
    } catch (err: any) {
      const msg = err.response?.data?.msg;
      if (msg === 'Already joined this challenge') {
        setJoinedIds(prev => new Set(prev).add(challengeId));
      }
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { alert("Please sign in to create challenges!"); return; }
    if (!newChallenge.title || !newChallenge.description || !newChallenge.target_metric || !newChallenge.end_date) {
      setError("Please fill out all fields.");
      return;
    }
    
    setIsCreating(true);
    setError("");
    setSuccess("");
    try {
      await api.post('/challenges', newChallenge);
      setSuccess("Challenge created successfully!");
      setShowCreateModal(false);
      setNewChallenge({ title: "", description: "", target_metric: "", end_date: "" });
      fetchChallenges();
    } catch (err: any) {
      setError(err.response?.data?.msg || "Failed to create challenge. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const fallbackUsers = [
    { _id: "1", name: "EcoWarrior2026", total_eco_points: 45230 },
    { _id: "2", name: "GreenThumb_Pro", total_eco_points: 42180 },
    { _id: "3", name: "Planet_Saver", total_eco_points: 39450 },
  ];
  const leaderboard = topUsers.length > 0 ? topUsers : fallbackUsers;
  const badges = ["🥇", "🥈", "🥉"];

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
            Join the <span className="text-[#10B981]">Community</span>
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto mb-8">
            Take on challenges, earn rewards, and compete with eco-warriors worldwide
          </p>
          
          {(useAuthStore.getState().user?.role === 'organizer' || useAuthStore.getState().user?.role === 'admin') && (
            <button
              onClick={() => {
                if(!isAuthenticated) {
                  alert("Please sign in to create challenges!");
                  return;
                }
                setShowCreateModal(true);
              }}
              className="px-8 py-4 rounded-xl font-semibold bg-[#10B981] text-[#050505] hover:bg-[#0EA5E9] transition-colors duration-300"
            >
              + Create New Challenge
            </button>
          )}
        </motion.div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1000">
          {challenges.map((challenge, index) => {
            const isJoined = joinedIds.has(challenge._id);
            return (
              <motion.div
                key={challenge._id}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredCard(challenge._id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Layered shadow cards */}
                <div className="absolute inset-0 backdrop-blur-[24px] bg-white/3 border border-white/5 rounded-3xl transition-all duration-300"
                  style={{ transform: 'translateZ(-20px) translateY(10px) scale(0.95)', opacity: hoveredCard === challenge._id ? 0.5 : 0.3 }} />
                <div className="absolute inset-0 backdrop-blur-[24px] bg-white/4 border border-white/8 rounded-3xl transition-all duration-300"
                  style={{ transform: 'translateZ(-10px) translateY(5px) scale(0.97)', opacity: hoveredCard === challenge._id ? 0.7 : 0.5 }} />

                {/* Main card */}
                <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }}
                  className="relative backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden"
                  style={{ transformStyle: 'preserve-3d', zIndex: 10 }}>

                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[100px] transition-opacity duration-300"
                    style={{ backgroundColor: challenge.color, opacity: hoveredCard === challenge._id ? 0.2 : 0.1 }} />

                  <div className="flex items-start justify-between mb-4">
                    <div className="backdrop-blur-[24px] bg-white/10 border border-white/20 rounded-full px-4 py-1 text-xs"
                      style={{ color: challenge.difficulty === "Easy" ? "#10B981" : challenge.difficulty === "Medium" ? "#F59E0B" : "#EF4444" }}>
                      {challenge.difficulty}
                    </div>
                    <div className="text-4xl">{challenge.icon}</div>
                  </div>

                  <h3 className="mb-2" style={{ fontSize: '24px', fontWeight: 600 }}>{challenge.title}</h3>
                  <p className="text-white/60 text-sm mb-6">{challenge.description}</p>

                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-white/60">Challenge Progress</span>
                      <span className="text-xs" style={{ color: challenge.color }}>{challenge.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${challenge.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }} viewport={{ once: true }}
                        className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${challenge.color}, ${challenge.color}cc)` }} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-white/60 text-xs mb-1">Participants</div>
                      <div className="font-semibold">{challenge.participant_count.toLocaleString()}</div>
                    </div>
                    <div className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-xl p-3">
                      <div className="text-white/60 text-xs mb-1">Reward</div>
                      <div className="font-semibold" style={{ color: challenge.color }}>{challenge.target_metric}</div>
                    </div>
                  </div>

                  {/* Join / Leave button */}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handleJoinLeave(challenge._id)}
                    className={`relative w-full py-3 rounded-xl overflow-hidden border transition-all duration-300 font-semibold ${
                      isJoined
                        ? 'bg-white/10 border-red-500/30 text-red-400 hover:bg-red-500/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}>
                    {!isJoined && (
                      <motion.div initial={{ y: '100%' }} whileHover={{ y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0" style={{ backgroundColor: challenge.color }} />
                    )}
                    <span className={`relative z-10 transition-colors duration-300 ${!isJoined ? 'group-hover/btn:text-[#050505]' : ''}`}>
                      {isJoined ? "Leave Challenge" : "Join Challenge"}
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Leaderboard with tabs */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }} viewport={{ once: true }}
          className="mt-16 backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: 600 }}>Top Contributors</h3>
              <p className="text-white/60 text-sm mt-1">Leading the sustainability movement</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>

          {/* Tab buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLeaderboardTab('individual')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                leaderboardTab === 'individual'
                  ? 'bg-[#10B981] text-[#050505]'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              👤 Individual
            </button>
            <button
              onClick={() => setLeaderboardTab('teams')}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                leaderboardTab === 'teams'
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              🏢 Teams
            </button>
          </div>

          {leaderboardTab === 'individual' ? (
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <motion.div key={user._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }} viewport={{ once: true }}
                  className="flex items-center gap-4 backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <span className="text-2xl">{badges[index] || `#${index + 1}`}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs text-white/60">Rank #{index + 1}</div>
                  </div>
                  <div className="text-[#10B981] font-semibold">{user.total_eco_points.toLocaleString()} pts</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {topTeams.length > 0 ? topTeams.map((team, index) => (
                <motion.div key={team._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }} viewport={{ once: true }}
                  className="flex items-center gap-4 backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <span className="text-2xl">{badges[index] || `#${index + 1}`}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{team._id}</div>
                    <div className="text-xs text-white/60">{team.member_count} member{team.member_count !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-[#3B82F6] font-semibold">{team.total_points.toLocaleString()} pts</div>
                </motion.div>
              )) : (
                <div className="text-center py-8 text-white/40">
                  <div className="text-4xl mb-3">🏢</div>
                  <p>No teams yet. Join or create one during sign-up!</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-8"
          >
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-6">Create Challenge</h3>
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-4">{error}</div>}
            
            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Title</label>
                <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981]"
                  value={newChallenge.title} onChange={e => setNewChallenge({...newChallenge, title: e.target.value})} placeholder="e.g. Zero Waste Week" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Description</label>
                <textarea required rows={3} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981]"
                  value={newChallenge.description} onChange={e => setNewChallenge({...newChallenge, description: e.target.value})} placeholder="What's the goal?" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Target Reward/Metric</label>
                <input required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981]"
                  value={newChallenge.target_metric} onChange={e => setNewChallenge({...newChallenge, target_metric: e.target.value})} placeholder="e.g. 500 EcoPoints" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">End Date</label>
                <input required type="date" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981] [color-scheme:dark]"
                  value={newChallenge.end_date} onChange={e => setNewChallenge({...newChallenge, end_date: e.target.value})} />
              </div>
              
              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full py-4 mt-6 rounded-xl font-semibold bg-[#10B981] text-[#050505] hover:bg-[#0EA5E9] transition-colors disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Launch Challenge"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
}
