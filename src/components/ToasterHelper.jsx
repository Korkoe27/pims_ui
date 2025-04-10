// toastHelper.js
import { toast } from "react-hot-toast";


/**
 * Show toast messages with customizable type and options.
 *
 * @param {string | JSX.Element} message - The message to display
 * @param {'error' | 'success' | 'loading' | 'custom'} type - Type of toast
 * @param {Object} options - Optional toast config overrides
 */

let isListenerAdded = false;

export const showToast = (message, type = "error", options = {}) => {
  toast.dismiss(); // Remove any existing toast before showing new one

  const config = {
    duration: 10000,
    position: "top-center",
    ...options,
  };

  switch (type) {
    case "success":
      toast.success(message, config);
      break;
    case "loading":
      toast.loading(message, config);
      break;
    case "custom":
      toast.custom(message, config);
      break;
    default:
      toast.error(message, config);
  }

  // Add dismiss listener once
  if (!isListenerAdded) {
    document.addEventListener("mousedown", () => toast.dismiss());
    document.addEventListener("keydown", () => toast.dismiss());
    isListenerAdded = true;
  }
};
