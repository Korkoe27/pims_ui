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
    page_size: 50, // Increase to see more appointments
  });

  // Filter completed consultations
  const completedConsultations = appointmentsData?.results?.filter(
    (appointment) => {
      return appointment.status === "Consultation Completed";
    }
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
              
              {/* Refractive Correction */}
              {managementPlan.refractive_correction && (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-medium text-gray-700 mb-2">Refractive Correction:</p>
                  <p className="text-sm text-gray-600">
                    Type: {managementPlan.type_of_refractive_correction || "N/A"}
                  </p>
                  {managementPlan.type_of_lens && (
                    <p className="text-sm text-gray-600">Lens Type: {managementPlan.type_of_lens}</p>
                  )}
                  {managementPlan.pd && (
                    <p className="text-sm text-gray-600">PD: {managementPlan.pd}</p>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {managementPlan.od_sph && (
                      <div className="text-xs">
                        <span className="font-medium">OD:</span> SPH {managementPlan.od_sph}
                        {managementPlan.od_cyl && ` CYL ${managementPlan.od_cyl}`}
                        {managementPlan.od_axis && ` AXIS ${managementPlan.od_axis}`}
                        {managementPlan.od_add && ` ADD ${managementPlan.od_add}`}
                      </div>
                    )}
                    {managementPlan.os_sph && (
                      <div className="text-xs">
                        <span className="font-medium">OS:</span> SPH {managementPlan.os_sph}
                        {managementPlan.os_cyl && ` CYL ${managementPlan.os_cyl}`}
                        {managementPlan.os_axis && ` AXIS ${managementPlan.os_axis}`}
                        {managementPlan.os_add && ` ADD ${managementPlan.os_add}`}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Medications */}
              {managementPlan.medications && managementPlan.medication_instructions && 
               managementPlan.medication_instructions.length > 0 && (
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-medium text-gray-700 mb-2">Medications:</p>
                  <div className="space-y-2">
                    {managementPlan.medication_instructions.map((med, idx) => (
                      <div key={idx} className="bg-white p-2 rounded border border-green-200">
                        <p className="font-medium text-sm">{med.medication_name || "N/A"}</p>
                        <p className="text-xs text-gray-600">
                          Eye: {med.medication_eye || "N/A"} | Dosage: {med.medication_dosage || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Counselling */}
              {managementPlan.counselling && managementPlan.counselling_details && (
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="font-medium text-gray-700 mb-1">Counselling:</p>
                  <p className="text-sm text-gray-600">{managementPlan.counselling_details}</p>
                </div>
              )}

              {/* Low Vision Aid */}
              {managementPlan.low_vision_aid && managementPlan.low_vision_aid_details && (
                <div className="bg-purple-50 p-3 rounded">
                  <p className="font-medium text-gray-700 mb-1">Low Vision Aid:</p>
                  <p className="text-sm text-gray-600">{managementPlan.low_vision_aid_details}</p>
                </div>
              )}

              {/* Therapy */}
              {managementPlan.therapy && managementPlan.therapy_details && (
                <div className="bg-pink-50 p-3 rounded">
                  <p className="font-medium text-gray-700 mb-1">Therapy:</p>
                  <p className="text-sm text-gray-600">{managementPlan.therapy_details}</p>
                </div>
              )}

              {/* Surgery */}
              {managementPlan.surgery && managementPlan.surgery_details && (
                <div className="bg-red-50 p-3 rounded">
                  <p className="font-medium text-gray-700 mb-1">Surgery:</p>
                  <p className="text-sm text-gray-600">{managementPlan.surgery_details}</p>
                </div>
              )}

              {/* Referral */}
              {managementPlan.referral && managementPlan.referral_details && (
                <div className="bg-orange-50 p-3 rounded">
                  <p className="font-medium text-gray-700 mb-1">Referral:</p>
                  <p className="text-sm text-gray-600">{managementPlan.referral_details}</p>
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
