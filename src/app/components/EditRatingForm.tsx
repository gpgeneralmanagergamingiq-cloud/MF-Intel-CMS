import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

interface ChipDenomination {
  [key: string]: number;
}

interface ActiveRating {
  id: string;
  playerId: string;
  playerName: string;
  tableName: string;
  buyInType: "Cash" | "Chips";
  buyInAmount: number;
  cashAmount?: number;
  averageBet: number;
  currency: string;
  buyInChips: ChipDenomination;
  startTime: string;
  onBreak: boolean;
  breakStartTime?: string;
  totalBreakTime: number;
  status: "Active";
}

interface EditRatingData {
  averageBet: number;
  buyInAmount: number;
  cashAmount?: number;
  chips: ChipDenomination;
}

interface EditRatingFormProps {
  rating: ActiveRating;
  onSubmit: (data: EditRatingData) => void;
  onCancel: () => void;
}

// Chip denominations
const CHIP_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

export function EditRatingForm({ rating, onSubmit, onCancel }: EditRatingFormProps) {
  const [formData, setFormData] = useState<EditRatingData>({
    averageBet: rating.averageBet,
    buyInAmount: rating.buyInAmount,
    cashAmount: rating.cashAmount,
    chips: rating.buyInChips || {
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
  });

  const updateChipCount = (denomination: string, value: number) => {
    const newChips = { ...formData.chips };
    newChips[denomination] = Math.max(0, value);
    
    // Calculate total amount
    const totalAmount = Object.entries(newChips).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );

    setFormData({ ...formData, chips: newChips, buyInAmount: totalAmount });
  };

  const incrementChip = (denomination: string) => {
    updateChipCount(denomination, (formData.chips[denomination] || 0) + 1);
  };

  const decrementChip = (denomination: string) => {
    updateChipCount(denomination, (formData.chips[denomination] || 0) - 1);
  };

  const handleCashAmountChange = (value: number) => {
    // For Cash buy-ins, buyInAmount equals cashAmount
    setFormData({ 
      ...formData, 
      cashAmount: value,
      buyInAmount: value 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For Cash buy-ins, validate cash amount
    if (rating.buyInType === "Cash") {
      if (!formData.cashAmount || formData.cashAmount === 0) {
        alert("Please enter a cash amount. The buy-in amount cannot be zero.");
        return;
      }
    } else {
      // For Chips buy-ins, validate that chips are entered
      if (formData.buyInAmount === 0) {
        alert("Please enter chip denominations. The buy-in amount cannot be zero.");
        return;
      }
    }
    
    onSubmit(formData);
  };

  const sessionDuration = () => {
    const start = new Date(rating.startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-2xl font-bold text-slate-900">
            Edit Rating Session
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Session Info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Player</p>
                <p className="font-medium text-slate-900">{rating.playerName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Table</p>
                <p className="font-medium text-slate-900">{rating.tableName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Buy In Type</p>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  rating.buyInType === "Cash"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {rating.buyInType}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  rating.onBreak
                    ? "bg-orange-100 text-orange-800"
                    : "bg-green-100 text-green-800"
                }`}>
                  {rating.onBreak ? "On Pause" : "Playing"}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-600">Session Duration</p>
                <p className="font-medium text-slate-900">{sessionDuration()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Start Time</p>
                <p className="font-medium text-slate-900">
                  {new Date(rating.startTime).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

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
                  {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{formData.averageBet.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enter a multiplier (e.g., 2 for CFA 10,000, 10 for CFA 50,000)
            </p>
          </div>

          {/* Cash Amount - Only for Cash Buy-Ins */}
          {rating.buyInType === "Cash" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Cash Amount *
              </label>
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">Player Pays:</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={formData.cashAmount || ""}
                    onChange={(e) =>
                      handleCashAmountChange(parseInt(e.target.value || "0"))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-bold text-green-700 text-lg">
                    {rating.currency === "FCFA" ? "CFA" : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  Updating this will adjust the Drop record
                </p>
              </div>
            </div>
          )}

          {/* Chip Denominations - Only for Chips Buy-Ins */}
          {rating.buyInType === "Chips" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Player's Chips *
              </label>
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                {CHIP_DENOMINATIONS.map((denom) => (
                  <div
                    key={denom}
                    className="flex items-center justify-between bg-white rounded-lg p-3 border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-20 font-bold text-slate-900">
                        {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{denom.toLocaleString()}
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
                        {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{((formData.chips[denom.toString()] || 0) * denom).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Total Amount */}
                <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="font-bold text-slate-900 text-lg">
                    Total Chips Amount
                  </div>
                  <div className="font-bold text-blue-600 text-2xl">
                    {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{formData.buyInAmount.toLocaleString()}
                  </div>
                </div>

                <p className="text-xs text-blue-600">
                  Updating chips will adjust the Float transaction
                </p>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}