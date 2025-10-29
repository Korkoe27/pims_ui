import React from "react";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import { useGetDashboardDataQuery } from "../redux/api/features/dashboardApi";
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewCaseButton from "../components/ui/buttons/ReviewCaseButton";

const PendingReviews = () => {
  const { data: dashboardData, isLoading, error } = useGetDashboardDataQuery();
  const { access } = useSelector((state) => state.auth);

  const pendingReviews =
    dashboardData?.appointments?.pending_reviews?.data || [];

  // ✅ Determine if the Action column should show
  const showActionColumn = ReviewCaseButton.shouldShow(access);

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
        <table className="w-full border border-gray-200 rounded-md overflow-hidden">
          <thead className="text-black uppercase text-left h-16 bg-[#f0f2f5]">
            <tr>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Patient ID</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3">Appointment Type</th>
              {showActionColumn && (
                <th className="px-3 py-3 text-center">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {pendingReviews.map((appointment) => (
              <tr key={appointment.id} className="bg-white border-b">
                <td className="px-3 py-3">{appointment.appointment_date}</td>
                <td className="px-3 py-3">{appointment.patient_id}</td>
                <td className="px-3 py-3">{appointment.patient_name}</td>
                <td className="px-3 py-3">
                  {appointment.appointment_type_name || "—"}
                </td>
                {showActionColumn && (
                  <td className="py-3 flex justify-center">
                    <ReviewCaseButton appointment={appointment} />
                  </td>
                )}
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
