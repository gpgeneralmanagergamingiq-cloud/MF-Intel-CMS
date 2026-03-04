import { useState, useEffect } from "react";
import { X, Gamepad2, Clock, TrendingUp, Upload, User } from "lucide-react";

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
    blacklistPeriod?: string;
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

interface PlayerFormProps {
  player: Player | null;
  onSubmit: (data: Omit<Player, "id" | "joinDate">) => Promise<void>;
  onCancel: () => void;
}

export function PlayerForm({ player, onSubmit, onCancel }: PlayerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    memberId: "",
    email: "",
    phone: "",
    status: "Active",
    notes: "",
    birthday: "",
    profilePicture: "",
    favoriteGame: "",
    blacklist: {
      isBlacklisted: false,
      reason: "",
      blacklistedDate: "",
      blacklistPeriod: "permanent",
      blacklistEndDate: "",
    },
    statistics: {
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
  });

  const [profileImagePreview, setProfileImagePreview] = useState<string>("");

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        memberId: player.memberId,
        email: player.email,
        phone: player.phone,
        status: player.status,
        notes: player.notes,
        birthday: player.birthday,
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
      });
      if (player.profilePicture) {
        setProfileImagePreview(player.profilePicture);
      }
    } else {
      // Auto-generate Member ID for new players
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const autoMemberId = `M-${timestamp.toString().slice(-6)}${randomNum}`;
      setFormData(prev => ({
        ...prev,
        memberId: autoMemberId,
      }));
    }
  }, [player]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate age - must be at least 21 years old
      if (formData.birthday) {
        const today = new Date();
        const birthDate = new Date(formData.birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 21) {
          alert(`Player must be at least 21 years old. Current age: ${age} years.`);
          setIsSubmitting(false);
          return;
        }
      }
      
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
        setFormData({ ...formData, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-2xl font-bold text-slate-900">
            {player ? "Edit Player" : "Add New Player"}
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Member ID * {!player && <span className="text-emerald-600 text-xs">(Auto-generated)</span>}
              </label>
              <input
                type="text"
                required
                value={formData.memberId}
                readOnly
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-mono cursor-not-allowed"
                placeholder="M-12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Birthday * <span className="text-red-600 text-xs">(Must be 21+ years old)</span>
              </label>
              <input
                type="date"
                required
                value={formData.birthday}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) =>
                  setFormData({ ...formData, birthday: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.birthday && (() => {
                const today = new Date();
                const birthDate = new Date(formData.birthday);
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }
                return (
                  <p className={`text-xs mt-1 ${age >= 21 ? 'text-green-600' : 'text-red-600'}`}>
                    {age >= 21 ? '✓' : '✗'} Age: {age} years old
                  </p>
                );
              })()}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about the player..."
            />
          </div>

          {/* Player Statistics Section */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-600" />
              Player Preferences & Statistics
            </h4>

            {/* Favorite Game */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Favorite Game
              </label>
              <input
                type="text"
                value={formData.favoriteGame}
                onChange={(e) =>
                  setFormData({ ...formData, favoriteGame: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Blackjack, Poker, Roulette, Baccarat"
              />
            </div>

            {/* Time Played Statistics */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Time Played
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Yesterday
                  </label>
                  <input
                    type="text"
                    value={formData.statistics.timePlayed.yesterday}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statistics: {
                          ...formData.statistics,
                          timePlayed: {
                            ...formData.statistics.timePlayed,
                            yesterday: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="2h 30m"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Last Week
                  </label>
                  <input
                    type="text"
                    value={formData.statistics.timePlayed.lastWeek}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statistics: {
                          ...formData.statistics,
                          timePlayed: {
                            ...formData.statistics.timePlayed,
                            lastWeek: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="15h 45m"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    This Month
                  </label>
                  <input
                    type="text"
                    value={formData.statistics.timePlayed.thisMonth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statistics: {
                          ...formData.statistics,
                          timePlayed: {
                            ...formData.statistics.timePlayed,
                            thisMonth: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="60h 20m"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Last Year
                  </label>
                  <input
                    type="text"
                    value={formData.statistics.timePlayed.lastYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statistics: {
                          ...formData.statistics,
                          timePlayed: {
                            ...formData.statistics.timePlayed,
                            lastYear: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="720h 00m"
                  />
                </div>
              </div>
            </div>

            {/* Win/Loss Statistics */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Win/Loss
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Yesterday
                  </label>
                  <input
                    type="number"
                    value={formData.statistics.winLoss.yesterday}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statistics: {
                          ...formData.statistics,
                          winLoss: {
                            ...formData.statistics.winLoss,
                            yesterday: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Last Week
                  </label>
                  <input
                    type="number"
                    value={formData.statistics.winLoss.lastWeek}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statistics: {
                          ...formData.statistics,
                          winLoss: {
                            ...formData.statistics.winLoss,
                            lastWeek: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    This Month
                  </label>
                  <input
                    type="number"
                    value={formData.statistics.winLoss.thisMonth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statistics: {
                          ...formData.statistics,
                          winLoss: {
                            ...formData.statistics.winLoss,
                            thisMonth: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Last Year
                  </label>
                  <input
                    type="number"
                    value={formData.statistics.winLoss.lastYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        statistics: {
                          ...formData.statistics,
                          winLoss: {
                            ...formData.statistics.winLoss,
                            lastYear: parseFloat(e.target.value) || 0,
                          },
                        },
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                💡 Positive numbers indicate wins, negative numbers indicate losses
              </p>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Profile Picture
            </h4>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="profilePicture"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm font-medium"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
                <p className="text-xs text-slate-500">
                  JPG, PNG or GIF (max. 5MB)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isSubmitting ? "Saving..." : (player ? "Update Player" : "Add Player")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}