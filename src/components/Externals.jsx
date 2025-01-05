import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useFetchExternalsQuery,
  useCreateExternalsMutation,
} from "../redux/api/features/consultationApi";

const Externals = ({ appointmentId, onNavigateNext, onNavigatePrevious }) => {
  const { user } = useSelector((state) => state.auth);
  const [showErrorDialog, setShowErrorDialog] = useState(false); // Error dialog visibility
  const [errorMessage, setErrorMessage] = useState(""); // Error message content

  // Fetch externals data
  const { data: fetchedData, isLoading } = useFetchExternalsQuery(
    appointmentId,
    { skip: !appointmentId }
  );

  const [createExternals] = useCreateExternalsMutation(); // Initialize mutation

  // State for form data
  const [formData, setFormData] = useState({
    swellingOd: false,
    swellingOs: false,
    warmToTouchOd: false,
    warmToTouchOs: false,
    ptosisOd: false,
    ptosisOs: false,
    hyperemiaOd: false,
    hyperemiaOs: false,
    dischargeOd: false,
    dischargeOs: false,
    epiphoraOd: false,
    epiphoraOs: false,
    abrasionsOd: false,
    abrasionsOs: false,
    scarringOd: false,
    scarringOs: false,
    ulcerOd: false,
    ulcerOs: false,
    roundOd: false,
    roundOs: false,
    reactiveToLightOd: false,
    reactiveToLightOs: false,
    equalSizeOd: false,
    equalSizeOs: false,
    cellsFlaresOd: false,
    cellsFlaresOs: false,
    hyphaemaOd: false,
    hyphaemaOs: false,
    keraticPrecipitatesOd: false,
    keraticPrecipitatesOs: false,
  });

  // Prepopulate form data when fetchedData is available
  useEffect(() => {
    if (fetchedData) {
      setFormData({
        swellingOd: fetchedData?.swelling_od || false,
        swellingOs: fetchedData?.swelling_os || false,
        warmToTouchOd: fetchedData?.warm_to_touch_od || false,
        warmToTouchOs: fetchedData?.warm_to_touch_os || false,
        ptosisOd: fetchedData?.ptosis_od || false,
        ptosisOs: fetchedData?.ptosis_os || false,
        hyperemiaOd: fetchedData?.hyperemia_od || false,
        hyperemiaOs: fetchedData?.hyperemia_os || false,
        dischargeOd: fetchedData?.discharge_od || false,
        dischargeOs: fetchedData?.discharge_os || false,
        epiphoraOd: fetchedData?.epiphora_od || false,
        epiphoraOs: fetchedData?.epiphora_os || false,
        abrasionsOd: fetchedData?.abrasions_od || false,
        abrasionsOs: fetchedData?.abrasions_os || false,
        scarringOd: fetchedData?.scarring_od || false,
        scarringOs: fetchedData?.scarring_os || false,
        ulcerOd: fetchedData?.ulcer_od || false,
        ulcerOs: fetchedData?.ulcer_os || false,
        roundOd: fetchedData?.round_od || true,
        roundOs: fetchedData?.round_os || true,
        reactiveToLightOd: fetchedData?.reactive_to_light_od || true,
        reactiveToLightOs: fetchedData?.reactive_to_light_os || true,
        equalSizeOd: fetchedData?.equal_size_od || true,
        equalSizeOs: fetchedData?.equal_size_os || true,
        cellsFlaresOd: fetchedData?.cells_flares_od || false,
        cellsFlaresOs: fetchedData?.cells_flares_os || false,
        hyphaemaOd: fetchedData?.hyphaema_od || false,
        hyphaemaOs: fetchedData?.hyphaema_os || false,
        keraticPrecipitatesOd: fetchedData?.keratic_precipitates_od || false,
        keraticPrecipitatesOs: fetchedData?.keratic_precipitates_os || false,
      });
    }
  }, [fetchedData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : e.target.value,
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
      await createExternals(payload).unwrap(); // Call the mutation
      onNavigateNext(); // Move to the next tab
    } catch (error) {
      console.error("Error saving externals data:", error);
      setErrorMessage(error?.data?.message || "An unknown error occurred."); // Set error message
      setShowErrorDialog(true); // Show error dialog
    }
  };

  if (isLoading) {
    return <p>Loading externals data...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-4">Externals Examination</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <label htmlFor={key} className="capitalize font-medium">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="checkbox"
                id={key}
                name={key}
                checked={value}
                onChange={handleChange}
                className="w-6 h-6"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onNavigatePrevious}
          className="px-6 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-100"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Save and proceed
        </button>
      </div>
    </form>
  );
};

export default Externals;
