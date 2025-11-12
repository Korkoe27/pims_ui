// components/AddBillModal.jsx
import React, { useState } from "react";
import { FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { showToast } from "./ToasterHelper";
import { useCreatePharmacyBillMutation } from "../redux/api/features/billingApi";

export default function AddBillModal({ appointment, onClose }) {
  const [billItems, setBillItems] = useState([
    { item_name: "", quantity: 1, unit_price: 0, description: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [createPharmacyBill, { isLoading: isSubmitting }] = useCreatePharmacyBillMutation();

  const addBillItem = () => {
    setBillItems([
      ...billItems,
      { item_name: "", quantity: 1, unit_price: 0, description: "" },
    ]);
  };

  const removeBillItem = (index) => {
    if (billItems.length === 1) {
      showToast("At least one bill item is required", "warning");
      return;
    }
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const updateBillItem = (index, field, value) => {
    const updated = [...billItems];
    updated[index] = { ...updated[index], [field]: value };
    setBillItems(updated);
  };

  const calculateTotal = () => {
    return billItems.reduce((total, item) => {
      return total + (item.quantity * item.unit_price);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = [];
    billItems.forEach((item, idx) => {
      if (!item.item_name.trim()) {
        errors.push(`Item ${idx + 1}: Name is required`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${idx + 1}: Quantity must be greater than 0`);
      }
      if (item.unit_price <= 0) {
        errors.push(`Item ${idx + 1}: Unit price must be greater than 0`);
      }
    });

    if (errors.length > 0) {
      showToast(errors.join("\n"), "error");
      return;
    }

    try {
      const billData = {
        appointment: appointment.id,
        items: billItems,
        notes,
        total_amount: calculateTotal(),
      };

      await createPharmacyBill(billData).unwrap();

      showToast("✅ Bill created successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error creating bill:", error);
      const errorMessage = error?.data?.detail || 
                           error?.data?.non_field_errors?.[0] || 
                           "Failed to create bill";
      showToast(`❌ ${errorMessage}`, "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create Bill</h2>
            <p className="text-gray-600 text-sm mt-1">
              Patient: {appointment.patient_name} ({appointment.patient_id})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Bill Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Bill Items</h3>
                <button
                  type="button"
                  onClick={addBillItem}
                  className="px-3 py-2 bg-[#2f3192] text-white rounded hover:bg-[#1f2170] transition flex items-center gap-2 text-sm"
                >
                  <FaPlus /> Add Item
                </button>
              </div>

              <div className="space-y-4">
                {billItems.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
                  >
                    {billItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBillItem(index)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        title="Remove item"
                      >
                        <FaTrash />
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      {/* Item Name */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.item_name}
                          onChange={(e) =>
                            updateBillItem(index, "item_name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                          placeholder="e.g., Prescription Glasses, Eye Drops"
                          required
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateBillItem(index, "quantity", parseInt(e.target.value) || 1)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                          required
                        />
                      </div>

                      {/* Unit Price */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unit Price (GHS) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) =>
                            updateBillItem(index, "unit_price", parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateBillItem(index, "description", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                          placeholder="Additional details (optional)"
                        />
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2 text-right">
                        <span className="text-sm font-medium text-gray-700">Subtotal: </span>
                        <span className="text-lg font-bold text-[#2f3192]">
                          GHS {(item.quantity * item.unit_price).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                placeholder="Any additional notes or special instructions..."
              />
            </div>

            {/* Total */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                <span className="text-2xl font-bold text-[#2f3192]">
                  GHS {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#2f3192] text-white rounded-lg hover:bg-[#1f2170] transition disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              "Create Bill"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
