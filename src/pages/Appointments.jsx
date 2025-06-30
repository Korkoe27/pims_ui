import React, { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { selectAppointment } from "../redux/slices/appointmentsSlice";
import useHandleConsult from "../hooks/useHandleConsult";
import Navbar from "../components/Navbar";

const Appointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleConsult } = useHandleConsult();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of items per page

  // Accessing data from the dashboard store
  const { todayAppointments, loading, error } = useSelector((state) => ({
    todayAppointments: state.dashboard.todayAppointments,
    loading: state.dashboard.loading,
    error: state.dashboard.error,
  }));

  const appointments = todayAppointments?.data || [];

  // Sort appointments by status: Scheduled, Completed, Cancelled
  const sortedAppointments = [...appointments].sort((a, b) => {
    const statusOrder = { Scheduled: 1, Completed: 2, Cancelled: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Paginated Appointments
  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(sortedAppointments.length / pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">

    {/* <Navbar  /> */}
      {loading && <LoadingSpinner />}

      <h1 className="font-extrabold text-xl">Today's Appointments</h1>

      {/* Loading State */}

      {/* Error State */}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Appointments Table */}
      {!loading && paginatedAppointments?.length > 0 ? (
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
                <th scope="col" className="px-3 min-w-40 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAppointments.map((appointment) => (
                <tr key={appointment.id} className="bg-white border-b">
                  <td className="px-6 py-4">{appointment?.appointment_date}</td>
                  <td className="px-6 py-4">
                    {appointment?.patient_id}
                  </td>
                  <td className="px-6 py-4">
                    {appointment?.patient_name}
                  </td>
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
                  <td className="px-6 py-4 flex gap-10">
                    {appointment?.status === "Scheduled" && (
                      <button
                        onClick={() => handleConsult(appointment)}
                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                      >
                        Consult
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        !loading && (
          <p className="text-gray-500 text-center">
            No appointments available.
          </p>
        )
      )}
    </div>
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