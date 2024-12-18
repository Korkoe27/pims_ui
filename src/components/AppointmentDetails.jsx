import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAppointmentDetails } from "../redux/slices/appointmentsSlice";

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const dispatch = useDispatch();
  const { data: appointment, loading, error } = useSelector(
    (state) => state.appointment
  );

  // useEffect(() => {
  //   dispatch(fetchAppointmentDetails(appointmentId));
  // }, [dispatch, appointmentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: Unable to load appointment details.</div>;
  }

  if (!appointment) {
    return <div>No appointment details available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Appointment Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p><strong>Appointment ID:</strong> {appointment.id}</p>
        <p><strong>Patient Name:</strong> {appointment.patientName}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
        <p><strong>Time:</strong> {appointment.time}</p>
        <p><strong>Clinic:</strong> {appointment.clinic}</p>
        <p><strong>Notes:</strong> {appointment.notes || "No additional notes"}</p>
      </div>
    </div>
  );
};

export default AppointmentDetails;
