import { useState, useEffect } from "react";
import { Wine, Cigarette, UtensilsCrossed, Calendar, Download, User, MapPin, DollarSign, BadgePercent, TrendingUp, FileText } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";
import { APP_CURRENCY } from "../utils/currency";

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
  value: number;
  theoAmount?: number;
  notes?: string;
  location?: string;
  givenBy: string;
  timestamp: string;
}

interface CashSale {
  id: string;
  property: string;
  playerId?: string;
  playerName?: string;
  memberId?: string;
  items: {
    type: 'drink' | 'cigarette' | 'food';
    itemName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'cash';
  vipOverride?: {
    approvedBy: string;
    reason: string;
    discountPercent: number;
  };
  waiterName: string;
  timestamp: string;
}

interface StaffPurchase {
  id: string;
  property: string;
  employeeId: string;
  employeeName: string;
  employeeCardId: string;
  department: string;
  position: string;
  items: {
    type: 'drink' | 'cigarette' | 'food';
    itemName: string;
    quantity: number;
    originalPrice: number;
    discountedPrice: number;
    total: number;
  }[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  timestamp: string;
}

export function CompsReport() {
  const api = useApi();
  
  const [comps, setComps] = useState<CompItem[]>([]);
  const [cashSales, setCashSales] = useState<CashSale[]>([]);
  const [staffPurchases, setStaffPurchases] = useState<StaffPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'drink' | 'cigarette' | 'food'>('all');
  const [filterPlayer, setFilterPlayer] = useState("");
  const [viewMode, setViewMode] = useState<'overview' | 'comps' | 'sales' | 'staff'>('overview');

  useEffect(() => {
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
    
    loadData();
  }, [api.currentProperty]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [compsData, salesData, purchasesData] = await Promise.all([
        api.getComps(),
        api.getCompsCashSales(),
        api.getCompsStaffPurchases()
      ]);
      setComps(compsData);
      setCashSales(salesData);
      setStaffPurchases(purchasesData);
    } catch (error) {
      console.error("Error loading comps data:", error);
      toast.error("Failed to load comps data");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter by date range
  const filterByDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    
    if (fromDate && date < fromDate) return false;
    if (toDate) {
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (date > endOfDay) return false;
    }
    
    return true;
  };

  // Filter comps
  const filteredComps = comps.filter(comp => {
    if (!filterByDate(comp.timestamp)) return false;
    if (filterType !== 'all' && comp.type !== filterType) return false;
    if (filterPlayer && !comp.playerName.toLowerCase().includes(filterPlayer.toLowerCase()) && 
        !comp.memberId.toLowerCase().includes(filterPlayer.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Filter cash sales
  const filteredCashSales = cashSales.filter(sale => {
    if (!filterByDate(sale.timestamp)) return false;
    if (filterType !== 'all') {
      const hasMatchingType = sale.items.some(item => item.type === filterType);
      if (!hasMatchingType) return false;
    }
    if (filterPlayer && sale.playerName && 
        !sale.playerName.toLowerCase().includes(filterPlayer.toLowerCase()) &&
        (!sale.memberId || !sale.memberId.toLowerCase().includes(filterPlayer.toLowerCase()))) {
      return false;
    }
    return true;
  });

  // Filter staff purchases
  const filteredStaffPurchases = staffPurchases.filter(purchase => {
    if (!filterByDate(purchase.timestamp)) return false;
    if (filterType !== 'all') {
      const hasMatchingType = purchase.items.some(item => item.type === filterType);
      if (!hasMatchingType) return false;
    }
    return true;
  });

  // Calculate comprehensive statistics
  const stats = {
    // Free Comps
    totalComps: filteredComps.length,
    compsValue: filteredComps.reduce((sum, comp) => sum + comp.value, 0),
    compsDrinks: filteredComps.filter(c => c.type === 'drink').length,
    compsCigarettes: filteredComps.filter(c => c.type === 'cigarette').length,
    compsFood: filteredComps.filter(c => c.type === 'food').length,
    compsDrinksValue: filteredComps.filter(c => c.type === 'drink').reduce((sum, c) => sum + c.value, 0),
    compsCigarettesValue: filteredComps.filter(c => c.type === 'cigarette').reduce((sum, c) => sum + c.value, 0),
    compsFoodValue: filteredComps.filter(c => c.type === 'food').reduce((sum, c) => sum + c.value, 0),

    // Cash Sales
    totalCashSales: filteredCashSales.length,
    cashSalesSubtotal: filteredCashSales.reduce((sum, s) => sum + s.subtotal, 0),
    cashSalesDiscounts: filteredCashSales.reduce((sum, s) => sum + s.discount, 0),
    cashSalesTotal: filteredCashSales.reduce((sum, s) => sum + s.total, 0),
    vipDiscountCount: filteredCashSales.filter(s => s.vipOverride).length,

    // Staff Purchases
    totalStaffPurchases: filteredStaffPurchases.length,
    staffSubtotal: filteredStaffPurchases.reduce((sum, p) => sum + p.subtotal, 0),
    staffDiscounts: filteredStaffPurchases.reduce((sum, p) => sum + p.discountAmount, 0),
    staffTotal: filteredStaffPurchases.reduce((sum, p) => sum + p.total, 0),

    // Grand Totals
    grandRevenue: 0,
    grandCompsGiven: 0,
    grandDiscounts: 0,
    avgCompValue: 0
  };

  stats.grandRevenue = stats.cashSalesTotal + stats.staffTotal;
  stats.grandCompsGiven = stats.compsValue;
  stats.grandDiscounts = stats.cashSalesDiscounts + stats.staffDiscounts;
  stats.avgCompValue = filteredComps.length > 0 ? stats.compsValue / filteredComps.length : 0;

  // Group comps by player
  const compsByPlayer = filteredComps.reduce((acc, comp) => {
    if (!acc[comp.playerId]) {
      acc[comp.playerId] = {
        playerName: comp.playerName,
        memberId: comp.memberId,
        comps: [],
        totalValue: 0,
        totalCount: 0
      };
    }
    acc[comp.playerId].comps.push(comp);
    acc[comp.playerId].totalValue += comp.value;
    acc[comp.playerId].totalCount += 1;
    return acc;
  }, {} as Record<string, { playerName: string; memberId: string; comps: CompItem[]; totalValue: number; totalCount: number }>);

  const topPlayers = Object.values(compsByPlayer)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10);

  // Group by item (combined from all sources)
  const allItems = [
    ...filteredComps.map(c => ({ type: c.type, itemName: c.itemName, quantity: c.quantity, value: c.value })),
    ...filteredCashSales.flatMap(s => s.items.map(i => ({ type: i.type, itemName: i.itemName, quantity: i.quantity, value: i.total }))),
    ...filteredStaffPurchases.flatMap(p => p.items.map(i => ({ type: i.type, itemName: i.itemName, quantity: i.quantity, value: i.total })))
  ];

  const itemStats = allItems.reduce((acc, item) => {
    if (!acc[item.itemName]) {
      acc[item.itemName] = {
        type: item.type,
        count: 0,
        totalValue: 0
      };
    }
    acc[item.itemName].count += item.quantity;
    acc[item.itemName].totalValue += item.value;
    return acc;
  }, {} as Record<string, { type: string; count: number; totalValue: number }>);

  const topItems = Object.entries(itemStats)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);

  const handleExport = () => {
    const csvContent = [
      ['MF-Intel CMS - Comprehensive Comps Report'],
      [`Property: ${PROPERTY_NAME}`],
      [`Period: ${dateFrom} to ${dateTo}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['=== SUMMARY STATISTICS ==='],
      ['Category', 'Count', 'Value (FCFA)'],
      ['Free Comps', stats.totalComps, stats.compsValue],
      ['Cash Sales', stats.totalCashSales, stats.cashSalesTotal],
      ['Staff Purchases', stats.totalStaffPurchases, stats.staffTotal],
      ['Total Revenue', '', stats.grandRevenue],
      ['Total Comps Given', '', stats.grandCompsGiven],
      ['Total Discounts', '', stats.grandDiscounts],
      [],
      ['=== FREE COMPS DETAIL ==='],
      ['Date/Time', 'Player Name', 'Member ID', 'Type', 'Item', 'Quantity', 'Value (FCFA)', 'Theo Amount', 'Location', 'Given By', 'Notes'],
      ...filteredComps.map(comp => [
        new Date(comp.timestamp).toLocaleString(),
        comp.playerName,
        comp.memberId,
        comp.type,
        comp.itemName,
        comp.quantity,
        comp.value,
        comp.theoAmount || '',
        comp.location || '',
        comp.givenBy,
        comp.notes || ''
      ]),
      [],
      ['=== CASH SALES DETAIL ==='],
      ['Date/Time', 'Customer', 'Member ID', 'Items', 'Subtotal', 'Discount', 'Total', 'VIP Override', 'Waiter'],
      ...filteredCashSales.map(sale => [
        new Date(sale.timestamp).toLocaleString(),
        sale.playerName || 'Walk-in',
        sale.memberId || '',
        sale.items.map(i => `${i.quantity}x ${i.itemName}`).join('; '),
        sale.subtotal,
        sale.discount,
        sale.total,
        sale.vipOverride ? `${sale.vipOverride.discountPercent}% by ${sale.vipOverride.approvedBy}` : '',
        sale.waiterName
      ]),
      [],
      ['=== STAFF PURCHASES DETAIL ==='],
      ['Date/Time', 'Employee', 'Card ID', 'Department', 'Position', 'Items', 'Original Price', 'Discount (50%)', 'Total'],
      ...filteredStaffPurchases.map(purchase => [
        new Date(purchase.timestamp).toLocaleString(),
        purchase.employeeName,
        purchase.employeeCardId,
        purchase.department,
        purchase.position,
        purchase.items.map(i => `${i.quantity}x ${i.itemName}`).join('; '),
        purchase.subtotal,
        purchase.discountAmount,
        purchase.total
      ]),
      [],
      ['=== TOP 10 ITEMS ==='],
      ['Rank', 'Item', 'Type', 'Total Quantity', 'Total Value'],
      ...topItems.map(([name, data], index) => [
        index + 1,
        name,
        data.type,
        data.count,
        data.totalValue
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comps-comprehensive-report-${dateFrom}-to-${dateTo}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Report exported successfully");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'drink': return <Wine className="w-4 h-4 text-blue-600" />;
      case 'cigarette': return <Cigarette className="w-4 h-4 text-orange-600" />;
      case 'food': return <UtensilsCrossed className="w-4 h-4 text-green-600" />;
      default: return null;
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
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="drink">Drinks</option>
              <option value="cigarette">Cigarettes</option>
              <option value="food">Food</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Player Name/ID
            </label>
            <input
              type="text"
              value={filterPlayer}
              onChange={(e) => setFilterPlayer(e.target.value)}
              placeholder="Filter by player..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white rounded-lg shadow p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('overview')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              viewMode === 'overview'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setViewMode('comps')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              viewMode === 'comps'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Wine className="w-5 h-5" />
            Free Comps
          </button>
          <button
            onClick={() => setViewMode('sales')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              viewMode === 'sales'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            Cash Sales
          </button>
          <button
            onClick={() => setViewMode('staff')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              viewMode === 'staff'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BadgePercent className="w-5 h-5" />
            Staff Purchases
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {viewMode === 'overview' && (
        <>
          {/* Grand Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow border-2 border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-600">Total Revenue</h4>
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{stats.grandRevenue.toLocaleString()} FCFA</p>
              <p className="text-xs text-slate-600 mt-1">{stats.totalCashSales + stats.totalStaffPurchases} transactions</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow border-2 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-600">Free Comps Given</h4>
                <Wine className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.compsValue.toLocaleString()} FCFA</p>
              <p className="text-xs text-slate-600 mt-1">{stats.totalComps} comps</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow border-2 border-red-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-600">Total Discounts</h4>
                <BadgePercent className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.grandDiscounts.toLocaleString()} FCFA</p>
              <p className="text-xs text-slate-600 mt-1">VIP + Staff discounts</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-lg shadow border-2 border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-600">Avg Comp Value</h4>
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-3xl font-bold text-emerald-600">{Math.round(stats.avgCompValue).toLocaleString()} FCFA</p>
              <p className="text-xs text-slate-600 mt-1">per comp item</p>
            </div>
          </div>

          {/* Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Comps Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Free Comps</h3>
                <Wine className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <div className="flex items-center gap-2">
                    <Wine className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-slate-900">Drinks</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{stats.compsDrinks}</div>
                    <div className="text-xs text-slate-600">{stats.compsDrinksValue.toLocaleString()} FCFA</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                  <div className="flex items-center gap-2">
                    <Cigarette className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-slate-900">Cigarettes</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">{stats.compsCigarettes}</div>
                    <div className="text-xs text-slate-600">{stats.compsCigarettesValue.toLocaleString()} FCFA</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-slate-900">Food</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{stats.compsFood}</div>
                    <div className="text-xs text-slate-600">{stats.compsFoodValue.toLocaleString()} FCFA</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <div className="text-right">
                    <div className="font-bold text-xl text-blue-600">{stats.totalComps}</div>
                    <div className="text-sm text-slate-600">{stats.compsValue.toLocaleString()} FCFA</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cash Sales Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Cash Sales (POS)</h3>
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Transactions:</span>
                  <span className="font-bold text-slate-900">{stats.totalCashSales}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Subtotal:</span>
                  <span className="font-semibold text-slate-900">{stats.cashSalesSubtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">VIP Discounts:</span>
                  <span className="font-semibold text-red-600">-{stats.cashSalesDiscounts.toLocaleString()} FCFA</span>
                </div>
                <div className="text-xs text-slate-500 italic">
                  ({stats.vipDiscountCount} VIP override{stats.vipDiscountCount !== 1 ? 's' : ''})
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Net Revenue:</span>
                  <span className="font-bold text-xl text-green-600">{stats.cashSalesTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Staff Purchases Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Staff Purchases</h3>
                <BadgePercent className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Transactions:</span>
                  <span className="font-bold text-slate-900">{stats.totalStaffPurchases}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Original Price:</span>
                  <span className="font-semibold text-slate-900">{stats.staffSubtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Staff Discount (50%):</span>
                  <span className="font-semibold text-red-600">-{stats.staffDiscounts.toLocaleString()} FCFA</span>
                </div>
                <div className="text-xs text-slate-500 italic">
                  (Automatic 50% staff discount)
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Net Revenue:</span>
                  <span className="font-bold text-xl text-indigo-600">{stats.staffTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Players */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Top 10 Players by Comps Value</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Player</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Member ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Total Comps</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {topPlayers.map((player, index) => (
                    <tr key={player.memberId} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">#{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{player.playerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{player.memberId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{player.totalCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                        {player.totalValue.toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Items */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Top 10 Most Requested Items (All Sources)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Total Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {topItems.map(([itemName, data], index) => (
                    <tr key={itemName} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">#{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{itemName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          {getTypeIcon(data.type)}
                          <span className="text-sm text-slate-600 capitalize">{data.type}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold">{data.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                        {data.totalValue.toLocaleString()} FCFA
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Free Comps Tab */}
      {viewMode === 'comps' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Free Comps Detail ({filteredComps.length} items)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Date/Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Player</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Given By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredComps.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div>{new Date(comp.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500">{new Date(comp.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-slate-900">{comp.playerName}</div>
                      <div className="text-xs text-slate-500">{comp.memberId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        comp.type === 'drink' ? 'bg-blue-100 text-blue-700' :
                        comp.type === 'cigarette' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {getTypeIcon(comp.type)}
                        {comp.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{comp.itemName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{comp.quantity}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                      {comp.value.toLocaleString()} FCFA
                      {comp.theoAmount && <div className="text-xs text-slate-500">(0.1% of {comp.theoAmount.toLocaleString()})</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{comp.location || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{comp.givenBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cash Sales Tab */}
      {viewMode === 'sales' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cash Sales Detail ({filteredCashSales.length} transactions)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Date/Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Subtotal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Waiter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCashSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div>{new Date(sale.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500">{new Date(sale.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-slate-900">{sale.playerName || 'Walk-in Customer'}</div>
                      {sale.vipOverride && (
                        <div className="text-xs text-purple-600 font-medium flex items-center gap-1 mt-1">
                          <BadgePercent className="w-3 h-3" />
                          VIP {sale.vipOverride.discountPercent}% by {sale.vipOverride.approvedBy}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {sale.items.map((item, idx) => (
                        <div key={idx}>{item.quantity}x {item.itemName}</div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">{sale.subtotal.toLocaleString()} FCFA</td>
                    <td className="px-4 py-3 text-sm text-red-600">
                      {sale.discount > 0 ? `-${sale.discount.toLocaleString()} FCFA` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-green-600">
                      {sale.total.toLocaleString()} FCFA
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{sale.waiterName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Purchases Tab */}
      {viewMode === 'staff' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Staff Purchases Detail ({filteredStaffPurchases.length} transactions)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Date/Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Original</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Discount (50%)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStaffPurchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      <div>{new Date(purchase.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500">{new Date(purchase.timestamp).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium text-slate-900">{purchase.employeeName}</div>
                      <div className="text-xs text-slate-500">{purchase.position}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{purchase.department}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {purchase.items.map((item, idx) => (
                        <div key={idx}>{item.quantity}x {item.itemName}</div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">{purchase.subtotal.toLocaleString()} FCFA</td>
                    <td className="px-4 py-3 text-sm text-red-600">-{purchase.discountAmount.toLocaleString()} FCFA</td>
                    <td className="px-4 py-3 text-sm font-semibold text-indigo-600">
                      {purchase.total.toLocaleString()} FCFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}