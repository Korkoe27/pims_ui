import React, { useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import useHandleConsult from "../hooks/useHandleConsult";
import PageContainer from "../components/PageContainer";
import CanAccess from "../components/auth/CanAccess";
import { useGetTodaysAppointmentsQuery } from "../redux/api/features/appointmentsApi";
import ConsultButton from "../components/ui/buttons/ConsultButton";
import { canShowConsultButton } from "../utils/canShowConsultButton";

const SpecialAppointments = () => {
  const { user } = useSelector((state) => state.auth || {});
  const access = user?.access || {};

  const { handleConsult } = useHandleConsult();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useGetTodaysAppointmentsQuery();
  const appointments = data?.data || [];

  // ✅ Sort by status for consistent display
  const sortedAppointments = [...appointments].sort((a, b) => {
    const statusOrder = { Scheduled: 1, Completed: 2, Cancelled: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // ✅ Pagination logic
  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(sortedAppointments.length / pageSize);

  const handlePageChange = (page) => setCurrentPage(page);

  // ✅ Determine if any row has a consult action available
  const hasAnyConsultAction = paginatedAppointments.some((appt) =>
    canShowConsultButton(appt, access)
  );

  return (
    <PageContainer>
      {isLoading && <LoadingSpinner />}

      <h1 className="font-extrabold text-xl mb-4">Special Appointments</h1>

      {/* Error message */}
      {error && (
        <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <span className="font-semibold">Error:</span>{" "}
          {error?.data?.message ||
            error?.message ||
            "Failed to load appointments. Please try again."}
        </p>
      )}

      {!isLoading && paginatedAppointments?.length > 0 ? (
        <>
          <table className="w-full text-base text-left text-gray-500 border-collapse">
            <thead className="text-base text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Patient ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>

                {hasAnyConsultAction && (
                  <CanAccess accessKeys={["canStartConsultation"]}>
                    <th className="px-6 py-3 min-w-40">Action</th>
                  </CanAccess>
                )}
              </tr>
            </thead>

            <tbody>
              {paginatedAppointments.map((appointment) => (
                <tr key={appointment.id} className="bg-white border-b">
                  <td className="px-6 py-4">{appointment?.appointment_date}</td>
                  <td className="px-6 py-4">{appointment?.patient_id}</td>
                  <td className="px-6 py-4">{appointment?.patient_name}</td>
                  <td className="px-6 py-4">{appointment?.appointment_type_name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 rounded-full text-white font-medium ${getStatusColor(
                        appointment?.status
                      )}`}
                    >
                      {appointment?.status}
                    </span>
                  </td>

                  {hasAnyConsultAction && (
                    <td className="px-6 py-4">
                      <CanAccess accessKeys={["canStartConsultation"]}>
                        <ConsultButton
                          appointment={appointment}
                          access={access}
                          onClick={handleConsult}
                        />
                      </CanAccess>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        !isLoading && (
          <p className="text-gray-500 text-center py-8">
            No appointments available.
          </p>
        )
      )}
    </PageContainer>
  );
};

export default SpecialAppointments;

/* ✅ Utility function for status color */
const getStatusColor = (status) => {
  switch (status) {
    case "Consultation Completed":
    case "Completed":
      return "bg-green-600";
    case "Cancelled":
      return "bg-red-600";
    default:
      return "bg-yellow-500";
  }
};
