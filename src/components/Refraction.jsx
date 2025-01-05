import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useFetchRefractionQuery,
  useCreateRefractionMutation,
} from "../redux/api/features/consultationApi";

const Refraction = ({ appointmentId, onNavigateNext, onNavigatePrevious }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showErrorDialog, setShowErrorDialog] = useState(false); // Error dialog visibility
  const [errorMessage, setErrorMessage] = useState(""); // Error message content

  // Fetch refraction data
  const { data: fetchedRefraction, isLoading } = useFetchRefractionQuery(
    appointmentId,
    { skip: !appointmentId }
  );

  const [createRefraction] = useCreateRefractionMutation();

  // State for form data
  const [formData, setFormData] = useState({
    method_objective_refraction: "",
    objective_sph_od: "",
    objective_sph_os: "",
    subjective_cyl_od: "",
    subjective_cyl_os: "",
    subjective_axis_od: "",
    subjective_axis_os: "",
    subjective_va_od: "",
    subjective_va_os: "",
    subjective_add_od: "",
    subjective_add_os: "",
    cycloplegic_sph_od: "",
    cycloplegic_sph_os: "",
    cycloplegic_axis_od: "",
    cycloplegic_axis_os: "",
    phoria_amount: "",
    phoria_direction: "",
  });

  // Populate form data with fetched refraction data
  useEffect(() => {
    if (fetchedRefraction) {
      setFormData({
        method_objective_refraction:
          fetchedRefraction?.method_objective_refraction || "",
        objective_sph_od: fetchedRefraction?.objective_sph_od || "",
        objective_sph_os: fetchedRefraction?.objective_sph_os || "",
        subjective_cyl_od: fetchedRefraction?.subjective_cyl_od || "",
        subjective_cyl_os: fetchedRefraction?.subjective_cyl_os || "",
        subjective_axis_od: fetchedRefraction?.subjective_axis_od || "",
        subjective_axis_os: fetchedRefraction?.subjective_axis_os || "",
        subjective_va_od: fetchedRefraction?.subjective_va_od || "",
        subjective_va_os: fetchedRefraction?.subjective_va_os || "",
        subjective_add_od: fetchedRefraction?.subjective_add_od || "",
        subjective_add_os: fetchedRefraction?.subjective_add_os || "",
        cycloplegic_sph_od: fetchedRefraction?.cycloplegic_sph_od || "",
        cycloplegic_sph_os: fetchedRefraction?.cycloplegic_sph_os || "",
        cycloplegic_axis_od: fetchedRefraction?.cycloplegic_axis_od || "",
        cycloplegic_axis_os: fetchedRefraction?.cycloplegic_axis_os || "",
        phoria_amount: fetchedRefraction?.phoria_amount || "",
        phoria_direction: fetchedRefraction?.phoria_direction || "",
      });
    }
  }, [fetchedRefraction]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        appointment: appointmentId,
        created_by: user?.id,
      };
      await createRefraction(payload).unwrap(); // Call the mutation
      onNavigateNext(); // Move to the next tab
    } catch (error) {
      console.error("Error saving refraction data:", error);
      setErrorMessage(error?.data?.message || "An unknown error occurred."); // Set error message
      setShowErrorDialog(true); // Show error dialog
    }
  };

  if (isLoading) {
    return <p>Loading refraction data...</p>;
  }

  return (
    <>
      {/* Error Dialog */}
      {showErrorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
            <p className="mb-4">{errorMessage}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowErrorDialog(false)} // Close dialog
            >
              Close
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <h1 className="text-xl font-bold">Refraction</h1>

        {/* Objective Refraction */}
        <div>
          <label className="block font-medium">Objective Refraction Method:</label>
          <input
            type="text"
            name="method_objective_refraction"
            value={formData.method_objective_refraction}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Objective Results */}
        <div>
          <h2 className="font-bold">Objective Refraction Results</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="objective_sph_od"
              value={formData.objective_sph_od}
              onChange={handleChange}
              placeholder="SPH OD"
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="objective_sph_os"
              value={formData.objective_sph_os}
              onChange={handleChange}
              placeholder="SPH OS"
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Phoria Results */}
        <div>
          <h2 className="font-bold">Phoria Results</h2>
          <input
            type="text"
            name="phoria_amount"
            value={formData.phoria_amount}
            onChange={handleChange}
            placeholder="Amount"
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="phoria_direction"
            value={formData.phoria_direction}
            onChange={handleChange}
            placeholder="Direction"
            className="border p-2 rounded w-full mt-4"
          />
        </div>

        <div className="flex gap-8 justify-evenly my-16">
          <button
            type="button"
            onClick={onNavigatePrevious}
            className="w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-56 p-4 rounded-lg text-white bg-[#2f3192]"
          >
            Save and proceed
          </button>
        </div>
      </form>
    </>
  );
};

export default Refraction;
