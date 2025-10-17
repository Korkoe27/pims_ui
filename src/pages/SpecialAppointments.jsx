import React, { useState } from "react";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import useHandleConsult from "../hooks/useHandleConsult";
import PageContainer from "../components/PageContainer";
import CanAccess from "../components/auth/CanAccess";
import { ROLES } from "../constants/roles";
import { useGetTodaysAppointmentsQuery } from "../redux/api/features/appointmentsApi";
import ConsultButton from "../components/ui/buttons/ConsultButton";
import { canShowConsultButton } from "../utils/canShowConsultButton";

const SpecialAppointments = () => {
  const userRole = useSelector((state) => state.auth?.user?.role);
  const { handleConsult } = useHandleConsult();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useGetTodaysAppointmentsQuery();
  const appointments = data?.data || [];

  const sortedAppointments = [...appointments].sort((a, b) => {
    const statusOrder = { Scheduled: 1, Completed: 2, Cancelled: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(sortedAppointments.length / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ✅ check if at least one row has a valid consult action
  const hasAnyConsultAction = paginatedAppointments.some((appt) =>
    canShowConsultButton(appt, userRole)
  );

  return (
    <PageContainer>
      {isLoading && <LoadingSpinner />}
      <h1 className="font-extrabold text-xl">Today's Appointments</h1>

      {/* ✅ Fixed error handling - extract message from error object */}
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
          <table className="w-full text-base text-left rtl:text-right text-gray-500">
            <thead className="text-base text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Patient ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                {hasAnyConsultAction && (
                  <CanAccess allowedRoles={[ROLES.STUDENT, ROLES.LECTURER]}>
                    <th scope="col" className="px-3 min-w-40 py-3">
                      Action
                    </th>
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
                  <td className="px-6 py-4">{appointment?.appointment_type}</td>
                  <td className="w-fit mx-auto">
                    <span
                      className={`px-6 rounded-full py-2 text-base font-medium text-white w-5 ${checkStatus(
                        appointment?.status
                      )}`}
                    >
                      {appointment?.status}
                    </span>
                  </td>
                  {hasAnyConsultAction && (
                    <td className="px-6 py-4 flex gap-4">
                      <CanAccess allowedRoles={[ROLES.STUDENT, ROLES.LECTURER]}>
                        <ConsultButton
                          appointment={appointment}
                          role={userRole}
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
          <p className="text-gray-500 text-center">
            No appointments available.
          </p>
        )
      )}
    </PageContainer>
  );
};

export default SpecialAppointments;

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
