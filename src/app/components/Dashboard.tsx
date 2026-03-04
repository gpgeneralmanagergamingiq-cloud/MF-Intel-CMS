import { useState, useEffect } from "react";
import { Users, DollarSign, TrendingUp, AlertCircle, TrendingDown, Percent, Table2, Eye, Clock, Calendar, Zap } from "lucide-react";
import { Link } from "react-router";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useApi } from "../hooks/useApi";

// Dashboard component - v2.3.2 - Grand Palace Casino Only
// Fixed: Removed multi-property support, hardcoded to Grand Palace
interface Player {
  id: string;
  name: string;
  memberId: string;
  joinDate: string;
  status: string;
  property?: string;
}

interface Float {
  id: string;
  tableName: string;
  dealerName: string;
  amount: number;
  timestamp: string;
  status: string;
  type: "Open" | "Close" | "Fill" | "Credit";
  property?: string;
}

interface Rating {
  id: string;
  playerId: string;
  playerName: string;
  tableName: string;
  startTime: string;
  status: "Active" | "Completed";
  buyInAmount: number;
  cashOutAmount?: number;
  winLoss?: number;
  averageBet: number;
  buyInType: "Cash" | "Chips";
  property?: string;
}

interface DropEntry {
  id: string;
  tableName: string;
  amount: number;
  playerName: string;
  timestamp: string;
  property?: string;
}

