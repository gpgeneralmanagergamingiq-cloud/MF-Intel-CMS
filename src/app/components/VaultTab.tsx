import { useState } from "react";
import { Vault, ArrowUp, ArrowDown, TrendingUp, TrendingDown, X, Coins, Edit, DollarSign, Save } from "lucide-react";
import { APP_CURRENCY } from "../utils/currency";
import { PasswordVerificationModal } from "./PasswordVerificationModal";
import { ThermalReceipt } from "./ThermalReceipt";
import { useApi } from "../hooks/useApi";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export interface VaultTransfer {
  id: string;
  type: "Credit" | "Fill"; // Credit = transfer TO vault, Fill = request FROM vault
  assetType: "Cash" | "Chips";
  amount: number;
  chips?: { [key: string]: number };
  currency: string;
  cashierName: string;
  timestamp: string;
  notes: string;
  status: "Pending" | "Approved" | "Rejected";
}

export interface VaultInventory {
  cash: number;
  chips: { [key: string]: number };
  totalChipValue: number;
  currency: string;
}

interface VaultTabProps {
  cashierName: string;
  userType: string;
  onTransfer: (transfer: Omit<VaultTransfer, "id" | "timestamp" | "status">) => void;
  transfers: VaultTransfer[];
  vaultInventory: VaultInventory;
  onUpdateInventory?: (inventory: VaultInventory) => void;
  onApprove?: (transferId: string, approvedBy: string) => void;
  onReject?: (transferId: string, rejectedBy: string, reason: string) => void;
  propertyName?: string;
}

