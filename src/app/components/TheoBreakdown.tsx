import { TrendingUp, Clock } from "lucide-react";
import { TheoPeriod } from "../utils/theoCalculations";

interface TheoBreakdownProps {
  theoHistory: TheoPeriod[];
  totalTheo: number;
  currency: string;
}

export function TheoBreakdown({ theoHistory, totalTheo, currency }: TheoBreakdownProps) {
  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
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

  const currencySymbol = getCurrencySymbol(currency);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!theoHistory || theoHistory.length === 0) {
    return null;
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-2">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h4 className="font-semibold text-purple-900">
          Theoretical Win Breakdown ({theoHistory.length} {theoHistory.length === 1 ? "Period" : "Periods"})
        </h4>
      </div>

      <div className="space-y-2 mb-3">
        {theoHistory.map((period, index) => (
          <div
            key={period.id}
            className="bg-white rounded border border-purple-200 p-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">
                  Period {index + 1}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <Clock className="w-3 h-3" />
                  {formatTime(period.playingTimeMs)}
                </div>
              </div>
              <span className="font-bold text-purple-600">
                {currencySymbol}{period.theoreticalWin.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Avg Bet:</span>
                <span className="ml-1 font-medium text-slate-900">
                  {currencySymbol}{period.averageBet.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Players:</span>
                <span className="ml-1 font-medium text-slate-900">{period.numberOfPlayers}</span>
              </div>
              <div>
                <span className="text-slate-500">Hands/Hr:</span>
                <span className="ml-1 font-medium text-slate-900">{period.handsPerHour}</span>
              </div>
              <div>
                <span className="text-slate-500">House Edge:</span>
                <span className="ml-1 font-medium text-slate-900">
                  {(period.houseAdvantage * 100).toFixed(1)}%
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Time Range:</span>
                <span className="ml-1 font-medium text-slate-900 text-xs">
                  {new Date(period.startTime).toLocaleTimeString()} - {period.endTime && new Date(period.endTime).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-purple-300 pt-3 flex items-center justify-between">
        <span className="font-semibold text-purple-900">Total Theoretical Win:</span>
        <span className="text-xl font-bold text-purple-600">
          {currencySymbol}{totalTheo.toLocaleString()}
        </span>
      </div>

      <div className="mt-3 text-xs text-purple-700 bg-purple-100 rounded p-2">
        <strong>Formula:</strong> Theo = Average Bet × (Playing Time × Hands/Hour) × House Edge
      </div>
    </div>
  );
}
