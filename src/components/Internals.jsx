import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useFetchInternalsQuery,
  useCreateInternalsMutation,
} from "../redux/api/features/consultationApi"; // Import hooks

const Internals = ({ appointmentId, onNavigateNext, onNavigatePrevious }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showErrorDialog, setShowErrorDialog] = useState(false); // Error dialog visibility
  const [errorMessage, setErrorMessage] = useState(""); // Error message content

  // Fetch internals data
  const { data: fetchedData, isLoading } = useFetchInternalsQuery(
    appointmentId,
    { skip: !appointmentId }
  );

  const [createInternals] = useCreateInternalsMutation(); // Initialize mutation

  // State for form data
  const [formData, setFormData] = useState({
    lensOd: "",
    lensOs: "",
    depositsOd: "",
    depositsOs: "",
    ptosisOd: "",
    ptosisOs: "",
    aphakiaOd: "",
    aphakiaOs: "",
    pseudophakiaOd: "",
    pseudophakiaOs: "",
    lensClearOd: "",
    lensClearOs: "",
    floatersOd: "",
    floatersOs: "",
    haemorrhagesOd: "",
    haemorrhagesOs: "",
    detachmentOd: "",
    detachmentOs: "",
    hazyOd: "",
    hazyOs: "",
    vitreousClearOd: "",
    vitreousClearOs: "",
    elschnigTypeOd: "",
    elschnigTypeOs: "",
    discColorOd: "",
    discColorOs: "",
    discMarginOd: "",
    discMarginOs: "",
    cupToDiscRatioOd: "",
    cupToDiscRatioOs: "",
    arteryToVeinRatioOd: "",
    arteryToVeinRatioOs: "",
    fovealReflexOd: "",
    fovealReflexOs: "",
    maculaScarOd: "",
    maculaScarOs: "",
    maculaHoleOd: "",
    maculaHoleOs: "",
    atrophyOd: "",
    atrophyOs: "",
    maculaHealthyOd: "",
    maculaHealthyOs: "",
    iopMeasuringMethod: "",
    iopDateTimeTaken: "",
    iopValueOd: "",
    iopValueOs: "",
  });

  // Sections for rendering
  const sections = [
    {
      name: "Lens",
      fields: [
        { label: "Deposits OD", name: "depositsOd" },
        { label: "Deposits OS", name: "depositsOs" },
        { label: "Ptosis OD", name: "ptosisOd" },
        { label: "Ptosis OS", name: "ptosisOs" },
        { label: "Aphakia OD", name: "aphakiaOd" },
        { label: "Aphakia OS", name: "aphakiaOs" },
        { label: "Pseudophakia OD", name: "pseudophakiaOd" },
        { label: "Pseudophakia OS", name: "pseudophakiaOs" },
        { label: "Lens Clear OD", name: "lensClearOd" },
        { label: "Lens Clear OS", name: "lensClearOs" },
      ],
    },
    {
      name: "Vitreous",
      fields: [
        { label: "Floaters OD", name: "floatersOd" },
        { label: "Floaters OS", name: "floatersOs" },
        { label: "Haemorrhages OD", name: "haemorrhagesOd" },
        { label: "Haemorrhages OS", name: "haemorrhagesOs" },
        { label: "Detachment OD", name: "detachmentOd" },
        { label: "Detachment OS", name: "detachmentOs" },
        { label: "Hazy OD", name: "hazyOd" },
        { label: "Hazy OS", name: "hazyOs" },
        { label: "Vitreous Clear OD", name: "vitreousClearOd" },
        { label: "Vitreous Clear OS", name: "vitreousClearOs" },
      ],
    },
    {
      name: "Ophthalmoscopy",
      fields: [
        { label: "Elschnig Type OD", name: "elschnigTypeOd" },
        { label: "Elschnig Type OS", name: "elschnigTypeOs" },
        { label: "Disc Color OD", name: "discColorOd" },
        { label: "Disc Color OS", name: "discColorOs" },
        { label: "Disc Margin OD", name: "discMarginOd" },
        { label: "Disc Margin OS", name: "discMarginOs" },
        { label: "Cup-to-Disc Ratio OD", name: "cupToDiscRatioOd" },
        { label: "Cup-to-Disc Ratio OS", name: "cupToDiscRatioOs" },
        { label: "Artery-to-Vein Ratio OD", name: "arteryToVeinRatioOd" },
        { label: "Artery-to-Vein Ratio OS", name: "arteryToVeinRatioOs" },
      ],
    },
    {
      name: "Macula",
      fields: [
        { label: "Foveal Reflex OD", name: "fovealReflexOd" },
        { label: "Foveal Reflex OS", name: "fovealReflexOs" },
        { label: "Macula Scar OD", name: "maculaScarOd" },
        { label: "Macula Scar OS", name: "maculaScarOs" },
        { label: "Macula Hole OD", name: "maculaHoleOd" },
        { label: "Macula Hole OS", name: "maculaHoleOs" },
        { label: "Atrophy OD", name: "atrophyOd" },
        { label: "Atrophy OS", name: "atrophyOs" },
        { label: "Macula Healthy OD", name: "maculaHealthyOd" },
        { label: "Macula Healthy OS", name: "maculaHealthyOs" },
      ],
    },
    {
      name: "IOP",
      fields: [
        { label: "Measuring Method", name: "iopMeasuringMethod" },
        { label: "Date & Time Taken", name: "iopDateTimeTaken" },
        { label: "IOP Value OD", name: "iopValueOd" },
        { label: "IOP Value OS", name: "iopValueOs" },
      ],
    },
  ];

  // Prepopulate form data when fetchedData is available
  useEffect(() => {
    if (fetchedData) {
      setFormData((prev) => ({
        ...prev,
        ...fetchedData,
      }));
    }
  }, [fetchedData]);

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
      await createInternals(payload).unwrap(); // Call the mutation
      onNavigateNext(); // Move to the next tab
    } catch (error) {
      console.error("Error saving internals data:", error);
      setErrorMessage(error?.data?.message || "An unknown error occurred."); // Set error message
      setShowErrorDialog(true); // Show error dialog
    }
  };

  if (isLoading) {
    return <p>Loading internals data...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      {/* Render fields for Lens, Vitreous, Ophthalmoscopy, Macula, IOP */}
      {sections.map((section) => (
        <div key={section.name} className="bg-white shadow p-4 rounded">
          <h2 className="font-bold text-lg">{section.name}</h2>
          {section.fields.map((field) => (
            <div key={field.name} className="flex gap-4 items-center">
              <label className="w-1/3">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-2/3 p-2 border border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      ))}
      <div className="flex gap-8 justify-evenly my-16">
        <button
          type="button"
          onClick={onNavigatePrevious}
          className="w-56 p-4 rounded-lg text-[#2f3192] border border-[#2f3192]">
          Back
        </button>
        <button
          type="submit"
          className="w-56 p-4 rounded-lg text-white bg-[#2f3192]"
        >
          Save and Proceed
        </button>
      </div>
    </form>
  );
};

export default Internals;

