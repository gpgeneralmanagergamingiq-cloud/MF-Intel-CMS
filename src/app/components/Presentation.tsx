import { useState, useEffect } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Play, 
  CreditCard,
  FileText,
  Coins,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  Clock,
  Target,
  Download
} from "lucide-react";

interface Float {
  id: string;
  tableName: string;
  dealerName: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: string;
  type: "Open" | "Close" | "Fill" | "Credit";
  chips?: any;
  notes?: string;
}

interface Drop {
  id: string;
  tableName: string;
  amount: number;
  currency: string;
  timestamp: string;
  type: string;
  playerName?: string;
}

interface Rating {
  id: string;
  playerName: string;
  tableName: string;
  buyInAmount: number;
  cashOutAmount?: number;
  winLoss?: number;
  status: string;
  startTime: string;
  endTime?: string;
  averageBet: number;
  buyInType: string;
}

export function Presentation() {
  const [floats, setFloats] = useState<Float[]>([]);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedFloats = localStorage.getItem("casino_floats");
    const savedDrops = localStorage.getItem("casino_drops");
    const savedRatings = localStorage.getItem("casino_ratings");

    if (savedFloats) setFloats(JSON.parse(savedFloats));
    if (savedDrops) setDrops(JSON.parse(savedDrops));
    if (savedRatings) setRatings(JSON.parse(savedRatings));
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

  // Calculate statistics
  const openTables = floats.filter(f => f.status === "Active" && f.type === "Open");
  const activeRatings = ratings.filter(r => r.status === "Active");
  const completedRatings = ratings.filter(r => r.status === "Completed");
  
  const totalFloat = floats
    .filter(f => f.status === "Active")
    .reduce((sum, f) => {
      if (f.type === "Open" || f.type === "Fill") {
        return sum + f.amount;
      } else if (f.type === "Credit") {
        return sum - f.amount;
      }
      return sum;
    }, 0);

  const totalDrop = drops.reduce((sum, d) => sum + d.amount, 0);
  
  const totalWinLoss = completedRatings.reduce((sum, r) => sum + (r.winLoss || 0), 0);
  
  const totalBuyIns = ratings.reduce((sum, r) => sum + r.buyInAmount, 0);
  
  const cashBuyIns = ratings.filter(r => r.buyInType === "Cash").length;
  const chipsBuyIns = ratings.filter(r => r.buyInType === "Chips").length;

  // Get table breakdown
  const tableStats = openTables.map(table => {
    const tableName = table.tableName;
    const tableFloats = floats.filter(f => f.tableName === tableName && f.status === "Active");
    const tableDrops = drops.filter(d => d.tableName === tableName);
    const tablePlayers = activeRatings.filter(r => r.tableName === tableName);
    
    const floatBalance = tableFloats.reduce((sum, f) => {
      if (f.type === "Open" || f.type === "Fill") {
        return sum + f.amount;
      } else if (f.type === "Credit") {
        return sum - f.amount;
      }
      return sum;
    }, 0);
    
    const dropTotal = tableDrops.reduce((sum, d) => sum + d.amount, 0);
    
    return {
      tableName,
      players: tablePlayers.length,
      float: floatBalance,
      drop: dropTotal
    };
  });

  // Recent transactions
  const recentFloats = [...floats]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const recentDrops = [...drops]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const recentRatings = [...ratings]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Floating Export PDF Button */}
      <button
        onClick={handleExportPDF}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 print:hidden group"
        title="Export to PDF"
      >
        <Download className="w-6 h-6 group-hover:animate-bounce" />
        <span className="font-bold text-lg">Export PDF</span>
      </button>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cover Page */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-white text-center print:break-after-page">
          <div className="mb-8">
            <div className="inline-block p-6 bg-white/20 backdrop-blur rounded-full mb-6">
              <DollarSign className="w-24 h-24" />
            </div>
          </div>
        </div>
        <h1 className="text-6xl font-bold mb-4">MF-Intel CMS</h1>
        <p className="text-xl text-white/90 mb-2">for Gaming IQ</p>
        <p className="text-2xl text-white/80 mb-8">Complete Floor Operations & Player Tracking</p>
        <div className="grid grid-cols-4 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <Coins className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm text-white/80">Float Management</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <TrendingUp className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm text-white/80">Drop Tracking</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <Users className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm text-white/80">Player Ratings</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <BarChart3 className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm text-white/80">Analytics</p>
          </div>
        </div>
        <div className="mt-12 text-white/70">
          <p className="text-lg">FCFA Currency • Real-Time Operations • Comprehensive Reporting</p>
          <p className="text-sm mt-2">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Executive Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 print:break-after-page">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <FileText className="w-10 h-10 text-blue-600" />
            Executive Summary
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Open Tables</p>
              </div>
              <p className="text-4xl font-bold text-blue-900">{openTables.length}</p>
              <p className="text-xs text-blue-700 mt-1">Active Gaming Tables</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-green-600" />
                <p className="text-sm font-medium text-green-900">Active Players</p>
              </div>
              <p className="text-4xl font-bold text-green-900">{activeRatings.length}</p>
              <p className="text-xs text-green-700 mt-1">Currently Playing</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Coins className="w-6 h-6 text-purple-600" />
                <p className="text-sm font-medium text-purple-900">Total Float</p>
              </div>
              <p className="text-3xl font-bold text-purple-900">
                {(totalFloat / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-purple-700 mt-1">FCFA</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <p className="text-sm font-medium text-orange-900">Total Drop</p>
              </div>
              <p className="text-3xl font-bold text-orange-900">
                {(totalDrop / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-orange-700 mt-1">FCFA</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Total Buy-Ins</p>
              <p className="text-3xl font-bold text-slate-900">
                CFA {(totalBuyIns / 1000000).toFixed(1)}M
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-green-600 font-medium">{cashBuyIns} Cash</span>
                <span className="text-blue-600 font-medium">{chipsBuyIns} Chips</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Completed Sessions</p>
              <p className="text-3xl font-bold text-slate-900">{completedRatings.length}</p>
              <p className="text-xs text-slate-600 mt-2">{ratings.length} Total Sessions</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Win/Loss</p>
              <p className={`text-3xl font-bold ${totalWinLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalWinLoss >= 0 ? '+' : ''}{(totalWinLoss / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-slate-600 mt-2">FCFA</p>
            </div>
          </div>
        </div>

        {/* Table Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl p-8 print:break-after-page">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-purple-600" />
            Table Operations Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tableStats.map((table, index) => (
              <div 
                key={table.tableName} 
                className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 font-mono">{table.tableName}</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                    {table.players} Players
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Float Balance:</span>
                    <span className="text-lg font-bold text-blue-600">
                      CFA {(table.float / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Total Drop:</span>
                    <span className="text-lg font-bold text-green-600">
                      CFA {(table.drop / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Float Management */}
        <div className="bg-white rounded-2xl shadow-xl p-8 print:break-after-page">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Coins className="w-10 h-10 text-blue-600" />
            Float Management System
          </h2>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Features</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2">Open Tables</h4>
                <p className="text-sm text-blue-700">Initialize table floats with chip denominations from 10M to 250 FCFA</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-bold text-green-900 mb-2">Fill Operations</h4>
                <p className="text-sm text-green-700">Add chips to table float when running low</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-bold text-red-900 mb-2">Credit Operations</h4>
                <p className="text-sm text-red-700">Remove chips from table float (player buy-ins)</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2">Close Tables</h4>
                <p className="text-sm text-purple-700">End of shift reconciliation with variance tracking</p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-4">Recent Float Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b-2 border-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Table</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Dealer</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentFloats.map((float) => (
                  <tr key={float.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{float.tableName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        float.type === "Open" ? "bg-blue-100 text-blue-700" :
                        float.type === "Fill" ? "bg-green-100 text-green-700" :
                        float.type === "Credit" ? "bg-red-100 text-red-700" :
                        "bg-purple-100 text-purple-700"
                      }`}>
                        {float.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      CFA {float.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{float.dealerName}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(float.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drop Tracking */}
        <div className="bg-white rounded-2xl shadow-xl p-8 print:break-after-page">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-green-600" />
            Drop Dashboard
          </h2>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Cash Collection System</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                <p className="text-sm text-green-700 mb-2">Total Drop</p>
                <p className="text-4xl font-bold text-green-900">
                  CFA {totalDrop.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <p className="text-sm text-blue-700 mb-2">Total Transactions</p>
                <p className="text-4xl font-bold text-blue-900">{drops.length}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                <p className="text-sm text-purple-700 mb-2">Average Drop</p>
                <p className="text-4xl font-bold text-purple-900">
                  {drops.length > 0 ? `CFA ${(totalDrop / drops.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-4">Recent Drop Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b-2 border-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Table</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Player</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentDrops.map((drop) => (
                  <tr key={drop.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{drop.tableName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{drop.type}</td>
                    <td className="px-4 py-3 font-bold text-green-600">
                      CFA {drop.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{drop.playerName || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(drop.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Player Ratings */}
        <div className="bg-white rounded-2xl shadow-xl p-8 print:break-after-page">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Users className="w-10 h-10 text-purple-600" />
            Player Rating System
          </h2>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Session Management</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
                <div className="flex items-center gap-3 mb-3">
                  <Play className="w-8 h-8 text-emerald-600" />
                  <p className="text-lg font-bold text-emerald-900">Active Sessions</p>
                </div>
                <p className="text-5xl font-bold text-emerald-900 mb-2">{activeRatings.length}</p>
                <p className="text-sm text-emerald-700">Currently in play</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-8 h-8 text-slate-600" />
                  <p className="text-lg font-bold text-slate-900">Completed</p>
                </div>
                <p className="text-5xl font-bold text-slate-900 mb-2">{completedRatings.length}</p>
                <p className="text-sm text-slate-700">Finished sessions</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Key Features</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Real-Time Tracking
                </h4>
                <p className="text-sm text-blue-700">Track player sessions with start/end times, pause management, and playing time calculation</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Buy-In Flexibility
                </h4>
                <p className="text-sm text-green-700">Support for Cash and Chips buy-ins with automatic float adjustments</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Average Bet Tracking
                </h4>
                <p className="text-sm text-purple-700">Calculate theoretical wins based on average bet and playing time</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Win/Loss Analysis
                </h4>
                <p className="text-sm text-orange-700">Automatic calculation of player win/loss at session end</p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-4">Recent Player Sessions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b-2 border-slate-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Player</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Table</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Buy-In</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentRatings.map((rating) => (
                  <tr key={rating.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">{rating.playerName}</td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{rating.tableName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        rating.buyInType === "Cash" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {rating.buyInType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      CFA {rating.buyInAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        rating.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {rating.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(rating.startTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Capabilities */}
        <div className="bg-white rounded-2xl shadow-xl p-8 print:break-after-page">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <CheckCircle className="w-10 h-10 text-green-600" />
            System Capabilities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Float Management</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">12 chip denominations from 10M to 250 FCFA</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Open, Fill, Credit, and Close operations</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Real-time float balance tracking per table</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Variance calculation on table close</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Comprehensive transaction history</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Drop Dashboard</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Automatic cash drop recording from player buy-ins</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Interactive hourly activity charts</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Gaming day range selector</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Multi-property support</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Filterable transaction history</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Player Ratings</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Start/End rating with real-time tracking</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Break management (pause/resume sessions)</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Cash and Chips buy-in support</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Automatic float adjustments</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Win/Loss calculation and tracking</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Analytics & Reporting</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Game statistics calculator with 20 gaming tables</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">House advantage calculations per game type</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Hands-per-hour based on player count</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Player points system (1 per 10K FCFA)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Games */}
        <div className="bg-white rounded-2xl shadow-xl p-8 print:break-after-page">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Activity className="w-10 h-10 text-blue-600" />
            Supported Gaming Tables
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border-2 border-red-200">
              <h3 className="text-xl font-bold text-red-900 mb-2">Baccarat</h3>
              <p className="text-3xl font-bold text-red-600">5 Tables</p>
              <p className="text-xs text-red-700 mt-1">BAC01 - BAC05</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-purple-900 mb-2">Niu Niu</h3>
              <p className="text-3xl font-bold text-purple-600">4 Tables</p>
              <p className="text-xs text-purple-700 mt-1">NIUNIU01 - 04</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-900 mb-2">Texas Hold'em</h3>
              <p className="text-3xl font-bold text-green-600">3 Tables</p>
              <p className="text-xs text-green-700 mt-1">UTH01 - UTH03</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 mb-2">Roulette</h3>
              <p className="text-3xl font-bold text-orange-600">3 Tables</p>
              <p className="text-xs text-orange-700 mt-1">ROUL01 - ROUL03</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Blackjack</h3>
              <p className="text-3xl font-bold text-blue-600">3 Tables</p>
              <p className="text-xs text-blue-700 mt-1">BJ01 - BJ03</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border-2 border-indigo-200">
              <h3 className="text-xl font-bold text-indigo-900 mb-2">Poker</h3>
              <p className="text-3xl font-bold text-indigo-600">2 Tables</p>
              <p className="text-xs text-indigo-700 mt-1">POKER01 - 02</p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border-2 border-slate-300 col-span-2">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Total Capacity</h3>
              <p className="text-4xl font-bold text-slate-700">20 Gaming Tables</p>
              <p className="text-sm text-slate-600 mt-2">Complete casino floor management</p>
            </div>
          </div>
        </div>

        {/* Print Instructions */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl shadow-xl p-8 text-white print:hidden">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            How to Generate PDF
          </h2>
          <div className="space-y-3 text-slate-200">
            <p className="flex items-start gap-3">
              <span className="text-2xl font-bold text-white">1.</span>
              <span>Press <kbd className="px-2 py-1 bg-white/20 rounded font-mono text-sm">Ctrl+P</kbd> (Windows/Linux) or <kbd className="px-2 py-1 bg-white/20 rounded font-mono text-sm">⌘+P</kbd> (Mac)</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl font-bold text-white">2.</span>
              <span>Select "Save as PDF" as the destination</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl font-bold text-white">3.</span>
              <span>Set margins to "Default" or "Minimum"</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl font-bold text-white">4.</span>
              <span>Ensure "Background graphics" is enabled</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl font-bold text-white">5.</span>
              <span>Click "Save" to generate your presentation PDF</span>
            </p>
          </div>
          <div className="mt-6 p-4 bg-white/10 backdrop-blur rounded-lg">
            <p className="text-sm text-yellow-200 font-medium">💡 Tip: Start rating players in the Ratings tab to see comprehensive analytics and presentation data!</p>
          </div>
        </div>
      </div>
    </div>
  );
}