import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-Router";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  ArrowUpDown,
  Calendar,
  Vault,
  Wallet,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Building2,
  User,
  Download,
  Printer,
  History,
  Eye,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { APP_CURRENCY } from "../utils/currency";
import { logAction } from "../utils/auditLog";
import { ThermalReceipt } from "./ThermalReceipt";
import { useApi } from "../hooks/useApi";

// Hardcoded property - Grand Palace Casino v2.3.2
const PROPERTY_NAME = "Grand Palace Casino";

interface ChipDenomination {
  [key: string]: number;
}

interface HighValueChip {
  serialNumber: string;
  denomination: "10000000" | "5000000" | "1000000";
  status: "In Cage" | "Issued";
  issuedTo?: string; // Table name if issued
  issuedDate?: string;
  receivedDate?: string;
  notes?: string;
}

interface CageOperation {
  id: string;
  type: "Issue to Table" | "Accept from Table" | "Player Cashout";
  tableName?: string;
  playerName?: string;
  amount: number;
  currency: string;
  chips: ChipDenomination;
  highValueChips?: string[]; // Serial numbers of high-value chips
  cashierName: string;
  timestamp: string;
  notes: string;
  referenceId?: string; // Link to float transaction if applicable
  status: "Submitted" | "Admitted" | "Issued" | "Received" | "Approved" | "Rejected"; // Workflow status
  submittedBy?: string; // Who submitted (Pit Manager)
  admittedBy?: string; // Who admitted (Cashier)
  admittedTimestamp?: string;
  issuedBy?: string; // Who issued (Cashier)
  issuedTimestamp?: string;
  receivedBy?: string; // Who received (Pit Boss at table)
  receivedTimestamp?: string;
  approvedBy?: string; // Who approved (Cashier)
  approvalTimestamp?: string; // When approved/rejected
  rejectionReason?: string; // Reason if rejected
}

interface MainFloat {
  id: string;
  chips: ChipDenomination;
  highValueChips: HighValueChip[]; // Track 10M and 5M chips individually
  totalAmount: number;
  cashBalance: number; // Track cash balance separately
  currency: string;
  lastUpdated: string;
}

