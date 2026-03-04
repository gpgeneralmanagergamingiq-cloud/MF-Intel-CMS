import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Camera, QrCode, Wine, Cigarette, UtensilsCrossed, AlertCircle, Calendar, MapPin, User, AlertTriangle, Clock, CheckCircle, DollarSign, BadgePercent, FileText } from "lucide-react";
import { useOutletContext } from "react-router";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";
import { QRScanner } from "./QRScanner";
import { CompsCashSaleModal } from "./CompsCashSaleModal";
import { CompsStaffPurchaseModal } from "./CompsStaffPurchaseModal";
import { CompsEndOfDayReport } from "./CompsEndOfDayReport";
import { logAction } from "../utils/auditLog";

// Hardcoded property - Grand Palace Casino v2.3.2
const PROPERTY_NAME = "Grand Palace Casino";

interface CompItem {
  id: string;
  property: string;
  playerId: string;
  playerName: string;
  memberId: string;
  type: 'drink' | 'cigarette' | 'food';
  itemName: string;
  quantity: number;
  value: number; // Value in FCFA - calculated as 15% of Theo
  theoAmount?: number; // The Theo amount this comp is based on (if applicable)
  notes?: string;
  location?: string; // Table number or location where comp was given
  givenBy: string; // Username of staff who gave the comp
  timestamp: string;
}

interface Player {
  id: string;
  name: string;
  memberId: string;
  profilePicture?: string;
}

interface CompFormData {
  playerId: string;
  playerName: string;
  memberId: string;
  type: 'drink' | 'cigarette' | 'food';
  itemName: string;
  quantity: number;
  theoAmount: string;
  notes: string;
  location: string;
}

// Predefined comp items library
const COMP_ITEMS = {
  drink: [
    'Beer', 'Wine', 'Whisky', 'Vodka', 'Cocktail', 'Soft Drink', 'Water', 'Juice', 'Coffee', 'Tea'
  ],
  cigarette: [
    'Marlboro', 'Camel', 'Winston', 'Lucky Strike', 'Pall Mall', 'Davidoff', 'Dunhill', 'Other'
  ],
  food: [
    'Appetizer', 'Sandwich', 'Burger', 'Pizza', 'Salad', 'Soup', 'Entree', 'Dessert', 'Snacks'
  ]
};

