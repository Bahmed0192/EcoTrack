import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuthStore } from "../store/authStore";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/actions", label: "Eco-Actions" },
    { path: "/community", label: "Community" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/features", label: "Features" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-[24px] bg-[#050505]/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center">
            <span className="text-lg">🌍</span>
          </div>
          <span style={{ fontSize: '24px', fontWeight: 700 }}>EcoTrack</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative text-white/60 hover:text-[#10B981] transition-colors duration-300"
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#10B981]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center text-xs">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white/80 hidden sm:inline">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white/60 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 rounded-full bg-[#10B981] text-[#050505] text-sm hover:scale-105 transition-transform duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
