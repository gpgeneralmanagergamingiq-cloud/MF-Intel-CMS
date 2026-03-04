import { useState, useEffect } from "react";
import { X, Plus, Trash2, AlertCircle, Zap, TrendingUp, DollarSign, Trophy, Sparkles } from "lucide-react";
import { useApi } from "../hooks/useApi";

interface JackpotLevel {
  name: string;
  color: string;
  minAmount: number; // Starting seed amount after win
  maxAmount: number;
  contributionPercentage: number;
}

interface JackpotCondition {
  type: "actualWinLoss" | "theoreticalWin" | "timePlayed" | "averageBet" | "totalBets";
  operator: "greaterThan" | "lessThan" | "equals" | "between";
  value: number;
  value2?: number;
}

interface Jackpot {
  id: string;
  name: string;
  type: "progressive-theo" | "progressive-fixed" | "fixed" | "random";
  status: "active" | "inactive";
  gameSelection: "all-tables" | "specific-tables";
  selectedTables: string[];
  levels: JackpotLevel[];
  conditions: JackpotCondition[];
  currentAmounts: { [levelName: string]: number };
  seedAmounts: { [levelName: string]: number };
  lastWonDate?: string;
  lastWinner?: string;
  totalWon: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface JackpotFormProps {
  jackpot: Jackpot | null;
  currentUser: { username: string; userType: string };
  onSave: (jackpot: Jackpot) => void;
  onCancel: () => void;
}

const LEVEL_PRESETS = {
  "2-tier": [
    { name: "Minor", color: "#3B82F6", minAmount: 10000, maxAmount: 100000, contributionPercentage: 1 },
    { name: "Major", color: "#F59E0B", minAmount: 100000, maxAmount: 1000000, contributionPercentage: 0.5 }
  ],
  "3-tier": [
    { name: "Bronze", color: "#CD7F32", minAmount: 10000, maxAmount: 50000, contributionPercentage: 1.5 },
    { name: "Silver", color: "#C0C0C0", minAmount: 50000, maxAmount: 200000, contributionPercentage: 1 },
    { name: "Gold", color: "#FFD700", minAmount: 200000, maxAmount: 1000000, contributionPercentage: 0.5 }
  ],
  "4-tier": [
    { name: "Bronze", color: "#CD7F32", minAmount: 10000, maxAmount: 50000, contributionPercentage: 1.5 },
    { name: "Silver", color: "#C0C0C0", minAmount: 50000, maxAmount: 150000, contributionPercentage: 1.2 },
    { name: "Gold", color: "#FFD700", minAmount: 150000, maxAmount: 500000, contributionPercentage: 0.8 },
    { name: "Platinum", color: "#E5E4E2", minAmount: 500000, maxAmount: 2000000, contributionPercentage: 0.5 }
  ],
  "5-tier": [
    { name: "Mini", color: "#3B82F6", minAmount: 5000, maxAmount: 25000, contributionPercentage: 2 },
    { name: "Minor", color: "#10B981", minAmount: 25000, maxAmount: 100000, contributionPercentage: 1.5 },
    { name: "Major", color: "#F59E0B", minAmount: 100000, maxAmount: 500000, contributionPercentage: 1 },
    { name: "Grand", color: "#EF4444", minAmount: 500000, maxAmount: 2000000, contributionPercentage: 0.5 },
    { name: "Mega", color: "#8B5CF6", minAmount: 2000000, maxAmount: 10000000, contributionPercentage: 0.25 }
  ]
};

export function JackpotForm({ jackpot, currentUser, onSave, onCancel }: JackpotFormProps) {
  const api = useApi();
  
  const [formData, setFormData] = useState({
    name: "",
    type: "progressive-theo" as "progressive-theo" | "progressive-fixed" | "fixed" | "random",
    status: "active" as "active" | "inactive",
    gameSelection: "all-tables" as "all-tables" | "specific-tables",
    selectedTables: [] as string[],
  });

  const [levels, setLevels] = useState<JackpotLevel[]>([
    { name: "Bronze", color: "#CD7F32", minAmount: 10000, maxAmount: 100000, contributionPercentage: 1 },
    { name: "Silver", color: "#C0C0C0", minAmount: 100000, maxAmount: 500000, contributionPercentage: 0.5 },
    { name: "Gold", color: "#FFD700", minAmount: 500000, maxAmount: 2000000, contributionPercentage: 0.25 }
  ]);

  const [conditions, setConditions] = useState<JackpotCondition[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [availableTables, setAvailableTables] = useState<string[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);

  // Load available tables from the floor
  useEffect(() => {
    const loadTables = async () => {
      try {
        setLoadingTables(true);
        const tables = await api.getAvailableTables();
        if (tables && tables.length > 0) {
          setAvailableTables(tables);
        } else {
          // Fallback to default table names if no tables are active
          setAvailableTables([
            "Table 1", "Table 2", "Table 3", "Table 4", "Table 5",
            "Table 6", "Table 7", "Table 8", "Table 9", "Table 10"
          ]);
        }
      } catch (error) {
        console.error("Error loading tables:", error);
        // Fallback to default table names on error
        setAvailableTables([
          "Table 1", "Table 2", "Table 3", "Table 4", "Table 5",
          "Table 6", "Table 7", "Table 8", "Table 9", "Table 10"
        ]);
      } finally {
        setLoadingTables(false);
      }
    };
    
    loadTables();
  }, [api.currentProperty]);

  useEffect(() => {
    if (jackpot) {
      setFormData({
        name: jackpot.name,
        type: jackpot.type,
        status: jackpot.status,
        gameSelection: jackpot.gameSelection,
        selectedTables: jackpot.selectedTables,
      });
      setLevels(jackpot.levels);
      setConditions(jackpot.conditions);
    }
  }, [jackpot]);

  const handleLevelPresetChange = (preset: string) => {
    if (preset && LEVEL_PRESETS[preset as keyof typeof LEVEL_PRESETS]) {
      setLevels(LEVEL_PRESETS[preset as keyof typeof LEVEL_PRESETS]);
    }
  };

  const addLevel = () => {
    setLevels([
      ...levels,
      {
        name: `Level ${levels.length + 1}`,
        color: "#3B82F6",
        minAmount: 10000,
        maxAmount: 100000,
        contributionPercentage: 1
      }
    ]);
  };

  const removeLevel = (index: number) => {
    if (levels.length > 1) {
      setLevels(levels.filter((_, i) => i !== index));
    }
  };

  const updateLevel = (index: number, field: keyof JackpotLevel, value: any) => {
    const updated = [...levels];
    updated[index] = { ...updated[index], [field]: value };
    setLevels(updated);
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        type: "theoreticalWin",
        operator: "greaterThan",
        value: 0,
      }
    ]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: keyof JackpotCondition, value: any) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], [field]: value };
    setConditions(updated);
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push("Jackpot name is required");
    }

    if (levels.length === 0) {
      newErrors.push("At least one level is required");
    }

    levels.forEach((level, index) => {
      if (!level.name.trim()) {
        newErrors.push(`Level ${index + 1}: Name is required`);
      }
      if (level.minAmount >= level.maxAmount) {
        newErrors.push(`Level ${level.name}: Min amount must be less than max amount`);
      }
      if (level.contributionPercentage <= 0) {
        newErrors.push(`Level ${level.name}: Contribution percentage must be greater than 0`);
      }
    });

    if (formData.gameSelection === "specific-tables" && formData.selectedTables.length === 0) {
      newErrors.push("Select at least one table or choose 'All Tables'");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const currentAmounts: { [key: string]: number } = {};
    const seedAmounts: { [key: string]: number } = {};

    levels.forEach(level => {
      if (jackpot && jackpot.currentAmounts[level.name] !== undefined) {
        currentAmounts[level.name] = jackpot.currentAmounts[level.name];
      } else {
        currentAmounts[level.name] = level.minAmount;
      }
      seedAmounts[level.name] = level.minAmount;
    });

    const newJackpot: Jackpot = {
      id: jackpot?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      status: formData.status,
      gameSelection: formData.gameSelection,
      selectedTables: formData.selectedTables,
      levels,
      conditions,
      currentAmounts,
      seedAmounts,
      lastWonDate: jackpot?.lastWonDate,
      lastWinner: jackpot?.lastWinner,
      totalWon: jackpot?.totalWon || 0,
      createdBy: jackpot?.createdBy || currentUser.username,
      createdAt: jackpot?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newJackpot);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "progressive-theo":
        return <TrendingUp className="w-5 h-5" />;
      case "progressive-fixed":
        return <DollarSign className="w-5 h-5" />;
      case "fixed":
        return <Trophy className="w-5 h-5" />;
      case "random":
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {jackpot ? "Edit Jackpot" : "Create New Jackpot"}
                </h2>
                <p className="text-amber-100 text-sm">Configure jackpot settings and levels</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900 mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-slate-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jackpot Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g., Mega Jackpot"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jackpot Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "progressive-theo", label: "Progressive (Theo)", desc: "Based on Theoretical Win" },
                  { value: "progressive-fixed", label: "Progressive (Fixed)", desc: "Based on Fixed Bets" },
                  { value: "fixed", label: "Fixed Amount", desc: "Static Prize Pool" },
                  { value: "random", label: "Random", desc: "Random Trigger" }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value as any })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.type === type.value
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(type.value)}
                      <span className="font-semibold text-sm">{type.label}</span>
                    </div>
                    <p className="text-xs text-slate-600">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.status === "active"}
                    onChange={() => setFormData({ ...formData, status: "active" })}
                    className="w-4 h-4 text-amber-600"
                  />
                  <span className="text-sm text-slate-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.status === "inactive"}
                    onChange={() => setFormData({ ...formData, status: "inactive" })}
                    className="w-4 h-4 text-amber-600"
                  />
                  <span className="text-sm text-slate-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Game Selection */}
          <div className="bg-slate-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Game Selection</h3>
            
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.gameSelection === "all-tables"}
                  onChange={() => setFormData({ ...formData, gameSelection: "all-tables", selectedTables: [] })}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="text-sm font-medium text-slate-700">All Tables</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.gameSelection === "specific-tables"}
                  onChange={() => setFormData({ ...formData, gameSelection: "specific-tables" })}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="text-sm font-medium text-slate-700">Specific Tables</span>
              </label>
            </div>

            {formData.gameSelection === "specific-tables" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Tables *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
                  {availableTables.map((table) => (
                    <label key={table} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-100 rounded">
                      <input
                        type="checkbox"
                        checked={formData.selectedTables.includes(table)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              selectedTables: [...formData.selectedTables, table]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedTables: formData.selectedTables.filter(t => t !== table)
                            });
                          }
                        }}
                        className="w-4 h-4 text-amber-600"
                      />
                      <span className="text-sm text-slate-700">{table}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Levels Configuration */}
          <div className="bg-slate-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Jackpot Levels</h3>
                <p className="text-sm text-slate-600">Configure prize tiers and contribution percentages</p>
              </div>
              <div className="flex gap-2">
                <select
                  onChange={(e) => handleLevelPresetChange(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg"
                >
                  <option value="">Load Preset</option>
                  <option value="2-tier">2-Tier System</option>
                  <option value="3-tier">3-Tier System</option>
                  <option value="4-tier">4-Tier System</option>
                  <option value="5-tier">5-Tier System</option>
                </select>
                <button
                  type="button"
                  onClick={addLevel}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Level
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {levels.map((level, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-slate-200"
                  style={{ borderLeftWidth: 4, borderLeftColor: level.color }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: level.color }}
                      >
                        <Trophy className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={level.name}
                        onChange={(e) => updateLevel(index, "name", e.target.value)}
                        className="text-lg font-bold px-2 py-1 border border-transparent hover:border-slate-300 rounded focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        placeholder="Level Name"
                      />
                    </div>
                    {levels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLevel(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        value={level.color}
                        onChange={(e) => updateLevel(index, "color", e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Seed Amount (FCFA) 🌱
                      </label>
                      <input
                        type="number"
                        value={level.minAmount}
                        onChange={(e) => updateLevel(index, "minAmount", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        title="Starting amount after jackpot is won"
                      />
                      <p className="text-[10px] text-slate-500 mt-0.5">Resets to this after win</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Max Amount (FCFA)
                      </label>
                      <input
                        type="number"
                        value={level.maxAmount}
                        onChange={(e) => updateLevel(index, "maxAmount", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                      <p className="text-[10px] text-slate-500 mt-0.5">Maximum cap</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Contribution (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={level.contributionPercentage}
                        onChange={(e) => updateLevel(index, "contributionPercentage", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                      <p className="text-[10px] text-slate-500 mt-0.5">% per theo/bet</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-slate-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Winning Conditions</h3>
                <p className="text-sm text-slate-600">Set criteria for jackpot eligibility (optional)</p>
              </div>
              <button
                type="button"
                onClick={addCondition}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Condition
              </button>
            </div>

            {conditions.length === 0 ? (
              <p className="text-sm text-slate-500 italic text-center py-4">
                No conditions set - All players are eligible
              </p>
            ) : (
              <div className="space-y-3">
                {conditions.map((condition, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Condition Type
                        </label>
                        <select
                          value={condition.type}
                          onChange={(e) => updateCondition(index, "type", e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
                          <option value="theoreticalWin">Theoretical Win</option>
                          <option value="actualWinLoss">Actual Win/Loss</option>
                          <option value="timePlayed">Time Played (minutes)</option>
                          <option value="averageBet">Average Bet</option>
                          <option value="totalBets">Total Bets</option>
                        </select>
                      </div>

                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Operator
                        </label>
                        <select
                          value={condition.operator}
                          onChange={(e) => updateCondition(index, "operator", e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
                          <option value="greaterThan">Greater Than</option>
                          <option value="lessThan">Less Than</option>
                          <option value="equals">Equals</option>
                          <option value="between">Between</option>
                        </select>
                      </div>

                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Value
                        </label>
                        <input
                          type="number"
                          value={condition.value}
                          onChange={(e) => updateCondition(index, "value", parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>

                      {condition.operator === "between" && (
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Value 2
                          </label>
                          <input
                            type="number"
                            value={condition.value2 || ""}
                            onChange={(e) => updateCondition(index, "value2", parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-colors font-medium shadow-lg"
            >
              {jackpot ? "Update Jackpot" : "Create Jackpot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}