export function Dashboard() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [floats, setFloats] = useState<Float[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [drops, setDrops] = useState<DropEntry[]>([]);
  const [showDropByTable, setShowDropByTable] = useState(false);
  const [dropTimeRange, setDropTimeRange] = useState<3 | 6 | 9 | 12 | 18 | 24>(6);
  const [playersTimeRange, setPlayersTimeRange] = useState<3 | 6 | 9 | 12 | 18 | 24>(6);
  const [gamingDayRange, setGamingDayRange] = useState<"Today" | "Yesterday" | "This Week" | "Last Week" | "This Month" | "Last Month" | "This Year" | "Last Year" | "Custom">("Today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  
  // Hardcoded property - Grand Palace Casino
  const PROPERTY = "grand_palace";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load data only from Grand Palace Casino
      const [propPlayers, propFloats, propRatings, propDrops] = await Promise.all([
        api.getPlayers(PROPERTY),
        api.getFloats(PROPERTY),
        api.getRatings(PROPERTY),
        api.getDrops(PROPERTY)
      ]);
      
      setPlayers(propPlayers);
      setFloats(propFloats);
      setRatings(propRatings);
      setDrops(propDrops);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get date range based on gaming day selection
  const getDateRange = (): { start: Date; end: Date } => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    switch (gamingDayRange) {
      case "Today":
        // Gaming day: 8am today to 8am tomorrow
        start.setHours(8, 0, 0, 0);
        // If current time is before 8am, we're still in yesterday's gaming day
        if (now.getHours() < 8) {
          start.setDate(start.getDate() - 1);
          end.setHours(8, 0, 0, 0);
        } else {
          // Current gaming day: 8am today to 8am tomorrow
          end.setDate(end.getDate() + 1);
          end.setHours(8, 0, 0, 0);
        }
        break;
      case "Yesterday":
        // Previous gaming day: 8am yesterday to 8am today
        if (now.getHours() < 8) {
          // If before 8am, yesterday is 2 days ago to 1 day ago
          start.setDate(now.getDate() - 2);
          start.setHours(8, 0, 0, 0);
          end.setDate(now.getDate() - 1);
          end.setHours(8, 0, 0, 0);
        } else {
          start.setDate(now.getDate() - 1);
          start.setHours(8, 0, 0, 0);
          end.setHours(8, 0, 0, 0);
        }
        break;
      case "This Week":
        // Week starts on Monday
        const dayOfWeek = now.getDay();
        const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, need to go back 6 days
        start.setDate(now.getDate() - daysFromMonday);
        start.setHours(8, 0, 0, 0);
        // End at 8am next Monday
        end.setDate(start.getDate() + 7);
        end.setHours(8, 0, 0, 0);
        break;
      case "Last Week":
        const currentDayOfWeek = now.getDay();
        const daysFromLastMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
        const lastWeekStart = new Date(now);
        lastWeekStart.setDate(now.getDate() - daysFromLastMonday - 7);
        lastWeekStart.setHours(8, 0, 0, 0);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 7);
        lastWeekEnd.setHours(8, 0, 0, 0);
        return { start: lastWeekStart, end: lastWeekEnd };
      case "This Month":
        start.setDate(1);
        start.setHours(8, 0, 0, 0);
        // End at 8am on the 1st of next month
        end.setMonth(end.getMonth() + 1, 1);
        end.setHours(8, 0, 0, 0);
        break;
      case "Last Month":
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        lastMonthStart.setHours(8, 0, 0, 0);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
        lastMonthEnd.setHours(8, 0, 0, 0);
        return { start: lastMonthStart, end: lastMonthEnd };
      case "This Year":
        start.setMonth(0, 1);
        start.setHours(8, 0, 0, 0);
        // End at 8am on Jan 1 of next year
        end.setFullYear(end.getFullYear() + 1, 0, 1);
        end.setHours(8, 0, 0, 0);
        break;
      case "Last Year":
        const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
        lastYearStart.setHours(8, 0, 0, 0);
        const lastYearEnd = new Date(now.getFullYear(), 0, 1);
        lastYearEnd.setHours(8, 0, 0, 0);
        return { start: lastYearStart, end: lastYearEnd };
      case "Custom":
        if (customStartDate && customEndDate) {
          const customStart = new Date(customStartDate);
          customStart.setHours(8, 0, 0, 0);
          const customEnd = new Date(customEndDate);
          customEnd.setDate(customEnd.getDate() + 1); // Add 1 day to include the end date
          customEnd.setHours(8, 0, 0, 0);
          return { start: customStart, end: customEnd };
        }
        break;
    }

    return { start, end };
  };

  const dateRange = getDateRange();

  // Filter data based on date range only (no property filtering)
  const filteredRatings = ratings.filter(r => {
    const startTime = new Date(r.startTime);
    const dateMatch = startTime >= dateRange.start && startTime <= dateRange.end;
    return dateMatch;
  });

  const filteredDrops = drops.filter(d => {
    const timestamp = new Date(d.timestamp);
    const dateMatch = timestamp >= dateRange.start && timestamp <= dateRange.end;
    return dateMatch;
  });

  const filteredFloats = floats.filter(f => {
    const timestamp = new Date(f.timestamp);
    const dateMatch = timestamp >= dateRange.start && timestamp <= dateRange.end;
    return dateMatch;
  });

  const filteredPlayers = players; // No property filtering needed

  const totalPlayers = filteredPlayers.length;
  const activePlayers = filteredPlayers.filter(p => p.status === "Active").length;
  const totalFloat = filteredFloats.reduce((sum, f) => sum + f.amount, 0);
  const activeFloats = filteredFloats.filter(f => f.status === "Active").length;

  // Calculate new metrics
  // Number of Opened Tables - tables with Open transaction that are Active
  const openedTables = filteredFloats.filter(f => f.status === "Active" && f.type === "Open").length;
  
  // Number of Active Tables - unique tables that have active player ratings
  const activeRatings = filteredRatings.filter(r => r.status === "Active");
  const tablesWithPlayers = new Set(activeRatings.map(r => r.tableName)).size;
  
  // Number of Active Players - count of currently active/open ratings
  const numberOfActivePlayers = activeRatings.length;
  
  // Number of Total Players for the day - all players who had a session today (active + completed today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRatings = ratings.filter(r => {
    const startDate = new Date(r.startTime);
    startDate.setHours(0, 0, 0, 0);
    return startDate.getTime() === today.getTime();
  });
  const totalPlayersToday = new Set(todayRatings.map(r => r.playerId)).size;

  // Calculate Drop, Win, and Hold % metrics
  const totalDrop = filteredDrops.reduce((sum, d) => sum + d.amount, 0);
  
  // Total Win = sum of all win/loss from completed ratings (inverted for house perspective)
  // Player losses = House wins (positive), Player wins = House losses (negative)
  const completedRatings = filteredRatings.filter(r => r.status === "Completed");
  const totalWin = completedRatings.reduce((sum, r) => sum - (r.winLoss || 0), 0);
  
  // Hold % = (Win / Drop) * 100
  const holdPercentage = totalDrop > 0 ? (totalWin / totalDrop) * 100 : 0;

  // Drop by table
  const dropByTable = filteredDrops.reduce((acc, drop) => {
    if (!acc[drop.tableName]) {
      acc[drop.tableName] = 0;
    }
    acc[drop.tableName] += drop.amount;
    return acc;
  }, {} as Record<string, number>);

  // Top 5 tables by drop
  const top5TablesByDrop = Object.entries(dropByTable)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tableName, amount]) => ({ tableName, amount }));

  // Player statistics - aggregate by player
  const playerStats = completedRatings.reduce((acc, rating) => {
    if (!acc[rating.playerId]) {
      acc[rating.playerId] = {
        playerName: rating.playerName,
        totalDrop: 0,
        totalWinLoss: 0,
        sessionCount: 0,
        totalBets: 0,
        highestBet: 0,
      };
    }
    
    // Find drop amount for this player's session
    const playerDrops = filteredDrops.filter(d => 
      d.playerName === rating.playerName && 
      d.tableName === rating.tableName
    );
    const playerDropAmount = playerDrops.reduce((sum, d) => sum + d.amount, 0);
    
    acc[rating.playerId].totalDrop += playerDropAmount;
    acc[rating.playerId].totalWinLoss += rating.winLoss || 0;
    acc[rating.playerId].sessionCount += 1;
    acc[rating.playerId].totalBets += rating.averageBet;
    
    // Track highest bet
    if (rating.averageBet > acc[rating.playerId].highestBet) {
      acc[rating.playerId].highestBet = rating.averageBet;
    }
    
    return acc;
  }, {} as Record<string, { playerName: string; totalDrop: number; totalWinLoss: number; sessionCount: number; totalBets: number; highestBet: number }>);

  // Top 5 Best Players (highest losses = negative winLoss)
  const top5BestPlayers = Object.values(playerStats)
    .sort((a, b) => a.totalWinLoss - b.totalWinLoss) // Most negative first
    .slice(0, 5)
    .map(p => {
      const avgBet = p.sessionCount > 0 ? p.totalBets / p.sessionCount : 0;
      return {
        playerName: p.playerName,
        totalDrop: p.totalDrop,
        totalLoss: Math.abs(p.totalWinLoss),
        averageBet: (isNaN(avgBet) || avgBet === 0) ? p.highestBet : avgBet,
      };
    });

  // Top 5 Worst Players (highest winnings = positive winLoss)
  const top5WorstPlayers = Object.values(playerStats)
    .sort((a, b) => b.totalWinLoss - a.totalWinLoss) // Most positive first
    .slice(0, 5)
    .map(p => {
      const avgBet = p.sessionCount > 0 ? p.totalBets / p.sessionCount : 0;
      return {
        playerName: p.playerName,
        totalDrop: p.totalDrop,
        totalWin: p.totalWinLoss,
        averageBet: (isNaN(avgBet) || avgBet === 0) ? p.highestBet : avgBet,
      };
    });

  // Calculate Drop per Hour data
  const getDropPerHourData = (hours: number) => {
    const now = new Date();
    const hourlyData: Record<string, number> = {};
    
    // Initialize all hours with 0
    for (let i = hours - 1; i >= 0; i--) {
      const hourTime = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourLabel = hourTime.getHours() + ':00';
      hourlyData[hourLabel] = 0;
    }
    
    // Aggregate drops by hour
    filteredDrops.forEach(drop => {
      const dropTime = new Date(drop.timestamp);
      const timeDiff = now.getTime() - dropTime.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff <= hours) {
        const hourLabel = dropTime.getHours() + ':00';
        if (hourlyData[hourLabel] !== undefined) {
          hourlyData[hourLabel] += drop.amount;
        }
      }
    });
    
    return Object.entries(hourlyData).map(([hour, amount]) => ({
      hour,
      drop: amount,
    }));
  };

  // Calculate Players per Hour data
  const getPlayersPerHourData = (hours: number) => {
    const now = new Date();
    const hourlyData: Record<string, Set<string>> = {};
    
    // Initialize all hours with empty sets
    for (let i = hours - 1; i >= 0; i--) {
      const hourTime = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourLabel = hourTime.getHours() + ':00';
      hourlyData[hourLabel] = new Set();
    }
    
    // Count unique players per hour based on session start times
    filteredRatings.forEach(rating => {
      const startTime = new Date(rating.startTime);
      const timeDiff = now.getTime() - startTime.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff <= hours) {
        const hourLabel = startTime.getHours() + ':00';
        if (hourlyData[hourLabel]) {
          hourlyData[hourLabel].add(rating.playerId);
        }
      }
    });
    
    return Object.entries(hourlyData).map(([hour, playerSet]) => ({
      hour,
      players: playerSet.size,
    }));
  };

  const dropPerHourData = getDropPerHourData(dropTimeRange);
  const playersPerHourData = getPlayersPerHourData(playersTimeRange);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
          <p className="text-slate-600">Overview of casino operations</p>
          {/* Version Badge */}
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-700">v2.3.2 • Grand Palace Casino</span>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="flex flex-col gap-3">
          {/* Gaming Day Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <select
              value={gamingDayRange}
              onChange={(e) => {
                const value = e.target.value as typeof gamingDayRange;
                setGamingDayRange(value);
                if (value === "Custom") {
                  setShowCustomDatePicker(true);
                } else {
                  setShowCustomDatePicker(false);
                }
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
              <option value="Last Year">Last Year</option>
              <option value="Custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range Picker */}
          {showCustomDatePicker && (
            <div className="flex items-center gap-2 bg-indigo-50 p-3 rounded-lg border border-indigo-200">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-600">End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table & Session Metrics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Table2 className="w-6 h-6 text-blue-600" />
          Today's Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-cyan-100 p-2 rounded-full">
                <Table2 className="w-5 h-5 text-cyan-600" />
              </div>
              <p className="text-slate-600 text-sm font-medium">Opened Tables</p>
            </div>
            <p className="text-3xl font-bold text-slate-900 ml-11">{openedTables}</p>
            <p className="text-xs text-slate-500 mt-1 ml-11">Tables with open floats</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-100 p-2 rounded-full">
                <Eye className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-slate-600 text-sm font-medium">Active Tables</p>
            </div>
            <p className="text-3xl font-bold text-slate-900 ml-11">{tablesWithPlayers}</p>
            <p className="text-xs text-slate-500 mt-1 ml-11">Tables with players</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-violet-100 p-2 rounded-full">
                <Zap className="w-5 h-5 text-violet-600" />
              </div>
              <p className="text-slate-600 text-sm font-medium">Active Players</p>
            </div>
            <p className="text-3xl font-bold text-slate-900 ml-11">{numberOfActivePlayers}</p>
            <p className="text-xs text-slate-500 mt-1 ml-11">Currently playing</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-amber-100 p-2 rounded-full">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-slate-600 text-sm font-medium">Total Players Today</p>
            </div>
            <p className="text-3xl font-bold text-slate-900 ml-11">{totalPlayersToday}</p>
            <p className="text-xs text-slate-500 mt-1 ml-11">Unique players today</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Financial Overview */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Financial Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Drop:</span>
                <span className="text-2xl font-bold text-slate-900">CFA {totalDrop.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Win:</span>
                <span className={`text-2xl font-bold ${totalWin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalWin >= 0 ? '+' : ''}CFA {totalWin.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-slate-600 font-medium">Hold %:</span>
                <span className="text-3xl font-bold text-purple-600 flex items-center gap-1">
                  {holdPercentage.toFixed(2)}%
                  <Percent className="w-5 h-5" />
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowDropByTable(!showDropByTable)}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showDropByTable ? 'Hide' : 'View'} Drop by Table
            </button>
            {showDropByTable && (
              <div className="mt-4 pt-4 border-t space-y-2">
                {Object.entries(dropByTable).map(([tableName, amount]) => (
                  <div key={tableName} className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded">
                    <span className="font-medium text-slate-700">{tableName}</span>
                    <span className="font-bold text-slate-900">CFA {amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top 5 Tables by Drop */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Table2 className="w-5 h-5 text-purple-600" />
              Top 5 Tables by Drop
            </h3>
            <p className="text-xs text-slate-500 mb-3">Highest cash transactions</p>
            {top5TablesByDrop.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No drop transactions yet</p>
            ) : (
              <div className="space-y-2">
                {top5TablesByDrop.map((table, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 px-3 bg-purple-50 rounded">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">
                        {idx + 1}
                      </span>
                      <p className="font-medium text-slate-900">{table.tableName}</p>
                    </div>
                    <span className="font-bold text-purple-600">
                      CFA {table.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/drop"
              className="mt-4 block text-center text-purple-600 hover:text-purple-700 font-medium"
            >
              View All Tables →
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top 5 Best Players (Highest Losses) */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Top 5 Best Players
            </h3>
            <p className="text-xs text-slate-500 mb-3">Highest player losses (good for house)</p>
            {top5BestPlayers.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No completed sessions yet</p>
            ) : (
              <div className="space-y-2">
                {top5BestPlayers.map((player, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{player.playerName}</p>
                      <p className="text-xs text-slate-600">
                        Drop: CFA {player.totalDrop.toLocaleString()} | Avg Bet: {
                          isNaN(player.averageBet) || player.averageBet === 0 
                            ? 'Not Set' 
                            : `CFA ${player.averageBet.toLocaleString()}`
                        }
                      </p>
                    </div>
                    <span className="font-bold text-red-600 ml-2">
                      -CFA {player.totalLoss.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/ratings"
              className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Players →
            </Link>
          </div>

          {/* Top 5 Worst Players (Highest Winnings) */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-600">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Top 5 Worst Players
            </h3>
            <p className="text-xs text-slate-500 mb-3">Highest player winnings (bad for house)</p>
            {top5WorstPlayers.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No completed sessions yet</p>
            ) : (
              <div className="space-y-2">
                {top5WorstPlayers.map((player, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 px-3 bg-red-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{player.playerName}</p>
                      <p className="text-xs text-slate-600">
                        Drop: CFA {player.totalDrop.toLocaleString()} | Avg Bet: {
                          isNaN(player.averageBet) || player.averageBet === 0 
                            ? 'Not Set' 
                            : `CFA ${player.averageBet.toLocaleString()}`
                        }
                      </p>
                    </div>
                    <span className="font-bold text-green-600 ml-2">
                      +CFA {player.totalWin.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/ratings"
              className="mt-4 block text-center text-red-600 hover:text-red-700 font-medium"
            >
              View All Players →
            </Link>
          </div>
        </div>
      </div>

      {/* Hourly Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drop per Hour Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                Drop per Hour
              </h3>
              <p className="text-xs text-slate-500 mt-1">Cash transactions by hour</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDropTimeRange(3)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  dropTimeRange === 3
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                3h
              </button>
              <button
                onClick={() => setDropTimeRange(6)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  dropTimeRange === 6
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                6h
              </button>
              <button
                onClick={() => setDropTimeRange(9)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  dropTimeRange === 9
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                9h
              </button>
              <button
                onClick={() => setDropTimeRange(12)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  dropTimeRange === 12
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                12h
              </button>
              <button
                onClick={() => setDropTimeRange(18)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  dropTimeRange === 18
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                18h
              </button>
              <button
                onClick={() => setDropTimeRange(24)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  dropTimeRange === 24
                    ? 'bg-orange-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                24h
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dropPerHourData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="hour" 
                stroke="#64748b"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number) => [`CFA ${value.toLocaleString()}`, 'Drop']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="drop" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Players per Hour Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-teal-500">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-500" />
                Players per Hour
              </h3>
              <p className="text-xs text-slate-500 mt-1">Unique players starting sessions</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPlayersTimeRange(3)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  playersTimeRange === 3
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                3h
              </button>
              <button
                onClick={() => setPlayersTimeRange(6)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  playersTimeRange === 6
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                6h
              </button>
              <button
                onClick={() => setPlayersTimeRange(9)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  playersTimeRange === 9
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                9h
              </button>
              <button
                onClick={() => setPlayersTimeRange(12)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  playersTimeRange === 12
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                12h
              </button>
              <button
                onClick={() => setPlayersTimeRange(18)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  playersTimeRange === 18
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                18h
              </button>
              <button
                onClick={() => setPlayersTimeRange(24)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  playersTimeRange === 24
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                24h
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={playersPerHourData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="hour" 
                stroke="#64748b"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}`, 'Players']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="players" 
                stroke="#14b8a6" 
                strokeWidth={3}
                dot={{ fill: '#14b8a6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}