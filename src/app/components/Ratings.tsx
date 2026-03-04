import { useState, useEffect } from "react";
import { Plus, Play, StopCircle, DollarSign, PauseCircle, PlayCircle, Edit2, ChevronDown, ChevronUp, Filter, Zap, User, Maximize2 } from "lucide-react";
import { StartRatingForm } from "./StartRatingForm";
import { EndRatingForm } from "./EndRatingForm";
import { InlineEditRatingForm } from "./InlineEditRatingForm";
import { TheoBreakdown } from "./TheoBreakdown";
import { InspectorView } from "./InspectorView";
import { FullScreenTableView } from "./FullScreenTableView";
import { useOutletContext } from "react-router";
import { checkBigPlayerAlarm, sendBigPlayerAlarm } from "../utils/alarmService";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";
import { 
  TheoPeriod, 
  createTheoPeriod, 
  completeTheoPeriod, 
  calculateTotalTheo
} from "../utils/theoCalculations";

interface ChipDenomination {
  [key: string]: number;
}

interface Player {
  id: string;
  name: string;
  memberId: string;
  profilePicture?: string;
}

interface Float {
  id: string;
  tableName: string;
  status: string;
  type: "Open" | "Close" | "Fill" | "Credit";
  currency?: string;
}

interface ActiveRating {
  id: string;
  playerId: string;
  playerName: string;
  tableName: string;
  seatNumber?: number;
  buyInType: "Cash" | "Chips";
  buyInAmount: number;
  cashAmount?: number; // Only for Cash buy-ins
  averageBet: number;
  numberOfPlayers: number;
  currency: string;
  buyInChips: ChipDenomination;
  startTime: string;
  onBreak: boolean;
  breakStartTime?: string;
  totalBreakTime: number; // in milliseconds
  status: "Active";
  holdingChips?: ChipDenomination; // Chips player has in pocket
  // Theo tracking
  theoHistory?: TheoPeriod[]; // History of completed Theo periods
  currentTheoPeriod?: Omit<TheoPeriod, "playingTimeMs" | "theoreticalWin" | "endTime">; // Current active period
  // Refused rating
  isRefused?: boolean; // Indicates if player refused rating
  refusedReason?: string; // Guest description (physical features, clothing, etc.)
}

interface CompletedRating {
  id: string;
  playerId: string;
  playerName: string;
  tableName: string;
  seatNumber?: number;
  buyInType: "Cash" | "Chips";
  buyInAmount: number;
  cashAmount?: number; // Only for Cash buy-ins
  averageBet: number;
  numberOfPlayers?: number; // May not exist in old data
  cashOutAmount: number;
  winLoss: number;
  currency: string;
  buyInChips: ChipDenomination;
  cashOutChips: ChipDenomination;
  startTime: string;
  endTime: string;
  totalTime: string; // Total session time
  playingTime: string; // Actual playing time (excluding breaks)
  status: "Completed";
  rebateRedeemed?: boolean;
  rebateRedeemedAmount?: number; // Actual amount redeemed/approved
  rebateRedeemedBy?: string;
  rebateRedeemedAt?: string;
  rebateApprovedBy?: string; // For management approval (rebates > 500k)
  rebateApprovedAt?: string;
  // Theo tracking
  theoHistory?: TheoPeriod[]; // All Theo periods during the session
  totalTheo?: number; // Total theoretical win for the session
  // Refused rating
  isRefused?: boolean; // Indicates if player refused rating
  refusedReason?: string; // Guest description (physical features, clothing, etc.)
}

type Rating = ActiveRating | CompletedRating;

