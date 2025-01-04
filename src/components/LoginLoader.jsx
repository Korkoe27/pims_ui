/**
 * LoginLoader Component
 *
 * Displays a spinning hourglass animation with a "Please wait..." inscription.
 * Used during authentication or loading states.
 */
import React from "react";

const LoginLoader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#f9fafb]">
      <div className="hourglass-loader"></div>
      <p className="mt-4 text-lg text-gray-700 font-medium">Please wait...</p>
      <style>{`
        .hourglass-loader {
          width: 40px;
          height: 40px;
          border: 4px solid transparent;
          border-top: 4px solid #007bff;
          border-bottom: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1.5s linear infinite, hourglass 1.5s ease-in-out infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes hourglass {
          0%, 100% {
            clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
          }
          50% {
            clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginLoader;
