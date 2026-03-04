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
  cashAmount?: number; // Only for Cash buy-ins
  currency: string;
  buyInChips: ChipDenomination;
  startTime: string;
  averageBet: number;
  isRefused?: boolean; // Indicates if player refused rating
  refusedReason?: string; // Guest description (physical features, clothing, etc.)
}

interface EndRatingData {
  cashOutAmount: number;
  cashOutChips: ChipDenomination;
  isCashingOut: boolean;
  averageBet: number; // Add averageBet to end rating data
}

interface EndRatingFormProps {
  rating: ActiveRating;
  onSubmit: (data: EndRatingData) => void;
  onCancel: () => void;
  onUpdateAverageBet?: (averageBet: number) => void; // Optional callback to update average bet
}

// Chip denominations
const CHIP_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

export function EndRatingForm({ rating, onSubmit, onCancel, onUpdateAverageBet }: EndRatingFormProps) {
  const [formData, setFormData] = useState<EndRatingData>({
    cashOutAmount: 0,
    cashOutChips: {
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
    isCashingOut: true,
    averageBet: rating.averageBet, // Initialize with the current average bet
  });

  const updateChipCount = (denomination: string, value: number) => {
    const newChips = { ...formData.cashOutChips };
    newChips[denomination] = Math.max(0, value);
    
    // Calculate total amount
    const totalAmount = Object.entries(newChips).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );

    setFormData({ ...formData, cashOutChips: newChips, cashOutAmount: totalAmount });
  };

  const incrementChip = (denomination: string) => {
    updateChipCount(denomination, (formData.cashOutChips[denomination] || 0) + 1);
  };

  const decrementChip = (denomination: string) => {
    updateChipCount(denomination, (formData.cashOutChips[denomination] || 0) - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that average bet is not 0
    if (formData.averageBet === 0) {
      alert("Cannot end rating with Average Bet of 0. Please edit the rating to set an average bet before ending the session.");
      return;
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
            End Rating Session
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
              {rating.buyInType === "Cash" && rating.cashAmount && (
                <>
                  <div>
                    <p className="text-sm text-slate-600">Cash Paid (Drop)</p>
                    <p className="font-medium text-green-700">
                      {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{rating.cashAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Chips Received (Float)</p>
                    <p className="font-medium text-blue-700">
                      {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{rating.buyInAmount.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
              {rating.buyInType === "Chips" && (
                <div>
                  <p className="text-sm text-slate-600">Chips Buy In (Float)</p>
                  <p className="font-medium text-slate-900">
                    {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{rating.buyInAmount.toLocaleString()}
                  </p>
                </div>
              )}
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

          {/* Average Bet - Editable */}
          <div className={`rounded-lg p-4 border-2 ${formData.averageBet === 0 ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'}`}>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Average Bet {formData.averageBet === 0 && <span className="text-red-600 font-bold">(Required - Must be set)</span>}
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={formData.averageBet / 5000}
                  onChange={(e) =>
                    setFormData({ ...formData, averageBet: parseInt(e.target.value || "0") * 5000 })
                  }
                  className="min-w-[6rem] px-4 py-2 text-center text-lg font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2"
                  style={{ width: `${Math.max(7, (formData.averageBet / 5000).toString().length + 3)}ch` }}
                />
                <span className="text-slate-600 font-medium">× 5,000 =</span>
                <span className={`text-2xl font-bold ${formData.averageBet === 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{formData.averageBet.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              Set the average bet amount before ending the session. This is required for player rating calculations.
            </p>
          </div>

          {/* Cash Out Chip Denominations */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Cash Out - Chips Held by Player
            </label>
            
            {/* Prominent Checkbox Section */}
            <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="isCashingOut"
                  checked={formData.isCashingOut}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      // Clear cash out data when not cashing out
                      const emptyChips = {
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
                      };
                      setFormData({ ...formData, cashOutAmount: 0, cashOutChips: emptyChips, isCashingOut: false });
                    } else {
                      // When checking the box, just update the flag
                      setFormData({ ...formData, isCashingOut: true });
                    }
                  }}
                  className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isCashingOut" className="flex-1 cursor-pointer">
                  <div className="text-lg font-bold text-slate-900 mb-1">
                    Player is cashing out chips
                  </div>
                  <p className="text-sm text-slate-600">
                    {formData.isCashingOut 
                      ? "✓ Chips will be entered below and returned to the table float"
                      : "✗ Player is keeping chips at the table - no cash-out will be recorded"}
                  </p>
                </label>
              </div>
            </div>
            
            {formData.isCashingOut ? (
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
                      value={formData.cashOutChips[denom.toString()] || ""}
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
                      {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{((formData.cashOutChips[denom.toString()] || 0) * denom).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Total Amount */}
              <div className="flex items-center justify-between bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                <div className="font-bold text-slate-900 text-lg">
                  Total Cash Out Amount
                </div>
                <div className="font-bold text-orange-600 text-2xl">
                  {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{formData.cashOutAmount.toLocaleString()}
                </div>
              </div>

              {/* Win/Loss Display */}
              <div className={`flex items-center justify-between rounded-lg p-4 border-2 ${
                formData.cashOutAmount - rating.buyInAmount >= 0
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}>
                <div className="font-bold text-slate-900 text-lg">
                  {formData.cashOutAmount - rating.buyInAmount >= 0 ? "Win" : "Loss"}
                </div>
                <div className={`font-bold text-2xl ${
                  formData.cashOutAmount - rating.buyInAmount >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}>
                  {formData.cashOutAmount - rating.buyInAmount >= 0 ? "+" : ""}
                  {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{(formData.cashOutAmount - rating.buyInAmount).toLocaleString()}
                </div>
              </div>
            </div>
            ) : (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <p className="text-blue-800 font-medium text-lg">
                  Player is keeping their chips
                </p>
                <p className="text-blue-600 text-sm mt-2">
                  Session will end with no cash-out recorded. Win/Loss calculation will be N/A.
                </p>
              </div>
            )}
          </div>

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
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              End Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}