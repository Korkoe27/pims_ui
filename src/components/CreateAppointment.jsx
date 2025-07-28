import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useCreateAppointmentMutation } from "../redux/api/features/appointmentsApi";
import { showToast, formatErrorMessage } from "../components/ToasterHelper";
import { addNewAppointment } from "../redux/slices/dashboardSlice"; // ✅ Import this

const CreateAppointment = () => {
  const { state } = useLocation();
  const dispatch = useDispatch(); // ✅ Get dispatch

  const patient = state?.patient || null;

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_type: "",
    status: "",
    notes: "",
  });

  const APPOINTMENT_TYPES = [
    { value: "New", label: "New" },
    { value: "Review", label: "Review" },
  ];

  const APPOINTMENT_STATUSES = [
    { value: "Scheduled", label: "Scheduled" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patient?.id) {
      console.error("Error: Patient ID is missing!");
      return;
    }

    const payload = {
      patient: patient.id,
      appointment_date: formData.appointment_date,
      appointment_type: formData.appointment_type,
      status: formData.status,
      notes: formData.notes,
    };

    try {
      

      const response = await createAppointment(payload).unwrap();

      // ✅ Immediately update Redux dashboard state
      dispatch(
        addNewAppointment({
          ...response,
          patient_id: patient.patient_id,
          patient_name: `${patient.first_name} ${patient.last_name || ""}`,
          appointment_type: formData.appointment_type,
          appointment_date: formData.appointment_date,
          status: formData.status,
        })
      );

      showToast("Appointment Created Successfully!", "success");
      setFormData({
        appointment_date: "",
        appointment_type: "",
        status: "",
        notes: "",
      });
    } catch (err) {
      const message = formatErrorMessage(err?.data);
      showToast(message, "error");
    }
  };

  return (
    <div className="ml-72 my-8 px-8 w-[800px] flex flex-col bg-[#f9fafb] gap-12">
      <h1 className="font-semibold text-xl text-center">
        Schedule an Appointment
      </h1>

      {!patient ? (
        <p className="text-red-500 text-center">
          Error: No valid patient selected.
        </p>
      ) : (
        <>
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <p>
              <strong>Patient Name:</strong> {patient.first_name}{" "}
              {patient.last_name || ""}
            </p>
            <p>
              <strong>Patient ID:</strong> {patient.patient_id}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="appointment_date"
                  className="font-medium text-base"
                >
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  id="appointment_date"
                  className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
                  value={formData.appointment_date}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="appointment_type"
                  className="font-medium text-base"
                >
                  Appointment Type
                </label>
                <select
                  name="appointment_type"
                  id="appointment_type"
                  className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
                  value={formData.appointment_type}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Appointment Type
                  </option>
                  {APPOINTMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="status" className="font-medium text-base">
                  Appointment Status
                </label>
                <select
                  name="status"
                  id="status"
                  className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Appointment Status
                  </option>
                  {APPOINTMENT_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-2">
              <label htmlFor="notes" className="font-medium text-base">
                Notes
              </label>
              <textarea
                name="notes"
                id="notes"
                placeholder="Add some notes about the patient"
                className="h-24 p-4 border resize-none w-full rounded-lg"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
            <input type="hidden" name="patient" value={patient.id} />
            <div className="col-span-2 flex justify-center">
              <button
                type="submit"
                className="w-56 p-4 rounded-lg text-white text-lg font-medium bg-[#2f3192]"
                disabled={isLoading}
              >
                {isLoading ? "Setting..." : "Set Appointment"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateAppointment;
