import React from "react";
import useExtraTestsData from "../hooks/useExtraTestsData";

// ✅ Safe formatter with fallback
const formatTestTitle = (name) => {
  if (typeof name !== "string") return "Untitled Test";
  const words = name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toUpperCase();
  return words;
};

const ExtraTestsView = ({ appointmentId }) => {
  const {
    extraTests,
    loadingExtraTests: isLoading,
    fetchError: error,
  } = useExtraTestsData(appointmentId);

  if (isLoading) return <p className="text-gray-500">Loading extra tests...</p>;

  if (error || !extraTests?.length)
    return <p className="text-red-500">No extra tests found.</p>;

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-[#2f3192]">Extra Tests</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {extraTests.map((test, index) => (
          <div
            key={index}
            className="border rounded p-4 shadow-sm space-y-2 bg-gray-50"
          >
            <h3 className="text-base font-semibold">
              {formatTestTitle(test?.name || test?.test_name || "")}
            </h3>

            {test.notes && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Notes:</span> {test.notes}
              </p>
            )}

            {test.file && (
              <a
                href={test.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-indigo-600 hover:underline"
              >
                View File
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraTestsView;
