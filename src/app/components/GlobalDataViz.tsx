import { motion } from "motion/react";
import { useState, useEffect } from "react";
import api from "../api";
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

  const [points, setPoints] = useState([
    { id: 1, lat: 40.7128, lng: -74.0060, label: "New York", value: 2.3, suffix: "M", color: "#10B981" },
    { id: 2, lat: 51.5074, lng: -0.1278, label: "London", value: 1.8, suffix: "M", color: "#3B82F6" },
    { id: 3, lat: 35.6762, lng: 139.6503, label: "Tokyo", value: 4.1, suffix: "M", color: "#10B981" },
    { id: 4, lat: -23.5505, lng: -46.6333, label: "São Paulo", value: 890, suffix: "K", color: "#F59E0B" },
    { id: 5, lat: -1.2921, lng: 36.8219, label: "Nairobi", value: 1.2, suffix: "M", color: "#3B82F6" },
    { id: 6, lat: -33.8688, lng: 151.2093, label: "Sydney", value: 520, suffix: "K", color: "#10B981" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => prev.map(p => {
        const change = p.suffix === "M" ? (Math.random() - 0.5) * 0.05 : (Math.random() - 0.5) * 5;
        let newNum = p.value + change;
        if (newNum < 0) newNum = p.suffix === "M" ? 0.1 : 10;
        return { ...p, value: newNum };
      }));
    }, 2000);
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

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return "#10B981";
    if (aqi <= 100) return "#F59E0B";
    if (aqi <= 150) return "#F97316";
    if (aqi <= 200) return "#EF4444";
    return "#7C3AED";
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
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden z-0">
              <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} className="w-full h-full">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {points.map((point) => (
                  <CircleMarker 
                    key={point.id} 
                    center={[point.lat, point.lng]} 
                    pathOptions={{ color: point.color, fillColor: point.color, fillOpacity: 0.6 }}
                    radius={Math.max(point.value * (point.suffix === 'M' ? 5 : 0.05), 8)}
                  >
                    <Popup className="bg-[#050505] text-white border-white/10 rounded-lg p-2">
                      <div className="text-xs text-black font-semibold">{point.label}</div>
                      <div className="font-bold" style={{ color: point.color }}>
                        {point.suffix === "M" ? point.value.toFixed(2) : Math.round(point.value)}{point.suffix} tons saved
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
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
