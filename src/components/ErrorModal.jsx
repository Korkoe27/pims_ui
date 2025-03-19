import React from "react";

const ErrorModal = ({ message, onClose }) => {
  // Function to extract and format error messages
  const formatErrorMessage = (errorObj) => {
    if (!errorObj || typeof errorObj !== "object") return "An unknown error occurred.";

    let messages = [];

    Object.keys(errorObj).forEach((key) => {
      const value = errorObj[key];

      if (Array.isArray(value)) {
        // Handle array of messages (e.g., condition_details errors)
        value.forEach((item, index) => {
          if (typeof item === "object") {
            Object.keys(item).forEach((subKey) => {
              messages.push(
                <div key={`${key}-${index}-${subKey}`} className="mb-2">
                  <strong className="text-gray-800">
                    {key.replace("_", " ")} {index + 1} - {subKey.replace("_", " ")}:
                  </strong>{" "}
                  {item[subKey].join(", ")}
                </div>
              );
            });
          } else {
            messages.push(
              <div key={`${key}-${index}`} className="mb-2">
                <strong className="text-gray-800">{key.replace("_", " ")}:</strong>{" "}
                {item}
              </div>
            );
          }
        });
      } else if (typeof value === "object") {
        // Recursively process nested error objects
        messages.push(formatErrorMessage(value));
      } else {
        // Handle simple key-value pairs
        messages.push(
          <div key={key} className="mb-2">
            <strong className="text-gray-800">{key.replace("_", " ")}:</strong> {value}
          </div>
        );
      }
    });

    return messages;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <div className="mt-2 text-gray-700">{formatErrorMessage(message)}</div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
