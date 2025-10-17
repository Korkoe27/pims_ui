import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useCreateAppointmentMutation,
  useFetchAppointmentTypesQuery,
} from "../redux/api/features/appointmentsApi";
import { showToast, formatErrorMessage } from "../components/ToasterHelper";
import { addNewAppointment } from "../redux/slices/dashboardSlice";

const CreateAppointment = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const patient = state?.patient || null;

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const {
    data: appointmentTypes = [],
    isLoading: isTypesLoading,
    isError: isTypesError,
  } = useFetchAppointmentTypesQuery();

  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_type: "",
    status: "scheduled",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patient?.id) {
      showToast("No valid patient selected.", "error");
      return;
    }

    const payload = {
      patient: patient.id,
      appointment_date: formData.appointment_date,
      appointment_type: Number(formData.appointment_type),
      status: formData.status,
      notes: formData.notes,
    };

    try {
      const response = await createAppointment(payload).unwrap();

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
        status: "scheduled",
        notes: "",
      });
    } catch (err) {
      const message = formatErrorMessage(err?.data);
      showToast(message, "error");
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-[#f9fafb] items-start">
      <div className="max-w-2xl w-full flex flex-col px-6 py-8 gap-8 bg-white rounded-xl shadow-lg mt-12">
        <h1 className="font-semibold text-xl text-center">Schedule an Appointment</h1>

        {!patient ? (
          <p className="text-red-500 text-center">Error: No valid patient selected.</p>
        ) : (
          <>
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
              <p>
                <strong>Patient Name:</strong> {patient.first_name} {patient.last_name || ""}
              </p>
              <p>
                <strong>Patient ID:</strong> {patient.patient_id}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-6">
              {/* Appointment Date */}
              <div className="flex flex-col gap-2">
                <label htmlFor="appointment_date" className="font-medium text-base">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  id="appointment_date"
                  className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Appointment Type (fetched) */}
              <div className="flex flex-col gap-2">
                <label htmlFor="appointment_type" className="font-medium text-base">
                  Appointment Type
                </label>
                <select
                  name="appointment_type"
                  id="appointment_type"
                  className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
                  value={formData.appointment_type}
                  onChange={handleChange}
                  required
                  disabled={isTypesLoading || isTypesError}
                >
                  <option value="" disabled>
                    {isTypesLoading
                      ? "Loading types..."
                      : isTypesError
                      ? "Failed to load types"
                      : "Select Appointment Type"}
                  </option>
                  {!isTypesLoading &&
                    !isTypesError &&
                    appointmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                </select>

                {!isTypesLoading && !isTypesError && appointmentTypes.length === 0 && (
                  <span className="text-sm text-amber-600">No appointment types found.</span>
                )}
                {isTypesError && (
                  <span className="text-sm text-red-500">
                    Couldn’t load appointment types. Please refresh.
                  </span>
                )}
              </div>

              {/* Notes */}
              <div className="col-span-2 flex flex-col gap-2">
                <label htmlFor="notes" className="font-medium text-base">
                  Notes
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  placeholder="Add notes about this appointment"
                  className="h-24 p-4 border resize-none w-full rounded-lg"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
              <div className="col-span-2 flex justify-center">
                <button
                  type="submit"
                  className="w-56 p-4 rounded-lg text-white text-lg font-medium bg-[#2f3192]"
                  disabled={isLoading || isTypesLoading || isTypesError}
                >
                  {isLoading ? "Booking..." : "Book Appointment"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateAppointment;
