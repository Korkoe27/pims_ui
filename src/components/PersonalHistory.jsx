import React, { useState } from "react";

const lastEyeExamOptions = [
  { value: "within_6_months", label: "Within the last 6 months" },
  { value: "6_to_12_months", label: "6 to 12 months ago" },
  { value: "1_to_2_years", label: "1 to 2 years ago" },
  { value: "more_than_2_years", label: "More than 2 years ago" },
  { value: "never", label: "Never had an eye exam" },
];

const PersonalHistory = () => {
  const [lastEyeExam, setLastEyeExam] = useState("");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Personal History</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Red */}
        <div className="bg-red-200 p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Left Column</h2>

          {/* Last Eye Exam Dropdown */}
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Last Eye Examination
            </label>
            <select
              value={lastEyeExam}
              onChange={(e) => setLastEyeExam(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">-- Select --</option>
              {lastEyeExamOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Column - Green */}
        <div className="bg-green-200 p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Right Column</h2>
          <p>This is the green column content.</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalHistory;
