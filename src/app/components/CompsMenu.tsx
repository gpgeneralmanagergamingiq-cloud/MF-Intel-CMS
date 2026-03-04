import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Wine, Cigarette, UtensilsCrossed, Save, X } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";

// Hardcoded property - Grand Palace Casino v2.3.2
const PROPERTY_NAME = "Grand Palace Casino";

export interface CompsMenuItem {
  id: string;
  property: string;
  type: 'drink' | 'cigarette' | 'food';
  itemName: string;
  price: number; // Price in FCFA
  available: boolean;
}

export function CompsMenu() {
  const api = useApi();

  const [menuItems, setMenuItems] = useState<CompsMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CompsMenuItem | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'drink' | 'cigarette' | 'food'>('all');
  const [formData, setFormData] = useState({
    type: 'drink' as 'drink' | 'cigarette' | 'food',
    itemName: '',
    price: '',
    available: true
  });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCompsMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error("Error loading menu items:", error);
      toast.error("Failed to load menu items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.itemName || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      if (editingItem) {
        await api.updateCompsMenuItem(editingItem.id, {
          type: formData.type,
          itemName: formData.itemName,
          price,
          available: formData.available
        });
        toast.success("Menu item updated");
      } else {
        const newItem: CompsMenuItem = {
          id: `menu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          property: PROPERTY_NAME,
          type: formData.type,
          itemName: formData.itemName,
          price,
          available: formData.available
        };
        await api.createCompsMenuItem(newItem);
        toast.success("Menu item added");
      }
      
      await loadMenuItems();
      handleCloseForm();
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast.error("Failed to save menu item");
    }
  };

  const handleEdit = (item: CompsMenuItem) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      itemName: item.itemName,
      price: item.price.toString(),
      available: item.available
    });
    setShowForm(true);
  };

  const handleDelete = async (item: CompsMenuItem) => {
    if (!window.confirm(`Delete ${item.itemName} from menu?`)) {
      return;
    }

    try {
      await api.deleteCompsMenuItem(item.id);
      toast.success("Menu item deleted");
      await loadMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Failed to delete menu item");
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      type: 'drink',
      itemName: '',
      price: '',
      available: true
    });
  };

  const filteredItems = menuItems.filter(item => 
    filterType === 'all' || item.type === filterType
  );

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
          <h2 className="text-2xl font-bold text-slate-900">Comps Menu Management</h2>
          <p className="text-slate-600 mt-1">Manage items and prices for cash sales</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      {/* Filters */}
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

      {/* Menu Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <UtensilsCrossed className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No menu items yet</p>
            <p className="text-slate-400 mt-2">Click "Add Item" to create your first menu item</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Price
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
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {item.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {item.price.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                </h3>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type*
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'drink' }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.type === 'drink'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Wine className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Drink</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'cigarette' }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.type === 'cigarette'
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Cigarette className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Cigarette</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'food' }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.type === 'food'
                        ? 'border-green-600 bg-green-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <UtensilsCrossed className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs">Food</div>
                  </button>
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Item Name*
                </label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                  placeholder="e.g., Beer, Marlboro, Sandwich"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price (FCFA)*
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Available */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="available" className="text-sm font-medium text-slate-700">
                  Available for sale
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}