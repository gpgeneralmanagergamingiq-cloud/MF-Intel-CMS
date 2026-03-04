import { useState, useEffect } from "react";
import { Calculator, TrendingUp, Award, Ticket } from "lucide-react";

interface GameTable {
  tableNumber: string;
  gameType: string;
  houseAdvantage: number; // as decimal (e.g., 0.025 for 2.5%)
  handsPerHour: {
    oneToTwo: number;
    threeToFour: number;
    moreThanFive: number;
  };
  pointsRule: string;
  ticketsRule: string;
}

const gameTablesData: GameTable[] = [
  {
    tableNumber: "UTH01",
    gameType: "Ultimate Texas Holdem",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "UTH02",
    gameType: "Ultimate Texas Holdem",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "UTH03",
    gameType: "Ultimate Texas Holdem",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "NIUNIU01",
    gameType: "NIUNIU",
    houseAdvantage: 0.05,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "NIUNIU02",
    gameType: "NIUNIU",
    houseAdvantage: 0.05,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "NIUNIU03",
    gameType: "NIUNIU",
    houseAdvantage: 0.05,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "BAC01",
    gameType: "Baccarat",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 60, threeToFour: 50, moreThanFive: 40 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "BAC02",
    gameType: "Baccarat",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 60, threeToFour: 50, moreThanFive: 40 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "BAC03",
    gameType: "Baccarat",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 60, threeToFour: 50, moreThanFive: 40 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "BAC04",
    gameType: "Baccarat",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 60, threeToFour: 50, moreThanFive: 40 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "BJ01",
    gameType: "BlackJack",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 120, threeToFour: 90, moreThanFive: 70 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "BJ02",
    gameType: "BlackJack",
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 120, threeToFour: 90, moreThanFive: 70 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "PK01",
    gameType: "Poker",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "PK02",
    gameType: "Poker",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "PK03",
    gameType: "Poker",
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "TX01",
    gameType: "Texas Hold'em",
    houseAdvantage: 0.0,
    handsPerHour: { oneToTwo: 0, threeToFour: 0, moreThanFive: 0 },
    pointsRule: "1 point for 15 minutes of play",
    ticketsRule: "1 ticket every 10 Minutes of Play",
  },
  {
    tableNumber: "TX02",
    gameType: "Texas Hold'em",
    houseAdvantage: 0.0,
    handsPerHour: { oneToTwo: 0, threeToFour: 0, moreThanFive: 0 },
    pointsRule: "1 point for 15 minutes of play",
    ticketsRule: "1 ticket every 10 Minutes of Play",
  },
  {
    tableNumber: "AR01",
    gameType: "Roulette",
    houseAdvantage: 0.027,
    handsPerHour: { oneToTwo: 50, threeToFour: 40, moreThanFive: 30 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "AR02",
    gameType: "Roulette",
    houseAdvantage: 0.027,
    handsPerHour: { oneToTwo: 50, threeToFour: 40, moreThanFive: 30 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
  {
    tableNumber: "AR03",
    gameType: "Roulette",
    houseAdvantage: 0.027,
    handsPerHour: { oneToTwo: 50, threeToFour: 40, moreThanFive: 30 },
    pointsRule: "1 point for every 10000 Bet",
    ticketsRule: "1 ticket for 100000 bets",
  },
];

export function GameStatistics() {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [numberOfPlayers, setNumberOfPlayers] = useState<string>("1-2");
  const [averageBet, setAverageBet] = useState<string>("10000");
  const [numberOfDays, setNumberOfDays] = useState<string>("30");
  const [hoursPerDay, setHoursPerDay] = useState<string>("8");
  const [playTimeMinutes, setPlayTimeMinutes] = useState<string>("60");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " FCFA";
  };

  const calculateResults = () => {
    if (!selectedTable) return null;

    const table = gameTablesData.find((t) => t.tableNumber === selectedTable);
    if (!table) return null;

    const bet = parseFloat(averageBet) || 0;
    const days = parseFloat(numberOfDays) || 0;
    const hoursDaily = parseFloat(hoursPerDay) || 0;
    const playTime = parseFloat(playTimeMinutes) || 0;

    // Special handling for Texas Hold'em (time-based, not bet-based)
    if (table.gameType === "Texas Hold'em") {
      const pointsPerSession = Math.floor(playTime / 15) * 1;
      const ticketsPerSession = Math.floor(playTime / 10);

      return {
        table,
        handsPerHour: 0,
        theoreticalWinPerHour: 0,
        theoreticalWinTotal: 0,
        theoreticalWinPerDay: 0,
        points: pointsPerSession,
        tickets: ticketsPerSession,
        isTimeBased: true,
      };
    }

    // Get hands per hour based on player count
    let handsPerHour = 0;
    if (numberOfPlayers === "1-2") {
      handsPerHour = table.handsPerHour.oneToTwo;
    } else if (numberOfPlayers === "3-4") {
      handsPerHour = table.handsPerHour.threeToFour;
    } else {
      handsPerHour = table.handsPerHour.moreThanFive;
    }

    // Calculate theoretical win
    // Formula: House Advantage * Hands/Hour * Average Bet
    const theoreticalWinPerHour = table.houseAdvantage * handsPerHour * bet;
    
    // Total theoretical win over the period
    const totalHours = days * hoursDaily;
    const theoreticalWinTotal = theoreticalWinPerHour * totalHours;
    
    // Theoretical win per day
    const theoreticalWinPerDay = theoreticalWinTotal / days;

    // Calculate total bets
    const totalBets = bet * handsPerHour * totalHours;

    // Calculate points: 1 point for every 10,000 FCFA bet
    const points = Math.floor(totalBets / 10000);

    // Calculate tickets: 1 ticket for every 100,000 FCFA bet
    const tickets = Math.floor(totalBets / 100000);

    return {
      table,
      handsPerHour,
      theoreticalWinPerHour,
      theoreticalWinTotal,
      theoreticalWinPerDay,
      points,
      tickets,
      isTimeBased: false,
    };
  };

  const results = calculateResults();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Game Statistics & Analytics</h2>
          <p className="text-slate-600 mt-1">
            Calculate theoretical wins, player points, and tombola tickets
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Calculation Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Table Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Table *
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Table --</option>
              {gameTablesData.map((table) => (
                <option key={table.tableNumber} value={table.tableNumber}>
                  {table.tableNumber} - {table.gameType}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Players */}
          {results?.table.gameType !== "Texas Hold'em" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Players
              </label>
              <select
                value={numberOfPlayers}
                onChange={(e) => setNumberOfPlayers(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1-2">1 to 2 Players</option>
                <option value="3-4">3 to 4 Players</option>
                <option value="5+">More than 5 Players</option>
              </select>
            </div>
          )}

          {/* Average Bet */}
          {results?.table.gameType !== "Texas Hold'em" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Average Bet (FCFA)
              </label>
              <input
                type="number"
                value={averageBet}
                onChange={(e) => setAverageBet(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10000"
              />
            </div>
          )}

          {/* Play Time for Texas Hold'em */}
          {results?.table.gameType === "Texas Hold'em" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Play Time (Minutes)
              </label>
              <input
                type="number"
                value={playTimeMinutes}
                onChange={(e) => setPlayTimeMinutes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="60"
              />
            </div>
          )}

          {/* Hours per Day */}
          {results?.table.gameType !== "Texas Hold'em" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hours per Day
              </label>
              <input
                type="number"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="8"
              />
            </div>
          )}

          {/* Number of Days */}
          {results?.table.gameType !== "Texas Hold'em" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Days
              </label>
              <input
                type="number"
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Table Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {results.table.tableNumber} - {results.table.gameType}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600">House Advantage</p>
                <p className="text-2xl font-bold text-blue-900">
                  {(results.table.houseAdvantage * 100).toFixed(2)}%
                </p>
              </div>
              {!results.isTimeBased && (
                <div>
                  <p className="text-sm text-slate-600">Hands per Hour</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {results.handsPerHour}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-600">Game Type</p>
                <p className="text-lg font-semibold text-blue-900">
                  {results.table.gameType}
                </p>
              </div>
            </div>
          </div>

          {/* Theoretical Win Cards */}
          {!results.isTimeBased && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Per Hour */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-600">
                    Theoretical Win / Hour
                  </h4>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(results.theoreticalWinPerHour)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Based on {results.handsPerHour} hands/hour
                </p>
              </div>

              {/* Per Day */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-600">
                    Theoretical Win / Day
                  </h4>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(results.theoreticalWinPerDay)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Based on {hoursPerDay} hours/day
                </p>
              </div>

              {/* Total */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-600">
                    Total Theoretical Win
                  </h4>
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(results.theoreticalWinTotal)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Over {numberOfDays} days
                </p>
              </div>
            </div>
          )}

          {/* Player Rewards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Points */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-600">
                  Player Points
                </h4>
                <Award className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {results.points.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {results.table.pointsRule}
              </p>
            </div>

            {/* Tombola Tickets */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-600">
                  Tombola Tickets
                </h4>
                <Ticket className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {results.tickets.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {results.table.ticketsRule}
              </p>
            </div>
          </div>

          {/* Calculation Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <h4 className="text-sm font-semibold text-slate-700 uppercase mb-3">
              Calculation Details
            </h4>
            {!results.isTimeBased ? (
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium">Formula:</span> Theoretical Win = House Advantage × Hands/Hour × Average Bet
                </p>
                <p>
                  <span className="font-medium">Calculation:</span>{" "}
                  {(results.table.houseAdvantage * 100).toFixed(2)}% × {results.handsPerHour} hands × {formatCurrency(parseFloat(averageBet))} ={" "}
                  {formatCurrency(results.theoreticalWinPerHour)} per hour
                </p>
                <p>
                  <span className="font-medium">Total Hours:</span> {numberOfDays} days × {hoursPerDay} hours/day ={" "}
                  {parseFloat(numberOfDays) * parseFloat(hoursPerDay)} hours
                </p>
                <p>
                  <span className="font-medium">Total Bets:</span>{" "}
                  {formatCurrency(parseFloat(averageBet) * results.handsPerHour * parseFloat(numberOfDays) * parseFloat(hoursPerDay))}
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium">Play Time:</span> {playTimeMinutes} minutes
                </p>
                <p>
                  <span className="font-medium">Points Calculation:</span>{" "}
                  {results.table.pointsRule} = {results.points} points
                </p>
                <p>
                  <span className="font-medium">Tickets Calculation:</span>{" "}
                  {results.table.ticketsRule} = {results.tickets} tickets
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Tables Overview */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b">
          <h3 className="text-xl font-bold text-slate-900">All Tables Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Table
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Game Type
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                  House Edge
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                  1-2 Players
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                  3-4 Players
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                  5+ Players
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                  Points Rule
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {gameTablesData.map((table) => (
                <tr
                  key={table.tableNumber}
                  className={`hover:bg-slate-50 cursor-pointer ${
                    selectedTable === table.tableNumber ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedTable(table.tableNumber)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono font-medium text-slate-900">
                      {table.tableNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm text-slate-900">{table.gameType}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      {(table.houseAdvantage * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-slate-600">
                    {table.handsPerHour.oneToTwo > 0 ? `${table.handsPerHour.oneToTwo} h/h` : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-slate-600">
                    {table.handsPerHour.threeToFour > 0 ? `${table.handsPerHour.threeToFour} h/h` : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-slate-600">
                    {table.handsPerHour.moreThanFive > 0 ? `${table.handsPerHour.moreThanFive} h/h` : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {table.pointsRule}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}