import { useState, useEffect } from "react";
import { CreditCard, Plus, Eye, CheckCircle, XCircle, AlertCircle, History, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { TableCreditRequests } from "./TableCreditRequests";

export interface CreditLine {
  id: string;
  playerId: string;
  playerName: string;
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  status: "Active" | "Suspended" | "Closed";
  approvedBy: string;
  approvedDate: string;
  expiryDate: string;
  currency: string;
  notes: string;
}

export interface CreditTransaction {
  id: string;
  creditLineId: string;
  playerId: string;
  playerName: string;
  type: "Issue Credit" | "Repayment" | "Adjustment" | "Table Credit Request";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  processedBy: string;
  processedDate: string;
  notes: string;
  status?: "Pending" | "Approved" | "Rejected";
  requestedBy?: string;
  requestedDate?: string;
  requestedFrom?: string; // Table/Pit location
  approvedBy?: string;
  approvedDate?: string;
}

export function CreditLineManagement() {
  const [creditLines, setCreditLines] = useState<CreditLine[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [selectedCreditLine, setSelectedCreditLine] = useState<CreditLine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser] = useState(() => {
    const auth = sessionStorage.getItem("casino_auth");
    return auth ? JSON.parse(auth) : { username: "admin", userType: "Management" };
  });
  const api = useApi();

  // Form fields for credit line
  const [formPlayerId, setFormPlayerId] = useState("");
  const [formCreditLimit, setFormCreditLimit] = useState("");
  const [formExpiryDate, setFormExpiryDate] = useState("");
  const [formCurrency, setFormCurrency] = useState("FCFA");
  const [formNotes, setFormNotes] = useState("");

  // Transaction form fields
  const [transactionType, setTransactionType] = useState<CreditTransaction["type"]>("Issue Credit");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionNotes, setTransactionNotes] = useState("");

  // Available players
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [api.currentProperty]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [loadedPlayers, loadedCreditLines, loadedTransactions] = await Promise.all([
        api.getPlayers(),
        api.getCreditLines(),
        api.getCreditTransactions(),
      ]);
      setPlayers(loadedPlayers);
      setCreditLines(loadedCreditLines);
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreditLineForm = () => {
    setIsFormOpen(true);
    setFormPlayerId("");
    setFormCreditLimit("");
    setFormExpiryDate("");
    setFormCurrency("FCFA");
    setFormNotes("");
  };

  const closeCreditLineForm = () => {
    setIsFormOpen(false);
  };

  const handleSubmitCreditLine = async (e: React.FormEvent) => {
    e.preventDefault();

    const player = players.find((p) => p.id === formPlayerId);
    if (!player) {
      alert("Please select a valid player");
      return;
    }

    // Check if player already has an active credit line
    const existingActiveLine = creditLines.find(
      (cl) => cl.playerId === formPlayerId && cl.status === "Active"
    );
    if (existingActiveLine) {
      alert("This player already has an active credit line. Please close or suspend the existing line first.");
      return;
    }

    const creditLimit = parseFloat(formCreditLimit);
    if (isNaN(creditLimit) || creditLimit <= 0) {
      alert("Please enter a valid credit limit");
      return;
    }

    const newCreditLine: CreditLine = {
      id: crypto.randomUUID(),
      playerId: formPlayerId,
      playerName: player.name,
      creditLimit,
      currentBalance: 0,
      availableCredit: creditLimit,
      status: "Active",
      approvedBy: currentUser.username,
      approvedDate: new Date().toISOString(),
      expiryDate: formExpiryDate,
      currency: formCurrency,
      notes: formNotes,
    };

    try {
      await api.createCreditLine(newCreditLine);
      await loadData();
      closeCreditLineForm();
    } catch (error: any) {
      console.error("Error creating credit line:", error);
      alert(error.message || "Failed to create credit line");
    }
  };

  const openTransactionForm = (creditLine: CreditLine) => {
    setSelectedCreditLine(creditLine);
    setIsTransactionFormOpen(true);
    setTransactionType("Issue Credit");
    setTransactionAmount("");
    setTransactionNotes("");
  };

  const closeTransactionForm = () => {
    setIsTransactionFormOpen(false);
    setSelectedCreditLine(null);
  };

  const handleSubmitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCreditLine) return;

    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    let newBalance = selectedCreditLine.currentBalance;

    if (transactionType === "Issue Credit") {
      // Check if available credit is sufficient
      if (amount > selectedCreditLine.availableCredit) {
        alert(`Insufficient available credit. Available: ${selectedCreditLine.availableCredit.toLocaleString()}`);
        return;
      }
      newBalance = selectedCreditLine.currentBalance + amount;
    } else if (transactionType === "Repayment") {
      // Repayment reduces balance
      newBalance = selectedCreditLine.currentBalance - amount;
      if (newBalance < 0) {
        alert("Repayment amount exceeds current balance");
        return;
      }
    } else if (transactionType === "Adjustment") {
      // Adjustment can be positive or negative (ask user)
      const isNegative = window.confirm("Is this a negative adjustment (reduces balance)?\n\nClick OK for negative, Cancel for positive.");
      newBalance = isNegative
        ? selectedCreditLine.currentBalance - amount
        : selectedCreditLine.currentBalance + amount;
    }

    const newTransaction: CreditTransaction = {
      id: crypto.randomUUID(),
      creditLineId: selectedCreditLine.id,
      playerId: selectedCreditLine.playerId,
      playerName: selectedCreditLine.playerName,
      type: transactionType,
      amount,
      balanceBefore: selectedCreditLine.currentBalance,
      balanceAfter: newBalance,
      currency: selectedCreditLine.currency,
      processedBy: currentUser.username,
      processedDate: new Date().toISOString(),
      notes: transactionNotes,
    };

    const updatedCreditLine: CreditLine = {
      ...selectedCreditLine,
      currentBalance: newBalance,
      availableCredit: selectedCreditLine.creditLimit - newBalance,
    };

    try {
      await api.createCreditTransaction(newTransaction);
      await api.updateCreditLine(selectedCreditLine.id, updatedCreditLine);
      await loadData();
      closeTransactionForm();
    } catch (error: any) {
      console.error("Error processing transaction:", error);
      alert(error.message || "Failed to process transaction");
    }
  };

  const updateCreditLineStatus = async (creditLineId: string, newStatus: CreditLine["status"]) => {
    const creditLine = creditLines.find((cl) => cl.id === creditLineId);
    if (!creditLine) return;

    if (newStatus === "Closed" && creditLine.currentBalance > 0) {
      // Special handling for Cage/Management closing after full credit issued
      if (currentUser.userType === "Cashier" || currentUser.userType === "Management") {
        const confirmClose = window.confirm(
          `Close credit line with outstanding balance of ${creditLine.currentBalance.toLocaleString()} ${creditLine.currency}?\n\n` +
          `This should only be done if the full credit has been issued to the player and they are ready to settle.`
        );
        if (!confirmClose) return;
      } else {
        alert("Cannot close credit line with outstanding balance. Please collect all dues first.");
        return;
      }
    }

    if (!window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this credit line?`)) {
      return;
    }

    try {
      const updatedCreditLine = { ...creditLine, status: newStatus };
      await api.updateCreditLine(creditLineId, updatedCreditLine);
      await loadData();
    } catch (error: any) {
      console.error("Error updating credit line status:", error);
      alert(error.message || "Failed to update credit line status");
    }
  };

  // Calculate totals
  const totalCreditIssued = creditLines
    .filter((cl) => cl.status === "Active")
    .reduce((sum, cl) => sum + cl.currentBalance, 0);

  const totalCreditLimit = creditLines
    .filter((cl) => cl.status === "Active")
    .reduce((sum, cl) => sum + cl.creditLimit, 0);

  const totalAvailableCredit = creditLines
    .filter((cl) => cl.status === "Active")
    .reduce((sum, cl) => sum + cl.availableCredit, 0);

  // Permission check
  const canManageCredit =
    currentUser.userType === "Management" ||
    currentUser.userType === "Cashier" ||
    currentUser.userType === "Pit Boss";

  const canViewOnly =
    currentUser.userType === "Owner";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600">Loading credit lines...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Credit Line Management</h2>
          <p className="text-slate-600 mt-1">Track and manage player credit lines</p>
        </div>
        {canManageCredit && (
          <button
            onClick={openCreditLineForm}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Credit Line
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total Credit Limit</h3>
            <CreditCard className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{totalCreditLimit.toLocaleString()}</p>
          <p className="text-xs opacity-75 mt-1">Active credit lines</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Outstanding Balance</h3>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{totalCreditIssued.toLocaleString()}</p>
          <p className="text-xs opacity-75 mt-1">Total credit issued</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Available Credit</h3>
            <TrendingDown className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{totalAvailableCredit.toLocaleString()}</p>
          <p className="text-xs opacity-75 mt-1">Ready to issue</p>
        </div>
      </div>

      {/* Credit Lines List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" />
            Active Credit Lines ({creditLines.filter((cl) => cl.status === "Active").length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Player Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Credit Limit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Outstanding Balance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Available Credit
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Expiry Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {creditLines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No credit lines found. Create a credit line to get started.
                  </td>
                </tr>
              ) : (
                creditLines.map((creditLine) => (
                  <tr key={creditLine.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{creditLine.playerName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">
                        {creditLine.creditLimit.toLocaleString()} {creditLine.currency}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-red-600">
                        {creditLine.currentBalance.toLocaleString()} {creditLine.currency}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-emerald-600">
                        {creditLine.availableCredit.toLocaleString()} {creditLine.currency}
                      </div>
                      {creditLine.availableCredit === 0 && creditLine.status === "Active" && (
                        <div className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Fully Issued
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                          creditLine.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : creditLine.status === "Suspended"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {creditLine.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {creditLine.expiryDate
                        ? new Date(creditLine.expiryDate).toLocaleDateString()
                        : "No expiry"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {canManageCredit && creditLine.status === "Active" && (
                          <>
                            <button
                              onClick={() => openTransactionForm(creditLine)}
                              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              title="Process Transaction"
                            >
                              Transaction
                            </button>
                            <button
                              onClick={() => updateCreditLineStatus(creditLine.id, "Suspended")}
                              className="px-3 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                              title="Suspend"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => updateCreditLineStatus(creditLine.id, "Closed")}
                              className="px-3 py-1 text-xs bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
                              title="Close"
                            >
                              Close
                            </button>
                          </>
                        )}
                        {canManageCredit && creditLine.status === "Suspended" && (
                          <button
                            onClick={() => updateCreditLineStatus(creditLine.id, "Active")}
                            className="px-3 py-1 text-xs bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                            title="Reactivate"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-purple-600" />
            Recent Transactions ({transactions.filter(t => t.status !== "Pending").length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Player Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Balance After
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Processed By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {transactions.filter(t => t.status !== "Pending").length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                transactions
                  .filter(t => t.status !== "Pending")
                  .sort((a, b) => new Date(b.processedDate).getTime() - new Date(a.processedDate).getTime())
                  .map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(transaction.processedDate).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{transaction.playerName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                            transaction.type === "Issue Credit" || transaction.type === "Table Credit Request"
                              ? "bg-red-100 text-red-800"
                              : transaction.type === "Repayment"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className={`font-semibold ${
                            transaction.type === "Issue Credit" || transaction.type === "Table Credit Request" ? "text-red-600" : "text-emerald-600"
                          }`}
                        >
                          {transaction.type === "Issue Credit" || transaction.type === "Table Credit Request" ? "+" : "-"}
                          {transaction.amount.toLocaleString()} {transaction.currency}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">
                          {transaction.balanceAfter.toLocaleString()} {transaction.currency}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{transaction.processedBy || transaction.requestedBy || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {transaction.notes || "—"}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Credit Requests - For Pit Boss and Cage */}
      {(currentUser.userType === "Pit Boss" || currentUser.userType === "Cashier" || currentUser.userType === "Management") && (
        <TableCreditRequests />
      )}

      {/* New Credit Line Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
                New Credit Line
              </h3>
              <button
                onClick={closeCreditLineForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitCreditLine} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Player <span className="text-red-500">*</span>
                </label>
                <select
                  value={formPlayerId}
                  onChange={(e) => setFormPlayerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a player</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Credit Limit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formCreditLimit}
                  onChange={(e) => setFormCreditLimit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter credit limit"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                <select
                  value={formCurrency}
                  onChange={(e) => setFormCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="FCFA">FCFA (CFA Franc)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={formExpiryDate}
                  onChange={(e) => setFormExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Enter any additional notes"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Credit Line
                </button>
                <button
                  type="button"
                  onClick={closeCreditLineForm}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Form Modal */}
      {isTransactionFormOpen && selectedCreditLine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
                Process Transaction
              </h3>
              <button
                onClick={closeTransactionForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-3 bg-blue-50 border-b">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Player:</span>
                <span className="font-semibold text-slate-900">{selectedCreditLine.playerName}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-600">Available Credit:</span>
                <span className="font-semibold text-emerald-600">
                  {selectedCreditLine.availableCredit.toLocaleString()} {selectedCreditLine.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-600">Current Balance:</span>
                <span className="font-semibold text-red-600">
                  {selectedCreditLine.currentBalance.toLocaleString()} {selectedCreditLine.currency}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Transaction Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as CreditTransaction["type"])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Issue Credit">Issue Credit</option>
                  <option value="Repayment">Repayment</option>
                  <option value="Adjustment">Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={transactionNotes}
                  onChange={(e) => setTransactionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Enter any notes about this transaction"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Process Transaction
                </button>
                <button
                  type="button"
                  onClick={closeTransactionForm}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}