export function Ratings() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [floats, setFloats] = useState<Float[]>([]);
  const [showStartForm, setShowStartForm] = useState(false);
  const [endingRating, setEndingRating] = useState<ActiveRating | null>(null);
  const [editingRating, setEditingRating] = useState<ActiveRating | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [jackpots, setJackpots] = useState<any[]>([]);
  const [filterPlayer, setFilterPlayer] = useState("");
  const { currentUser, isViewOnly } = useOutletContext<{ currentUser: { username: string; userType: string }; isViewOnly: boolean }>();
  const [filterTable, setFilterTable] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [expandedRatings, setExpandedRatings] = useState<Set<string>>(new Set()); // For Theo breakdown
  const [selectedInspectorTables, setSelectedInspectorTables] = useState<string[]>([]);
  const [preselectedTable, setPreselectedTable] = useState<string>("");
  const [preselectedSeat, setPreselectedSeat] = useState<number | undefined>(undefined);
  const [deviceId, setDeviceId] = useState<string>("");
  const [inspectorViewTable, setInspectorViewTable] = useState<string | null>(null);
  const [showTableView, setShowTableView] = useState(false);
  const [redeemingRebate, setRedeemingRebate] = useState<CompletedRating | null>(null);
  const [redeemingRebateAmount, setRedeemingRebateAmount] = useState<number>(0);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemCredentials, setRedeemCredentials] = useState({ username: "", password: "" });
  const [redeemError, setRedeemError] = useState("");
  const [needsManagementApproval, setNeedsManagementApproval] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();

  // Generate or retrieve device ID for this tablet/browser
  useEffect(() => {
    let storedDeviceId = localStorage.getItem("casino_device_id");
    if (!storedDeviceId) {
      storedDeviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("casino_device_id", storedDeviceId);
    }
    setDeviceId(storedDeviceId);

    // Load this device's selected tables
    const savedTables = localStorage.getItem(`casino_device_tables_${storedDeviceId}`);
    if (savedTables) {
      setSelectedInspectorTables(JSON.parse(savedTables));
    }
  }, []);

  // Save selected tables for this device
  useEffect(() => {
    if (deviceId && (currentUser?.userType === "Inspector" || currentUser?.userType === "Pit Boss")) {
      localStorage.setItem(`casino_device_tables_${deviceId}`, JSON.stringify(selectedInspectorTables));
    }
  }, [selectedInspectorTables, deviceId, currentUser]);

  // Get all claimed tables across all devices
  const getClaimedTables = (): { [tableName: string]: string } => {
    const claimedTables: { [tableName: string]: string } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("casino_device_tables_")) {
        const deviceIdFromKey = key.replace("casino_device_tables_", "");
        const tables = JSON.parse(localStorage.getItem(key) || "[]");
        tables.forEach((tableName: string) => {
          claimedTables[tableName] = deviceIdFromKey;
        });
      }
    }
    return claimedTables;
  };

  useEffect(() => {
    loadData();
  }, [api.currentProperty]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [loadedRatings, loadedPlayers, loadedFloats] = await Promise.all([
        api.getRatings(),
        api.getPlayers(),
        api.getFloats()
      ]);
      setRatings(loadedRatings);
      setPlayers(loadedPlayers);
      setFloats(loadedFloats);
      
      // Load jackpots
      await loadJackpots();
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadJackpots = async () => {
    try {
      const loaded = await api.getJackpots();
      setJackpots(loaded.filter((j: any) => j.status === "active"));
    } catch (error) {
      console.error("Error loading jackpots:", error);
    }
  };

  const saveRatingsToStorage = async (updatedRatings: Rating[]) => {
    try {
      // Find the changed rating and update it
      for (const rating of updatedRatings) {
        const existing = ratings.find(r => r.id === rating.id);
        if (!existing) {
          await api.createRating(rating);
        } else if (JSON.stringify(existing) !== JSON.stringify(rating)) {
          await api.updateRating(rating.id, rating);
        }
      }
      setRatings(updatedRatings);
    } catch (error) {
      console.error("Error saving ratings:", error);
      alert("Failed to save ratings. Please try again.");
    }
  };

  const saveFloatsToStorage = async (updatedFloats: Float[]) => {
    try {
      // Update floats
      for (const float of updatedFloats) {
        const existing = floats.find(f => f.id === float.id);
        if (!existing) {
          await api.createFloat(float);
        } else if (JSON.stringify(existing) !== JSON.stringify(float)) {
          await api.updateFloat(float.id, float);
        }
      }
      setFloats(updatedFloats);
    } catch (error) {
      console.error("Error saving floats:", error);
    }
  };

  const saveDropToStorage = (dropData: any) => {
    const savedDrops = localStorage.getItem("casino_drops");
    const drops = savedDrops ? JSON.parse(savedDrops) : [];
    drops.push(dropData);
    localStorage.setItem("casino_drops", JSON.stringify(drops));
  };

  const handleStartRating = (ratingData: any) => {
    // Calculate number of players at this table (including the new player)
    const activeRatingsAtTable = ratings.filter(
      (r) => r.status === "Active" && r.tableName === ratingData.tableName
    ).length;
    const numberOfPlayers = activeRatingsAtTable + 1; // +1 for the new player being added

    const startTime = new Date().toISOString();

    // Initialize first Theo period
    const initialTheoPeriod = createTheoPeriod(
      ratingData.averageBet,
      startTime,
      numberOfPlayers,
      ratingData.tableName
    );

    const newRating: ActiveRating = {
      ...ratingData,
      id: Date.now().toString(),
      startTime,
      onBreak: false,
      totalBreakTime: 0,
      status: "Active",
      numberOfPlayers: numberOfPlayers,
      theoHistory: [],
      currentTheoPeriod: initialTheoPeriod,
      isRefused: ratingData.isRefused || false,
      refusedReason: ratingData.refusedReason || "",
      // Set playerName to "Guest" if refused and no player selected
      playerName: ratingData.isRefused && !ratingData.playerName ? "Guest" : ratingData.playerName,
    };

    const chipAmount = ratingData.buyInAmount - (ratingData.cashAmount || 0);

    // Record cash in Drop if there is any cash
    if (ratingData.cashAmount && ratingData.cashAmount > 0) {
      const dropEntry = {
        id: Date.now().toString(),
        tableName: ratingData.tableName,
        amount: ratingData.cashAmount,
        currency: ratingData.currency,
        timestamp: new Date().toISOString(),
        type: "Cash Buy In",
        playerName: newRating.playerName,
      };
      saveDropToStorage(dropEntry);
    }

    // Create Fill transaction if player is buying in with chips (chips added to table inventory)
    if (chipAmount > 0) {
      const fillTransaction = {
        id: Date.now().toString(),
        tableName: ratingData.tableName,
        dealerName: "Player Buy-In (Chips)",
        amount: chipAmount,
        currency: ratingData.currency,
        timestamp: new Date().toISOString(),
        status: "Active",
        type: "Fill",
        chips: ratingData.chips,
        notes: `Chips buy-in for ${newRating.playerName} - chips added to table inventory`,
      };
      const updatedFloats = [...floats, fillTransaction];
      saveFloatsToStorage(updatedFloats);
    }

    const updated = [...ratings, newRating];
    saveRatingsToStorage(updated);
    setShowStartForm(false);

    // Check if this is a big player and send alarm email
    if (checkBigPlayerAlarm(ratingData.averageBet, ratingData.buyInAmount)) {
      // Get table info to determine game type
      const savedTables = localStorage.getItem("casino_tables");
      let gameType = "Table Game";
      if (savedTables) {
        const tables = JSON.parse(savedTables);
        const tableInfo = tables.find((t: any) => t.tableNumber === ratingData.tableName);
        if (tableInfo) {
          gameType = tableInfo.gameType;
        }
      }

      // Send alarm email asynchronously
      sendBigPlayerAlarm({
        playerName: ratingData.playerName,
        tableName: ratingData.tableName,
        game: gameType,
        buyInAmount: ratingData.buyInAmount,
        averageBet: ratingData.averageBet,
        currency: ratingData.currency,
      }).catch((error) => {
        console.error("Failed to send big player alarm:", error);
      });
    }
  };

  const handleEndRating = (endData: any) => {
    if (!endingRating) return;

    const startTime = new Date(endingRating.startTime);
    const endTime = new Date();
    
    // Calculate total break time
    let totalBreakTime = endingRating.totalBreakTime;
    if (endingRating.onBreak && endingRating.breakStartTime) {
      // Add current break time
      totalBreakTime += endTime.getTime() - new Date(endingRating.breakStartTime).getTime();
    }

    const totalSessionTime = endTime.getTime() - startTime.getTime();
    const playingTime = totalSessionTime - totalBreakTime;

    const totalHours = Math.floor(totalSessionTime / (1000 * 60 * 60));
    const totalMinutes = Math.floor((totalSessionTime % (1000 * 60 * 60)) / (1000 * 60));
    const totalTimeStr = `${totalHours}h ${totalMinutes}m`;

    const playingHours = Math.floor(playingTime / (1000 * 60 * 60));
    const playingMinutes = Math.floor((playingTime % (1000 * 60 * 60)) / (1000 * 60));
    const playingTimeStr = `${playingHours}h ${playingMinutes}m`;

    // Complete the final Theo period
    let finalTheoHistory = endingRating.theoHistory || [];
    let totalTheo = 0;

    if (endingRating.currentTheoPeriod) {
      // Check if average bet changed during end rating form
      const finalAverageBet = endData.averageBet;
      const currentPeriodAvgBet = endingRating.currentTheoPeriod.averageBet;

      if (finalAverageBet !== currentPeriodAvgBet) {
        // Average bet changed in end form - complete current period and create final period
        const now = endTime.toISOString();
        const currentBreakTime = endingRating.onBreak && endingRating.breakStartTime
          ? endTime.getTime() - new Date(endingRating.breakStartTime).getTime()
          : 0;

        // Complete the period with old average bet
        const completedPeriod = completeTheoPeriod(
          endingRating.currentTheoPeriod,
          now,
          endingRating.totalBreakTime,
          endingRating.startTime,
          currentBreakTime
        );
        finalTheoHistory = [...finalTheoHistory, completedPeriod];

        // Create and immediately complete final period with new average bet
        const finalPeriod = createTheoPeriod(
          finalAverageBet,
          now,
          endingRating.numberOfPlayers,
          endingRating.tableName
        );
        
        // For the final instant period, Theo is essentially 0 since no time has passed
        const instantCompletedPeriod: TheoPeriod = {
          ...finalPeriod,
          endTime: now,
          playingTimeMs: 0,
          theoreticalWin: 0,
        };
        finalTheoHistory = [...finalTheoHistory, instantCompletedPeriod];
      } else {
        // Average bet didn't change - just complete the current period
        const completedPeriod = completeTheoPeriod(
          endingRating.currentTheoPeriod,
          endTime.toISOString(),
          totalBreakTime,
          endingRating.startTime,
          0
        );
        finalTheoHistory = [...finalTheoHistory, completedPeriod];
      }

      // Calculate total Theo from all periods
      totalTheo = calculateTotalTheo(finalTheoHistory);

      console.log(`Rating Ended - Total Theo Periods: ${finalTheoHistory.length}, Total Theo: ${totalTheo}`);
      finalTheoHistory.forEach((period, index) => {
        console.log(`  Period ${index + 1}: Avg Bet ${period.averageBet}, Theo: ${period.theoreticalWin}`);
      });
    }

    const completedRating: CompletedRating = {
      id: endingRating.id,
      playerId: endingRating.playerId,
      playerName: endingRating.playerName,
      tableName: endingRating.tableName,
      buyInType: endingRating.buyInType,
      buyInAmount: endingRating.buyInAmount,
      cashAmount: endingRating.cashAmount,
      averageBet: endData.averageBet, // Use the updated average bet from the form
      numberOfPlayers: endingRating.numberOfPlayers,
      cashOutAmount: endData.cashOutAmount,
      winLoss: endData.cashOutAmount - endingRating.buyInAmount,
      currency: endingRating.currency,
      buyInChips: endingRating.buyInChips,
      cashOutChips: endData.cashOutChips,
      startTime: endingRating.startTime,
      endTime: endTime.toISOString(),
      totalTime: totalTimeStr,
      playingTime: playingTimeStr,
      status: "Completed",
      theoHistory: finalTheoHistory,
      totalTheo: totalTheo,
    };

    // Create Credit transaction if player is cashing out with chips (chips removed from table inventory)
    if (endData.isCashingOut && endData.cashOutAmount > 0) {
      // Calculate chip value portion (total cash out minus any cash that was on the table)
      const chipCashOutAmount = endData.cashOutAmount;
      
      const creditTransaction = {
        id: Date.now().toString(),
        tableName: endingRating.tableName,
        dealerName: "Player Cash-Out (Chips)",
        amount: chipCashOutAmount,
        currency: endingRating.currency,
        timestamp: new Date().toISOString(),
        status: "Active",
        type: "Credit",
        chips: endData.cashOutChips,
        notes: `Chips cash-out for ${endingRating.playerName} - chips removed from table inventory`,
      };
      const updatedFloats = [...floats, creditTransaction];
      saveFloatsToStorage(updatedFloats);
    }

    // Return holding chips to the float when rating ends
    if (endingRating.holdingChips && Object.keys(endingRating.holdingChips).length > 0) {
      const holdingChipsValue = Object.entries(endingRating.holdingChips).reduce(
        (sum, [denom, count]) => sum + (parseInt(denom) * count), 
        0
      );
      
      if (holdingChipsValue > 0) {
        const fillTransaction = {
          id: Date.now().toString() + '-holding',
          tableName: endingRating.tableName,
          dealerName: "Holding Chips Returned",
          amount: holdingChipsValue,
          currency: endingRating.currency,
          timestamp: new Date().toISOString(),
          status: "Active",
          type: "Fill",
          chips: endingRating.holdingChips,
          notes: `Holding chips returned from ${endingRating.playerName} - chips returned to table inventory`,
        };
        const updatedFloats = [...floats, fillTransaction];
        saveFloatsToStorage(updatedFloats);
      }
    }

    // Update ratings
    const updated = ratings.map((r) =>
      r.id === endingRating.id ? completedRating : r
    );
    saveRatingsToStorage(updated);
    setEndingRating(null);
  };

  const handleEditRating = (editData: any) => {
    if (!editingRating) return;

    const oldBuyInAmount = editingRating.buyInAmount;
    const oldCashAmount = editingRating.cashAmount || 0;
    const newBuyInAmount = editData.buyInAmount;
    const newCashAmount = editData.cashAmount || 0;
    const oldAverageBet = editingRating.averageBet;
    const newAverageBet = editData.averageBet;

    // Handle Theo period if average bet changed
    let updatedTheoHistory = editingRating.theoHistory || [];
    let newCurrentTheoPeriod = editingRating.currentTheoPeriod;

    if (oldAverageBet !== newAverageBet && editingRating.currentTheoPeriod) {
      // Complete the current Theo period
      const now = new Date().toISOString();
      const currentBreakTime = editingRating.onBreak && editingRating.breakStartTime
        ? new Date().getTime() - new Date(editingRating.breakStartTime).getTime()
        : 0;

      const completedPeriod = completeTheoPeriod(
        editingRating.currentTheoPeriod,
        now,
        editingRating.totalBreakTime,
        editingRating.startTime,
        currentBreakTime
      );

      // Add completed period to history
      updatedTheoHistory = [...updatedTheoHistory, completedPeriod];

      // Start new Theo period with new average bet
      newCurrentTheoPeriod = createTheoPeriod(
        newAverageBet,
        now,
        editingRating.numberOfPlayers,
        editingRating.tableName
      );

      console.log(`Theo Period Completed - Previous Avg Bet: ${oldAverageBet}, Theo: ${completedPeriod.theoreticalWin}`);
      console.log(`New Theo Period Started - New Avg Bet: ${newAverageBet}`);
    }

    // Update the rating
    const updatedRating: ActiveRating = {
      ...editingRating,
      averageBet: editData.averageBet,
      buyInAmount: newBuyInAmount,
      cashAmount: newCashAmount,
      buyInChips: editData.chips,
      theoHistory: updatedTheoHistory,
      currentTheoPeriod: newCurrentTheoPeriod,
    };

    // Create adjustment transaction if chips amount changed
    if (oldBuyInAmount !== newBuyInAmount) {
      const difference = newBuyInAmount - oldBuyInAmount;
      
      if (difference > 0) {
        // Player received more chips - Create Fill transaction (chips added to table inventory)
        const fillTransaction = {
          id: Date.now().toString(),
          tableName: editingRating.tableName,
          dealerName: "Rating Adjustment",
          amount: difference,
          currency: editingRating.currency,
          timestamp: new Date().toISOString(),
          status: "Active",
          type: "Fill",
          chips: calculateChipDifference(editData.chips, editingRating.buyInChips, difference),
          notes: `Adjustment: Additional chips given to ${editingRating.playerName} - chips added to table inventory (Rating edited)`,
        };
        const updatedFloats = [...floats, fillTransaction];
        saveFloatsToStorage(updatedFloats);
      } else if (difference < 0) {
        // Player returned chips - Create Credit transaction (chips removed from table inventory)
        const creditTransaction = {
          id: Date.now().toString(),
          tableName: editingRating.tableName,
          dealerName: "Rating Adjustment",
          amount: Math.abs(difference),
          currency: editingRating.currency,
          timestamp: new Date().toISOString(),
          status: "Active",
          type: "Credit",
          chips: calculateChipDifference(editingRating.buyInChips, editData.chips, Math.abs(difference)),
          notes: `Adjustment: Chips returned by ${editingRating.playerName} - chips removed from table inventory (Rating edited)`,
        };
        const updatedFloats = [...floats, creditTransaction];
        saveFloatsToStorage(updatedFloats);
      }
    }

    // Create adjustment in Drop if cash amount changed
    if (oldCashAmount !== newCashAmount) {
      const cashDifference = newCashAmount - oldCashAmount;
      
      if (cashDifference !== 0) {
        const dropEntry = {
          id: Date.now().toString(),
          tableName: editingRating.tableName,
          amount: Math.abs(cashDifference),
          currency: editingRating.currency,
          timestamp: new Date().toISOString(),
          type: cashDifference > 0 ? "Cash Adjustment (Add)" : "Cash Adjustment (Reduce)",
          playerName: editingRating.playerName,
        };
        saveDropToStorage(dropEntry);
      }
    }

    // Update ratings
    const updated = ratings.map((r) =>
      r.id === editingRating.id ? updatedRating : r
    );
    saveRatingsToStorage(updated);
    setEditingRating(null);

    // Check if this edit now triggers big player alarm (only if it wasn't triggered before)
    const oldBuyIn = editingRating.buyInAmount;
    const newBuyIn = editData.buyInAmount;
    
    // Only send alarm if the values crossed the threshold
    const wasAlarmWorthy = checkBigPlayerAlarm(oldAverageBet, oldBuyIn);
    const isNowAlarmWorthy = checkBigPlayerAlarm(newAverageBet, newBuyIn);
    
    if (!wasAlarmWorthy && isNowAlarmWorthy) {
      // Get table info to determine game type
      const savedTables = localStorage.getItem("casino_tables");
      let gameType = "Table Game";
      if (savedTables) {
        const tables = JSON.parse(savedTables);
        const tableInfo = tables.find((t: any) => t.tableNumber === editingRating.tableName);
        if (tableInfo) {
          gameType = tableInfo.gameType;
        }
      }

      // Send alarm email asynchronously
      sendBigPlayerAlarm({
        playerName: editingRating.playerName,
        tableName: editingRating.tableName,
        game: gameType,
        buyInAmount: newBuyIn,
        averageBet: newAverageBet,
        currency: editingRating.currency,
      }).catch((error) => {
        console.error("Failed to send big player alarm:", error);
      });
    }
  };

  // Helper function to calculate chip differences for adjustments
  const calculateChipDifference = (newChips: ChipDenomination, oldChips: ChipDenomination, targetAmount: number): ChipDenomination => {
    const difference: ChipDenomination = {};
    
    // Handle undefined or null chips objects
    const safeNewChips = newChips || {};
    const safeOldChips = oldChips || {};
    
    // Calculate the difference in each denomination
    Object.keys(safeNewChips).forEach(denom => {
      const newCount = safeNewChips[denom] || 0;
      const oldCount = safeOldChips[denom] || 0;
      const diff = newCount - oldCount;
      
      if (diff !== 0) {
        difference[denom] = Math.abs(diff);
      }
    });
    
    // Also check old chips for denominations not in new chips
    Object.keys(safeOldChips).forEach(denom => {
      if (!safeNewChips[denom]) {
        const oldCount = safeOldChips[denom] || 0;
        if (oldCount !== 0) {
          difference[denom] = Math.abs(oldCount);
        }
      }
    });
    
    return difference;
  };

  const toggleBreak = (ratingId: string) => {
    const updated = ratings.map((r) => {
      if (r.id === ratingId && r.status === "Active") {
        const activeRating = r as ActiveRating;
        if (activeRating.onBreak && activeRating.breakStartTime) {
          // Resume from break
          const breakDuration = new Date().getTime() - new Date(activeRating.breakStartTime).getTime();
          return {
            ...activeRating,
            onBreak: false,
            breakStartTime: undefined,
            totalBreakTime: activeRating.totalBreakTime + breakDuration,
          };
        } else {
          // Start break
          return {
            ...activeRating,
            onBreak: true,
            breakStartTime: new Date().toISOString(),
          };
        }
      }
      return r;
    });
    saveRatingsToStorage(updated);
  };

  const handleStartBreak = (ratingId: string) => {
    const updated = ratings.map((r) => {
      if (r.id === ratingId && r.status === "Active") {
        const activeRating = r as ActiveRating;
        if (!activeRating.onBreak) {
          // Start break
          return {
            ...activeRating,
            onBreak: true,
            breakStartTime: new Date().toISOString(),
          };
        }
      }
      return r;
    });
    saveRatingsToStorage(updated);
  };

  const handleResumeBreak = (ratingId: string) => {
    const updated = ratings.map((r) => {
      if (r.id === ratingId && r.status === "Active") {
        const activeRating = r as ActiveRating;
        if (activeRating.onBreak && activeRating.breakStartTime) {
          // Resume from break
          const breakDuration = new Date().getTime() - new Date(activeRating.breakStartTime).getTime();
          return {
            ...activeRating,
            onBreak: false,
            breakStartTime: undefined,
            totalBreakTime: activeRating.totalBreakTime + breakDuration,
          };
        }
      }
      return r;
    });
    saveRatingsToStorage(updated);
  };

  // Check if a table has active fixed/random jackpots
  const hasFixedOrRandomJackpots = (tableName: string) => {
    return jackpots.some((j: any) => {
      if (j.type !== "fixed" && j.type !== "random") return false;
      if (j.gameSelection === "all-tables") return true;
      return j.selectedTables.includes(tableName);
    });
  };

  // Handle jackpot impulse button click
  const handleJackpotImpulse = async (rating: ActiveRating) => {
    // Find applicable jackpots
    const applicableJackpots = jackpots.filter((j: any) => {
      if (j.type !== "fixed" && j.type !== "random") return false;
      if (j.gameSelection === "all-tables") return true;
      return j.selectedTables.includes(rating.tableName);
    });

    if (applicableJackpots.length === 0) {
      toast.error("No Fixed or Random jackpots available for this table");
      return;
    }

    // Create a jackpot impulse event
    const jackpotNames = applicableJackpots.map((j: any) => j.name).join(", ");
    const impulseData = {
      type: "jackpot-impulse",
      playerId: rating.playerId,
      playerName: rating.playerName,
      tableName: rating.tableName,
      averageBet: rating.averageBet,
      buyInAmount: rating.buyInAmount,
      eligibleJackpots: applicableJackpots.map((j: any) => ({
        id: j.id,
        name: j.name,
        type: j.type
      })),
      timestamp: new Date().toISOString(),
    };

    // Log the impulse (in a real system, this would trigger jackpot logic)
    console.log("🎰 Jackpot Impulse Triggered:", impulseData);

    // Show success message with toast
    toast.success("✨ Jackpot Impulse Sent!", {
      description: `${rating.playerName} is now eligible for: ${jackpotNames}`,
      duration: 5000,
    });

    // Dispatch event for display screens
    const event = new CustomEvent("jackpot-impulse", {
      detail: impulseData
    });
    window.dispatchEvent(event);
  };

  const activeRatings = ratings.filter((r) => r.status === "Active") as ActiveRating[];
  const completedRatings = ratings.filter((r) => r.status === "Completed") as CompletedRating[];

  // Apply all filters
  let filteredRatings = filterStatus === "All"
    ? ratings
    : filterStatus === "Active"
    ? activeRatings
    : completedRatings;

  // Apply additional filters
  filteredRatings = filteredRatings.filter((rating) => {
    const matchesPlayer = filterPlayer === "" || rating.playerName.toLowerCase().includes(filterPlayer.toLowerCase());
    const matchesTable = filterTable === "" || rating.tableName.toLowerCase().includes(filterTable.toLowerCase());
    
    let matchesDate = true;
    if (filterDateFrom || filterDateTo) {
      const ratingDate = new Date(rating.startTime);
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && ratingDate >= fromDate;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && ratingDate <= toDate;
      }
    }
    
    return matchesPlayer && matchesTable && matchesDate;
  });

  const openTables = floats.filter(f => f.status === "Active" && f.type === "Open");

  // Development tool: Generate sample data
  const generateSampleData = () => {
    const sampleNames = [
      "John Smith", "Maria Chen", "David Kim", "Sarah Johnson", "Mohammed Ali",
      "Isabella Garcia", "James Wilson", "Yuki Tanaka", "Pierre Dubois", "Ana Silva",
      "Wei Zhang", "Emma Brown", "Carlos Rodriguez", "Priya Patel", "Alexander Ivanov",
      "Fatima Hassan", "Lucas Martinez", "Sophie Laurent", "Raj Kumar", "Nina Kowalski",
      "Diego Fernandez", "Aisha Mohammed", "Marco Rossi", "Lily Wang", "Ahmed Abdullah",
      "Elena Popov", "Oscar Sanchez", "Mei Lin", "Hassan Khan", "Olivia Thompson"
    ];

    const tableNames = [
      "BAC01", "BAC02", "BAC03", "BAC04", "BAC05",
      "NIUNIU01", "NIUNIU02", "NIUNIU03", "NIUNIU04",
      "UTH01", "UTH02", "UTH03",
      "ROUL01", "ROUL02", "ROUL03",
      "BJ01", "BJ02", "BJ03",
      "POKER01", "POKER02"
    ];

    const buyInAmounts = [
      500000, 1000000, 2000000, 3000000, 5000000,
      7500000, 10000000, 15000000, 20000000
    ];

    const avgBets = [
      50000, 100000, 250000, 500000, 750000,
      1000000, 2000000, 3000000
    ];

    // Step 1: Create Open transactions for all tables (if they don't exist)
    const existingOpenTables = floats
      .filter(f => f.status === "Active" && f.type === "Open")
      .map(f => f.tableName);
    
    const newFloats: any[] = [];
    const newDrops: any[] = [];
    const timestamp = new Date();
    
    tableNames.forEach((tableName, index) => {
      if (!existingOpenTables.includes(tableName)) {
        // Create Open transaction for this table
        const openFloat = {
          id: `open-${Date.now()}-${index}`,
          tableName: tableName,
          dealerName: "System",
          amount: 50000000, // 50M FCFA opening float
          currency: "FCFA",
          timestamp: new Date(timestamp.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          status: "Active",
          type: "Open",
          chips: {
            "10000000": 2,
            "5000000": 2,
            "1000000": 10,
            "500000": 10,
            "100000": 10,
            "50000": 10,
            "25000": 10,
            "10000": 10,
            "5000": 10,
            "1000": 10,
            "500": 10,
            "250": 10
          },
          notes: "Opening float"
        };
        newFloats.push(openFloat);
      }
    });

    // Step 2: Create some Drop entries (cash buy-ins that happened before current ratings)
    const dropsCount = 15; // 15 previous cash drops
    for (let i = 0; i < dropsCount; i++) {
      const dropAmount = buyInAmounts[Math.floor(Math.random() * buyInAmounts.length)];
      const dropTime = new Date(timestamp.getTime() - Math.random() * 5 * 60 * 60 * 1000); // Within last 5 hours
      
      const drop = {
        id: `drop-${Date.now()}-${i}`,
        tableName: tableNames[Math.floor(Math.random() * tableNames.length)],
        amount: dropAmount,
        currency: "FCFA",
        timestamp: dropTime.toISOString(),
        type: "Cash Buy In",
        playerName: sampleNames[Math.floor(Math.random() * sampleNames.length)]
      };
      newDrops.push(drop);
    }

    // Step 3: Create active ratings for current players
    const newRatings: ActiveRating[] = [];
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      // Random start time between 10 minutes and 5 hours ago
      const minutesAgo = Math.floor(Math.random() * 290) + 10;
      const startTime = new Date(now.getTime() - minutesAgo * 60 * 1000);
      
      const onBreak = Math.random() > 0.7; // 30% chance of being on break
      const breakStartTime = onBreak ? new Date(now.getTime() - Math.random() * 10 * 60 * 1000) : undefined;
      const totalBreakTime = Math.floor(Math.random() * 600000); // Random break time up to 10 minutes

      const buyInAmount = buyInAmounts[Math.floor(Math.random() * buyInAmounts.length)];
      const buyInType = Math.random() > 0.5 ? "Cash" : "Chips";
      const cashAmount = buyInType === "Cash" ? buyInAmount * 0.3 : 0; // 30% cash if Cash type
      
      const rating: ActiveRating = {
        id: `sample-${Date.now()}-${i}`,
        playerId: `player-${i}`,
        playerName: sampleNames[i],
        tableName: tableNames[Math.floor(Math.random() * tableNames.length)],
        buyInType,
        buyInAmount,
        cashAmount,
        averageBet: avgBets[Math.floor(Math.random() * avgBets.length)],
        numberOfPlayers: Math.floor(Math.random() * 6) + 1,
        currency: "FCFA",
        buyInChips: { "1000000": 5, "500000": 2, "100000": 3 },
        startTime: startTime.toISOString(),
        onBreak,
        breakStartTime: breakStartTime?.toISOString(),
        totalBreakTime,
        status: "Active"
      };

      newRatings.push(rating);

      // Create corresponding Drop entry if cash buy-in
      if (buyInType === "Cash" && cashAmount > 0) {
        const cashDrop = {
          id: `cash-${Date.now()}-${i}`,
          tableName: rating.tableName,
          amount: cashAmount,
          currency: "FCFA",
          timestamp: startTime.toISOString(),
          type: "Cash Buy In",
          playerName: rating.playerName
        };
        newDrops.push(cashDrop);
      }

      // Create Credit transaction for chips given to player
      const chipAmount = buyInAmount - cashAmount;
      if (chipAmount > 0) {
        const creditFloat = {
          id: `credit-${Date.now()}-${i}`,
          tableName: rating.tableName,
          dealerName: `Player Buy-In: ${rating.playerName}`,
          amount: chipAmount,
          currency: "FCFA",
          timestamp: startTime.toISOString(),
          status: "Active",
          type: "Credit",
          chips: rating.buyInChips,
          notes: `Chips buy-in for ${rating.playerName}`
        };
        newFloats.push(creditFloat);
      }
    }

    // Save everything to storage
    const updatedRatings = [...ratings, ...newRatings];
    saveRatingsToStorage(updatedRatings);

    const updatedFloats = [...floats, ...newFloats];
    saveFloatsToStorage(updatedFloats);

    // Save drops
    const savedDrops = localStorage.getItem("casino_drops");
    const existingDrops = savedDrops ? JSON.parse(savedDrops) : [];
    const allDrops = [...existingDrops, ...newDrops];
    localStorage.setItem("casino_drops", JSON.stringify(allDrops));

    // Force re-render by updating floats state
    setFloats(updatedFloats);
  };

  const clearSampleData = () => {
    // Clear sample ratings
    const nonSampleRatings = ratings.filter(r => !r.id.startsWith('sample-'));
    saveRatingsToStorage(nonSampleRatings);

    // Clear sample floats (opens, credits from sample)
    const nonSampleFloats = floats.filter(f => 
      !f.id.startsWith('open-') && 
      !f.id.startsWith('credit-')
    );
    saveFloatsToStorage(nonSampleFloats);

    // Clear sample drops
    const savedDrops = localStorage.getItem("casino_drops");
    const existingDrops = savedDrops ? JSON.parse(savedDrops) : [];
    const nonSampleDrops = existingDrops.filter((d: any) => 
      !d.id.startsWith('drop-') && 
      !d.id.startsWith('cash-')
    );
    localStorage.setItem("casino_drops", JSON.stringify(nonSampleDrops));
  };

  // Handle rebate redemption
  const handleRedeemRebate = (rating: CompletedRating, rebateAmount: number) => {
    // Check if rebate is still valid (within 14 days)
    const ratingDate = new Date(rating.startTime);
    const today = new Date();
    const daysDiff = Math.ceil((today.getTime() - ratingDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 14) {
      alert("This rebate has expired. Rebates are only valid for 14 days from the session date.");
      return;
    }
    
    setRedeemingRebate(rating);
    setRedeemingRebateAmount(rebateAmount);
    setNeedsManagementApproval(rebateAmount > 500000);
    setShowRedeemModal(true);
    setRedeemCredentials({ username: "", password: "" });
    setRedeemError("");
  };

  const confirmRedeemRebate = () => {
    if (!redeemingRebate) return;

    // Get all users from localStorage
    const savedUsers = localStorage.getItem("casino_users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    // Verify credentials
    const user = users.find(
      (u: any) => u.username === redeemCredentials.username && u.password === redeemCredentials.password
    );

    if (!user) {
      setRedeemError("Invalid credentials");
      return;
    }

    // Check if user has proper authorization
    if (needsManagementApproval) {
      // For rebates > 500k, require Management approval
      if (user.userType !== "Management") {
        setRedeemError("Management approval required for rebates over 500,000");
        return;
      }
    } else {
      // For rebates <= 500k, allow Pit Boss or Management
      if (user.userType !== "Pit Boss" && user.userType !== "Management") {
        setRedeemError("Pit Boss or Management authorization required");
        return;
      }
    }

    // Calculate rebate for this player on this day
    const ratingDate = new Date(redeemingRebate.startTime);
    const ratingDateStr = ratingDate.toISOString().split('T')[0];
    
    // Update ONLY the specific rating that was clicked for redemption
    const updatedRatings = ratings.map((r) => {
      if (r.status === "Completed") {
        const completedR = r as CompletedRating;
        
        // Only mark the specific rating that was redeemed
        if (completedR.id === redeemingRebate.id) {
          return {
            ...completedR,
            rebateRedeemed: true,
            rebateRedeemedAmount: redeemingRebateAmount,
            rebateRedeemedBy: user.username,
            rebateRedeemedAt: new Date().toISOString(),
            ...(needsManagementApproval && {
              rebateApprovedBy: user.username,
              rebateApprovedAt: new Date().toISOString(),
            }),
          };
        }
      }
      return r;
    });

    saveRatingsToStorage(updatedRatings);
    setShowRedeemModal(false);
    setRedeemingRebate(null);
    setRedeemCredentials({ username: "", password: "" });
    setRedeemError("");
  };

  // Toggle table expansion
  const toggleTableExpansion = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  // Toggle individual rating expansion for Theo breakdown
  const toggleRatingExpansion = (ratingId: string) => {
    const newExpanded = new Set(expandedRatings);
    if (newExpanded.has(ratingId)) {
      newExpanded.delete(ratingId);
    } else {
      newExpanded.add(ratingId);
    }
    setExpandedRatings(newExpanded);
  };

  // Group active ratings by table
  const ratingsByTable = activeRatings.reduce((acc, rating) => {
    if (!acc[rating.tableName]) {
      acc[rating.tableName] = [];
    }
    acc[rating.tableName].push(rating);
    return acc;
  }, {} as Record<string, ActiveRating[]>);

  // Sort table names alphabetically and filter for Inspector/Pit Boss users
  const allSortedTableNames = Object.keys(ratingsByTable).sort();
  const sortedTableNames = (currentUser?.userType === "Inspector" || currentUser?.userType === "Pit Boss") && selectedInspectorTables.length > 0
    ? allSortedTableNames.filter(name => selectedInspectorTables.includes(name))
    : allSortedTableNames;

  // Full Screen Table View (for 1-2 selected tables) - Available for all users
  if (showTableView && selectedInspectorTables.length > 0) {
    return (
      <>
        <FullScreenTableView
          selectedTables={selectedInspectorTables}
          openTables={openTables}
          activeRatings={activeRatings}
          players={players}
          allFloats={floats}
          onBack={() => {
            setShowTableView(false);
            // Clear selected tables when backing out of full screen view
            setSelectedInspectorTables([]);
          }}
          onStartRating={(tableName, seatNumber) => {
            setPreselectedTable(tableName);
            setPreselectedSeat(seatNumber);
            setShowStartForm(true);
          }}
          onToggleBreak={(rating) => toggleBreak(rating.id)}
          onUpdateRating={(rating) => {
            setEditingRating(rating);
          }}
          onEndRating={(rating) => {
            setEndingRating(rating);
          }}
        />
        
        {/* Start Rating Form Modal - Rendered on top with higher z-index */}
        {showStartForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <StartRatingForm
              onSubmit={handleStartRating}
              onCancel={() => {
                setShowStartForm(false);
                setPreselectedTable("");
                setPreselectedSeat(undefined);
              }}
              players={players}
              openTables={openTables}
              preselectedTable={preselectedTable}
              preselectedSeat={preselectedSeat}
            />
          </div>
        )}
        
        {/* End Rating Form Modal - Rendered on top with higher z-index */}
        {endingRating && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <EndRatingForm
              rating={endingRating}
              onSubmit={handleEndRating}
              onCancel={() => setEndingRating(null)}
            />
          </div>
        )}
        
        {/* Edit Rating Form Modal - Rendered on top with higher z-index */}
        {editingRating && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
              <InlineEditRatingForm
                rating={editingRating}
                onSubmit={handleEditRating}
                onCancel={() => setEditingRating(null)}
                onEndRating={handleEndRating}
                onJackpotImpulse={() => handleJackpotImpulse(editingRating)}
                hasFixedOrRandomJackpots={hasFixedOrRandomJackpots(editingRating.tableName)}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // Inspector Full Screen View
  if (currentUser?.userType === "Inspector" && inspectorViewTable) {
    return (
      <InspectorView
        selectedTable={inspectorViewTable}
        openTables={openTables}
        activeRatings={activeRatings}
        players={players}
        allFloats={floats}
        onBack={() => setInspectorViewTable(null)}
        onStartRating={() => setShowStartForm(true)}
        onToggleBreak={(rating) => toggleBreak(rating.id)}
        onUpdateRating={(updatedRating) => {
          const updatedRatings = ratings.map(r =>
            r.id === updatedRating.id ? updatedRating : r
          );
          setRatings(updatedRatings);
          saveRatingsToStorage(updatedRatings);
        }}
        preselectedTable={preselectedTable}
        setPreselectedTable={setPreselectedTable}
        showStartForm={showStartForm}
        setShowStartForm={setShowStartForm}
        onSubmitStartForm={handleStartRating}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Player Ratings</h2>
          <p className="text-slate-600 mt-1">Track player sessions and performance</p>
        </div>
        <div className="flex items-center gap-2">
          {currentUser?.userType !== "Inspector" && !isViewOnly && (
          <button
            onClick={() => setShowStartForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-5 h-5" />
            Start Rating
          </button>
          )}
        </div>
      </div>

      {/* Table Selection and Full Screen View - Available for all users */}
      {openTables.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Select a Table to Add Rating
              </h3>
              <p className="text-slate-600">
                Choose from the opened tables below - select 1-2 tables to enable Full Screen View
              </p>
            </div>
            
            {/* Table Filter - Available for all users */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-bold text-slate-900">
                  Select Tables (Select 1-2 for Full Screen View)
                </label>
                {selectedInspectorTables.length > 0 && (
                  <button
                    onClick={() => setSelectedInspectorTables([])}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Clear Filter ({selectedInspectorTables.length} selected)
                  </button>
                )}
              </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {openTables.map((table) => {
                    const claimedTables = getClaimedTables();
                    const isSelected = selectedInspectorTables.includes(table.tableName);
                    const isClaimedByOther = claimedTables[table.tableName] && claimedTables[table.tableName] !== deviceId;
                    const canSelect = !isClaimedByOther && (selectedInspectorTables.length < 2 || isSelected);
                    const tableActiveRatings = activeRatings.filter(r => r.tableName === table.tableName);
                    const playerCount = tableActiveRatings.length;
                    
                    return (
                      <button
                        key={table.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedInspectorTables(selectedInspectorTables.filter(t => t !== table.tableName));
                          } else if (canSelect) {
                            setSelectedInspectorTables([...selectedInspectorTables, table.tableName]);
                          }
                        }}
                        disabled={!canSelect}
                        className={`relative px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-lg border-2 border-blue-700"
                            : isClaimedByOther
                            ? "bg-red-100 text-red-400 border-2 border-red-300 cursor-not-allowed opacity-60"
                            : canSelect
                            ? "bg-white text-slate-700 border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50"
                            : "bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex-1">{table.tableName}</span>
                          {playerCount > 0 && (
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              isSelected ? "bg-white text-blue-600" : "bg-green-500 text-white"
                            }`}>
                              {playerCount}
                            </span>
                          )}
                        </div>
                        {isClaimedByOther && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20 rounded-lg">
                            <span className="text-xs font-bold text-red-700">IN USE</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {selectedInspectorTables.length > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Viewing:</strong> {selectedInspectorTables.join(", ")} 
                  <span className="text-blue-600 ml-2">({selectedInspectorTables.length} of {openTables.length} tables)</span>
                </p>
              </div>
              {selectedInspectorTables.length <= 2 && (
                <button
                  onClick={() => setShowTableView(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  <Maximize2 className="w-5 h-5" />
                  Full Screen View
                </button>
              )}
            </div>
          )}
          
          {openTables.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <Play className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 text-lg font-medium">No Tables Are Currently Open</p>
              <p className="text-slate-500 text-sm mt-2">Tables must be opened in the Floats tab first</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {openTables
                .filter(table => selectedInspectorTables.length === 0 || selectedInspectorTables.includes(table.tableName))
                .map((table) => {
                const tableActiveRatings = activeRatings.filter(r => r.tableName === table.tableName);
                const playerCount = tableActiveRatings.length;
                
                return (
                  <button
                    key={table.id}
                    onClick={() => {
                      setPreselectedTable(table.tableName);
                      setShowStartForm(true);
                    }}
                    className="group bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-6 transition-all duration-200 hover:shadow-lg text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {table.tableName}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${playerCount > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Active Players</span>
                        <span className="text-xl font-bold text-slate-900">{playerCount}</span>
                      </div>
                      
                      <div className="pt-3 border-t border-blue-200">
                        <span className="text-blue-600 font-semibold group-hover:text-blue-700 flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Add Rating
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Casino Floor Status Summary - Hidden for Inspector users */}
      {currentUser?.userType !== "Inspector" && (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          Casino Floor Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-white/80 mb-1">Open Tables</p>
            <p className="text-3xl font-bold">{openTables.length}</p>
            <p className="text-xs text-white/70 mt-1">Currently Active</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-white/80 mb-1">Active Players</p>
            <p className="text-3xl font-bold">{activeRatings.length}</p>
            <p className="text-xs text-white/70 mt-1">In Play</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-white/80 mb-1">Total Float</p>
            <p className="text-2xl font-bold">
              {(() => {
                const totalFloat = floats
                  .filter(f => f.status === "Active")
                  .reduce((sum, f) => {
                    if (f.type === "Open" || f.type === "Fill") {
                      return sum + f.amount;
                    } else if (f.type === "Credit") {
                      return sum - f.amount;
                    }
                    return sum;
                  }, 0);
                return `${(totalFloat / 1000000).toFixed(1)}M`;
              })()}
            </p>
            <p className="text-xs text-white/70 mt-1">FCFA</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-white/80 mb-1">Win/Loss</p>
            <p className="text-2xl font-bold">
              {(() => {
                const totalWinLoss = completedRatings.reduce((sum, r) => sum + r.winLoss, 0);
                const sign = totalWinLoss >= 0 ? "+" : "";
                return `${sign}${(totalWinLoss / 1000000).toFixed(1)}M`;
              })()}
            </p>
            <p className="text-xs text-white/70 mt-1">FCFA</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-white/80 mb-1">Total Theo Win</p>
            <p className="text-2xl font-bold">
              {(() => {
                const totalTheo = completedRatings.reduce((sum, r) => sum + (r.totalTheo || 0), 0);
                return `${(totalTheo / 1000000).toFixed(1)}M`;
              })()}
            </p>
            <p className="text-xs text-white/70 mt-1">FCFA</p>
          </div>
        </div>
      </div>
      )}

      {/* Summary Cards - Hidden for Inspector users */}
      {currentUser?.userType !== "Inspector" && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Active Sessions</p>
              <p className="text-2xl font-bold text-slate-900">{activeRatings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <StopCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Completed Sessions</p>
              <p className="text-2xl font-bold text-slate-900">{completedRatings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Total Sessions</p>
              <p className="text-2xl font-bold text-slate-900">{ratings.length}</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Buy-In Type Summary - Hidden for Inspector users */}
      {currentUser?.userType !== "Inspector" && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Cash Buy-Ins</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Cash Buy-Ins:</span>
              <span className="font-bold text-green-600">
                {ratings.filter(r => r.buyInType === "Cash").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Amount:</span>
              <span className="font-bold text-green-600">
                CFA {ratings
                  .filter(r => r.buyInType === "Cash")
                  .reduce((sum, r) => sum + r.buyInAmount, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Chips Buy-Ins</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Chips Buy-Ins:</span>
              <span className="font-bold text-blue-600">
                {ratings.filter(r => r.buyInType === "Chips").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Amount:</span>
              <span className="font-bold text-blue-600">
                CFA {ratings
                  .filter(r => r.buyInType === "Chips")
                  .reduce((sum, r) => sum + r.buyInAmount, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Active Ratings Visual Display - Grouped by Table */}
      {activeRatings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Play className="w-6 h-6 text-emerald-600" />
              Active Ratings by Table
              <span className="ml-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                {sortedTableNames.length} Tables • {activeRatings.length} Players
              </span>
            </h3>
          </div>

          <div className="space-y-3">
            {sortedTableNames.map((tableName) => {
              const tableRatings = ratingsByTable[tableName];
              const isExpanded = expandedTables.has(tableName);
              const playingCount = tableRatings.filter(r => !r.onBreak).length;
              const onBreakCount = tableRatings.filter(r => r.onBreak).length;

              return (
                <div key={tableName} className="border border-slate-200 rounded-lg overflow-hidden">
                  {/* Table Header - Clickable */}
                  <div
                    onClick={() => toggleTableExpansion(tableName)}
                    className="flex items-center justify-between px-5 py-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-600" />
                        )}
                        <h4 className="font-bold text-slate-900 text-lg font-mono">
                          {tableName}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                          {tableRatings.length} {tableRatings.length === 1 ? 'Player' : 'Players'}
                        </span>
                        {playingCount > 0 && (
                          <span className="px-2 py-1 bg-emerald-200 text-emerald-800 text-xs font-semibold rounded flex items-center gap-1">
                            <PlayCircle className="w-3 h-3" />
                            {playingCount} Playing
                          </span>
                        )}
                        {onBreakCount > 0 && (
                          <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-semibold rounded flex items-center gap-1">
                            <PauseCircle className="w-3 h-3" />
                            {onBreakCount} On Pause
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-slate-600">
                      {isExpanded ? 'Click to collapse' : 'Click to expand'}
                    </div>
                  </div>

                  {/* Table Content - Player Cards */}
                  {isExpanded && (
                    <div className="p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tableRatings.map((rating) => {
                          // Check if this rating is being edited
                          const isEditing = editingRating?.id === rating.id;
                          
                          // If this rating is being edited, show the inline edit form
                          if (isEditing && editingRating) {
                            return (
                              <div key={rating.id} className="md:col-span-2 lg:col-span-3">
                                <InlineEditRatingForm
                                  rating={editingRating}
                                  onSubmit={handleEditRating}
                                  onCancel={() => setEditingRating(null)}
                                  onEndRating={handleEndRating}
                                  onJackpotImpulse={() => handleJackpotImpulse(editingRating)}
                                  hasFixedOrRandomJackpots={hasFixedOrRandomJackpots(editingRating.tableName)}
                                />
                              </div>
                            );
                          }
                          
                          const startTime = new Date(rating.startTime);
                          const now = new Date();
                          let elapsedTime = now.getTime() - startTime.getTime();
                          
                          // Subtract break time
                          if (rating.onBreak && rating.breakStartTime) {
                            elapsedTime -= rating.totalBreakTime;
                          } else {
                            elapsedTime -= rating.totalBreakTime;
                          }

                          const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
                          const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));

                          return (
                            <div
                              key={rating.id}
                              className={`border-2 rounded-lg p-4 transition-all ${
                                rating.onBreak
                                  ? "border-amber-400 bg-amber-50"
                                  : "border-emerald-400 bg-emerald-50"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-start gap-3">
                                  {/* Player Profile Picture */}
                                  <div className="flex-shrink-0">
                                    {players.find(p => p.id === rating.playerId)?.profilePicture ? (
                                      <img
                                        src={players.find(p => p.id === rating.playerId)?.profilePicture}
                                        alt={rating.playerName}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-300"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-slate-300">
                                        <User className="w-6 h-6 text-slate-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-lg">
                                      {rating.playerName}
                                    </h4>
                                    <p className="text-xs text-slate-500">
                                      {new Date(rating.startTime).toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  {rating.onBreak ? (
                                    <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs font-semibold rounded flex items-center gap-1">
                                      <PauseCircle className="w-3 h-3" />
                                      Pause
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-emerald-200 text-emerald-800 text-xs font-semibold rounded flex items-center gap-1">
                                      <PlayCircle className="w-3 h-3" />
                                      Playing
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-600">Buy-In:</span>
                                  <span className="font-semibold text-slate-900">
                                    {rating.buyInAmount.toLocaleString()} FCFA
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-600">Avg Bet:</span>
                                  <span className="font-semibold text-slate-900">
                                    {rating.averageBet.toLocaleString()} FCFA
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-slate-600">Time:</span>
                                  <span className="font-semibold text-slate-900">
                                    {hours}h {minutes}m
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {rating.onBreak ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResumeBreak(rating.id);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded hover:bg-emerald-700 transition-colors"
                                  >
                                    <PlayCircle className="w-4 h-4" />
                                    Resume
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartBreak(rating.id);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-amber-600 text-white text-sm font-medium rounded hover:bg-amber-700 transition-colors"
                                  >
                                    <PauseCircle className="w-4 h-4" />
                                    Pause
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (hasFixedOrRandomJackpots(rating.tableName)) {
                                      handleJackpotImpulse(rating);
                                    }
                                  }}
                                  disabled={!hasFixedOrRandomJackpots(rating.tableName)}
                                  className={`px-3 py-2 text-sm font-medium rounded transition-colors shadow-md ${
                                    hasFixedOrRandomJackpots(rating.tableName)
                                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700"
                                      : "bg-slate-300 text-slate-500 cursor-not-allowed"
                                  }`}
                                  title={hasFixedOrRandomJackpots(rating.tableName) ? "Send Jackpot Impulse" : "No active jackpots for this table"}
                                >
                                  <Zap className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingRating(rating);
                                  }}
                                  className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEndingRating(rating);
                                  }}
                                  className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                                  title="End Rating"
                                >
                                  <StopCircle className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Start Rating Form Modal */}
      {showStartForm && (
        <StartRatingForm
          onSubmit={handleStartRating}
          onCancel={() => {
            setShowStartForm(false);
            setPreselectedTable("");
          }}
          players={players}
          openTables={openTables}
          preselectedTable={preselectedTable}
        />
      )}

      {/* End Rating Form Modal */}
      {endingRating && (
        <EndRatingForm
          rating={endingRating}
          onSubmit={handleEndRating}
          onCancel={() => setEndingRating(null)}
        />
      )}

      {/* Ratings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Collapsible Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Session History</h3>
            <span className="ml-2 px-2 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full">
              {filteredRatings.length} of {ratings.length}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-600" />
          )}
        </div>

        {/* Filters - Only show when expanded */}
        {isExpanded && ratings.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Player Name
                </label>
                <input
                  type="text"
                  value={filterPlayer}
                  onChange={(e) => setFilterPlayer(e.target.value)}
                  placeholder="Filter by player..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Table Name
                </label>
                <input
                  type="text"
                  value={filterTable}
                  onChange={(e) => setFilterTable(e.target.value)}
                  placeholder="Filter by table..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {(filterPlayer || filterTable || filterDateFrom || filterDateTo || filterStatus !== "All") && (
              <button
                onClick={() => {
                  setFilterStatus("All");
                  setFilterPlayer("");
                  setFilterTable("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Table Content - Only show when expanded */}
        {isExpanded && (
          <>
            {ratings.length === 0 ? (
              <div className="text-center py-12">
                <Play className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No rating sessions yet</p>
                <p className="text-slate-400 mt-1">
                  Click 'Start Rating' to begin tracking player sessions
                </p>
              </div>
            ) : filteredRatings.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No sessions match your filters</p>
                <p className="text-slate-400 mt-1">
                  Try adjusting your filter criteria
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Buy In Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Buy In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Cash Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Win/Loss
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Theo Win
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Rebate On Loss
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredRatings.map((rating) => {
                      const isActive = rating.status === "Active";
                      const completed = rating as CompletedRating;
                      const isEditing = editingRating?.id === rating.id;
                      
                      // If this rating is being edited, show the inline edit form
                      if (isEditing && editingRating) {
                        return (
                          <tr key={rating.id} className="bg-slate-50">
                            <td colSpan={11} className="p-0">
                              <InlineEditRatingForm
                                rating={editingRating}
                                onSubmit={handleEditRating}
                                onCancel={() => setEditingRating(null)}
                                onEndRating={handleEndRating}
                                onJackpotImpulse={() => handleJackpotImpulse(editingRating)}
                                hasFixedOrRandomJackpots={hasFixedOrRandomJackpots(editingRating.tableName)}
                              />
                            </td>
                          </tr>
                        );
                      }
                      
                      const mainRow = (
                        <tr key={rating.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-slate-900">{rating.playerName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {rating.tableName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                rating.buyInType === "Cash"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {rating.buyInType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                            {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{rating.buyInAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                            {isActive ? (
                              <span className="text-slate-400">-</span>
                            ) : (
                              `${completed.currency === "FCFA" ? "CFA " : completed.currency === "PHP" ? "₱" : completed.currency === "EUR" ? "€" : completed.currency === "GBP" ? "£" : completed.currency === "CNY" || completed.currency === "JPY" ? "¥" : completed.currency === "KRW" ? "₩" : "$"}${completed.cashOutAmount.toLocaleString()}`
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isActive ? (
                              <span className="text-slate-400">-</span>
                            ) : (
                              <span
                                className={`font-bold ${
                                  completed.winLoss >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {completed.winLoss >= 0 ? "+" : ""}
                                {completed.currency === "FCFA" ? "CFA " : completed.currency === "PHP" ? "₱" : completed.currency === "EUR" ? "€" : completed.currency === "GBP" ? "£" : completed.currency === "CNY" || completed.currency === "JPY" ? "¥" : completed.currency === "KRW" ? "₩" : "$"}{completed.winLoss.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isActive ? (
                              <span className="text-slate-400">-</span>
                            ) : completed.totalTheo !== undefined ? (
                              <div className="flex flex-col">
                                <span className="font-semibold text-purple-600">
                                  {completed.currency === "FCFA" ? "CFA " : completed.currency === "PHP" ? "₱" : completed.currency === "EUR" ? "€" : completed.currency === "GBP" ? "£" : completed.currency === "CNY" || completed.currency === "JPY" ? "¥" : completed.currency === "KRW" ? "₩" : "$"}{completed.totalTheo.toLocaleString()}
                                </span>
                                {completed.theoHistory && completed.theoHistory.length > 1 && (
                                  <span className="text-xs text-slate-500">
                                    ({completed.theoHistory.length} periods)
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isActive ? (
                              <span className="text-slate-400">-</span>
                            ) : (
                              (() => {
                                // Calculate Rebate On Loss based on DAILY total loss for this player
                                // Calculate rebate for THIS INDIVIDUAL rating based on its own loss
                                const ratingDate = new Date(completed.startTime);
                                const loss = completed.winLoss < 0 ? Math.abs(completed.winLoss) : 0;
                                
                                // Determine rebate percentage based on individual loss
                                let rebatePercentage = 0;
                                if (loss >= 10000000) { // Over 10 million
                                  rebatePercentage = 0.15;
                                } else if (loss >= 1000000) { // Over 1 million
                                  rebatePercentage = 0.10;
                                } else if (loss >= 500000) { // Over 500k
                                  rebatePercentage = 0.05;
                                } else { // Under 500k
                                  rebatePercentage = 0;
                                }
                                
                                const calculatedRebate = loss * rebatePercentage;
                                
                                // For redeemed ratings, show the actual redeemed amount
                                if (completed.rebateRedeemed && completed.rebateRedeemedAmount !== undefined) {
                                  return (
                                    <div className="flex flex-col gap-1">
                                      <div className="font-semibold text-slate-400 line-through">
                                        {completed.currency === "FCFA" ? "CFA " : completed.currency === "PHP" ? "₱" : completed.currency === "EUR" ? "€" : completed.currency === "GBP" ? "£" : completed.currency === "CNY" || completed.currency === "JPY" ? "¥" : completed.currency === "KRW" ? "₩" : "$"}{completed.rebateRedeemedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                      </div>
                                      <div className="flex flex-col gap-0.5">
                                        <span className="px-2 py-0.5 inline-flex text-xs font-semibold rounded bg-green-100 text-green-800">
                                          ✓ Redeemed
                                        </span>
                                        {completed.rebateRedeemedBy && (
                                          <span className="text-xs text-slate-500">
                                            By: {completed.rebateRedeemedBy}
                                          </span>
                                        )}
                                        {completed.rebateApprovedBy && completed.rebateRedeemedAmount > 500000 && (
                                          <span className="text-xs text-orange-600 font-medium">
                                            Mgmt: {completed.rebateApprovedBy}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                                
                                // Check if rebate has expired (14 days)
                                const today = new Date();
                                const daysDiff = Math.ceil((today.getTime() - ratingDate.getTime()) / (1000 * 60 * 60 * 24));
                                const isExpired = daysDiff > 14;
                                const daysRemaining = 14 - daysDiff;
                                
                                // Show individual rebate for this rating
                                return calculatedRebate > 0 ? (
                                  <div className="flex flex-col gap-1">
                                    <div className={`font-semibold ${isExpired ? "text-slate-400 line-through" : "text-blue-600"}`}>
                                      {completed.currency === "FCFA" ? "CFA " : completed.currency === "PHP" ? "₱" : completed.currency === "EUR" ? "€" : completed.currency === "GBP" ? "£" : completed.currency === "CNY" || completed.currency === "JPY" ? "¥" : completed.currency === "KRW" ? "₩" : "$"}{calculatedRebate.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                      <span className="text-xs text-slate-500 ml-1">({(rebatePercentage * 100).toFixed(0)}%)</span>
                                    </div>
                                    {isExpired ? (
                                      <span className="px-2 py-0.5 inline-flex text-xs font-semibold rounded bg-slate-200 text-slate-500">
                                        Expired
                                      </span>
                                    ) : currentUser?.userType === "Pit Boss" || currentUser?.userType === "Management" ? (
                                      <div className="flex flex-col gap-1">
                                        <button
                                          onClick={() => handleRedeemRebate(completed, calculatedRebate)}
                                          className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                                            daysRemaining <= 3
                                              ? "bg-red-600 text-white hover:bg-red-700"
                                              : "bg-blue-600 text-white hover:bg-blue-700"
                                          }`}
                                        >
                                          Redeem
                                        </button>
                                        {daysRemaining <= 7 && (
                                          <span className={`text-xs font-medium ${
                                            daysRemaining <= 3 ? "text-red-600" : "text-orange-600"
                                          }`}>
                                            {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="flex flex-col gap-1">
                                        <span className="px-2 py-0.5 inline-flex text-xs font-semibold rounded bg-slate-100 text-slate-600">
                                          Pending
                                        </span>
                                        {daysRemaining <= 7 && (
                                          <span className={`text-xs font-medium ${
                                            daysRemaining <= 3 ? "text-red-600" : "text-orange-600"
                                          }`}>
                                            {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                );
                              })()
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {isActive ? (
                              <div>
                                {(rating as ActiveRating).onBreak && (
                                    <span className="text-orange-600 font-medium">On Pause</span>
                                )}
                                {!(rating as ActiveRating).onBreak && (
                                    <span className="text-green-600 font-medium">Playing</span>
                                )}
                              </div>
                            ) : (
                              <div>
                                <div className="font-medium text-slate-900">Total: {completed.totalTime}</div>
                                <div className="text-xs text-slate-500">Playing: {completed.playingTime}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                rating.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-slate-100 text-slate-800"
                              }`}
                            >
                              {rating.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {isActive && !isViewOnly && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleBreak(rating.id)}
                                  className={`flex items-center gap-1 font-medium ${
                                    (rating as ActiveRating).onBreak
                                      ? "text-green-600 hover:text-green-900"
                                      : "text-orange-600 hover:text-orange-900"
                                  }`}
                                >
                                  {(rating as ActiveRating).onBreak ? (
                                    <>
                                      <PlayCircle className="w-4 h-4" />
                                      Resume
                                    </>
                                  ) : (
                                    <>
                                      <PauseCircle className="w-4 h-4" />
                                      Pause
                                    </>
                                  )}
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  onClick={() => setEditingRating(rating as ActiveRating)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-900 font-medium"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  onClick={() => setEndingRating(rating as ActiveRating)}
                                  className="flex items-center gap-1 text-red-600 hover:text-red-900 font-medium"
                                >
                                  <StopCircle className="w-4 h-4" />
                                  Close
                                </button>
                              </div>
                            )}
                            {!isActive && completed.theoHistory && completed.theoHistory.length > 0 && (
                              <button
                                onClick={() => toggleRatingExpansion(rating.id)}
                                className="text-purple-600 hover:text-purple-900 font-medium text-xs"
                              >
                                {expandedRatings.has(rating.id) ? "Hide" : "View"} Theo
                              </button>
                            )}
                            {!isActive && (!completed.theoHistory || completed.theoHistory.length === 0) && (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                        </tr>
                      );

                      const expansionRow = !isActive && expandedRatings.has(rating.id) && completed.theoHistory && completed.theoHistory.length > 0 ? (
                        <tr key={`${rating.id}-theo`} className="bg-purple-50">
                          <td colSpan={11} className="px-6 py-4">
                            <TheoBreakdown
                              theoHistory={completed.theoHistory}
                              totalTheo={completed.totalTheo || 0}
                              currency={completed.currency}
                            />
                          </td>
                        </tr>
                      ) : null;

                      return [mainRow, expansionRow].filter(Boolean);
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rebate Redemption Modal */}
      {showRedeemModal && redeemingRebate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {needsManagementApproval ? "Management Approval Required" : "Confirm Rebate Redemption"}
            </h3>
            
            {/* Rebate Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Player:</span>
                  <span className="text-sm font-semibold text-slate-900">{redeemingRebate.playerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Date:</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {new Date(redeemingRebate.startTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Rebate Amount:</span>
                  <span className="text-sm font-bold text-blue-600">
                    {(() => {
                      const ratingDate = new Date(redeemingRebate.startTime);
                      const ratingDateStr = ratingDate.toISOString().split('T')[0];
                      const dailyRatings = completedRatings.filter(r => {
                        const rDate = new Date(r.startTime);
                        const rDateStr = rDate.toISOString().split('T')[0];
                        return r.playerId === redeemingRebate.playerId && rDateStr === ratingDateStr;
                      });
                      const dailyTotalWinLoss = dailyRatings.reduce((sum, r) => sum + r.winLoss, 0);
                      const dailyLoss = dailyTotalWinLoss < 0 ? Math.abs(dailyTotalWinLoss) : 0;
                      let rebatePercentage = 0;
                      if (dailyLoss >= 10000000) rebatePercentage = 0.15;
                      else if (dailyLoss >= 1000000) rebatePercentage = 0.10;
                      else if (dailyLoss >= 500000) rebatePercentage = 0.05;
                      const totalDailyRebate = dailyLoss * rebatePercentage;
                      return `${redeemingRebate.currency === "FCFA" ? "CFA " : redeemingRebate.currency === "PHP" ? "₱" : redeemingRebate.currency === "EUR" ? "€" : redeemingRebate.currency === "GBP" ? "£" : redeemingRebate.currency === "CNY" || redeemingRebate.currency === "JPY" ? "¥" : redeemingRebate.currency === "KRW" ? "₩" : "$"}${totalDailyRebate.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {needsManagementApproval && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-800 font-medium">
                  ⚠️ This rebate exceeds 500,000 and requires Management approval
                </p>
              </div>
            )}

            {/* Credentials Form */}
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Username {needsManagementApproval && "(Management)"}
                </label>
                <input
                  type="text"
                  value={redeemCredentials.username}
                  onChange={(e) => setRedeemCredentials({ ...redeemCredentials, username: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={redeemCredentials.password}
                  onChange={(e) => setRedeemCredentials({ ...redeemCredentials, password: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      confirmRedeemRebate();
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {redeemError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800 font-medium">{redeemError}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRedeemModal(false);
                  setRedeemingRebate(null);
                  setRedeemCredentials({ username: "", password: "" });
                  setRedeemError("");
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmRedeemRebate}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Confirm Redemption
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}