interface CashTransaction {
  id: string;
  type: "Cash Out" | "Cash In";
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

interface VaultTransfer {
  id: string;
  type: "Credit" | "Fill";
  assetType: "Cash" | "Chips";
  amount: number;
  chips?: { [key: string]: number };
  currency: string;
  cashierName: string;
  timestamp: string;
  notes: string;
  status: "Pending" | "Approved" | "Rejected";
}

export function Cage() {
  const [activeTab, setActiveTab] = useState<"cashiersfloat" | "operations" | "vault">("cashiersfloat");
  const [operationsSubTab, setOperationsSubTab] = useState<"chips" | "cash">("chips");
  const [mainFloat, setMainFloat] = useState<MainFloat | null>(null);
  const [operations, setOperations] = useState<CageOperation[]>([]);
  const [showOperationForm, setShowOperationForm] = useState(false);
  const [filterType, setFilterType] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [printingOperation, setPrintingOperation] = useState<CageOperation | null>(null);
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [showBuyInForm, setShowBuyInForm] = useState(false);
  const [buyInTransactions, setBuyInTransactions] = useState<any[]>([]);
  const [printingBuyIn, setPrintingBuyIn] = useState<any | null>(null);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>([]);
  const [showCashTransactionForm, setShowCashTransactionForm] = useState(false);
  const [vaultTransfers, setVaultTransfers] = useState<VaultTransfer[]>([]);
  const [vaultInventory, setVaultInventory] = useState({
    cash: 0,
    chips: {} as { [key: string]: number },
    totalChipValue: 0,
    currency: APP_CURRENCY,
  });
  
  // Thermal receipt printing state
  const [thermalReceipt, setThermalReceipt] = useState<{ type: string; data: any } | null>(null);
  
  const { currentUser, isViewOnly } = useOutletContext<{ 
    currentUser: { username: string; userType: string } | null; 
    isViewOnly: boolean;
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  
  // Hardcoded property - Grand Palace Casino v2.3.2
  const currentProperty = PROPERTY_NAME;

  useEffect(() => {
    loadCageData();
  }, []); // Removed api.currentProperty dependency since it's constant

  const loadCageData = async () => {
    setIsLoading(true);
    try {
      // Load main float
      const floatData = await api.getMainFloat();
      if (floatData) {
        // Recalculate chip total to ensure accuracy
        const recalculatedTotal = calculateChipValue(floatData.chips);
        
        // Ensure cashBalance is initialized
        if (floatData.cashBalance === undefined) {
          floatData.cashBalance = 0;
        }
        
        const updatedFloatData = {
          ...floatData,
          totalAmount: recalculatedTotal,
        };
        setMainFloat(updatedFloatData);
        
        // IMPORTANT: Reset cashBalance by recalculating from all transactions
        // This fixes any historical corruption of the cashBalance value
        const shouldRecalculateCashBalance = floatData.cashBalance < -1000000000; // If absurdly negative
        
        if (shouldRecalculateCashBalance) {
          // Recalculate cash balance from scratch
          const ops = await api.getCageOperations();
          const buyIns = await api.getBuyInTransactions();
          const cashTx = await api.getCashTransactions();
          
          let recalculatedCashBalance = 0;
          
          // Add all buy-ins
          buyIns.forEach(tx => {
            recalculatedCashBalance += tx.amount;
          });
          
          // Add/subtract cash transactions
          cashTx.forEach(tx => {
            if (tx.type === "Cash In") {
              recalculatedCashBalance += tx.amount;
            } else if (tx.type === "Cash Out") {
              recalculatedCashBalance -= tx.amount;
            }
          });
          
          // Subtract player cashouts (only approved ones)
          ops.forEach(op => {
            if (op.type === "Player Cashout" && (op.status === "Approved" || op.status === "Received")) {
              recalculatedCashBalance -= op.amount;
            }
          });
          
          // Update the float with corrected balance
          const correctedFloat = {
            ...updatedFloatData,
            cashBalance: recalculatedCashBalance,
          };
          
          await api.saveMainFloat(correctedFloat);
          setMainFloat(correctedFloat);
          
          console.log(`✅ Cash balance recalculated: ${recalculatedCashBalance} FCFA`);
        }
        
        // Save the corrected data back if total was wrong or cashBalance was missing
        if (floatData.totalAmount !== recalculatedTotal || floatData.cashBalance === undefined) {
          await api.saveMainFloat(updatedFloatData);
        }
      } else {
        // Initialize with default chips if no data
        const defaultFloat: MainFloat = {
          id: "main-float-1",
          chips: {
            "1000000": 0,
            "500000": 0,
            "100000": 0,
            "50000": 0,
            "25000": 0,
            "10000": 0,
            "5000": 0,
            "1000": 0,
            "500": 0,
            "250": 0,
          },
          highValueChips: [],
          totalAmount: 0,
          cashBalance: 0, // Initialize cash balance
          currency: APP_CURRENCY,
          lastUpdated: new Date().toISOString(),
        };
        setMainFloat(defaultFloat);
        await api.saveMainFloat(defaultFloat);
      }

      // Load operations
      const ops = await api.getCageOperations();
      setOperations(ops);

      // Load available tables
      const tables = await api.getAvailableTables();
      setAvailableTables(tables);

      // Load buy-in transactions
      const buyIns = await api.getBuyInTransactions();
      setBuyInTransactions(buyIns);

      // Load cash transactions
      const cashTx = await api.getCashTransactions();
      setCashTransactions(cashTx);

      // Load vault transfers
      const vaultTx = await api.getVaultTransfers();
      setVaultTransfers(vaultTx);

      // Load vault inventory
      const vault = await api.getVaultInventory();
      if (vault) {
        setVaultInventory(vault);
      }
    } catch (error) {
      console.error("Error loading cage data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateChipValue = (chips: ChipDenomination): number => {
    return Object.entries(chips).reduce((total, [denom, count]) => {
      return total + (parseInt(denom) * count);
    }, 0);
  };

  const handleAddOperation = async (operationData: Omit<CageOperation, "id" | "timestamp">) => {
    if (!mainFloat) return;

    const newOperation: CageOperation = {
      ...operationData,
      id: `cage-op-${Date.now()}`,
      timestamp: new Date().toISOString(),
      cashierName: currentUser?.username || "Unknown",
    };

    // Only update float if operation is approved or doesn't need approval
    if (newOperation.status === "Approved") {
      // Calculate chip changes based on operation type
      const updatedChips = { ...mainFloat.chips };
      let cashChange = 0;
      
      // Deductions from cage (chips go OUT)
      if (["Issue to Table"].includes(newOperation.type)) {
        Object.entries(newOperation.chips).forEach(([denom, count]) => {
          updatedChips[denom] = (updatedChips[denom] || 0) - count;
        });
      }
      
      // Additions to cage (chips come IN)
      if (["Accept from Table", "Player Cashout"].includes(newOperation.type)) {
        Object.entries(newOperation.chips).forEach(([denom, count]) => {
          updatedChips[denom] = (updatedChips[denom] || 0) + count;
        });
      }
      
      // Player Cashout: Cash goes OUT (even exchange)
      if (newOperation.type === "Player Cashout") {
        cashChange = -newOperation.amount; // Negative = cash leaving cage
      }

      const updatedFloat: MainFloat = {
        ...mainFloat,
        chips: updatedChips,
        totalAmount: calculateChipValue(updatedChips),
        cashBalance: (mainFloat.cashBalance || 0) + cashChange,
        lastUpdated: new Date().toISOString(),
      };

      try {
        await api.saveMainFloat(updatedFloat);
        await api.createCageOperation(newOperation);
        setMainFloat(updatedFloat);
        setOperations([newOperation, ...operations]);
        setShowOperationForm(false);
        
        // Auto-print thermal receipt for approved operations
        setThermalReceipt({
          type: "cage-operation",
          data: newOperation
        });
      } catch (error) {
        console.error("Error saving cage operation:", error);
        alert("Failed to save operation. Please try again.");
      }
    } else {
      // Pending operation - don't update float yet
      try {
        await api.createCageOperation(newOperation);
        setOperations([newOperation, ...operations]);
        setShowOperationForm(false);
        
        // Auto-print thermal receipt for pending operations too
        setThermalReceipt({
          type: "cage-operation",
          data: newOperation
        });
      } catch (error) {
        console.error("Error saving cage operation:", error);
        alert("Failed to save operation. Please try again.");
      }
    }
  };

  const handleApproveOperation = async (operationId: string) => {
    if (!mainFloat) return;

    const operation = operations.find(op => op.id === operationId);
    if (!operation) return;

    // Update operation status
    const updatedOperation: CageOperation = {
      ...operation,
      status: "Approved",
      approvedBy: currentUser?.username || "Unknown",
      approvalTimestamp: new Date().toISOString(),
    };

    // Calculate chip changes based on operation type
    const updatedChips = { ...mainFloat.chips };
    let cashChange = 0;
    
    // Deductions from cage (chips go OUT)
    if (["Issue to Table"].includes(operation.type)) {
      Object.entries(operation.chips).forEach(([denom, count]) => {
        updatedChips[denom] = (updatedChips[denom] || 0) - count;
      });
    }
    
    // Additions to cage (chips come IN)
    if (["Accept from Table", "Player Cashout"].includes(operation.type)) {
      Object.entries(operation.chips).forEach(([denom, count]) => {
        updatedChips[denom] = (updatedChips[denom] || 0) + count;
      });
    }
    
    // Player Cashout: Cash goes OUT (even exchange)
    if (operation.type === "Player Cashout") {
      cashChange = -operation.amount; // Negative = cash leaving cage
    }

    const updatedFloat: MainFloat = {
      ...mainFloat,
      chips: updatedChips,
      totalAmount: calculateChipValue(updatedChips),
      cashBalance: (mainFloat.cashBalance || 0) + cashChange,
      lastUpdated: new Date().toISOString(),
    };

    try {
      await api.saveMainFloat(updatedFloat);
      await api.updateCageOperation(operationId, updatedOperation);
      setMainFloat(updatedFloat);
      setOperations(operations.map(op => op.id === operationId ? updatedOperation : op));
    } catch (error) {
      console.error("Error approving operation:", error);
      alert("Failed to approve operation. Please try again.");
    }
  };

  const handleRejectOperation = async (operationId: string, reason: string) => {
    const operation = operations.find(op => op.id === operationId);
    if (!operation) return;

    const updatedOperation: CageOperation = {
      ...operation,
      status: "Rejected",
      approvedBy: currentUser?.username || "Unknown",
      approvalTimestamp: new Date().toISOString(),
      rejectionReason: reason,
    };

    try {
      await api.updateCageOperation(operationId, updatedOperation);
      setOperations(operations.map(op => op.id === operationId ? updatedOperation : op));
    } catch (error) {
      console.error("Error rejecting operation:", error);
      alert("Failed to reject operation. Please try again.");
    }
  };

  // Workflow handlers for Fills and Credits
  const handleAdmitOperation = async (operationId: string) => {
    const operation = operations.find(op => op.id === operationId);
    if (!operation) return;

    const updatedOperation: CageOperation = {
      ...operation,
      status: "Admitted",
      admittedBy: currentUser?.username || "Unknown",
      admittedTimestamp: new Date().toISOString(),
    };

    try {
      await api.updateCageOperation(operationId, updatedOperation);
      setOperations(operations.map(op => op.id === operationId ? updatedOperation : op));
    } catch (error) {
      console.error("Error admitting operation:", error);
      alert("Failed to admit operation. Please try again.");
    }
  };

  const handleIssueOperation = async (operationId: string) => {
    if (!mainFloat) return;

    const operation = operations.find(op => op.id === operationId);
    if (!operation) return;

    // Calculate chip changes based on operation type
    const updatedChips = { ...mainFloat.chips };
    
    // For Fill - chips go OUT of cage
    if (operation.type === "Issue to Table") {
      Object.entries(operation.chips).forEach(([denom, count]) => {
        updatedChips[denom] = (updatedChips[denom] || 0) - count;
      });
    }
    
    // For Credit - chips come IN to cage
    if (operation.type === "Accept from Table") {
      Object.entries(operation.chips).forEach(([denom, count]) => {
        updatedChips[denom] = (updatedChips[denom] || 0) + count;
      });
    }

    const updatedFloat: MainFloat = {
      ...mainFloat,
      chips: updatedChips,
      totalAmount: calculateChipValue(updatedChips),
      lastUpdated: new Date().toISOString(),
    };

    const updatedOperation: CageOperation = {
      ...operation,
      status: "Issued",
      issuedBy: currentUser?.username || "Unknown",
      issuedTimestamp: new Date().toISOString(),
    };

    try {
      await api.saveMainFloat(updatedFloat);
      await api.updateCageOperation(operationId, updatedOperation);
      setMainFloat(updatedFloat);
      setOperations(operations.map(op => op.id === operationId ? updatedOperation : op));
    } catch (error) {
      console.error("Error issuing operation:", error);
      alert("Failed to issue operation. Please try again.");
    }
  };

  const handleReceiveOperation = async (operationId: string) => {
    const operation = operations.find(op => op.id === operationId);
    if (!operation) return;

    const updatedOperation: CageOperation = {
      ...operation,
      status: "Received",
      receivedBy: currentUser?.username || "Unknown",
      receivedTimestamp: new Date().toISOString(),
    };

    try {
      await api.updateCageOperation(operationId, updatedOperation);
      setOperations(operations.map(op => op.id === operationId ? updatedOperation : op));
    } catch (error) {
      console.error("Error marking operation as received:", error);
      alert("Failed to mark operation as received. Please try again.");
    }
  };

  const formatCurrency = (amount: number | undefined, currency: string = APP_CURRENCY) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return `${currency} 0`;
    }
    return `${currency} ${amount.toLocaleString()}`;
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

  const getChipSummary = (chips: ChipDenomination) => {
    if (!chips || typeof chips !== 'object') {
      return 'No chips';
    }
    return Object.entries(chips)
      .filter(([_, count]) => count > 0)
      .sort(([a], [b]) => parseInt(b) - parseInt(a))
      .map(([denom, count]) => `${count}×${parseInt(denom).toLocaleString()}`)
      .join(", ") || 'No chips';
  };

  const getOperationColor = (type: string) => {
    switch (type) {
      case "Issue to Table":
        return "bg-red-100 text-red-800";
      case "Accept from Table":
      case "Player Cashout":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case "Issue to Table":
        return <Minus className="w-4 h-4" />;
      case "Accept from Table":
      case "Player Cashout":
        return <Plus className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  // Filter operations
  const filteredOperations = operations.filter((op) => {
    const matchesType = filterType === "" || op.type === filterType;
    
    let matchesDate = true;
    if (filterDateFrom || filterDateTo) {
      const opDate = new Date(op.timestamp);
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && opDate >= fromDate;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && opDate <= toDate;
      }
    }
    
    return matchesType && matchesDate;
  });

  // Separate pending and approved/rejected operations
  const pendingOperations = operations.filter(op => 
    ["Submitted", "Admitted", "Issued"].includes(op.status)
  );
  const approvedOperations = filteredOperations.filter(op => op.status === "Approved");

  // Calculate statistics for operations tab - ONLY count Received/Approved operations
  const totalOut = operations
    .filter(op => 
      ["Issue to Table", "Player Cashout"].includes(op.type) && 
      (op.status === "Received" || op.status === "Approved")
    )
    .reduce((sum, op) => sum + op.amount, 0);
  
  const totalIn = operations
    .filter(op => 
      ["Accept from Table"].includes(op.type) && 
      (op.status === "Received" || op.status === "Approved")
    )
    .reduce((sum, op) => sum + op.amount, 0);

  const chipDenominations = [
    "10000000", "5000000", "1000000", "500000", "100000", "50000", "25000", 
    "10000", "5000", "1000"
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading cage data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Only Banner */}
      {isViewOnly && <ViewOnlyBanner />}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Vault className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cage Management</h1>
            <p className="text-sm text-slate-600">Cashiers float, operations, and vault management</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("cashiersfloat")}
              className={`flex-1 px-8 py-6 text-base font-semibold transition-all ${
                activeTab === "cashiersfloat"
                  ? "text-green-700 border-b-4 border-green-600 bg-green-50"
                  : "text-green-600 border-b-2 border-green-300 bg-white hover:bg-green-50"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <User className="w-6 h-6" />
                <span className="text-lg">Cashiers Float</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("operations")}
              className={`flex-1 px-8 py-6 text-base font-semibold transition-all ${
                activeTab === "operations"
                  ? "text-blue-700 border-b-4 border-blue-600 bg-blue-50"
                  : "text-blue-600 border-b-2 border-blue-300 bg-white hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <History className="w-6 h-6" />
                <span className="text-lg">Operations</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("vault")}
              className={`flex-1 px-8 py-6 text-base font-semibold transition-all ${
                activeTab === "vault"
                  ? "text-amber-700 border-b-4 border-amber-600 bg-amber-50"
                  : "text-amber-600 border-b-2 border-amber-300 bg-white hover:bg-amber-50"
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <Lock className="w-6 h-6" />
                <span className="text-lg">Vault</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "cashiersfloat" && (
            <CashierFloat 
              currentUser={currentUser}
              buyInTransactions={buyInTransactions}
              cageOperations={operations}
              isViewOnly={isViewOnly}
            />
          )}

          {activeTab === "operations" && (
            <div className="space-y-6">
              {/* Large Action Buttons for Chips and Cash Transactions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chips Transaction Button */}
                <button
                  onClick={() => {
                    setOperationsSubTab("chips");
                    if (!isViewOnly) {
                      setShowOperationForm(true);
                    }
                  }}
                  disabled={isViewOnly}
                  className={`relative overflow-hidden group ${
                    isViewOnly 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-2xl hover:scale-105'
                  } transition-all duration-300 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                      <Coins className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Chips Transactions</h3>
                      <p className="text-blue-100 text-sm">Issue to table, Accept from table, Player cashout</p>
                    </div>
                    <div className="mt-2 px-6 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                      Click to Create New Transaction
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/0 via-purple-400/0 to-pink-400/20 group-hover:from-blue-400/20 group-hover:via-purple-400/20 group-hover:to-pink-400/40 transition-all duration-500"></div>
                </button>

                {/* Cash Transaction Button */}
                <button
                  onClick={() => {
                    setOperationsSubTab("cash");
                    if (!isViewOnly) {
                      setShowCashTransactionForm(true);
                    }
                  }}
                  disabled={isViewOnly}
                  className={`relative overflow-hidden group ${
                    isViewOnly 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-2xl hover:scale-105'
                  } transition-all duration-300 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-lg`}
                >
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                      <DollarSign className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Cash Transactions</h3>
                      <p className="text-emerald-100 text-sm">Cash in, Cash out, Money in, Money out</p>
                    </div>
                    <div className="mt-2 px-6 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
                      Click to Create New Transaction
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/0 via-teal-400/0 to-cyan-400/20 group-hover:from-emerald-400/20 group-hover:via-teal-400/20 group-hover:to-cyan-400/40 transition-all duration-500"></div>
                </button>
              </div>

              {/* Show the appropriate transaction list based on current sub-tab */}
              {operationsSubTab === "chips" && (
                <ChipsTransactions
                  onNewTransaction={() => setShowOperationForm(true)}
                  isViewOnly={isViewOnly}
                />
              )}

              {operationsSubTab === "cash" && (
                <CashTransactions
                  transactions={cashTransactions}
                  onNewTransaction={() => setShowCashTransactionForm(true)}
                  isViewOnly={isViewOnly}
                />
              )}
            </div>
          )}

          {activeTab === "vault" && (
            <VaultTab
              cashierName={currentUser?.username || "Unknown"}
              userType={currentUser?.userType || ""}
              vaultInventory={vaultInventory}
              onUpdateInventory={async (updatedInventory) => {
                try {
                  await api.updateVaultInventory(updatedInventory);
                  setVaultInventory(updatedInventory);
                } catch (error) {
                  console.error("Error updating vault inventory:", error);
                  alert("Failed to update vault inventory. Please try again.");
                }
              }}
              onTransfer={async (transfer) => {
                try {
                  const newTransfer = await api.createVaultTransfer(transfer);
                  setVaultTransfers([newTransfer, ...vaultTransfers]);
                  
                  // Auto-print thermal receipt immediately after transfer submission
                  setThermalReceipt({
                    type: "vault-transfer",
                    data: newTransfer
                  });
                } catch (error) {
                  console.error("Error creating vault transfer:", error);
                  alert("Failed to create transfer. Please try again.");
                }
              }}
              onApprove={async (transferId, approvedBy) => {
                try {
                  const transfer = vaultTransfers.find(t => t.id === transferId);
                  if (!transfer) return;

                  const updatedTransfer = {
                    ...transfer,
                    status: "Approved" as const,
                    approvedBy,
                    approvalTimestamp: new Date().toISOString(),
                  };

                  await api.updateVaultTransfer(transferId, updatedTransfer);
                  setVaultTransfers(vaultTransfers.map(t => t.id === transferId ? updatedTransfer : t));

                  // Auto-print thermal receipt after successful approval
                  setThermalReceipt({
                    type: "vault-transfer",
                    data: updatedTransfer
                  });

                  alert(`Transfer approved successfully by ${approvedBy}`);
                } catch (error) {
                  console.error("Error approving vault transfer:", error);
                  alert("Failed to approve transfer. Please try again.");
                }
              }}
              onReject={async (transferId, rejectedBy, reason) => {
                try {
                  const transfer = vaultTransfers.find(t => t.id === transferId);
                  if (!transfer) return;

                  const updatedTransfer = {
                    ...transfer,
                    status: "Rejected" as const,
                    rejectedBy,
                    rejectionReason: reason,
                    rejectionTimestamp: new Date().toISOString(),
                  };

                  await api.updateVaultTransfer(transferId, updatedTransfer);
                  setVaultTransfers(vaultTransfers.map(t => t.id === transferId ? updatedTransfer : t));

                  alert(`Transfer rejected by ${rejectedBy}: ${reason}`);
                } catch (error) {
                  console.error("Error rejecting vault transfer:", error);
                  alert("Failed to reject transfer. Please try again.");
                }
              }}
              transfers={vaultTransfers}
            />
          )}

          {activeTab === "operations" && (
            <div className="space-y-6">
              {/* Operations Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border-2 border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-600 mb-1">Total Operations</p>
                  <p className="text-2xl font-bold text-slate-900">{operations.length}</p>
                </div>
                <div className="bg-white border-2 border-red-200 rounded-lg p-4">
                  <p className="text-xs text-red-600 mb-1">Money Out</p>
                  <p className="text-2xl font-bold text-red-900">{formatCurrency(totalOut)}</p>
                </div>
                <div className="bg-white border-2 border-green-200 rounded-lg p-4">
                  <p className="text-xs text-green-600 mb-1">Money In</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(totalIn)}</p>
                </div>
                <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
                  <p className="text-xs text-purple-600 mb-1">Net Change</p>
                  <p className={`text-2xl font-bold ${totalIn - totalOut >= 0 ? "text-green-900" : "text-red-900"}`}>
                    {formatCurrency(totalIn - totalOut)}
                  </p>
                </div>
              </div>

              {/* Pending Operations */}
              <PendingOperations
                operations={pendingOperations}
                onApprove={handleApproveOperation}
                onReject={handleRejectOperation}
                onAdmit={handleAdmitOperation}
                onIssue={handleIssueOperation}
                onReceive={handleReceiveOperation}
                formatCurrency={formatCurrency}
                formatTimestamp={formatTimestamp}
                getChipSummary={getChipSummary}
              />

              {/* Filters */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium mb-2"
                >
                  {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  <FileText className="w-5 h-5" />
                  Filter Operations
                </button>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Operation Type</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">All Types</option>
                        <option value="Issue to Table">Issue to Table</option>
                        <option value="Accept from Table">Accept from Table</option>
                        <option value="Player Cashout">Player Cashout</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
                      <input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
                      <input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Operations Table */}
              <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Chips
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Cashier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredOperations.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                            <History className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                            <p>No operations found</p>
                            {(filterType || filterDateFrom || filterDateTo) && (
                              <p className="text-sm mt-1">Try adjusting your filters</p>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredOperations.map((op, index) => (
                          <tr key={`${op.id}-${index}`} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getOperationColor(op.type)}`}>
                                {getOperationIcon(op.type)}
                                {op.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                              {op.tableName && <div className="font-medium">{op.tableName}</div>}
                              {op.playerName && <div className="text-slate-600">{op.playerName}</div>}
                              {!op.tableName && !op.playerName && <span className="text-slate-400">-</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-bold ${
                                ["Issue to Table"].includes(op.type)
                                  ? "text-red-700"
                                  : "text-green-700"
                              }`}>
                                {["Issue to Table"].includes(op.type) ? "-" : "+"}
                                {formatCurrency(op.amount, op.currency)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              <div className="max-w-xs truncate" title={getChipSummary(op.chips)}>
                                {getChipSummary(op.chips)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                              <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4 text-slate-400" />
                                {op.cashierName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {formatTimestamp(op.timestamp)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => setPrintingOperation(op)}
                                className="text-purple-600 hover:text-purple-800"
                                title="Print"
                              >
                                <Printer className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "buyin" && (
            <div className="space-y-6">
              {/* Buy-In Header with Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Cage Buy-In Transactions</h3>
                  <p className="text-sm text-slate-600 mt-1">Guest buy-ins with printable receipts - recorded as Cash In</p>
                </div>
                {!isViewOnly && (
                  <button
                    onClick={() => setShowBuyInForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    New Buy-In
                  </button>
                )}
              </div>

              {/* Buy-In Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border-2 border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-emerald-800">Total Buy-Ins</p>
                    <Wallet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-bold text-emerald-900">{buyInTransactions.length}</p>
                  <p className="text-xs text-emerald-600 mt-2">Transactions recorded</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-green-800">Total Cash In</p>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-900">
                    {formatCurrency(
                      buyInTransactions.reduce((sum, t) => sum + t.amount, 0),
                      mainFloat?.currency || "FCFA"
                    )}
                  </p>
                  <p className="text-xs text-green-600 mt-2">Total amount collected</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border-2 border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-teal-800">Recent Activity</p>
                    <Clock className="w-5 h-5 text-teal-600" />
                  </div>
                  <p className="text-3xl font-bold text-teal-900">
                    {buyInTransactions.filter(t => {
                      const transactionDate = new Date(t.timestamp);
                      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                      return transactionDate >= oneDayAgo;
                    }).length}
                  </p>
                  <p className="text-xs text-teal-600 mt-2">Last 24 hours</p>
                </div>
              </div>

              {/* Buy-in Transactions Table */}
              <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Player Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Table
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Cashier
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {buyInTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                            <Wallet className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                            <p>No buy-in transactions found</p>
                            <p className="text-sm mt-1">Click "New Buy-In" to record a transaction</p>
                          </td>
                        </tr>
                      ) : (
                        buyInTransactions.map((transaction, index) => (
                          <tr key={`${transaction.id}-${index}`} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-medium text-slate-900">
                                  {transaction.playerName || <span className="text-slate-400">Guest</span>}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {transaction.tableNumber || <span className="text-slate-400">-</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                                <TrendingUp className="w-3.5 h-3.5" />
                                {formatCurrency(transaction.amount, transaction.currency)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                              {transaction.cashierName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {formatTimestamp(transaction.timestamp)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => setPrintingBuyIn(transaction)}
                                className="text-emerald-600 hover:text-emerald-800 transition-colors"
                                title="Print Receipt"
                              >
                                <Printer className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showOperationForm && mainFloat && (
        <CageOperationForm
          onSubmit={handleAddOperation}
          onCancel={() => setShowOperationForm(false)}
          currentFloat={mainFloat}
          currentUser={currentUser}
          availableTables={availableTables}
        />
      )}
      {printingOperation && (
        <CageOperationPrintout
          operation={printingOperation}
          onClose={() => setPrintingOperation(null)}
        />
      )}
      {showBuyInForm && (
        <CageBuyInForm
          onSubmit={async (transaction) => {
            try {
              const newTransaction = await api.createBuyInTransaction(transaction);
              setBuyInTransactions([newTransaction, ...buyInTransactions]);
              
              // Update main float cash balance
              if (mainFloat) {
                const updatedFloat = {
                  ...mainFloat,
                  cashBalance: (mainFloat.cashBalance || 0) + newTransaction.amount,
                  lastUpdated: new Date().toISOString(),
                };
                await api.saveMainFloat(updatedFloat);
                setMainFloat(updatedFloat);
              }
              
              setShowBuyInForm(false);
              setPrintingBuyIn(newTransaction);
            } catch (error) {
              console.error("Error saving buy-in transaction:", error);
              alert("Failed to save transaction. Please try again.");
            }
          }}
          onClose={() => setShowBuyInForm(false)}
          cashierName={currentUser?.username || "Unknown"}
        />
      )}
      {printingBuyIn && (
        <ThermalReceipt
          type="buy-in"
          data={printingBuyIn}
          propertyName={currentProperty}
          onPrintComplete={() => setPrintingBuyIn(null)}
        />
      )}
      {showCashTransactionForm && (
        <CashTransactionForm
          onSubmit={async (transaction) => {
            try {
              const newTransaction = await api.createCashTransaction(transaction);
              setCashTransactions([newTransaction, ...cashTransactions]);
              
              // Update main float cash balance
              if (mainFloat) {
                let cashChange = 0;
                if (transaction.type === "Cash Out") {
                  cashChange = -transaction.amount; // Cash going out
                } else if (transaction.type === "Cash In") {
                  cashChange = transaction.amount; // Cash coming in
                }
                
                const updatedFloat = {
                  ...mainFloat,
                  cashBalance: (mainFloat.cashBalance || 0) + cashChange,
                  lastUpdated: new Date().toISOString(),
                };
                await api.saveMainFloat(updatedFloat);
                setMainFloat(updatedFloat);
              }
              
              setShowCashTransactionForm(false);
              
              // Auto-print thermal receipt
              setThermalReceipt({
                type: "cash-transaction",
                data: newTransaction
              });
            } catch (error) {
              console.error("Error saving cash transaction:", error);
              alert("Failed to save transaction. Please try again.");
            }
          }}
          onClose={() => setShowCashTransactionForm(false)}
          cashierName={currentUser?.username || "Unknown"}
        />
      )}
      
      {/* Thermal Receipt Auto-Print */}
      {thermalReceipt && (
        <ThermalReceipt
          type={thermalReceipt.type as any}
          data={thermalReceipt.data}
          propertyName={currentProperty}
          onPrintComplete={() => setThermalReceipt(null)}
        />
      )}
    </div>
  );
}