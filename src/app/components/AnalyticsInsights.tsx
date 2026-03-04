import { useState, useEffect } from "react";
import { TrendingUp, Clock, Award, Users, DollarSign, Trophy, Zap } from "lucide-react";
import { useApi } from "../hooks/useApi";

interface CompletedRating {
  id: string;
  playerId: string;
  playerName: string;
  tableName: string;
  gameType?: string;
  seatNumber?: number;
  buyInType: "Cash" | "Chips";
  buyInAmount: number;
  cashAmount?: number;
  averageBet: number;
  cashOutAmount: number;
  winLoss: number;
  currency: string;
  startTime: string;
  endTime: string;
  totalTime: string;
  playingTime: string;
  status: "Completed";
  numberOfPlayers?: number;
  jackpotImpulses?: any[];
}

interface JackpotWinner {
  id: string;
  playerId: string;
  playerName: string;
  jackpotName: string;
  amount: number;
  timestamp: string;
  jackpotType: string;
}

interface AnalyticsData {
  mostPopularTable: { name: string; sessions: number };
  mostPopularGame: { name: string; sessions: number };
  mostActivePlayer: { name: string; sessions: number };
  tableWithMostHours: { name: string; hours: number };
  playerWithMostHours: { name: string; hours: number };
  mostUsedSeat: { number: number; uses: number };
  mostUsedSeatByGame: { game: string; seat: number; uses: number }[];
  playerWithMostJackpotBets: { name: string; impulses: number };
  mostJackpotWinners: { name: string; wins: number };
  longestPlaySession: { playerName: string; tableName: string; hours: number; date: string };
}

const gameTablesMapping: { [key: string]: string } = {
  "Uth 01": "Ultimate Texas Holdem",
  "Uth 02": "Ultimate Texas Holdem",
  "Uth 03": "Ultimate Texas Holdem",
  "Niu Niu 1": "NIUNIU",
  "Niu Niu 2": "NIUNIU",
  "Niu Niu 3": "NIUNIU",
  "Bac 1": "Baccarat",
  "Bac 2": "Baccarat",
  "Bac 3": "Baccarat",
  "Bac 01": "Baccarat",
  "BJ 01": "BlackJack",
  "BJ 02": "BlackJack",
  "Pk 01": "Poker",
  "Pk 02": "Poker",
  "Texas 1": "Texas Hold'em",
  "Texas 2": "Texas Hold'em",
  "Ar 01": "Roulette",
  "Ar 02": "Roulette",
  "Ar 03": "Roulette",
};

