import { useState } from "react";
import { X, DollarSign, Calculator, Plus, Minus } from "lucide-react";

interface ChipDenomination {
  [key: string]: number;
}

interface MainFloat {
  id: string;
  chips: ChipDenomination;
  totalAmount: number;
  cashBalance?: number; // Track cash balance separately
  currency: string;
  lastUpdated: string;
}

interface CageOperation {
  type: "Issue to Table" | "Accept from Table" | "Player Cashout";
  tableName?: string;
  playerName?: string;
  amount: number;
  currency: string;
  chips: ChipDenomination;
  cashierName: string;
  notes: string;
  referenceId?: string;
  status?: "Pending" | "Approved";
  submittedBy?: string;
}

interface CageOperationFormProps {
  onSubmit: (operation: Omit<CageOperation, "id" | "timestamp">) => void;
  onCancel: () => void;
  currentFloat: MainFloat;
  currentUser: { username: string; userType: string } | null;
  availableTables?: string[];
}

export function CageOperationForm({ onSubmit, onCancel, currentFloat, currentUser, availableTables = [] }: CageOperationFormProps) {
  const [formData, setFormData] = useState({
    type: "Player Cashout" as CageOperation["type"],
    tableName: "",
    playerName: "",
    currency: currentFloat.currency,
    notes: "",
    cashierName: currentUser?.username || "",
  });

  const [chips, setChips] = useState<ChipDenomination>({
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

  const calculateTotal = (): number => {
    return Object.entries(chips).reduce((total, [denom, count]) => {
      return total + (parseInt(denom) * count);
    }, 0);
  };

  const handleChipChange = (denomination: string, value: string) => {
    const count = parseInt(value) || 0;
    setChips({ ...chips, [denomination]: count });
  };

  const incrementChip = (denomination: string) => {
    // For Player Cashout, all chips increment by 1 (since players bring any quantity)
    // For Issue to Table: 10M and 5M chips increment by 1, all others by 20
    let incrementAmount = 1;
    if (formData.type === "Issue to Table" && denomination !== "10000000" && denomination !== "5000000") {
      incrementAmount = 20;
    }
    const currentValue = chips[denomination] || 0;
    setChips({ ...chips, [denomination]: currentValue + incrementAmount });
  };

  const decrementChip = (denomination: string) => {
    // For Player Cashout, all chips decrement by 1 (since players bring any quantity)
    // For Issue to Table: 10M and 5M chips decrement by 1, all others by 20
    let decrementAmount = 1;
    if (formData.type === "Issue to Table" && denomination !== "10000000" && denomination !== "5000000") {
      decrementAmount = 20;
    }
    const currentValue = chips[denomination] || 0;
    const newValue = Math.max(0, currentValue - decrementAmount);
    setChips({ ...chips, [denomination]: newValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.type) {
      alert("Please select an operation type");
      return;
    }

    if (["Issue to Table", "Accept from Table"].includes(formData.type) && !formData.tableName) {
      alert("Please enter a table name");
      return;
    }

    const totalAmount = calculateTotal();
    if (totalAmount === 0) {
      alert("Please enter at least one chip denomination");
      return;
    }

    // Validate multiples of 20 for Issue to Table operations
    if (formData.type === "Issue to Table") {
      const invalidChips: string[] = [];
      for (const [denom, count] of Object.entries(chips)) {
        // Skip validation for 10M and 5M (they can be any unit)
        if (denom === "10000000" || denom === "5000000") {
          continue;
        }
        
        // All other denominations must be multiples of 20
        if (count > 0 && count % 20 !== 0) {
          invalidChips.push(`${parseInt(denom).toLocaleString()}: ${count} units`);
        }
      }
      
      if (invalidChips.length > 0) {
        alert(
          `Fill requests must be in multiples of 20 units.\n\n` +
          `Invalid quantities:\n${invalidChips.join("\n")}\n\n` +
          `Please adjust the quantities to multiples of 20.\n\n` +
          `Note: 10M and 5M chips can be any quantity.`
        );
        return;
      }
    }
    
    // Check if cage has enough chips for outgoing operations
    // Only "Issue to Table" requires checking cage inventory
    if (formData.type === "Issue to Table") {
      for (const [denom, count] of Object.entries(chips)) {
        const available = currentFloat.chips[denom] || 0;
        if (count > available) {
          alert(`Insufficient ${parseInt(denom).toLocaleString()} chips. Available: ${available}, Required: ${count}`);
          return;
        }
      }
    }
    
    // Player Cashout: Check if cage has enough cash to pay player
    if (formData.type === "Player Cashout") {
      const availableCash = currentFloat.cashBalance || 0;
      if (totalAmount > availableCash) {
        alert(`Insufficient cash in cage!\n\nRequired: ${formData.currency} ${totalAmount.toLocaleString()}\nAvailable: ${formData.currency} ${availableCash.toLocaleString()}\n\nPlease process a Cash In or Vault Credit to add cash to the cage.`);
        return;
      }
    }

    // Determine status: Table Openers and Table Closers require approval, others are auto-approved
    const requiresApproval = ["Issue to Table", "Accept from Table"].includes(formData.type);
    
    let status: "Submitted" | "Approved" = "Approved";
    if (requiresApproval) {
      status = "Submitted"; // Table Openers/Closers need approval
    }
    // Player Cashout is auto-approved (no workflow needed)

    const operation: Omit<CageOperation, "id" | "timestamp"> = {
      type: formData.type,
      tableName: formData.tableName || undefined,
      playerName: formData.playerName || undefined,
      amount: totalAmount,
      currency: formData.currency,
      chips: chips,
      cashierName: formData.cashierName,
      notes: formData.notes,
      status: status,
      submittedBy: (requiresApproval) ? formData.cashierName : undefined,
    };

    onSubmit(operation);
  };

  const operationTypes: CageOperation["type"][] = [
    "Issue to Table",
    "Accept from Table",
    "Player Cashout"
  ];

  const chipDenominations = [
    "10000000", "5000000", "1000000", "500000", "100000", "50000", "25000",
    "10000", "5000", "1000"
  ];

  const totalAmount = calculateTotal();
  // Only "Issue to Table" is outgoing (chips leaving cage)
  // "Accept from Table" and "Player Cashout" are incoming (chips entering cage)
  const isOutgoing = formData.type === "Issue to Table";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">New Cage Operation</h2>
              <p className="text-sm text-slate-600">Record a cage transaction</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Operation Type and Details */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Operation Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as CageOperation["type"] })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                {operationTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                {formData.type === "Player Cashout" 
                  ? "⬆ Chips IN to cage / ⬇ Cash OUT to player (Even Exchange)" 
                  : isOutgoing 
                    ? "⬇ Money/chips leaving cage" 
                    : "⬆ Money/chips entering cage"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="FCFA">FCFA (CFA Franc)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {["Issue to Table", "Accept from Table"].includes(formData.type) && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Table Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.tableName}
                  onChange={(e) => setFormData({ ...formData, tableName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select a table</option>
                  {availableTables.map((table) => (
                    <option key={table} value={table}>{table}</option>
                  ))}
                </select>
              </div>
            )}

            {["Player Cashout"].includes(formData.type) && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Player Name
                </label>
                <input
                  type="text"
                  value={formData.playerName}
                  onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter player name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cashier Name
              </label>
              <input
                type="text"
                value={formData.cashierName}
                readOnly
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                placeholder="Auto-filled from login"
              />
              <p className="text-xs text-slate-500 mt-1">
                Automatically set from logged-in user
              </p>
            </div>

          {/* Current Float Info for Outgoing Operations */}
          {isOutgoing && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
              <p className="text-sm font-bold text-amber-900 mb-2">Available Cage Float</p>
              <p className="text-xs text-amber-700">
                Ensure the cage has sufficient chips before processing this operation
              </p>
            </div>
          )}

          {/* Chip Denominations */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-slate-700">
                Chip Denominations <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-lg">
                <Calculator className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-900">
                  Total: {formData.currency} {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Multiple of 20 Warning for Issue to Table */}
            {formData.type === "Issue to Table" && (
              <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm font-bold text-blue-900">📦 Fill Request Rule</p>
                <p className="text-xs text-blue-700 mt-1">
                  • <strong>10M and 5M chips:</strong> Any quantity (1, 2, 3, etc.)<br />
                  • <strong>All other chips:</strong> Multiples of 20 units (20, 40, 60, 80, 100...)
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {chipDenominations.map((denom) => {
                const available = currentFloat.chips[denom] || 0;
                const requested = chips[denom] || 0;
                const insufficient = isOutgoing && requested > available;

                return (
                  <div key={denom} className={`p-3 border-2 rounded-lg ${
                    insufficient ? "border-red-300 bg-red-50" : "border-slate-200 bg-white"
                  }`}>
                    <label className="block text-xs font-medium text-slate-600 mb-2">
                      {parseInt(denom).toLocaleString()}
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => decrementChip(denom)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors flex-shrink-0"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={chips[denom] === 0 ? "" : chips[denom]}
                        onChange={(e) => handleChipChange(denom, e.target.value)}
                        className={`w-full px-2 py-1.5 text-center border rounded focus:outline-none focus:ring-2 ${
                          insufficient
                            ? "border-red-300 focus:ring-red-500"
                            : "border-slate-300 focus:ring-purple-500"
                        }`}
                        placeholder=""
                      />
                      <button
                        type="button"
                        onClick={() => incrementChip(denom)}
                        className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors flex-shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {isOutgoing && (
                      <p className={`text-xs mt-1 ${insufficient ? "text-red-600 font-medium" : "text-slate-500"}`}>
                        Available: {available}
                      </p>
                    )}
                    {insufficient && (
                      <p className="text-xs text-red-600 font-medium mt-1">Insufficient!</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="Optional notes about this operation..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Record Operation
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}