import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, DollarSign, User, AlertTriangle, Camera, ShoppingCart } from "lucide-react";
import { useOutletContext } from "react-router";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";
import { QRScanner } from "./QRScanner";
import { logAction } from "../utils/auditLog";
import { APP_CURRENCY } from "../utils/currency";

// Hardcoded property - Grand Palace Casino v2.3.2
const PROPERTY_NAME = "Grand Palace Casino";

interface Player {
  id: string;
  name: string;
  memberId: string;
  profilePicture?: string;
}

interface CartItem {
  menuItemId: string;
  type: 'drink' | 'cigarette' | 'food';
  itemName: string;
  price: number;
  quantity: number;
}

interface CashSaleModalProps {
  onClose: () => void;
}

export function CompsCashSaleModal({ onClose }: CashSaleModalProps) {
  const context = useOutletContext<{ currentUser: { username: string; userType: string } }>();
  const currentUser = context?.currentUser;
  const api = useApi();

  const [menuItems, setMenuItems] = useState<CompsMenuItem[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'drink' | 'cigarette' | 'food'>('all');
  const [showScanner, setShowScanner] = useState(false);
  const [showVIPOverride, setShowVIPOverride] = useState(false);
  const [vipDiscount, setVipDiscount] = useState('');
  const [vipReason, setVipReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [menuData, playersData] = await Promise.all([
        api.getCompsMenuItems(),
        api.getPlayers()
      ]);
      setMenuItems(menuData.filter((item: CompsMenuItem) => item.available));
      setPlayers(playersData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    }
  };

  const handleScanSuccess = (memberId: string) => {
    const player = players.find(p => p.memberId === memberId);
    if (player) {
      setSelectedPlayer(player);
      setShowScanner(false);
      toast.success(`Player ${player.name} selected`);
    } else {
      toast.error("Player not found");
      setShowScanner(false);
    }
  };

  const addToCart = (menuItem: CompsMenuItem) => {
    const existingItem = cart.find(item => item.menuItemId === menuItem.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.menuItemId === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        menuItemId: menuItem.id,
        type: menuItem.type,
        itemName: menuItem.itemName,
        price: menuItem.price,
        quantity: 1
      }]);
    }
    toast.success(`Added ${menuItem.itemName} to cart`);
  };

  const updateQuantity = (menuItemId: string, change: number) => {
    setCart(cart.map(item => {
      if (item.menuItemId === menuItemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(cart.filter(item => item.menuItemId !== menuItemId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountPercent = parseFloat(vipDiscount) || 0;
  const discountAmount = Math.round(subtotal * discountPercent / 100);
  const total = subtotal - discountAmount;

  const handleVIPApproval = async (approverUsername: string, signature: string) => {
    setShowVIPOverride(false);
    await completeSale(approverUsername, signature);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (discountPercent > 0) {
      // Require VIP approval for discounts
      setShowVIPOverride(true);
    } else {
      await completeSale();
    }
  };

  const completeSale = async (approverUsername?: string, approverSignature?: string) => {
    setIsProcessing(true);
    try {
      const sale = {
        id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        property: PROPERTY_NAME,
        playerId: selectedPlayer?.id,
        playerName: selectedPlayer?.name,
        memberId: selectedPlayer?.memberId,
        items: cart.map(item => ({
          type: item.type,
          itemName: item.itemName,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subtotal,
        discount: discountAmount,
        total,
        paymentMethod: 'cash' as const,
        vipOverride: discountPercent > 0 ? {
          approvedBy: approverUsername || '',
          approvedSignature: approverSignature || '',
          reason: vipReason,
          discountPercent
        } : undefined,
        waiterName: currentUser?.username || 'Unknown',
        timestamp: new Date().toISOString()
      };

      await api.createCompsCashSale(sale);

      // Log the action
      await logAction(
        PROPERTY_NAME,
        currentUser?.username || 'Unknown',
        'comps_cash_sale',
        `Cash sale completed: ${total.toLocaleString()} FCFA${selectedPlayer ? ` for ${selectedPlayer.name}` : ''}`,
        { sale }
      );

      // Print receipt
      printReceipt(sale);

      toast.success("Sale completed successfully!");
      onClose();
    } catch (error) {
      console.error("Error completing sale:", error);
      toast.error("Failed to complete sale");
    } finally {
      setIsProcessing(false);
    }
  };

  const printReceipt = (sale: any) => {
    // Generate receipt content
    const receiptContent = `
==============================
    COMPS CASH SALE RECEIPT
==============================
Date: ${new Date(sale.timestamp).toLocaleString()}
Receipt #: ${sale.id.substr(-8)}
Waiter: ${sale.waiterName}
${sale.playerName ? `Player: ${sale.playerName}\nMember ID: ${sale.memberId}\n` : ''}
------------------------------
ITEMS:
${sale.items.map((item: any) => 
  `${item.itemName} x${item.quantity}\n  ${item.price.toLocaleString()} FCFA each\n  Subtotal: ${item.total.toLocaleString()} FCFA`
).join('\n\n')}

------------------------------
Subtotal: ${sale.subtotal.toLocaleString()} FCFA
${sale.vipOverride ? `Discount (${sale.vipOverride.discountPercent}%): -${sale.discount.toLocaleString()} FCFA\nApproved by: ${sale.vipOverride.approvedBy}\nSignature: ${sale.vipOverride.approvedSignature}\nReason: ${sale.vipOverride.reason}\n` : ''}
TOTAL: ${sale.total.toLocaleString()} FCFA
==============================
    Thank you!
==============================
    `;

    // Try to print using thermal printer
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                @media print {
                  @page { margin: 0; size: 80mm auto; }
                  body { margin: 0; font-family: 'Courier New', monospace; font-size: 12px; }
                }
                body { font-family: 'Courier New', monospace; white-space: pre; padding: 10px; }
              </style>
            </head>
            <body>${receiptContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    } catch (error) {
      console.error("Error printing receipt:", error);
    }
  };

  const filteredMenuItems = menuItems.filter(item =>
    filterType === 'all' || item.type === filterType
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'drink': return '🍷';
      case 'cigarette': return '🚬';
      case 'food': return '🍽️';
      default: return '📦';
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full my-8">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Cash Sale</h2>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Menu Items - Left 2/3 */}
              <div className="lg:col-span-2 space-y-4">
                {/* Player Selection */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  {selectedPlayer ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedPlayer.profilePicture ? (
                          <img 
                            src={selectedPlayer.profilePicture} 
                            alt={selectedPlayer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-700" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">{selectedPlayer.name}</div>
                          <div className="text-sm text-slate-600">ID: {selectedPlayer.memberId}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedPlayer(null)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowScanner(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      Scan Player Card (Optional)
                    </button>
                  )}
                </div>

                {/* Type Filter */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('drink')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filterType === 'drink' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    🍷 Drinks
                  </button>
                  <button
                    onClick={() => setFilterType('cigarette')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filterType === 'cigarette' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    🚬 Cigarettes
                  </button>
                  <button
                    onClick={() => setFilterType('food')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filterType === 'food' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    🍽️ Food
                  </button>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto">
                  {filteredMenuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="p-4 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left"
                    >
                      <div className="text-2xl mb-2">{getTypeIcon(item.type)}</div>
                      <div className="font-semibold text-slate-900 text-sm mb-1">{item.itemName}</div>
                      <div className="text-blue-600 font-bold">{item.price.toLocaleString()} FCFA</div>
                    </button>
                  ))}
                </div>

                {filteredMenuItems.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No items available in this category
                  </div>
                )}
              </div>

              {/* Cart - Right 1/3 */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-slate-900 text-lg">Cart</h3>

                {cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    Cart is empty
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.menuItemId} className="bg-white p-3 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="font-medium text-slate-900 text-sm">{item.itemName}</div>
                              <div className="text-xs text-slate-600">{item.price.toLocaleString()} FCFA each</div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.menuItemId)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.menuItemId, -1)}
                                className="w-7 h-7 flex items-center justify-center bg-slate-100 rounded hover:bg-slate-200"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.menuItemId, 1)}
                                className="w-7 h-7 flex items-center justify-center bg-slate-100 rounded hover:bg-slate-200"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="font-semibold text-slate-900">
                              {(item.price * item.quantity).toLocaleString()} FCFA
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* VIP Discount */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Subtotal:</span>
                        <span className="font-semibold">{subtotal.toLocaleString()} FCFA</span>
                      </div>

                      <div>
                        <label className="block text-sm text-slate-600 mb-1">VIP Discount %</label>
                        <input
                          type="text"
                          value={vipDiscount}
                          onChange={(e) => setVipDiscount(e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        {discountPercent > 0 && (
                          <div className="mt-1">
                            <input
                              type="text"
                              value={vipReason}
                              onChange={(e) => setVipReason(e.target.value)}
                              placeholder="Reason for discount"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                          </div>
                        )}
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-orange-600">Discount ({discountPercent}%):</span>
                          <span className="text-orange-600 font-semibold">-{discountAmount.toLocaleString()} FCFA</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-blue-600">{total.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Complete Sale'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner */}
      {showScanner && (
        <QRScanner
          onScan={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* VIP Override Approval */}
      {showVIPOverride && (
        <PasswordVerificationModal
          title="VIP Discount Approval Required"
          message={`Approve ${discountPercent}% discount (${discountAmount.toLocaleString()} FCFA)\nReason: ${vipReason || 'No reason provided'}`}
          requiredRoles={['Management', 'Administrator']}
          onVerify={handleVIPApproval}
          onCancel={() => setShowVIPOverride(false)}
        />
      )}
    </>
  );
}