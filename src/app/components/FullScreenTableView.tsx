import React, { useState, useEffect } from "react";
import { X, Plus, Package, UserCircle, Edit2, Shuffle, Zap, CircleDot, Pause, Play } from "lucide-react";
import { ActiveRating, OpenTable } from "../types";
import { Player } from "../types";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";

interface FullScreenTableViewProps {
  selectedTables: string[];
  openTables: OpenTable[];
  activeRatings: ActiveRating[];
  players: Player[];
  allFloats: any[];
  onBack: () => void;
  onStartRating: (tableName: string, seatNumber?: number) => void;
  onToggleBreak: (rating: ActiveRating) => void;
  onUpdateRating: (rating: ActiveRating) => void;
  onEndRating?: (rating: ActiveRating) => void;
}

interface ChipDenomination {
  [key: string]: number;
}

const CHIP_DENOMINATIONS = [
  { value: 10000000, label: "10M", color: "bg-purple-600" },
  { value: 5000000, label: "5M", color: "bg-pink-600" },
  { value: 1000000, label: "1M", color: "bg-red-600" },
  { value: 500000, label: "500K", color: "bg-orange-600" },
  { value: 100000, label: "100K", color: "bg-yellow-600" },
  { value: 50000, label: "50K", color: "bg-green-600" },
  { value: 25000, label: "25K", color: "bg-teal-600" },
  { value: 10000, label: "10K", color: "bg-blue-600" },
  { value: 5000, label: "5K", color: "bg-indigo-600" },
  { value: 1000, label: "1K", color: "bg-slate-600" },
];

// Calculate seat position for 6 seats COMPLETELY OUTSIDE the brown border line
// Seats arranged clockwise starting from Seat 1 on the LEFT side of the float (dealer position at bottom)
// Adjusted to ensure seats 2 and 5 are fully visible
const getSeatPosition = (seatNumber: number): { top: string; left: string; transform: string } => {
  const positions: { [key: number]: { top: string; left: string; transform: string } } = {
    1: { top: "110%", left: "-10%", transform: "translate(0%, -100%)" },     // Bottom left
    2: { top: "20%", left: "-15%", transform: "translate(0%, 0%)" },         // Left center (adjusted to be visible)
    3: { top: "-30%", left: "10%", transform: "translate(0%, 0%)" },         // Top left
    4: { top: "-30%", left: "90%", transform: "translate(-100%, 0%)" },      // Top right
    5: { top: "20%", left: "115%", transform: "translate(-100%, 0%)" },      // Right center (adjusted to be visible)
    6: { top: "110%", left: "110%", transform: "translate(-100%, -100%)" },  // Bottom right
  };

  return positions[seatNumber] || positions[1];
};

// Rating Card Component
interface RatingCardProps {
  rating: ActiveRating;
  player: Player | undefined;
  onUpdateRating: (rating: ActiveRating) => void;
  onToggleBreak: (rating: ActiveRating) => void;
  onChangeSeat: (rating: ActiveRating) => void;
  onEndRating?: (rating: ActiveRating) => void;
}

