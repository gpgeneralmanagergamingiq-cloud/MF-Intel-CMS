import { useState, useEffect } from "react";
import { FileText, Plus, Edit2, Trash2, Save, X, MoveUp, MoveDown } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { toast } from "sonner";

export interface ReceiptField {
  id: string;
  label: string;
  fieldType: "text" | "signature" | "date" | "checkbox";
  position: number;
  isRequired: boolean;
  placeholder?: string;
  defaultValue?: string;
  isActive: boolean;
}

export function ReceiptFieldsManagement() {
  const [fields, setFields] = useState<ReceiptField[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingField, setEditingField] = useState<ReceiptField | null>(null);
  const api = useApi();

  // Form fields
  const [formLabel, setFormLabel] = useState("");
  const [formFieldType, setFormFieldType] = useState<ReceiptField["fieldType"]>("text");
  const [formPlaceholder, setFormPlaceholder] = useState("");
  const [formDefaultValue, setFormDefaultValue] = useState("");
  const [formIsRequired, setFormIsRequired] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);

  useEffect(() => {
    loadFields();
  }, [api.currentProperty]);

  const loadFields = async () => {
    try {
      const loadedFields = await api.getReceiptFields();
      // Sort by position
      const sortedFields = loadedFields.sort((a, b) => a.position - b.position);
      setFields(sortedFields);
    } catch (error) {
      console.error("Error loading receipt fields:", error);
      // Initialize with default fields if none exist
      const defaultFields: ReceiptField[] = [
        {
          id: crypto.randomUUID(),
          label: "Requested By",
          fieldType: "text",
          position: 1,
          isRequired: false,
          placeholder: "(Print Name)",
          isActive: true,
        },
        {
          id: crypto.randomUUID(),
          label: "Cashier Signature",
          fieldType: "signature",
          position: 2,
          isRequired: true,
          isActive: true,
        },
        {
          id: crypto.randomUUID(),
          label: "Approved By",
          fieldType: "signature",
          position: 3,
          isRequired: false,
          placeholder: "(Management Signature)",
          isActive: true,
        },
      ];
      setFields(defaultFields);
      // Save default fields
      for (const field of defaultFields) {
        await api.createReceiptField(field);
      }
    }
  };

  const openForm = (field?: ReceiptField) => {
    if (field) {
      setEditingField(field);
      setFormLabel(field.label);
      setFormFieldType(field.fieldType);
      setFormPlaceholder(field.placeholder || "");
      setFormDefaultValue(field.defaultValue || "");
      setFormIsRequired(field.isRequired);
      setFormIsActive(field.isActive);
    } else {
      setEditingField(null);
      setFormLabel("");
      setFormFieldType("text");
      setFormPlaceholder("");
      setFormDefaultValue("");
      setFormIsRequired(false);
      setFormIsActive(true);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingField(null);
    setFormLabel("");
    setFormFieldType("text");
    setFormPlaceholder("");
    setFormDefaultValue("");
    setFormIsRequired(false);
    setFormIsActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingField) {
        // Update existing field
        const updatedField: ReceiptField = {
          ...editingField,
          label: formLabel,
          fieldType: formFieldType,
          placeholder: formPlaceholder,
          defaultValue: formDefaultValue,
          isRequired: formIsRequired,
          isActive: formIsActive,
        };
        await api.updateReceiptField(editingField.id, updatedField);
        toast.success("Receipt field updated successfully!");
      } else {
        // Add new field
        const newField: ReceiptField = {
          id: crypto.randomUUID(),
          label: formLabel,
          fieldType: formFieldType,
          position: fields.length + 1,
          placeholder: formPlaceholder,
          defaultValue: formDefaultValue,
          isRequired: formIsRequired,
          isActive: formIsActive,
        };
        await api.createReceiptField(newField);
        toast.success("Receipt field added successfully!");
      }
      await loadFields();
      closeForm();
    } catch (error) {
      console.error("Error saving receipt field:", error);
      toast.error("Failed to save receipt field. Please try again.");
    }
  };

  const deleteField = async (fieldId: string) => {
    if (window.confirm("Are you sure you want to delete this receipt field?")) {
      try {
        await api.deleteReceiptField(fieldId);
        await loadFields();
        toast.success("Receipt field deleted successfully!");
      } catch (error) {
        console.error("Error deleting receipt field:", error);
        toast.error("Failed to delete receipt field. Please try again.");
      }
    }
  };

  const moveField = async (fieldId: string, direction: "up" | "down") => {
    const fieldIndex = fields.findIndex((f) => f.id === fieldId);
    if (
      (direction === "up" && fieldIndex === 0) ||
      (direction === "down" && fieldIndex === fields.length - 1)
    ) {
      return;
    }

    const newFields = [...fields];
    const targetIndex = direction === "up" ? fieldIndex - 1 : fieldIndex + 1;
    
    // Swap positions
    [newFields[fieldIndex], newFields[targetIndex]] = [
      newFields[targetIndex],
      newFields[fieldIndex],
    ];

    // Update positions
    newFields.forEach((field, index) => {
      field.position = index + 1;
    });

    setFields(newFields);

    // Update in database
    try {
      for (const field of newFields) {
        await api.updateReceiptField(field.id, field);
      }
      toast.success("Field order updated!");
    } catch (error) {
      console.error("Error updating field order:", error);
      toast.error("Failed to update field order.");
      await loadFields(); // Reload to reset
    }
  };

  const getFieldTypeIcon = (fieldType: ReceiptField["fieldType"]) => {
    switch (fieldType) {
      case "text":
        return "📝";
      case "signature":
        return "✍️";
      case "date":
        return "📅";
      case "checkbox":
        return "☑️";
      default:
        return "📄";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Thermal Receipt Fields
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Customize fields that appear on printed thermal receipts
          </p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Field
        </button>
      </div>

      <div className="p-6">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No receipt fields configured. Add a field to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                  field.isActive
                    ? "bg-white border-slate-200 hover:bg-slate-50"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                {/* Position & Type */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveField(field.id, "up")}
                      disabled={index === 0}
                      className={`p-1 rounded transition-colors ${
                        index === 0
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                      title="Move up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveField(field.id, "down")}
                      disabled={index === fields.length - 1}
                      className={`p-1 rounded transition-colors ${
                        index === fields.length - 1
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                      title="Move down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-2xl">{getFieldTypeIcon(field.fieldType)}</div>
                  <div className="text-sm font-semibold text-slate-500">#{field.position}</div>
                </div>

                {/* Field Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900">{field.label}</h4>
                    {field.isRequired && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">
                        Required
                      </span>
                    )}
                    {!field.isActive && (
                      <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="capitalize">{field.fieldType} Field</span>
                    {field.placeholder && (
                      <span className="text-slate-400">• {field.placeholder}</span>
                    )}
                    {field.defaultValue && (
                      <span className="text-slate-400">• Default: {field.defaultValue}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openForm(field)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit field"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteField(field.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Field Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 bg-slate-50 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {editingField ? "Edit Receipt Field" : "Add New Receipt Field"}
              </h3>
              <button
                onClick={closeForm}
                className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Field Label *
                </label>
                <input
                  type="text"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Requested By, Approved By"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  This label will appear on the receipt
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Field Type *
                </label>
                <select
                  value={formFieldType}
                  onChange={(e) => setFormFieldType(e.target.value as ReceiptField["fieldType"])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="text">Text Input</option>
                  <option value="signature">Signature Line</option>
                  <option value="date">Date Field</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={formPlaceholder}
                  onChange={(e) => setFormPlaceholder(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., (Print Name), (Signature)"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Helper text that appears below the field
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Default Value
                </label>
                <input
                  type="text"
                  value={formDefaultValue}
                  onChange={(e) => setFormDefaultValue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional pre-filled value"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRequired"
                  checked={formIsRequired}
                  onChange={(e) => setFormIsRequired(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isRequired" className="text-sm text-slate-700">
                  Mark as required field
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm text-slate-700">
                  Show field on receipts
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingField ? "Update Field" : "Add Field"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
