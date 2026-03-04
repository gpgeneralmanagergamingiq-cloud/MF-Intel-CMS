import { X, Printer } from "lucide-react";

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

interface TipsPrintoutProps {
  tips: TipsData;
  onClose: () => void;
  pitBossSignature?: string;
  managerSignature?: string;
}

const CHIP_DENOMINATIONS = [10000000, 5000000, 1000000, 500000, 100000, 50000, 25000, 10000, 5000, 1000, 500, 250];

export function TipsPrintout({ 
  tips, 
  onClose, 
  pitBossSignature, 
  managerSignature 
}: TipsPrintoutProps) {
  const getCurrencySymbol = (currency: string) => {
    if (currency === "FCFA") return "CFA ";
    if (currency === "PHP") return "₱";
    if (currency === "EUR") return "€";
    if (currency === "GBP") return "£";
    if (currency === "CNY" || currency === "JPY") return "¥";
    if (currency === "KRW") return "₩";
    return "$";
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - Hidden in print */}
        <div className="flex items-center justify-between p-4 border-b print:hidden">
          <h3 className="text-lg font-bold text-slate-900">Tips Receipt</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="p-8 print:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tips Receipt</h1>
            <p className="text-sm text-slate-600">
              {new Date(tips.timestamp).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-xs text-slate-500 mt-1">Receipt ID: {tips.id}</p>
          </div>

          {/* Dealer Information */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-slate-600 mb-1">Pit Boss Name</p>
                <p className="text-base font-semibold text-slate-900">{tips.pitBossName}</p>
              </div>
              {tips.tableName && (
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">Table Name</p>
                  <p className="text-base font-semibold text-slate-900">{tips.tableName}</p>
                </div>
              )}
              {tips.gamingDay && (
                <div>
                  <p className="text-xs font-medium text-slate-600 mb-1">Gaming Day</p>
                  <p className="text-base font-semibold text-slate-900">{tips.gamingDay}</p>
                </div>
              )}
            </div>
          </div>

          {/* Chip Breakdown */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase">Chip Breakdown</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-2 text-xs font-semibold text-slate-700">Denomination</th>
                  <th className="text-center py-2 text-xs font-semibold text-slate-700">Quantity</th>
                  <th className="text-right py-2 text-xs font-semibold text-slate-700">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {CHIP_DENOMINATIONS.map((denom) => {
                  const quantity = tips.chips[denom.toString()] || 0;
                  if (quantity === 0) return null;
                  const subtotal = denom * quantity;
                  return (
                    <tr key={denom} className="border-b border-slate-200">
                      <td className="py-2 text-sm text-slate-700">
                        {getCurrencySymbol(tips.currency)}{denom.toLocaleString()}
                      </td>
                      <td className="py-2 text-sm text-center text-slate-900 font-medium">
                        {quantity}
                      </td>
                      <td className="py-2 text-sm text-right text-slate-900">
                        {getCurrencySymbol(tips.currency)}{subtotal.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="bg-green-50 rounded-lg p-4 mb-6 border-2 border-green-300">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-green-900">Total Tips Amount:</span>
              <span className="text-3xl font-bold text-green-900">
                {getCurrencySymbol(tips.currency)}{tips.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Notes */}
          {tips.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase">Notes</h3>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-sm text-slate-700">{tips.notes}</p>
              </div>
            </div>
          )}

          {/* Signature Section */}
          <div className="mt-12 pt-6 border-t-2 border-slate-300">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-medium text-slate-600 mb-6">Pit Boss Signature</p>
                <div className="border-b-2 border-slate-400 pb-1"></div>
                <p className="text-xs text-slate-500 mt-1">{pitBossSignature || tips.pitBossName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 mb-6">Manager Signature</p>
                <div className="border-b-2 border-slate-400 pb-1"></div>
                <p className="text-xs text-slate-500 mt-1">Date: {new Date(tips.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">MF-Intel CMS for Gaming IQ</p>
            <p className="text-xs text-slate-400 mt-1">
              This is an official tips receipt. Please keep for your records.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:p-8,
          .print\\:p-8 * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-8 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}