import { useState } from "react";
import { Plus, Minus, X, Check, Zap } from "lucide-react";

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
  additionalCash: number;
  additionalCashDenominations: ChipDenomination;
  additionalChips: ChipDenomination;
}

interface EndRatingData {
  cashOutAmount: number;
  cashOutChips: ChipDenomination;
  isCashingOut: boolean;
  averageBet: number; // Include averageBet from rating
}

interface InlineEditRatingFormProps {
  rating: ActiveRating;
  onSubmit: (data: EditRatingData) => void;
  onCancel: () => void;
  onEndRating: (data: EndRatingData) => void;
  onJackpotImpulse?: () => void;
  hasFixedOrRandomJackpots?: boolean;
}

// Chip denominations
const CHIP_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

// Cash denominations (same as chips for consistency)
const CASH_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

export function InlineEditRatingForm({ 
  rating, 
  onSubmit, 
  onCancel, 
  onEndRating, 
  onJackpotImpulse, 
  hasFixedOrRandomJackpots = false 
}: InlineEditRatingFormProps) {
  const [formData, setFormData] = useState<EditRatingData>({
    averageBet: rating.averageBet,
    buyInAmount: rating.buyInAmount,
    cashAmount: rating.cashAmount || 0,
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
    additionalCash: 0,
    additionalCashDenominations: {
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
    additionalChips: {
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

  const [showBuyInSection, setShowBuyInSection] = useState(false);
  const [showCloseRatingSection, setShowCloseRatingSection] = useState(false);
  const [cashOutData, setCashOutData] = useState<EndRatingData>({
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
    averageBet: rating.averageBet, // Include averageBet from rating
  });

  const updateAdditionalChipCount = (denomination: string, value: number) => {
    const newAdditionalChips = { ...formData.additionalChips };
    newAdditionalChips[denomination] = Math.max(0, value);
    
    // Calculate additional chip amount
    const additionalChipAmount = Object.entries(newAdditionalChips).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );

    // Calculate new total chips (existing + additional)
    const newTotalChips: ChipDenomination = {};
    // Make sure buyInChips exists before using it
    const existingBuyInChips = rating.buyInChips || {};
    Object.keys(existingBuyInChips).forEach(denom => {
      newTotalChips[denom] = (existingBuyInChips[denom] || 0) + (newAdditionalChips[denom] || 0);
    });
    Object.keys(newAdditionalChips).forEach(denom => {
      if (!newTotalChips[denom]) {
        newTotalChips[denom] = newAdditionalChips[denom];
      }
    });

    // Calculate existing chip amount
    const existingChipAmount = rating.buyInAmount - (rating.cashAmount || 0);
    
    // New total buy-in = existing cash + additional cash + existing chips + additional chips
    const newTotalBuyIn = (rating.cashAmount || 0) + formData.additionalCash + existingChipAmount + additionalChipAmount;
    const newCashAmount = (rating.cashAmount || 0) + formData.additionalCash;

    setFormData({ 
      ...formData, 
      additionalChips: newAdditionalChips,
      chips: newTotalChips,
      buyInAmount: newTotalBuyIn,
      cashAmount: newCashAmount,
    });
  };

  const incrementAdditionalChip = (denomination: string) => {
    updateAdditionalChipCount(denomination, (formData.additionalChips[denomination] || 0) + 1);
  };

  const decrementAdditionalChip = (denomination: string) => {
    updateAdditionalChipCount(denomination, (formData.additionalChips[denomination] || 0) - 1);
  };

  const updateAdditionalCashDenomination = (denomination: string, value: number) => {
    const newAdditionalCashDenoms = { ...formData.additionalCashDenominations };
    newAdditionalCashDenoms[denomination] = Math.max(0, value);
    
    // Calculate additional cash amount
    const additionalCashAmount = Object.entries(newAdditionalCashDenoms).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );

    // Calculate existing chip amount
    const existingChipAmount = rating.buyInAmount - (rating.cashAmount || 0);
    
    // Calculate additional chip amount
    const additionalChipAmount = Object.entries(formData.additionalChips).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );
    
    // New total buy-in = existing cash + additional cash + existing chips + additional chips
    const newTotalBuyIn = (rating.cashAmount || 0) + additionalCashAmount + existingChipAmount + additionalChipAmount;
    const newCashAmount = (rating.cashAmount || 0) + additionalCashAmount;
    
    setFormData({ 
      ...formData, 
      additionalCash: additionalCashAmount,
      additionalCashDenominations: newAdditionalCashDenoms,
      buyInAmount: newTotalBuyIn,
      cashAmount: newCashAmount,
    });
  };

  const incrementAdditionalCash = (denomination: string) => {
    updateAdditionalCashDenomination(denomination, (formData.additionalCashDenominations[denomination] || 0) + 1);
  };

  const decrementAdditionalCash = (denomination: string) => {
    updateAdditionalCashDenomination(denomination, (formData.additionalCashDenominations[denomination] || 0) - 1);
  };

  const updateCashOutChipCount = (denomination: string, value: number) => {
    const newCashOutChips = { ...cashOutData.cashOutChips };
    newCashOutChips[denomination] = Math.max(0, value);
    
    // Calculate total cash out amount
    const totalCashOut = Object.entries(newCashOutChips).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );

    setCashOutData({ 
      ...cashOutData,
      cashOutChips: newCashOutChips,
      cashOutAmount: totalCashOut,
    });
  };

  const incrementCashOutChip = (denomination: string) => {
    updateCashOutChipCount(denomination, (cashOutData.cashOutChips[denomination] || 0) + 1);
  };

  const decrementCashOutChip = (denomination: string) => {
    updateCashOutChipCount(denomination, (cashOutData.cashOutChips[denomination] || 0) - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least some buy-in exists
    if (formData.buyInAmount === 0) {
      alert("Please enter at least some cash or chips. The buy-in amount cannot be zero.");
      return;
    }
    
    onSubmit(formData);
  };

  const handleEndRating = () => {
    // Validate that average bet is not 0
    if (formData.averageBet === 0) {
      alert("Cannot end rating with Average Bet of 0. Please set an average bet before ending the session.");
      return;
    }

    // Make sure cashOutData includes the latest averageBet from formData
    const endData = {
      ...cashOutData,
      averageBet: formData.averageBet,
    };

    onEndRating(endData);
  };

  return (
    <div className="p-6 bg-blue-50 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-bold text-slate-900">
          Edit Rating: {rating.playerName} at {rating.tableName}
        </h4>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Average Bet with Action Buttons */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Average Bet *
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
                className="min-w-[5rem] px-3 py-2 text-center border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2"
                style={{ width: `${Math.max(7, (formData.averageBet / 5000).toString().length + 3)}ch` }}
              />
              <span className="text-slate-600">× 5,000 =</span>
              <span className="font-bold text-slate-900">
                {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{formData.averageBet.toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={() => {
                  if (hasFixedOrRandomJackpots && onJackpotImpulse) {
                    onJackpotImpulse();
                  }
                }}
                disabled={!hasFixedOrRandomJackpots}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors font-medium shadow-lg ${
                  hasFixedOrRandomJackpots
                    ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 animate-pulse cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-50"
                }`}
                title={hasFixedOrRandomJackpots ? "Send impulse to Fixed/Random Jackpots for this table" : "No active Fixed/Random jackpots for this table"}
              >
                <Zap className={`w-5 h-5 ${!hasFixedOrRandomJackpots && "opacity-50"}`} />
                Jackpot Impulse
              </button>
              <button
                type="button"
                onClick={() => setShowBuyInSection(!showBuyInSection)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Buy In
              </button>
              <button
                type="button"
                onClick={() => setShowCloseRatingSection(!showCloseRatingSection)}
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Close Rating
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Current Buy-In (Read-Only) */}
        <div className="bg-slate-100 rounded-lg p-4 border-2 border-slate-300">
          <h4 className="text-sm font-bold text-slate-700 mb-3">Current Buy-In (Read-Only)</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-xs text-slate-600 mb-1">Cash</p>
              <p className="text-lg font-bold text-green-600">
                {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{(rating.cashAmount || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-slate-600 mb-1">Chips</p>
              <p className="text-lg font-bold text-blue-600">
                {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{(rating.buyInAmount - (rating.cashAmount || 0)).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-purple-200">
              <p className="text-xs text-slate-600 mb-1">Total</p>
              <p className="text-lg font-bold text-purple-600">
                {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{rating.buyInAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Buy-In Section (Collapsible) */}
        {showBuyInSection && (
          <>
            {/* Additional Cash */}
            <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-300">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Add More Cash
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {CASH_DENOMINATIONS.map((denom) => (
                  <div
                    key={denom}
                    className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-green-200"
                  >
                    <div className="text-sm font-bold text-green-900 w-24">
                      {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{denom.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => decrementAdditionalCash(denom.toString())}
                        className="p-1 rounded bg-green-200 hover:bg-green-300 text-green-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={formData.additionalCashDenominations[denom.toString()] || ""}
                        onChange={(e) =>
                          updateAdditionalCashDenomination(denom.toString(), parseInt(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-center border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => incrementAdditionalCash(denom.toString())}
                        className="p-1 rounded bg-green-200 hover:bg-green-300 text-green-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {formData.additionalCash > 0 && (
                <div className="mt-3 p-2 bg-green-100 rounded-lg border border-green-300">
                  <p className="text-sm font-bold text-green-800">
                    Total Cash to Add: {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{formData.additionalCash.toLocaleString()}
                  </p>
                </div>
              )}
              <p className="text-xs text-green-600 mt-2">
                This will be added to Drop and to the player's buy-in
              </p>
            </div>

            {/* Additional Chips */}
            <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-blue-300">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Add More Chips
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {CHIP_DENOMINATIONS.map((denom) => (
                  <div
                    key={denom}
                    className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border"
                  >
                    <div className="text-sm font-bold text-slate-900 w-24">
                      {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{denom.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => decrementAdditionalChip(denom.toString())}
                        className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={formData.additionalChips[denom.toString()] || ""}
                        onChange={(e) =>
                          updateAdditionalChipCount(denom.toString(), parseInt(e.target.value) || 0)
                        }
                        className="w-12 px-2 py-1 text-center text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => incrementAdditionalChip(denom.toString())}
                        className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Chips deducted from the Float and added to the player
              </p>
            </div>

            {/* New Total Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-2 border-purple-300">
              <h4 className="text-sm font-bold text-slate-700 mb-3">New Buy-In Total</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
                  <div className="font-medium text-slate-700">
                    Total Cash ({(rating.cashAmount || 0).toLocaleString()} + {formData.additionalCash.toLocaleString()})
                  </div>
                  <div className="font-bold text-green-600 text-lg">
                    {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{(formData.cashAmount || 0).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-blue-200">
                  <div className="font-medium text-slate-700">
                    Total Chips
                  </div>
                  <div className="font-bold text-blue-600 text-lg">
                    {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{(formData.buyInAmount - (formData.cashAmount || 0)).toLocaleString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border-2 border-purple-300">
                  <div className="font-bold text-slate-900 text-xl">
                    New Total Buy-In
                  </div>
                  <div className="font-bold text-purple-600 text-2xl">
                    {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{formData.buyInAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Close Rating Section (Collapsible) */}
        {showCloseRatingSection && (
          <>
            {/* Checkbox for Cash Out */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="isCashingOutInline"
                  checked={cashOutData.isCashingOut}
                  onChange={(e) => {
                    const isCashing = e.target.checked;
                    if (!isCashing) {
                      // Clear cash out data when not cashing out, but preserve averageBet
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
                      setCashOutData({ cashOutAmount: 0, cashOutChips: emptyChips, isCashingOut: false, averageBet: formData.averageBet });
                    } else {
                      setCashOutData({ ...cashOutData, isCashingOut: true });
                    }
                  }}
                  className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isCashingOutInline" className="flex-1 cursor-pointer">
                  <div className="text-lg font-bold text-slate-900 mb-1">
                    Player is cashing out chips
                  </div>
                  <p className="text-sm text-slate-600">
                    {cashOutData.isCashingOut 
                      ? "✓ Chips will be entered below and returned to the table float"
                      : "✗ Player is keeping chips at the table - no cash-out will be recorded"}
                  </p>
                </label>
              </div>
            </div>

            {cashOutData.isCashingOut ? (
              <>
                {/* Cash Out Chips */}
                <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-orange-300">
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Cash Out - Chips Held by Player
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {CHIP_DENOMINATIONS.map((denom) => (
                      <div
                        key={denom}
                        className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border"
                      >
                        <div className="text-sm font-bold text-slate-900 w-24">
                          {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{denom.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => decrementCashOutChip(denom.toString())}
                            className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={cashOutData.cashOutChips[denom.toString()] || ""}
                            onChange={(e) =>
                              updateCashOutChipCount(denom.toString(), parseInt(e.target.value) || 0)
                            }
                            className="w-12 px-2 py-1 text-center text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => incrementCashOutChip(denom.toString())}
                            className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cash Out Summary */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-2 border-orange-300">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Cash Out Summary</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white rounded-lg p-4 border-2 border-orange-200">
                      <div className="font-bold text-slate-900 text-lg">
                        Total Cash Out Amount
                      </div>
                      <div className="font-bold text-orange-600 text-2xl">
                        {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{cashOutData.cashOutAmount.toLocaleString()}
                      </div>
                    </div>

                    <div className={`flex items-center justify-between rounded-lg p-4 border-2 ${
                      cashOutData.cashOutAmount - rating.buyInAmount >= 0
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}>
                      <div className="font-bold text-slate-900 text-lg">
                        {cashOutData.cashOutAmount - rating.buyInAmount >= 0 ? "Win" : "Loss"}
                      </div>
                      <div className={`font-bold text-2xl ${
                        cashOutData.cashOutAmount - rating.buyInAmount >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                        {cashOutData.cashOutAmount - rating.buyInAmount >= 0 ? "+" : ""}
                        {rating.currency === "FCFA" ? "CFA " : rating.currency === "PHP" ? "₱" : rating.currency === "EUR" ? "€" : rating.currency === "GBP" ? "£" : rating.currency === "CNY" || rating.currency === "JPY" ? "¥" : rating.currency === "KRW" ? "₩" : "$"}{(cashOutData.cashOutAmount - rating.buyInAmount).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* End Rating Button */}
                  <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowCloseRatingSection(false)}
                      className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleEndRating}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      End Rating
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 font-medium text-lg text-center mb-4">
                  Player is keeping their chips
                </p>
                <p className="text-blue-600 text-sm text-center mb-6">
                  Session will end with no cash-out recorded. Win/Loss calculation will be N/A.
                </p>
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCloseRatingSection(false)}
                    className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleEndRating}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    End Rating
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </form>
    </div>
  );
}