function RatingCard({ rating, player, onUpdateRating, onToggleBreak, onChangeSeat, onEndRating }: RatingCardProps) {
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
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-3 border-3 border-amber-500 w-48 relative"
      style={{ 
        boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
      }}
    >
      {/* Refused Rating Badge */}
      {rating.isRefused && (
        <div className="absolute -top-3 -left-3 bg-gradient-to-br from-yellow-600 to-yellow-700 text-white rounded-full px-3 py-1 flex items-center justify-center font-bold text-xs shadow-xl border-2 border-white z-10">
          GUEST
        </div>
      )}
      
      {/* Seat Number Badge */}
      <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-base shadow-xl border-3 border-white">
        {rating.seatNumber || 1}
      </div>

      {/* Player Info */}
      <div className="flex items-center gap-2 mb-2">
        {player?.profilePicture ? (
          <img
            src={player.profilePicture}
            alt={rating.playerName}
            className="w-12 h-12 rounded-full object-cover border-3 border-amber-400 shadow-lg"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center border-3 border-amber-400 shadow-lg">
            <UserCircle className="w-8 h-8 text-amber-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-sm truncate">{rating.playerName}</div>
          <div className="text-xs text-amber-300">
            {hours}h {minutes}m
          </div>
        </div>
      </div>

      {/* Buy In Amount */}
      <div className="bg-slate-950/50 rounded-lg p-1.5 mb-1.5 border border-amber-500/30">
        <div className="text-xs text-amber-300">Buy In</div>
        <div className="text-sm font-bold text-white">
          {rating.buyInAmount.toLocaleString()} FCFA
        </div>
      </div>

      {/* Average Bet */}
      <div className="bg-slate-950/50 rounded-lg p-1.5 mb-2 border border-amber-500/30">
        <div className="text-xs text-amber-300">Avg Bet</div>
        <div className="text-sm font-bold text-white">
          {rating.averageBet.toLocaleString()} FCFA
        </div>
      </div>

      {/* Guest Description */}
      {rating.isRefused && rating.refusedReason && (
        <div className="bg-yellow-950/50 rounded-lg p-1.5 mb-2 border border-yellow-500/30">
          <div className="text-xs text-yellow-300">Guest Info</div>
          <div className="text-xs text-white line-clamp-2">{rating.refusedReason}</div>
        </div>
      )}

      {/* Action Buttons - 4 buttons layout (removed Quick Action) */}
      <div className="flex gap-1.5 items-center mb-1.5">
        {/* Large Pause/Resume Button */}
        <button
          onClick={() => onToggleBreak(rating)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-xs font-bold shadow-lg ${
            rating.onBreak
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        >
          {rating.onBreak ? (
            <>
              <Play className="w-4 h-4" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          )}
        </button>

        {/* Update/Edit Button */}
        <button
          onClick={() => onUpdateRating(rating)}
          className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          title="Update Rating"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Close/End Button */}
        <button
          className="flex items-center justify-center bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
          title="End Rating"
          onClick={() => onEndRating && onEndRating(rating)}
        >
          <CircleDot className="w-4 h-4" />
        </button>
      </div>

      {/* Change Seat Button */}
      <button
        onClick={() => onChangeSeat(rating)}
        className="w-full flex items-center justify-center gap-1.5 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-lg text-xs font-bold"
      >
        <Shuffle className="w-4 h-4" />
        Change Seat
      </button>

      {/* On Pause Indicator */}
      {rating.onBreak && (
        <div className="mt-2 bg-amber-500 text-white text-center py-1 rounded-lg text-xs font-bold shadow-lg">
          ON PAUSE
        </div>
      )}
    </div>
  );
}

// Empty Seat Component
interface EmptySeatProps {
  seatNumber: number;
  onStartRating: (seatNumber: number) => void;
}

function EmptySeat({ seatNumber, onStartRating }: EmptySeatProps) {
  return (
    <div
      onClick={() => onStartRating(seatNumber)}
      className="bg-slate-800/40 backdrop-blur rounded-2xl border-3 border-dashed border-slate-700 hover:border-amber-500 hover:bg-slate-800/60 w-48 h-56 flex flex-col items-center justify-center transition-all cursor-pointer"
      style={{
        boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
      }}
    >
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-amber-400 rounded-full w-14 h-14 flex items-center justify-center font-bold text-xl shadow-xl mb-2 border-3 border-amber-500/50">
        {seatNumber}
      </div>
      <p className="text-slate-400 text-sm font-semibold">Empty Seat</p>
      <p className="text-amber-400 text-xs mt-2 font-medium">Click to add player</p>
    </div>
  );
}

// Change Seat Modal Component
interface ChangeSeatModalProps {
  rating: ActiveRating;
  availableSeats: number[];
  onConfirm: (seatNumber: number) => void;
  onCancel: () => void;
}

function ChangeSeatModal({ rating, availableSeats, onConfirm, onCancel }: ChangeSeatModalProps) {
  const [selectedSeat, setSelectedSeat] = useState<number>(rating.seatNumber || 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border-3 border-amber-500 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Change Seat</h2>
        
        <div className="mb-4 p-4 bg-slate-950/50 rounded-lg border border-amber-500/30">
          <p className="text-amber-300 text-sm mb-1">Player:</p>
          <p className="text-white font-bold text-lg">{rating.playerName}</p>
          <p className="text-slate-400 text-sm mt-2">Current Seat: <span className="text-amber-400 font-bold">#{rating.seatNumber || 1}</span></p>
        </div>

        <div className="mb-6">
          <label className="block text-amber-300 text-sm font-semibold mb-2">
            Select New Seat:
          </label>
          <select
            value={selectedSeat}
            onChange={(e) => setSelectedSeat(Number(e.target.value))}
            className="w-full bg-slate-950 text-white border-2 border-amber-500 rounded-lg px-4 py-3 focus:outline-none focus:border-amber-400 text-lg font-bold"
          >
            {availableSeats.map((seat) => (
              <option key={seat} value={seat}>
                Seat #{seat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-600 transition-colors font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedSeat)}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-bold shadow-lg"
          >
            Move to Seat #{selectedSeat}
          </button>
        </div>
      </div>
    </div>
  );
}

// Jackpot Seat Selection Modal Component
interface JackpotModalProps {
  tableName: string;
  activeRatings: ActiveRating[];
  players: Player[];
  onConfirm: (selectedSeats: number[]) => void;
  onCancel: () => void;
}

function JackpotModal({ tableName, activeRatings, players, onConfirm, onCancel }: JackpotModalProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const toggleSeat = (seatNumber: number) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const selectAll = () => {
    const allOccupiedSeats = activeRatings.map(r => r.seatNumber || 1);
    setSelectedSeats(allOccupiedSeats);
  };

  const clearAll = () => {
    setSelectedSeats([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border-3 border-amber-500 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-white mb-2 text-center flex items-center justify-center gap-3">
          <Zap className="w-8 h-8 text-amber-400" />
          Trigger Jackpot
        </h2>
        
        <p className="text-amber-300 text-center mb-6">Select seats to send jackpot impulse</p>

        <div className="mb-4 flex gap-3 justify-center">
          <button
            onClick={selectAll}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold text-sm"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors font-bold text-sm"
          >
            Clear All
          </button>
        </div>

        {activeRatings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-400 text-lg">No active players at this table</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {activeRatings.map((rating) => {
              const player = players.find(p => p.id === rating.playerId);
              const isSelected = selectedSeats.includes(rating.seatNumber || 1);

              return (
                <div
                  key={rating.id}
                  onClick={() => toggleSeat(rating.seatNumber || 1)}
                  className={`cursor-pointer transition-all rounded-xl p-4 border-3 ${
                    isSelected
                      ? "bg-amber-600 border-amber-400 shadow-xl shadow-amber-500/50"
                      : "bg-slate-950/50 border-slate-700 hover:border-amber-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? "bg-white border-white"
                          : "bg-transparent border-slate-500"
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="flex items-center gap-3 flex-1">
                      {player?.profilePicture ? (
                        <img
                          src={player.profilePicture}
                          alt={rating.playerName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center border-2 border-white shadow-lg">
                          <UserCircle className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="font-bold text-white text-base">{rating.playerName}</div>
                        <div className={`text-sm ${isSelected ? "text-white" : "text-slate-400"}`}>
                          Seat #{rating.seatNumber || 1}
                        </div>
                      </div>
                    </div>

                    {/* Seat Number Badge */}
                    <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg border-2 ${
                      isSelected
                        ? "bg-white text-amber-600 border-white"
                        : "bg-amber-500 text-white border-amber-400"
                    }`}>
                      {rating.seatNumber || 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-700 text-white py-3 rounded-lg hover:bg-slate-600 transition-colors font-bold"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedSeats)}
            disabled={selectedSeats.length === 0}
            className={`flex-1 py-3 rounded-lg transition-colors font-bold shadow-lg flex items-center justify-center gap-2 ${
              selectedSeats.length === 0
                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
            }`}
          >
            <Zap className="w-5 h-5" />
            Trigger Jackpot ({selectedSeats.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export function FullScreenTableView({
  selectedTables,
  openTables,
  activeRatings,
  players,
  allFloats,
  onBack,
  onStartRating,
  onToggleBreak,
  onUpdateRating,
  onEndRating,
}: FullScreenTableViewProps) {
  const api = useApi();
  const [users, setUsers] = useState<any[]>([]);
  const [changeSeatModal, setChangeSeatModal] = useState<ActiveRating | null>(null);
  const [jackpotModal, setJackpotModal] = useState<string | null>(null);
  
  // State for each table's dealer and inspector
  const [tableStaff, setTableStaff] = useState<{
    [tableName: string]: {
      dealerId: string;
      inspectorId: string;
    };
  }>({});

  // Load users (staff) on mount
  useEffect(() => {
    loadUsers();
    loadActiveShifts();
  }, [selectedTables]);

  const loadUsers = async () => {
    try {
      const loadedUsers = await api.getUsers();
      // Filter for active users who can deal or inspect
      const staff = loadedUsers.filter((u: any) => 
        u.status === "Active" && 
        (u.userType === "Inspector" || u.userType === "Pit Boss" || u.userType === "Management")
      );
      setUsers(staff);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadActiveShifts = async () => {
    try {
      const staffData: any = {};
      for (const tableName of selectedTables) {
        const shifts = await api.getTableShifts(tableName);
        const dealerShift = shifts.find((s: any) => s.role === "Dealer" && s.status === "Active");
        const inspectorShift = shifts.find((s: any) => s.role === "Inspector" && s.status === "Active");
        
        staffData[tableName] = {
          dealerId: dealerShift?.userId || "",
          inspectorId: inspectorShift?.userId || "",
        };
      }
      setTableStaff(staffData);
    } catch (error) {
      console.error("Error loading shifts:", error);
    }
  };

  // Handle staff selection change
  const handleStaffChange = async (tableName: string, role: "Dealer" | "Inspector", userId: string) => {
    if (!userId) return;
    
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const shift = {
        id: `shift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tableName: tableName,
        userId: user.id,
        username: user.username,
        role: role,
        status: "Active",
        startTime: new Date().toISOString(),
      };

      await api.createTableShift(shift);
      
      setTableStaff(prev => ({
        ...prev,
        [tableName]: {
          ...prev[tableName],
          [role === "Dealer" ? "dealerId" : "inspectorId"]: userId,
        },
      }));
      
      loadActiveShifts();
      toast.success(`${user.username} started as ${role} at ${tableName}`);
    } catch (error) {
      console.error(`Error starting ${role} shift:`, error);
      toast.error(`Failed to start ${role} shift`);
    }
  };

  // Handle opening the change seat modal
  const handleOpenChangeSeat = (rating: ActiveRating) => {
    setChangeSeatModal(rating);
  };

  // Handle moving a player to a different seat
  const handleConfirmMoveSeat = async (newSeat: number) => {
    if (!changeSeatModal) return;

    try {
      const rating = changeSeatModal;
      
      // Check if seat is already occupied
      const seatOccupied = activeRatings.some(
        r => r.tableName === rating.tableName && r.seatNumber === newSeat && r.id !== rating.id
      );

      if (seatOccupied) {
        toast.error(`Seat ${newSeat} is already occupied`);
        return;
      }

      const updatedRating = { ...rating, seatNumber: newSeat };
      await api.updateRating(rating.id, updatedRating);
      toast.success(`${rating.playerName} moved to seat ${newSeat}`);
      setChangeSeatModal(null);
    } catch (error) {
      console.error("Error moving player seat:", error);
      toast.error("Failed to move player");
    }
  };

  // Get float inventory for a table
  const getFloatInventory = (tableName: string): { [denom: string]: number } => {
    const tableFloats = allFloats.filter(
      (f) => f.tableName === tableName && f.status === "Active"
    );

    const inventory: { [denom: string]: number } = {};
    CHIP_DENOMINATIONS.forEach((chip) => {
      inventory[chip.value.toString()] = 0;
    });

    tableFloats.forEach((float) => {
      if (float.chips) {
        Object.entries(float.chips).forEach(([denom, count]) => {
          const multiplier = float.type === "Open" || float.type === "Fill" ? 1 : -1;
          inventory[denom] = (inventory[denom] || 0) + (count as number) * multiplier;
        });
      }
    });
    
    // Subtract holding chips from active players at this table
    const tableRatings = activeRatings.filter((r) => r.tableName === tableName);
    tableRatings.forEach((rating) => {
      if (rating.holdingChips) {
        Object.entries(rating.holdingChips).forEach(([denom, count]) => {
          inventory[denom] = (inventory[denom] || 0) - (count as number);
        });
      }
    });
    
    // Ensure no negative values are displayed
    Object.keys(inventory).forEach((denom) => {
      inventory[denom] = Math.max(0, inventory[denom]);
    });

    return inventory;
  };

  // Get available seats for a table (excluding the current player's seat)
  const getAvailableSeats = (tableName: string, currentRatingId: string): number[] => {
    const seatCount = 6;
    const allSeats = Array.from({ length: seatCount }, (_, i) => i + 1);
    const occupiedSeats = activeRatings
      .filter(r => r.tableName === tableName && r.id !== currentRatingId)
      .map(r => r.seatNumber || 1);
    
    return allSeats.filter(seat => !occupiedSeats.includes(seat));
  };

  const renderTable = (tableName: string, index: number) => {
    const tableRatings = activeRatings.filter((r) => r.tableName === tableName);
    
    // Assign seats to players who don't have one
    const ratingsWithSeats = tableRatings.map((rating) => {
      if (rating.seatNumber) {
        return rating;
      }
      
      // Find first available seat
      const occupiedSeats = tableRatings
        .filter(r => r.id !== rating.id && r.seatNumber)
        .map(r => r.seatNumber!);
      
      const availableSeat = [1, 2, 3, 4, 5, 6].find(seat => !occupiedSeats.includes(seat));
      
      // Update the rating with the assigned seat (temporarily for display)
      return {
        ...rating,
        seatNumber: availableSeat || 1
      };
    });
    
    const floatInventory = getFloatInventory(tableName);
    const currentDealerId = tableStaff[tableName]?.dealerId || "";
    const currentInspectorId = tableStaff[tableName]?.inspectorId || "";

    // All tables have 6 seats
    const seatCount = 6;
    const allSeats = Array.from({ length: seatCount }, (_, i) => i + 1);

    return (
      <div
        key={tableName}
        className={`${
          selectedTables.length === 2 ? "w-1/2" : "w-full"
        } h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 overflow-y-auto relative`}
      >
        {/* Header - Just Table Name */}
        <div className="flex flex-col items-center mb-4">
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white px-12 py-4 rounded-2xl shadow-2xl border-4 border-amber-300 relative">
            {/* Decorative corner accents */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full border-2 border-white shadow-lg"></div>
            
            {/* Table Name */}
            <h2 className="text-4xl font-black text-white drop-shadow-2xl tracking-wide text-center" style={{ textShadow: "0 4px 8px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.3)" }}>
              {tableName}
            </h2>
            
            {/* Underline decoration */}
            <div className="mt-2 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 rounded-full"></div>
          </div>
        </div>

        {/* Table Container with proper spacing */}
        <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 200px)" }}>
          {/* Oval Table Border with Green Interior */}
          <div 
            className="relative rounded-full bg-gradient-to-br from-green-700 to-green-800"
            style={{
              width: "900px",
              height: "550px",
              border: "16px solid #8B4513",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.4)"
            }}
          >
            {/* Float Inventory - CENTER of Table */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-10">
              <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur rounded-xl shadow-2xl p-3 border-3 border-amber-500">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  <h2 className="text-sm font-bold text-white">Float Inventory</h2>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {CHIP_DENOMINATIONS.map((chip) => {
                    const count = floatInventory[chip.value] || 0;
                    return (
                      <div
                        key={chip.value}
                        className={`${chip.color} text-white rounded-lg p-1.5 text-center shadow-lg border-2 border-white/30`}
                      >
                        <div className="text-base font-bold">{count}</div>
                        <div className="text-xs opacity-90">{chip.label}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 p-2 bg-white rounded-lg">
                  <div className="text-center">
                    <span className="text-slate-600 text-xs font-medium">Total:</span>
                    <span className="text-sm font-bold text-slate-900 ml-1">
                      {Object.entries(floatInventory)
                        .reduce((sum, [denom, count]) => sum + parseInt(denom) * count, 0)
                        .toLocaleString()}{" "}
                      FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - MIDDLE TIER (Equal spacing below Float) */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[60%] z-10">
              <div className="flex gap-4 items-center justify-center">
                {/* Add Player Button */}
                <button
                  onClick={() => onStartRating(tableName)}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-2xl text-base font-bold border-2 border-green-400 transform hover:scale-105 w-52"
                >
                  <Plus className="w-5 h-5" />
                  Add Player
                </button>

                {/* Jackpot Button */}
                <button
                  onClick={() => setJackpotModal(tableName)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-2xl text-base font-bold border-2 border-amber-300 transform hover:scale-105 w-52"
                >
                  <Zap className="w-5 h-5" />
                  Trigger Jackpot
                </button>
              </div>
            </div>

            {/* Staff Controls - BOTTOM TIER (Equal spacing below Action Buttons) */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[160%] z-10">
              <div className="flex gap-4 items-center justify-center">
                {/* Dealer Selector */}
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-2xl p-3 border-2 border-white/30 w-52">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white rounded-full p-1.5">
                      <UserCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Dealer</h3>
                  </div>
                  <select
                    value={currentDealerId}
                    onChange={(e) => handleStaffChange(tableName, "Dealer", e.target.value)}
                    className="w-full bg-white text-slate-900 border border-green-300 rounded-md px-3 py-2 focus:outline-none focus:border-green-500 text-sm font-medium"
                  >
                    <option value="">Select Dealer...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Inspector Selector */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-2xl p-3 border-2 border-white/30 w-52">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-white rounded-full p-1.5">
                      <UserCircle className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Inspector</h3>
                  </div>
                  <select
                    value={currentInspectorId}
                    onChange={(e) => handleStaffChange(tableName, "Inspector", e.target.value)}
                    className="w-full bg-white text-slate-900 border border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 text-sm font-medium"
                  >
                    <option value="">Select Inspector...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* All Seats - Positioned on the brown border */}
            {allSeats.map((seatNumber) => {
              const rating = ratingsWithSeats.find((r) => r.seatNumber === seatNumber);
              const position = getSeatPosition(seatNumber);
              
              // Make seats 3 and 4 smaller to fit on screen
              const isTopSeat = seatNumber === 3 || seatNumber === 4;
              const scaleClass = isTopSeat ? "scale-75" : "";

              return (
                <div
                  key={seatNumber}
                  className={`absolute z-20 ${scaleClass}`}
                  style={{
                    top: position.top,
                    left: position.left,
                    transform: position.transform,
                  }}
                >
                  {rating ? (
                    <RatingCard
                      rating={rating}
                      player={players.find((p) => p.id === rating.playerId)}
                      onUpdateRating={onUpdateRating}
                      onToggleBreak={onToggleBreak}
                      onChangeSeat={handleOpenChangeSeat}
                      onEndRating={onEndRating}
                    />
                  ) : (
                    <EmptySeat
                      seatNumber={seatNumber}
                      onStartRating={(seat) => onStartRating(tableName, seat)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950">
        {/* Exit Button */}
        <button
          onClick={onBack}
          className="absolute top-6 right-6 z-50 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Table(s) Display */}
        <div className="flex h-full">
          {selectedTables.map((tableName, index) => renderTable(tableName, index))}
        </div>
      </div>

      {/* Change Seat Modal */}
      {changeSeatModal && (
        <ChangeSeatModal
          rating={changeSeatModal}
          availableSeats={getAvailableSeats(changeSeatModal.tableName, changeSeatModal.id)}
          onConfirm={handleConfirmMoveSeat}
          onCancel={() => setChangeSeatModal(null)}
        />
      )}

      {/* Jackpot Modal */}
      {jackpotModal && (
        <JackpotModal
          tableName={jackpotModal}
          activeRatings={activeRatings.filter(r => r.tableName === jackpotModal)}
          players={players}
          onConfirm={(seats) => {
            // Trigger jackpot logic here
            toast.success(`Jackpot triggered for seats: ${seats.join(", ")}`);
            setJackpotModal(null);
          }}
          onCancel={() => setJackpotModal(null)}
        />
      )}
    </>
  );
}