import React from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  // Get the selected appointment from Redux
  const selectedAppointment = useSelector(
    (state) => state.appointments.selectedAppointment
  );

  // Redirect if no appointment is selected
  if (!selectedAppointment) {
    console.error("No appointment selected. Redirecting to Dashboard...");
    navigate("/dashboard");
    return <p>Redirecting to Dashboard...</p>;
  }

  return (
    <div className="px-8 ml-72 flex flex-col mt-8 gap-8 bg-[#f9fafb] w-full shadow-md sm:rounded-lg">
      <h1 className="font-extrabold text-xl">Consultation</h1>
      <p>Patient Name: {selectedAppointment.patient.first_name}</p>
      <p>Appointment ID: {appointmentId}</p>
    </div>
  );
};

export default Consultation;
