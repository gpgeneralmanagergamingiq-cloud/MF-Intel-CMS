import { useState } from "react";
import { X, AlertTriangle, FileText } from "lucide-react";

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

interface CorrectionReport {
  id: string;
  floatId: string;
  tableName: string;
  originalAmount: number;
  correctedAmount: number;
  originalChips: ChipDenomination;
  correctedChips: ChipDenomination;
  reason: string;
  correctedBy: string;
  timestamp: string;
}

interface CorrectOpeningFloatProps {
  float: Float;
  onSubmit: (correctedFloat: Float, correctionReport: CorrectionReport) => void;
  onCancel: () => void;
  currentUserName?: string;
}

const CHIP_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

export function CorrectOpeningFloat({ float, onSubmit, onCancel, currentUserName }: CorrectOpeningFloatProps) {
  const [chips, setChips] = useState<ChipDenomination>(float.chips || {});
  const [reason, setReason] = useState("");

  const handleChipChange = (denom: number, value: string) => {
    const count = parseInt(value) || 0;
    setChips((prev) => ({
      ...prev,
      [denom]: count,
    }));
  };

  const calculateTotal = () => {
    return Object.entries(chips).reduce((sum, [denom, count]) => {
      return sum + parseInt(denom) * count;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      alert("Please provide a reason for the correction.");
      return;
    }

    const correctedAmount = calculateTotal();
    
    if (correctedAmount === (float.amount ?? 0)) {
      alert("No changes detected. The corrected amount is the same as the original.");
      return;
    }

    // Create correction report
    const correctionReport: CorrectionReport = {
      id: Date.now().toString(),
      floatId: float.id,
      tableName: float.tableName,
      originalAmount: float.amount ?? 0,
      correctedAmount: correctedAmount,
      originalChips: float.chips,
      correctedChips: chips,
      reason: reason,
      correctedBy: currentUserName || "Unknown User",
      timestamp: new Date().toISOString(),
    };

    // Create corrected float
    const correctedFloat: Float = {
      ...float,
      amount: correctedAmount,
      chips: chips,
      notes: `${float.notes} | CORRECTED: ${reason}`,
    };

    onSubmit(correctedFloat, correctionReport);
  };

  const difference = calculateTotal() - (float.amount ?? 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-orange-600 text-white px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Correct Opening Float</h2>
              <p className="text-orange-100 text-sm">Table: {float.tableName}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white hover:bg-orange-700 p-1 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Warning Banner */}
          <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-orange-900 font-semibold mb-1">
                  Opening Float Correction
                </p>
                <p className="text-sm text-orange-800">
                  This will correct the opening float for <strong>{float.tableName}</strong> and generate a correction report. 
                  Please provide accurate chip counts and a detailed reason for the correction.
                </p>
              </div>
            </div>
          </div>

          {/* Original Amount Display */}
          <div className="bg-slate-100 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Original Opening Amount</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  CFA {(float.amount ?? 0).toLocaleString()}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Opened on: {new Date(float.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-600 mb-1">Original Chips:</p>
                <div className="text-xs text-slate-700 space-y-0.5">
                  {Object.entries(float.chips)
                    .filter(([_, count]) => count > 0)
                    .map(([denom, count]) => (
                      <div key={denom}>
                        CFA {parseInt(denom).toLocaleString()}: {count}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Corrected Chip Counts */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Corrected Chip Count</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CHIP_DENOMINATIONS.map((denom) => (
                <div key={denom} className="flex flex-col">
                  <label className="text-xs font-medium text-slate-700 mb-1">
                    CFA {denom.toLocaleString()}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={chips[denom] || ""}
                    onChange={(e) => handleChipChange(denom, e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Corrected Total and Difference */}
          <div className={`rounded-lg p-4 mb-6 ${
            difference === 0 ? "bg-slate-100" : 
            difference > 0 ? "bg-green-50 border border-green-300" : 
            "bg-red-50 border border-red-300"
          }`}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Corrected Amount</p>
                <p className="text-2xl font-bold text-slate-900">
                  CFA {calculateTotal().toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Difference</p>
                <p className={`text-2xl font-bold ${
                  difference === 0 ? "text-slate-900" : 
                  difference > 0 ? "text-green-600" : 
                  "text-red-600"
                }`}>
                  {difference > 0 ? "+" : ""}{difference !== 0 ? `CFA ${difference.toLocaleString()}` : "CFA 0"}
                </p>
              </div>
            </div>
          </div>

          {/* Reason for Correction */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Reason for Correction <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a detailed explanation for this correction (e.g., 'Miscount of 500K chips', 'Missing 1M chip found', etc.)"
              rows={3}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Corrected By */}
          <div className="mb-6">
            <p className="text-sm text-slate-600">
              Correction will be recorded by: <strong className="text-slate-900">{currentUserName || "Unknown User"}</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              Confirm Correction & Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}