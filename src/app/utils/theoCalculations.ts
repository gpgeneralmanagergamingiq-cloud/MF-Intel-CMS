// Theo (Theoretical Win) Calculation Utilities

export interface TheoPeriod {
  id: string;
  averageBet: number;
  startTime: string; // ISO timestamp when this period started
  endTime?: string; // ISO timestamp when this period ended (when avg bet changed or rating ended)
  playingTimeMs: number; // Actual playing time in milliseconds (excluding breaks)
  numberOfPlayers: number;
  houseAdvantage: number;
  handsPerHour: number;
  theoreticalWin: number; // Calculated Theo for this period
}

// Game configurations (house advantage and hands per hour based on player count)
export const GAME_CONFIGURATIONS: {
  [key: string]: {
    houseAdvantage: number;
    handsPerHour: { oneToTwo: number; threeToFour: number; moreThanFive: number };
  };
} = {
  "Ultimate Texas Holdem": {
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
  },
  "NIUNIU": {
    houseAdvantage: 0.05,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
  },
  "Baccarat": {
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 60, threeToFour: 50, moreThanFive: 40 },
  },
  "BlackJack": {
    houseAdvantage: 0.012,
    handsPerHour: { oneToTwo: 120, threeToFour: 90, moreThanFive: 70 },
  },
  "Poker": {
    houseAdvantage: 0.025,
    handsPerHour: { oneToTwo: 35, threeToFour: 30, moreThanFive: 25 },
  },
  "Texas Hold'em": {
    houseAdvantage: 0.0,
    handsPerHour: { oneToTwo: 0, threeToFour: 0, moreThanFive: 0 },
  },
  "Roulette": {
    houseAdvantage: 0.027,
    handsPerHour: { oneToTwo: 50, threeToFour: 40, moreThanFive: 30 },
  },
};

// Get hands per hour based on number of players at table
export function getHandsPerHour(
  gameType: string,
  numberOfPlayers: number
): number {
  const gameConfig = GAME_CONFIGURATIONS[gameType];
  if (!gameConfig) {
    return 30; // Default fallback
  }

  if (numberOfPlayers <= 2) {
    return gameConfig.handsPerHour.oneToTwo;
  } else if (numberOfPlayers <= 4) {
    return gameConfig.handsPerHour.threeToFour;
  } else {
    return gameConfig.handsPerHour.moreThanFive;
  }
}

// Get house advantage for a game type
export function getHouseAdvantage(gameType: string): number {
  const gameConfig = GAME_CONFIGURATIONS[gameType];
  return gameConfig?.houseAdvantage || 0.025; // Default fallback
}

// Get game type from table name
export function getGameTypeFromTable(tableName: string): string {
  const savedTables = localStorage.getItem("casino_tables");
  if (savedTables) {
    const tables = JSON.parse(savedTables);
    const tableInfo = tables.find((t: any) => t.tableNumber === tableName);
    if (tableInfo) {
      return tableInfo.gameType;
    }
  }
  return "Baccarat"; // Default fallback
}

// Calculate Theo for a specific period
// Formula: Theo = Average Bet × Decisions × House Edge
// Where: Decisions = (Playing Time in Hours) × Hands Per Hour
export function calculateTheoPeriod(
  averageBet: number,
  playingTimeMs: number,
  numberOfPlayers: number,
  gameType: string
): number {
  const playingTimeHours = playingTimeMs / (1000 * 60 * 60);
  const handsPerHour = getHandsPerHour(gameType, numberOfPlayers);
  const houseAdvantage = getHouseAdvantage(gameType);

  const numberOfDecisions = playingTimeHours * handsPerHour;
  const theo = averageBet * numberOfDecisions * houseAdvantage;

  return Math.round(theo); // Round to nearest whole number
}

// Create a new Theo period
export function createTheoPeriod(
  averageBet: number,
  startTime: string,
  numberOfPlayers: number,
  tableName: string
): Omit<TheoPeriod, "playingTimeMs" | "theoreticalWin" | "endTime"> {
  const gameType = getGameTypeFromTable(tableName);
  const handsPerHour = getHandsPerHour(gameType, numberOfPlayers);
  const houseAdvantage = getHouseAdvantage(gameType);

  return {
    id: `theo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    averageBet,
    startTime,
    numberOfPlayers,
    houseAdvantage,
    handsPerHour,
  };
}

// Complete a Theo period by calculating the Theo
export function completeTheoPeriod(
  period: Omit<TheoPeriod, "playingTimeMs" | "theoreticalWin" | "endTime">,
  endTime: string,
  totalBreakTimeMs: number,
  ratingStartTime: string,
  currentBreakTimeMs: number = 0
): TheoPeriod {
  const periodStartMs = new Date(period.startTime).getTime();
  const periodEndMs = new Date(endTime).getTime();
  const ratingStartMs = new Date(ratingStartTime).getTime();

  // Calculate total elapsed time for this period
  const totalPeriodTime = periodEndMs - periodStartMs;

  // Calculate break time that occurred during this period
  // For simplicity, we'll proportionally distribute the break time
  const totalRatingTime = periodEndMs - ratingStartMs;
  const breakTimeForPeriod = totalRatingTime > 0
    ? (totalPeriodTime / totalRatingTime) * (totalBreakTimeMs + currentBreakTimeMs)
    : 0;

  const playingTimeMs = Math.max(0, totalPeriodTime - breakTimeForPeriod);

  // Calculate Theo using stored values from period (hands per hour and house advantage)
  const playingTimeHours = playingTimeMs / (1000 * 60 * 60);
  const numberOfDecisions = playingTimeHours * period.handsPerHour;
  const theoreticalWin = Math.round(
    period.averageBet * numberOfDecisions * period.houseAdvantage
  );

  return {
    ...period,
    endTime,
    playingTimeMs,
    theoreticalWin,
  };
}

// Calculate total Theo from all periods
export function calculateTotalTheo(periods: TheoPeriod[]): number {
  return periods.reduce((sum, period) => sum + period.theoreticalWin, 0);
}

// Format Theo value for display
export function formatTheo(theo: number, currency: string): string {
  const currencySymbol = getCurrencySymbol(currency);
  return `${currencySymbol}${theo.toLocaleString()}`;
}

function getCurrencySymbol(currency: string): string {
  switch (currency) {
    case "FCFA":
      return "CFA ";
    case "PHP":
      return "₱";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "CNY":
    case "JPY":
      return "¥";
    case "KRW":
      return "₩";
    default:
      return "$";
  }
}