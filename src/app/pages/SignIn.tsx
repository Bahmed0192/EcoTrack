import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import api from "../api";
import { useAuthStore } from "../store/authStore";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center">
              <span className="text-xl">🌍</span>
            </div>
            <span style={{ fontSize: '28px', fontWeight: 700 }}>EcoTrack</span>
          </Link>

          <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Welcome Back
          </h1>
          <p className="text-white/60 mt-4">Sign in to continue your sustainability journey</p>
        </div>

        <div className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-white/80 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#10B981] focus:outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm text-white/80">
                  Password
                </label>
                <a href="#" className="text-sm text-[#10B981] hover:text-[#0ea672] transition-colors">
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#10B981] focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#10B981] text-[#050505] font-semibold hover:scale-[1.02] transition-transform duration-300 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-[#050505]/30 border-t-[#050505] rounded-full"
                  />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#050505] text-white/60">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18 10.2C18 9.53 17.94 8.88 17.84 8.25H10V11.95H14.54C14.36 12.95 13.81 13.82 12.99 14.4V16.6H15.59C17.08 15.23 18 13.38 18 10.2Z" fill="#4285F4"/>
                <path d="M10 18.8C12.7 18.8 14.96 17.92 15.59 16.6H12.99C12.28 17.08 11.39 17.4 10 17.4C7.39 17.4 5.19 15.99 4.39 13.95H1.69V16.22C2.94 18.7 6.24 20.4 10 20.4V18.8Z" fill="#34A853"/>
                <path d="M4.39 13.95C4.24 13.47 4.15 12.96 4.15 12.44C4.15 11.92 4.24 11.41 4.39 10.93V8.66H1.69C1.16 9.71 0.85 10.9 0.85 12.14C0.85 13.38 1.16 14.57 1.69 15.62L4.39 13.95Z" fill="#FBBC05"/>
                <path d="M10 7.48C11.51 7.48 12.87 8.01 13.94 9.02L16.23 6.73C14.95 5.54 13.19 4.8 10 4.8C6.24 4.8 2.94 6.5 1.69 8.98L4.39 11.25C5.19 9.21 7.39 7.8 10 7.8V7.48Z" fill="#EA4335"/>
              </svg>
              <span className="text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"/>
              </svg>
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          <p className="text-center text-white/60 text-sm mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#10B981] hover:text-[#0ea672] transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