export function VaultTab({ cashierName, userType, onTransfer, transfers, vaultInventory, onUpdateInventory, onApprove, onReject, propertyName }: VaultTabProps) {
  const api = useApi();
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferType, setTransferType] = useState<"Credit" | "Fill">("Credit");
  const [notes, setNotes] = useState("");
  
  // Password verification for approvals/rejections
  const [pendingAction, setPendingAction] = useState<{ type: 'approve' | 'reject'; transferId: string } | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  
  // Bill denominations for cash
  const billDenominations = [10000, 5000, 2000, 1000, 500, 100];
  const [cashBills, setCashBills] = useState<{ [key: string]: number }>({
    "10000": 0,
    "5000": 0,
    "2000": 0,
    "1000": 0,
    "500": 0,
    "100": 0,
  });

  // Define chip denominations first
  const chipDenominations = ["10000000", "5000000", "1000000", "500000", "100000", "50000", "25000", "10000", "5000", "1000"];
  const [chipCounts, setChipCounts] = useState<{ [key: string]: number }>({
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
  });
  
  // Calculate totals
  const cashTotal = billDenominations.reduce((sum, denom) => {
    return sum + denom * (cashBills[denom.toString()] || 0);
  }, 0);
  
  const chipTotal = chipDenominations.reduce((sum, denom) => {
    return sum + parseInt(denom) * (chipCounts[denom] || 0);
  }, 0);
  
  // Handler for cash bill changes
  const handleCashBillChange = (denomination: string, value: number) => {
    setCashBills({
      ...cashBills,
      [denomination]: value,
    });
  };
  
  // Handler for chip count changes
  const handleChipCountChange = (denomination: string, value: number) => {
    setChipCounts({
      ...chipCounts,
      [denomination]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one asset type has value
    if (cashTotal === 0 && chipTotal === 0) {
      alert("Please enter at least some cash or chips to transfer");
      return;
    }

    // Create transfers for each asset type that has value
    const transfers: Array<Omit<VaultTransfer, "id" | "timestamp" | "status">> = [];

    if (cashTotal > 0) {
      transfers.push({
        type: transferType,
        assetType: "Cash",
        amount: cashTotal,
        currency: APP_CURRENCY,
        cashierName,
        notes,
      });
    }

    if (chipTotal > 0) {
      transfers.push({
        type: transferType,
        assetType: "Chips",
        amount: chipTotal,
        chips: chipCounts,
        currency: APP_CURRENCY,
        cashierName,
        notes,
      });
    }

    // Submit each transfer
    for (const transfer of transfers) {
      await onTransfer(transfer);
    }
    
    setShowTransferForm(false);
    setNotes("");
    setCashBills({
      "10000": 0,
      "5000": 0,
      "2000": 0,
      "1000": 0,
      "500": 0,
      "100": 0,
    });
    setChipCounts({
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
    });
  };

  const formatCurrency = (amount: number, prefix: string = "CFA ") => {
    return `${prefix}${amount.toLocaleString("fr-FR")}`;
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

  const pendingTransfers = transfers.filter(t => t.status === "Pending");
  const completedTransfers = transfers.filter(t => t.status !== "Pending");

  // Management-only editing state
  const isManagement = userType === "Management" || userType === "Owner";
  const [isEditingInventory, setIsEditingInventory] = useState(false);
  const [editCashBills, setEditCashBills] = useState<{ [key: string]: string }>({
    "10000": "",
    "5000": "",
    "2000": "",
    "1000": "",
    "500": "",
    "100": "",
  });
  const [editChips, setEditChips] = useState<{ [key: string]: string }>({});
  const [editComments, setEditComments] = useState("");
  const [showCredentialPrompt, setShowCredentialPrompt] = useState(false);
  const [credentialUsername, setCredentialUsername] = useState("");
  const [credentialPassword, setCredentialPassword] = useState("");

  // Serial number tracking state
  const [showSerialNumberPrompt, setShowSerialNumberPrompt] = useState(false);
  const [serialNumbers, setSerialNumbers] = useState<{ [denomination: string]: string[] }>({});
  const [currentSerialInput, setCurrentSerialInput] = useState<{ [key: string]: string }>({});

  // These denominations require serial number tracking
  const serialTrackedDenominations = ["1000000", "5000000", "10000000"];

  // Calculate edited cash total from denominations
  const editedCashTotal = billDenominations.reduce((sum, denom) => {
    return sum + denom * (parseInt(editCashBills[denom.toString()] || "0") || 0);
  }, 0);

  // Calculate edited chip total from denominations
  const editedChipTotal = chipDenominations.reduce((sum, denom) => {
    return sum + parseInt(denom) * (parseInt(editChips[denom] || "0") || 0);
  }, 0);

  const handleStartEdit = () => {
    const initialCashBills: { [key: string]: string } = {};
    billDenominations.forEach(denom => {
      initialCashBills[denom.toString()] = "";
    });
    setEditCashBills(initialCashBills);
    const initialChips: { [key: string]: string } = {};
    chipDenominations.forEach(denom => {
      const count = vaultInventory.chips[denom] || 0;
      initialChips[denom] = count === 0 ? "" : count.toString();
    });
    setEditChips(initialChips);
    setEditComments("");
    setIsEditingInventory(true);
  };

  const handleRequestSave = () => {
    // Validate that comments are provided
    if (!editComments.trim()) {
      alert("Please provide comments explaining the inventory changes.");
      return;
    }
    
    // Check if any serial-tracked chips have counts
    const serialTrackedChipsWithCounts: Array<{ denom: string; count: number }> = [];
    serialTrackedDenominations.forEach(denom => {
      const count = parseInt(editChips[denom] || "0") || 0;
      if (count > 0) {
        serialTrackedChipsWithCounts.push({ denom, count });
      }
    });

    // If there are serial-tracked chips, show serial number prompt first
    if (serialTrackedChipsWithCounts.length > 0) {
      // Initialize serial number inputs for each tracked chip
      const initialSerialInputs: { [key: string]: string } = {};
      serialTrackedChipsWithCounts.forEach(({ denom, count }) => {
        for (let i = 0; i < count; i++) {
          initialSerialInputs[`${denom}-${i}`] = "";
        }
      });
      setCurrentSerialInput(initialSerialInputs);
      setShowSerialNumberPrompt(true);
    } else {
      // No serial-tracked chips, go directly to credential prompt
      setShowCredentialPrompt(true);
    }
  };

  const handleSerialNumbersComplete = () => {
    // Validate that all serial numbers are entered
    const allEntered = Object.values(currentSerialInput).every(sn => sn.trim().length > 0);
    if (!allEntered) {
      alert("Please enter all serial numbers before continuing.");
      return;
    }

    // Check for duplicate serial numbers
    const allSerialNumbers = Object.values(currentSerialInput);
    const uniqueSerialNumbers = new Set(allSerialNumbers);
    if (allSerialNumbers.length !== uniqueSerialNumbers.size) {
      alert("Duplicate serial numbers detected. Each chip must have a unique serial number.");
      return;
    }

    // Organize serial numbers by denomination
    const organizedSerialNumbers: { [denomination: string]: string[] } = {};
    Object.entries(currentSerialInput).forEach(([key, value]) => {
      const [denom] = key.split('-');
      if (!organizedSerialNumbers[denom]) {
        organizedSerialNumbers[denom] = [];
      }
      organizedSerialNumbers[denom].push(value.trim());
    });
    
    setSerialNumbers(organizedSerialNumbers);
    setShowSerialNumberPrompt(false);
    setShowCredentialPrompt(true);
  };

  const handleCancelSerialNumbers = () => {
    setShowSerialNumberPrompt(false);
    setCurrentSerialInput({});
  };

  const handleVerifyAndSave = async (username: string, password: string): Promise<boolean> => {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    try {
      // Verify credentials using API - management roles required
      const isValid = await api.verifyUserCredentials(username, password, ['Management', 'Admin', 'General Manager', 'Owner']);
      
      if (!isValid) {
        return false;
      }

      if (!onUpdateInventory) return false;

      // Calculate new cash from denominations
      const newCash = billDenominations.reduce((sum, denom) => {
        return sum + denom * (parseInt(editCashBills[denom.toString()] || "0") || 0);
      }, 0);

      const newChips: { [key: string]: number } = {};
      let totalChipValue = 0;

      chipDenominations.forEach(denom => {
        const count = parseInt(editChips[denom] || "0") || 0;
        if (count > 0) {
          newChips[denom] = count;
          totalChipValue += parseInt(denom) * count;
        }
      });

      const updatedInventory: VaultInventory = {
        cash: newCash,
        chips: newChips,
        totalChipValue,
        currency: APP_CURRENCY,
      };

      onUpdateInventory(updatedInventory);
      setIsEditingInventory(false);
      setShowCredentialPrompt(false);
      setEditComments("");
      return true;
    } catch (error) {
      console.error("Error verifying credentials:", error);
      return false;
    }
  };

  const handleCancelEdit = () => {
    setIsEditingInventory(false);
    setEditComments("");
  };

  const handleCancelCredentials = () => {
    setShowCredentialPrompt(false);
    setCredentialUsername("");
    setCredentialPassword("");
  };

  const handleApprove = (transferId: string) => {
    setPendingAction({ type: 'approve', transferId });
    setShowPasswordModal(true);
  };

  const handleReject = (transferId: string) => {
    setPendingAction({ type: 'reject', transferId });
    setRejectionReason("");
    setShowPasswordModal(true);
  };

  const handlePasswordModalSubmit = async () => {
    if (!pendingAction) return;

    const { type, transferId } = pendingAction;
    const username = credentialUsername;
    const password = credentialPassword;

    if (!username || !password) {
      alert("Please enter your credentials.");
      return;
    }

    try {
      // Verify credentials - management roles required for approvals
      const isValid = await api.verifyUserCredentials(username, password, ['Management', 'Admin', 'General Manager']);
      
      if (!isValid) {
        alert("Invalid credentials or insufficient permissions. Management access required.");
        return;
      }

      // Perform the action
      if (type === 'approve' && onApprove) {
        onApprove(transferId, username);
      } else if (type === 'reject' && onReject) {
        onReject(transferId, username, rejectionReason);
      }

      // Close the modal
      setShowPasswordModal(false);
      setCredentialUsername("");
      setCredentialPassword("");
      setRejectionReason("");
      setPendingAction(null);
    } catch (error) {
      console.error("Error verifying credentials:", error);
      alert("Failed to verify credentials. Please try again.");
    }
  };

  // Keyboard shortcuts for modals
  useKeyboardShortcuts(
    showTransferForm ? () => document.querySelector<HTMLButtonElement>('button[type="submit"]')?.click() : undefined,
    showTransferForm ? () => setShowTransferForm(false) : undefined,
    showTransferForm
  );

  useKeyboardShortcuts(
    showPasswordModal ? handlePasswordModalSubmit : undefined,
    showPasswordModal ? () => setShowPasswordModal(false) : undefined,
    showPasswordModal
  );

  useKeyboardShortcuts(
    showSerialNumberPrompt ? handleSerialNumbersComplete : undefined,
    showSerialNumberPrompt ? handleCancelSerialNumbers : undefined,
    showSerialNumberPrompt
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vault Management</h2>
          <p className="text-sm text-slate-600 mt-1">
            Transfer excess cash/chips or request additional inventory
          </p>
        </div>
        <button
          onClick={() => setShowTransferForm(true)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
        >
          <Vault className="w-5 h-5" />
          New Transfer
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg p-6 border-2 border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <ArrowUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">Credits to Vault</p>
              <p className="text-xs text-amber-600">Excess transferred</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-amber-900">
            {transfers.filter(t => t.type === "Credit" && t.status === "Approved").length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <ArrowDown className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Fills from Vault</p>
              <p className="text-xs text-blue-600">Requested from vault</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-900">
            {transfers.filter(t => t.type === "Fill" && t.status === "Approved").length}
          </p>
        </div>
      </div>

      {/* Vault Inventory Display */}
      <div className="bg-white border-2 border-emerald-200 rounded-lg overflow-hidden">
        <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-emerald-900">Current Vault Inventory</h3>
            <p className="text-sm text-emerald-700 mt-1">Cash and chips currently in the vault</p>
          </div>
          {isManagement && onUpdateInventory && !isEditingInventory && (
            <button
              onClick={handleStartEdit}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Inventory
            </button>
          )}
          {isEditingInventory && (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestSave}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cash Section */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6 text-green-700" />
                <h4 className="text-lg font-bold text-green-900">Cash Balance</h4>
              </div>
              {!isEditingInventory ? (
                <p className="text-3xl font-bold text-green-900">
                  {formatCurrency(vaultInventory.cash)}
                </p>
              ) : (
                <p className="text-3xl font-bold text-green-900">
                  {formatCurrency(editedCashTotal)}
                </p>
              )}
            </div>

            {/* Chips Section */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-6 h-6 text-purple-700" />
                <h4 className="text-lg font-bold text-purple-900">Total Chip Value</h4>
              </div>
              {!isEditingInventory ? (
                <p className="text-3xl font-bold text-purple-900">
                  {formatCurrency(vaultInventory.totalChipValue)}
                </p>
              ) : (
                <p className="text-3xl font-bold text-purple-900">
                  {formatCurrency(editedChipTotal)}
                </p>
              )}
            </div>
          </div>

          {/* Cash Denominations Breakdown (only when editing) */}
          {isEditingInventory && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-700 mb-3">Cash Denomination Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {billDenominations.map((denom) => (
                  <div key={denom} className="rounded-lg p-3 border-2 bg-green-50 border-green-200">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-bold text-slate-700">
                        {formatCurrency(denom, "CFA ")}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={editCashBills[denom.toString()] || ""}
                      onChange={(e) => setEditCashBills({ ...editCashBills, [denom.toString()]: e.target.value })}
                      className="w-full px-2 py-1 text-sm font-bold border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0"
                      step="1"
                      min="0"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {formatCurrency(denom * (parseInt(editCashBills[denom.toString()] || "0") || 0), "")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chip Denomination Breakdown */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Chip Inventory by Denomination</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {chipDenominations.map((denom) => {
                const count = vaultInventory.chips[denom] || 0;
                const isSerialTracked = serialTrackedDenominations.includes(denom);
                
                return (
                  <div key={denom} className={`rounded-lg p-3 border-2 ${isSerialTracked ? "bg-amber-50 border-amber-300" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center gap-1 mb-1">
                      <div className={`w-2 h-2 rounded-full ${isSerialTracked ? "bg-amber-500" : "bg-purple-500"}`}></div>
                      <span className="text-xs font-bold text-slate-700">
                        {formatCurrency(parseInt(denom), "")}
                      </span>
                      {isSerialTracked && (
                        <span className="text-xs text-amber-600 ml-auto">S/N</span>
                      )}
                    </div>
                    {!isEditingInventory ? (
                      <p className="text-lg font-bold text-slate-900">{count.toLocaleString()}</p>
                    ) : (
                      <input
                        type="number"
                        value={editChips[denom] || ""}
                        onChange={(e) => setEditChips({ ...editChips, [denom]: e.target.value })}
                        className="w-full px-2 py-1 text-sm font-bold border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                        step="1"
                        min="0"
                      />
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {formatCurrency(parseInt(denom) * count, "")}
                    </p>
                  </div>
                );
              })}
            </div>
            
            {isEditingInventory && (
              <div className="mt-4 bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                  <p className="text-xs text-amber-800">
                    <span className="font-bold">Note:</span> Chips marked with "S/N" (1M, 5M, 10M) require serial number tracking for every transaction.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Comments Field (Only visible when editing) */}
          {isEditingInventory && (
            <div className="mt-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Comments / Reason for Changes *
              </label>
              <textarea
                value={editComments}
                onChange={(e) => setEditComments(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
                placeholder="Please explain why you are updating the vault inventory (e.g., physical audit correction, deposit received, withdrawal made)..."
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Required for audit trail purposes
              </p>
            </div>
          )}

          {!isManagement && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                <span className="font-bold">Note:</span> Only management can edit vault inventory directly. Use the transfer system to move cash/chips in or out.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pending Transfers */}
      {pendingTransfers.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <h3 className="text-lg font-bold text-yellow-900">Pending Approvals</h3>
            <span className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold">
              {pendingTransfers.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingTransfers.map((transfer) => (
              <div key={transfer.id} className="bg-white rounded-lg p-4 border border-yellow-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      transfer.type === "Credit" 
                        ? "bg-amber-100 text-amber-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {transfer.type === "Credit" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {transfer.type} - {transfer.assetType}
                      </p>
                      <p className="text-xs text-slate-500">by {transfer.cashierName}</p>
                      <p className="text-xs text-slate-600">{formatTimestamp(transfer.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">
                      {formatCurrency(transfer.amount)}
                    </p>
                    <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full font-medium">
                      Pending
                    </span>
                  </div>
                </div>
                {transfer.notes && (
                  <p className="mt-2 mb-3 text-sm text-slate-600 pl-11 border-l-2 border-slate-200">{transfer.notes}</p>
                )}
                
                {/* Approval Buttons (Only for Management) */}
                {isManagement && onApprove && onReject && (
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                    <button
                      onClick={() => handleApprove(transfer.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(transfer.id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                  </div>
                )}
                
                {!isManagement && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500 italic">
                      ⏳ Waiting for management approval
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transfer History */}
      <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Transfer History</h3>
          <p className="text-sm text-slate-600 mt-1">All vault transactions</p>
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
                  Asset
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                  Cashier
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {completedTransfers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No completed transfers yet
                  </td>
                </tr>
              ) : (
                completedTransfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {formatTimestamp(transfer.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {transfer.type === "Credit" ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-medium text-amber-700">Credit</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">Fill</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {transfer.assetType}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      {formatCurrency(transfer.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {transfer.cashierName}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transfer.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {transfer.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Form Modal */}
      {showTransferForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <Vault className="w-6 h-6" />
                <h2 className="text-xl font-bold">Vault Transfer</h2>
              </div>
              <button
                onClick={() => setShowTransferForm(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Transfer Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Transfer Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTransferType("Credit")}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      transferType === "Credit"
                        ? "border-amber-500 bg-amber-50 text-amber-900 font-bold"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <ArrowUp className="w-5 h-5 mx-auto mb-1" />
                    Credit (Send to Vault)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferType("Fill")}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      transferType === "Fill"
                        ? "border-blue-500 bg-blue-50 text-blue-900 font-bold"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <ArrowDown className="w-5 h-5 mx-auto mb-1" />
                    Fill (Request from Vault)
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {transferType === "Credit" 
                    ? "Transfer excess cash or chips to the vault" 
                    : "Request additional cash or chips from the vault"}
                </p>
              </div>

              {/* Cash Bill Denomination Breakdown */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <label className="block text-sm font-semibold text-green-900 mb-3">
                  Cash Bill Denomination Breakdown
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {billDenominations.map((denom) => (
                    <div key={denom} className="bg-white rounded-lg p-3 border border-green-200">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        CFA {denom.toLocaleString()}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={cashBills[denom.toString()] === 0 ? "" : cashBills[denom.toString()]}
                        onChange={(e) =>
                          handleCashBillChange(denom.toString(), parseInt(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0"
                      />
                      {cashBills[denom.toString()] > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                          CFA {((cashBills[denom.toString()] || 0) * denom).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Cash Total Display */}
                <div className="mt-4 pt-4 border-t border-green-300">
                  <div className="flex items-center justify-between bg-green-100 rounded-lg p-4 border-2 border-green-300">
                    <span className="text-sm font-semibold text-green-900">Total Cash:</span>
                    <span className="text-2xl font-bold text-green-900">
                      CFA {cashTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chip Denomination Breakdown */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
                <label className="block text-sm font-semibold text-purple-900 mb-3">
                  Chip Denomination Breakdown
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {chipDenominations.map((denom) => (
                    <div key={denom} className="bg-white rounded-lg p-3 border border-purple-200">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {parseInt(denom).toLocaleString()}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={chipCounts[denom] === 0 ? "" : chipCounts[denom]}
                        onChange={(e) =>
                          handleChipCountChange(denom, parseInt(e.target.value) || 0)
                        }
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0"
                      />
                      {chipCounts[denom] > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                          {((chipCounts[denom] || 0) * parseInt(denom)).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chip Total Display */}
                <div className="mt-4 pt-4 border-t border-purple-300">
                  <div className="flex items-center justify-between bg-purple-100 rounded-lg p-4 border-2 border-purple-300">
                    <span className="text-sm font-semibold text-purple-900">Total Chips:</span>
                    <span className="text-2xl font-bold text-purple-900">
                      CFA {chipTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grand Total Summary */}
              {(cashTotal > 0 || chipTotal > 0) && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-lg p-6">
                  <h3 className="text-sm font-bold text-amber-900 mb-4">Transfer Summary</h3>
                  <div className="space-y-2">
                    {cashTotal > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-700">Cash:</span>
                        <span className="text-lg font-bold text-green-900">CFA {cashTotal.toLocaleString()}</span>
                      </div>
                    )}
                    {chipTotal > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-700">Chips:</span>
                        <span className="text-lg font-bold text-purple-900">CFA {chipTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t-2 border-amber-300 flex justify-between items-center">
                      <span className="text-base font-bold text-amber-900">Grand Total:</span>
                      <span className="text-2xl font-bold text-amber-900">
                        CFA {(cashTotal + chipTotal).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes/Reason
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows={3}
                  placeholder="Reason for transfer..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowTransferForm(false)}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Submit Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credential Prompt Modal */}
      {showCredentialPrompt && (
        <PasswordVerificationModal
          onVerify={handleVerifyAndSave}
          onCancel={handleCancelCredentials}
          title="Vault Inventory Update"
          message={`Please enter your credentials to update vault inventory. Reason: ${editComments}`}
          requiredRole="Management"
        />
      )}

      {/* Serial Number Prompt Modal */}
      {showSerialNumberPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <Vault className="w-6 h-6" />
                <h2 className="text-xl font-bold">Enter Serial Numbers</h2>
              </div>
              <button
                onClick={handleCancelSerialNumbers}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Security Notice */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <span className="font-bold">Security Check Required:</span> Please enter the serial numbers for the chips being updated. This action will be logged for audit purposes.
                </p>
              </div>

              {/* Show Comments Preview */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Comments
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-sm text-slate-700">{editComments}</p>
                </div>
              </div>

              {/* Serial Number Inputs */}
              <div className="space-y-4">
                {Object.entries(currentSerialInput).map(([key, value]) => {
                  const [denom] = key.split('-');
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-slate-700">
                        {formatCurrency(parseInt(denom), "")} Chip
                      </span>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setCurrentSerialInput({ ...currentSerialInput, [key]: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter serial number"
                        required
                      />
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCancelSerialNumbers}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSerialNumbersComplete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Verification Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
              <div className="flex items-center gap-3">
                <Vault className="w-6 h-6" />
                <h2 className="text-xl font-bold">Password Verification</h2>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Security Notice */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <span className="font-bold">Security Check Required:</span> Please enter your credentials to approve or reject this transfer.
                </p>
              </div>

              {/* Show Comments Preview */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Comments
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-sm text-slate-700">{editComments}</p>
                </div>
              </div>

              {/* Username and Password Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={credentialUsername}
                    onChange={(e) => setCredentialUsername(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={credentialPassword}
                    onChange={(e) => setCredentialPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {pendingAction?.type === 'reject' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Rejection Reason
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={3}
                      placeholder="Enter the reason for rejection..."
                      required
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordModalSubmit}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}