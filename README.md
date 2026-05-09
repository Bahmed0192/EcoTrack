# 🌍 EcoTrack - Sustainability Platform

EcoTrack is a full-stack sustainability and green tech platform designed to help individuals, educators, and community organizers measure, track, and reduce their environmental impact. 

By combining real-time carbon footprint calculations with gamification and AI-powered recommendations, EcoTrack turns eco-conscious goals into motivating, actionable habits.

## ✨ Features

- **🧮 Interactive Carbon Footprint Calculator:** Calculate your CO2 emissions across Transport, Energy, Diet, and Shopping.
- **🌍 3D Interactive Earth Animation:** A lightweight, custom Three.js shader-based Earth animation on the landing page for a premium feel.
- **🏆 Gamification & Progression:** Earn EcoPoints, build daily streaks, and level up from Bronze to Platinum by logging green actions.
- **🤖 AI Sustainability Advisor:** Receive highly specific, actionable, and personalized tips powered by OpenAI based on your highest emission categories.
- **🧠 AI-Powered Eco-Action Logging:** Log custom sustainable actions in plain text. The AI securely calculates the estimated CO2 saved and awards points accordingly, complete with personalized encouragement.
- **📊 Global Data Viz (Live AQI):** Search for any city worldwide to view real-time Air Quality Index (AQI) data and health advisories powered by Open-Meteo.
- **📄 Downloadable PDF Reports:** Generate monthly analytic reports of your carbon footprint breakdown and progress.
- **👥 Community Challenges:** Organizers can create challenges. Users can join to hit shared sustainability metrics.
- **🏅 Leaderboards:** Compete individually or as a team with weekly, monthly, and all-time ranking filters.
- **🔐 Secure & Hardened:** Features strict role-based access control, rate limiting, Helmet HTTP headers, NoSQL injection prevention (Zod validation), and restricted CORS configurations for robust security.

## 🛠️ Tech Stack

**Frontend:**
- React 18 (Vite)
- TypeScript
- Tailwind CSS
- Framer Motion (Animations)
- Radix UI & Shadcn UI (Component primitives)
- Zustand (State Management)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- OpenAI API (For personalized tips)
- Axios & Open-Meteo API (For real-time environmental data)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- OpenAI API Key (optional, for AI advisor)

### 1. Clone the repository
```bash
git clone https://github.com/Bahmed0192/EcoTrack.git
cd EcoTrack
```

### 2. Setup the Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_chars
OPENAI_API_KEY=your_openai_api_key
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```
Start the backend server:
```bash
node index.js
```

### 3. Setup the Frontend
Open a new terminal and navigate to the project root:
```bash
npm install
```
Start the frontend development server:
```bash
npm run dev
```
The app will be running at `http://localhost:5173`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is for educational and hackathon purposes.