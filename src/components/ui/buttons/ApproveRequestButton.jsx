import React from "react";
import { useSelector } from "react-redux";

/**
 * 🔹 ApproveRequestButton — used for approving requests.
 * Shows only if user has approval rights.
 */
const ApproveRequestButton = ({ onClick }) => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};

  if (!ApproveRequestButton.shouldShow(access)) return null;

  return (
    <button
      onClick={onClick}
      className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md text-sm font-semibold shadow transition"
    >
      Approve
    </button>
  );
};

ApproveRequestButton.shouldShow = (access) =>
  Boolean(access?.canApproveAbsentRequests);

export default ApproveRequestButton;
