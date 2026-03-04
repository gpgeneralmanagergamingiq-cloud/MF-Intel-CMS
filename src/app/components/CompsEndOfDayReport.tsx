import { useState, useEffect } from "react";
import { X, Download, Printer, Wine, Cigarette, UtensilsCrossed, DollarSign, BadgePercent, TrendingUp, Calendar } from "lucide-react";
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
  timestamp: string;
  givenBy: string;
}

interface CashSale {
  id: string;
  playerId?: string;
  playerName?: string;
  items: { type: string; itemName: string; quantity: number; price: number; total: number; }[];
  subtotal: number;
  discount: number;
  total: number;
  vipOverride?: { approvedBy: string; reason: string; discountPercent: number; };
  waiterName: string;
  timestamp: string;
}

interface StaffPurchase {
  id: string;
  employeeName: string;
  items: { type: string; itemName: string; quantity: number; originalPrice: number; discountedPrice: number; total: number; }[];
  subtotal: number;
  discountAmount: number;
  total: number;
  timestamp: string;
}

interface CompsEndOfDayReportProps {
  onClose: () => void;
}

export function CompsEndOfDayReport({ onClose }: CompsEndOfDayReportProps) {
  const api = useApi();
  
  const [comps, setComps] = useState<CompItem[]>([]);
  const [cashSales, setCashSales] = useState<CashSale[]>([]);
  const [staffPurchases, setStaffPurchases] = useState<StaffPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, [reportDate, api.currentProperty]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [compsData, salesData, purchasesData] = await Promise.all([
        api.getComps(),
        api.getCompsCashSales(),
        api.getCompsStaffPurchases()
      ]);

      // Filter by report date (start to end of day)
      const startOfDay = new Date(reportDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(reportDate);
      endOfDay.setHours(23, 59, 59, 999);

      const filteredComps = compsData.filter((c: CompItem) => {
        const date = new Date(c.timestamp);
        return date >= startOfDay && date <= endOfDay;
      });

      const filteredSales = salesData.filter((s: CashSale) => {
        const date = new Date(s.timestamp);
        return date >= startOfDay && date <= endOfDay;
      });

      const filteredPurchases = purchasesData.filter((p: StaffPurchase) => {
        const date = new Date(p.timestamp);
        return date >= startOfDay && date <= endOfDay;
      });

      setComps(filteredComps);
      setCashSales(filteredSales);
      setStaffPurchases(filteredPurchases);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load report data");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const stats = {
    // Free Comps
    totalComps: comps.length,
    compsValue: comps.reduce((sum, c) => sum + c.value, 0),
    compsDrinks: comps.filter(c => c.type === 'drink').length,
    compsCigarettes: comps.filter(c => c.type === 'cigarette').length,
    compsFood: comps.filter(c => c.type === 'food').length,

    // Cash Sales
    totalCashSales: cashSales.length,
    cashSalesSubtotal: cashSales.reduce((sum, s) => sum + s.subtotal, 0),
    cashSalesDiscounts: cashSales.reduce((sum, s) => sum + s.discount, 0),
    cashSalesTotal: cashSales.reduce((sum, s) => sum + s.total, 0),
    vipDiscounts: cashSales.filter(s => s.vipOverride).length,

    // Staff Purchases
    totalStaffPurchases: staffPurchases.length,
    staffSubtotal: staffPurchases.reduce((sum, p) => sum + p.subtotal, 0),
    staffDiscounts: staffPurchases.reduce((sum, p) => sum + p.discountAmount, 0),
    staffTotal: staffPurchases.reduce((sum, p) => sum + p.total, 0),

    // Grand Totals
    grandRevenue: 0,
    grandCompsGiven: 0,
    grandDiscounts: 0
  };

  stats.grandRevenue = stats.cashSalesTotal + stats.staffTotal;
  stats.grandCompsGiven = stats.compsValue;
  stats.grandDiscounts = stats.cashSalesDiscounts + stats.staffDiscounts;

  const handleExport = () => {
    const csvContent = [
      ['MF-Intel CMS - Comps End-of-Day Report'],
      [`Date: ${new Date(reportDate).toLocaleDateString()}`],
      [`Property: ${PROPERTY_NAME}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ['=== SUMMARY ==='],
      ['Category', 'Count', 'Value (FCFA)'],
      ['Free Comps', stats.totalComps, stats.compsValue],
      ['Cash Sales', stats.totalCashSales, stats.cashSalesTotal],
      ['Staff Purchases', stats.totalStaffPurchases, stats.staffTotal],
      ['Total Revenue', '', stats.grandRevenue],
      ['Total Comps Given', '', stats.grandCompsGiven],
      ['Total Discounts', '', stats.grandDiscounts],
      [],
      ['=== FREE COMPS DETAIL ==='],
      ['Time', 'Player', 'Member ID', 'Type', 'Item', 'Quantity', 'Value', 'Given By'],
      ...comps.map(c => [
        new Date(c.timestamp).toLocaleTimeString(),
        c.playerName,
        c.memberId,
        c.type,
        c.itemName,
        c.quantity,
        c.value,
        c.givenBy
      ]),
      [],
      ['=== CASH SALES DETAIL ==='],
      ['Time', 'Customer', 'Items', 'Subtotal', 'Discount', 'Total', 'VIP Override', 'Waiter'],
      ...cashSales.map(s => [
        new Date(s.timestamp).toLocaleTimeString(),
        s.playerName || 'Walk-in',
        s.items.map(i => `${i.quantity}x ${i.itemName}`).join('; '),
        s.subtotal,
        s.discount,
        s.total,
        s.vipOverride ? `${s.vipOverride.discountPercent}% by ${s.vipOverride.approvedBy}` : 'None',
        s.waiterName
      ]),
      [],
      ['=== STAFF PURCHASES DETAIL ==='],
      ['Time', 'Employee', 'Items', 'Original', 'Discount (50%)', 'Total'],
      ...staffPurchases.map(p => [
        new Date(p.timestamp).toLocaleTimeString(),
        p.employeeName,
        p.items.map(i => `${i.quantity}x ${i.itemName}`).join('; '),
        p.subtotal,
        p.discountAmount,
        p.total
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comps-eod-report-${reportDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Report exported successfully");
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Comps End-of-Day Report</h2>
              <p className="text-sm text-slate-600 mt-1">{PROPERTY_NAME}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6 space-y-6">
          {/* Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Comps Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Free Comps</h3>
                <Wine className="w-8 h-8 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Items:</span>
                  <span className="font-bold text-slate-900">{stats.totalComps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Drinks:</span>
                  <span className="font-semibold text-blue-600">{stats.compsDrinks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Cigarettes:</span>
                  <span className="font-semibold text-orange-600">{stats.compsCigarettes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Food:</span>
                  <span className="font-semibold text-green-600">{stats.compsFood}</span>
                </div>
                <div className="pt-2 border-t border-blue-300 flex justify-between">
                  <span className="font-medium text-slate-700">Total Value:</span>
                  <span className="font-bold text-lg text-blue-600">{stats.compsValue.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Cash Sales Summary */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Cash Sales (POS)</h3>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Transactions:</span>
                  <span className="font-bold text-slate-900">{stats.totalCashSales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Subtotal:</span>
                  <span className="font-semibold text-slate-700">{stats.cashSalesSubtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">VIP Discounts:</span>
                  <span className="font-semibold text-red-600">-{stats.cashSalesDiscounts.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>({stats.vipDiscounts} VIP overrides)</span>
                </div>
                <div className="pt-2 border-t border-green-300 flex justify-between">
                  <span className="font-medium text-slate-700">Total Revenue:</span>
                  <span className="font-bold text-lg text-green-600">{stats.cashSalesTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            {/* Staff Purchases Summary */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">Staff Purchases</h3>
                <BadgePercent className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Transactions:</span>
                  <span className="font-bold text-slate-900">{stats.totalStaffPurchases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Original Price:</span>
                  <span className="font-semibold text-slate-700">{stats.staffSubtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Staff Discount (50%):</span>
                  <span className="font-semibold text-red-600">-{stats.staffDiscounts.toLocaleString()} FCFA</span>
                </div>
                <div className="pt-2 border-t border-indigo-300 flex justify-between">
                  <span className="font-medium text-slate-700">Total Revenue:</span>
                  <span className="font-bold text-lg text-indigo-600">{stats.staffTotal.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Total Summary */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Daily Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-purple-200 text-sm mb-1">Total Cash Revenue</p>
                <p className="text-3xl font-bold">{stats.grandRevenue.toLocaleString()} FCFA</p>
                <p className="text-xs text-purple-200 mt-1">From {stats.totalCashSales + stats.totalStaffPurchases} transactions</p>
              </div>
              <div className="text-center">
                <p className="text-purple-200 text-sm mb-1">Total Comps Given</p>
                <p className="text-3xl font-bold">{stats.grandCompsGiven.toLocaleString()} FCFA</p>
                <p className="text-xs text-purple-200 mt-1">From {stats.totalComps} free comps</p>
              </div>
              <div className="text-center">
                <p className="text-purple-200 text-sm mb-1">Total Discounts</p>
                <p className="text-3xl font-bold">{stats.grandDiscounts.toLocaleString()} FCFA</p>
                <p className="text-xs text-purple-200 mt-1">VIP + Staff discounts</p>
              </div>
            </div>
          </div>

          {/* Free Comps Detail */}
          {comps.length > 0 && (
            <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Wine className="w-5 h-5 text-blue-600" />
                  Free Comps Detail ({comps.length} items)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Player</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Value</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Given By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {comps.map((comp) => (
                      <tr key={comp.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {new Date(comp.timestamp).toLocaleTimeString()}
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
                            {comp.type === 'drink' ? <Wine className="w-3 h-3" /> :
                             comp.type === 'cigarette' ? <Cigarette className="w-3 h-3" /> :
                             <UtensilsCrossed className="w-3 h-3" />}
                            {comp.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{comp.itemName}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{comp.quantity}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                          {comp.value.toLocaleString()} FCFA
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{comp.givenBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cash Sales Detail */}
          {cashSales.length > 0 && (
            <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Cash Sales Detail ({cashSales.length} transactions)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Items</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Subtotal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Discount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Waiter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {cashSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {new Date(sale.timestamp).toLocaleTimeString()}
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

          {/* Staff Purchases Detail */}
          {staffPurchases.length > 0 && (
            <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BadgePercent className="w-5 h-5 text-indigo-600" />
                  Staff Purchases Detail ({staffPurchases.length} transactions)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Items</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Original</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Discount (50%)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {staffPurchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {new Date(purchase.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{purchase.employeeName}</td>
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

          {/* No Data Message */}
          {comps.length === 0 && cashSales.length === 0 && staffPurchases.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-lg text-slate-600">No transactions found for {new Date(reportDate).toLocaleDateString()}</p>
              <p className="text-sm text-slate-500 mt-2">Try selecting a different date</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Report generated on {new Date().toLocaleString()} • MF-Intel CMS v2.3.0
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}