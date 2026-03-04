import { useState, useEffect } from "react";
import { DollarSign, Calendar, User, AlertCircle } from "lucide-react";

interface ChipDenomination {
  [key: string]: number;
}

interface CompletedRating {
  id: string;
  playerId: string;
  playerName: string;
  tableName: string;
  buyInType: "Cash" | "Chips";
  buyInAmount: number;
  cashAmount?: number;
  averageBet: number;
  numberOfPlayers?: number;
  cashOutAmount: number;
  winLoss: number;
  currency: string;
  buyInChips: ChipDenomination;
  cashOutChips: ChipDenomination;
  startTime: string;
  endTime: string;
  totalTime: string;
  playingTime: string;
  status: "Completed";
  rebateRedeemed?: boolean;
  rebateRedeemedAmount?: number;
  rebateRedeemedBy?: string;
  rebateRedeemedAt?: string;
  rebateApprovedBy?: string;
  rebateApprovedAt?: string;
}

interface RebateData {
  ratingId: string;
  playerId: string;
  playerName: string;
  date: string;
  rebateAmount: number;
  currency: string;
  rebatePercentage: number;
  totalDailyLoss: number;
  isRedeemed: boolean;
  redeemedBy?: string;
  redeemedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  daysRemaining: number;
}

export function RebateSummaryReport() {
  const [ratings, setRatings] = useState<CompletedRating[]>([]);
  const [rebates, setRebates] = useState<RebateData[]>([]);
  const [filterStatus, setFilterStatus] = useState<"All" | "Redeemed" | "Pending">("All");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  useEffect(() => {
    loadRatings();
  }, []);

  useEffect(() => {
    calculateRebates();
  }, [ratings]);

  const loadRatings = () => {
    const savedRatings = localStorage.getItem("casino_ratings");
    if (savedRatings) {
      const allRatings = JSON.parse(savedRatings);
      const completedRatings = allRatings.filter(
        (r: any) => r.status === "Completed"
      ) as CompletedRating[];
      setRatings(completedRatings);
    }
  };

  const calculateRebates = () => {
    // Calculate rebates for each individual rating
    const rebatesArray: RebateData[] = [];

    ratings.forEach((rating) => {
      const ratingDate = new Date(rating.startTime);
      const ratingDateStr = ratingDate.toISOString().split("T")[0];
      
      // Calculate individual loss for this rating
      const loss = rating.winLoss < 0 ? Math.abs(rating.winLoss) : 0;

      // Calculate rebate percentage based on individual loss
      let rebatePercentage = 0;
      if (loss >= 10000000) {
        rebatePercentage = 0.15;
      } else if (loss >= 1000000) {
        rebatePercentage = 0.1;
      } else if (loss >= 500000) {
        rebatePercentage = 0.05;
      }

      const calculatedRebateAmount = loss * rebatePercentage;

      // Only add if there's a rebate
      if (calculatedRebateAmount > 0) {
        const isRedeemed = !!rating.rebateRedeemed;
        
        // Use the actual redeemed amount if it exists, otherwise use calculated
        const rebateAmount = rating.rebateRedeemedAmount ?? calculatedRebateAmount;

        // Calculate days remaining (2 weeks = 14 days from the rating date)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiryDate = new Date(ratingDate);
        expiryDate.setDate(expiryDate.getDate() + 14);
        expiryDate.setHours(0, 0, 0, 0);
        const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // Include redeemed rebates regardless of expiry, but only include pending rebates if not expired
        if (isRedeemed || daysRemaining >= 0) {
          rebatesArray.push({
            ratingId: rating.id,
            playerId: rating.playerId,
            playerName: rating.playerName,
            date: ratingDateStr,
            rebateAmount,
            currency: rating.currency,
            rebatePercentage,
            totalDailyLoss: loss, // This is now individual loss, not daily total
            isRedeemed,
            redeemedBy: rating.rebateRedeemedBy,
            redeemedAt: rating.rebateRedeemedAt,
            approvedBy: rating.rebateApprovedBy,
            approvedAt: rating.rebateApprovedAt,
            daysRemaining,
          });
        }
      }
    });

    // Sort by date (newest first)
    rebatesArray.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setRebates(rebatesArray);
  };

  // Filter rebates
  const filteredRebates = rebates.filter((rebate) => {
    // Filter by status
    if (filterStatus === "Redeemed" && !rebate.isRedeemed) return false;
    if (filterStatus === "Pending" && rebate.isRedeemed) return false;

    // Filter by date range
    if (filterDateFrom && rebate.date < filterDateFrom) return false;
    if (filterDateTo && rebate.date > filterDateTo) return false;

    return true;
  });

  // Calculate summary statistics
  const totalRebates = filteredRebates.reduce((sum, r) => sum + r.rebateAmount, 0);
  const redeemedRebates = filteredRebates.filter((r) => r.isRedeemed);
  const pendingRebates = filteredRebates.filter((r) => !r.isRedeemed);
  const totalRedeemed = redeemedRebates.reduce((sum, r) => sum + r.rebateAmount, 0);
  const totalPending = pendingRebates.reduce((sum, r) => sum + r.rebateAmount, 0);

  // Group by redeemed by
  const redeemedByStats = redeemedRebates.reduce((acc, rebate) => {
    const by = rebate.redeemedBy || "Unknown";
    if (!acc[by]) {
      acc[by] = { count: 0, total: 0, currency: rebate.currency };
    }
    acc[by].count++;
    acc[by].total += rebate.rebateAmount;
    return acc;
  }, {} as Record<string, { count: number; total: number; currency: string }>);

  // Format currency symbol
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "FCFA":
        return "CFA ";
      case "PHP":
        return "₱";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "CNY":
      case "JPY":
        return "¥";
      case "KRW":
        return "₩";
      default:
        return "$";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Rebates Summary Report</h2>
            <p className="text-slate-600 text-sm">
              Track rebate redemptions and outstanding rebates (valid for 14 days)
            </p>
          </div>
        </div>

        {/* Alert about expiry */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-900">Rebate Expiry Policy</p>
            <p className="text-sm text-orange-700 mt-1">
              All rebates must be redeemed within 14 days from the session date. Expired rebates are
              automatically removed from the system.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Total Rebates</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {filteredRebates.length > 0
              ? `${getCurrencySymbol(filteredRebates[0].currency)}${totalRebates.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
              : "-"}
          </p>
          <p className="text-sm text-slate-600 mt-1">{filteredRebates.length} rebates</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Redeemed</h3>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {redeemedRebates.length > 0
              ? `${getCurrencySymbol(redeemedRebates[0]?.currency || "USD")}${totalRedeemed.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
              : "-"}
          </p>
          <p className="text-sm text-slate-600 mt-1">{redeemedRebates.length} redeemed</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-600">Pending</h3>
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {pendingRebates.length > 0
              ? `${getCurrencySymbol(pendingRebates[0]?.currency || "USD")}${totalPending.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
              : "-"}
          </p>
          <p className="text-sm text-slate-600 mt-1">{pendingRebates.length} pending</p>
        </div>
      </div>

      {/* Redeemed By Statistics */}
      {Object.keys(redeemedByStats).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Redemptions by Staff
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(redeemedByStats).map(([name, stats]) => (
              <div key={name} className="border border-slate-200 rounded-lg p-4">
                <p className="font-semibold text-slate-900">{name}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  {getCurrencySymbol(stats.currency)}
                  {stats.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-slate-600 mt-1">{stats.count} redemptions</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "All" | "Redeemed" | "Pending")}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Redeemed">Redeemed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus("All");
                setFilterDateFrom("");
                setFilterDateTo("");
              }}
              className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Rebates Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rebate %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rebate Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Redeemed By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Days Left
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredRebates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                    No rebates found
                  </td>
                </tr>
              ) : (
                filteredRebates.map((rebate, index) => (
                  <tr key={rebate.ratingId} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(rebate.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{rebate.playerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-red-600">
                      {getCurrencySymbol(rebate.currency)}
                      {rebate.totalDailyLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                        {(rebate.rebatePercentage * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">
                      {getCurrencySymbol(rebate.currency)}
                      {rebate.rebateAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rebate.isRedeemed ? (
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-1 inline-flex text-xs font-semibold rounded bg-green-100 text-green-800">
                            ✓ Redeemed
                          </span>
                          {rebate.approvedBy && rebate.rebateAmount > 500000 && (
                            <span className="text-xs text-orange-600 font-medium">
                              Mgmt Approved
                            </span>
                          )}
                        </div>
                      ) : (
                        <span
                          className={`px-2 py-1 inline-flex text-xs font-semibold rounded ${
                            rebate.daysRemaining <= 3
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {rebate.isRedeemed ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-slate-900">{rebate.redeemedBy}</span>
                          {rebate.redeemedAt && (
                            <span className="text-xs text-slate-500">
                              {new Date(rebate.redeemedAt).toLocaleString()}
                            </span>
                          )}
                          {rebate.approvedBy && rebate.approvedBy !== rebate.redeemedBy && (
                            <span className="text-xs text-orange-600">
                              Mgmt: {rebate.approvedBy}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {rebate.isRedeemed ? (
                        <span className="text-slate-400">-</span>
                      ) : (
                        <span
                          className={`font-semibold ${
                            rebate.daysRemaining <= 3
                              ? "text-red-600"
                              : rebate.daysRemaining <= 7
                              ? "text-orange-600"
                              : "text-slate-900"
                          }`}
                        >
                          {rebate.daysRemaining} {rebate.daysRemaining === 1 ? "day" : "days"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}