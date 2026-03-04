import { ThermalReceiptDual } from "./ThermalReceiptDual";
import { sendEndOfDayReportToManagement } from "../utils/emailService";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import {
  DollarSign,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Printer,
  Edit,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Table as TableIcon,
  User,
  Calendar,
  Filter,
  Eye,
  Download,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { ThermalReceiptDual } from "./ThermalReceiptDual";
import { sendEndOfDayReportToManagement } from "../utils/emailService";
import { useApi } from "../hooks/useApi";
const PROPERTY_NAME = "Grand Palace Casino";

interface ChipDenomination {
  [key: string]: number;
}

interface Float {
  id: string;
  tableName: string;
  dealerName: string;
  amount: number;
  currency?: string;
  gameType?: string;
  timestamp: string;
  status: string;
  type: "Open" | "Close" | "Fill" | "Credit";
  chips: ChipDenomination;
  notes: string;
  cashAmount?: number;
  winLoss?: number;
  dropAmount?: number;
  pitBoss?: string;
  inspectorName?: string;
}

interface CorrectionReport {
  id: string;
  floatId: string;
  tableName: string;
  originalAmount: number;
  correctedAmount: number;
  originalChips: ChipDenomination;
  correctedChips: ChipDenomination;
  reason: string;
  correctedBy: string;
  timestamp: string;
}

interface DropEntry {
  id: string;
  tableName: string;
  amount: number;
  currency: string;
  chips: ChipDenomination;
  timestamp: string;
  type: string;
  playerName: string;
}

export function Floats() {
  const [floats, setFloats] = useState<Float[]>([]);
  const [drops, setDrops] = useState<DropEntry[]>([]);
  const [ratings, setRatings] = useState<any[]>([]); // Add ratings state
  const [players, setPlayers] = useState<any[]>([]); // Add players state
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("Active"); // Changed from "All" to "Active"
  const [closingFloat, setClosingFloat] = useState<Float | null>(null);
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded so print buttons are visible
  const [filterTable, setFilterTable] = useState("");
  const [filterDealer, setFilterDealer] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [printingFloat, setPrintingFloat] = useState<Float | null>(null);
  const [correctingFloat, setCorrectingFloat] = useState<Float | null>(null);
  const [correctionReports, setCorrectionReports] = useState<CorrectionReport[]>([]);
  const [viewingReport, setViewingReport] = useState<CorrectionReport | null>(null);
  const [showRollShiftForm, setShowRollShiftForm] = useState(false);
  const [showDailyReport, setShowDailyReport] = useState(false);
  const [showCompletedTransactions, setShowCompletedTransactions] = useState(false); // New state for expandable completed section
  const [showActiveTransactions, setShowActiveTransactions] = useState(false); // Collapsed by default
  const [showTipsForm, setShowTipsForm] = useState(false);
  const [printingTips, setPrintingTips] = useState<any | null>(null);
  const [showClosedTables, setShowClosedTables] = useState(false); // New state for closed tables section
  const [showFloatReceipt, setShowFloatReceipt] = useState<Float | null>(null); // State for thermal receipt printing
  const { currentUser, isViewOnly } = useOutletContext<{ currentUser: { username: string; userType: string } | null; isViewOnly: boolean }>();
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    loadFloats();
    loadDrops();
    loadRatings();
    loadPlayers();
  }, [api.currentProperty]);

  const loadFloats = async () => {
    setIsLoading(true);
    try {
      const loadedFloats = await api.getFloats();
      setFloats(loadedFloats);
      
      // Load correction reports from localStorage (still local for now)
      const savedReports = localStorage.getItem("casino_correction_reports");
      if (savedReports) {
        setCorrectionReports(JSON.parse(savedReports));
      }
    } catch (error) {
      console.error("Error loading floats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDrops = async () => {
    try {
      const loadedDrops = await api.getDrops();
      setDrops(loadedDrops);
    } catch (error) {
      console.error("Error loading drops:", error);
    }
  };

  const loadRatings = async () => {
    try {
      const loadedRatings = await api.getRatings();
      setRatings(loadedRatings);
    } catch (error) {
      console.error("Error loading ratings:", error);
    }
  };

  const loadPlayers = async () => {
    try {
      const loadedPlayers = await api.getPlayers();
      setPlayers(loadedPlayers);
    } catch (error) {
      console.error("Error loading players:", error);
    }
  };

  const saveToStorage = async (updatedFloats: Float[]) => {
    try {
      // Update all floats
      for (const float of updatedFloats) {
        const existing = floats.find(f => f.id === float.id);
        if (!existing) {
          await api.createFloat(float);
        } else if (JSON.stringify(existing) !== JSON.stringify(float)) {
          await api.updateFloat(float.id, float);
        }
      }
      setFloats(updatedFloats);
    } catch (error) {
      console.error("Error saving floats:", error);
      alert("Failed to save floats. Please try again.");
    }
  };

  const handleAddFloat = async (floatData: Omit<Float, "id" | "timestamp" | "status">) => {
    // Fetch active table shifts to get dealer and inspector for the receipt
    let dealerName = floatData.dealerName || "";
    let inspectorName = "";
    
    if (floatData.tableName) {
      try {
        const shifts = await api.getTableShifts(floatData.tableName);
        const dealerShift = shifts.find((s: any) => s.role === "Dealer" && s.status === "Active");
        const inspectorShift = shifts.find((s: any) => s.role === "Inspector" && s.status === "Active");
        
        if (dealerShift) dealerName = dealerShift.userName || dealerShift.userId;
        if (inspectorShift) inspectorName = inspectorShift.userName || inspectorShift.userId;
      } catch (error) {
        console.error("Error fetching table shifts:", error);
      }
    }
    
    const newFloat: Float = {
      ...floatData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      // Fills and Credits should be "Pending" until Cage completes the workflow
      status: floatData.type === "Open" ? "Active" : (floatData.type === "Fill" || floatData.type === "Credit") ? "Pending" : "Completed",
      dealerName, // Update with shift data
      pitBoss: currentUser?.username || "", // Add Pit Boss from current user
      inspectorName, // Add Inspector from shift data
    };
    const updated = [...floats, newFloat];
    await saveToStorage(updated);
    
    // If this is a Fill or Credit, create a pending Cage operation
    if (floatData.type === "Fill" || floatData.type === "Credit") {
      try {
        const cageOperation = {
          type: floatData.type as "Fill" | "Credit",
          tableName: floatData.tableName,
          amount: floatData.amount,
          currency: floatData.currency || "FCFA",
          chips: floatData.chips,
          cashierName: floatData.dealerName,
          notes: floatData.notes || `${floatData.type} for ${floatData.tableName}`,
          status: "Submitted" as const,
          submittedBy: currentUser?.username || floatData.dealerName,
          referenceId: newFloat.id, // Link back to the float transaction
        };
        await api.createCageOperation(cageOperation);
      } catch (error) {
        console.error("Error creating cage operation:", error);
        // Don't fail the float transaction if cage operation fails
      }
    }
    
    // Reload floats to ensure UI is in sync
    await loadFloats();
    setShowForm(false);
    
    // Auto-print thermal receipt for ALL float transactions (prints 1 copy, asks to print again)
    setShowFloatReceipt(newFloat);
  };

  const handleCloseFloat = (closeData: { closingChips: ChipDenomination; closingAmount: number; cashAmount: number; dropAmount: number; notes: string }) => {
    if (!closingFloat) return;

    console.log("=== CLOSE FLOAT DEBUG ===");
    console.log("closeData received:", closeData);
    console.log("closingFloat:", closingFloat);

    // Calculate table stats for win/loss
    const tableFloats = floats.filter((f) => f.tableName === closingFloat.tableName && f.status === "Active");
    const fills = tableFloats.filter((f) => f.type === "Fill").reduce((sum, f) => sum + f.amount, 0);
    const credits = tableFloats.filter((f) => f.type === "Credit").reduce((sum, f) => sum + f.amount, 0);
    
    // Use the drop amount from the close form
    const totalDropAmount = closeData.dropAmount;
    
    console.log("Drop Amount from form:", totalDropAmount);
    console.log("Cash Amount from form:", closeData.cashAmount);
    console.log("Closing Chips Amount from form:", closeData.closingAmount);
    
    // Calculate win/loss: Total Cash Drop + Table Opener + Fills - Closer - Credits
    const closerAmount = closeData.closingAmount + closeData.cashAmount;
    const winLoss = totalDropAmount + closingFloat.amount + fills - closerAmount - credits;

    const closeEntry: Float = {
      id: Date.now().toString(),
      tableName: closingFloat.tableName,
      dealerName: closingFloat.dealerName,
      amount: closeData.closingAmount,
      cashAmount: closeData.cashAmount,
      winLoss: winLoss,
      currency: closingFloat.currency,
      timestamp: new Date().toISOString(),
      status: "Completed",
      type: "Close",
      chips: closeData.closingChips,
      notes: closeData.notes,
      dropAmount: totalDropAmount,
    };

    console.log("Close Entry to be saved:", closeEntry);
    console.log("Close Entry dropAmount:", closeEntry.dropAmount);
    console.log("Close Entry cashAmount:", closeEntry.cashAmount);
    console.log("========================");

    // Mark the open float and all related active transactions as Completed
    const updated = floats.map((f) =>
      f.tableName === closingFloat.tableName && f.status === "Active"
        ? { ...f, status: "Completed" }
        : f
    );
    updated.push(closeEntry);
    saveToStorage(updated);
    setClosingFloat(null);
  };

  const handleCorrectOpeningFloat = (correctedData: { chips: ChipDenomination; amount: number; reason: string }) => {
    if (!correctingFloat) return;

    // Create correction report
    const correctionReport: CorrectionReport = {
      id: Date.now().toString(),
      floatId: correctingFloat.id,
      tableName: correctingFloat.tableName,
      originalAmount: correctingFloat.amount,
      correctedAmount: correctedData.amount,
      originalChips: correctingFloat.chips,
      correctedChips: correctedData.chips,
      reason: correctedData.reason,
      correctedBy: currentUser?.username || "Unknown",
      timestamp: new Date().toISOString(),
    };

    // Save correction report
    const updatedReports = [...correctionReports, correctionReport];
    setCorrectionReports(updatedReports);
    localStorage.setItem("casino_correction_reports", JSON.stringify(updatedReports));

    // Update the float with corrected values
    const updated = floats.map((f) =>
      f.id === correctingFloat.id
        ? { ...f, chips: correctedData.chips, amount: correctedData.amount }
        : f
    );
    saveToStorage(updated);
    setCorrectingFloat(null);
  };

  // Filter logic
  const filteredFloats = floats.filter((float) => {
    const matchesStatus = filterStatus === "All" || float.status === filterStatus;
    const matchesTable = filterTable === "" || float.tableName.toLowerCase().includes(filterTable.toLowerCase());
    const matchesDealer = filterDealer === "" || float.dealerName.toLowerCase().includes(filterDealer.toLowerCase());
    const matchesType = filterType === "" || float.type === filterType;
    
    let matchesDate = true;
    if (filterDateFrom || filterDateTo) {
      const floatDate = new Date(float.timestamp);
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && floatDate >= fromDate;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && floatDate <= toDate;
      }
    }
    
    return matchesStatus && matchesTable && matchesDealer && matchesType && matchesDate;
  });

  // Group floats by table
  const floatsByTable = filteredFloats.reduce((acc, float) => {
    if (!acc[float.tableName]) {
      acc[float.tableName] = [];
    }
    acc[float.tableName].push(float);
    return acc;
  }, {} as { [key: string]: Float[] });

  // Get all opened tables (Open type with Active status)
  const openedTables = floats.filter(f => f.type === "Open" && f.status === "Active");

  // Calculate total fills per table
  const fillsByTable = floats
    .filter((f) => f.type === "Fill" && f.status === "Active")
    .reduce((acc, float) => {
      if (!acc[float.tableName]) {
        acc[float.tableName] = 0;
      }
      acc[float.tableName] += float.amount;
      return acc;
    }, {} as { [key: string]: number });

  // Calculate total credits per table
  const creditsByTable = floats
    .filter((f) => f.type === "Credit" && f.status === "Active")
    .reduce((acc, float) => {
      if (!acc[float.tableName]) {
        acc[float.tableName] = 0;
      }
      acc[float.tableName] += float.amount;
      return acc;
    }, {} as { [key: string]: number });

  const formatCurrency = (amount: number = 0, currency: string = "FCFA") => {
    const safeAmount = amount ?? 0;
    return `${currency} ${safeAmount.toLocaleString()}`;
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
      .map(([denom, count]) => `${count}×${denom}`)
      .join(", ") || 'No chips';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Open":
        return "bg-blue-100 text-blue-800";
      case "Close":
        return "bg-purple-100 text-purple-800";
      case "Fill":
        return "bg-green-100 text-green-800";
      case "Credit":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Open":
        return <CheckCircle className="w-4 h-4" />;
      case "Close":
        return <XCircle className="w-4 h-4" />;
      case "Fill":
        return <TrendingUp className="w-4 h-4" />;
      case "Credit":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  // Calculate table statistics (Only "Active" transactions count)
  const getTableStats = (tableName: string) => {
    const tableFloats = floats.filter((f) => f.tableName === tableName && f.status === "Active");
    const openFloat = tableFloats.find((f) => f.type === "Open");
    const fills = tableFloats.filter((f) => f.type === "Fill").reduce((sum, f) => sum + f.amount, 0);
    const credits = tableFloats.filter((f) => f.type === "Credit").reduce((sum, f) => sum + f.amount, 0);

    return {
      openAmount: openFloat?.amount || 0,
      fills,
      credits,
      currentFloat: (openFloat?.amount || 0) + fills - credits,
    };
  };

  // Calculate totals
  const totalOpen = floats
    .filter((f) => f.type === "Open" && f.status === "Active")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalFills = floats
    .filter((f) => f.type === "Fill" && f.status === "Active")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalCredits = floats
    .filter((f) => f.type === "Credit" && f.status === "Active")
    .reduce((sum, f) => sum + f.amount, 0);
  const totalCurrent = totalOpen + totalFills - totalCredits;

  const hasFilters = filterTable || filterDealer || filterType || filterDateFrom || filterDateTo || filterStatus !== "All";

  const clearFilters = () => {
    setFilterTable("");
    setFilterDealer("");
    setFilterType("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterStatus("All");
  };

  // Helper to calculate float amount per table
  const calculateFloatAmountForTable = (tableName: string) => {
    const tableFloats = floats.filter(f => f.tableName === tableName && f.status === "Active");
    const openFloat = tableFloats.find(f => f.type === "Open");
    const fills = tableFloats.filter(f => f.type === "Fill").reduce((sum, f) => sum + f.amount, 0);
    const credits = tableFloats.filter(f => f.type === "Credit").reduce((sum, f) => sum + f.amount, 0);
    return (openFloat?.amount || 0) + fills - credits;
  };

  const handleSendEndOfDayReport = async () => {
    try {
      const success = await sendEndOfDayReportToManagement(floats);
      if (success) {
        alert("End-of-day report sent successfully to management!");
      } else {
        alert("Failed to send report. Please check your email configuration.");
      }
    } catch (error) {
      console.error("Error sending end-of-day report:", error);
      alert("Failed to send report. Please try again.");
    }
  };

  // Define all tables on the casino floor
  const ALL_CASINO_TABLES = [
    "Niu Niu 1",
    "Niu Niu 2",
    "Niu Niu 3",
    "Uth 01",
    "Uth 02",
    "Uth 03",
    "Ar 01",
    "Ar 02",
    "Ar 03",
    "Pk 01",
    "Pk 02",
    "BJ 01",
    "BJ 02",
    "Bac 1",
    "Bac 2",
    "Bac 3",
    "Bac 01",
    "Texas 1",
    "Texas 2",
  ];

  // Get table status and player count
  const getTableInfo = (tableName: string) => {
    const isOpen = openedTables.some(t => t.tableName === tableName);
    const activePlayers = ratings.filter(r => r.tableName === tableName && r.status === "Active");
    const playerCount = activePlayers.length;
    const stats = isOpen ? getTableStats(tableName) : null;
    
    // For closed tables, get the most recent Close transaction
    let lastClose = null;
    if (!isOpen) {
      const closedFloats = floats
        .filter(f => f.tableName === tableName && f.type === "Close" && f.status === "Completed")
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      if (closedFloats.length > 0) {
        lastClose = closedFloats[0];
      }
    }
    
    return { isOpen, playerCount, activePlayers, stats, lastClose };
  };

  // Separate tables into opened and closed
  const openedTableNames = ALL_CASINO_TABLES.filter(tableName => 
    openedTables.some(t => t.tableName === tableName)
  );
  
  const closedTableNames = ALL_CASINO_TABLES.filter(tableName => 
    !openedTables.some(t => t.tableName === tableName)
  );

  return (
    <div className="space-y-6">
      {/* View Only Banner - Only visible on mobile */}
      {isViewOnly && <ViewOnlyBanner />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Opening Float</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalOpen)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Fills</p>
              <p className="text-2xl font-bold text-green-600">+{formatCurrency(totalFills)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Credits</p>
              <p className="text-2xl font-bold text-amber-600">-{formatCurrency(totalCredits)}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Current Float</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalCurrent)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Float Transactions</h2>
              <p className="text-sm text-slate-600">Manage table floats and track transactions</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTipsForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Record Tips
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="border-t border-slate-200 pt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium mb-4"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            <Filter className="w-5 h-5" />
            Filters {hasFilters && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">Active</span>}
          </button>

          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Table</label>
                <input
                  type="text"
                  value={filterTable}
                  onChange={(e) => setFilterTable(e.target.value)}
                  placeholder="Filter by table..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Dealer</label>
                <input
                  type="text"
                  value={filterDealer}
                  onChange={(e) => setFilterDealer(e.target.value)}
                  placeholder="Filter by dealer..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="Open">Open</option>
                  <option value="Close">Close</option>
                  <option value="Fill">Fill</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {hasFilters && (
                <div className="md:col-span-3 lg:col-span-6">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active/Pending Transactions - Collapsible Section */}
      {filteredFloats.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => setShowActiveTransactions(!showActiveTransactions)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Active & Pending Transactions</h3>
                <p className="text-sm text-slate-600">
                  {filteredFloats.length} transaction{filteredFloats.length !== 1 ? 's' : ''} • Click to {showActiveTransactions ? 'collapse' : 'expand'}
                </p>
              </div>
            </div>
            {showActiveTransactions ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
          </button>
          
          {showActiveTransactions && (
            <div className="border-t border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Table</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dealer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cash</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Chips</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredFloats.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                          <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                          <p>No float transactions found</p>
                          {hasFilters && <p className="text-sm mt-1">Try adjusting your filters</p>}
                        </td>
                      </tr>
                    ) : (
                      filteredFloats.map((float) => (
                        <tr key={float.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(float.type)}`}>
                              {getTypeIcon(float.type)}
                              {float.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{float.tableName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{float.dealerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                            {formatCurrency(float.amount, float.currency)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {float.type === "Close" && float.cashAmount !== undefined ? (
                              <span className="font-medium text-blue-700">
                                {formatCurrency(float.cashAmount, float.currency)}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="max-w-xs truncate" title={getChipSummary(float.chips)}>
                        {getChipSummary(float.chips)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {formatTimestamp(float.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(float.status)}`}>
                        {float.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {float.type === "Open" && float.status === "Active" && (
                          <>
                            <button
                              onClick={() => setClosingFloat(float)}
                              className="text-purple-600 hover:text-purple-800"
                              title="Close Float"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setCorrectingFloat(float)}
                              className="text-amber-600 hover:text-amber-800"
                              title="Correct Opening Float"
                            >
                              <FileText className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setPrintingFloat(float)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Print"
                        >
                          <Printer className="w-5 h-5" />
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
      )}
    </div>
      )}

      {/* Casino Floor Overview - ALL TABLES */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Casino Floor Overview
        </h3>
        
        {/* Active Tables Section */}
        {openedTableNames.length > 0 && (
          <div className="mb-8">
            <h4 className="text-md font-semibold text-green-700 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Active Tables ({openedTableNames.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {openedTableNames.map((tableName) => {
                const { playerCount, activePlayers, stats } = getTableInfo(tableName);
                
                return (
                  <div 
                    key={tableName} 
                    className="rounded-lg p-4 border-2 border-green-500 bg-green-50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">{tableName}</h4>
                      <div className="flex items-center gap-1">
                        {activePlayers.map((rating, i) => {
                          // Find the player by playerId to get their profile picture
                          const player = players.find(p => p.id === rating.playerId);
                          return (
                            <div
                              key={i}
                              className="w-8 h-8 rounded border-2 border-green-500 bg-white overflow-hidden flex-shrink-0"
                              title={rating.playerName || `Player ${i + 1}`}
                            >
                              {player?.profilePicture ? (
                                <img 
                                  src={player.profilePicture} 
                                  alt={rating.playerName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-slate-100" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {stats && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Opening:</span>
                          <span className="font-medium">{formatCurrency(stats.openAmount)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Fills:</span>
                          <span className="font-medium">+{formatCurrency(stats.fills)}</span>
                        </div>
                        <div className="flex justify-between text-amber-600">
                          <span>Credits:</span>
                          <span className="font-medium">-{formatCurrency(stats.credits)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200">
                          <span className="font-semibold text-slate-900">Current:</span>
                          <span className="font-bold text-purple-600">{formatCurrency(stats.currentFloat)}</span>
                        </div>
                        {playerCount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Active Players:</span>
                            <span className="font-semibold text-green-600">{playerCount}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Closed Tables Section */}
        {closedTableNames.length > 0 && (
          <div>
            <button
              onClick={() => setShowClosedTables(!showClosedTables)}
              className="w-full flex items-center justify-between mb-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <h4 className="text-md font-semibold text-red-600 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Closed Tables ({closedTableNames.length})
              </h4>
              {showClosedTables ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
            
            {showClosedTables && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {closedTableNames.map((tableName) => {
                  const { lastClose } = getTableInfo(tableName);
                  
                  return (
                    <div 
                      key={tableName} 
                      className="rounded-lg p-4 border-2 border-red-300 bg-slate-50 transition-all"
                    >
                      <div className="mb-3">
                        <h4 className="font-semibold text-slate-900">{tableName}</h4>
                      </div>
                      
                      <div className="text-center py-2">
                        <p className="text-sm text-slate-500 font-medium mb-3">Table Closed</p>
                        
                        {lastClose ? (
                          <div className="space-y-2 text-sm text-left">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Drop:</span>
                              <span className="font-semibold text-blue-600">
                                {formatCurrency(lastClose.dropAmount || 0, lastClose.currency)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Win/Loss:</span>
                              <span className={`font-semibold ${
                                (lastClose.winLoss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {(lastClose.winLoss || 0) >= 0 ? '+' : ''}{formatCurrency(lastClose.winLoss || 0, lastClose.currency)}
                              </span>
                            </div>
                            <div className="pt-2 border-t border-slate-200">
                              <p className="text-xs text-slate-500">Closed: {formatTimestamp(lastClose.timestamp)}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No recent activity</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* No Tables Message */}
        {openedTableNames.length === 0 && closedTableNames.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <p>No table data available</p>
          </div>
        )}
      </div>

      {/* Completed Transactions - Expandable Section */}
      {floats.filter(f => f.status === "Completed").length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => setShowCompletedTransactions(!showCompletedTransactions)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Completed Transactions</h3>
                <p className="text-sm text-slate-600">
                  {floats.filter(f => f.status === "Completed").length} completed transaction{floats.filter(f => f.status === "Completed").length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {showCompletedTransactions ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
          </button>
          
          {showCompletedTransactions && (
            <div className="border-t border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Table</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dealer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cash</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Chips</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {floats.filter(f => f.status === "Completed").map((float) => (
                      <tr key={float.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(float.type)}`}>
                            {getTypeIcon(float.type)}
                            {float.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{float.tableName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{float.dealerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          {formatCurrency(float.amount, float.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {float.type === "Close" && float.cashAmount !== undefined ? (
                            <span className="font-medium text-blue-700">
                              {formatCurrency(float.cashAmount, float.currency)}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="max-w-xs truncate" title={getChipSummary(float.chips)}>
                            {getChipSummary(float.chips)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {formatTimestamp(float.timestamp)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setPrintingFloat(float)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Print"
                          >
                            <Printer className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Correction Reports */}
      {correctionReports.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Correction Reports
          </h3>
          <div className="space-y-2">
            {correctionReports.map((report) => (
              <div
                key={report.id}
                className="border border-amber-200 bg-amber-50 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {report.tableName} - Corrected by {report.correctedBy}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {formatCurrency(report.originalAmount)} → {formatCurrency(report.correctedAmount)} on{" "}
                    {formatTimestamp(report.timestamp)}
                  </p>
                </div>
                <button
                  onClick={() => setViewingReport(report)}
                  className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showForm && <FloatForm onSubmit={handleAddFloat} onCancel={() => setShowForm(false)} openTables={openedTables} allFloats={floats} onTriggerCloseFloat={(tableName) => {
        // Find the active Open float for this table
        const openFloat = floats.find(f => f.tableName === tableName && f.type === "Open" && f.status === "Active");
        if (openFloat) {
          setClosingFloat(openFloat);
          setShowForm(false);
        }
      }} currentUser={currentUser} />}
      {closingFloat && (() => {
        // Calculate table stats for the closing float
        const tableFloats = floats.filter((f) => f.tableName === closingFloat.tableName && f.status === "Active");
        const fills = tableFloats.filter((f) => f.type === "Fill").reduce((sum, f) => sum + f.amount, 0);
        const credits = tableFloats.filter((f) => f.type === "Credit").reduce((sum, f) => sum + f.amount, 0);
        const totalDropAmount = drops
          .filter((d) => d.tableName === closingFloat.tableName)
          .reduce((sum, d) => sum + d.amount, 0);
        
        return (
          <CloseFloatForm 
            float={closingFloat} 
            onSubmit={handleCloseFloat} 
            onCancel={() => setClosingFloat(null)} 
            totalDropAmount={totalDropAmount}
            totalFills={fills}
            totalCredits={credits}
          />
        );
      })()}
      {correctingFloat && (
        <CorrectOpeningFloat
          float={correctingFloat}
          onSubmit={handleCorrectOpeningFloat}
          onClose={() => setCorrectingFloat(null)}
        />
      )}
      {printingFloat && <FloatPrintout float={printingFloat} onClose={() => setPrintingFloat(null)} />}
      {viewingReport && <CorrectionReportView report={viewingReport} onClose={() => setViewingReport(null)} />}
      {showRollShiftForm && (
        <RollShiftForm
          availableTables={floats}
          onSubmit={(newFloats) => {
            saveToStorage(newFloats);
            setShowRollShiftForm(false);
          }}
          onCancel={() => setShowRollShiftForm(false)}
        />
      )}
      {showDailyReport && (
        <DailyTablesReport
          floats={floats}
          drops={drops}
          onClose={() => setShowDailyReport(false)}
        />
      )}
      {showTipsForm && (
        <TipsForm
          onSubmit={(tipsData) => {
            // Save tips data and open print modal
            setPrintingTips(tipsData);
            setShowTipsForm(false);
          }}
          onCancel={() => setShowTipsForm(false)}
          currentUser={currentUser}
        />
      )}
      {printingTips && <TipsPrintout tips={printingTips} onClose={() => setPrintingTips(null)} />}
      
      {/* Thermal Receipts for Float Transactions - Prints 1 copy with option to print again */}
      {showFloatReceipt && (
        <ThermalReceiptDual
          type="float"
          data={showFloatReceipt}
          propertyName={PROPERTY_NAME}
          onPrintComplete={() => {
            // Remove this receipt from the queue after printing
            setShowFloatReceipt(null);
          }}
        />
      )}
    </div>
  );
}
