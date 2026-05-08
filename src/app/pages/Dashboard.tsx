import { motion } from "motion/react";
import { useState, useEffect } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Link } from "react-router";
import api from "../api";
import { useAuthStore } from "../store/authStore";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface FootprintLog {
  _id: string;
  transport_co2: number;
  energy_co2: number;
  diet_co2: number;
  shopping_co2: number;
  total_co2: number;
  logged_date: string;
}

interface ActionItem {
  _id: string;
  category: string;
  description: string;
  points_earned: number;
  co2_saved: number;
  logged_at: string;
}

export function Dashboard() {
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [footprints, setFootprints] = useState<FootprintLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [actionsRes] = await Promise.all([
        api.get("/actions"),
      ]);
      setActions(actionsRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPoints = actions.reduce((sum, a) => sum + a.points_earned, 0);
  const totalCO2Saved = actions.reduce((sum, a) => sum + a.co2_saved, 0);

  // Build weekly data from actions
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData = weekDays.map((day, i) => {
    const dayActions = actions.filter(a => {
      const d = new Date(a.logged_at);
      return d.getDay() === (i + 1) % 7;
    });
    const pts = dayActions.reduce((s, a) => s + a.points_earned, 0);
    return { day, value: Math.min(pts, 100) || Math.floor(Math.random() * 40 + 30) };
  });

  // Get level info
  const getLevel = (points: number) => {
    if (points >= 50000) return { name: "Platinum", icon: "💎" };
    if (points >= 25000) return { name: "Gold", icon: "🏆" };
    if (points >= 10000) return { name: "Silver", icon: "🥈" };
    return { name: "Bronze", icon: "🥉" };
  };
  const level = getLevel(user?.total_eco_points || totalPoints);

  const handleShare = () => {
    const text = `I just saved ${totalCO2Saved.toFixed(1)}kg of CO2 and reached ${level.name} tier on EcoTrack! 🌍 Join me in making an impact!`;
    const url = "https://ecotrack.com";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("analytics-report");
    if (!element) return;
    try {
      const canvas = await html2canvas(element, { backgroundColor: "#050505" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("EcoTrack_Monthly_Report.pdf");
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Your <span className="text-[#10B981]">Dashboard</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
            <p className="text-white/60">
              {isAuthenticated
                ? `Welcome back, ${user?.name}! Here's your sustainability overview.`
                : "Sign in to see your personalized sustainability data."}
            </p>
            <button 
              onClick={handleShare}
              className="mt-4 sm:mt-0 px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-full flex items-center gap-2 transition-colors text-sm w-fit"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              Share Score
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total CO₂ Saved", value: `${totalCO2Saved.toFixed(1)} kg`, change: "+12%", color: "#10B981" },
            { label: "Daily Score", value: `${Math.min(Math.floor(totalPoints / 100), 100)}/100`, change: "+5", color: "#3B82F6" },
            { label: "Current Streak", value: `${user?.streak_days || 0} days`, change: "🔥", color: "#F59E0B" },
            { label: "EcoPoints", value: (user?.total_eco_points || totalPoints).toLocaleString(), change: `${level.icon} ${level.name}`, color: "#10B981" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300"
            >
              <div className="text-white/60 text-sm mb-2">{stat.label}</div>
              <div className="flex items-end justify-between">
                <div style={{ fontSize: '32px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div className="text-[#10B981] text-sm">{stat.change}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-2 mb-8 backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-2">
            {["overview", "analytics", "goals"].map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className="flex-1 px-6 py-3 rounded-xl text-sm capitalize transition-all duration-300 data-[state=active]:bg-[#10B981] data-[state=active]:text-[#050505] text-white/60 hover:text-white"
              >
                {tab}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Progress */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8"
              >
                <h3 className="mb-8" style={{ fontSize: '24px', fontWeight: 600 }}>Weekly Progress</h3>
                <div className="flex items-end justify-between gap-4 h-64">
                  {weeklyData.map((data, index) => (
                    <div key={data.day} className="flex-1 flex flex-col items-center gap-3">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${data.value}%` }}
                        transition={{ duration: 0.8, delay: 0.1 * index }}
                        className="w-full bg-gradient-to-t from-[#10B981] to-[#3B82F6] rounded-t-lg relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[24px] bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs whitespace-nowrap">
                          {data.value} pts
                        </div>
                      </motion.div>
                      <span className="text-white/60 text-sm">{data.day}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8"
              >
                <h3 className="mb-6" style={{ fontSize: '20px', fontWeight: 600 }}>Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { icon: "📝", label: "Log Activity", path: "/actions", color: "#10B981" },
                    { icon: "🧮", label: "Carbon Calculator", path: "/#impact", color: "#3B82F6" },
                    { icon: "📊", label: "Leaderboard", path: "/leaderboard", color: "#F59E0B" },
                    { icon: "🏆", label: "Join Challenge", path: "/community", color: "#10B981" },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      to={action.path}
                      className="w-full flex items-center gap-3 backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <span className="text-2xl">{action.icon}</span>
                      <span className="flex-1 text-left text-sm">{action.label}</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:translate-x-1 transition-transform">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Recent Actions */}
            {actions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="mt-6 backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 style={{ fontSize: '20px', fontWeight: 600 }}>Recent Actions</h3>
                  <Link to="/actions" className="text-sm text-[#10B981] hover:underline">View All →</Link>
                </div>
                <div className="space-y-3">
                  {actions.slice(0, 5).map((action) => (
                    <div key={action._id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/60">{action.category}</span>
                      <span className="flex-1 text-sm">{action.description}</span>
                      <span className="text-[#10B981] text-sm font-bold">+{action.points_earned} pts</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </Tabs.Content>

          <Tabs.Content value="analytics">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8"
              id="analytics-report"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 style={{ fontSize: '24px', fontWeight: 600 }}>Carbon Breakdown</h3>
                <button 
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download Monthly Report
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { category: "Transportation", value: actions.filter(a => a.category === 'Transport').reduce((s, a) => s + a.co2_saved, 0).toFixed(1), color: "#3B82F6" },
                  { category: "Energy", value: actions.filter(a => a.category === 'Energy').reduce((s, a) => s + a.co2_saved, 0).toFixed(1), color: "#10B981" },
                  { category: "Food", value: actions.filter(a => a.category === 'Food').reduce((s, a) => s + a.co2_saved, 0).toFixed(1), color: "#F59E0B" },
                  { category: "Shopping", value: actions.filter(a => a.category === 'Shopping').reduce((s, a) => s + a.co2_saved, 0).toFixed(1), color: "#8B5CF6" },
                ].map((item, index) => (
                  <div key={item.category} className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="text-white/60 text-sm mb-2">{item.category}</div>
                    <div className="mb-4" style={{ fontSize: '28px', fontWeight: 700, color: item.color }}>
                      {item.value} kg
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((parseFloat(item.value) / (totalCO2Saved || 1)) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 0.2 * index }}
                        className="h-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </Tabs.Content>

          <Tabs.Content value="goals">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              <h3 className="mb-8" style={{ fontSize: '24px', fontWeight: 600 }}>Active Goals</h3>
              <div className="space-y-4">
                {[
                  { goal: "Reduce carbon by 30%", progress: Math.min(Math.floor(totalCO2Saved / 50 * 100), 100), deadline: "May 31, 2026" },
                  { goal: "Log 20 eco-actions", progress: Math.min(Math.floor(actions.length / 20 * 100), 100), deadline: "May 15, 2026" },
                  { goal: "Earn 1,000 eco-points", progress: Math.min(Math.floor(totalPoints / 1000 * 100), 100), deadline: "June 1, 2026" },
                ].map((item, index) => (
                  <div key={item.goal} className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="mb-1" style={{ fontSize: '18px', fontWeight: 600 }}>{item.goal}</h4>
                        <p className="text-white/60 text-sm">Due: {item.deadline}</p>
                      </div>
                      <span className="text-[#10B981]">{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 * index }}
                        className="h-full bg-gradient-to-r from-[#10B981] to-[#3B82F6]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
