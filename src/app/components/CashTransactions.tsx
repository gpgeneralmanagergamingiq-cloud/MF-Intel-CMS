import { DollarSign, Plus, User, Clock, FileText } from "lucide-react";
import { APP_CURRENCY } from "../utils/currency";

interface CashTransaction {
  id: string;
  type: "Cash In" | "Cash Out";
  amount: number;
  currency: string;
  category?: string;
  guestName?: string;
  staffName?: string;
  cashierName: string;
  timestamp: string;
  notes: string;
  receiptNumber?: string;
}

interface CashTransactionsProps {
  transactions: CashTransaction[];
  onNewTransaction: () => void;
  isViewOnly: boolean;
}

export function CashTransactions({ transactions, onNewTransaction, isViewOnly }: CashTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return `CFA ${amount.toLocaleString("fr-FR")}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate totals
  const cashOut = transactions
    .filter(t => t.type === "Cash Out")
    .reduce((sum, t) => sum + t.amount, 0);

  const cashIn = transactions
    .filter(t => t.type === "Cash In")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900">Cash Transactions</h3>
        <p className="text-sm text-slate-600 mt-1">
          Cash Out, Cash In, Money In/Out
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-200">
          <p className="text-xs text-red-700 font-medium mb-1">Cash Out</p>
          <p className="text-2xl font-bold text-red-900">{formatCurrency(cashOut)}</p>
          <p className="text-xs text-red-600 mt-1">{transactions.filter(t => t.type === "Cash Out").length} transactions</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200">
          <p className="text-xs text-green-700 font-medium mb-1">Cash In</p>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(cashIn)}</p>
          <p className="text-xs text-green-600 mt-1">{transactions.filter(t => t.type === "Cash In").length} transactions</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h4 className="text-lg font-bold text-slate-900">Transaction History</h4>
          <p className="text-sm text-slate-600 mt-1">All cash movements</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Category/Person
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Cashier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p>No cash transactions yet</p>
                    <p className="text-sm mt-2">Click the Cash Transactions button to create a new transaction</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {formatTimestamp(tx.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === "Cash Out" ? "bg-red-100 text-red-800" :
                        tx.type === "Cash In" ? "bg-green-100 text-green-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {tx.category && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4 text-slate-400" />
                          {tx.category}
                        </div>
                      )}
                      {tx.guestName && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-slate-400" />
                          {tx.guestName}
                        </div>
                      )}
                      {tx.staffName && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-slate-400" />
                          {tx.staffName}
                        </div>
                      )}
                      {!tx.category && !tx.guestName && !tx.staffName && (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`text-sm font-bold ${
                        tx.type === "Cash Out" 
                          ? "text-red-700" 
                          : "text-green-700"
                      }`}>
                        {tx.type === "Cash Out" ? "-" : "+"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {tx.cashierName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {tx.notes || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}