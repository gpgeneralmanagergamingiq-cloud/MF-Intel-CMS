/**
 * Jackpot Contribution Utilities
 * Calculates and applies jackpot contributions based on player ratings
 */

interface JackpotLevel {
  name: string;
  color: string;
  minAmount: number;
  maxAmount: number;
  contributionPercentage: number;
}

interface Jackpot {
  id: string;
  name: string;
  type: "progressive-theo" | "progressive-fixed" | "fixed" | "random";
  status: "active" | "inactive";
  gameSelection: "all-tables" | "specific-tables";
  selectedTables: string[];
  levels: JackpotLevel[];
  conditions: any[];
  currentAmounts: { [levelName: string]: number };
  seedAmounts: { [levelName: string]: number };
  lastWonDate?: string;
  lastWinner?: string;
  totalWon: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface RatingUpdate {
  tableName: string;
  theoreticalWin?: number; // For progressive-theo
  averageBet?: number; // For progressive-fixed
  actualWinLoss?: number;
  timePlayed?: number; // in minutes
  totalBets?: number;
}

/**
 * Calculate jackpot contributions based on a rating update
 */
export function calculateJackpotContributions(
  jackpots: Jackpot[],
  ratingUpdate: RatingUpdate
): { jackpotId: string; contributions: { [levelName: string]: number } }[] {
  const contributions: { jackpotId: string; contributions: { [levelName: string]: number } }[] = [];

  // Filter active jackpots that apply to this table
  const applicableJackpots = jackpots.filter((jackpot) => {
    if (jackpot.status !== "active") return false;
    if (jackpot.gameSelection === "all-tables") return true;
    return jackpot.selectedTables.includes(ratingUpdate.tableName);
  });

  for (const jackpot of applicableJackpots) {
    const jackpotContributions: { [levelName: string]: number } = {};

    // Only progressive jackpots increase automatically
    if (jackpot.type === "progressive-theo" && ratingUpdate.theoreticalWin) {
      // Contribution based on theoretical win
      for (const level of jackpot.levels) {
        const contribution = (ratingUpdate.theoreticalWin * level.contributionPercentage) / 100;
        jackpotContributions[level.name] = contribution;
      }
    } else if (jackpot.type === "progressive-fixed" && ratingUpdate.averageBet) {
      // Contribution based on average bet (fixed amount per bet)
      // Assume 1 bet per update for simplicity, or use totalBets if available
      const betCount = ratingUpdate.totalBets || 1;
      for (const level of jackpot.levels) {
        const contribution = (ratingUpdate.averageBet * level.contributionPercentage * betCount) / 100;
        jackpotContributions[level.name] = contribution;
      }
    }

    // Add to contributions if any levels had contributions
    if (Object.keys(jackpotContributions).length > 0) {
      contributions.push({
        jackpotId: jackpot.id,
        contributions: jackpotContributions,
      });
    }
  }

  return contributions;
}

/**
 * Apply contributions to jackpots
 */
export function applyContributionsToJackpots(
  jackpots: Jackpot[],
  contributions: { jackpotId: string; contributions: { [levelName: string]: number } }[]
): Jackpot[] {
  return jackpots.map((jackpot) => {
    const contribution = contributions.find((c) => c.jackpotId === jackpot.id);
    if (!contribution) return jackpot;

    const updatedCurrentAmounts = { ...jackpot.currentAmounts };

    for (const [levelName, amount] of Object.entries(contribution.contributions)) {
      const level = jackpot.levels.find((l) => l.name === levelName);
      if (level) {
        const currentAmount = updatedCurrentAmounts[levelName] || level.minAmount;
        const newAmount = Math.min(currentAmount + amount, level.maxAmount);
        updatedCurrentAmounts[levelName] = newAmount;
      }
    }

    return {
      ...jackpot,
      currentAmounts: updatedCurrentAmounts,
      updatedAt: new Date().toISOString(),
    };
  });
}

/**
 * Check if a player meets jackpot winning conditions
 */
export function checkJackpotConditions(
  jackpot: Jackpot,
  playerStats: {
    actualWinLoss?: number;
    theoreticalWin?: number;
    timePlayed?: number; // in minutes
    averageBet?: number;
    totalBets?: number;
  }
): boolean {
  if (jackpot.conditions.length === 0) {
    // No conditions means all players are eligible
    return true;
  }

  // All conditions must be met
  for (const condition of jackpot.conditions) {
    const value = playerStats[condition.type];
    if (value === undefined) return false;

    switch (condition.operator) {
      case "greaterThan":
        if (value <= condition.value) return false;
        break;
      case "lessThan":
        if (value >= condition.value) return false;
        break;
      case "equals":
        if (value !== condition.value) return false;
        break;
      case "between":
        if (condition.value2 === undefined) return false;
        if (value < condition.value || value > condition.value2) return false;
        break;
    }
  }

  return true;
}

/**
 * Calculate theoretical win from a theo period
 */
export function calculateTheoFromPeriod(
  averageBet: number,
  playingTimeMs: number,
  numberOfPlayers: number
): number {
  // Baccarat house edge: 1.06%
  const houseEdge = 0.0106;
  
  // Average hands per hour in Baccarat
  const handsPerHour = 80;
  
  // Calculate hands played during this period
  const hoursPlayed = playingTimeMs / (1000 * 60 * 60);
  const handsPlayed = (hoursPlayed * handsPerHour) / numberOfPlayers;
  
  // Calculate theoretical win
  const theoreticalWin = averageBet * handsPlayed * houseEdge;
  
  return Math.round(theoreticalWin);
}
