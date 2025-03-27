// components/DeleteButton.jsx
import React from "react";

const DeleteButton = ({ onClick, title = "Delete", className = "" }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`text-red-600 hover:text-red-800 transition-colors duration-200 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zm3 4a1 1 0 011 1v10a1 1 0 01-2 0V8a1 1 0 011-1zm-4 1a1 1 0 012 0v10a1 1 0 01-2 0V8zm8 0a1 1 0 012 0v10a1 1 0 01-2 0V8z" />
      </svg>
    </button>
  );
};

export default DeleteButton;
