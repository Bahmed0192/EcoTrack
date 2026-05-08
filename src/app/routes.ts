import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { Features } from "./pages/Features";
import { Dashboard } from "./pages/Dashboard";
import { Community } from "./pages/Community";
import { Pricing } from "./pages/Pricing";
import { About } from "./pages/About";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { EcoActionLog } from "./pages/EcoActionLog";
import { Leaderboard } from "./pages/Leaderboard";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "features", Component: Features },
      { path: "dashboard", Component: Dashboard },
      { path: "community", Component: Community },
      { path: "pricing", Component: Pricing },
      { path: "about", Component: About },
      { path: "signin", Component: SignIn },
      { path: "signup", Component: SignUp },
      { path: "actions", Component: EcoActionLog },
      { path: "leaderboard", Component: Leaderboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
