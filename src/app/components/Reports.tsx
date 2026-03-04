import { useState } from "react";
import { FileText, BarChart3, DollarSign, UserPlus, TrendingUp, Wine } from "lucide-react";
import { PlayerActivityReport } from "./PlayerActivityReport";
import { TablesGamesActivityReport } from "./TablesGamesActivityReport";
import { RebateSummaryReport } from "./RebateSummaryReport";
import { NewPlayersReport } from "./NewPlayersReport";
import { AnalyticsInsights } from "./AnalyticsInsights";
import { CompsReport } from "./CompsReport";
import { useOutletContext } from "react-router";

export function Reports() {
  const [activeTab, setActiveTab] = useState<"player" | "tables" | "rebates" | "newplayers" | "analytics" | "comps">("analytics");
  const { currentUser } = useOutletContext<{ currentUser: { username: string; userType: string } }>();

  // Host users can only see Player Activity Report
  const canViewTablesReport = currentUser?.userType !== "Host";
  const canViewRebatesReport = currentUser?.userType !== "Host"; // Inspector, Pit Boss, Management can view
  const canViewNewPlayersReport = true; // All users can view new players report
  const canViewAnalytics = true; // All users can view analytics
  const canViewCompsReport = true; // All users can view comps report

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex gap-2 flex-wrap">
          {/* Analytics Insights - Featured First */}
          {canViewAnalytics && (
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Analytics Insights
            </button>
          )}
          
          <button
            onClick={() => setActiveTab("player")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "player"
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-5 h-5" />
            Player Activity Report
          </button>
          
          {/* New Players Report - All users can view */}
          {canViewNewPlayersReport && (
            <button
              onClick={() => setActiveTab("newplayers")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "newplayers"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <UserPlus className="w-5 h-5" />
              New Players Report
            </button>
          )}
          
          {/* Hide Tables & Games Activity for Host users */}
          {canViewTablesReport && (
            <button
              onClick={() => setActiveTab("tables")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "tables"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Tables & Games Activity Report
            </button>
          )}
          
          {/* Hide Rebates Summary for Host users */}
          {canViewRebatesReport && (
            <button
              onClick={() => setActiveTab("rebates")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "rebates"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Rebates Summary Report
            </button>
          )}
          
          {/* Comps Report - All users can view */}
          {canViewCompsReport && (
            <button
              onClick={() => setActiveTab("comps")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "comps"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Wine className="w-5 h-5" />
              Comps Report
            </button>
          )}
        </div>
      </div>

      {/* Report Content */}
      {activeTab === "analytics" && canViewAnalytics && <AnalyticsInsights />}
      {activeTab === "player" && <PlayerActivityReport />}
      {activeTab === "newplayers" && canViewNewPlayersReport && <NewPlayersReport />}
      {activeTab === "tables" && canViewTablesReport && <TablesGamesActivityReport />}
      {activeTab === "rebates" && canViewRebatesReport && <RebateSummaryReport />}
      {activeTab === "comps" && canViewCompsReport && <CompsReport />}
    </div>
  );
}