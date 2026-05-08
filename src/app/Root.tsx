import { Outlet } from "react-router";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

export function Root() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#F8FAFC]">
      <Navigation />
      <main className="relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}