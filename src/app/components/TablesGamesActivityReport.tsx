import { useState, useEffect } from "react";
import { Download, Filter, X, RefreshCw, TrendingUp, Award, BarChart3, Calendar, FileText, Send, RotateCcw } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { DailyTablesReport } from "./DailyTablesReport";
import { RollShiftForm } from "./RollShiftForm";
import { sendEndOfDayReportToManagement } from "../utils/emailService";

interface ChipDenomination {
  [key: string]: number;
}

interface CompletedRating {
  id: string;
  playerId: string;
  playerName: string;
  tableName: string;
  buyInType: "Cash" | "Chips";
  buyInAmount: number;
  cashAmount?: number;
  averageBet: number;
  cashOutAmount: number;
  winLoss: number;
  currency: string;
  buyInChips: ChipDenomination;
  cashOutChips: ChipDenomination;
  startTime: string;
  endTime: string;
  totalTime: string;
  playingTime: string;
  status: "Completed";
  numberOfPlayers?: number;
}

interface GameTable {
  tableNumber: string;
  gameType: string;
  houseAdvantage: number;
  handsPerHour: {
    oneToTwo: number;
    threeToFour: number;
    moreThanFive: number;
  };
  pointsRule: string;
  ticketsRule: string;
}

interface ActivityReport {
  rating: CompletedRating;
  gameType: string;
  houseAdvantage: number;
  handsPerHour: number;
  playingTimeMinutes: number;
  theoreticalWin: number;
  pointsEarned: number;
  ticketsEarned: number;
  totalBets: number;
}

interface AggregatedData {
  key: string;
  sessions: number;
  totalPlayingTime: number;
  totalBets: number;
  totalAvgBet: number;
  theoreticalWin: number;
  actualWinLoss: number;
  points: number;
  dateKey: string; // For sorting
}

