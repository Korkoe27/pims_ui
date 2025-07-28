import React from "react";

const CaseManagementGuide = ({ appointmentId, setActiveTab, setTabCompletionStatus }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow">
      <h1 className="text-2xl font-bold text-[#101928] mb-4">Case Management Guide</h1>
      <p className="text-gray-700 text-base leading-relaxed">
        This is the Case Management Guide for the consultation process.
        Here, you can provide reference materials, protocols, or decision trees
        to assist students or staff in managing clinical cases effectively.
      </p>
    </div>
  );
};

export default CaseManagementGuide;
