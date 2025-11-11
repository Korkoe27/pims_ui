// pages/Pharmacy.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useGetAppointmentsQuery } from "../redux/api/features/appointmentsApi";
import { useGetManagementPlanQuery } from "../redux/api/features/managementApi";
import PageContainer from "../components/PageContainer";
import Card from "../components/ui/card";
import AddBillModal from "../components/AddBillModal";
import { FaEye, FaFileInvoiceDollar } from "react-icons/fa";

export default function Pharmacy() {
  const { pathname } = useLocation();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [page, setPage] = useState(1);

  // Fetch all appointments (we'll filter for completed ones)
  const { data: appointmentsData, isLoading } = useGetAppointmentsQuery({
    page,
    page_size: 10,
  });

  // Filter completed consultations
  const completedConsultations = appointmentsData?.results?.filter(
    (appointment) => appointment.status === "completed"
  ) || [];

  const handleAddBill = (appointment) => {
    setSelectedAppointment(appointment);
    setShowBillModal(true);
  };

  const handleCloseBillModal = () => {
    setShowBillModal(false);
    setSelectedAppointment(null);
  };

  if (pathname !== "/pharmacy") {
    return <Outlet />;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pharmacy</h1>
            <p className="text-gray-600 mt-1">
              View completed consultations and manage billing
            </p>
          </div>
        </div>

        {/* Completed Consultations List */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Completed Consultations
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f3192]"></div>
              </div>
            ) : completedConsultations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No completed consultations found
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedConsultations.map((appointment) => (
                  <ConsultationCard
                    key={appointment.id}
                    appointment={appointment}
                    onAddBill={handleAddBill}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {appointmentsData && appointmentsData.count > 10 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!appointmentsData.previous}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {page} of {Math.ceil(appointmentsData.count / 10)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!appointmentsData.next}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Add Bill Modal */}
      {showBillModal && selectedAppointment && (
        <AddBillModal
          appointment={selectedAppointment}
          onClose={handleCloseBillModal}
        />
      )}
    </PageContainer>
  );
}

// Consultation Card Component
function ConsultationCard({ appointment, onAddBill }) {
  const [showDetails, setShowDetails] = useState(false);

  // Fetch management plan for this appointment
  const { data: managementPlan, isLoading: loadingPlan } = useGetManagementPlanQuery(
    { appointmentId: appointment.id },
    { skip: !showDetails }
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {appointment.patient_name}
            </h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
              Completed
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Patient ID:</span> {appointment.patient_id}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Date:</span>{" "}
              {new Date(appointment.appointment_date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Type:</span> {appointment.appointment_type_name}
            </p>
            {appointment.completed_at && (
              <p className="text-gray-600">
                <span className="font-medium">Completed:</span>{" "}
                {new Date(appointment.completed_at).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
            title="View Details"
          >
            <FaEye /> {showDetails ? "Hide" : "View"}
          </button>
          <button
            onClick={() => onAddBill(appointment)}
            className="px-3 py-2 bg-[#2f3192] text-white rounded hover:bg-[#1f2170] transition flex items-center gap-2"
            title="Add Bill"
          >
            <FaFileInvoiceDollar /> Add Bill
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {loadingPlan ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2f3192]"></div>
            </div>
          ) : managementPlan ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Management Plan:</h4>
              
              {/* Medications */}
              {managementPlan.medications && managementPlan.medications.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700 mb-2">Medications:</p>
                  <div className="space-y-2">
                    {managementPlan.medications.map((med, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium">{med.medication_name || "N/A"}</p>
                        <p className="text-sm text-gray-600">
                          Dosage: {med.dosage || "N/A"} | Frequency: {med.frequency || "N/A"}
                        </p>
                        {med.duration && (
                          <p className="text-sm text-gray-600">Duration: {med.duration}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Instructions */}
              {managementPlan.other_instructions && (
                <div>
                  <p className="font-medium text-gray-700">Other Instructions:</p>
                  <p className="text-gray-600 text-sm">{managementPlan.other_instructions}</p>
                </div>
              )}

              {/* Follow-up */}
              {managementPlan.follow_up_date && (
                <div>
                  <p className="font-medium text-gray-700">Follow-up Date:</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(managementPlan.follow_up_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No management plan available</p>
          )}
        </div>
      )}
    </div>
  );
}
