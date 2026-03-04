import { useState, useEffect } from "react";
import { FileText, Award, Ticket, TrendingUp, Download, Filter, X, RefreshCw } from "lucide-react";
import { useOutletContext } from "react-router";
import { useApi } from "../hooks/useApi";

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
  numberOfPlayers?: number; // May not exist in old data
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

export function PlayerActivityReport() {
  const [ratings, setRatings] = useState<CompletedRating[]>([]);
  const [reports, setReports] = useState<ActivityReport[]>([]);
  const [aggregationView, setAggregationView] = useState<"game" | "table">("game");
  const { currentUser } = useOutletContext<{ currentUser: { username: string; userType: string } }>();
  const api = useApi();
  
  // Filters
  const [filterPlayer, setFilterPlayer] = useState("");
  const [filterTable, setFilterTable] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterGameType, setFilterGameType] = useState("");

  useEffect(() => {
    loadRatings();
  }, [api.currentProperty]);

  useEffect(() => {
    generateReports();
  }, [ratings]);

  const loadRatings = async () => {
    try {
      const allRatings = await api.getRatings();
      const completed = allRatings.filter((r: any) => r.status === "Completed");
      setRatings(completed);
    } catch (error) {
      console.error("Error loading ratings:", error);
    }
  };

  const parsePlayingTime = (timeStr: string): number => {
    // Parse format like "2h 35m" to minutes
    const hoursMatch = timeStr.match(/(\d+)h/);
    const minutesMatch = timeStr.match(/(\d+)m/);
    
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    
    return hours * 60 + minutes;
  };

  const getHandsPerHour = (table: GameTable, numberOfPlayers?: number): number => {
    // If not specified, default to 3-4 players range
    if (!numberOfPlayers) {
      return table.handsPerHour.threeToFour;
    }
    
    // Map the numberOfPlayers value to the correct range
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
      // Find matching table configuration
      const tableConfig = gameTablesData.find(
        (t) => t.tableNumber === rating.tableName
      );

      if (!tableConfig) {
        // If table not found in config, skip
        return;
      }

      const playingTimeMinutes = parsePlayingTime(rating.playingTime);
      const playingTimeHours = playingTimeMinutes / 60;

      let theoreticalWin = 0;
      let pointsEarned = 0;
      let ticketsEarned = 0;
      let totalBets = 0;
      let handsPerHour = 0;

      // Special handling for Texas Hold'em (time-based)
      if (tableConfig.gameType === "Texas Hold'em") {
        theoreticalWin = 0; // No house advantage
        pointsEarned = Math.floor(playingTimeMinutes / 15);
        ticketsEarned = Math.floor(playingTimeMinutes / 10);
        totalBets = 0;
        handsPerHour = 0;
      } else {
        // Standard bet-based calculation
        handsPerHour = getHandsPerHour(tableConfig, rating.numberOfPlayers);
        
        // Calculate theoretical win: House Advantage × Hands/Hour × Average Bet × Hours
        theoreticalWin = 
          tableConfig.houseAdvantage * 
          handsPerHour * 
          rating.averageBet * 
          playingTimeHours;

        // Calculate total bets
        totalBets = rating.averageBet * handsPerHour * playingTimeHours;

        // Calculate points: 1 point per 10,000 FCFA bet
        pointsEarned = Math.floor(totalBets / 10000);

        // Calculate tickets: 1 ticket per 100,000 FCFA bet
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

  const filteredReports = reports.filter((report) => {
    if (filterPlayer && !report.rating.playerName.toLowerCase().includes(filterPlayer.toLowerCase())) {
      return false;
    }
    if (filterTable && report.rating.tableName !== filterTable) {
      return false;
    }
    if (filterGameType && report.gameType !== filterGameType) {
      return false;
    }
    if (filterDateFrom) {
      const reportDate = new Date(report.rating.startTime);
      const fromDate = new Date(filterDateFrom);
      if (reportDate < fromDate) {
        return false;
      }
    }
    if (filterDateTo) {
      const reportDate = new Date(report.rating.startTime);
      const toDate = new Date(filterDateTo);
      toDate.setHours(23, 59, 59, 999);
      if (reportDate > toDate) {
        return false;
      }
    }
    return true;
  });

  // Calculate summary statistics
  const summary = {
    totalSessions: filteredReports.length,
    totalTheoreticalWin: filteredReports.reduce((sum, r) => sum + r.theoreticalWin, 0),
    totalPoints: filteredReports.reduce((sum, r) => sum + r.pointsEarned, 0),
    totalTickets: filteredReports.reduce((sum, r) => sum + r.ticketsEarned, 0),
    totalPlayingTimeMinutes: filteredReports.reduce((sum, r) => sum + r.playingTimeMinutes, 0),
    totalBets: filteredReports.reduce((sum, r) => sum + r.totalBets, 0),
    totalActualWinLoss: filteredReports.reduce((sum, r) => sum + r.rating.winLoss, 0),
  };

  // Get unique values for filters
  const uniquePlayers = [...new Set(reports.map((r) => r.rating.playerName))].sort();
  const uniqueTables = [...new Set(reports.map((r) => r.rating.tableName))].sort();
  const uniqueGameTypes = [...new Set(reports.map((r) => r.gameType))].sort();

  const clearFilters = () => {
    setFilterPlayer("");
    setFilterTable("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterGameType("");
  };

  const exportToCSV = () => {
    const headers = [
      "Player",
      "Table",
      "Game Type",
      "Start Time",
      "Playing Time",
      "Average Bet",
      "Total Bets",
      "Theoretical Win",
      "Actual Win/Loss",
      "Points Earned",
      "Tickets Earned",
    ];

    const rows = filteredReports.map((report) => [
      report.rating.playerName,
      report.rating.tableName,
      report.gameType,
      new Date(report.rating.startTime).toLocaleString(),
      report.rating.playingTime,
      report.rating.averageBet,
      report.totalBets,
      report.theoreticalWin.toFixed(0),
      report.rating.winLoss,
      report.pointsEarned,
      report.ticketsEarned,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `player_activity_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Player Activity Report</h2>
          <p className="text-slate-600 mt-1">
            Comprehensive analytics with theoretical wins, points, and tickets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadRatings}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredReports.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-600">Total Sessions</h4>
            <FileText className="w-5 h-5 text-blue-500" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Player</label>
            <select
              value={filterPlayer}
              onChange={(e) => setFilterPlayer(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Players</option>
              {uniquePlayers.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>

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

      {/* Aggregated Activity Report - Hidden for Host users */}
      {currentUser?.userType !== "Host" && (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">
            Activity Summary
          </h3>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  {aggregationView === "game" ? "Game Type" : "Table"}
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
              {(() => {
                const aggregationMap = new Map<string, {
                  sessions: number;
                  totalPlayingTime: number;
                  totalBets: number;
                  totalAvgBet: number;
                  theoreticalWin: number;
                  actualWinLoss: number;
                  points: number;
                }>();

                filteredReports.forEach((report) => {
                  const key = aggregationView === "game" ? report.gameType : report.rating.tableName;
                  
                  if (!aggregationMap.has(key)) {
                    aggregationMap.set(key, {
                      sessions: 0,
                      totalPlayingTime: 0,
                      totalBets: 0,
                      totalAvgBet: 0,
                      theoreticalWin: 0,
                      actualWinLoss: 0,
                      points: 0,
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

                const sortedEntries = Array.from(aggregationMap.entries()).sort((a, b) => 
                  a[0].localeCompare(b[0])
                );

                if (sortedEntries.length === 0) {
                  return (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                        No data available for the selected filters.
                      </td>
                    </tr>
                  );
                }

                return sortedEntries.map(([key, data]) => (
                  <tr key={key} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{key}</div>
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
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Activity Report Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b">
          <h3 className="text-xl font-bold text-slate-900">
            Player Sessions ({filteredReports.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Player
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Table
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Game
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Date/Time
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">
                  Playing Time
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                  Avg Bet
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                  Total Bets
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
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    No player activity found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.rating.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{report.rating.playerName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-sm text-slate-900">
                        {report.rating.tableName}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm text-slate-600">{report.gameType}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {new Date(report.rating.startTime).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(report.rating.startTime).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="text-sm text-slate-900">{report.rating.playingTime}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-900">
                      {formatCurrency(report.rating.averageBet)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-900">
                      {formatCurrency(report.totalBets)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-emerald-600">
                      {formatCurrency(report.theoreticalWin)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <span
                        className={
                          report.rating.winLoss >= 0 ? "text-emerald-600" : "text-red-600"
                        }
                      >
                        {formatCurrency(report.rating.winLoss)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded">
                        {report.pointsEarned.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}