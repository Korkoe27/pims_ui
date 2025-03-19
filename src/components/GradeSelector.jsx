import React, { useState } from "react";
import PropTypes from "prop-types";

/** ✅ GradeSelector Component */
const GradeSelector = ({ selectedGrade, onGradeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [grade, setGrade] = useState(selectedGrade || "");

  // ✅ Grade Options (Modify as Needed)
  const gradeOptions = [1, 2, 3, 4, 5];

  // ✅ Handles Updating the Grade
  const handleSave = () => {
    onGradeChange(grade);
    setIsOpen(false);
  };

  return (
    <div>
      {/* Button to Open the Modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 flex items-center space-x-1 hover:underline"
      >
        <span>Grade Symptom</span>
      </button>

      {/* Modal for Selecting Grade */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
            <h3 className="font-bold text-lg mb-3">Select Grade</h3>

            {/* Dropdown for Grade Selection */}
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select an option</option>
              {gradeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700"
            >
              Grade
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

GradeSelector.propTypes = {
  selectedGrade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onGradeChange: PropTypes.func.isRequired,
};

export default GradeSelector;
