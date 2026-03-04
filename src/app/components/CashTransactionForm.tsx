import { useState } from "react";
import { DollarSign, FileText, X, User } from "lucide-react";
import { APP_CURRENCY } from "../utils/currency";

export const CASH_TRANSACTION_CATEGORIES = [
  "Orange Money",
  "Bank Fees",
  "2% Fee",
  "Salary Expenses",
  "Salaries for Staff",
  "Rent/Equipment",
  "Items Clearance",
  "Electricity Bills",
  "Rent",
  "WeChat Money",
  "Transfer to Bank",
  "Remain+Errors",
  "Cage Shortage",
  "New Resolutions",
  "Promo in",
  "Refunds",
  "Cage Overage",
  "Transfer from I",
  "Fuel for Generator",
  "Water",
  "Electrical Equipment",
  "13 % Rebate C",
  "Water Bills",
  "Cleaning Materials",
  "Cigarettes",
  "Gifts",
  "Staff Food and",
  "Office Supplies",
  "8 % Rebate On",
];

interface CashTransaction {
  id: string;
  type: "Cash In" | "Cash Out";
  amount: number;
  currency: string;
  category?: string; // Optional category for both types
  guestName?: string;
  staffName?: string;
  cashierName: string;
  timestamp: string;
  notes: string;
  receiptNumber?: string;
}

interface CashTransactionFormProps {
  onClose: () => void;
  onSubmit: (transaction: Omit<CashTransaction, "id" | "timestamp">) => void;
  cashierName: string;
}

export function CashTransactionForm({ onClose, onSubmit, cashierName }: CashTransactionFormProps) {
  const [transactionType, setTransactionType] = useState<"Cash In" | "Cash Out">("Cash Out");
  const [amount, setAmount] = useState(""); // Remove preset "0"
  const [category, setCategory] = useState("");
  const [guestName, setGuestName] = useState("");
  const [staffName, setStaffName] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const transaction: Omit<CashTransaction, "id" | "timestamp"> = {
      type: transactionType,
      amount: amountValue,
      currency: APP_CURRENCY,
      category: category || undefined,
      guestName: transactionType === "Cash Out" ? guestName : undefined,
      staffName: transactionType === "Cash In" ? staffName : undefined,
      cashierName,
      notes,
      receiptNumber: transactionType === "Cash In" ? receiptNumber : undefined,
    };

    onSubmit(transaction);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Cash Transaction</h2>
              <p className="text-sm text-green-100">Record cash movement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Transaction Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["Cash Out", "Cash In"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTransactionType(type)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    transactionType === type
                      ? "border-green-500 bg-green-50 text-green-900 font-bold"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {transactionType === "Cash Out" && "Guest brings chips for money"}
              {transactionType === "Cash In" && "Guest/Staff brings cash and receives receipt"}
            </p>
          </div>

          {/* Category (Optional for both types) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Category (Optional)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select category (optional)</option>
              {CASH_TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Name (for Cash Out) */}
          {transactionType === "Cash Out" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Guest Name (Optional)
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter guest name"
              />
            </div>
          )}

          {/* Staff Name & Receipt Number (for Cash In) */}
          {transactionType === "Cash In" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Guest/Staff Name (Optional)
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Receipt Number (Optional)
                </label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., RCP-001"
                />
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <label className="block text-sm font-semibold text-green-900 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Amount *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 text-2xl font-bold border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              placeholder="0"
              required
              step="0.01"
              min="0"
            />
            <div className="mt-2 text-sm text-green-700 font-medium pointer-events-none">
              {amount && !isNaN(parseFloat(amount))
                ? `${parseFloat(amount).toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${APP_CURRENCY}`
                : "Enter amount"}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes/Comments
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              Record Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}