import { X, FileText, Download, Printer } from "lucide-react";
import { useState } from "react";

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
  cashAmount?: number;
  winLoss?: number;
  dropAmount?: number;
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

interface DailyTablesReportProps {
  floats: Float[];
  drops: DropEntry[];
  onClose: () => void;
}

interface TableData {
  tableName: string;
  openingFloat: number;
  fills: number;
  credits: number;
  drop: number;
  closingFloat: number;
  result: number;
  currency: string;
  closeTimestamp?: string;
}

export function DailyTablesReport({ floats, drops, onClose }: DailyTablesReportProps) {
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split("T")[0]);

  const getCurrencySymbol = (currency?: string) => {
    if (!currency || currency === "FCFA") return "CFA ";
    if (currency === "PHP") return "₱";
    if (currency === "EUR") return "€";
    if (currency === "GBP") return "£";
    if (currency === "CNY" || currency === "JPY") return "¥";
    if (currency === "KRW") return "₩";
    return "$";
  };

  const formatCurrency = (amount: number, currency?: string) => {
    // Ensure amount is a valid number, default to 0 if not
    const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return `${getCurrencySymbol(currency)}${safeAmount.toLocaleString()}`;
  };

  // Filter floats and drops by selected date
  const filterByDate = (timestamp: string) => {
    const itemDate = new Date(timestamp).toISOString().split("T")[0];
    return itemDate === dateFilter;
  };

  const filteredFloats = floats.filter((f) => filterByDate(f.timestamp));
  
  // Get all unique table names that have been closed on the filtered date
  const closedTables = filteredFloats
    .filter((f) => f.type === "Close")
    .map((f) => f.tableName);

  const uniqueTables = [...new Set(closedTables)];

  // Calculate data for each table
  const tableDataList: TableData[] = uniqueTables.map((tableName) => {
    // Get all floats for this table that were closed on the selected date
    const tableCloseFloat = filteredFloats.find((f) => f.tableName === tableName && f.type === "Close");
    
    if (!tableCloseFloat) return null;
    
    // Get the close timestamp to find related transactions
    const closeTimestamp = new Date(tableCloseFloat.timestamp);
    const closeDate = closeTimestamp.toISOString().split("T")[0];
    
    // Get all floats for this table on the close date
    const tableFloats = floats.filter((f) => {
      const fDate = new Date(f.timestamp).toISOString().split("T")[0];
      return f.tableName === tableName && fDate === closeDate;
    });
    
    // Get opening float (should be on the same date as close)
    const openFloat = tableFloats.find((f) => f.type === "Open");
    const openingFloat = typeof openFloat?.amount === 'number' && !isNaN(openFloat.amount) ? openFloat.amount : 0;
    
    // Get fills total (same date as close)
    const fills = tableFloats
      .filter((f) => f.type === "Fill")
      .reduce((sum, f) => {
        const amount = typeof f.amount === 'number' && !isNaN(f.amount) ? f.amount : 0;
        return sum + amount;
      }, 0);
    
    // Get credits total (same date as close)
    const credits = tableFloats
      .filter((f) => f.type === "Credit")
      .reduce((sum, f) => {
        const amount = typeof f.amount === 'number' && !isNaN(f.amount) ? f.amount : 0;
        return sum + amount;
      }, 0);
    
    // Get drop amount from the Close float record (recorded on the closing sheet)
    const drop = typeof tableCloseFloat.dropAmount === 'number' && !isNaN(tableCloseFloat.dropAmount) 
      ? tableCloseFloat.dropAmount 
      : 0;
    
    // Get closing float (chips ONLY, not chips + cash)
    const closingFloat = typeof tableCloseFloat.amount === 'number' && !isNaN(tableCloseFloat.amount) 
      ? tableCloseFloat.amount 
      : 0;
    
    console.log(`=== DAILY REPORT TABLE: ${tableName} ===`);
    console.log(`Table ${tableName} - Drop: ${drop}, Closing Float: ${closingFloat}, Amount: ${tableCloseFloat.amount}, Cash: ${tableCloseFloat.cashAmount}`);
    
    // Calculate result: Closing Float + Credits + Drop - Opener - Fills
    const result = closingFloat + credits + drop - openingFloat - fills;
    
    const currency = openFloat?.currency || tableCloseFloat.currency || "FCFA";

    return {
      tableName,
      openingFloat,
      fills,
      credits,
      drop,
      closingFloat,
      result,
      currency,
      closeTimestamp: tableCloseFloat.timestamp,
    };
  }).filter((table): table is TableData => table !== null);

  // Calculate totals
  const totals = tableDataList.reduce(
    (acc, table) => ({
      openingFloat: acc.openingFloat + table.openingFloat,
      fills: acc.fills + table.fills,
      credits: acc.credits + table.credits,
      drop: acc.drop + table.drop,
      closingFloat: acc.closingFloat + table.closingFloat,
      result: acc.result + table.result,
    }),
    {
      openingFloat: 0,
      fills: 0,
      credits: 0,
      drop: 0,
      closingFloat: 0,
      result: 0,
    }
  );

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ["Table Name", "Opening Float", "Fills", "Credits", "Drop", "Closing Float", "Result"];
    const rows = tableDataList.map((table) => [
      table.tableName,
      table.openingFloat,
      table.fills,
      table.credits,
      table.drop,
      table.closingFloat,
      table.result,
    ]);
    
    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      ["", "", "", "", "", "", ""],
      ["TOTALS", totals.openingFloat, totals.fills, totals.credits, totals.drop, totals.closingFloat, totals.result],
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-tables-report-${dateFilter}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Daily Tables Report</h3>
              <p className="text-sm text-slate-600 mt-1">
                Comprehensive daily table performance analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Date Filter */}
        <div className="p-6 border-b bg-slate-50">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">Report Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-sm text-slate-600">
              Showing {tableDataList.length} table{tableDataList.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6">
          {tableDataList.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 text-lg">No closed tables found for this date</p>
              <p className="text-slate-500 text-sm mt-2">
                Select a different date or close some tables to generate a report
              </p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium uppercase mb-1">Opening Float</p>
                  <p className="text-lg font-bold text-blue-900">
                    {formatCurrency(totals.openingFloat, tableDataList[0]?.currency || "FCFA")}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-green-600 font-medium uppercase mb-1">Fills</p>
                  <p className="text-lg font-bold text-green-900">
                    {formatCurrency(totals.fills, tableDataList[0]?.currency || "FCFA")}
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-xs text-amber-600 font-medium uppercase mb-1">Credits</p>
                  <p className="text-lg font-bold text-amber-900">
                    {formatCurrency(totals.credits, tableDataList[0]?.currency || "FCFA")}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-xs text-purple-600 font-medium uppercase mb-1">Drop</p>
                  <p className="text-lg font-bold text-purple-900">
                    {formatCurrency(totals.drop, tableDataList[0]?.currency || "FCFA")}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-xs text-indigo-600 font-medium uppercase mb-1">Closing Float</p>
                  <p className="text-lg font-bold text-indigo-900">
                    {formatCurrency(totals.closingFloat, tableDataList[0]?.currency || "FCFA")}
                  </p>
                </div>
                <div className={`rounded-lg p-4 border-2 ${
                  totals.result >= 0 
                    ? "bg-emerald-50 border-emerald-300" 
                    : "bg-red-50 border-red-300"
                }`}>
                  <p className={`text-xs font-medium uppercase mb-1 ${
                    totals.result >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}>
                    Total Result
                  </p>
                  <p className={`text-lg font-bold ${
                    totals.result >= 0 ? "text-emerald-900" : "text-red-900"
                  }`}>
                    {totals.result >= 0 ? "+" : ""}{formatCurrency(totals.result, tableDataList[0]?.currency || "FCFA")}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-600 font-medium uppercase mb-1">Tables</p>
                  <p className="text-lg font-bold text-slate-900">
                    {tableDataList.length}
                  </p>
                </div>
              </div>

              {/* Formula Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-blue-900 mb-2">Result Calculation Formula:</p>
                <p className="text-sm text-blue-800">
                  Result = Closing Float + Credits + Drop - Opener - Fills
                </p>
              </div>

              {/* Tables Data */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-300">
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Table Name</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">Opening Float</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">Fills</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">Credits</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">Drop</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">Closing Float</th>
                      <th className="px-4 py-3 text-right text-sm font-bold text-slate-700">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableDataList.map((table, index) => (
                      <tr
                        key={table.tableName}
                        className={`border-b border-slate-200 hover:bg-slate-50 ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50"
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {table.tableName}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-slate-700">
                          {formatCurrency(table.openingFloat, table.currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-green-700 font-medium">
                          +{formatCurrency(table.fills, table.currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-amber-700 font-medium">
                          {formatCurrency(table.credits, table.currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-purple-700 font-medium">
                          {formatCurrency(table.drop, table.currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-slate-700">
                          {formatCurrency(table.closingFloat, table.currency)}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-bold ${
                          table.result >= 0 ? "text-emerald-700" : "text-red-700"
                        }`}>
                          {table.result >= 0 ? "+" : ""}{formatCurrency(table.result, table.currency)}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Totals Row */}
                    <tr className="bg-slate-200 border-t-2 border-slate-400 font-bold">
                      <td className="px-4 py-4 text-sm text-slate-900">TOTALS</td>
                      <td className="px-4 py-4 text-sm text-right text-slate-900">
                        {formatCurrency(totals.openingFloat, tableDataList[0]?.currency || "FCFA")}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-green-800">
                        +{formatCurrency(totals.fills, tableDataList[0]?.currency || "FCFA")}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-amber-800">
                        {formatCurrency(totals.credits, tableDataList[0]?.currency || "FCFA")}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-purple-800">
                        {formatCurrency(totals.drop, tableDataList[0]?.currency || "FCFA")}
                      </td>
                      <td className="px-4 py-4 text-sm text-right text-slate-900">
                        {formatCurrency(totals.closingFloat, tableDataList[0]?.currency || "FCFA")}
                      </td>
                      <td className={`px-4 py-4 text-sm text-right text-lg ${
                        totals.result >= 0 ? "text-emerald-800" : "text-red-800"
                      }`}>
                        {totals.result >= 0 ? "+" : ""}{formatCurrency(totals.result, tableDataList[0]?.currency || "FCFA")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Detailed Calculation Example */}
              {tableDataList.length > 0 && (
                <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Example Calculation for {tableDataList[0].tableName}:</p>
                  <div className="text-sm text-slate-700 space-y-1">
                    <p>Closing Float: {formatCurrency(tableDataList[0].closingFloat, tableDataList[0].currency)}</p>
                    <p>+ Credits: {formatCurrency(tableDataList[0].credits, tableDataList[0].currency)}</p>
                    <p>+ Drop: {formatCurrency(tableDataList[0].drop, tableDataList[0].currency)}</p>
                    <p>- Opener: {formatCurrency(tableDataList[0].openingFloat, tableDataList[0].currency)}</p>
                    <p>- Fills: {formatCurrency(tableDataList[0].fills, tableDataList[0].currency)}</p>
                    <div className="border-t border-slate-300 mt-2 pt-2 font-semibold">
                      = Result: {formatCurrency(tableDataList[0].result, tableDataList[0].currency)}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-slate-50">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>Generated on {new Date().toLocaleString()}</p>
            <p>MF-Intel CMS for Gaming IQ</p>
          </div>
        </div>
      </div>
    </div>
  );
}