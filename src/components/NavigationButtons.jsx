// components/NavigationButtons.jsx
import React from "react";

const NavigationButtons = ({
  backLabel = "← Back",
  backTo = "",
  onBack = () => {},
  onSave = () => {},
  saving = false,
  saveLabel = "Save and Proceed",
  hideBack = false, // 👈 new prop
  canEdit = true, // 👈 new prop for edit permissions
}) => {
  return (
    <div className="mt-8 flex justify-between items-center">
      {!hideBack ? (
        <button
          type="button"
          onClick={() => onBack(backTo)}
          className="px-6 py-2 font-semibold text-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-50"
        >
          {backLabel}
        </button>
      ) : (
        <div /> // empty placeholder to preserve layout spacing
      )}

      <button
        type="button"
        onClick={onSave}
        disabled={saving || !canEdit}
        className={`px-6 py-2 font-semibold text-white rounded-full transition-colors duration-200 ${
          saving || !canEdit
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
        title={
          !canEdit ? "Editing is not allowed in current consultation state" : ""
        }
      >
        {saving ? "Saving..." : saveLabel}
      </button>
    </div>
  );
};

export default NavigationButtons;
