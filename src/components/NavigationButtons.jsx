import React from "react";

const NavigationButtons = ({
  backLabel = "← Back",
  backTo = "",
  onBack = () => {},
  onSave = () => {},
  saving = false,
  saveLabel = "Save and Proceed",
}) => {
  return (
    <div className="mt-8 flex justify-between items-center">
      <button
        type="button"
        onClick={() => onBack(backTo)}
        className="px-6 py-2 font-semibold text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50"
      >
        {backLabel}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className={`px-6 py-2 font-semibold text-white rounded-full transition-colors duration-200 ${
          saving
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {saving ? "Saving..." : saveLabel}
      </button>
    </div>
  );
};

export default NavigationButtons;
