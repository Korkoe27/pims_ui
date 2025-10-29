import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 MakeAbsentRequestButton — opens the create request modal.
 * Checks backend-provided access before rendering.
 */
const MakeAbsentRequestButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  if (!MakeAbsentRequestButton.shouldShow(access)) return null;

  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Make Request
    </button>
  );
};

MakeAbsentRequestButton.shouldShow = (access) =>
  Boolean(access?.canCreateAbsentRequest);

export default MakeAbsentRequestButton;
