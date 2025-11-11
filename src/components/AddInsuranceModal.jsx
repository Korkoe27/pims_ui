import React, { useState } from "react";
import { 
  useCreateInsuranceMutation, 
  useGetInsuranceOptionsQuery 
} from "../redux/api/features/insuranceApi";
import { showToast } from "./ToasterHelper";

const AddInsuranceModal = ({ isOpen, onClose, patientId, onInsuranceAdded }) => {
  const [createInsurance, { isLoading }] = useCreateInsuranceMutation();
  const { data: insuranceOptions, isLoading: isLoadingOptions } = useGetInsuranceOptionsQuery();

  // Set default values based on loaded insurance options
  const defaultInsuranceType = insuranceOptions?.insurance_types?.[0]?.value || "";
  const defaultProvider = insuranceOptions?.insurance_providers?.find(
    p => p.insurance_type_id === defaultInsuranceType
  )?.value || "";

  const [formData, setFormData] = useState({
    insurance_type: defaultInsuranceType,
    insurance_provider: defaultProvider,
    insurance_number: "",
    is_active: true,
    is_primary: false,
    expiry_date: "",
  });

  const [errors, setErrors] = useState({});

  // Update formData when insurance options are loaded
  React.useEffect(() => {
    if (insuranceOptions && !formData.insurance_type) {
      const defaultType = insuranceOptions.insurance_types?.[0]?.value || "";
      const defaultProv = insuranceOptions.insurance_providers?.find(
        p => p.insurance_type_id === defaultType
      )?.value || "";
      
      setFormData(prev => ({
        ...prev,
        insurance_type: defaultType,
        insurance_provider: defaultProv,
      }));
    }
  }, [insuranceOptions, formData.insurance_type]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If insurance_type changes, reset insurance_provider to first matching provider
    if (name === "insurance_type") {
      const firstProvider = insuranceOptions?.insurance_providers?.find(
        p => p.insurance_type_id === value
      )?.value || "";
      
      setFormData((prev) => ({
        ...prev,
        insurance_type: value,
        insurance_provider: firstProvider,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const validationErrors = {};
    if (!formData.insurance_number.trim()) {
      validationErrors.insurance_number = "Insurance number is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      showToast("Adding insurance...", "info");
      const result = await createInsurance({
        patientId,
        insuranceData: formData,
      }).unwrap();

      showToast("✅ Insurance added successfully!", "success");
      
      // Reset form
      const defaultType = insuranceOptions?.insurance_types?.[0]?.value || "";
      const defaultProv = insuranceOptions?.insurance_providers?.find(
        p => p.insurance_type_id === defaultType
      )?.value || "";
      
      setFormData({
        insurance_type: defaultType,
        insurance_provider: defaultProv,
        insurance_number: "",
        is_active: true,
        is_primary: false,
        expiry_date: "",
      });
      setErrors({});

      // Notify parent and close
      if (onInsuranceAdded) {
        onInsuranceAdded(result);
      }
      onClose();
    } catch (error) {
      console.error("Error adding insurance:", error);
      const errorMessage =
        error.data?.insurance_number?.[0] ||
        error.data?.detail ||
        "Failed to add insurance";
      showToast(`❌ ${errorMessage}`, "error");
      if (error.data) {
        setErrors(error.data);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Insurance
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Insurance Type */}
          <div className="flex flex-col gap-2">
            <label htmlFor="insurance_type" className="font-medium text-sm">
              Insurance Type <span className="text-red-500">*</span>
            </label>
            <select
              name="insurance_type"
              id="insurance_type"
              value={formData.insurance_type}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isLoadingOptions}
            >
              {isLoadingOptions ? (
                <option>Loading...</option>
              ) : (
                insuranceOptions?.insurance_types?.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                )) || <option value="National">National</option>
              )}
            </select>
          </div>

          {/* Insurance Provider */}
          <div className="flex flex-col gap-2">
            <label htmlFor="insurance_provider" className="font-medium text-sm">
              Insurance Provider <span className="text-red-500">*</span>
            </label>
            <select
              name="insurance_provider"
              id="insurance_provider"
              value={formData.insurance_provider}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || isLoadingOptions}
            >
              {isLoadingOptions ? (
                <option>Loading...</option>
              ) : (
                insuranceOptions?.insurance_providers
                  ?.filter(provider => provider.insurance_type_id === formData.insurance_type)
                  ?.map((provider) => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  )) || <option value="NHIS">NHIS</option>
              )}
            </select>
          </div>

          {/* Insurance Number */}
          <div className="flex flex-col gap-2">
            <label htmlFor="insurance_number" className="font-medium text-sm">
              Insurance Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="insurance_number"
              id="insurance_number"
              value={formData.insurance_number}
              onChange={handleChange}
              placeholder="Enter insurance number"
              className={`p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.insurance_number ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.insurance_number && (
              <span className="text-red-500 text-sm">
                {errors.insurance_number}
              </span>
            )}
          </div>

          {/* Expiry Date */}
          <div className="flex flex-col gap-2">
            <label htmlFor="expiry_date" className="font-medium text-sm">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              name="expiry_date"
              id="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4"
                disabled={isLoading}
              />
              <span className="text-sm">Active</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_primary"
                checked={formData.is_primary}
                onChange={handleChange}
                className="w-4 h-4"
                disabled={isLoading}
              />
              <span className="text-sm">Primary Insurance</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#2f3192] text-white rounded-lg hover:bg-[#1f2170] transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Insurance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInsuranceModal;
