import { useState, useEffect } from "react";
import { Users, Search, Plus, Edit, Trash2, Download, Filter, User, Phone, Mail, MapPin, Calendar, QrCode, Printer, X, UserPlus, UserX, AlertTriangle, Camera } from "lucide-react";
import { PlayerForm } from "./PlayerForm";
import { BulkPrintQRCards } from "./BulkPrintQRCards";
import { QRScanner } from "./QRScanner";
import { useOutletContext } from "react-router";
import { logAction } from "../utils/auditLog";
import { toast } from "sonner";
import { PlayerQRCard } from "./PlayerQRCard";
import { useApi } from "../hooks/useApi";

interface Player {
  id: string;
  name: string;
  memberId: string;
  email: string;
  phone: string;
  joinDate: string;
  status: string;
  notes: string;
  birthday: string;
  profilePicture?: string;
  favoriteGame?: string;
  blacklist?: {
    isBlacklisted: boolean;
    reason: string;
    blacklistedDate: string;
    blacklistPeriod?: string; // e.g., "permanent", "30 days", "1 year"
    blacklistEndDate?: string;
  };
  statistics?: {
    timePlayed: {
      yesterday: string;
      lastWeek: string;
      thisMonth: string;
      lastYear: string;
    };
    winLoss: {
      yesterday: number;
      lastWeek: number;
      thisMonth: number;
      lastYear: number;
    };
  };
}

