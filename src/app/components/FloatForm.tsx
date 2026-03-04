import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";

// Hardcoded property - Grand Palace Casino
const PROPERTY_NAME = "Grand Palace Casino";

interface ChipDenomination {
  [key: string]: number;
}

interface Float {
  tableName: string;
  dealerName: string;
  amount: number;
  currency: string;
  status: string;
  type: "Open" | "Close" | "Fill" | "Credit";
  chips: ChipDenomination;
  notes: string;
  property: string;
  gamingDay?: string; // Add gaming day field
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

interface FloatFormProps {
  onSubmit: (data: Float) => void;
  onCancel: () => void;
  openTables: OpenTable[];
  allFloats: OpenTable[]; // Add this to access all float transactions
  onTriggerCloseFloat?: (tableName: string) => void; // Add this to trigger CloseFloatForm
  currentUser?: { username: string; userType: string } | null; // Add currentUser to check permissions
}

// Table numbers from the casino
const TABLE_NUMBERS = [
  "Niu Niu 1",
  "Niu Niu 2",
  "Niu Niu 3",
  "Uth 01",
  "Uth 02",
  "Uth 03",
  "Ar 01",
  "Ar 02",
  "Ar 03",
  "Pk 01",
  "Pk 02",
  "BJ 01",
  "BJ 02",
  "Bac 1",
  "Bac 2",
  "Bac 3",
  "Bac 01",
  "Texas 1",
  "Texas 2",
];

// Chip denominations
const CHIP_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

// Helper function to calculate current gaming day
// Gaming day is from 8am to 8am next day
const getCurrentGamingDay = (): string => {
  const now = new Date();
  const gamingDayDate = new Date(now);
  
  // If current time is before 8am, we're still in yesterday's gaming day
  if (now.getHours() < 8) {
    gamingDayDate.setDate(gamingDayDate.getDate() - 1);
  }
  
  // Format as YYYY-MM-DD for the date component (the 8am start)
  const year = gamingDayDate.getFullYear();
  const month = String(gamingDayDate.getMonth() + 1).padStart(2, '0');
  const day = String(gamingDayDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

export default function FloatForm({ onSubmit, onCancel, openTables, allFloats, onTriggerCloseFloat, currentUser }: FloatFormProps) {
  // Hardcoded for Grand Palace Casino
  const currentProperty = "Grand Palace Casino";
  const availableProperties = [PROPERTY_NAME];
  
  // Check if user can edit gaming day (Management or Owner only)
  const canEditGamingDay = currentUser?.userType === "Management" || currentUser?.userType === "Owner";
  
  const [formData, setFormData] = useState<Float>({
    tableName: "",
    dealerName: "",
    amount: 0,
    currency: "FCFA",
    status: "Active",
    type: "Open",
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
    property: currentProperty,
    gamingDay: getCurrentGamingDay(), // Set to current gaming day by default
  });

  // When Close transaction type is selected with a table, trigger CloseFloatForm
  const handleTableChange = (tableName: string) => {
    setFormData({ ...formData, tableName });
    
    // If Close type is selected and we have the callback
    if (formData.type === "Close" && tableName && onTriggerCloseFloat) {
      // Check if this table has an active Open float
      const hasActiveOpen = openTables.some(t => t.tableName === tableName);
      if (hasActiveOpen) {
        // Trigger the CloseFloatForm
        onTriggerCloseFloat(tableName);
      }
    }
  };

  // Handle transaction type change
  const handleTypeChange = (type: "Open" | "Close" | "Fill" | "Credit") => {
    setFormData({ ...formData, type });
    
    // If Close type is selected and table is already selected, trigger CloseFloatForm
    if (type === "Close" && formData.tableName && onTriggerCloseFloat) {
      const hasActiveOpen = openTables.some(t => t.tableName === formData.tableName);
      if (hasActiveOpen) {
        onTriggerCloseFloat(formData.tableName);
      }
    }
  };

  const updateChipCount = (denomination: string, value: number) => {
    const newChips = { ...formData.chips };
    newChips[denomination] = Math.max(0, value);
    
    // Calculate total amount
    const totalAmount = Object.entries(newChips).reduce(
      (sum, [denom, count]) => sum + parseInt(denom) * count,
      0
    );

    setFormData({ ...formData, chips: newChips, amount: totalAmount });
  };

  const incrementChip = (denomination: string) => {
    // 10M and 5M chips increment by 1, all others by 20
    const incrementAmount = (denomination === "10000000" || denomination === "5000000") ? 1 : 20;
    updateChipCount(denomination, (formData.chips[denomination] || 0) + incrementAmount);
  };

  const decrementChip = (denomination: string) => {
    // 10M and 5M chips decrement by 1, all others by 20
    const decrementAmount = (denomination === "10000000" || denomination === "5000000") ? 1 : 20;
    updateChipCount(denomination, (formData.chips[denomination] || 0) - decrementAmount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate multiples of 20 for Fill operations (except 10M and 5M)
    if (formData.type === "Fill") {
      const invalidChips: string[] = [];
      for (const [denom, count] of Object.entries(formData.chips)) {
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
    
    // Validate chip availability for Credit transactions
    if (formData.type === "Credit" && formData.tableName) {
      const invalidChips: string[] = [];
      const floatInventory = calculateFloatInventoryByDenom(formData.tableName);
      
      for (const [denom, count] of Object.entries(formData.chips)) {
        if (count > 0) {
          const available = floatInventory[denom] || 0;
          if (count > available) {
            const denomLabel = CHIP_DENOMINATIONS.find(c => c.toString() === denom)?.toLocaleString() || denom;
            invalidChips.push(`${denomLabel}: requesting ${count}, only ${available} available`);
          }
        }
      }
      
      if (invalidChips.length > 0) {
        alert(
          `Credit transaction exceeds available chips in float.\n\n` +
          `Insufficient chips:\n${invalidChips.join("\n")}\n\n` +
          `Please reduce the quantities to match available float inventory.`
        );
        return;
      }
    }
    
    onSubmit(formData);
  };

  // Determine which tables to show based on transaction type
  const availableTables = formData.type === "Close"
    ? openTables.map(t => t.tableName)  // Only show open tables for Close
    : (formData.type === "Fill" || formData.type === "Credit") 
      ? openTables.map(t => t.tableName) 
      : formData.type === "Open"
        ? TABLE_NUMBERS.filter(table => !openTables.some(t => t.tableName === table)) // Exclude already-open tables
        : TABLE_NUMBERS;

  const noOpenTables = (formData.type === "Fill" || formData.type === "Credit" || formData.type === "Close") && openTables.length === 0;

  // Calculate current float value for a specific table
  const calculateTableFloat = (tableName: string): number => {
    if (!tableName || !allFloats) return 0;
    
    return allFloats
      .filter((f) => f.tableName === tableName && f.status === "Active")
      .reduce((sum, f) => {
        if (f.type === "Open" || f.type === "Fill") {
          return sum + f.amount;
        } else if (f.type === "Credit") {
          return sum - f.amount;
        }
        return sum;
      }, 0);
  };

  // Calculate float inventory by denomination for a specific table
  const calculateFloatInventoryByDenom = (tableName: string): ChipDenomination => {
    if (!tableName || !allFloats) return {};
    
    const inventory: ChipDenomination = {};
    
    allFloats
      .filter((f) => f.tableName === tableName && f.status === "Active")
      .forEach((f) => {
        if (f.type === "Open" || f.type === "Fill") {
          for (const [denom, count] of Object.entries(f.chips)) {
            inventory[denom] = (inventory[denom] || 0) + count;
          }
        } else if (f.type === "Credit") {
          for (const [denom, count] of Object.entries(f.chips)) {
            inventory[denom] = (inventory[denom] || 0) - count;
          }
        }
      });
    
    return inventory;
  };

  // Get current table float
  const currentTableFloat = formData.tableName ? calculateTableFloat(formData.tableName) : 0;
  
  // Check if credit would make float negative
  const isCreditInvalid = formData.type === "Credit" && formData.amount > currentTableFloat;
  const creditExcessAmount = formData.type === "Credit" ? formData.amount - currentTableFloat : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-2xl font-bold text-slate-900">
            New Float Transaction
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Transaction Type *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {(["Open", "Close", "Fill", "Credit"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeChange(type)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.type === type
                      ? type === "Open"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : type === "Close"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : type === "Fill"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Warning when no open tables for Fill/Credit */}
          {noOpenTables && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>No open tables available.</strong> You must open a table before you can {formData.type === "Fill" ? "fill" : "credit"} it. Please select "Open" transaction type instead.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Display current table float for Credit transactions */}
          {formData.type === "Credit" && formData.tableName && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Current Float for {formData.tableName}:</strong> {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{currentTableFloat.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error when credit would make float negative */}
          {isCreditInvalid && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>Invalid Credit Amount!</strong> The credit amount of {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{formData.amount.toLocaleString()} exceeds the current float of {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{currentTableFloat.toLocaleString()} by {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{creditExcessAmount.toLocaleString()}. The float value cannot go negative.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Table and Dealer Info */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Property *
              </label>
              <select
                required
                value={formData.property}
                onChange={(e) =>
                  setFormData({ ...formData, property: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableProperties.map((property) => (
                  <option key={property} value={property}>
                    {property}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Table Number *
              </label>
              <select
                required
                value={formData.tableName}
                onChange={(e) => handleTableChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Table</option>
                {availableTables.map((table) => (
                  <option key={table} value={table}>
                    {table}
                  </option>
                ))}
                {noOpenTables && <option value="">No open tables available</option>}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Dealer Name
              </label>
              <input
                type="text"
                value={formData.dealerName}
                onChange={(e) =>
                  setFormData({ ...formData, dealerName: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter dealer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Currency *
              </label>
              <select
                required
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FCFA">FCFA (CFA)</option>
                <option value="PHP">PHP (₱)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="KRW">KRW (₩)</option>
                <option value="SGD">SGD (S$)</option>
                <option value="HKD">HKD (HK$)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gaming Day *
                {!canEditGamingDay && (
                  <span className="ml-1 text-xs text-slate-500">(locked)</span>
                )}
              </label>
              <input
                type="date"
                required
                value={formData.gamingDay}
                onChange={(e) =>
                  setFormData({ ...formData, gamingDay: e.target.value })
                }
                disabled={!canEditGamingDay}
                className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !canEditGamingDay ? 'bg-slate-100 cursor-not-allowed text-slate-600' : ''
                }`}
                title={!canEditGamingDay ? 'Only Management and Owner can change gaming day' : ''}
              />
            </div>
          </div>

          {/* Chip Denominations */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Chip Denominations *
            </label>
            
            {/* Multiple of 20 Warning for Fill */}
            {formData.type === "Fill" && (
              <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm font-bold text-blue-900">📦 Fill Request Rule</p>
                <p className="text-xs text-blue-700 mt-1">
                  • <strong>10M and 5M chips:</strong> Any quantity (1, 2, 3, etc.)<br />
                  • <strong>All other chips:</strong> Multiples of 20 units (20, 40, 60, 80, 100...)
                </p>
              </div>
            )}
            
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
              
              {/* Total Amount */}
              <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="font-bold text-slate-900 text-lg">
                  Total Amount
                </div>
                <div className="font-bold text-blue-600 text-2xl">
                  {formData.currency === "FCFA" ? "CFA " : formData.currency === "PHP" ? "₱" : formData.currency === "EUR" ? "€" : formData.currency === "GBP" ? "£" : formData.currency === "CNY" || formData.currency === "JPY" ? "¥" : formData.currency === "KRW" ? "₩" : "$"}{formData.amount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Status and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about this transaction..."
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
              disabled={isCreditInvalid}
              className={`px-6 py-2 rounded-lg transition-colors ${
                isCreditInvalid
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}