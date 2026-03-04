import { useState } from "react";
import { X, DollarSign } from "lucide-react";

interface ChipDenomination {
  [key: string]: number;
}

interface TipsData {
  id: string;
  pitBossName: string;
  tableName: string;
  gamingDay: string;
  amount: number;
  currency: string;
  chips: ChipDenomination;
  timestamp: string;
  notes: string;
}

interface TipsFormProps {
  onSubmit: (data: TipsData) => void;
  onCancel: () => void;
  currentUser: { username: string; userType: string } | null;
}

// Chip denominations
const CHIP_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

export function TipsForm({ onSubmit, onCancel, currentUser }: TipsFormProps) {
  const [formData, setFormData] = useState<Omit<TipsData, 'id' | 'timestamp'>>({
    pitBossName: currentUser?.username || "",
    tableName: "",
    gamingDay: "",
    amount: 0,
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
    notes: "",
  });

  const handleChipChange = (denomination: string, value: number) => {
    const newChips = {
      ...formData.chips,
      [denomination]: value,
    };

    const total = CHIP_DENOMINATIONS.reduce((sum, denom) => {
      return sum + denom * (newChips[denom.toString()] || 0);
    }, 0);

    setFormData({
      ...formData,
      chips: newChips,
      amount: total,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tipsData: TipsData = {
      ...formData,
      id: `tip-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    onSubmit(tipsData);
  };

  const getCurrencySymbol = (currency: string) => {
    if (currency === "FCFA") return "CFA ";
    if (currency === "PHP") return "₱";
    if (currency === "EUR") return "€";
    if (currency === "GBP") return "£";
    if (currency === "CNY" || currency === "JPY") return "¥";
    if (currency === "KRW") return "₩";
    return "$";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Record Tips</h3>
              <p className="text-sm text-slate-600">Enter tip details and chip breakdown</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pit Boss Name
              </label>
              <input
                type="text"
                value={formData.pitBossName}
                onChange={(e) => setFormData({ ...formData, pitBossName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-slate-50"
                placeholder="Auto-filled from logged user"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Table Name
              </label>
              <input
                type="text"
                value={formData.tableName}
                onChange={(e) => setFormData({ ...formData, tableName: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter table name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gaming Day
              </label>
              <input
                type="date"
                value={formData.gamingDay}
                onChange={(e) => setFormData({ ...formData, gamingDay: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="FCFA">FCFA (CFA Franc)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PHP">PHP (₱)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="KRW">KRW (₩)</option>
              </select>
            </div>
          </div>

          {/* Chip Denominations */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Chip Breakdown
            </label>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {CHIP_DENOMINATIONS.map((denom) => (
                  <div key={denom} className="bg-white rounded-lg p-3 border border-slate-200">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      {getCurrencySymbol(formData.currency)}{denom.toLocaleString()}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.chips[denom.toString()] || ""}
                      onChange={(e) =>
                        handleChipChange(denom.toString(), parseInt(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                ))}
              </div>

              {/* Total Display */}
              <div className="mt-4 pt-4 border-t border-slate-300">
                <div className="flex items-center justify-between bg-green-50 rounded-lg p-4 border-2 border-green-300">
                  <span className="text-sm font-semibold text-green-900">Total Tips Amount:</span>
                  <span className="text-2xl font-bold text-green-900">
                    {getCurrencySymbol(formData.currency)}{formData.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Save Tips
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}