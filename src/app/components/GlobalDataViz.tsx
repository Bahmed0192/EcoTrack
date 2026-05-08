import { motion } from "motion/react";
import { useState, useEffect } from "react";
import api from "../api";

interface AirQualityData {
  city: string;
  aqi: number;
  dominantPollutant: string;
}

export function GlobalDataViz() {
  const [searchCity, setSearchCity] = useState("");
  const [cityData, setCityData] = useState<AirQualityData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "#10B981";
    if (aqi <= 100) return "#F59E0B";
    if (aqi <= 150) return "#F97316";
    if (aqi <= 200) return "#EF4444";
    return "#7C3AED";
  };

  const [points, setPoints] = useState([
    { id: 1, x: 15, y: 20, label: "North America (New York)", value: 0, suffix: "", color: "#10B981" },
    { id: 2, x: 45, y: 25, label: "Europe (London)", value: 0, suffix: "", color: "#3B82F6" },
    { id: 3, x: 70, y: 35, label: "Asia (Tokyo)", value: 0, suffix: "", color: "#10B981" },
    { id: 4, x: 20, y: 65, label: "South America (São Paulo)", value: 0, suffix: "", color: "#F59E0B" },
    { id: 5, x: 50, y: 70, label: "Africa (Nairobi)", value: 0, suffix: "", color: "#3B82F6" },
    { id: 6, x: 80, y: 75, label: "Australia (Sydney)", value: 0, suffix: "", color: "#10B981" },
  ]);

  const connections = [
    [1, 2], [2, 3], [1, 4], [2, 5], [4, 5], [3, 6], [5, 6]
  ];

  useEffect(() => {
    const fetchAqi = async () => {
      try {
        const url = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=40.7128,51.5074,35.6762,-23.5505,-1.2921,-33.8688&longitude=-74.0060,-0.1278,139.6503,-46.6333,36.8219,151.2093&current=us_aqi";
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && Array.isArray(data) && data.length >= 6) {
          const getAqi = (index: number) => data[index]?.current?.us_aqi || 50;
          setPoints([
            { id: 1, x: 15, y: 20, label: "North America (New York)", value: getAqi(0), suffix: "", color: getAqiColor(getAqi(0)) },
            { id: 2, x: 45, y: 25, label: "Europe (London)", value: getAqi(1), suffix: "", color: getAqiColor(getAqi(1)) },
            { id: 3, x: 70, y: 35, label: "Asia (Tokyo)", value: getAqi(2), suffix: "", color: getAqiColor(getAqi(2)) },
            { id: 4, x: 20, y: 65, label: "South America (São Paulo)", value: getAqi(3), suffix: "", color: getAqiColor(getAqi(3)) },
            { id: 5, x: 50, y: 70, label: "Africa (Nairobi)", value: getAqi(4), suffix: "", color: getAqiColor(getAqi(4)) },
            { id: 6, x: 80, y: 75, label: "Australia (Sydney)", value: getAqi(5), suffix: "", color: getAqiColor(getAqi(5)) },
          ]);
        }
      } catch (e) {
        console.error("Failed to load global AQI", e);
      }
    };
    fetchAqi();
    const interval = setInterval(fetchAqi, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCity.trim()) return;
    setIsSearching(true);
    setSearchError("");
    setCityData(null);

    try {
      const res = await api.get(`/env/airquality?city=${encodeURIComponent(searchCity)}`);
      setCityData(res.data);
    } catch (err: any) {
      setSearchError(err.response?.data?.msg || "Could not fetch air quality data.");
    } finally {
      setIsSearching(false);
    }
  };


  const getAqiLabel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    return "Hazardous";
  };

  const getAqiEducation = (aqi: number) => {
    if (aqi <= 50) return {
      health: "Air quality is satisfactory. Little or no health risk.",
      advice: "Great day for outdoor activities and exercise!",
      science: "PM2.5 particles are below 12 µg/m³ — well within WHO safety limits."
    };
    if (aqi <= 100) return {
      health: "Acceptable quality but may affect unusually sensitive people.",
      advice: "Consider reducing prolonged outdoor exertion if you have respiratory conditions.",
      science: "PM2.5 levels are 12–35 µg/m³. Ozone may form from vehicle emissions."
    };
    if (aqi <= 150) return {
      health: "Members of sensitive groups (asthma, elderly, children) may experience effects.",
      advice: "Sensitive individuals should limit outdoor exercise. Close windows if possible.",
      science: "PM2.5 levels are 35–55 µg/m³ — common in high-traffic urban areas."
    };
    if (aqi <= 200) return {
      health: "Everyone may begin to experience adverse health effects.",
      advice: "Avoid prolonged outdoor activities. Use N95 masks in heavy pollution.",
      science: "PM2.5 exceeds 55 µg/m³. Industrial emissions and vehicle exhaust are key contributors."
    };
    return {
      health: "Health alert: serious effects for entire population.",
      advice: "Stay indoors. Seal windows and use air purifiers if available.",
      science: "PM2.5 exceeds 150 µg/m³ — common during smog episodes and crop burning seasons."
    };
  };

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
            Global <span className="text-[#3B82F6]">Air Quality</span> Map
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Real-time monitoring of air quality metrics across continents
          </p>
        </motion.div>

        {/* City Search Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
          className="max-w-xl mx-auto mb-10">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search city air quality (e.g. Lahore, London, Tokyo)..."
              className="flex-1 px-5 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#3B82F6] focus:outline-none transition-colors text-sm"
            />
            <button type="submit" disabled={isSearching}
              className="px-6 py-3 rounded-xl bg-[#3B82F6] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm">
              {isSearching ? "..." : "Search"}
            </button>
          </form>
        </motion.div>

        {/* City AQI Result Card */}
        {(cityData || searchError) && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto mb-10">
            {searchError ? (
              <div className="backdrop-blur-[24px] bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 text-sm">
                {searchError}
              </div>
            ) : cityData && (
              <div className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 600 }}>📍 {cityData.city}</h3>
                    <p className="text-white/40 text-xs mt-1">Dominant pollutant: {cityData.dominantPollutant || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <div style={{ fontSize: '36px', fontWeight: 700, color: getAqiColor(cityData.aqi) }}>
                      {cityData.aqi}
                    </div>
                    <div className="text-xs" style={{ color: getAqiColor(cityData.aqi) }}>
                      {getAqiLabel(cityData.aqi)}
                    </div>
                  </div>
                </div>
                {/* AQI scale bar */}
                <div className="h-3 rounded-full overflow-hidden bg-gradient-to-r from-[#10B981] via-[#F59E0B] via-[#F97316] to-[#EF4444] relative">
                  <motion.div initial={{ left: 0 }} animate={{ left: `${Math.min((cityData.aqi / 300) * 100, 100)}%` }}
                    transition={{ duration: 0.8 }}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-white/60 shadow-lg"
                    style={{ marginLeft: '-8px' }} />
                </div>
                <div className="flex justify-between text-[10px] text-white/30 mt-1">
                  <span>Good</span><span>Moderate</span><span>Unhealthy</span><span>Hazardous</span>
                </div>

                {/* 📚 Educational Panel for Students/Educators */}
                {(() => {
                  const edu = getAqiEducation(cityData.aqi);
                  return (
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <div className="text-xs font-semibold text-[#EF4444] mb-1">🫁 Health Impact</div>
                        <p className="text-xs text-white/50 leading-relaxed">{edu.health}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <div className="text-xs font-semibold text-[#10B981] mb-1">💡 What To Do</div>
                        <p className="text-xs text-white/50 leading-relaxed">{edu.advice}</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                        <div className="text-xs font-semibold text-[#3B82F6] mb-1">🔬 The Science</div>
                        <p className="text-xs text-white/50 leading-relaxed">{edu.science}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        )}

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden">
            <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-[#050505] to-[#0a0a0a] rounded-2xl overflow-hidden">
              {/* Grid background */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />

              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map(([fromId, toId], i) => {
                  const from = points.find(p => p.id === fromId)!;
                  const to = points.find(p => p.id === toId)!;
                  return (
                    <g key={`connection-${fromId}-${toId}`}>
                      <motion.line
                        x1={`${from.x}%`}
                        y1={`${from.y}%`}
                        x2={`${to.x}%`}
                        y2={`${to.y}%`}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                      />
                      <motion.line
                        x1={`${from.x}%`}
                        y1={`${from.y}%`}
                        x2={`${to.x}%`}
                        y2={`${to.y}%`}
                        stroke={from.color}
                        strokeWidth="2"
                        strokeDasharray="4 12"
                        initial={{ strokeDashoffset: 100, opacity: 0 }}
                        animate={{ strokeDashoffset: 0, opacity: [0, 0.6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Data points */}
              {points.map((point, index) => (
                <motion.div key={point.id}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="absolute group cursor-pointer"
                  style={{ left: `${point.x}%`, top: `${point.y}%`, transform: 'translate(-50%, -50%)' }}>

                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                    className="absolute w-16 h-16 rounded-full blur-xl"
                    style={{ backgroundColor: point.color, transform: 'translate(-50%, -50%)' }} />

                  <div className="relative w-4 h-4 rounded-full border-2"
                    style={{ backgroundColor: point.color, borderColor: point.color, boxShadow: `0 0 20px ${point.color}` }} />

                  <motion.div initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="absolute top-6 left-1/2 -translate-x-1/2 backdrop-blur-[24px] bg-white/10 border border-white/20 rounded-lg px-3 py-2 whitespace-nowrap">
                    <div className="text-xs text-white/60">{point.label}</div>
                    <div className="font-semibold transition-all duration-300" style={{ color: point.color }}>
                      {Math.round(point.value)}
                    </div>
                    <div className="text-xs text-white/40">Live AQI</div>
                  </motion.div>
                </motion.div>
              ))}

              {/* Floating particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div key={`particle-${i}`}
                  animate={{ y: [0, -30, 0], x: [0, Math.random() * 20 - 10, 0], opacity: [0, 0.6, 0] }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                  className="absolute w-1 h-1 bg-[#10B981] rounded-full"
                  style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
              ))}
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { value: "11.5M", label: "Total CO₂ Saved", color: "#10B981" },
                { value: "2.3K",  label: "Active Cities",   color: "#3B82F6" },
                { value: "89%",   label: "Avg Air Quality", color: "#10B981" },
                { value: "156",   label: "Countries",       color: "#F59E0B" },
              ].map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }} viewport={{ once: true }}
                  className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-xl p-4">
                  <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