export function Comps() {
  const context = useOutletContext<{ currentUser: { username: string; userType: string }; isViewOnly: boolean }>();
  const currentUser = context?.currentUser;
  const isViewOnly = context?.isViewOnly || false;
  const api = useApi();

  const [comps, setComps] = useState<CompItem[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'drink' | 'cigarette' | 'food'>('all');
  const [showScanner, setShowScanner] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CompFormData>({
    playerId: '',
    playerName: '',
    memberId: '',
    type: 'drink',
    itemName: '',
    quantity: 1,
    theoAmount: '',
    notes: '',
    location: ''
  });
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [recentPlayerComps, setRecentPlayerComps] = useState<CompItem[]>([]);
  const [duplicateWarnings, setDuplicateWarnings] = useState<{
    item: string;
    minutesAgo: number;
    givenBy: string;
  }[]>([]);
  const [showCashSale, setShowCashSale] = useState(false);
  const [showStaffPurchase, setShowStaffPurchase] = useState(false);
  const [showEndOfDayReport, setShowEndOfDayReport] = useState(false);

  useEffect(() => {
    loadData();
  }, [api.currentProperty]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [compsData, playersData] = await Promise.all([
        api.getComps(),
        api.getPlayers()
      ]);
      setComps(compsData);
      setPlayers(playersData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanSuccess = async (memberId: string) => {
    const player = players.find(p => p.memberId === memberId);
    if (player) {
      setSelectedPlayer(player);
      setFormData(prev => ({
        ...prev,
        playerId: player.id,
        playerName: player.name,
        memberId: player.memberId
      }));
      
      // Load recent comps for this player
      try {
        const playerComps = await api.getCompsByPlayer(player.id);
        // Sort by timestamp, newest first
        const sortedComps = playerComps.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setRecentPlayerComps(sortedComps.slice(0, 10)); // Show last 10 comps
        
        // Check for duplicate items within last 60 minutes
        const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentDuplicates: { item: string; minutesAgo: number; givenBy: string; }[] = [];
        
        sortedComps.forEach(comp => {
          const compTime = new Date(comp.timestamp);
          if (compTime >= sixtyMinutesAgo) {
            const minutesAgo = Math.round((Date.now() - compTime.getTime()) / (60 * 1000));
            recentDuplicates.push({
              item: comp.itemName,
              minutesAgo,
              givenBy: comp.givenBy
            });
          }
        });
        
        setDuplicateWarnings(recentDuplicates);
        
        if (recentDuplicates.length > 0) {
          toast.warning(`Warning: This player received ${recentDuplicates.length} comp(s) in the last hour!`, {
            duration: 5000
          });
        }
      } catch (error) {
        console.error("Error loading player comps:", error);
      }
      
      setShowScanner(false);
      setShowForm(true);
      toast.success(`Player ${player.name} selected`);
    } else {
      toast.error("Player not found");
      setShowScanner(false);
    }
  };

  const handleQuickLog = () => {
    setShowScanner(true);
  };

  const calculateCompValue = (theoAmount: number): number => {
    // Comps are 15% of Theo
    return Math.round(theoAmount * 0.15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.playerId || !formData.itemName || formData.quantity < 1) {
      toast.error("Please fill in all required fields");
      return;
    }

    const theoAmount = parseFloat(formData.theoAmount) || 0;
    const compValue = theoAmount > 0 ? calculateCompValue(theoAmount) : 0;

    const newComp: CompItem = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      property: PROPERTY_NAME,
      playerId: formData.playerId,
      playerName: formData.playerName,
      memberId: formData.memberId,
      type: formData.type,
      itemName: formData.itemName,
      quantity: formData.quantity,
      value: compValue,
      theoAmount: theoAmount > 0 ? theoAmount : undefined,
      notes: formData.notes || undefined,
      location: formData.location || undefined,
      givenBy: currentUser?.username || 'Unknown',
      timestamp: new Date().toISOString()
    };

    try {
      await api.createComp(newComp);
      
      // Log the action
      await logAction(
        PROPERTY_NAME,
        currentUser?.username || 'Unknown',
        'comp_given',
        `Comp given to ${formData.playerName}: ${formData.quantity}x ${formData.itemName}`,
        { comp: newComp }
      );

      toast.success("Comp logged successfully");
      await loadData();
      handleCloseForm();
    } catch (error) {
      console.error("Error creating comp:", error);
      toast.error("Failed to log comp");
    }
  };

  const handleDelete = async (comp: CompItem) => {
    if (!window.confirm(`Delete this comp for ${comp.playerName}?`)) {
      return;
    }

    try {
      await api.deleteComp(comp.id);
      
      // Log the action
      await logAction(
        PROPERTY_NAME,
        currentUser?.username || 'Unknown',
        'comp_deleted',
        `Deleted comp for ${comp.playerName}: ${comp.quantity}x ${comp.itemName}`,
        { comp }
      );

      toast.success("Comp deleted");
      await loadData();
    } catch (error) {
      console.error("Error deleting comp:", error);
      toast.error("Failed to delete comp");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      playerId: '',
      playerName: '',
      memberId: '',
      type: 'drink',
      itemName: '',
      quantity: 1,
      theoAmount: '',
      notes: '',
      location: ''
    });
    setSelectedPlayer(null);
    setRecentPlayerComps([]);
    setDuplicateWarnings([]);
  };

  const handlePlayerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    setFormData(prev => ({ ...prev, playerName: search, playerId: '', memberId: '' }));
    
    if (search.length > 0) {
      const player = players.find(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.memberId.toLowerCase().includes(search.toLowerCase())
      );
      if (player) {
        setFormData(prev => ({
          ...prev,
          playerId: player.id,
          playerName: player.name,
          memberId: player.memberId
        }));
        setSelectedPlayer(player);
      }
    } else {
      setSelectedPlayer(null);
    }
  };

  // Filter and search comps
  const filteredComps = comps.filter(comp => {
    const matchesSearch = 
      comp.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || comp.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Calculate statistics
  const stats = {
    totalComps: comps.length,
    totalValue: comps.reduce((sum, comp) => sum + comp.value, 0),
    drinks: comps.filter(c => c.type === 'drink').length,
    cigarettes: comps.filter(c => c.type === 'cigarette').length,
    food: comps.filter(c => c.type === 'food').length
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'drink': return <Wine className="w-4 h-4" />;
      case 'cigarette': return <Cigarette className="w-4 h-4" />;
      case 'food': return <UtensilsCrossed className="w-4 h-4" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'drink': return 'text-blue-600 bg-blue-50';
      case 'cigarette': return 'text-orange-600 bg-orange-50';
      case 'food': return 'text-green-600 bg-green-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Comps Management</h1>
          <p className="text-slate-600 mt-1">Track complementary items given to players</p>
        </div>
        <div className="flex items-center gap-3">
          {!isViewOnly && (
            <>
              <button
                onClick={() => setShowCashSale(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                <DollarSign className="w-5 h-5" />
                Cash Sale
              </button>
              <button
                onClick={() => setShowStaffPurchase(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                <BadgePercent className="w-5 h-5" />
                Staff Purchase
              </button>
              <button
                onClick={handleQuickLog}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Camera className="w-5 h-5" />
                Free Comp
              </button>
            </>
          )}
          <button
            onClick={() => setShowEndOfDayReport(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md"
          >
            <FileText className="w-5 h-5" />
            End of Day Report
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Comps</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalComps}</p>
            </div>
            <QrCode className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Value</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalValue.toLocaleString()} FCFA</p>
            </div>
            <AlertCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Drinks</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.drinks}</p>
            </div>
            <Wine className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Cigarettes</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{stats.cigarettes}</p>
            </div>
            <Cigarette className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Food</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.food}</p>
            </div>
            <UtensilsCrossed className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by player name, member ID, or item..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('drink')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                filterType === 'drink'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Wine className="w-4 h-4" />
              Drinks
            </button>
            <button
              onClick={() => setFilterType('cigarette')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                filterType === 'cigarette'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Cigarette className="w-4 h-4" />
              Cigarettes
            </button>
            <button
              onClick={() => setFilterType('food')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                filterType === 'food'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              Food
            </button>
          </div>
        </div>
      </div>

      {/* Comps List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredComps.length === 0 ? (
          <div className="p-12 text-center">
            <QrCode className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No comps logged yet</p>
            <p className="text-slate-400 mt-2">Click "Quick Log Comp" to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Given By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredComps.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-slate-900">{comp.playerName}</div>
                        <div className="text-sm text-slate-500">{comp.memberId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(comp.type)}`}>
                        {getTypeIcon(comp.type)}
                        {comp.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {comp.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {comp.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {comp.value.toLocaleString()} FCFA
                        </div>
                        {comp.theoAmount && (
                          <div className="text-xs text-slate-500">
                            (0.1% of {comp.theoAmount.toLocaleString()})
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {comp.location || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {comp.givenBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <div>
                        <div>{new Date(comp.timestamp).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-500">
                          {new Date(comp.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(comp)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner 
          onScan={handleScanSuccess} 
          onClose={() => setShowScanner(false)} 
        />
      )}

      {/* Comp Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Log Comp</h3>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Player Info */}
              {selectedPlayer ? (
                <>
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      {selectedPlayer.profilePicture ? (
                        <img 
                          src={selectedPlayer.profilePicture} 
                          alt={selectedPlayer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-emerald-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-emerald-700" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900">{selectedPlayer.name}</div>
                        <div className="text-sm text-slate-600">Member ID: {selectedPlayer.memberId}</div>
                      </div>
                    </div>
                  </div>

                  {/* Duplicate Warnings */}
                  {duplicateWarnings.length > 0 && (
                    <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-red-900 mb-2">⚠️ DUPLICATE COMP ALERT</h4>
                          <p className="text-sm text-red-800 mb-3">
                            This player has received <strong>{duplicateWarnings.length}</strong> comp(s) in the last 60 minutes:
                          </p>
                          <div className="space-y-2">
                            {duplicateWarnings.slice(0, 5).map((warning, index) => (
                              <div key={index} className="flex items-center justify-between text-sm bg-red-100 p-2 rounded">
                                <span className="font-medium text-red-900">{warning.item}</span>
                                <div className="flex items-center gap-3 text-red-700">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {warning.minutesAgo} min ago
                                  </span>
                                  <span className="text-xs">by {warning.givenBy}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-red-700 mt-3 font-medium">
                            ⚠️ Please verify with management before proceeding
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Comps History */}
                  {recentPlayerComps.length > 0 && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-600" />
                        Recent Comps History
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {recentPlayerComps.map((comp) => {
                          const compDate = new Date(comp.timestamp);
                          const minutesAgo = Math.round((Date.now() - compDate.getTime()) / (60 * 1000));
                          const hoursAgo = Math.floor(minutesAgo / 60);
                          const daysAgo = Math.floor(hoursAgo / 24);
                          
                          let timeAgo = '';
                          if (daysAgo > 0) {
                            timeAgo = `${daysAgo}d ago`;
                          } else if (hoursAgo > 0) {
                            timeAgo = `${hoursAgo}h ago`;
                          } else {
                            timeAgo = `${minutesAgo}m ago`;
                          }

                          return (
                            <div key={comp.id} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-slate-200">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(comp.type)}
                                <span className="font-medium text-slate-900">{comp.itemName}</span>
                                <span className="text-xs text-slate-500">×{comp.quantity}</span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-600 text-xs">
                                <span>{timeAgo}</span>
                                <span className="text-slate-500">by {comp.givenBy}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Player Name or Member ID*
                  </label>
                  <input
                    type="text"
                    value={formData.playerName}
                    onChange={handlePlayerSearch}
                    placeholder="Start typing to search..."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Comp Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Comp Type*
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'drink', itemName: '' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'drink'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Wine className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Drink</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'cigarette', itemName: '' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'cigarette'
                        ? 'border-orange-600 bg-orange-50 text-orange-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Cigarette className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Cigarette</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'food', itemName: '' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === 'food'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <UtensilsCrossed className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Food</div>
                  </button>
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Item Name*
                </label>
                <select
                  value={formData.itemName}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an item...</option>
                  {COMP_ITEMS[formData.type].map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity*
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Theo Amount (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Theo Amount (FCFA)
                  </label>
                  <input
                    type="text"
                    value={formData.theoAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, theoAmount: e.target.value }))}
                    placeholder="Optional"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.theoAmount && (
                    <p className="text-xs text-slate-500 mt-1">
                      Value: {calculateCompValue(parseFloat(formData.theoAmount) || 0).toLocaleString()} FCFA (0.1%)
                    </p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location/Table
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Table 5, Bar Area"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Log Comp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cash Sale Modal */}
      {showCashSale && (
        <CompsCashSaleModal
          onClose={() => {
            setShowCashSale(false);
            loadData(); // Reload comps data after sale
          }}
        />
      )}

      {/* Staff Purchase Modal */}
      {showStaffPurchase && (
        <CompsStaffPurchaseModal
          onClose={() => {
            setShowStaffPurchase(false);
            loadData(); // Reload comps data after purchase
          }}
        />
      )}

      {/* End of Day Report Modal */}
      {showEndOfDayReport && (
        <CompsEndOfDayReport
          onClose={() => {
            setShowEndOfDayReport(false);
            loadData(); // Reload comps data after report
          }}
        />
      )}
    </div>
  );
}