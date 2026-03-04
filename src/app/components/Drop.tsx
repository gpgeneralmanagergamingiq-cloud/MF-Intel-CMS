import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, CheckCircle, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useApi } from "../hooks/useApi";

interface ChipDenomination {
  [key: string]: number;
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

interface Float {
  id: string;
  tableName: string;
  dealerName: string;
  amount: number;
  currency?: string;
  timestamp: string;
  status: string;
  type: string;
  chips: ChipDenomination;
}

export function Drop() {
  const [drops, setDrops] = useState<DropEntry[]>([]);
  const [floats, setFloats] = useState<Float[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterTable, setFilterTable] = useState("");
  const [filterPlayer, setFilterPlayer] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    loadData();
  }, [api.currentProperty]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [loadedDrops, loadedFloats] = await Promise.all([
        api.getDrops(),
        api.getFloats()
      ]);
      setDrops(loadedDrops);
      setFloats(loadedFloats);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalDrop = drops.reduce((sum, drop) => sum + drop.amount, 0);

  // Get all opened tables (Open type with Active status)
  const openedTables = floats.filter(f => f.type === "Open" && f.status === "Active");

  // Group drops by table
  const dropsByTable = drops.reduce((acc, drop) => {
    if (!acc[drop.tableName]) {
      acc[drop.tableName] = 0;
    }
    acc[drop.tableName] += drop.amount;
    return acc;
  }, {} as { [key: string]: number });

  // Filter drops
  const filteredDrops = drops.filter((drop) => {
    const matchesTable = filterTable === "" || drop.tableName.toLowerCase().includes(filterTable.toLowerCase());
    const matchesPlayer = filterPlayer === "" || drop.playerName.toLowerCase().includes(filterPlayer.toLowerCase());
    
    let matchesDate = true;
    if (filterDateFrom || filterDateTo) {
      const dropDate = new Date(drop.timestamp);
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDate = matchesDate && dropDate >= fromDate;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && dropDate <= toDate;
      }
    }
    
    return matchesTable && matchesPlayer && matchesDate;
  });

  const clearAllDrops = () => {
    if (confirm("Are you sure you want to clear all drop data? This cannot be undone.")) {
      localStorage.removeItem("casino_drops");
      setDrops([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Drop Dashboard</h2>
          <p className="text-slate-600 mt-1">Cash buy-ins from player sessions</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Total Drop</p>
              <p className="text-2xl font-bold text-slate-900">CFA {totalDrop.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-600 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-900">{drops.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Opened Tables */}
      {openedTables.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-slate-900">Opened Tables</h3>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
              {openedTables.length} Active
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Table Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Drop Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Opened At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {openedTables.map((table) => (
                  <tr key={table.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{table.tableName}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">
                        {table.currency === "FCFA" ? "CFA " : table.currency === "PHP" ? "₱" : table.currency === "EUR" ? "€" : table.currency === "GBP" ? "£" : table.currency === "CNY" || table.currency === "JPY" ? "¥" : table.currency === "KRW" ? "₩" : "$"}{(dropsByTable[table.tableName] || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                      {table.currency || "FCFA"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-500">
                      <div>{new Date(table.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(table.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drop Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Collapsible Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
            <span className="ml-2 px-2 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full">
              {filteredDrops.length} of {drops.length}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-600" />
          )}
        </div>

        {/* Filters - Only show when expanded */}
        {isExpanded && drops.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-b">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Table Name
                </label>
                <input
                  type="text"
                  value={filterTable}
                  onChange={(e) => setFilterTable(e.target.value)}
                  placeholder="Filter by table..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Player Name
                </label>
                <input
                  type="text"
                  value={filterPlayer}
                  onChange={(e) => setFilterPlayer(e.target.value)}
                  placeholder="Filter by player..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {(filterTable || filterPlayer || filterDateFrom || filterDateTo) && (
              <button
                onClick={() => {
                  setFilterTable("");
                  setFilterPlayer("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Table Content - Only show when expanded */}
        {isExpanded && (
          <>
            {drops.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No cash drops recorded yet</p>
                <p className="text-slate-400 mt-1">
                  Cash buy-ins from player sessions will appear here
                </p>
              </div>
            ) : filteredDrops.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No transactions match your filters</p>
                <p className="text-slate-400 mt-1">
                  Try adjusting your filter criteria
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Player
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Currency
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Chips
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredDrops.map((drop) => (
                      <tr key={drop.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <div>{new Date(drop.timestamp).toLocaleDateString()}</div>
                          <div className="text-xs text-slate-400">
                            {new Date(drop.timestamp).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900">{drop.tableName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {drop.playerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {drop.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {drop.currency}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs space-y-1">
                            {drop.chips && Object.entries(drop.chips).map(([denom, count]) => (
                              count > 0 && (
                                <div key={denom} className="text-slate-600">
                                  {drop.currency === "FCFA" ? "CFA " : "$"}{denom}: {count}
                                </div>
                              )
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-green-600">
                            {drop.currency === "FCFA" ? "CFA " : drop.currency === "PHP" ? "₱" : drop.currency === "EUR" ? "€" : drop.currency === "GBP" ? "£" : drop.currency === "CNY" || drop.currency === "JPY" ? "¥" : drop.currency === "KRW" ? "₩" : "$"}{drop.amount.toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}