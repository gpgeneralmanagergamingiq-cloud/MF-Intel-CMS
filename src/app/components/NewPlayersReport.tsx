import { useState, useEffect, useMemo } from "react";
import { Calendar, Users, TrendingUp, Download, Filter } from "lucide-react";
import { useApi } from "../hooks/useApi";

interface Player {
  id: string;
  accountNumber: string;
  name: string;
  phoneNumber: string;
  email: string;
  idCardType: string;
  idCardNumber: string;
  dateOfBirth: string;
  nationality: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  country: string;
  createdDate: string;
  property?: string;
}

export function NewPlayersReport() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "year" | "custom">("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  
  // Hardcoded property - Grand Palace Casino
  const PROPERTY = "grand_palace";

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setIsLoading(true);
    try {
      // Load players only from Grand Palace Casino
      const propPlayers = await api.getPlayers(PROPERTY);
      setPlayers(propPlayers);
    } catch (error) {
      console.error("Error loading players:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get date range based on selection
  const getDateRange = (): { start: Date; end: Date } => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    switch (dateRange) {
      case "today":
        // Already set to today
        break;
      case "week":
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case "month":
        start = new Date(now);
        start.setDate(now.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        break;
      case "year":
        start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
        start.setHours(0, 0, 0, 0);
        break;
      case "custom":
        if (customStartDate) {
          start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
        }
        if (customEndDate) {
          const customEnd = new Date(customEndDate);
          customEnd.setHours(23, 59, 59, 999);
          return { start, end: customEnd };
        }
        break;
    }

    return { start, end };
  };

  // Filter players by date range only (no property filtering)
  const filteredPlayers = useMemo(() => {
    const range = getDateRange();
    return players.filter((player) => {
      const createdDate = new Date(player.createdDate);
      return createdDate >= range.start && createdDate <= range.end;
    });
  }, [players, dateRange, customStartDate, customEndDate]);

  // Group players by date
  const playersByDate = useMemo(() => {
    const grouped = new Map<string, Player[]>();
    filteredPlayers.forEach((player) => {
      const dateKey = new Date(player.createdDate).toLocaleDateString();
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(player);
    });
    // Sort by date (most recent first)
    return new Map([...grouped.entries()].sort((a, b) => {
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    }));
  }, [filteredPlayers]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalNewPlayers = filteredPlayers.length;
    const range = getDateRange();
    const daysDiff = Math.ceil((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24));
    const avgPerDay = daysDiff > 0 ? (totalNewPlayers / daysDiff).toFixed(1) : "0";

    // Group by nationality
    const byNationality = new Map<string, number>();
    filteredPlayers.forEach((player) => {
      const count = byNationality.get(player.nationality) || 0;
      byNationality.set(player.nationality, count + 1);
    });

    return {
      totalNewPlayers,
      avgPerDay,
      byNationality: Array.from(byNationality.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    };
  }, [filteredPlayers]);

  // Download CSV
  const downloadCSV = () => {
    let csv = "Date,Account Number,Player Name,Phone,Email,Nationality,Property\n";
    filteredPlayers.forEach((player) => {
      csv += `"${new Date(player.createdDate).toLocaleDateString()}","${player.accountNumber}","${player.name}","${player.phoneNumber}","${player.email}","${player.nationality}","${player.property || "N/A"}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `new_players_report_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">New Players Report</h2>
          <p className="text-slate-600 mt-1">Track new player registrations</p>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {dateRange === "custom" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total New Players */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8" />
            <div>
              <p className="text-blue-100 text-sm">Total New Players</p>
              <p className="text-3xl font-bold">{stats.totalNewPlayers}</p>
            </div>
          </div>
        </div>

        {/* Average Per Day */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <div>
              <p className="text-green-100 text-sm">Average Per Day</p>
              <p className="text-3xl font-bold">{stats.avgPerDay}</p>
            </div>
          </div>
        </div>

        {/* Date Range Display */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8" />
            <div>
              <p className="text-purple-100 text-sm">Period</p>
              <p className="font-semibold text-sm">
                {dateRange === "custom" && customStartDate && customEndDate
                  ? `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
                  : dateRange === "today"
                  ? "Today"
                  : dateRange === "week"
                  ? "Last 7 Days"
                  : dateRange === "month"
                  ? "Last 30 Days"
                  : "Last Year"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Nationalities */}
      {stats.byNationality.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-slate-900 mb-4">Top 5 Nationalities</h3>
          <div className="space-y-3">
            {stats.byNationality.map(([nationality, count], index) => (
              <div key={nationality} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900">{nationality}</span>
                    <span className="text-sm text-slate-600">
                      {count} player{count !== 1 ? "s" : ""} ({((count / stats.totalNewPlayers) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(count / stats.totalNewPlayers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Players List by Date */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b">
          <h3 className="font-bold text-slate-900">New Players by Date</h3>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No new players in selected period</p>
            <p className="text-slate-400 mt-1">Try adjusting your date range</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {Array.from(playersByDate.entries()).map(([date, datePlayers]) => (
              <div key={date} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    {date}
                  </h4>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                    {datePlayers.length} player{datePlayers.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase">
                          Account #
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase">
                          Player Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase">
                          Phone
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase">
                          Nationality
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-600 uppercase">
                          Property
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {datePlayers.map((player) => (
                        <tr key={player.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-medium text-blue-600">
                            {player.accountNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">{player.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{player.phoneNumber}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{player.email}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{player.nationality}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {player.property || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}