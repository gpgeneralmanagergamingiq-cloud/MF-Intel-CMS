import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  Play,
  TrendingUp,
  DollarSign,
  Clock,
  Trophy,
  Sparkles,
  Users,
  Monitor,
  Gift,
  Shuffle
} from "lucide-react";
import { useApi } from "../hooks/useApi";
import { JackpotForm } from "./JackpotForm";
import { RandomWinnerSelector } from "./RandomWinnerSelector";

interface JackpotLevel {
  name: string; // e.g., "Bronze", "Silver", "Gold", "Platinum"
  color: string;
  minAmount: number;
  maxAmount: number;
  contributionPercentage: number; // Percentage of bets that go to this level
}

interface JackpotCondition {
  type: "actualWinLoss" | "theoreticalWin" | "timePlayed" | "averageBet" | "totalBets";
  operator: "greaterThan" | "lessThan" | "equals" | "between";
  value: number;
  value2?: number; // For 'between' operator
}

interface Jackpot {
  id: string;
  name: string;
  type: "progressive-theo" | "progressive-fixed" | "fixed" | "random";
  status: "active" | "inactive";
  gameSelection: "all-tables" | "specific-tables";
  selectedTables: string[]; // Table names if specific
  levels: JackpotLevel[];
  conditions: JackpotCondition[];
  currentAmounts: { [levelName: string]: number }; // Current jackpot amounts per level
  seedAmounts: { [levelName: string]: number }; // Starting amounts after win
  lastWonDate?: string;
  lastWinner?: string;
  totalWon: number; // Historical total
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface JackpotWinner {
  id: string;
  jackpotId: string;
  jackpotName: string;
  level: string;
  playerName: string;
  amount: number;
  tableName: string;
  timestamp: string;
  displayedOn: string[]; // Array of display IDs where it was shown
}

export function Jackpots() {
  const [jackpots, setJackpots] = useState<Jackpot[]>([]);
  const [winners, setWinners] = useState<JackpotWinner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJackpot, setEditingJackpot] = useState<Jackpot | null>(null);
  const [showWinnerSelector, setShowWinnerSelector] = useState(false);
  const [activeRatings, setActiveRatings] = useState<any[]>([]);
  const { currentUser } = useOutletContext<{ currentUser: { username: string; userType: string } | null }>();
  const api = useApi();

  useEffect(() => {
    loadJackpots();
    loadWinners();
    getActiveRatings();
  }, [api.currentProperty]);

  const loadJackpots = async () => {
    try {
      const loaded = await api.getJackpots();
      setJackpots(loaded);
    } catch (error) {
      console.error("Error loading jackpots:", error);
    }
  };

  const loadWinners = async () => {
    try {
      const loaded = await api.getJackpotWinners();
      setWinners(loaded);
    } catch (error) {
      console.error("Error loading jackpot winners:", error);
    }
  };

  const handleDeleteJackpot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this jackpot?")) return;
    
