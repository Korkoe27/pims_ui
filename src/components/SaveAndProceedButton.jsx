import React from "react";

const SaveAndProceedButton = ({
  getPayload,
  saveFunction,
  isSaving,
  nextTab,
  setActiveTab,
  className = "",
  buttonText = "Save and Proceed",
  onError,
}) => {
  const handleClick = async () => {
    try {
      const payload = getPayload(); // Dynamically get payload
      await saveFunction(payload); // Call API
      setActiveTab(nextTab); // Move to next tab
    } catch (error) {
      console.error("❌ Error in SaveAndProceedButton:", error);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="flex justify-end pt-4">
      <button
        onClick={handleClick}
        disabled={isSaving}
        className={`px-6 py-2 rounded-md transition ${
          isSaving
            ? "bg-gray-400 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        } ${className}`}
      >
        {isSaving ? "Saving..." : buttonText}
      </button>
    </div>
  );
};

export default SaveAndProceedButton;
