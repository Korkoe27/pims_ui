import React from "react";

const ConsultButton = ({ onClick, children = "Consult", className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 ${className}`}
    >
      {children}
    </button>
  );
};

export default ConsultButton;
