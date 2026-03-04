import { useState } from "react";
import { X, Plus, Minus, Camera } from "lucide-react";
import { TableLayout, Seat } from "./TableLayout";
import { QRScanner } from "./QRScanner";

interface ChipDenomination {
  [key: string]: number;
}

interface Player {
  id: string;
  name: string;
  memberId: string;
}

interface OpenTable {
  id: string;
  tableName: string;
  currency?: string;
  gameType?: string;
}

interface StartRatingData {
  playerId: string;
  playerName: string;
  tableName: string;
  seatNumber?: number;
  buyInType: "Cash" | "Chips";
  buyInAmount: number;
  cashAmount?: number; // Only for Cash buy-ins
  averageBet: number;
  currency: string;
  chips: ChipDenomination;
  isRefused?: boolean; // Indicates if player refused rating
  refusedReason?: string; // Guest description (physical features, clothing, etc.)
}

interface StartRatingFormProps {
  onSubmit: (data: StartRatingData) => void;
  onCancel: () => void;
  players: Player[];
  openTables: OpenTable[];
  preselectedTable?: string;
  preselectedSeat?: number;
  existingRatingsAtTable?: Array<{ playerId: string; playerName: string; seatNumber?: number }>;
}

// Chip denominations
const CHIP_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

// Cash denominations (same as chips for consistency)
const CASH_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

