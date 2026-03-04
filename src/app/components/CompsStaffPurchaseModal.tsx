import { useState, useEffect } from "react";
import { X, Plus, Minus, Trash2, UserCheck, Camera, ShoppingCart, BadgePercent } from "lucide-react";
import { useOutletContext } from "react-router";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";
import { logAction } from "../utils/auditLog";
import { APP_CURRENCY } from "../utils/currency";

// Hardcoded property - Grand Palace Casino v2.3.2
const PROPERTY_NAME = "Grand Palace Casino";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  position: string;
  department: string;
  profilePicture?: string;
  qrCode?: string;
  staffDiscountEnabled?: boolean;
}

interface CartItem {
  menuItemId: string;
  type: 'drink' | 'cigarette' | 'food';
  itemName: string;
  price: number;
  quantity: number;
}

interface StaffPurchaseModalProps {
  onClose: () => void;
}

export function CompsStaffPurchaseModal({ onClose }: StaffPurchaseModalProps) {
  const context = useOutletContext<{ currentUser: { username: string; userType: string } }>();
  const currentUser = context?.currentUser;
  const api = useApi();

  const [menuItems, setMenuItems] = useState<CompsMenuItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'drink' | 'cigarette' | 'food'>('all');
  const [showScanner, setShowScanner] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [menuData, employeesData] = await Promise.all([
        api.getCompsMenuItems(),
        api.getEmployees()
      ]);
      setMenuItems(menuData.filter((item: CompsMenuItem) => item.available));
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    }
  };

  const handleScanSuccess = (employeeId: string) => {
    const employee = employees.find(e => e.employeeId === employeeId || e.qrCode === employeeId);
    if (employee) {
      // Check if staff discount is enabled for this employee
      if (employee.staffDiscountEnabled === false) {
        toast.error(`${employee.firstName} ${employee.lastName} is not eligible for staff discount`);
        setShowScanner(false);
        return;
      }
      
      setSelectedEmployee(employee);
      setShowScanner(false);
      toast.success(`Employee ${employee.firstName} ${employee.lastName} selected`);
    } else {
      toast.error("Employee not found");
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
  const STAFF_DISCOUNT_PERCENT = 50;
  const discountAmount = Math.round(subtotal * STAFF_DISCOUNT_PERCENT / 100);
  const total = subtotal - discountAmount;

  const handleCheckout = async () => {
    if (!selectedEmployee) {
      toast.error("Please scan employee card first");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    await completePurchase();
  };

  const completePurchase = async () => {
    if (!selectedEmployee) return;

    setIsProcessing(true);
    try {
      const purchase = {
        id: `staff_purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        property: PROPERTY_NAME,
        employeeId: selectedEmployee.id,
        employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
        employeeCardId: selectedEmployee.employeeId,
        department: selectedEmployee.department,
        position: selectedEmployee.position,
        items: cart.map(item => ({
          type: item.type,
          itemName: item.itemName,
          quantity: item.quantity,
          originalPrice: item.price,
          discountedPrice: Math.round(item.price * 0.5), // 50% off
          total: Math.round(item.price * 0.5 * item.quantity)
        })),
        subtotal,
        discountPercent: STAFF_DISCOUNT_PERCENT,
        discount: discountAmount,
        total,
        paymentMethod: 'cash' as const,
        processedBy: currentUser?.username || 'Unknown',
        timestamp: new Date().toISOString()
      };

      await api.createCompsStaffPurchase(purchase);

      // Log the action
      await logAction(
        PROPERTY_NAME,
        currentUser?.username || 'Unknown',
        'comps_staff_purchase',
        `Staff purchase: ${total.toLocaleString()} FCFA for ${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
        { purchase }
      );

      // Print receipt
      printReceipt(purchase);

      toast.success("Staff purchase completed successfully!");
      onClose();
    } catch (error) {
      console.error("Error completing staff purchase:", error);
      toast.error("Failed to complete staff purchase");
    } finally {
      setIsProcessing(false);
    }
  };

  const printReceipt = (purchase: any) => {
    // Generate receipt content
    const receiptContent = `
==============================
  STAFF PURCHASE RECEIPT
==============================
Date: ${new Date(purchase.timestamp).toLocaleString()}
Receipt #: ${purchase.id.substr(-8)}
Processed by: ${purchase.processedBy}

------------------------------
EMPLOYEE INFORMATION:
${purchase.employeeName}
Employee ID: ${purchase.employeeCardId}
Department: ${purchase.department}
Position: ${purchase.position}

------------------------------
ITEMS:
${purchase.items.map((item: any) => 
  `${item.itemName} x${item.quantity}
  Original: ${item.originalPrice.toLocaleString()} FCFA
  Discounted: ${item.discountedPrice.toLocaleString()} FCFA
  Subtotal: ${item.total.toLocaleString()} FCFA`
).join('\n\n')}

------------------------------
Subtotal: ${purchase.subtotal.toLocaleString()} FCFA
Staff Discount (${purchase.discountPercent}%): -${purchase.discount.toLocaleString()} FCFA
TOTAL: ${purchase.total.toLocaleString()} FCFA
==============================
   STAFF DISCOUNT APPLIED
==============================
    `;

    // Try to print using thermal printer
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Staff Purchase Receipt</title>
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
                <BadgePercent className="w-6 h-6 text-purple-600" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Staff Purchase</h2>
                  <p className="text-sm text-purple-600 font-medium">50% Staff Discount</p>
                </div>
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
                {/* Employee Selection */}
                <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-lg">
                  {selectedEmployee ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedEmployee.profilePicture ? (
                          <img 
                            src={selectedEmployee.profilePicture} 
                            alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-purple-700" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">
                            {selectedEmployee.firstName} {selectedEmployee.lastName}
                          </div>
                          <div className="text-sm text-slate-600">
                            ID: {selectedEmployee.employeeId} • {selectedEmployee.position}
                          </div>
                          <div className="text-xs text-purple-600 font-medium mt-1">
                            ✓ 50% Staff Discount Applied
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedEmployee(null)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowScanner(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      Scan Employee Card (Required)
                    </button>
                  )}
                </div>

                {selectedEmployee && (
                  <>
                    {/* Type Filter */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          filterType === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
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
                      {filteredMenuItems.map(item => {
                        const discountedPrice = Math.round(item.price * 0.5);
                        return (
                          <button
                            key={item.id}
                            onClick={() => addToCart(item)}
                            className="p-4 bg-white border-2 border-slate-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all text-left"
                          >
                            <div className="text-2xl mb-2">{getTypeIcon(item.type)}</div>
                            <div className="font-semibold text-slate-900 text-sm mb-1">{item.itemName}</div>
                            <div className="space-y-1">
                              <div className="text-xs text-slate-400 line-through">
                                {item.price.toLocaleString()} FCFA
                              </div>
                              <div className="text-purple-600 font-bold flex items-center gap-1">
                                {discountedPrice.toLocaleString()} FCFA
                                <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                                  -50%
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {filteredMenuItems.length === 0 && (
                      <div className="text-center py-12 text-slate-500">
                        No items available in this category
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Cart - Right 1/3 */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-slate-900 text-lg">Cart</h3>

                {!selectedEmployee ? (
                  <div className="text-center py-12">
                    <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Scan employee card first</p>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    Cart is empty
                  </div>
                ) : (
                  <>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {cart.map(item => {
                        const discountedPrice = Math.round(item.price * 0.5);
                        return (
                          <div key={item.menuItemId} className="bg-white p-3 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="font-medium text-slate-900 text-sm">{item.itemName}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-slate-400 line-through">
                                    {item.price.toLocaleString()} FCFA
                                  </span>
                                  <span className="text-xs text-purple-600 font-medium">
                                    {discountedPrice.toLocaleString()} FCFA
                                  </span>
                                </div>
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
                                {(discountedPrice * item.quantity).toLocaleString()} FCFA
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Total Calculation */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Original Subtotal:</span>
                        <span className="line-through text-slate-400">{subtotal.toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-purple-600 font-medium">Staff Discount (50%):</span>
                        <span className="text-purple-600 font-semibold">-{discountAmount.toLocaleString()} FCFA</span>
                      </div>

                      <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
                        <span>Total to Pay:</span>
                        <span className="text-purple-600">{total.toLocaleString()} FCFA</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      {isProcessing ? 'Processing...' : 'Complete Purchase'}
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
    </>
  );
}