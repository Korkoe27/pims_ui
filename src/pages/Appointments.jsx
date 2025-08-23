import React, { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import useHandleConsult from "../hooks/useHandleConsult";
import PageContainer from "../components/PageContainer";
import CanAccess from "../components/auth/CanAccess";
import { ROLES } from "../constants/roles";
import { useGetTodaysAppointmentsQuery } from "../redux/api/features/appointmentsApi";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
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

  const transitionAppointment = async (appointment, to_status) => {
    try {
      const res = await fetch(
        `/clients/api/appointments/${appointment.id}/transition/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to_status }),
        }
      );
      if (!res.ok) throw new Error("Failed to transition");
      const data = await res.json();
      alert(`Moved to ${data.status}`); // or use showToast if you already have it
      // TODO: refetch appointments if needed
    } catch (err) {
      alert(err.message);
    }
  };

  const navigate = useNavigate();
  const handleAddCost = (appointment) => {
    navigate(`/pharmacy/order/${appointment.id}`);
  };

  const handlePaymentComplete = (appointment) =>
    transitionAppointment(appointment, "Payment Completed");

  const handleDispense = (appointment) =>
    transitionAppointment(appointment, "Medications Disbursed");

  return (
    <PageContainer>
      {isLoading && <LoadingSpinner />}
      <h1 className="font-extrabold text-xl">Today's Appointments</h1>
      {error && <p className="text-red-500">Error: {error}</p>}

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
                <CanAccess
                  allowedRoles={[
                    ROLES.STUDENT,
                    ROLES.LECTURER,
                    ROLES.SYSTEMS_ADMIN,
                  ]}
                >
                  <th scope="col" className="px-3 min-w-40 py-3">
                    Action
                  </th>
                </CanAccess>
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
                  <td className="px-6 py-4 flex gap-4">
                    {/** STUDENTS + LECTURERS */}
                    <CanAccess allowedRoles={[ROLES.STUDENT, ROLES.LECTURER]}>
                      <button
                        onClick={() => handleConsult(appointment)}
                        disabled={[
                          "Management Created",
                          "Case Management Guide Created",
                          "Submitted For Review",
                          "Under Review",
                          "Scored",
                          "Payment Completed",
                          "Medications Disbursed",
                          "Cancelled",
                        ].includes(appointment.status)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white ${
                          [
                            "Management Created",
                            "Case Management Guide Created",
                            "Submitted For Review",
                            "Under Review",
                            "Scored",
                            "Payment Completed",
                            "Medications Disbursed",
                            "Cancelled",
                          ].includes(appointment.status)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-700 hover:bg-green-800"
                        }`}
                      >
                        Consult
                      </button>
                    </CanAccess>

                    {/** PHARMACY → Add Cost */}
                    <CanAccess allowedRoles={[ROLES.PHARMACY]}>
                      {appointment.status === "Management Created" && (
                        <button
                          onClick={() => handleAddCost(appointment)}
                          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Add Cost
                        </button>
                      )}
                      {appointment.status === "Payment Completed" && (
                        <button
                          onClick={() => handleDispense(appointment)}
                          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                        >
                          Dispense Medication
                        </button>
                      )}
                    </CanAccess>

                    {/** FINANCE → Mark Payment Completed */}
                    <CanAccess allowedRoles={[ROLES.FINANCE]}>
                      {appointment.status === "Management Created" && (
                        <button
                          onClick={() => handlePaymentComplete(appointment)}
                          className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Mark Payment Completed
                        </button>
                      )}
                    </CanAccess>
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
          <p className="text-gray-500 text-center">
            No appointments available.
          </p>
        )
      )}
    </PageContainer>
  );
};

export default Appointments;

const checkStatus = (status) => {
  switch (status) {
    case "Completed":
      return "bg-green-600";
    case "Cancelled":
      return "bg-red-600";
    default:
      return "bg-yellow-400";
  }
};
