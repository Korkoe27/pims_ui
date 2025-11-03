import React, { useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import useHandleConsult from "../hooks/useHandleConsult";
import PageContainer from "../components/PageContainer";
import { useGetTodaysAppointmentsQuery } from "../redux/api/features/appointmentsApi";
import ConsultButton from "../components/ui/buttons/ConsultButton";

const SpecialAppointments = () => {
  const { user } = useSelector((state) => state.auth || {});
  const access = user?.access || {};
  const { handleConsult } = useHandleConsult();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ✅ Fetch today's appointments
  const { data, isLoading, error } = useGetTodaysAppointmentsQuery();
  const allAppointments = data?.data || [];

  // ✅ Filter only Special Appointments
  const appointments = allAppointments.filter((appt) => {
    const category =
      typeof appt?.appointment_category === "string"
        ? appt.appointment_category.toLowerCase()
        : "";
    return category === "special";
  });

  // ✅ Sort by status
  const sortedAppointments = [...appointments].sort((a, b) => {
    const statusOrder = { Scheduled: 1, Completed: 2, Cancelled: 3 };
    return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
  });

  // ✅ Pagination logic
  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(sortedAppointments.length / pageSize);
  const handlePageChange = (page) => setCurrentPage(page);

  // ✅ Determine if any appointment has an actionable button
  const hasAnyAction = paginatedAppointments.some((appt) =>
    ConsultButton.shouldShow(access, appt)
  );

  const actionColClass = "text-center px-6 py-3 min-w-[10rem]";

  return (
    <PageContainer>
      {isLoading && <LoadingSpinner />}

      <h1 className="font-extrabold text-xl mb-4">Special Appointments</h1>

      {/* ⚠️ Error Handling */}
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
          <table className="w-full text-base text-left text-gray-600 border border-gray-200 rounded-md overflow-hidden">
            <thead className="text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Patient ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                {hasAnyAction && <th className={actionColClass}>Action</th>}
              </tr>
            </thead>

            <tbody>
              {paginatedAppointments.map((appointment) => {
                const canAct = ConsultButton.shouldShow(access, appointment);
                return (
                  <tr key={appointment.id} className="bg-white border-b">
                    <td className="px-6 py-4">{appointment?.appointment_date}</td>
                    <td className="px-6 py-4">{appointment?.patient_id}</td>
                    <td className="px-6 py-4">{appointment?.patient_name}</td>
                    <td className="px-6 py-4">
                      {appointment?.appointment_category}
                    </td>
                    <td className="px-6 py-4">
                      {appointment?.appointment_type_name ||
                        appointment?.appointment_type}
                    </td>
                    <td className="px-6 py-4">{appointment?.status}</td>

                    {hasAnyAction && (
                      <td className={`${actionColClass} flex justify-center`}>
                        {canAct ? (
                          <ConsultButton
                            appointment={appointment}
                            onClick={handleConsult}
                          />
                        ) : (
                          <span className="text-gray-400 text-sm italic">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
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
            No special appointments available.
          </p>
        )
      )}
    </PageContainer>
  );
};

export default SpecialAppointments;
