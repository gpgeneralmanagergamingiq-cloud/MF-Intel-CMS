import { useState, useEffect, useRef } from "react";
import { Coins, User, Hash, Receipt, X, Printer } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { APP_CURRENCY } from "../utils/currency";

interface CageBuyInTransaction {
  id: string;
  amount: number;
  playerName?: string;
  tableNumber?: string;
  currency: string;
  cashierName: string;
  timestamp: string;
  notes: string;
}

interface CageBuyInFormProps {
  onClose: () => void;
  onSubmit: (transaction: Omit<CageBuyInTransaction, "id" | "timestamp">) => void;
  cashierName: string;
}

export function CageBuyInForm({ onClose, onSubmit, cashierName }: CageBuyInFormProps) {
  const [amount, setAmount] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [currency] = useState(APP_CURRENCY);
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const api = useApi();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tables, playerList] = await Promise.all([
        api.getAvailableTables(),
        api.getPlayers(),
      ]);
      setAvailableTables(tables);
      setPlayers(playerList);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const transaction: Omit<CageBuyInTransaction, "id" | "timestamp"> = {
      amount: amountValue,
      playerName: playerName || undefined,
      tableNumber: tableNumber || undefined,
      currency,
      cashierName,
      notes,
    };

    onSubmit(transaction);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Cage Buy-In</h2>
              <p className="text-sm text-emerald-100">Guest purchasing chips at cage</p>
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
          {/* Amount - Primary Field */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-6">
            <label className="block text-sm font-semibold text-emerald-900 mb-2">
              <Coins className="w-4 h-4 inline mr-1" />
              Amount *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 text-2xl font-bold border-2 border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0"
              required
              step="0.01"
              min="0"
            />
            <div className="mt-2 text-sm text-emerald-700 font-medium">
              {amount && !isNaN(parseFloat(amount))
                ? `${parseFloat(amount).toLocaleString("fr-FR")} ${currency}`
                : "Enter amount"}
            </div>
          </div>

          {/* Optional Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Player Name (Optional)
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                list="player-suggestions"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter or select player"
              />
              <datalist id="player-suggestions">
                {players.map((player) => (
                  <option key={player.id} value={player.name} />
                ))}
              </datalist>
            </div>

            {/* Table Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Table Number (Optional)
              </label>
              <select
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select table</option>
                {availableTables.map((table) => (
                  <option key={table} value={table}>
                    {table}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex items-start">
              <Receipt className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Buy-In Process:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Guest provides cash at cage</li>
                  <li>Cashier issues chips</li>
                  <li>Receipt is printed with amount and timestamp</li>
                  <li>Guest takes receipt to table (if specified)</li>
                  <li>Transaction recorded as "Cash In"</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Receipt className="w-4 h-4 inline mr-2" />
              Process Buy-In & Print Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface CageBuyInReceiptProps {
  transaction: CageBuyInTransaction;
  onClose: () => void;
}

export function CageBuyInReceipt({ transaction, onClose }: CageBuyInReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Cage Buy-In Receipt</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background: white;
                }
                .receipt {
                  max-width: 400px;
                  margin: 0 auto;
                  border: 2px solid #000;
                  padding: 20px;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                  border-bottom: 2px solid #000;
                  padding-bottom: 10px;
                }
                .title {
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .subtitle {
                  font-size: 14px;
                  color: #666;
                }
                .amount-section {
                  background: #e0f2fe;
                  padding: 30px;
                  text-align: center;
                  margin: 20px 0;
                  border: 2px solid #0284c7;
                }
                .amount-label {
                  font-size: 16px;
                  font-weight: bold;
                  margin-bottom: 10px;
                }
                .amount-value {
                  font-size: 48px;
                  font-weight: bold;
                  line-height: 1.2;
                  word-break: break-all;
                }
                .details {
                  margin: 20px 0;
                  font-size: 14px;
                }
                .detail-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 8px 0;
                  border-bottom: 1px solid #ddd;
                }
                .detail-label {
                  font-weight: bold;
                }
                .footer {
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 2px solid #000;
                  text-align: center;
                  font-size: 12px;
                }
                @media print {
                  body {
                    padding: 0;
                  }
                  .no-print {
                    display: none;
                  }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  };
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <Printer className="w-6 h-6" />
            <h2 className="text-xl font-bold">Receipt Ready</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Print Preview */}
          <div ref={printRef} className="receipt" style={{ maxWidth: "400px", margin: "0 auto", border: "2px solid #000", padding: "20px" }}>
            <div className="header" style={{ textAlign: "center", marginBottom: "20px", borderBottom: "2px solid #000", paddingBottom: "10px" }}>
              <div className="title" style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px" }}>
                CAGE BUY-IN RECEIPT
              </div>
              <div className="subtitle" style={{ fontSize: "14px", color: "#666" }}>
                MF-Intel CMS
              </div>
            </div>

            <div className="amount-section" style={{ background: "#e0f2fe", padding: "30px", textAlign: "center", margin: "20px 0", border: "2px solid #0284c7" }}>
              <div className="amount-label" style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
                Amount
              </div>
              <div className="amount-value" style={{ fontSize: "48px", fontWeight: "bold", lineHeight: "1.2", wordBreak: "break-all" }}>
                {formatCurrency(transaction.amount)} {transaction.currency}
              </div>
            </div>

            <div className="details" style={{ margin: "20px 0", fontSize: "14px" }}>
              {transaction.playerName && (
                <div className="detail-row" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #ddd" }}>
                  <span className="detail-label" style={{ fontWeight: "bold" }}>Player:</span>
                  <span>{transaction.playerName}</span>
                </div>
              )}
              {transaction.tableNumber && (
                <div className="detail-row" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #ddd" }}>
                  <span className="detail-label" style={{ fontWeight: "bold" }}>Table:</span>
                  <span>{transaction.tableNumber}</span>
                </div>
              )}
              <div className="detail-row" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #ddd" }}>
                <span className="detail-label" style={{ fontWeight: "bold" }}>Cashier:</span>
                <span>{transaction.cashierName}</span>
              </div>
              <div className="detail-row" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #ddd" }}>
                <span className="detail-label" style={{ fontWeight: "bold" }}>Date & Time:</span>
                <span>{formatDateTime(transaction.timestamp)}</span>
              </div>
              <div className="detail-row" style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #ddd" }}>
                <span className="detail-label" style={{ fontWeight: "bold" }}>Receipt ID:</span>
                <span style={{ fontSize: "11px" }}>{transaction.id.slice(0, 12)}</span>
              </div>
            </div>

            {transaction.notes && (
              <div style={{ margin: "15px 0", padding: "10px", background: "#f8fafc", borderRadius: "4px", fontSize: "12px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Notes:</div>
                <div>{transaction.notes}</div>
              </div>
            )}

            <div className="footer" style={{ marginTop: "30px", paddingTop: "20px", borderTop: "2px solid #000", textAlign: "center", fontSize: "12px" }}>
              <p style={{ margin: "5px 0" }}>Thank you for your patronage</p>
              <p style={{ margin: "5px 0", fontWeight: "bold" }}>Cash In Transaction</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Printer className="w-4 h-4 inline mr-2" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}