    try {
      await api.deleteJackpot(id);
      loadJackpots();
    } catch (error) {
      console.error("Error deleting jackpot:", error);
      alert("Failed to delete jackpot. Please try again.");
    }
  };

  const handleToggleStatus = async (jackpot: Jackpot) => {
    try {
      const updated = {
        ...jackpot,
        status: jackpot.status === "active" ? "inactive" as const : "active" as const,
        updatedAt: new Date().toISOString(),
      };
      await api.updateJackpot(jackpot.id, updated);
      loadJackpots();
    } catch (error) {
      console.error("Error toggling jackpot status:", error);
      alert("Failed to update jackpot status. Please try again.");
    }
  };

  const handleSaveJackpot = async (jackpot: Jackpot) => {
    try {
      if (editingJackpot) {
        await api.updateJackpot(jackpot.id, jackpot);
      } else {
        await api.createJackpot(jackpot);
      }
      setShowForm(false);
      setEditingJackpot(null);
      loadJackpots();
    } catch (error) {
      console.error("Error saving jackpot:", error);
      alert("Failed to save jackpot. Please try again.");
    }
  };

  const handleSelectWinner = async (winner: {
    jackpotId: string;
    jackpotName: string;
    level: string;
    levelColor: string;
    playerName: string;
    amount: number;
    tableName: string;
  }) => {
    try {
      // Create winner record
      const newWinner = {
        jackpotId: winner.jackpotId,
        jackpotName: winner.jackpotName,
        level: winner.level,
        playerName: winner.playerName,
        amount: winner.amount,
        tableName: winner.tableName,
        timestamp: new Date().toISOString(),
        displayedOn: [],
      };
      
      await api.createJackpotWinner(newWinner);

      // Update jackpot - reset the level to seed amount and update totalWon
      const jackpot = jackpots.find(j => j.id === winner.jackpotId);
      if (jackpot) {
        const updatedCurrentAmounts = { ...jackpot.currentAmounts };
        updatedCurrentAmounts[winner.level] = jackpot.seedAmounts[winner.level] || jackpot.levels.find(l => l.name === winner.level)?.minAmount || 0;

        await api.updateJackpot(winner.jackpotId, {
          ...jackpot,
          currentAmounts: updatedCurrentAmounts,
          totalWon: jackpot.totalWon + winner.amount,
          lastWonDate: new Date().toISOString(),
          lastWinner: winner.playerName,
          updatedAt: new Date().toISOString(),
        });
      }

      // Trigger display celebration
      const event = new CustomEvent("jackpot-winner", {
        detail: {
          playerName: winner.playerName,
          jackpotName: winner.jackpotName,
          level: winner.level,
          amount: winner.amount,
          color: winner.levelColor
        }
      });
      window.dispatchEvent(event);

      setShowWinnerSelector(false);
      loadJackpots();
      loadWinners();
      
      alert(`🎉 Congratulations to ${winner.playerName} for winning ${formatCurrency(winner.amount)} on ${winner.jackpotName} - ${winner.level}!`);
    } catch (error) {
      console.error("Error recording winner:", error);
      alert("Failed to record winner. Please try again.");
    }
  };

  const getActiveRatings = async () => {
    try {
      const ratings = await api.getRatings();
      setActiveRatings(ratings.filter((r: any) => r.status === "Active"));
    } catch (error) {
      console.error("Error loading ratings:", error);
      setActiveRatings([]);
    }
  };

  const getAvailableTables = async () => {
    try {
      return await api.getAvailableTables();
    } catch (error) {
      console.error("Error loading tables:", error);
      return [];
    }
  };

  const formatCurrency = (amount: number) => {
    return `FCFA ${amount.toLocaleString()}`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "progressive-theo":
        return <TrendingUp className="w-5 h-5" />;
      case "progressive-fixed":
        return <DollarSign className="w-5 h-5" />;
      case "fixed":
        return <Trophy className="w-5 h-5" />;
      case "random":
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "progressive-theo":
        return "Progressive (Theo)";
      case "progressive-fixed":
        return "Progressive (Fixed Bet)";
      case "fixed":
        return "Fixed Amount";
      case "random":
        return "Random";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "progressive-theo":
        return "bg-blue-100 text-blue-800";
      case "progressive-fixed":
        return "bg-purple-100 text-purple-800";
      case "fixed":
        return "bg-green-100 text-green-800";
      case "random":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-slate-100 text-slate-800";
  };

  const openDisplayInNewWindow = () => {
    // Open the jackpot display in a new window/tab
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
    window.open(`${baseUrl}/jackpot-display`, "_blank", "width=1920,height=1080");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Jackpot Management</h2>
              <p className="text-amber-100 mt-1">Configure and manage progressive, fixed, and random jackpots</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openDisplayInNewWindow}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Monitor className="w-5 h-5" />
              Open Display
            </button>
            <button
              onClick={() => setShowWinnerSelector(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Shuffle className="w-5 h-5" />
              Random Winner
            </button>
            <button
              onClick={() => {
                setEditingJackpot(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-white hover:bg-amber-50 text-amber-600 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create Jackpot
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Active Jackpots</p>
              <p className="text-3xl font-bold text-green-600">
                {jackpots.filter(j => j.status === "active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Pool</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  jackpots.reduce((sum, j) => {
                    return sum + (j.currentAmounts ? Object.values(j.currentAmounts).reduce((a, b) => a + b, 0) : 0);
                  }, 0)
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Won</p>
              <p className="text-2xl font-bold text-amber-600">
                {formatCurrency(jackpots.reduce((sum, j) => sum + j.totalWon, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Winners</p>
              <p className="text-3xl font-bold text-purple-600">{winners.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Jackpots List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">Configured Jackpots</h3>
          <p className="text-sm text-slate-600 mt-1">Manage your jackpot configurations</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Levels</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Current Pool</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tables</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {jackpots.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Zap className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium">No Jackpots Configured</p>
                    <p className="text-sm mt-1">Create your first jackpot to get started</p>
                  </td>
                </tr>
              ) : (
                jackpots.map((jackpot) => (
                  <tr key={jackpot.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(jackpot.type)}`}>
                          {getTypeIcon(jackpot.type)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{jackpot.name}</p>
                          <p className="text-xs text-slate-500">Created {formatTimestamp(jackpot.createdAt)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(jackpot.type)}`}>
                        {getTypeName(jackpot.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(jackpot)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(jackpot.status)} hover:opacity-80 transition-opacity`}
                      >
                        {jackpot.status === "active" ? <Play className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {jackpot.status ? jackpot.status.charAt(0).toUpperCase() + jackpot.status.slice(1) : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {jackpot.levels.map((level) => (
                          <span
                            key={level.name}
                            className="px-2 py-0.5 text-xs rounded"
                            style={{ backgroundColor: level.color + "20", color: level.color }}
                          >
                            {level.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {jackpot.levels.map((level) => (
                          <div key={level.name} className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-600">{level.name}:</span>
                            <span className="text-sm font-bold" style={{ color: level.color }}>
                              {formatCurrency(jackpot.currentAmounts[level.name] || 0)}
                            </span>
                            <span className="text-xs text-slate-400" title="Seed amount (resets to this after win)">
                              (min: {formatCurrency(level.minAmount)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {jackpot.gameSelection === "all-tables"
                          ? "All Tables"
                          : `${jackpot.selectedTables.length} Table(s)`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingJackpot(jackpot);
                            setShowForm(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJackpot(jackpot.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Winners */}
      {winners.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Recent Winners
            </h3>
            <p className="text-sm text-slate-600 mt-1">Latest jackpot winners</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Winner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Jackpot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Table</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {winners.slice(0, 10).map((winner) => (
                  <tr key={winner.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="font-semibold text-slate-900">{winner.playerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{winner.jackpotName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded">
                        {winner.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-green-600">{formatCurrency(winner.amount)}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{winner.tableName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatTimestamp(winner.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Forms and Modals will be added here */}
      {showForm && currentUser && (
        <JackpotForm
          jackpot={editingJackpot}
          currentUser={currentUser}
          onSave={handleSaveJackpot}
          onCancel={() => {
            setShowForm(false);
            setEditingJackpot(null);
          }}
        />
      )}
      
      {showWinnerSelector && (
        <RandomWinnerSelector
          jackpots={jackpots}
          activeRatings={activeRatings}
          onSelectWinner={handleSelectWinner}
          onCancel={() => setShowWinnerSelector(false)}
        />
      )}
    </div>
  );
}