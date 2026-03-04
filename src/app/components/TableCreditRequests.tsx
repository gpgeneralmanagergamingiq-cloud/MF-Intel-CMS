import { useState, useEffect } from "react";
import { Printer, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { useApi } from "../hooks/useApi";
import type { CreditLine, CreditTransaction } from "./CreditLineManagement";

export function TableCreditRequests() {
  const [creditLines, setCreditLines] = useState<CreditLine[]>([]);
  const [pendingRequests, setPendingRequests] = useState<CreditTransaction[]>([]);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser] = useState(() => {
    const auth = sessionStorage.getItem("casino_auth");
    return auth ? JSON.parse(auth) : { username: "admin", userType: "Management" };
  });
  const api = useApi();

  // Form fields
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [requestAmount, setRequestAmount] = useState("");
  const [tableLocation, setTableLocation] = useState("");
  const [requestNotes, setRequestNotes] = useState("");

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
      setCreditLines(loadedCreditLines.filter((cl: CreditLine) => cl.status === "Active"));
      setPendingRequests(loadedTransactions.filter((t: CreditTransaction) => t.status === "Pending"));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openRequestForm = () => {
    setIsRequestFormOpen(true);
    setSelectedPlayerId("");
    setRequestAmount("");
    setTableLocation("");
    setRequestNotes("");
  };

  const closeRequestForm = () => {
    setIsRequestFormOpen(false);
  };

  const printCreditSlip = (transaction: CreditTransaction, copyFor: "Cage" | "Pit") => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    const now = new Date();
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Credit Request Slip - ${copyFor} Copy</title>
          <style>
            @media print {
              @page {
                size: A5;
                margin: 10mm;
              }
            }
            body {
              font-family: 'Courier New', monospace;
              margin: 20px;
              font-size: 12px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .copy-label {
              text-align: center;
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 10px;
              padding: 5px;
              background: ${copyFor === "Cage" ? "#fbbf24" : "#3b82f6"};
              color: white;
            }
            .title {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 5px;
            }
            .property {
              font-size: 11px;
              color: #666;
            }
            .section {
              margin: 15px 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
              padding: 3px 0;
            }
            .label {
              font-weight: bold;
              width: 150px;
            }
            .value {
              flex: 1;
              text-align: right;
            }
            .amount {
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              margin: 15px 0;
              padding: 10px;
              border: 2px solid #000;
              background: #f3f4f6;
            }
            .signatures {
              margin-top: 30px;
              border-top: 1px solid #000;
              padding-top: 20px;
            }
            .signature-line {
              margin: 20px 0;
            }
            .line {
              border-bottom: 1px solid #000;
              width: 200px;
              margin: 5px 0;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ccc;
              padding-top: 10px;
            }
            .status-pending {
              color: #f59e0b;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="copy-label">${copyFor.toUpperCase()} COPY</div>
          
          <div class="header">
            <div class="title">TABLE CREDIT REQUEST</div>
            <div class="property">${api.currentProperty}</div>
          </div>

          <div class="section">
            <div class="row">
              <span class="label">Request ID:</span>
              <span class="value">${transaction.id.substring(0, 8).toUpperCase()}</span>
            </div>
            <div class="row">
              <span class="label">Date & Time:</span>
              <span class="value">${now.toLocaleString()}</span>
            </div>
            <div class="row">
              <span class="label">Status:</span>
              <span class="value status-pending">PENDING CAGE APPROVAL</span>
            </div>
          </div>

          <div class="section">
            <div class="row">
              <span class="label">Player Name:</span>
              <span class="value">${transaction.playerName}</span>
            </div>
            <div class="row">
              <span class="label">Table Location:</span>
              <span class="value">${transaction.requestedFrom || "N/A"}</span>
            </div>
          </div>

          <div class="amount">
            AMOUNT: ${transaction.amount.toLocaleString()} ${transaction.currency}
          </div>

          <div class="section">
            <div class="row">
              <span class="label">Available Credit:</span>
              <span class="value">${(creditLines.find(cl => cl.id === transaction.creditLineId)?.availableCredit || 0).toLocaleString()} ${transaction.currency}</span>
            </div>
            <div class="row">
              <span class="label">Balance Before:</span>
              <span class="value">${transaction.balanceBefore.toLocaleString()} ${transaction.currency}</span>
            </div>
            <div class="row">
              <span class="label">Balance After (if approved):</span>
              <span class="value">${transaction.balanceAfter.toLocaleString()} ${transaction.currency}</span>
            </div>
          </div>

          ${transaction.notes ? `
          <div class="section">
            <div class="row">
              <span class="label">Notes:</span>
            </div>
            <div style="padding: 5px 0;">${transaction.notes}</div>
          </div>
          ` : ""}

          <div class="signatures">
            <div class="signature-line">
              <div>Requested By (Pit Boss):</div>
              <div style="margin-left: 20px;">
                <strong>${transaction.requestedBy}</strong>
                <div style="margin-top: 10px; font-size: 10px; color: #666;">
                  ${new Date(transaction.requestedDate || "").toLocaleString()}
                </div>
              </div>
            </div>

            ${copyFor === "Cage" ? `
            <div class="signature-line">
              <div>Approved By (Cage):</div>
              <div class="line"></div>
              <div style="margin-top: 5px; font-size: 10px;">Date & Time: __________________</div>
            </div>
            ` : ""}
          </div>

          <div class="footer">
            MF-Intel CMS for Gaming IQ - Credit Management System<br/>
            ${copyFor} Copy - Please retain for records
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    const player = players.find((p) => p.id === selectedPlayerId);
    if (!player) {
      alert("Please select a valid player");
      return;
    }

    const creditLine = creditLines.find((cl) => cl.playerId === selectedPlayerId);
    if (!creditLine) {
      alert("This player does not have an active credit line. Please create one first.");
      return;
    }

    const amount = parseFloat(requestAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Validation: Cannot exceed available credit
    if (amount > creditLine.availableCredit) {
      alert(
        `Insufficient available credit!\n\n` +
        `Available: ${creditLine.availableCredit.toLocaleString()} ${creditLine.currency}\n` +
        `Requested: ${amount.toLocaleString()} ${creditLine.currency}`
      );
      return;
    }

    if (!tableLocation.trim()) {
      alert("Please enter the table/pit location");
      return;
    }

    const newBalance = creditLine.currentBalance + amount;

    const newRequest: CreditTransaction = {
      id: crypto.randomUUID(),
      creditLineId: creditLine.id,
      playerId: creditLine.playerId,
      playerName: creditLine.playerName,
      type: "Table Credit Request",
      amount,
      balanceBefore: creditLine.currentBalance,
      balanceAfter: newBalance,
      currency: creditLine.currency,
      processedBy: "", // Will be set by cage when approved
      processedDate: new Date().toISOString(), // Will be updated when approved
      notes: requestNotes,
      status: "Pending",
      requestedBy: currentUser.username,
      requestedDate: new Date().toISOString(),
      requestedFrom: tableLocation,
    };

    try {
      await api.createCreditTransaction(newRequest);
      await loadData();
      closeRequestForm();

      // Double printout - one for cage, one for pit
      alert("Credit request created successfully!\n\nTwo copies will now be printed:\n1. Cage Copy\n2. Pit Copy");
      
      // Print both copies
      setTimeout(() => printCreditSlip(newRequest, "Cage"), 100);
      setTimeout(() => printCreditSlip(newRequest, "Pit"), 1000);
    } catch (error: any) {
      console.error("Error creating credit request:", error);
      alert(error.message || "Failed to create credit request");
    }
  };

  const handleApproveRequest = async (transaction: CreditTransaction) => {
    if (!window.confirm(`Approve credit request for ${transaction.amount.toLocaleString()} ${transaction.currency} to ${transaction.playerName}?`)) {
      return;
    }

    const creditLine = creditLines.find((cl) => cl.id === transaction.creditLineId);
    if (!creditLine) {
      alert("Credit line not found");
      return;
    }

    const updatedTransaction: CreditTransaction = {
      ...transaction,
      status: "Approved",
      approvedBy: currentUser.username,
      approvedDate: new Date().toISOString(),
      processedBy: currentUser.username,
      processedDate: new Date().toISOString(),
    };

    const updatedCreditLine: CreditLine = {
      ...creditLine,
      currentBalance: transaction.balanceAfter,
      availableCredit: creditLine.creditLimit - transaction.balanceAfter,
    };

    try {
      await api.updateCreditTransaction(transaction.id, updatedTransaction);
      await api.updateCreditLine(creditLine.id, updatedCreditLine);
      await loadData();
      alert("Credit request approved successfully!");
    } catch (error: any) {
      console.error("Error approving request:", error);
      alert(error.message || "Failed to approve request");
    }
  };

  const handleRejectRequest = async (transaction: CreditTransaction) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    const updatedTransaction: CreditTransaction = {
      ...transaction,
      status: "Rejected",
      approvedBy: currentUser.username,
      approvedDate: new Date().toISOString(),
      notes: `${transaction.notes ? transaction.notes + " | " : ""}REJECTED: ${reason}`,
    };

    try {
      await api.updateCreditTransaction(transaction.id, updatedTransaction);
      await loadData();
      alert("Credit request rejected.");
    } catch (error: any) {
      console.error("Error rejecting request:", error);
      alert(error.message || "Failed to reject request");
    }
  };

  const reprintSlips = (transaction: CreditTransaction) => {
    printCreditSlip(transaction, "Cage");
    setTimeout(() => printCreditSlip(transaction, "Pit"), 1000);
  };

  const isPitBoss = currentUser.userType === "Pit Boss";
  const isCageOrManagement = currentUser.userType === "Cashier" || currentUser.userType === "Management";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600">Loading credit requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pit Boss Section - Request Credit from Table */}
      {isPitBoss && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Request Table Credit</h3>
              <p className="text-slate-600 mt-1">Issue credit to players at tables (requires cage approval)</p>
            </div>
            <button
              onClick={openRequestForm}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <AlertCircle className="w-5 h-5" />
              New Credit Request
            </button>
          </div>

          {/* Pending Requests for Pit Boss */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-purple-50 border-b">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                My Pending Requests ({pendingRequests.filter((r) => r.requestedBy === currentUser.username).length})
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Request Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Player
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Table
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pendingRequests.filter((r) => r.requestedBy === currentUser.username).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No pending requests
                      </td>
                    </tr>
                  ) : (
                    pendingRequests
                      .filter((r) => r.requestedBy === currentUser.username)
                      .map((request) => (
                        <tr key={request.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {new Date(request.requestedDate || "").toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">{request.playerName}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{request.requestedFrom}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-purple-600">
                              {request.amount.toLocaleString()} {request.currency}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-amber-100 text-amber-800">
                              Pending Cage Approval
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => reprintSlips(request)}
                                className="p-1 text-slate-600 hover:text-purple-600 transition-colors"
                                title="Reprint Slips"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Cage Section - Approve/Reject Requests */}
      {isCageOrManagement && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-amber-50 border-b">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Pending Approvals ({pendingRequests.length})
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Request Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Player
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Table
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Requested By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Available Credit
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No pending requests
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((request) => {
                    const creditLine = creditLines.find((cl) => cl.id === request.creditLineId);
                    return (
                      <tr key={request.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {new Date(request.requestedDate || "").toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{request.playerName}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{request.requestedFrom}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{request.requestedBy}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-purple-600">
                            {request.amount.toLocaleString()} {request.currency}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-emerald-600">
                            {(creditLine?.availableCredit || 0).toLocaleString()} {request.currency}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveRequest(request)}
                              className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request)}
                              className="p-1 text-red-600 hover:text-red-700 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => reprintSlips(request)}
                              className="p-1 text-slate-600 hover:text-purple-600 transition-colors"
                              title="Reprint Slips"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Request Form Modal */}
      {isRequestFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 bg-purple-50 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-purple-600" />
                Request Table Credit
              </h3>
              <button
                onClick={closeRequestForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Player <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select a player</option>
                  {players
                    .filter((p) => creditLines.some((cl) => cl.playerId === p.id))
                    .map((player) => {
                      const creditLine = creditLines.find((cl) => cl.playerId === player.id);
                      return (
                        <option key={player.id} value={player.id}>
                          {player.name} (Available: {creditLine?.availableCredit.toLocaleString()} {creditLine?.currency})
                        </option>
                      );
                    })}
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
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter amount"
                  required
                />
                {selectedPlayerId && (
                  <p className="text-xs text-slate-500 mt-1">
                    Max available: {creditLines.find((cl) => cl.playerId === selectedPlayerId)?.availableCredit.toLocaleString() || 0}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Table/Pit Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tableLocation}
                  onChange={(e) => setTableLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Table 5, Main Pit"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Enter any notes about this request"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Note:</strong> This request will be sent to the Cage for approval. Two printouts will be generated - one for Cage and one for the Pit.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Submit Request & Print
                </button>
                <button
                  type="button"
                  onClick={closeRequestForm}
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
