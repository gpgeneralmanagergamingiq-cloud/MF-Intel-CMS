import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
// Force Dashboard reload - v2.3.2 - Single Property (Grand Palace Casino)
import { Dashboard } from "./components/Dashboard";
import { Players } from "./components/Players";
import { Floats } from "./components/Floats";
import { Ratings } from "./components/Ratings";
import { Drop } from "./components/Drop";
import { Reports } from "./components/Reports";
import { Setup } from "./components/Setup";
import { Cage } from "./components/Cage";
import { CreditLineManagement } from "./components/CreditLineManagement";
import { MarketingCampaigns } from "./components/MarketingCampaigns";
import { Jackpots } from "./components/Jackpots";
import { JackpotDisplay } from "./components/JackpotDisplay";
import { AuditLog } from "./components/AuditLog";
import { Comps } from "./components/Comps";
import { SimulationMode } from "./components/SimulationMode";
import { NotFound } from "./components/NotFound";

// Determine basename based on current URL path
// In production (deployed to /app/), use "/app"
// In development (Figma Make at /), use "/"
const basename = window.location.pathname.startsWith('/app') ? '/app' : '/';

// Single property routing - hardcoded to GrandPalace
export const router = createBrowserRouter(
  [
    {
      path: "/GrandPalace",
      Component: Root,
      children: [
        { index: true, Component: Dashboard },
        { path: "players", Component: Players },
        { path: "floats", Component: Floats },
        { path: "ratings", Component: Ratings },
        { path: "drop", Component: Drop },
        { path: "reports", Component: Reports },
        { path: "cage", Component: Cage },
        { path: "credit-line-management", Component: CreditLineManagement },
        { path: "comps", Component: Comps },
        { path: "setup", Component: Setup },
        { path: "marketing-campaigns", Component: MarketingCampaigns },
        { path: "jackpots", Component: Jackpots },
        { path: "audit-log", Component: AuditLog },
        { path: "simulation-mode", Component: SimulationMode },
        { path: "*", Component: NotFound },
      ],
    },
    {
      path: "/jackpot-display",
      Component: JackpotDisplay,
    },
    // Redirect root to Grand Palace Casino
    {
      path: "/",
      Component: Root,
      children: [],
    },
  ],
  {
    basename,
  }
);