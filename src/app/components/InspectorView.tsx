import { useState, useEffect } from "react";
import { Plus, Minus, DollarSign, Eye, Users, ChevronLeft, Package, HandCoins, Clock, UserCheck } from "lucide-react";
import { StartRatingForm } from "./StartRatingForm";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";

interface ChipDenomination {
  [key: string]: number;
}

interface Float {
  id: string;
  tableName: string;
  dealerName: string;
  amount: number;
  currency?: string;
  timestamp: string;
  status: string;
  type: "Open" | "Close" | "Fill" | "Credit";
  chips: ChipDenomination;
  notes: string;
}

interface ActiveRating {
  id: string;
  playerId: string;
  playerName: string;
  tableName: string;
  seatNumber?: number;
  buyInType: "Cash" | "Chips";
  buyInAmount: number;
  cashAmount?: number;
  averageBet: number;
  numberOfPlayers: number;
  currency: string;
  buyInChips: ChipDenomination;
  startTime: string;
  onBreak: boolean;
  breakStartTime?: string;
  totalBreakTime: number;
  status: "Active";
  holdingChips?: ChipDenomination; // Chips player has in pocket
}

interface OpenTable {
  id: string;
  tableName: string;
  dealerName: string;
  amount: number;
  currency?: string;
  timestamp: string;
  status: string;
  type: "Open" | "Close" | "Fill" | "Credit";
  chips: ChipDenomination;
  notes: string;
}

interface Player {
  id: string;
  name: string;
  memberId: string;
  profilePicture?: string;
}

interface InspectorViewProps {
  selectedTable: string | null;
  openTables: OpenTable[];
  activeRatings: ActiveRating[];
  players: Player[];
  allFloats: Float[];
  onBack: () => void;
  onStartRating: () => void;
  onToggleBreak: (rating: ActiveRating) => void;
  onUpdateRating: (rating: ActiveRating) => void;
  preselectedTable: string;
  setPreselectedTable: (table: string) => void;
  showStartForm: boolean;
  setShowStartForm: (show: boolean) => void;
  onSubmitStartForm: (data: any) => void;
}

// Chip denominations in FCFA
const CHIP_DENOMINATIONS = [
  { value: 10000000, label: "10M", color: "bg-purple-600" },
  { value: 5000000, label: "5M", color: "bg-pink-600" },
  { value: 1000000, label: "1M", color: "bg-orange-600" },
  { value: 500000, label: "500K", color: "bg-red-600" },
  { value: 250000, label: "250K", color: "bg-yellow-600" },
  { value: 100000, label: "100K", color: "bg-green-600" },
  { value: 50000, label: "50K", color: "bg-blue-600" },
  { value: 25000, label: "25K", color: "bg-indigo-600" },
  { value: 10000, label: "10K", color: "bg-gray-600" },
  { value: 5000, label: "5K", color: "bg-slate-600" },
];

