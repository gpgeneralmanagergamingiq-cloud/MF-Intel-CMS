import { useEffect } from "react";
import { X, Printer } from "lucide-react";
import { APP_CURRENCY } from "../utils/currency";

interface ChipDenomination {
  [key: string]: number;
}

interface CageOperation {
  id: string;
  type: "Table Opener" | "Fill" | "Credit" | "Table Closer" | "Player Cashout" | "Player Buy-in" | "Initial Float" | "Adjustment";
  tableName?: string;
  playerName?: string;
  amount: number;
  currency: string;
  chips: ChipDenomination;
  cashierName: string;
  timestamp: string;
  notes: string;
  referenceId?: string;
}

interface CageOperationPrintoutProps {
  operation: CageOperation;
  onClose: () => void;
  cashierSignature?: string;
  managerSignature?: string;
}

export function CageOperationPrintout({ 
  operation, 
  onClose, 
  cashierSignature, 
  managerSignature 
}: CageOperationPrintoutProps) {
  useEffect(() => {
    // Auto-print when modal opens
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number, currency: string = APP_CURRENCY) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const chipDenominations = [
    "10000000", "5000000", "1000000", "500000", "100000", "50000", "25000",
    "10000", "5000", "1000"
  ];

  const isOutgoing = ["Table Opener", "Fill", "Player Buy-in"].includes(operation.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Print Header - Hidden on screen, visible when printing */}
        <div className="print:block hidden text-center mb-6">
          <h1 className="text-2xl font-bold">MF-Intel CMS for Gaming IQ</h1>
          <p className="text-sm text-slate-600">Cage Operation Receipt</p>
        </div>

        {/* Screen Header - Visible on screen, hidden when printing */}
        <div className="print:hidden flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Cage Operation Receipt</h2>
            <p className="text-sm text-slate-600">Print or save this receipt for your records</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-8 print:p-6">
          {/* Operation Header */}
          <div className="text-center mb-6 pb-6 border-b-2 border-slate-300">
            <div className={`inline-block px-4 py-2 rounded-lg text-sm font-bold mb-2 ${
              isOutgoing ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}>
              {operation.type}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Transaction ID: {operation.id}
            </p>
          </div>

          {/* Operation Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Date & Time</p>
              <p className="font-medium text-slate-900">{formatTimestamp(operation.timestamp)}</p>
            </div>

            {operation.tableName && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Table Name</p>
                <p className="font-medium text-slate-900">{operation.tableName}</p>
              </div>
            )}

            {operation.playerName && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Player Name</p>
                <p className="font-medium text-slate-900">{operation.playerName}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Cashier</p>
              <p className="font-medium text-slate-900">{operation.cashierName || "Not specified"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Currency</p>
              <p className="font-medium text-slate-900">{operation.currency}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Direction</p>
              <p className={`font-bold ${isOutgoing ? "text-red-700" : "text-green-700"}`}>
                {isOutgoing ? "⬇ OUT of Cage" : "⬆ IN to Cage"}
              </p>
            </div>
          </div>

          {/* Chip Breakdown */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              Chip Breakdown
            </h3>
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-600">Denomination</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-slate-600">Quantity</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-slate-600">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {chipDenominations
                  .filter(denom => (operation.chips[denom] || 0) > 0)
                  .map(denom => {
                    const count = operation.chips[denom];
                    const value = parseInt(denom) * count;
                    return (
                      <tr key={denom}>
                        <td className="px-3 py-2 font-medium text-slate-900">
                          {formatCurrency(parseInt(denom), "")}
                        </td>
                        <td className="px-3 py-2 text-center font-bold text-purple-700">
                          {count}
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-slate-900">
                          {formatCurrency(value, operation.currency)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-300">
                <tr>
                  <td className="px-3 py-3 font-bold text-slate-900">TOTAL</td>
                  <td className="px-3 py-3 text-center font-bold text-purple-900">
                    {Object.values(operation.chips).reduce((sum, count) => sum + count, 0)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className={`text-lg font-bold ${
                      isOutgoing ? "text-red-900" : "text-green-900"
                    }`}>
                      {isOutgoing ? "-" : "+"}
                      {formatCurrency(operation.amount, operation.currency)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notes */}
          {operation.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-900 mb-2 pb-2 border-b border-slate-200">
                Notes
              </h3>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{operation.notes}</p>
            </div>
          )}

          {/* Signature Section */}
          <div className="mt-12 pt-6 border-t-2 border-slate-300">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-medium text-slate-600 mb-6">Cashier Signature</p>
                <div className="border-b-2 border-slate-400 pb-1"></div>
                <p className="text-xs text-slate-500 mt-1">{cashierSignature || operation.cashierName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 mb-6">Manager Approval</p>
                <div className="border-b-2 border-slate-400 pb-1"></div>
                <p className="text-xs text-slate-500 mt-1">Date: {new Date(operation.timestamp).toLocaleDateString()}</p>
                {managerSignature && <p className="text-xs text-slate-500 mt-1">Signature: {managerSignature}</p>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-200 pt-4">
            <p>MF-Intel CMS for Gaming IQ</p>
            <p className="mt-1">This receipt is for internal use only and must be retained for audit purposes</p>
          </div>
        </div>

        {/* Print Button - Only visible on screen */}
        <div className="print:hidden p-6 border-t border-slate-200 bg-slate-50 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}