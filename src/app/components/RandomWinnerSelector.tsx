import { useState, useEffect } from "react";
import { X, Shuffle, Trophy, AlertCircle, Sparkles } from "lucide-react";
import { useApi } from "../hooks/useApi";

interface JackpotLevel {
  name: string;
  color: string;
  minAmount: number;
  maxAmount: number;
  contributionPercentage: number;
}

interface Jackpot {
  id: string;
  name: string;
  type: string;
  status: string;
  levels: JackpotLevel[];
  currentAmounts: { [levelName: string]: number };
  conditions: any[];
}

interface ActiveRating {
  id: string;
  playerName: string;
  tableName: string;
  buyInAmount: number;
  timeIn: string;
  averageBet?: number;
}

interface RandomWinnerSelectorProps {
  jackpots: Jackpot[];
  activeRatings: ActiveRating[];
  onSelectWinner: (winner: {
    jackpotId: string;
    jackpotName: string;
    level: string;
    levelColor: string;
    playerName: string;
    amount: number;
    tableName: string;
  }) => void;
  onCancel: () => void;
}

export function RandomWinnerSelector({ 
  jackpots, 
  activeRatings, 
  onSelectWinner, 
  onCancel 
}: RandomWinnerSelectorProps) {
  const [selectedJackpot, setSelectedJackpot] = useState<Jackpot | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<JackpotLevel | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<ActiveRating | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [error, setError] = useState<string>("");

  const activeJackpots = jackpots.filter(j => j.status === "active");

  useEffect(() => {
    if (activeJackpots.length > 0 && !selectedJackpot) {
      setSelectedJackpot(activeJackpots[0]);
      if (activeJackpots[0].levels.length > 0) {
        setSelectedLevel(activeJackpots[0].levels[0]);
      }
    }
  }, [activeJackpots]);

  useEffect(() => {
    if (selectedJackpot && selectedJackpot.levels.length > 0 && !selectedLevel) {
      setSelectedLevel(selectedJackpot.levels[0]);
    }
  }, [selectedJackpot]);

  const handleJackpotChange = (jackpotId: string) => {
    const jackpot = activeJackpots.find(j => j.id === jackpotId);
    if (jackpot) {
      setSelectedJackpot(jackpot);
      setSelectedLevel(jackpot.levels[0] || null);
    }
  };

  const handleLevelChange = (levelName: string) => {
    if (selectedJackpot) {
      const level = selectedJackpot.levels.find(l => l.name === levelName);
      setSelectedLevel(level || null);
    }
  };

  const handleRandomSelect = () => {
    setError("");

    if (!selectedJackpot) {
      setError("Please select a jackpot");
      return;
    }

    if (!selectedLevel) {
      setError("Please select a level");
      return;
    }

    if (activeRatings.length === 0) {
      setError("No active players available");
      return;
    }

    setIsRandomizing(true);

    // Simulate random selection with animation
    let count = 0;
    const interval = setInterval(() => {
      const randomPlayer = activeRatings[Math.floor(Math.random() * activeRatings.length)];
      setSelectedPlayer(randomPlayer);
      count++;

      if (count >= 20) {
        clearInterval(interval);
        setIsRandomizing(false);
        // Keep the last selected player
      }
    }, 100);
  };

  const handleConfirmWinner = () => {
    if (!selectedJackpot || !selectedLevel || !selectedPlayer) {
      setError("Please complete all selections");
      return;
    }

    const amount = selectedJackpot.currentAmounts[selectedLevel.name] || selectedLevel.minAmount;

    onSelectWinner({
      jackpotId: selectedJackpot.id,
      jackpotName: selectedJackpot.name,
      level: selectedLevel.name,
      levelColor: selectedLevel.color,
      playerName: selectedPlayer.playerName,
      amount,
      tableName: selectedPlayer.tableName,
    });
  };

  const formatCurrency = (amount: number) => {
    return `FCFA ${amount.toLocaleString()}`;
  };

  if (activeJackpots.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active Jackpots</h2>
            <p className="text-slate-600 mb-6">
              There are no active jackpots available. Please create and activate a jackpot first.
            </p>
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Shuffle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Random Winner Selection</h2>
                <p className="text-amber-100 text-sm">Select a jackpot and randomly choose a winner</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Step 1: Select Jackpot */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Select Jackpot
            </h3>
            <select
              value={selectedJackpot?.id || ""}
              onChange={(e) => handleJackpotChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base"
            >
              {activeJackpots.map((jackpot) => (
                <option key={jackpot.id} value={jackpot.id}>
                  {jackpot.name} - {jackpot.type}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Level */}
          {selectedJackpot && (
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Select Level
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedJackpot.levels.map((level) => (
                  <button
                    key={level.name}
                    type="button"
                    onClick={() => handleLevelChange(level.name)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedLevel?.name === level.name
                        ? "border-amber-500 bg-amber-50 shadow-lg"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    style={{
                      borderLeftWidth: 4,
                      borderLeftColor: level.color
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: level.color }}
                        >
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-slate-900">{level.name}</p>
                          <p className="text-xs text-slate-600">
                            {formatCurrency(level.minAmount)} - {formatCurrency(level.maxAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-600 mb-1">Current</p>
                        <p className="text-lg font-bold" style={{ color: level.color }}>
                          {formatCurrency(selectedJackpot.currentAmounts[level.name] || level.minAmount)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Random Selection */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              Random Selection
            </h3>

            <div className="space-y-4">
              <div className="flex justify-center">
                <button
                  onClick={handleRandomSelect}
                  disabled={isRandomizing || activeRatings.length === 0}
                  className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    isRandomizing
                      ? "bg-amber-400 text-white cursor-wait"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <Shuffle className={`w-6 h-6 ${isRandomizing ? "animate-spin" : ""}`} />
                  {isRandomizing ? "Selecting..." : "Randomly Select Player"}
                </button>
              </div>

              {selectedPlayer && (
                <div className="bg-white rounded-xl p-6 border-4 border-amber-500 shadow-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-slate-600 mb-2">Selected Winner</p>
                    <p className="text-3xl font-black text-slate-900 mb-2">{selectedPlayer.playerName}</p>
                    <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                      <span>Table: {selectedPlayer.tableName}</span>
                      <span>•</span>
                      <span>Buy-in: {formatCurrency(selectedPlayer.buyInAmount)}</span>
                    </div>

                    {selectedLevel && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">Will Win</p>
                        <p className="text-4xl font-black text-amber-600">
                          {formatCurrency(
                            selectedJackpot?.currentAmounts[selectedLevel.name] || selectedLevel.minAmount
                          )}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          {selectedJackpot?.name} - {selectedLevel.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-slate-600">
                  {activeRatings.length} active player{activeRatings.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmWinner}
              disabled={!selectedPlayer || isRandomizing}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                selectedPlayer && !isRandomizing
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              Confirm Winner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}