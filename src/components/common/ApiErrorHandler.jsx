import React from "react";

/**
 * Enhanced error handling component that matches the documented API error formats
 */
const ApiErrorHandler = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  // Parse API error response based on documented formats
  const getErrorDetails = (error) => {
    // Network errors
    if (!error.status) {
      return {
        title: "Connection Error",
        message:
          "Unable to connect to the server. Please check your internet connection.",
        type: "network",
        canRetry: true,
      };
    }

    // HTTP status code based errors (from API documentation)
    const statusCode = error.status;
    const errorData = error.data || {};

    switch (statusCode) {
      case 400:
        return {
          title: "Invalid Request",
          message:
            errorData.detail ||
            errorData.message ||
            "The request contains invalid data.",
          type: "validation",
          canRetry: false,
          fields: errorData.errors, // Field-specific validation errors
        };

      case 401:
        return {
          title: "Authentication Required",
          message: "Please log in to continue.",
          type: "auth",
          canRetry: false,
        };

      case 403:
        return {
          title: "Permission Denied",
          message:
            errorData.detail ||
            "You don't have permission to perform this action.",
          type: "permission",
          canRetry: false,
        };

      case 404:
        return {
          title: "Not Found",
          message: errorData.detail || "The requested resource was not found.",
          type: "notfound",
          canRetry: false,
        };

      case 409:
        return {
          title: "Conflict",
          message:
            errorData.detail ||
            errorData.message ||
            "This action conflicts with the current state.",
          type: "conflict",
          canRetry: false,
        };

      case 422:
        return {
          title: "Validation Error",
          message: "Please check your input and try again.",
          type: "validation",
          canRetry: false,
          fields: errorData.errors,
        };

      case 500:
        return {
          title: "Server Error",
          message: "An unexpected error occurred. Please try again later.",
          type: "server",
          canRetry: true,
        };

      default:
        return {
          title: "Unexpected Error",
          message:
            errorData.detail ||
            errorData.message ||
            "An unexpected error occurred.",
          type: "unknown",
          canRetry: true,
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  const getErrorColor = (type) => {
    switch (type) {
      case "validation":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "permission":
        return "border-orange-200 bg-orange-50 text-orange-800";
      case "auth":
        return "border-blue-200 bg-blue-50 text-blue-800";
      case "network":
        return "border-purple-200 bg-purple-50 text-purple-800";
      case "server":
        return "border-red-200 bg-red-50 text-red-800";
      default:
        return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  return (
    <div
      className={`mb-4 p-4 border rounded-md ${getErrorColor(
        errorDetails.type
      )}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{errorDetails.title}</h4>
          <p className="text-sm mb-2">{errorDetails.message}</p>

          {/* Field-specific validation errors */}
          {errorDetails.fields && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">Validation Errors:</p>
              <ul className="text-xs space-y-1">
                {Object.entries(errorDetails.fields).map(
                  ([field, fieldErrors]) => (
                    <li key={field}>
                      <span className="font-medium">{field}:</span>{" "}
                      {Array.isArray(fieldErrors)
                        ? fieldErrors.join(", ")
                        : fieldErrors}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          {errorDetails.canRetry && onRetry && (
            <button
              onClick={onRetry}
              className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
            >
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiErrorHandler;
