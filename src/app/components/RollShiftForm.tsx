import { useState, useEffect } from "react";
import { X, CheckSquare, Square, RotateCcw, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";

interface ChipDenomination {
  [key: string]: number;
}

interface Float {
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
  property?: string;
}

interface Rating {
  id: string;
  tableName: string;
  playerName: string;
  status: "Active" | "Completed";
}

interface VaultTransfer {
  id: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface ValidationResult {
  isValid: boolean;
  issues: string[];
  openTables: string[];
  activeRatings: Rating[];
  pendingTransactions: number;
  pendingVaultTransfers: number;
}

interface RollShiftFormProps {
  availableTables: Float[];
  onSubmit: (selectedTables: Float[]) => void;
  onCancel: () => void;
}

export function RollShiftForm({ availableTables, onSubmit, onCancel }: RollShiftFormProps) {
  const api = useApi();
  const tables = availableTables || [];
  
  const [selectedTableIds, setSelectedTableIds] = useState<Set<string>>(
    new Set(tables.map(t => t.tableName))
  );
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: false,
    issues: [],
    openTables: [],
    activeRatings: [],
    pendingTransactions: 0,
    pendingVaultTransfers: 0
  });
  const [isValidating, setIsValidating] = useState(true);
  const [showValidationDetails, setShowValidationDetails] = useState(false);

  useEffect(() => {
    performValidation();
  }, []);

  const performValidation = async () => {
    setIsValidating(true);
    const issues: string[] = [];
    const openTables: string[] = [];
    const activeRatings: Rating[] = [];
    let pendingTransactions = 0;
    let pendingVaultTransfers = 0;

    try {
      // 1. Check for open tables
      const allFloats = await api.getFloats();
      const openFloats = allFloats.filter((f: Float) => f.type === "Open" && f.status === "Completed");
      
      if (openFloats.length > 0) {
        openFloats.forEach((f: Float) => openTables.push(f.tableName));
        issues.push(`${openFloats.length} table(s) still open - all tables must be closed before rolling shift`);
      }

      // 2. Check for active ratings
      const allRatings = await api.getRatings();
      const activePlayerRatings = allRatings.filter((r: Rating) => r.status === "Active");
      
      if (activePlayerRatings.length > 0) {
        activePlayerRatings.forEach((r: Rating) => activeRatings.push(r));
        issues.push(`${activePlayerRatings.length} active player rating(s) must be completed before rolling shift`);
      }

      // 3. Check for pending float transactions (Fill/Credit with Pending status)
      const pendingFloats = allFloats.filter((f: Float) => 
        (f.type === "Fill" || f.type === "Credit" || f.type === "Close") && 
        f.status === "Pending"
      );
      
      if (pendingFloats.length > 0) {
        pendingTransactions = pendingFloats.length;
        issues.push(`${pendingFloats.length} pending float transaction(s) require approval`);
      }

      // 4. Check for pending vault transfers
      const vaultTransfers = await api.getVaultTransfers();
      const pendingVault = vaultTransfers.filter((v: VaultTransfer) => v.status === "Pending");
      
      if (pendingVault.length > 0) {
        pendingVaultTransfers = pendingVault.length;
        issues.push(`${pendingVault.length} pending vault transfer(s) require approval`);
      }

      // 5. Validation passes only if NO issues
      const isValid = issues.length === 0;

      setValidation({
        isValid,
        issues,
        openTables,
        activeRatings,
        pendingTransactions,
        pendingVaultTransfers
      });

      if (!isValid) {
        setShowValidationDetails(true);
      }

    } catch (error) {
      console.error("Error validating roll shift:", error);
      issues.push("Error checking system status - please try again");
      setValidation({
        isValid: false,
        issues,
        openTables: [],
        activeRatings: [],
        pendingTransactions: 0,
        pendingVaultTransfers: 0
      });
    } finally {
      setIsValidating(false);
    }
  };

  const toggleTable = (tableName: string) => {
    const newSelected = new Set(selectedTableIds);
    if (newSelected.has(tableName)) {
      newSelected.delete(tableName);
    } else {
      newSelected.add(tableName);
    }
    setSelectedTableIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedTableIds.size === tables.length) {
      setSelectedTableIds(new Set());
    } else {
      setSelectedTableIds(new Set(tables.map(t => t.tableName)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validation.isValid) {
      toast.error("Cannot roll shift - please resolve all issues first");
      setShowValidationDetails(true);
      return;
    }

    const selectedTables = tables.filter(t => selectedTableIds.has(t.tableName));
    onSubmit(selectedTables);
  };

  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case "FCFA": return "CFA ";
      case "PHP": return "₱";
      case "EUR": return "€";
      case "GBP": return "£";
      case "CNY":
      case "JPY": return "¥";
      case "KRW": return "₩";
      default: return "$";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${validation.isValid ? 'bg-green-100' : 'bg-red-100'}`}>
              <RotateCcw className={`w-6 h-6 ${validation.isValid ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Roll Shift & Start New Gaming Day</h3>
              <p className="text-sm text-slate-600 mt-1">
                {isValidating ? "Validating system status..." : 
                  validation.isValid ? "Ready to roll shift" : "Action required before rolling shift"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Validation Status */}
          {isValidating ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-blue-900 font-medium">Validating system status...</p>
              </div>
            </div>
          ) : validation.isValid ? (
            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-green-900 mb-1">System Ready for Roll Shift</h4>
                  <p className="text-sm text-green-800">
                    All validations passed. You can now proceed to close the current gaming day and start a new one.
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-green-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      All tables are closed
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      No active player ratings
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      No pending transactions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      No pending approvals
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-red-900">
                      Cannot Roll Shift - {validation.issues.length} Issue{validation.issues.length !== 1 ? 's' : ''} Found
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowValidationDetails(!showValidationDetails)}
                      className="text-sm text-red-700 hover:text-red-900 font-medium underline"
                    >
                      {showValidationDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                  <p className="text-sm text-red-800 mb-3">
                    Please resolve the following issues before rolling shift:
                  </p>
                  <ul className="space-y-2">
                    {validation.issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                        <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Detailed Breakdown */}
                  {showValidationDetails && (
                    <div className="mt-4 pt-4 border-t border-red-200 space-y-4">
                      {/* Open Tables */}
                      {validation.openTables.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-red-900 mb-2 text-sm">Open Tables ({validation.openTables.length}):</h5>
                          <div className="bg-white rounded border border-red-200 p-3">
                            <div className="grid grid-cols-3 gap-2">
                              {validation.openTables.map((table, index) => (
                                <div key={index} className="text-xs bg-red-50 px-2 py-1 rounded border border-red-200">
                                  {table}
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-red-700 mt-2">
                              Action: Close all open tables in the Float Management section
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Active Ratings */}
                      {validation.activeRatings.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-red-900 mb-2 text-sm">Active Player Ratings ({validation.activeRatings.length}):</h5>
                          <div className="bg-white rounded border border-red-200 p-3 max-h-40 overflow-y-auto">
                            <div className="space-y-1">
                              {validation.activeRatings.map((rating, index) => (
                                <div key={index} className="text-xs bg-red-50 px-2 py-1.5 rounded border border-red-200 flex items-center justify-between">
                                  <span className="font-medium">{rating.playerName}</span>
                                  <span className="text-red-600">{rating.tableName}</span>
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-red-700 mt-2">
                              Action: Complete or close all active player ratings in the Ratings section
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Pending Transactions */}
                      {validation.pendingTransactions > 0 && (
                        <div>
                          <h5 className="font-semibold text-red-900 mb-2 text-sm">Pending Float Transactions ({validation.pendingTransactions}):</h5>
                          <div className="bg-white rounded border border-red-200 p-3">
                            <p className="text-xs text-red-700">
                              Action: Approve or reject all pending Fill, Credit, and Close transactions
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Pending Vault Transfers */}
                      {validation.pendingVaultTransfers > 0 && (
                        <div>
                          <h5 className="font-semibold text-red-900 mb-2 text-sm">Pending Vault Transfers ({validation.pendingVaultTransfers}):</h5>
                          <div className="bg-white rounded border border-red-200 p-3">
                            <p className="text-xs text-red-700">
                              Action: Approve or reject all pending vault transfers in the Cage section
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-red-200">
                    <button
                      type="button"
                      onClick={performValidation}
                      className="text-sm text-red-700 hover:text-red-900 font-medium flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Re-check System Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message */}
          {validation.isValid && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> This will archive all current data (floats, ratings, and drops) and start a fresh gaming day. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Table Selection - Only show if validation passes */}
          {validation.isValid && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-bold text-slate-900">
                    Select Tables to Open
                  </label>
                  <button
                    type="button"
                    onClick={toggleAll}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {selectedTableIds.size === tables.length ? (
                      <>
                        <Square className="w-4 h-4" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4" />
                        Select All
                      </>
                    )}
                  </button>
                </div>

                {tables.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                    <p className="text-slate-600">No tables available to open.</p>
                    <p className="text-sm text-slate-500 mt-1">You can start the new gaming day without pre-opening any tables.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tables.map((table) => (
                      <div
                        key={table.tableName}
                        onClick={() => toggleTable(table.tableName)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedTableIds.has(table.tableName)
                            ? "border-green-500 bg-green-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {selectedTableIds.has(table.tableName) ? (
                              <CheckSquare className="w-6 h-6 text-green-600" />
                            ) : (
                              <Square className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-bold text-slate-900">{table.tableName}</h4>
                              <span className="text-xl font-bold text-green-600">
                                {getCurrencySymbol(table.currency)}{table.amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-slate-600">Dealer:</span>{" "}
                                <span className="font-medium text-slate-900">{table.dealerName}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Property:</span>{" "}
                                <span className="font-medium text-slate-900">{table.property || "Main"}</span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                              Last closed: {new Date(table.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary */}
              {tables.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Selected Tables: <span className="text-xl font-bold">{selectedTableIds.size}</span> of {tables.length}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        {selectedTableIds.size === 0 
                          ? "No tables will be opened for the new gaming day"
                          : `${selectedTableIds.size} table(s) will be opened with their previous closing balances`
                        }
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-blue-700">Total Opening Float</p>
                      <p className="text-xl font-bold text-blue-900">
                        {getCurrencySymbol(tables[0]?.currency)}
                        {tables
                          .filter(t => selectedTableIds.has(t.tableName))
                          .reduce((sum, t) => sum + t.amount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            {validation.isValid ? (
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold shadow-md"
              >
                <RotateCcw className="w-5 h-5" />
                Roll Shift & Open {selectedTableIds.size} Table{selectedTableIds.size !== 1 ? 's' : ''}
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 flex items-center justify-center gap-2 bg-slate-300 text-slate-500 px-6 py-3 rounded-lg cursor-not-allowed font-bold"
              >
                <XCircle className="w-5 h-5" />
                Cannot Roll Shift - Issues Found
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
