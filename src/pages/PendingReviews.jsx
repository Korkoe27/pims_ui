import React from "react";
import PageContainer from "../components/PageContainer";
import { useGetDashboardDataQuery } from "../redux/api/features/dashboardApi";
import LoadingSpinner from "../components/LoadingSpinner";
import CanAccess from "../components/auth/CanAccess";
import { ROLES } from "../constants/roles";
import useHandleConsult from "../hooks/useHandleConsult";

const PendingReviews = () => {
  const { data: dashboardData, isLoading, error } = useGetDashboardDataQuery();
  const { handleConsult } = useHandleConsult();

  const pendingReviews = dashboardData?.pending_reviews?.data || [];

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-4">Pending Reviews</h1>
      <p className="mb-6">Here are all cases pending review and approval.</p>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <p className="text-red-500">Failed to load pending reviews.</p>
      ) : pendingReviews.length > 0 ? (
        <table className="w-full">
          <thead className="text-black uppercase text-left h-16 bg-[#f0f2f5]">
            <tr>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Patient’s ID</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Appointment Type</th>
              <CanAccess allowedRoles={[ROLES.LECTURER]}>
                <th className="px-3 py-3 text-center">Action</th>
              </CanAccess>
            </tr>
          </thead>
          <tbody>
            {pendingReviews.map((appointment) => (
              <tr key={appointment.id} className="bg-white border-b">
                <td className="px-3 py-3">{appointment.appointment_date}</td>
                <td className="px-3 py-3">{appointment.patient_id}</td>
                <td className="px-3 py-3">{appointment.patient_name}</td>
                <td className="px-3 py-3">{appointment.appointment_type}</td>
                <CanAccess allowedRoles={[ROLES.LECTURER]}>
                  <td className="py-3 flex justify-center">
                    <button
                      className="text-white bg-[#2f3192] px-4 py-2 rounded-lg"
                      onClick={() => handleConsult(appointment)}
                    >
                      Review Case
                    </button>
                  </td>
                </CanAccess>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center">
          No pending reviews available.
        </p>
      )}
    </PageContainer>
  );
};

export default PendingReviews;