export function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "blacklisted">("all");
  const [showBlacklistModal, setShowBlacklistModal] = useState(false);
  const [blacklistingPlayer, setBlacklistingPlayer] = useState<Player | null>(null);
  const [blacklistForm, setBlacklistForm] = useState({
    reason: "",
    period: "permanent",
    customDays: "",
  });
  // QR Code states
  const [showQRCard, setShowQRCard] = useState(false);
  const [qrPlayer, setQrPlayer] = useState<Player | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showBulkPrint, setShowBulkPrint] = useState(false);
  
  const api = useApi();
  const { currentUser } = useOutletContext<{ currentUser: { username: string; userType: string } | null }>();

  // Hardcoded property - Grand Palace Casino
  const currentProperty = "Grand Palace Casino";

  useEffect(() => {
    loadPlayers();
  }, []); // Remove api.currentProperty dependency since it's constant

  const loadPlayers = async () => {
    setIsLoading(true);
    try {
      const loadedPlayers = await api.getPlayers();
      // Migrate old player data to new format (remove card fields, add new fields)
      const migratedPlayers = loadedPlayers.map((player: any) => ({
        id: player.id,
        name: player.name,
        memberId: player.memberId,
        email: player.email || "",
        phone: player.phone || "",
        joinDate: player.joinDate,
        status: player.status,
        notes: player.notes || "",
        birthday: player.birthday || "",
        profilePicture: player.profilePicture || "",
        favoriteGame: player.favoriteGame || "",
        blacklist: player.blacklist || {
          isBlacklisted: false,
          reason: "",
          blacklistedDate: "",
          blacklistPeriod: "permanent",
          blacklistEndDate: "",
        },
        statistics: player.statistics || {
          timePlayed: {
            yesterday: "",
            lastWeek: "",
            thisMonth: "",
            lastYear: "",
          },
          winLoss: {
            yesterday: 0,
            lastWeek: 0,
            thisMonth: 0,
            lastYear: 0,
          },
        },
      }));
      setPlayers(migratedPlayers);
    } catch (error) {
      console.error("Error loading players:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPlayer = async (playerData: Omit<Player, "id" | "joinDate">) => {
    try {
      // Check for duplicate member ID or email before adding
      const existingPlayerByMemberId = players.find(p => p.memberId === playerData.memberId);
      const existingPlayerByEmail = playerData.email && players.find(p => p.email === playerData.email);
      
      if (existingPlayerByMemberId) {
        alert(`A player with Member ID "${playerData.memberId}" already exists. Please use a different Member ID.`);
        return;
      }
      
      if (existingPlayerByEmail) {
        alert(`A player with email "${playerData.email}" already exists. Please use a different email.`);
        return;
      }
      
      const newPlayer: Player = {
        ...playerData,
        id: Date.now().toString(),
        joinDate: new Date().toISOString(),
      };
      await api.createPlayer(newPlayer);
      await loadPlayers();
      setShowForm(false);
      if (currentUser) {
        logAction(currentUser.username, currentUser.userType, "Create", "Players", `Added player: ${newPlayer.name} (${newPlayer.memberId})`, currentProperty);
      }
      toast.success(`Player ${newPlayer.name} added successfully!`);
    } catch (error) {
      console.error("Error adding player:", error);
      alert("Failed to add player. Please try again.");
      // Do NOT call loadPlayers() here - we don't want to reload if there was an error
    }
  };

  const handleUpdatePlayer = async (playerData: Omit<Player, "id" | "joinDate">) => {
    if (!editingPlayer) return;
    try {
      const updatedPlayer = { ...playerData, id: editingPlayer.id, joinDate: editingPlayer.joinDate };
      await api.updatePlayer(editingPlayer.id, updatedPlayer);
      await loadPlayers();
      setEditingPlayer(null);
      if (currentUser) {
        logAction(currentUser.username, currentUser.userType, "Update", "Players", `Updated player: ${editingPlayer.name} (${editingPlayer.memberId})`, currentProperty);
      }
    } catch (error) {
      console.error("Error updating player:", error);
      alert("Failed to update player. Please try again.");
    }
  };

  const handleDeletePlayer = async (id: string) => {
    if (confirm("Are you sure you want to delete this player?")) {
      try {
        const player = players.find(p => p.id === id);
        await api.deletePlayer(id);
        await loadPlayers();
        if (currentUser && player) {
          logAction(currentUser.username, currentUser.userType, "Delete", "Players", `Deleted player: ${player.name} (${player.memberId})`, currentProperty);
        }
      } catch (error) {
        console.error("Error deleting player:", error);
        alert("Failed to delete player. Please try again.");
      }
    }
  };

  const handleBlacklistPlayer = async (player: Player) => {
    if (!player.blacklist) return;
    try {
      const updatedPlayer = {
        ...player,
        blacklist: {
          isBlacklisted: true,
          reason: blacklistForm.reason,
          blacklistedDate: new Date().toISOString(),
          blacklistPeriod: blacklistForm.period,
          blacklistEndDate: blacklistForm.period === "custom"
            ? new Date(
                new Date().setDate(new Date().getDate() + parseInt(blacklistForm.customDays, 10))
              ).toISOString()
            : undefined,
        },
      };
      await api.updatePlayer(player.id, updatedPlayer);
      await loadPlayers();
      setShowBlacklistModal(false);
      if (currentUser) {
        logAction(currentUser.username, currentUser.userType, "Update", "Players", `Blacklisted player: ${player.name} - Reason: ${blacklistForm.reason}`, currentProperty);
      }
    } catch (error) {
      console.error("Error blacklisting player:", error);
      alert("Failed to blacklist player. Please try again.");
    }
  };

  const handleUnblacklistPlayer = async (id: string) => {
    try {
      const player = players.find((p) => p.id === id);
      if (!player || !player.blacklist) return;
      const updatedPlayer = {
        ...player,
        blacklist: {
          isBlacklisted: false,
          reason: "",
          blacklistedDate: "",
          blacklistPeriod: "permanent",
          blacklistEndDate: "",
        },
      };
      await api.updatePlayer(id, updatedPlayer);
      await loadPlayers();
      if (currentUser) {
        logAction(currentUser.username, currentUser.userType, "Update", "Players", `Removed blacklist for player: ${player.name}`, currentProperty);
      }
    } catch (error) {
      console.error("Error unblacklisting player:", error);
      alert("Failed to unblacklist player. Please try again.");
    }
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabFilteredPlayers =
    activeTab === "all"
      ? filteredPlayers
      : filteredPlayers.filter((player) => player.blacklist?.isBlacklisted);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Players</h2>
          <p className="text-slate-600 mt-1">Manage and track casino players</p>
        </div>
        <button
          onClick={() => {
            setEditingPlayer(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add Player
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, member ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowQRScanner(true)}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            title="Scan QR Code"
          >
            <Camera className="w-5 h-5" />
            Scan
          </button>
          <button
            onClick={() => setShowBulkPrint(true)}
            disabled={players.length === 0}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            title="Print All QR Cards"
          >
            <Printer className="w-5 h-5" />
            Print All
          </button>
        </div>
      </div>

      {/* Player Form Modal */}
      {showForm && (
        <PlayerForm
          player={editingPlayer}
          onSubmit={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
          onCancel={() => {
            setShowForm(false);
            setEditingPlayer(null);
          }}
        />
      )}

      {/* Blacklist Modal */}
      {showBlacklistModal && blacklistingPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Blacklist Player
              </h3>
              <button
                onClick={() => {
                  setShowBlacklistModal(false);
                  setBlacklistingPlayer(null);
                  setBlacklistForm({ reason: "", period: "permanent", customDays: "" });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                You are about to blacklist <span className="font-semibold">{blacklistingPlayer.name}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for Blacklisting *
                </label>
                <textarea
                  required
                  value={blacklistForm.reason}
                  onChange={(e) => setBlacklistForm({ ...blacklistForm, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter the reason for blacklisting this player..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Blacklist Period *
                </label>
                <select
                  value={blacklistForm.period}
                  onChange={(e) => setBlacklistForm({ ...blacklistForm, period: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="permanent">Permanent</option>
                  <option value="30 days">30 Days</option>
                  <option value="1 year">1 Year</option>
                  <option value="custom">Custom Days</option>
                </select>
              </div>

              {blacklistForm.period === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Days *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={blacklistForm.customDays}
                    onChange={(e) => setBlacklistForm({ ...blacklistForm, customDays: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter number of days"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowBlacklistModal(false);
                  setBlacklistingPlayer(null);
                  setBlacklistForm({ reason: "", period: "permanent", customDays: "" });
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!blacklistForm.reason.trim()) {
                    alert("Please provide a reason for blacklisting.");
                    return;
                  }
                  if (blacklistForm.period === "custom" && !blacklistForm.customDays) {
                    alert("Please specify the number of days.");
                    return;
                  }
                  handleBlacklistPlayer(blacklistingPlayer);
                  setBlacklistForm({ reason: "", period: "permanent", customDays: "" });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <UserX className="w-4 h-4" />
                Blacklist Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center border-b border-slate-200">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "all" ? "text-slate-900 border-b-2 border-blue-500" : "text-slate-500"
          }`}
        >
          All Players
        </button>
        <button
          onClick={() => setActiveTab("blacklisted")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "blacklisted" ? "text-slate-900 border-b-2 border-blue-500" : "text-slate-500"
          }`}
        >
          Blacklisted Players
        </button>
      </div>

      {/* Players Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <Plus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Loading players...</p>
          </div>
        ) : tabFilteredPlayers.length === 0 ? (
          <div className="text-center py-12">
            <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              {searchTerm ? "No players found" : "No players registered yet"}
            </p>
            <p className="text-slate-400 mt-1">
              {searchTerm ? "Try a different search term" : "Click 'Add Player' to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Member ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Birthday
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {tabFilteredPlayers.map((player) => {
                  // Calculate age from birthday
                  const calculateAge = (birthday: string) => {
                    if (!birthday) return null;
                    const today = new Date();
                    const birthDate = new Date(birthday);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                      age--;
                    }
                    return age;
                  };

                  const age = calculateAge(player.birthday);

                  return (
                  <tr key={player.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-slate-900">{player.memberId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{player.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {player.birthday ? (
                        <div>
                          <div className="text-sm text-slate-900">
                            {new Date(player.birthday).toLocaleDateString()}
                          </div>
                          {age !== null && (
                            <div className="text-xs text-slate-500">
                              {age} years old
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm italic">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{player.email || <span className="text-slate-400 italic">No email</span>}</div>
                      <div className="text-sm text-slate-500">{player.phone || <span className="text-slate-400 italic">No phone</span>}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(player.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          player.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : player.status === "Suspended"
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {player.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setQrPlayer(player);
                            setShowQRCard(true);
                          }}
                          className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Generate QR Card"
                        >
                          <QrCode className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingPlayer(player);
                            setShowForm(true);
                          }}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Player"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Player"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        {player.blacklist?.isBlacklisted ? (
                          <button
                            onClick={() => handleUnblacklistPlayer(player.id)}
                            className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                            title="Unblacklist Player"
                          >
                            <UserPlus className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setBlacklistingPlayer(player);
                              setShowBlacklistModal(true);
                            }}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Blacklist Player"
                          >
                            <AlertTriangle className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScan={(playerId) => {
            // Find player by ID
            const player = players.find(p => p.id === playerId || p.memberId === playerId);
            if (player) {
              setSearchTerm(player.name);
            } else {
              alert(`Player with ID ${playerId} not found`);
            }
          }}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {/* QR Card Modal */}
      {showQRCard && qrPlayer && (
        <PlayerQRCard
          player={qrPlayer}
          propertyName={currentProperty}
          onClose={() => {
            setShowQRCard(false);
            setQrPlayer(null);
          }}
        />
      )}

      {/* Bulk Print QR Cards Modal */}
      {showBulkPrint && (
        <BulkPrintQRCards
          players={players}
          propertyName={currentProperty}
          onClose={() => setShowBulkPrint(false)}
        />
      )}
    </div>
  );
}