export function InspectorView({
  selectedTable,
  openTables,
  activeRatings,
  players,
  allFloats,
  onBack,
  onStartRating,
  onToggleBreak,
  onUpdateRating,
  preselectedTable,
  setPreselectedTable,
  showStartForm,
  setShowStartForm,
  onSubmitStartForm,
}: InspectorViewProps) {
  const [showHoldingChipsDialog, setShowHoldingChipsDialog] = useState<ActiveRating | null>(null);
  const [holdingChipsAmount, setHoldingChipsAmount] = useState<ChipDenomination>({});
  const [users, setUsers] = useState<any[]>([]);
  const [activeShifts, setActiveShifts] = useState<any[]>([]);
  const [selectedDealer, setSelectedDealer] = useState<string>("");
  const [selectedInspector, setSelectedInspector] = useState<string>("");
  const api = useApi();

  // Load users (staff) on mount
  useEffect(() => {
    loadUsers();
    loadActiveShifts();
  }, [selectedTable]);

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
    if (!selectedTable) return;
    try {
      const shifts = await api.getTableShifts(selectedTable);
      setActiveShifts(shifts);
      
      // Set current active dealer and inspector
      const dealerShift = shifts.find((s: any) => s.role === "Dealer" && s.status === "Active");
      const inspectorShift = shifts.find((s: any) => s.role === "Inspector" && s.status === "Active");
      
      if (dealerShift) setSelectedDealer(dealerShift.userId);
      if (inspectorShift) setSelectedInspector(inspectorShift.userId);
    } catch (error) {
      console.error("Error loading shifts:", error);
    }
  };

  const handleDealerChange = async (userId: string) => {
    if (!selectedTable || !userId) return;
    
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const shift = {
        id: `shift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tableName: selectedTable,
        userId: user.id,
        username: user.username,
        role: "Dealer",
        status: "Active",
        startTime: new Date().toISOString(),
      };

      await api.createTableShift(shift);
      setSelectedDealer(userId);
      loadActiveShifts();
      toast.success(`${user.username} started dealing at ${selectedTable}`);
    } catch (error) {
      console.error("Error starting dealer shift:", error);
      toast.error("Failed to start dealer shift");
    }
  };

  const handleInspectorChange = async (userId: string) => {
    if (!selectedTable || !userId) return;
    
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const shift = {
        id: `shift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tableName: selectedTable,
        userId: user.id,
        username: user.username,
        role: "Inspector",
        status: "Active",
        startTime: new Date().toISOString(),
      };

      await api.createTableShift(shift);
      setSelectedInspector(userId);
      loadActiveShifts();
      toast.success(`${user.username} started inspecting ${selectedTable}`);
    } catch (error) {
      console.error("Error starting inspector shift:", error);
      toast.error("Failed to start inspector shift");
    }
  };

  const calculateShiftTime = (shift: any) => {
    if (!shift || !shift.startTime) return "0h 0m";
    const duration = Date.now() - new Date(shift.startTime).getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleSaveHoldingChips = () => {
    if (!showHoldingChipsDialog) return;

    const updatedRating = {
      ...showHoldingChipsDialog,
      holdingChips: { ...holdingChipsAmount },
    };

    onUpdateRating(updatedRating);
    setShowHoldingChipsDialog(null);
    setHoldingChipsAmount({});
  };

  const openHoldingChipsDialog = (rating: ActiveRating) => {
    setShowHoldingChipsDialog(rating);
    setHoldingChipsAmount(rating.holdingChips || {});
  };

  // Find the selected table
  const table = openTables.find(t => t.tableName === selectedTable);
  const tableRatings = activeRatings.filter(r => r.tableName === selectedTable);

  // Calculate float inventory for this table
  const floatInventory: ChipDenomination = {};
  
  // Initialize all denominations to 0
  CHIP_DENOMINATIONS.forEach(chip => {
    floatInventory[chip.value] = 0;
  });
  
  // Calculate from float transactions (Open/Fill add chips, Credit removes chips)
  const tableFloats = allFloats.filter(f => f.tableName === selectedTable && f.status === "Active");
  tableFloats.forEach(float => {
    if (float.chips) {
      const multiplier = (float.type === "Open" || float.type === "Fill") ? 1 : -1;
      Object.entries(float.chips).forEach(([denom, count]) => {
        floatInventory[denom] = (floatInventory[denom] || 0) + (count * multiplier);
      });
    }
  });
  
  // Subtract holding chips from active players at this table
  tableRatings.forEach(rating => {
    if (rating.holdingChips) {
      Object.entries(rating.holdingChips).forEach(([denom, count]) => {
        floatInventory[denom] = (floatInventory[denom] || 0) - count;
      });
    }
  });
  
  // Ensure no negative values are displayed
  Object.keys(floatInventory).forEach(denom => {
    floatInventory[denom] = Math.max(0, floatInventory[denom]);
  });

  if (!table) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <Users className="w-24 h-24 text-slate-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">No Table Selected</h2>
          <p className="text-slate-600 mb-8">Please select a table to monitor</p>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Select Table
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-lg font-bold"
          >
            <ChevronLeft className="w-6 h-6" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-1">{table.tableName}</h1>
            <p className="text-blue-100 text-lg">Dealer: {table.dealerName}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setPreselectedTable(table.tableName);
                setShowStartForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl transition-all text-lg font-bold"
            >
              <Plus className="w-5 h-5" />
              Add Player
            </button>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/20 rounded-xl">
              <Users className="w-6 h-6" />
              <span className="text-2xl font-bold">{tableRatings.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Staff Selection Sidebar - Right Side */}
        <div className="fixed right-6 top-32 z-20 space-y-4 w-80">
          {/* Dealer Selector */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-2xl p-6 border-4 border-white">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold text-white">Dealer</h3>
            </div>
            <select
              value={selectedDealer}
              onChange={(e) => handleDealerChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-slate-900 font-medium text-lg focus:ring-4 focus:ring-green-300 transition-all"
            >
              <option value="">Select Dealer...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            {selectedDealer && (
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg font-bold">
                    {calculateShiftTime(activeShifts.find(s => s.role === "Dealer" && s.status === "Active"))}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Inspector Selector */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-6 border-4 border-white">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-bold text-white">Inspector</h3>
            </div>
            <select
              value={selectedInspector}
              onChange={(e) => handleInspectorChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white text-slate-900 font-medium text-lg focus:ring-4 focus:ring-blue-300 transition-all"
            >
              <option value="">Select Inspector...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            {selectedInspector && (
              <div className="mt-4 p-3 bg-white/20 rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5" />
                  <span className="text-lg font-bold">
                    {calculateShiftTime(activeShifts.find(s => s.role === "Inspector" && s.status === "Active"))}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Layout - Float in center, players around based on seat number */}
        <div className="relative w-full" style={{ minHeight: '800px' }}>
          {/* Center Float Inventory */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-2xl p-8 border-8 border-white">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Package className="w-10 h-10 text-white" />
                <h2 className="text-3xl font-bold text-white">Float Inventory</h2>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {CHIP_DENOMINATIONS.map(chip => {
                  const count = floatInventory[chip.value] || 0;
                  return (
                    <div
                      key={chip.value}
                      className={`${chip.color} text-white rounded-xl p-4 text-center shadow-lg border-2 border-white/30`}
                    >
                      <div className="text-3xl font-bold mb-1">{count}</div>
                      <div className="text-xs opacity-90">{chip.label}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 p-4 bg-white rounded-xl">
                <div className="text-center">
                  <span className="text-slate-600 text-lg font-medium">Total Float Value:</span>
                  <span className="text-3xl font-bold text-slate-900 ml-3">
                    {Object.entries(floatInventory).reduce((sum, [denom, count]) => sum + (parseInt(denom) * count), 0).toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Player Ratings Positioned Around Float Based on Seat Number */}
          {tableRatings.length === 0 ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
              <div className="text-center py-16 bg-slate-800/50 backdrop-blur rounded-2xl border-2 border-slate-600">
                <Users className="w-20 h-20 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 text-xl">No active players at this table</p>
              </div>
            </div>
          ) : (
            tableRatings.map(rating => {
              const player = players.find(p => p.id === rating.playerId);
              const playingTime = Date.now() - new Date(rating.startTime).getTime() - rating.totalBreakTime;
              const hours = Math.floor(playingTime / (1000 * 60 * 60));
              const minutes = Math.floor((playingTime % (1000 * 60 * 60)) / (1000 * 60));

              // Position players around the center based on seat number (1-8 typical casino table)
              // Seat positions in degrees (starting from top, going clockwise)
              const seatNumber = rating.seatNumber || 1;
              const totalSeats = 8;
              const anglePerSeat = 360 / totalSeats;
              const angle = ((seatNumber - 1) * anglePerSeat - 90) * (Math.PI / 180); // -90 to start from top
              
              // Calculate position (radius from center)
              const radius = 450; // Distance from center
              const x = 50 + Math.cos(angle) * 35; // 50% center + offset in percentage
              const y = 50 + Math.sin(angle) * 35;

              return (
                <div
                  key={rating.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 w-80"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                  }}
                >
                  <div className={`rounded-2xl p-5 shadow-2xl border-4 transition-all ${
                    rating.onBreak
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-400'
                      : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400'
                  }`}>
                    {/* Seat Number Badge */}
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-4 border-white">
                      {seatNumber}
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      {player?.profilePicture ? (
                        <img
                          src={player.profilePicture}
                          alt={rating.playerName}
                          className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg border-4 border-white">
                          {rating.playerName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">{rating.playerName}</h3>
                        <p className="text-slate-600 text-sm">
                          {hours}h {minutes}m playing
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                        <span className="text-xs text-slate-600 font-medium">Buy-In</span>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900">{rating.buyInAmount.toLocaleString()}</div>
                          <div className="text-xs text-blue-600 font-medium">{rating.buyInType}</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 flex justify-between items-center">
                        <span className="text-xs text-slate-600 font-medium">Avg Bet</span>
                        <div className="text-lg font-bold text-slate-900">{rating.averageBet.toLocaleString()}</div>
                      </div>
                    </div>

                    {rating.holdingChips && Object.keys(rating.holdingChips).length > 0 && (
                      <div className="bg-amber-100 border-2 border-amber-400 rounded-lg p-2 mb-3">
                        <div className="flex items-center gap-1 mb-1">
                          <HandCoins className="w-4 h-4 text-amber-700" />
                          <span className="text-xs font-bold text-amber-900">In Pocket</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(rating.holdingChips).map(([denom, count]) => {
                            if (count === 0) return null;
                            const chip = CHIP_DENOMINATIONS.find(c => c.value === parseInt(denom));
                            return (
                              <div key={denom} className={`${chip?.color} text-white px-2 py-0.5 rounded text-xs font-bold`}>
                                {count}×{chip?.label}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onToggleBreak(rating)}
                        className={`flex items-center justify-center gap-1 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                          rating.onBreak
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                      >
                        {rating.onBreak ? 'Resume' : 'Pause'}
                      </button>
                      <button
                        onClick={() => openHoldingChipsDialog(rating)}
                        className="flex items-center justify-center gap-1 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold transition-all"
                      >
                        <HandCoins className="w-4 h-4" />
                        Chips
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Holding Chips Dialog */}
      {showHoldingChipsDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-1">Holding Chips</h2>
                  <p className="text-amber-100 text-lg">{showHoldingChipsDialog.playerName}</p>
                </div>
                <button
                  onClick={() => {
                    setShowHoldingChipsDialog(null);
                    setHoldingChipsAmount({});
                  }}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
                >
                  <Plus className="w-8 h-8 rotate-45" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                <p className="text-amber-900 font-medium">
                  Track chips that the player has taken from the table and put in their pocket. 
                  These chips will be deducted from the float inventory and returned when the rating is closed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHIP_DENOMINATIONS.map(chip => {
                  const count = holdingChipsAmount[chip.value] || 0;
                  const availableInFloat = floatInventory[chip.value] || 0;
                  const canTakeMore = availableInFloat > count;
                  
                  return (
                    <div key={chip.value} className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`${chip.color} text-white px-4 py-2 rounded-lg font-bold text-lg`}>
                          {chip.label}
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{count}</div>
                      </div>
                      
                      {/* Available in Float Indicator */}
                      <div className="mb-2 text-center">
                        <span className="text-xs text-slate-500">Available in Float: </span>
                        <span className={`text-sm font-bold ${availableInFloat === 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {availableInFloat}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newAmount = { ...holdingChipsAmount };
                            newAmount[chip.value] = Math.max(0, (newAmount[chip.value] || 0) - 1);
                            setHoldingChipsAmount(newAmount);
                          }}
                          disabled={count === 0}
                          className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                            count === 0 
                              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                        >
                          <Minus className="w-5 h-5 mx-auto" />
                        </button>
                        <button
                          onClick={() => {
                            if (!canTakeMore) {
                              toast.error(`Not enough ${chip.label} chips available in float (only ${availableInFloat} available)`);
                              return;
                            }
                            const newAmount = { ...holdingChipsAmount };
                            newAmount[chip.value] = (newAmount[chip.value] || 0) + 1;
                            setHoldingChipsAmount(newAmount);
                          }}
                          disabled={!canTakeMore}
                          className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all ${
                            !canTakeMore 
                              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          <Plus className="w-5 h-5 mx-auto" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-6">
                <div className="text-center">
                  <div className="text-slate-400 text-lg mb-2">Total Holding Value</div>
                  <div className="text-4xl font-bold">
                    {Object.entries(holdingChipsAmount).reduce((sum, [denom, count]) => sum + (parseInt(denom) * count), 0).toLocaleString()} FCFA
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowHoldingChipsDialog(null);
                    setHoldingChipsAmount({});
                  }}
                  className="flex-1 px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl text-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveHoldingChips}
                  className="flex-1 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xl font-bold transition-all"
                >
                  Save Holding Chips
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Rating Form */}
      {showStartForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <StartRatingForm
              onSubmit={onSubmitStartForm}
              onCancel={() => setShowStartForm(false)}
              players={players}
              openTables={openTables}
              preselectedTable={preselectedTable}
            />
          </div>
        </div>
      )}
    </div>
  );
}