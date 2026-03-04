import { useState, useEffect } from "react";
import { User, Coins, Clock, CheckCircle, X, History, Eye, Plus, PlayCircle, StopCircle } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { APP_CURRENCY } from "../utils/currency";

export interface CashierFloatRecord {
  id: string;
  cashierName: string;
  startingFloat: number;
  startingBills?: { [key: string]: number }; // Bill denomination breakdown
  endingFloat?: number;
  cashIn: number; // Total buy-ins during shift
  cashOut: number; // Total cashouts during shift
  expectedEnding: number; // startingFloat + cashIn - cashOut
  variance?: number; // endingFloat - expectedEnding (calculated when shift ends)
  startTime: string;
  endTime?: string;
  status: "Active" | "Completed";
  currency: string;
  notes: string;
}

interface CashierFloatProps {
  currentUser: { username: string; userType: string } | null;
  buyInTransactions: any[];
  cageOperations: any[]; // Cage operations for chip tracking
  isViewOnly: boolean;
}

export function CashierFloat({ currentUser, buyInTransactions, cageOperations, isViewOnly }: CashierFloatProps) {
  const [floats, setFloats] = useState<CashierFloatRecord[]>([]);
  const [showStartForm, setShowStartForm] = useState(false);
  const [showEndForm, setShowEndForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [startingAmount, setStartingAmount] = useState("");
  const [startingBills, setStartingBills] = useState<{ [key: string]: number }>({
    "10000": 0,
    "5000": 0,
    "2000": 0,
    "1000": 0,
    "500": 0,
    "100": 0,
  });
  const [endingAmount, setEndingAmount] = useState("");
  const [endingBills, setEndingBills] = useState<{ [key: string]: number }>({
    "10000": 0,
    "5000": 0,
    "2000": 0,
    "1000": 0,
    "500": 0,
    "100": 0,
  });
  const [notes, setNotes] = useState("");
  const [selectedFloat, setSelectedFloat] = useState<CashierFloatRecord | null>(null);
  const api = useApi();

  // Bill denominations
  const BILL_DENOMINATIONS = [10000, 5000, 2000, 1000, 500, 100];

  // Handler to update bill counts and recalculate total
  const handleBillChange = (denomination: string, value: number) => {
    const newBills = {
      ...startingBills,
      [denomination]: value,
    };

    const total = BILL_DENOMINATIONS.reduce((sum, denom) => {
      return sum + denom * (newBills[denom.toString()] || 0);
    }, 0);

    setStartingBills(newBills);
    setStartingAmount(total.toString());
  };

  // Handler for ending bills
  const handleEndingBillChange = (denomination: string, value: number) => {
    const newBills = {
      ...endingBills,
      [denomination]: value,
    };

    const total = BILL_DENOMINATIONS.reduce((sum, denom) => {
      return sum + denom * (newBills[denom.toString()] || 0);
    }, 0);

    setEndingBills(newBills);
    setEndingAmount(total.toString());
  };

  useEffect(() => {
    loadFloats();
  }, []);

  const loadFloats = async () => {
    try {
      const loadedFloats = await api.getCashierFloats();
      setFloats(loadedFloats);
    } catch (error) {
      console.error("Error loading cashier floats:", error);
    }
  };

  const getCurrentCashierFloat = () => {
    if (!currentUser) return null;
    return floats.find(f => f.cashierName === currentUser.username && f.status === "Active");
  };

  const getCashierHistory = () => {
    if (!currentUser) return [];
    return floats.filter(f => f.cashierName === currentUser.username && f.status === "Completed");
  };

  const calculateCashInForFloat = (floatRecord: CashierFloatRecord) => {
    const startTime = new Date(floatRecord.startTime);
    const endTime = floatRecord.endTime ? new Date(floatRecord.endTime) : new Date();
    
    return buyInTransactions
      .filter(t => {
        const transactionTime = new Date(t.timestamp);
        return t.cashierName === floatRecord.cashierName && 
               transactionTime >= startTime && 
               transactionTime <= endTime;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Calculate cash out from Player Cashout operations
  const calculateCashOutForFloat = (floatRecord: CashierFloatRecord) => {
    const startTime = new Date(floatRecord.startTime);
    const endTime = floatRecord.endTime ? new Date(floatRecord.endTime) : new Date();
    
    return cageOperations
      .filter(op => {
        const opTime = new Date(op.timestamp);
        // Only count Player Cashout operations by this cashier within the float time period
        // Only count Approved operations (not pending)
        return op.cashierName === floatRecord.cashierName && 
               opTime >= startTime && 
               opTime <= endTime &&
               op.type === "Player Cashout" &&
               (op.status === "Approved" || op.status === "Received");
      })
      .reduce((sum, op) => sum + op.amount, 0);
  };

  // Calculate chip movements for active float
  const calculateChipMovements = (floatRecord: CashierFloatRecord) => {
    const startTime = new Date(floatRecord.startTime);
    const endTime = floatRecord.endTime ? new Date(floatRecord.endTime) : new Date();
    
    let chipsOut = 0; // Issue to Table
    let chipsIn = 0;  // Accept from Table + Player Cashout
    
    cageOperations.forEach(op => {
      const opTime = new Date(op.timestamp);
      
      // Only count operations by this cashier within the float time period
      // Only count Approved operations (not pending)
      if (op.cashierName === floatRecord.cashierName && 
          opTime >= startTime && 
          opTime <= endTime &&
          (op.status === "Approved" || op.status === "Received")) {
        
        if (op.type === "Issue to Table") {
          chipsOut += op.amount;
        } else if (op.type === "Accept from Table" || op.type === "Player Cashout") {
          chipsIn += op.amount;
        }
      }
    });
    
    return { chipsIn, chipsOut };
  };

  const handleStartFloat = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const amount = parseFloat(startingAmount);
    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid starting amount");
      return;
    }

    // Check if cashier already has an active float
    const existingActive = getCurrentCashierFloat();
    if (existingActive) {
      alert("You already have an active float. Please end it before starting a new one.");
      return;
    }

    const newFloat: CashierFloatRecord = {
      id: crypto.randomUUID(),
      cashierName: currentUser.username,
      startingFloat: amount,
      startingBills: startingBills,
      cashIn: 0,
      cashOut: 0,
      expectedEnding: amount,
      startTime: new Date().toISOString(),
      status: "Active",
      currency: APP_CURRENCY,
      notes: notes,
    };

    try {
      await api.createCashierFloat(newFloat);
      setFloats([newFloat, ...floats]);
      setShowStartForm(false);
      setStartingAmount("");
      setStartingBills({
        "10000": 0,
        "5000": 0,
        "2000": 0,
        "1000": 0,
        "500": 0,
        "100": 0,
      });
      setNotes("");
    } catch (error) {
      console.error("Error starting float:", error);
      alert("Failed to start float. Please try again.");
    }
  };

  const handleEndFloat = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentFloat = getCurrentCashierFloat();
    if (!currentFloat) {
      alert("No active float found");
      return;
    }

    const amount = parseFloat(endingAmount);
    if (isNaN(amount) || amount < 0) {
      alert("Please enter a valid ending amount");
      return;
    }

    // Calculate actual cash in/out during this shift
    const cashIn = calculateCashInForFloat(currentFloat);
    const cashOut = calculateCashOutForFloat(currentFloat);
    const expectedEnding = currentFloat.startingFloat + cashIn - cashOut;
    const variance = amount - expectedEnding;

    const updatedFloat: CashierFloatRecord = {
      ...currentFloat,
      endingFloat: amount,
      cashIn,
      cashOut,
      expectedEnding,
      variance,
      endTime: new Date().toISOString(),
      status: "Completed",
    };

    try {
      await api.updateCashierFloat(updatedFloat.id, updatedFloat);
      setFloats(floats.map(f => f.id === updatedFloat.id ? updatedFloat : f));
      setShowEndForm(false);
      setEndingAmount("");
      setEndingBills({
        "10000": 0,
        "5000": 0,
        "2000": 0,
        "1000": 0,
        "500": 0,
        "100": 0,
      });
    } catch (error) {
      console.error("Error ending float:", error);
      alert("Failed to end float. Please try again.");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " " + APP_CURRENCY;
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

  const currentFloat = getCurrentCashierFloat();
  const history = getCashierHistory();

  // Calculate real-time cash in for active float
  const realtimeCashIn = currentFloat ? calculateCashInForFloat(currentFloat) : 0;
  const realtimeCashOut = currentFloat ? calculateCashOutForFloat(currentFloat) : 0;
  const realtimeExpectedEnding = currentFloat ? currentFloat.startingFloat + realtimeCashIn - realtimeCashOut : 0;

  // Calculate real-time chip movements for active float
  const chipMovements = currentFloat ? calculateChipMovements(currentFloat) : { chipsIn: 0, chipsOut: 0 };
  const currentChips = chipMovements.chipsIn - chipMovements.chipsOut; // Net chips

  return (
    <div className="space-y-6">
      {/* Active Float Card - Split into Cash and Chip Floats */}
      {currentFloat ? (
        <div className="space-y-6">
          {/* CASH FLOAT SECTION */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border-2 border-emerald-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">💵 Cash Float</h3>
                  <p className="text-sm text-emerald-700">Started {formatDateTime(currentFloat.startTime)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-xs font-medium text-emerald-700 mb-1">Starting Float</p>
                <p className="text-xl font-bold text-emerald-900">{formatCurrency(currentFloat.startingFloat)}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-xs font-medium text-green-700 mb-1">Cash In (Live)</p>
                <p className="text-xl font-bold text-green-900">{formatCurrency(realtimeCashIn)}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-xs font-medium text-red-700 mb-1">Cash Out</p>
                <p className="text-xl font-bold text-red-900">{formatCurrency(realtimeCashOut)}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-2 border-emerald-400">
                <p className="text-xs font-medium text-emerald-700 mb-1">Expected Ending</p>
                <p className="text-xl font-bold text-emerald-900">{formatCurrency(realtimeExpectedEnding)}</p>
              </div>
            </div>
          </div>

          {/* CHIP FLOAT SECTION */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-indigo-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-900">🎰 Chip Float</h3>
                  <p className="text-sm text-indigo-700">Casino chip inventory</p>
                </div>
              </div>
              {!isViewOnly && (
                <button
                  onClick={() => setShowEndForm(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <StopCircle className="w-4 h-4" />
                  End Float
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-xs font-medium text-indigo-700 mb-1">Starting Chips</p>
                <p className="text-xl font-bold text-indigo-900">{formatCurrency(0)}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-xs font-medium text-green-700 mb-1">Chips In</p>
                <p className="text-xl font-bold text-green-900">{formatCurrency(chipMovements.chipsIn)}</p>
                <p className="text-xs text-green-600 mt-1">Accept + Player Cashout</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-xs font-medium text-red-700 mb-1">Chips Out</p>
                <p className="text-xl font-bold text-red-900">{formatCurrency(chipMovements.chipsOut)}</p>
                <p className="text-xs text-red-600 mt-1">Issue to Table</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-2 border-indigo-400">
                <p className="text-xs font-medium text-indigo-700 mb-1">Net Chips</p>
                <p className={`text-xl font-bold ${currentChips >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                  {currentChips >= 0 ? '+' : ''}{formatCurrency(Math.abs(currentChips))}
                </p>
                <p className="text-xs text-indigo-600 mt-1">In - Out</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Float</h3>
          <p className="text-sm text-slate-600 mb-4">Start your cashier float to begin tracking transactions</p>
          {!isViewOnly && (
            <button
              onClick={() => setShowStartForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <PlayCircle className="w-5 h-5" />
              Start Float
            </button>
          )}
        </div>
      )}

      {/* History Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Float History</h3>
            <p className="text-sm text-slate-600 mt-1">Your completed float records</p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {showHistory ? "Hide" : "Show"} History
          </button>
        </div>

        {showHistory && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">End Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Starting</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Cash In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Cash Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Expected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                      <History className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                      <p>No completed floats found</p>
                    </td>
                  </tr>
                ) : (
                  history.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatDateTime(record.startTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {record.endTime ? formatDateTime(record.endTime) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatCurrency(record.startingFloat)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-medium">
                        +{formatCurrency(record.cashIn)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 font-medium">
                        -{formatCurrency(record.cashOut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatCurrency(record.expectedEnding)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                        {record.endingFloat ? formatCurrency(record.endingFloat) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.variance !== undefined ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            record.variance === 0
                              ? "bg-green-100 text-green-800"
                              : record.variance > 0
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {record.variance > 0 ? "+" : ""}{formatCurrency(Math.abs(record.variance))}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Start Float Modal */}
      {showStartForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <PlayCircle className="w-6 h-6" />
                <h2 className="text-xl font-bold">Start Float</h2>
              </div>
              <button
                onClick={() => setShowStartForm(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartFloat} className="p-6 space-y-4">
              {/* Bill Denomination Breakdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Bill Denomination Breakdown
                </label>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BILL_DENOMINATIONS.map((denom) => (
                      <div key={denom} className="bg-white rounded-lg p-3 border border-slate-200">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          CFA {denom.toLocaleString()}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={startingBills[denom.toString()] || ""}
                          onChange={(e) =>
                            handleBillChange(denom.toString(), parseInt(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          CFA {((startingBills[denom.toString()] || 0) * denom).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total Display */}
                  <div className="mt-4 pt-4 border-t border-slate-300">
                    <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                      <span className="text-sm font-semibold text-blue-900">Total Starting Float:</span>
                      <span className="text-2xl font-bold text-blue-900">
                        CFA {parseFloat(startingAmount || "0").toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add any notes..."
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowStartForm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Start Float
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* End Float Modal */}
      {showEndForm && currentFloat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <StopCircle className="w-6 h-6" />
                <h2 className="text-xl font-bold">End Float</h2>
              </div>
              <button
                onClick={() => setShowEndForm(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEndFloat} className="p-6 space-y-4">
              {/* Summary */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Starting Float:</span>
                  <span className="text-sm font-bold">{formatCurrency(currentFloat.startingFloat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Cash In:</span>
                  <span className="text-sm font-bold text-green-700">+{formatCurrency(realtimeCashIn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Cash Out:</span>
                  <span className="text-sm font-bold text-red-700">-{formatCurrency(realtimeCashOut)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-slate-300">
                  <span className="text-sm font-bold text-slate-900">Expected Ending:</span>
                  <span className="text-lg font-bold text-indigo-900">{formatCurrency(realtimeExpectedEnding)}</span>
                </div>
              </div>

              {/* Bill Denomination Breakdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Actual Ending Float - Bill Denomination Breakdown *
                </label>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BILL_DENOMINATIONS.map((denom) => (
                      <div key={denom} className="bg-white rounded-lg p-3 border border-slate-200">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          CFA {denom.toLocaleString()}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={endingBills[denom.toString()] || ""}
                          onChange={(e) =>
                            handleEndingBillChange(denom.toString(), parseInt(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          CFA {((endingBills[denom.toString()] || 0) * denom).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total Display with Variance */}
                  <div className="mt-4 pt-4 border-t border-slate-300 space-y-3">
                    <div className="flex items-center justify-between bg-indigo-50 rounded-lg p-4 border-2 border-indigo-300">
                      <span className="text-sm font-semibold text-indigo-900">Total Ending Float:</span>
                      <span className="text-2xl font-bold text-indigo-900">
                        CFA {parseFloat(endingAmount || "0").toLocaleString()}
                      </span>
                    </div>

                    {endingAmount && parseFloat(endingAmount) > 0 && (
                      <div
                        className={`flex items-center justify-between rounded-lg p-4 border-2 ${
                          parseFloat(endingAmount) === realtimeExpectedEnding
                            ? "bg-green-50 border-green-300"
                            : parseFloat(endingAmount) > realtimeExpectedEnding
                            ? "bg-blue-50 border-blue-300"
                            : "bg-red-50 border-red-300"
                        }`}
                      >
                        <span
                          className={`text-sm font-semibold ${
                            parseFloat(endingAmount) === realtimeExpectedEnding
                              ? "text-green-900"
                              : parseFloat(endingAmount) > realtimeExpectedEnding
                              ? "text-blue-900"
                              : "text-red-900"
                          }`}
                        >
                          Variance:
                        </span>
                        <span
                          className={`text-xl font-bold ${
                            parseFloat(endingAmount) === realtimeExpectedEnding
                              ? "text-green-900"
                              : parseFloat(endingAmount) > realtimeExpectedEnding
                              ? "text-blue-900"
                              : "text-red-900"
                          }`}
                        >
                          {parseFloat(endingAmount) > realtimeExpectedEnding ? "+" : ""}
                          {formatCurrency(Math.abs(parseFloat(endingAmount) - realtimeExpectedEnding))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEndForm(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Complete Float
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}