const gameTablesData: GameTable[] = [
  {
    tableNumber: "Uth 01",
    gameType: "Ultimate Texas Holdem",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Uth 02",
    gameType: "Ultimate Texas Holdem",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Uth 03",
    gameType: "Ultimate Texas Holdem",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Niu Niu 1",
    gameType: "NIUNIU",
    houseAdvantage: 0.05,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Niu Niu 2",
    gameType: "NIUNIU",
    houseAdvantage: 0.05,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Niu Niu 3",
    gameType: "NIUNIU",
    houseAdvantage: 0.05,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Bac 1",
    gameType: "Baccarat",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 60, threeToFour: 50, moreThanFive: 40 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Bac 2",
    gameType: "Baccarat",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 60, threeToFour: 50, moreThanFive: 40 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Bac 3",
    gameType: "Baccarat",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 60, threeToFour: 50, moreThanFive: 40 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Bac 01",
    gameType: "Baccarat",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 60, threeToFour: 50, moreThanFive: 40 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "BJ 01",
    gameType: "BlackJack",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 120, threeToFour: 90, moreThanFive: 70 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "BJ 02",
    gameType: "BlackJack",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 120, threeToFour: 90, moreThanFive: 70 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Pk 01",
    gameType: "Poker",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Pk 02",
    gameType: "Poker",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Texas 1",
    gameType: "Texas Hold'em",
    houseAdvantage: 0.0,
    handsPerHour: { oneToTwo: 0, threeToFour: 0, moreThanFive: 0 },
    pointsRule: "1 point for 15 minutes of play",
    ticketsRule: "1 ticket every 10 Minutes of Play",
  },
  {
    tableNumber: "Texas 2",
    gameType: "Texas Hold'em",
    houseAdvantage: 0.0,
    handsPerHour: { oneToTwo: 0, threeToFour: 0, moreThanFive: 0 },
    pointsRule: "1 point for 15 minutes of play",
    ticketsRule: "1 ticket every 10 Minutes of Play",
  },
  {
    tableNumber: "Ar 01",
    gameType: "Roulette",
    houseAdvantage: 0.027,
    handsPerHour: { oneToTwo: 50, threeToFour: 40, moreThanFive: 30 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Ar 02",
    gameType: "Roulette",
    houseAdvantage: 0.027,
    handsPerHour: { oneToTwo: 50, threeToFour: 40, moreThanFive: 30 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "Ar 03",
    gameType: "Roulette",
    houseAdvantage: 0.027,
    handsPerHour: { oneToTwo: 50, threeToFour: 40, moreThanFive: 30 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
];

export function TablesGamesActivityReport() {
  const [ratings, setRatings] = useState<CompletedRating[]>([]);
  const [reports, setReports] = useState<ActivityReport[]>([]);
  const [aggregationView, setAggregationView] = useState<"game" | "table">("game");
  const [periodView, setPeriodView] = useState<"day" | "month" | "year">("day");
  const [showDailyReport, setShowDailyReport] = useState(false);
  const [showRollShift, setShowRollShift] = useState(false);
  const [floats, setFloats] = useState<any[]>([]);
  const [drops, setDrops] = useState<any[]>([]);
  const api = useApi();

  // Filters
  const [filterTable, setFilterTable] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterGameType, setFilterGameType] = useState("");

  useEffect(() => {
    loadRatings();
    loadFloats();
    loadDrops();
  }, []);

  useEffect(() => {
    generateReports();
  }, [ratings]);

  const loadRatings = () => {
    const savedRatings = localStorage.getItem("casino_ratings");
    if (savedRatings) {
      const allRatings = JSON.parse(savedRatings);
      const completed = allRatings.filter((r: any) => r.status === "Completed");
      setRatings(completed);
    }
  };

  const loadFloats = async () => {
    try {
      const loadedFloats = await api.getFloats();
      setFloats(loadedFloats);
    } catch (error) {
      console.error("Error loading floats:", error);
    }
  };

  const loadDrops = async () => {
    try {
      const loadedDrops = await api.getDrops();
      setDrops(loadedDrops);
    } catch (error) {
      console.error("Error loading drops:", error);
    }
  };

  const handleSendEndOfDayReport = async () => {
    try {
      const success = await sendEndOfDayReportToManagement(floats);
      if (success) {
        alert("End-of-day report sent successfully to management!");
      } else {
        alert("Failed to send report. Please check your email configuration.");
      }
    } catch (error) {
      console.error("Error sending end-of-day report:", error);
      alert("Failed to send report. Please try again.");
    }
  };

  const parsePlayingTime = (timeStr: string): number => {
    const hoursMatch = timeStr.match(/(\d+)h/);
    const minutesMatch = timeStr.match(/(\d+)m/);
    
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    
    return hours * 60 + minutes;
  };

  const getHandsPerHour = (table: GameTable, numberOfPlayers?: number): number => {
    if (!numberOfPlayers) {
      return table.handsPerHour.threeToFour;
    }
    
    if (numberOfPlayers <= 2) {
      return table.handsPerHour.oneToTwo;
    } else if (numberOfPlayers <= 4) {
      return table.handsPerHour.threeToFour;
    } else {
      return table.handsPerHour.moreThanFive;
    }
  };

  const generateReports = () => {
    const activityReports: ActivityReport[] = [];

    ratings.forEach((rating) => {
      const tableConfig = gameTablesData.find(
        (t) => t.tableNumber === rating.tableName
      );

      if (!tableConfig) {
        return;
      }

      const playingTimeMinutes = parsePlayingTime(rating.playingTime);
      const playingTimeHours = playingTimeMinutes / 60;

      let theoreticalWin = 0;
      let pointsEarned = 0;
      let ticketsEarned = 0;
      let totalBets = 0;
      let handsPerHour = 0;

      if (tableConfig.gameType === "Texas Hold'em") {
        theoreticalWin = 0;
        pointsEarned = Math.floor(playingTimeMinutes / 15);
        ticketsEarned = Math.floor(playingTimeMinutes / 10);
        totalBets = 0;
        handsPerHour = 0;
      } else {
        handsPerHour = getHandsPerHour(tableConfig, rating.numberOfPlayers);
        
        theoreticalWin = 
          tableConfig.houseAdvantage * 
          handsPerHour * 
          rating.averageBet * 
          playingTimeHours;

        totalBets = rating.averageBet * handsPerHour * playingTimeHours;
        pointsEarned = Math.floor(totalBets / 10000);
        ticketsEarned = Math.floor(totalBets / 100000);
      }

      activityReports.push({
        rating,
        gameType: tableConfig.gameType,
        houseAdvantage: tableConfig.houseAdvantage,
        handsPerHour,
        playingTimeMinutes,
        theoreticalWin,
        pointsEarned,
        ticketsEarned,
        totalBets,
      });
    });

    setReports(activityReports);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " FCFA";
  };

  // Convert a timestamp to its gaming day date (8am to 8am)
  const getGamingDayDate = (timestamp: string): Date => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    
    // If the session started before 8am, it belongs to the previous gaming day
    if (hours < 8) {
      const gamingDay = new Date(date);
      gamingDay.setDate(gamingDay.getDate() - 1);
      gamingDay.setHours(8, 0, 0, 0);
      return gamingDay;
    } else {
      // Session started at or after 8am, it belongs to today's gaming day
      const gamingDay = new Date(date);
      gamingDay.setHours(8, 0, 0, 0);
      return gamingDay;
    }
  };

  const filteredReports = reports.filter((report) => {
    if (filterTable && report.rating.tableName !== filterTable) {
      return false;
    }
    if (filterGameType && report.gameType !== filterGameType) {
      return false;
    }
    if (filterDateFrom) {
      // Gaming day starts at 8am of the selected date
      const fromDate = new Date(filterDateFrom);
      fromDate.setHours(8, 0, 0, 0);
      
      const sessionDate = new Date(report.rating.startTime);
      
      if (sessionDate < fromDate) {
        return false;
      }
    }
    if (filterDateTo) {
      // Gaming day ends at 7:59:59.999 of the NEXT day
      const toDate = new Date(filterDateTo);
      toDate.setDate(toDate.getDate() + 1);
      toDate.setHours(7, 59, 59, 999);
      
      const sessionDate = new Date(report.rating.startTime);
      
      if (sessionDate > toDate) {
        return false;
      }
    }
    return true;
  });

  const getDateKey = (date: Date): string => {
    if (periodView === "day") {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    } else if (periodView === "month") {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    } else {
      return String(date.getFullYear()); // YYYY
    }
  };

  const formatDateKey = (dateKey: string): string => {
    if (periodView === "day") {
      return new Date(dateKey).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } else if (periodView === "month") {
      const [year, month] = dateKey.split('-');
      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } else {
      return dateKey;
    }
  };

  const aggregatedData: AggregatedData[] = (() => {
    const aggregationMap = new Map<string, AggregatedData>();

    filteredReports.forEach((report) => {
      const entityKey = aggregationView === "game" ? report.gameType : report.rating.tableName;
      const dateKey = getDateKey(getGamingDayDate(report.rating.startTime));
      const key = `${entityKey}|||${dateKey}`; // Composite key
      
      if (!aggregationMap.has(key)) {
        aggregationMap.set(key, {
          key: entityKey,
          sessions: 0,
          totalPlayingTime: 0,
          totalBets: 0,
          totalAvgBet: 0,
          theoreticalWin: 0,
          actualWinLoss: 0,
          points: 0,
          dateKey: dateKey,
        });
      }

      const agg = aggregationMap.get(key)!;
      agg.sessions += 1;
      agg.totalPlayingTime += report.playingTimeMinutes;
      agg.totalBets += report.totalBets;
      agg.totalAvgBet += report.rating.averageBet;
      agg.theoreticalWin += report.theoreticalWin;
      agg.actualWinLoss += report.rating.winLoss;
      agg.points += report.pointsEarned;
    });

    return Array.from(aggregationMap.values()).sort((a, b) => {
      // Sort by date first (descending), then by key
      if (a.dateKey !== b.dateKey) {
        return b.dateKey.localeCompare(a.dateKey);
      }
      return a.key.localeCompare(b.key);
    });
  })();

  // Calculate summary statistics
  const summary = {
    totalSessions: filteredReports.length,
    totalTheoreticalWin: filteredReports.reduce((sum, r) => sum + r.theoreticalWin, 0),
    totalPoints: filteredReports.reduce((sum, r) => sum + r.pointsEarned, 0),
    totalPlayingTimeMinutes: filteredReports.reduce((sum, r) => sum + r.playingTimeMinutes, 0),
    totalBets: filteredReports.reduce((sum, r) => sum + r.totalBets, 0),
    totalActualWinLoss: filteredReports.reduce((sum, r) => sum + r.rating.winLoss, 0),
  };

  // Get unique values for filters
  const uniqueTables = [...new Set(reports.map((r) => r.rating.tableName))].sort();
  const uniqueGameTypes = [...new Set(reports.map((r) => r.gameType))].sort();

  const clearFilters = () => {
    setFilterTable("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterGameType("");
  };

  const exportToCSV = () => {
    const headers = [
      aggregationView === "game" ? "Game Type" : "Table",
      "Period",
      "Sessions",
      "Playing Time",
      "Total Bets",
      "Average Bet",
      "Theoretical Win",
      "Actual Win/Loss",
      "Points Earned",
    ];

    const rows = aggregatedData.map((data) => [
      data.key,
      formatDateKey(data.dateKey),
      data.sessions,
      `${Math.floor(data.totalPlayingTime / 60)}h ${data.totalPlayingTime % 60}m`,
      data.totalBets,
      Math.round(data.totalAvgBet / data.sessions),
      data.theoreticalWin.toFixed(0),
      data.actualWinLoss,
      data.points,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tables_games_activity_${periodView}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendReport = () => {
    const reportData = new DailyTablesReport(aggregatedData, summary);
    sendEndOfDayReportToManagement(reportData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Tables & Games Activity Report</h2>
          <p className="text-slate-600 mt-1">
            Aggregated performance metrics by table or game type over time
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRollShift(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Roll Shift
          </button>
          <button
            onClick={() => setShowDailyReport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Daily Tables Report
          </button>
          <button
            onClick={handleSendEndOfDayReport}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Send EOD Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-600">Total Sessions</h4>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{summary.totalSessions}</p>
          <p className="text-xs text-slate-500 mt-1">
            {Math.floor(summary.totalPlayingTimeMinutes / 60)}h {summary.totalPlayingTimeMinutes % 60}m played
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-600">Theoretical Win</h4>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(summary.totalTheoreticalWin)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Expected casino revenue
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-600">Actual Win/Loss</h4>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(summary.totalActualWinLoss)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Real casino profit/loss
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-600">Total Points</h4>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {summary.totalPoints.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            From {formatCurrency(summary.totalBets)} bets
          </p>
        </div>
      </div>

      {/* No Data Message */}
      {ratings.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">No Completed Ratings Found</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className="mb-2">To see data in this report, you need to complete player ratings first:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Go to the <span className="font-semibold">Ratings</span> tab</li>
                  <li>Click <span className="font-semibold">Start Rating</span> to begin tracking a player session</li>
                  <li>Click <span className="font-semibold">End Rating</span> when the session is complete</li>
                  <li>Return to this report to view the data</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            Filters
          </h3>
          <button
            onClick={clearFilters}
            className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        </div>

        {/* Gaming Day Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900 font-medium">Gaming Day: 8:00 AM to 8:00 AM</p>
              <p className="text-xs text-blue-700 mt-1">
                Date filters work based on gaming days. For example, selecting Feb 27 will show all sessions from Feb 27 8:00 AM to Feb 28 7:59 AM.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Table</label>
            <select
              value={filterTable}
              onChange={(e) => setFilterTable(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tables</option>
              {uniqueTables.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Game Type</label>
            <select
              value={filterGameType}
              onChange={(e) => setFilterGameType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Games</option>
              {uniqueGameTypes.map((gameType) => (
                <option key={gameType} value={gameType}>
                  {gameType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Aggregated Activity Report */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">
              Activity Summary
            </h3>
            <div className="flex items-center gap-3">
              {/* Period Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-300 p-1">
                <button
                  onClick={() => setPeriodView("day")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    periodView === "day"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Day
                </button>
                <button
                  onClick={() => setPeriodView("month")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    periodView === "month"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setPeriodView("year")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    periodView === "year"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Year
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-300 p-1">
                <button
                  onClick={() => setAggregationView("game")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    aggregationView === "game"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  By Game Type
                </button>
                <button
                  onClick={() => setAggregationView("table")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    aggregationView === "table"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  By Table
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  {aggregationView === "game" ? "Game Type" : "Table"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Period
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">
                  Sessions
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">
                  Playing Time
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                  Total Bets
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                  Avg Bet
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                  Theo. Win
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                  Actual W/L
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {aggregatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No data available for the selected filters.
                  </td>
                </tr>
              ) : (
                aggregatedData.map((data, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{data.key}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{formatDateKey(data.dateKey)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        {data.sessions}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-slate-900">
                      {Math.floor(data.totalPlayingTime / 60)}h {data.totalPlayingTime % 60}m
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-slate-900">
                      {formatCurrency(data.totalBets)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-600">
                      {formatCurrency(Math.round(data.totalAvgBet / data.sessions))}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-emerald-600">
                      {formatCurrency(data.theoreticalWin)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <span className={data.actualWinLoss >= 0 ? "text-emerald-600" : "text-red-600"}>
                        {formatCurrency(data.actualWinLoss)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded">
                        {data.points.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Tables Report Modal */}
      {showDailyReport && (
        <DailyTablesReport
          floats={floats}
          drops={drops}
          onClose={() => setShowDailyReport(false)}
        />
      )}

      {/* Roll Shift Form Modal */}
      {showRollShift && (
        <RollShiftForm
          availableTables={floats}
          onSubmit={async (newFloats) => {
            try {
              for (const float of newFloats) {
                const existing = floats.find(f => f.id === float.id);
                if (!existing) {
                  await api.createFloat(float);
                } else if (JSON.stringify(existing) !== JSON.stringify(float)) {
                  await api.updateFloat(float.id, float);
                }
              }
              setFloats(newFloats);
              setShowRollShift(false);
              alert("Roll shift completed successfully!");
            } catch (error) {
              console.error("Error saving roll shift:", error);
              alert("Failed to save roll shift. Please try again.");
            }
          }}
          onCancel={() => setShowRollShift(false)}
        />
      )}
    </div>
  );
}