export function StartRatingForm({ onSubmit, onCancel, players, openTables, preselectedTable = "", preselectedSeat, existingRatingsAtTable = [] }: StartRatingFormProps) {
  const [formData, setFormData] = useState<StartRatingData>({
    playerId: "",
    playerName: "",
    tableName: preselectedTable,
    seatNumber: preselectedSeat,
    buyInType: "Chips",
    buyInAmount: 0,
    cashAmount: 0,
    averageBet: 0,
    currency: "FCFA",
    chips: {
      "10000000": 0,
      "5000000": 0,
      "1000000": 0,
      "500000": 0,
      "100000": 0,
      "50000": 0,
      "25000": 0,
      "10000": 0,
      "5000": 0,
      "1000": 0,
      "500": 0,
      "250": 0,
    },
    isRefused: false,
    refusedReason: "",
  });

  const [cashDenominations, setCashDenominations] = useState<ChipDenomination>({
    "10000000": 0,
    "5000000": 0,
    "1000000": 0,
    "500000": 0,
    "100000": 0,
    "50000": 0,
    "25000": 0,
    "10000": 0,
    "5000": 0,
    "1000": 0,
    "500": 0,
    "250": 0,
  });

  // State for seat management
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedGameType, setSelectedGameType] = useState<string>("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  const updateChipCount = (denomination: string, value: number) => {
    const newChips = { ...formData.chips };
    newChips[denomination] = Math.max(0, value);
    
    // Calculate total chip amount
    const chipAmount = Object.entries(newChips).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );

    // Total buy-in = cash + chips
    const totalBuyIn = (formData.cashAmount || 0) + chipAmount;

    setFormData({ ...formData, chips: newChips, buyInAmount: totalBuyIn });
  };

  const incrementChip = (denomination: string) => {
    updateChipCount(denomination, (formData.chips[denomination] || 0) + 1);
  };

  const decrementChip = (denomination: string) => {
    updateChipCount(denomination, (formData.chips[denomination] || 0) - 1);
  };

  const updateCashDenomination = (denomination: string, value: number) => {
    const newCashDenoms = { ...cashDenominations };
    newCashDenoms[denomination] = Math.max(0, value);
    
    // Calculate total cash amount
    const cashAmount = Object.entries(newCashDenoms).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );

    // Calculate chip amount
    const chipAmount = Object.entries(formData.chips).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );
    
    // Total buy-in = cash + chips
    const totalBuyIn = cashAmount + chipAmount;
    
    setCashDenominations(newCashDenoms);
    setFormData({ 
      ...formData, 
      cashAmount: cashAmount,
      buyInAmount: totalBuyIn 
    });
  };

  const incrementCash = (denomination: string) => {
    updateCashDenomination(denomination, (cashDenominations[denomination] || 0) + 1);
  };

  const decrementCash = (denomination: string) => {
    updateCashDenomination(denomination, (cashDenominations[denomination] || 0) - 1);
  };

  const handleCashAmountChange = (value: number) => {
    // Calculate chip amount
    const chipAmount = Object.entries(formData.chips).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );
    
    // Total buy-in = cash + chips
    const totalBuyIn = value + chipAmount;
    
    setFormData({ 
      ...formData, 
      cashAmount: value,
      buyInAmount: totalBuyIn 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If player refused rating, validate reason is provided
    if (formData.isRefused) {
      if (!formData.refusedReason || formData.refusedReason.trim() === "") {
        alert("Please provide a reason for the refused rating.");
        return;
      }
    } else {
      // Only validate buy-in if rating is NOT refused
      if (formData.buyInAmount === 0) {
        alert("Please enter at least some cash or chips. The buy-in amount cannot be zero.");
        return;
      }
    }
    
    // Determine buy-in type based on what was entered
    let buyInType: "Cash" | "Chips" = "Chips";
    const chipAmount = formData.buyInAmount - (formData.cashAmount || 0);
    
    if ((formData.cashAmount || 0) > 0 && chipAmount === 0) {
      buyInType = "Cash";
    } else if (chipAmount > 0 && (formData.cashAmount || 0) === 0) {
      buyInType = "Chips";
    } else if ((formData.cashAmount || 0) > 0 && chipAmount > 0) {
      // Both cash and chips - use whichever is larger to determine primary type
      buyInType = (formData.cashAmount || 0) > chipAmount ? "Cash" : "Chips";
    }
    
    const submissionData = {
      ...formData,
      buyInType,
    };
    
    onSubmit(submissionData);
  };

  const handlePlayerChange = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    setFormData({
      ...formData,
      playerId,
      playerName: player?.name || "",
    });
  };

  const handleTableChange = (tableName: string) => {
    const selectedTable = openTables.find(t => t.tableName === tableName);
    setFormData({
      ...formData,
      tableName,
      currency: selectedTable?.currency || "FCFA",
    });
    setSelectedGameType(selectedTable?.gameType || "");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-2xl font-bold text-slate-900">
            Start Rating Session
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Player and Table Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Player {!formData.isRefused && '*'}
              </label>
              <div className="flex gap-2">
                <select
                  required={!formData.isRefused}
                  value={formData.playerId}
                  onChange={(e) => handlePlayerChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={formData.isRefused}
                >
                  <option value="">{formData.isRefused ? "Guest / Unknown Player" : "Select Player"}</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name} ({player.memberId})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowQRScanner(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Scan QR Code"
                  disabled={formData.isRefused}
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {formData.isRefused ? "Guest player - no member selected" : "Select from list or scan player QR card"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Table *
              </label>
              <select
                required
                value={formData.tableName}
                onChange={(e) => handleTableChange(e.target.value)}
                disabled={!!preselectedTable}
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  preselectedTable ? 'bg-slate-100 cursor-not-allowed' : ''
                }`}
              >
                <option value="">Select Table</option>
                {openTables.map((table) => (
                  <option key={table.id} value={table.tableName}>
                    {table.tableName}
                  </option>
                ))}
              </select>
              {preselectedTable && (
                <p className="text-xs text-blue-600 mt-1">
                  ✓ Table pre-selected from dashboard
                </p>
              )}
            </div>
          </div>

          {/* Seat Selection */}
          {formData.tableName && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Seat Number (Optional)
              </label>
              <select
                value={formData.seatNumber || ""}
                onChange={(e) => setFormData({ ...formData, seatNumber: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No seat assigned</option>
                {(selectedGameType === "Texas Hold'em" || selectedGameType === "Roulette" 
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                  : [1, 2, 3, 4, 5, 6]
                ).map((seatNum) => {
                  const isOccupied = existingRatingsAtTable.some(
                    (r) => r.seatNumber === seatNum && r.playerId !== formData.playerId
                  );
                  return (
                    <option key={seatNum} value={seatNum} disabled={isOccupied}>
                      Seat {seatNum}{isOccupied ? " (Occupied)" : ""}
                    </option>
                  );
                })}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                {selectedGameType === "Texas Hold'em" || selectedGameType === "Roulette"
                  ? "10 seats available (Texas Hold'em/Roulette)"
                  : "6 seats available (Blackjack/Baccarat/Other games)"}
              </p>
            </div>
          )}

          {/* Average Bet */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Average Bet (Multiplier of 5,000) *
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.averageBet / 5000}
                onChange={(e) =>
                  setFormData({ ...formData, averageBet: parseInt(e.target.value || "0") * 5000 })
                }
                className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2"
              />
              <span className="text-slate-600">×</span>
              <div className="flex-1 bg-slate-50 px-4 py-2 rounded-lg border">
                <span className="text-sm text-slate-600">Average Bet Amount: </span>
                <span className="font-bold text-slate-900">
                  {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{formData.averageBet.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enter a multiplier (e.g., 2 for CFA 10,000, 10 for CFA 50,000)
            </p>
          </div>

          {/* Refused Rating Option */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRefused || false}
                onChange={(e) => setFormData({ ...formData, isRefused: e.target.checked, refusedReason: e.target.checked ? formData.refusedReason : "" })}
                className="w-5 h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
              />
              <span className="text-sm font-bold text-yellow-900">
                Player Refused Rating
              </span>
            </label>
            <p className="text-xs text-yellow-700 mt-2 ml-8">
              Check this if the player declined to be rated for this session
            </p>
            
            {formData.isRefused && (
              <div className="mt-3 ml-8">
                <label className="block text-sm font-medium text-yellow-900 mb-1">
                  Guest Description *
                </label>
                <textarea
                  value={formData.refusedReason || ""}
                  onChange={(e) => setFormData({ ...formData, refusedReason: e.target.value })}
                  className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                  rows={3}
                  placeholder="Describe the guest (e.g., black t-shirt, blue eyes, tall, shaking, Chinese, beard, etc.)"
                  required={formData.isRefused}
                />
              </div>
            )}
          </div>

          {/* Cash Amount - Only show if not refused */}
          {!formData.isRefused && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Cash Buy-In Amount
            </label>
            <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {CASH_DENOMINATIONS.map((denom) => (
                  <div
                    key={denom}
                    className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-green-200"
                  >
                    <div className="text-sm font-bold text-green-900 w-24">
                      {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{denom.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => decrementCash(denom.toString())}
                        className="p-1 rounded bg-green-200 hover:bg-green-300 text-green-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={cashDenominations[denom.toString()] || ""}
                        onChange={(e) =>
                          updateCashDenomination(denom.toString(), parseInt(e.target.value) || 0)
                        }
                        className="w-20 px-3 py-2 text-center border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => incrementCash(denom.toString())}
                        className="p-1 rounded bg-green-200 hover:bg-green-300 text-green-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {formData.cashAmount > 0 && (
                <div className="mt-3 p-2 bg-green-100 rounded-lg border border-green-300">
                  <p className="text-sm font-bold text-green-800">
                    Total Cash: {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{formData.cashAmount.toLocaleString()}
                  </p>
                </div>
              )}
              <p className="text-xs text-green-600 mt-2">
                This will be added to Drop record
              </p>
            </div>
          </div>
          )}

          {/* Chip Denominations - Only show if not refused */}
          {!formData.isRefused && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Chips Buy-In Amount
            </label>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              {CHIP_DENOMINATIONS.map((denom) => (
                <div
                  key={denom}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-20 font-bold text-slate-900">
                      {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{denom.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decrementChip(denom.toString())}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={formData.chips[denom.toString()] || ""}
                      onChange={(e) =>
                        updateChipCount(denom.toString(), parseInt(e.target.value) || 0)
                      }
                      className="w-20 px-3 py-2 text-center border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => incrementChip(denom.toString())}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-28 text-right font-medium text-slate-700">
                      {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{((formData.chips[denom.toString()] || 0) * denom).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Summary - Cash + Chips = Total */}
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="font-medium text-slate-700">
                    Cash Amount
                  </div>
                  <div className="font-bold text-green-600 text-lg">
                    {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{(formData.cashAmount || 0).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="font-medium text-slate-700">
                    Chips Amount
                  </div>
                  <div className="font-bold text-blue-600 text-lg">
                    {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{(formData.buyInAmount - (formData.cashAmount || 0)).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-purple-100 rounded-lg p-4 border-2 border-purple-300">
                  <div className="font-bold text-slate-900 text-lg">
                    Total Buy-In Amount
                  </div>
                  <div className="font-bold text-purple-600 text-2xl">
                    {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{formData.buyInAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Rating
            </button>
          </div>
        </form>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScan={(playerId) => {
            // Find player by ID or memberId
            const player = players.find(p => p.id === playerId || p.memberId === playerId);
            if (player) {
              handlePlayerChange(player.id);
              setShowQRScanner(false);
            } else {
              alert(`Player with ID ${playerId} not found`);
              setShowQRScanner(false);
            }
          }}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}