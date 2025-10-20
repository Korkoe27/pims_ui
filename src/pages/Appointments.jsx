import React, { useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import useHandleConsult from "../hooks/useHandleConsult";
import PageContainer from "../components/PageContainer";
import { useGetTodaysAppointmentsQuery } from "../redux/api/features/appointmentsApi";
import ConsultButton from "../components/ui/buttons/ConsultButton";

/**
 * 🔹 Appointments — Displays today's appointments
 *    and allows consultation/review actions.
 */
const Appointments = () => {
  const { user } = useSelector((state) => state.auth);
  const access = user?.access || {};
  const { handleConsult } = useHandleConsult();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ✅ Fetch today's appointments
  const { data, isLoading, error } = useGetTodaysAppointmentsQuery();
  const appointments = data?.data || [];

  // ✅ Sort by status (Scheduled → Completed → Cancelled)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const statusOrder = { Scheduled: 1, Completed: 2, Cancelled: 3 };
    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
  });

  // ✅ Paginate
  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(sortedAppointments.length / pageSize);

  // ✅ Change page
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <PageContainer>
      {isLoading && <LoadingSpinner />}

      <h1 className="font-extrabold text-xl mb-4">Today's Appointments</h1>

      {/* ⚠️ Error Display */}
      {error && (
        <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <span className="font-semibold">Error:</span>{" "}
          {error?.data?.message ||
            error?.message ||
            "Failed to load appointments. Please try again."}
        </p>
      )}

      {/* ✅ Table Display */}
      {!isLoading && paginatedAppointments.length > 0 ? (
        <>
          <table className="w-full text-base text-left text-gray-500">
            <thead className="text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Patient ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-3 min-w-40 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedAppointments.map((appointment) => (
                <tr key={appointment.id} className="bg-white border-b">
                  <td className="px-6 py-4">{appointment?.appointment_date}</td>
                  <td className="px-6 py-4">{appointment?.patient_id}</td>
                  <td className="px-6 py-4">{appointment?.patient_name}</td>
                  <td className="px-6 py-4">
                    {appointment?.appointment_type_name}
                  </td>
                  <td className="w-fit mx-auto">
                    <span
                      className={`px-6 rounded-full py-2 text-base font-medium text-white w-5 ${checkStatus(
                        appointment?.status
                      )}`}
                    >
                      {appointment?.status}
                    </span>
                  </td>

                  {/* ✅ Always show button now */}
                  <td className="px-6 py-4 flex gap-4">
                    <ConsultButton
                      appointment={appointment}
                      access={access}
                      onClick={handleConsult}
                    />
                  </td>
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
          <p className="text-gray-500 text-center mt-6">
            No appointments available.
          </p>
        )
      )}
    </PageContainer>
  );
};

export default Appointments;

/**
 * 🔹 Returns Tailwind class for appointment status badge color
 */
const checkStatus = (status) => {
  switch (status) {
    case "Consultation Completed":
      return "bg-green-600";
    case "Cancelled":
      return "bg-red-600";
    default:
      return "bg-yellow-400";
  }
};