export function AnalyticsInsights() {
  const [ratings, setRatings] = useState<CompletedRating[]>([]);
  const [jackpotWinners, setJackpotWinners] = useState<JackpotWinner[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const api = useApi();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (ratings.length > 0) {
      calculateAnalytics();
    }
  }, [ratings, jackpotWinners]);

  const loadData = () => {
    // Load ratings
    const savedRatings = localStorage.getItem("casino_ratings");
    if (savedRatings) {
      const allRatings = JSON.parse(savedRatings);
      const completed = allRatings.filter((r: any) => r.status === "Completed");
      setRatings(completed);
    }

    // Load jackpot winners
    const savedWinners = localStorage.getItem("casino_jackpot_winners");
    if (savedWinners) {
      setJackpotWinners(JSON.parse(savedWinners));
    }
  };

  const parsePlayingTime = (timeStr: string): number => {
    const hoursMatch = timeStr.match(/(\d+)h/);
    const minutesMatch = timeStr.match(/(\d+)m/);
    
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    
    return hours + minutes / 60;
  };

  const calculateAnalytics = () => {
    // 1. Most Popular Table
    const tableCounts = new Map<string, number>();
    ratings.forEach(r => {
      tableCounts.set(r.tableName, (tableCounts.get(r.tableName) || 0) + 1);
    });
    const mostPopularTable = Array.from(tableCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];

    // 2. Most Popular Game
    const gameCounts = new Map<string, number>();
    ratings.forEach(r => {
      const gameType = r.gameType || gameTablesMapping[r.tableName] || "Unknown";
      gameCounts.set(gameType, (gameCounts.get(gameType) || 0) + 1);
    });
    const mostPopularGame = Array.from(gameCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];

    // 3. Most Active Player (by session count)
    const playerCounts = new Map<string, number>();
    ratings.forEach(r => {
      playerCounts.set(r.playerName, (playerCounts.get(r.playerName) || 0) + 1);
    });
    const mostActivePlayer = Array.from(playerCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];

    // 4. Table with Most Hours
    const tableHours = new Map<string, number>();
    ratings.forEach(r => {
      const hours = parsePlayingTime(r.playingTime);
      tableHours.set(r.tableName, (tableHours.get(r.tableName) || 0) + hours);
    });
    const tableWithMostHours = Array.from(tableHours.entries())
      .sort((a, b) => b[1] - a[1])[0];

    // 5. Player with Most Hours
    const playerHours = new Map<string, number>();
    ratings.forEach(r => {
      const hours = parsePlayingTime(r.playingTime);
      playerHours.set(r.playerName, (playerHours.get(r.playerName) || 0) + hours);
    });
    const playerWithMostHours = Array.from(playerHours.entries())
      .sort((a, b) => b[1] - a[1])[0];

    // 6. Most Used Seat
    const seatCounts = new Map<number, number>();
    ratings.forEach(r => {
      if (r.seatNumber) {
        seatCounts.set(r.seatNumber, (seatCounts.get(r.seatNumber) || 0) + 1);
      }
    });
    const mostUsedSeat = Array.from(seatCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];

    // 7. Most Used Seat by Game
    const seatByGame = new Map<string, Map<number, number>>();
    ratings.forEach(r => {
      if (r.seatNumber) {
        const gameType = r.gameType || gameTablesMapping[r.tableName] || "Unknown";
        if (!seatByGame.has(gameType)) {
          seatByGame.set(gameType, new Map());
        }
        const gameSeats = seatByGame.get(gameType)!;
        gameSeats.set(r.seatNumber, (gameSeats.get(r.seatNumber) || 0) + 1);
      }
    });
    const mostUsedSeatByGame = Array.from(seatByGame.entries())
      .map(([game, seats]) => {
        const topSeat = Array.from(seats.entries()).sort((a, b) => b[1] - a[1])[0];
        return topSeat ? { game, seat: topSeat[0], uses: topSeat[1] } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b!.uses - a!.uses)
      .slice(0, 5) as { game: string; seat: number; uses: number }[];

    // 8. Player with Most Jackpot Bets (impulses)
    const playerImpulses = new Map<string, number>();
    ratings.forEach(r => {
      if (r.jackpotImpulses && r.jackpotImpulses.length > 0) {
        playerImpulses.set(
          r.playerName,
          (playerImpulses.get(r.playerName) || 0) + r.jackpotImpulses.length
        );
      }
    });
    const playerWithMostJackpotBets = Array.from(playerImpulses.entries())
      .sort((a, b) => b[1] - a[1])[0];

    // 9. Most Jackpot Winners
    const winnerCounts = new Map<string, number>();
    jackpotWinners.forEach(w => {
      winnerCounts.set(w.playerName, (winnerCounts.get(w.playerName) || 0) + 1);
    });
    const mostJackpotWinners = Array.from(winnerCounts.entries())
      .sort((a, b) => b[1] - a[1])[0];

    // 10. Longest Play Session
    let longestSession = ratings[0];
    let maxHours = 0;
    ratings.forEach(r => {
      const hours = parsePlayingTime(r.playingTime);
      if (hours > maxHours) {
        maxHours = hours;
        longestSession = r;
      }
    });

    setAnalytics({
      mostPopularTable: mostPopularTable ? { name: mostPopularTable[0], sessions: mostPopularTable[1] } : { name: "N/A", sessions: 0 },
      mostPopularGame: mostPopularGame ? { name: mostPopularGame[0], sessions: mostPopularGame[1] } : { name: "N/A", sessions: 0 },
      mostActivePlayer: mostActivePlayer ? { name: mostActivePlayer[0], sessions: mostActivePlayer[1] } : { name: "N/A", sessions: 0 },
      tableWithMostHours: tableWithMostHours ? { name: tableWithMostHours[0], hours: tableWithMostHours[1] } : { name: "N/A", hours: 0 },
      playerWithMostHours: playerWithMostHours ? { name: playerWithMostHours[0], hours: playerWithMostHours[1] } : { name: "N/A", hours: 0 },
      mostUsedSeat: mostUsedSeat ? { number: mostUsedSeat[0], uses: mostUsedSeat[1] } : { number: 0, uses: 0 },
      mostUsedSeatByGame,
      playerWithMostJackpotBets: playerWithMostJackpotBets ? { name: playerWithMostJackpotBets[0], impulses: playerWithMostJackpotBets[1] } : { name: "N/A", impulses: 0 },
      mostJackpotWinners: mostJackpotWinners ? { name: mostJackpotWinners[0], wins: mostJackpotWinners[1] } : { name: "N/A", wins: 0 },
      longestPlaySession: longestSession ? {
        playerName: longestSession.playerName,
        tableName: longestSession.tableName,
        hours: maxHours,
        date: new Date(longestSession.startTime).toLocaleDateString()
      } : { playerName: "N/A", tableName: "N/A", hours: 0, date: "N/A" }
    });
  };

  if (!analytics || ratings.length === 0) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-yellow-800">No Data Available</h3>
            <p className="mt-2 text-sm text-yellow-700">
              Complete some player rating sessions to see analytics insights.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Analytics Insights</h2>
        <p className="text-slate-600 mt-1">
          Comprehensive performance metrics and trends across all operations
        </p>
      </div>

      {/* Top Performers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Most Popular Table */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-blue-900 uppercase tracking-wide">
              Most Popular Table
            </h4>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-900 mb-1">{analytics.mostPopularTable.name}</p>
          <p className="text-sm text-blue-700">
            {analytics.mostPopularTable.sessions} sessions played
          </p>
        </div>

        {/* Most Popular Game */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow-md p-6 border border-emerald-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-emerald-900 uppercase tracking-wide">
              Most Popular Game
            </h4>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-900 mb-1">{analytics.mostPopularGame.name}</p>
          <p className="text-sm text-emerald-700">
            {analytics.mostPopularGame.sessions} sessions played
          </p>
        </div>

        {/* Most Active Player */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-purple-900 uppercase tracking-wide">
              Most Active Player
            </h4>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-900 mb-1">{analytics.mostActivePlayer.name}</p>
          <p className="text-sm text-purple-700">
            {analytics.mostActivePlayer.sessions} sessions completed
          </p>
        </div>

        {/* Table with Most Hours */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-md p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-amber-900 uppercase tracking-wide">
              Table - Most Hours
            </h4>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-900 mb-1">{analytics.tableWithMostHours.name}</p>
          <p className="text-sm text-amber-700">
            {analytics.tableWithMostHours.hours.toFixed(1)} hours of play
          </p>
        </div>

        {/* Player with Most Hours */}
        <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg shadow-md p-6 border border-rose-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-rose-900 uppercase tracking-wide">
              Player - Most Hours
            </h4>
            <Clock className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-3xl font-bold text-rose-900 mb-1">{analytics.playerWithMostHours.name}</p>
          <p className="text-sm text-rose-700">
            {analytics.playerWithMostHours.hours.toFixed(1)} hours of play
          </p>
        </div>

        {/* Most Used Seat */}
        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg shadow-md p-6 border border-cyan-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-cyan-900 uppercase tracking-wide">
              Most Used Seat
            </h4>
            <DollarSign className="w-5 h-5 text-cyan-600" />
          </div>
          <p className="text-3xl font-bold text-cyan-900 mb-1">Seat #{analytics.mostUsedSeat.number}</p>
          <p className="text-sm text-cyan-700">
            Used {analytics.mostUsedSeat.uses} times
          </p>
        </div>

        {/* Player with Most Jackpot Bets */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-yellow-900 uppercase tracking-wide">
              Most Jackpot Bets
            </h4>
            <Zap className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-900 mb-1">{analytics.playerWithMostJackpotBets.name}</p>
          <p className="text-sm text-yellow-700">
            {analytics.playerWithMostJackpotBets.impulses} jackpot impulses
          </p>
        </div>

        {/* Most Jackpot Winners */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-md p-6 border border-indigo-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-indigo-900 uppercase tracking-wide">
              Most Jackpot Wins
            </h4>
            <Trophy className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-900 mb-1">{analytics.mostJackpotWinners.name}</p>
          <p className="text-sm text-indigo-700">
            {analytics.mostJackpotWinners.wins} jackpot wins
          </p>
        </div>

        {/* Longest Play Session */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg shadow-md p-6 border border-teal-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-teal-900 uppercase tracking-wide">
              Longest Session
            </h4>
            <Clock className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-teal-900 mb-1">{analytics.longestPlaySession.hours.toFixed(1)} hours</p>
          <p className="text-sm text-teal-700">
            {analytics.longestPlaySession.playerName} at {analytics.longestPlaySession.tableName}
          </p>
          <p className="text-xs text-teal-600 mt-1">
            on {analytics.longestPlaySession.date}
          </p>
        </div>
      </div>

      {/* Most Used Seats by Game Type */}
      {analytics.mostUsedSeatByGame.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b">
            <h3 className="text-xl font-bold text-slate-900">Most Used Seats by Game Type</h3>
            <p className="text-sm text-slate-600 mt-1">Popular seat preferences for each game</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.mostUsedSeatByGame.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-900">{item.game}</span>
                    <span className="text-xs text-slate-500">{item.uses} uses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">#{item.seat}</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Most popular seat
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
