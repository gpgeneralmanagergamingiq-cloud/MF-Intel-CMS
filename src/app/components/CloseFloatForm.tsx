import { useState } from "react";
import { X, Plus, Minus, TrendingUp, TrendingDown } from "lucide-react";

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

interface CloseFloatFormProps {
  float: Float;
  onSubmit: (closeData: { closingChips: ChipDenomination; closingAmount: number; cashAmount: number; dropAmount: number; notes: string }) => void;
  onCancel: () => void;
  totalDropAmount?: number;
  totalFills?: number;
  totalCredits?: number;
}

// Chip denominations
const CHIP_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

export function CloseFloatForm({ float, onSubmit, onCancel, totalDropAmount = 0, totalFills = 0, totalCredits = 0 }: CloseFloatFormProps) {
  const [closingChips, setClosingChips] = useState<ChipDenomination>({
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
  const [notes, setNotes] = useState("");
  
  // Calculate cash amount from denominations
  const cashAmount = CHIP_DENOMINATIONS.reduce((sum, denom) => {
    return sum + (cashDenominations[denom.toString()] || 0) * denom;
  }, 0);
  
  // Drop amount is the same as cash amount!
  const dropAmount = cashAmount;

  const updateChipCount = (denomination: string, value: number) => {
    const newChips = { ...closingChips };
    newChips[denomination] = Math.max(0, value);
    setClosingChips(newChips);
  };

  const incrementChip = (denomination: string) => {
    updateChipCount(denomination, (closingChips[denomination] || 0) + 1);
  };

  const decrementChip = (denomination: string) => {
    updateChipCount(denomination, (closingChips[denomination] || 0) - 1);
  };

  const updateCashCount = (denomination: string, value: number) => {
    const newCash = { ...cashDenominations };
    newCash[denomination] = Math.max(0, value);
    setCashDenominations(newCash);
  };

  const incrementCash = (denomination: string) => {
    updateCashCount(denomination, (cashDenominations[denomination] || 0) + 1);
  };

  const decrementCash = (denomination: string) => {
    updateCashCount(denomination, (cashDenominations[denomination] || 0) - 1);
  };

  const calculateTotal = () => {
    return Object.entries(closingChips).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );
  };

  const closingAmount = calculateTotal() || 0;
  const openingAmount = float.amount ?? 0;
  
  // Closer is ONLY chips (not chips + cash)
  const closerAmount = closingAmount;
  
  // Win/Loss calculation: Closer + Credits + Drop - Opener - Fills
  const winLoss = closerAmount + totalCredits + dropAmount - openingAmount - totalFills;

  const getCurrencySymbol = (currency?: string) => {
    if (!currency || currency === "FCFA") return "CFA ";
    if (currency === "PHP") return "₱";
    if (currency === "EUR") return "€";
    if (currency === "GBP") return "£";
    if (currency === "CNY" || currency === "JPY") return "¥";
    if (currency === "KRW") return "₩";
    return "$";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== CLOSE FLOAT FORM SUBMIT ===");
    console.log("closingChips:", closingChips);
    console.log("closingAmount:", closingAmount);
    console.log("cashAmount:", cashAmount);
    console.log("dropAmount:", dropAmount);
    console.log("notes:", notes);
    console.log("Submitting object:", { closingChips, closingAmount, cashAmount, dropAmount, notes });
    console.log("================================");
    
    onSubmit({ closingChips, closingAmount, cashAmount, dropAmount, notes });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Close Float - {float.tableName}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Dealer: {float.dealerName}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Opening Float Summary */}
          <div className="bg-slate-50 rounded-lg p-4 border">
            <h4 className="font-semibold text-slate-900 mb-3">Table Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600">Table Opener</p>
                <p className="text-lg font-bold text-slate-900">
                  {getCurrencySymbol(float.currency)}{openingAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Fills</p>
                <p className="text-lg font-bold text-green-600">
                  +{getCurrencySymbol(float.currency)}{totalFills.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Credits</p>
                <p className="text-lg font-bold text-amber-600">
                  -{getCurrencySymbol(float.currency)}{totalCredits.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Cash Drop</p>
                <p className="text-lg font-bold text-blue-600">
                  {getCurrencySymbol(float.currency)}{totalDropAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Opened At</p>
                <p className="text-sm text-slate-900">
                  {new Date(float.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Closing Chip Denominations */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Closing Float - Enter Chip Counts *
            </label>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              {CHIP_DENOMINATIONS.map((denom) => (
                <div
                  key={denom}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-32 font-bold text-slate-900">
                      {getCurrencySymbol(float.currency)}{denom.toLocaleString()}
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
                      value={closingChips[denom.toString()] || ""}
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
                    <div className="w-32 text-right font-medium text-slate-700">
                      {getCurrencySymbol(float.currency)}{((closingChips[denom.toString()] || 0) * denom).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cash Amount Field (Also the Drop Amount) */}
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
            <label className="block text-lg font-bold text-purple-900 mb-2">
              Cash Amount / Drop Amount *
            </label>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              {CHIP_DENOMINATIONS.map((denom) => (
                <div
                  key={denom}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-32 font-bold text-slate-900">
                      {getCurrencySymbol(float.currency)}{denom.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decrementCash(denom.toString())}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={cashDenominations[denom.toString()] || ""}
                      onChange={(e) =>
                        setCashDenominations({
                          ...cashDenominations,
                          [denom.toString()]: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-3 py-2 text-center border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => incrementCash(denom.toString())}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <div className="w-32 text-right font-medium text-slate-700">
                      {getCurrencySymbol(float.currency)}{((cashDenominations[denom.toString()] || 0) * denom).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-purple-700 mt-2 font-medium">
              ⚠️ REQUIRED: Enter the cash/drop amount from the closing sheet (current: {getCurrencySymbol(float.currency)}{cashAmount.toLocaleString()})
            </p>
            {totalDropAmount > 0 && (
              <p className="text-xs text-purple-600 mt-1">
                (Player ratings total: {getCurrencySymbol(float.currency)}{totalDropAmount.toLocaleString()} - you can use this as reference)
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="font-bold text-slate-900 text-lg">
                Closing Float (Chips Only)
              </div>
              <div className="font-bold text-blue-600 text-2xl">
                {getCurrencySymbol(float.currency)}{closerAmount.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center justify-between bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <div className="font-bold text-slate-900 text-lg">
                Cash Drop Amount
              </div>
              <div className="font-bold text-purple-600 text-2xl">
                {getCurrencySymbol(float.currency)}{cashAmount.toLocaleString()}
              </div>
            </div>

            {/* Win/Loss Display */}
            <div className={`flex items-center justify-between rounded-lg p-4 border-2 ${
              winLoss > 0 
                ? "bg-green-50 border-green-200" 
                : winLoss < 0 
                ? "bg-red-50 border-red-200" 
                : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center gap-3">
                {winLoss > 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <div className="font-bold text-slate-900 text-lg">
                    Table Win/Loss
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Closer + Credits + Drop - Opener - Fills
                  </p>
                </div>
              </div>
              <div className={`font-bold text-2xl ${
                winLoss > 0 
                  ? "text-green-600" 
                  : winLoss < 0 
                  ? "text-red-600" 
                  : "text-slate-600"
              }`}>
                {winLoss > 0 ? "+" : ""}{getCurrencySymbol(float.currency)}{winLoss.toLocaleString()}
              </div>
            </div>

            {/* Detailed Calculation */}
            <div className="bg-slate-50 rounded-lg p-4 border text-sm">
              <p className="font-semibold text-slate-700 mb-2">Calculation Breakdown:</p>
              <div className="space-y-1 text-slate-600">
                <p>Closing Float (Chips): {getCurrencySymbol(float.currency)}{closerAmount.toLocaleString()}</p>
                <p>+ Total Credits: {getCurrencySymbol(float.currency)}{totalCredits.toLocaleString()}</p>
                <p>+ Total Cash Drop: {getCurrencySymbol(float.currency)}{dropAmount.toLocaleString()}</p>
                <p>- Table Opener: {getCurrencySymbol(float.currency)}{openingAmount.toLocaleString()}</p>
                <p>- Total Fills: {getCurrencySymbol(float.currency)}{totalFills.toLocaleString()}</p>
                <div className="border-t border-slate-300 mt-2 pt-2 font-semibold text-slate-900">
                  = Win/Loss: {getCurrencySymbol(float.currency)}{winLoss.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Closing Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any notes about the closing float..."
            />
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
              Close Float
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}