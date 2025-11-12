import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import Card from "../components/ui/card";

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // TODO: Replace with actual API calls
  const appointments = [
    {
      date: "2025-03-11",
      patient: "Alan Mccray",
      patientId: "OST/002/25",
      clinic: "General",
      status: "In Progress",
      semester: "Semester 1",
      appointmentId: "apt-001",
    },
    {
      date: "2025-05-12",
      patient: "Grace Mensah",
      patientId: "OST/003/25",
      clinic: "Low Vision",
      status: "Completed",
      semester: "Semester 1",
      appointmentId: "apt-002",
    },
    {
      date: "2025-09-08",
      patient: "John Doe",
      patientId: "OST/004/25",
      clinic: "Pediatric",
      status: "Submitted",
      semester: "Semester 2",
      appointmentId: "apt-003",
      reviewed: true,
      reviewedBy: "Dr. Kwame Asante",
      reviewDate: "2025-09-10",
      changes: [
        { section: "Case History", field: "Chief Complaint", original: "Blurry vision", reviewed: "Blurry vision (distance only)" },
        { section: "Visual Acuity", field: "OD Unaided", original: "6/12", reviewed: "6/18" },
        { section: "Management", field: "Prescription OD SPH", original: "-2.00", reviewed: "-2.25" },
      ]
    },
    {
      date: "2025-10-10",
      patient: "Jane Smith",
      patientId: "OST/005/25",
      clinic: "Contact Lens",
      status: "Completed",
      semester: "Semester 2",
      appointmentId: "apt-004",
      reviewed: false,
    },
  ];

  const grades = [
    {
      date: "2025-03-12",
      patient: "Grace Mensah",
      type: "Reviewed",
      score: 88,
      grade: "A",
      feedback: "Excellent case handling.",
      semester: "Semester 1",
    },
    {
      date: "2025-04-20",
      patient: "Alan Mccray",
      type: "Reviewed",
      score: 79,
      grade: "B+",
      feedback: "Good understanding, improve documentation.",
      semester: "Semester 1",
    },
    {
      date: "2025-09-15",
      patient: "John Doe",
      type: "Reviewed",
      score: 72,
      grade: "B",
      feedback: "Good but needs detail in refraction notes.",
      semester: "Semester 2",
    },
    {
      date: "2025-10-02",
      patient: "Jane Smith",
      type: "Reviewed",
      score: 91,
      grade: "A",
      feedback: "Excellent work, thorough and clear.",
      semester: "Semester 2",
    },
  ];

  // Filter appointments by semester AND date range
  const filteredAppointments = appointments.filter((a) => {
    const matchesSemester = a.semester === semester;
    const appointmentDate = new Date(a.date);
    
    const matchesStartDate = startDate ? appointmentDate >= new Date(startDate) : true;
    const matchesEndDate = endDate ? appointmentDate <= new Date(endDate) : true;
    
    return matchesSemester && matchesStartDate && matchesEndDate;
  });
  
  const filteredGrades = grades.filter((g) => g.semester === semester);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Submitted":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getGradeColor = (score) => {
    if (score >= 80) return "text-green-600 font-semibold";
    if (score >= 70) return "text-blue-600 font-semibold";
    if (score >= 60) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const handleViewAppointment = (appointment) => {
    if (appointment.status === "In Progress") {
      navigate(`/consultation/${appointment.appointmentId}`);
    } else {
      // Navigate to read-only view
      navigate(`/consultation/${appointment.appointmentId}?view=readonly`);
    }
  };

  const handleViewChanges = (appointment) => {
    setSelectedAppointment(appointment);
    setShowChangesModal(true);
  };

  const clearDateFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <svg
            className="w-8 h-8 text-[#2f3192]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
            />
          </svg>
          Student Portal
        </h1>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        >
          <option value="Semester 1">Semester 1</option>
          <option value="Semester 2">Semester 2</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("appointments")}
              className={`pb-3 px-1 font-medium text-sm transition-colors ${
                activeTab === "appointments"
                  ? "border-b-2 border-[#2f3192] text-[#2f3192]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                My Appointments
              </span>
            </button>
            <button
              onClick={() => setActiveTab("grades")}
              className={`pb-3 px-1 font-medium text-sm transition-colors ${
                activeTab === "grades"
                  ? "border-b-2 border-[#2f3192] text-[#2f3192]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                My Grades
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                My Appointments — {semester}
              </h2>
              <p className="text-sm text-gray-500">
                Showing {filteredAppointments.length} record(s)
              </p>
            </div>

            {/* Date Filter */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    From:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    To:
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                  />
                </div>
                {(startDate || endDate) && (
                  <button
                    onClick={clearDateFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Patient ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Clinic Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-700">
                          {appointment.date}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {appointment.patient}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {appointment.patientId}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {appointment.clinic}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold w-fit ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status}
                            </span>
                            {appointment.reviewed && (
                              <span className="text-xs text-purple-600 font-medium">
                                ✓ Reviewed
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleViewAppointment(appointment)}
                              className="px-4 py-2 text-sm font-medium text-[#2f3192] border border-[#2f3192] rounded-lg hover:bg-[#2f3192] hover:text-white transition-colors"
                            >
                              {appointment.status === "In Progress"
                                ? "Continue"
                                : "View"}
                            </button>
                            {appointment.reviewed && (
                              <button
                                onClick={() => handleViewChanges(appointment)}
                                className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
                              >
                                View Changes
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 px-4 text-center text-gray-500"
                      >
                        No appointments found for {semester}
                        {(startDate || endDate) && " with selected date range"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Grades Tab */}
      {activeTab === "grades" && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                My Grades — {semester}
              </h2>
              <p className="text-sm text-gray-500">
                Showing {filteredGrades.length} record(s)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Score (%)
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Grade
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Feedback
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.length > 0 ? (
                    filteredGrades.map((grade, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-700">
                          {grade.date}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {grade.patient}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {grade.type}
                        </td>
                        <td className="py-3 px-4">
                          <span className={getGradeColor(grade.score)}>
                            {grade.score}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={getGradeColor(grade.score)}>
                            {grade.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {grade.feedback}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 px-4 text-center text-gray-500"
                      >
                        No grades found for {semester}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Changes Modal */}
      {showChangesModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Review Changes</h3>
                <p className="text-sm opacity-90">
                  {selectedAppointment.patient} - {selectedAppointment.date}
                </p>
              </div>
              <button
                onClick={() => setShowChangesModal(false)}
                className="text-white hover:bg-purple-700 rounded-full p-2 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Reviewer Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-medium text-blue-900">
                    Reviewed by: {selectedAppointment.reviewedBy}
                  </span>
                  <span className="text-blue-700">•</span>
                  <span className="text-blue-700">
                    {selectedAppointment.reviewDate}
                  </span>
                </div>
              </div>

              {/* Changes List */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-lg mb-4">
                  Changes Made ({selectedAppointment.changes?.length || 0})
                </h4>

                {selectedAppointment.changes && selectedAppointment.changes.length > 0 ? (
                  selectedAppointment.changes.map((change, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Section Badge */}
                      <div className="mb-3">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          {change.section}
                        </span>
                      </div>

                      {/* Field Name */}
                      <h5 className="font-medium text-gray-900 mb-3">
                        {change.field}
                      </h5>

                      {/* Comparison */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Original Value */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span className="text-xs font-semibold text-red-700 uppercase">
                              Your Original
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 font-mono">
                            {change.original}
                          </p>
                        </div>

                        {/* Reviewed Value */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-xs font-semibold text-green-700 uppercase">
                              Corrected To
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 font-mono">
                            {change.reviewed}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No changes were made during review.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => setShowChangesModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowChangesModal(false);
                  handleViewAppointment(selectedAppointment);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Full Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default StudentPortal;
