import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ import navigate
import { useDispatch } from "react-redux";
import {
  useCreateAppointmentMutation,
  useFetchAppointmentTypesQuery,
} from "../redux/api/features/appointmentsApi";
import { useLazyGetPatientInsurancesQuery } from "../redux/api/features/insuranceApi";
import { showToast, formatErrorMessage } from "../components/ToasterHelper";
import { addNewAppointment } from "../redux/slices/dashboardSlice";
import AddInsuranceModal from "./AddInsuranceModal";

const CreateAppointment = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ initialize navigate
  const patient = state?.patient || null;
  const [category, setCategory] = useState("General");

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();
  const { data: appointmentTypes = [], isLoading: isTypesLoading, isError: isTypesError } =
    useFetchAppointmentTypesQuery(category);

  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_type: "",
    status: "scheduled",
    notes: "",
    mode_of_payment: "Cash",
    insurance: "",
  });

  const [patientInsurances, setPatientInsurances] = useState([]);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [fetchPatientInsurances, { isLoading: isLoadingInsurances }] =
    useLazyGetPatientInsurancesQuery();

  useEffect(() => {
    if (!isTypesLoading && !isTypesError && appointmentTypes.length === 1) {
      // auto-select the only available type
      setFormData((prev) => ({
        ...prev,
        appointment_type: appointmentTypes[0].value,
      }));
    } else if (appointmentTypes.length > 1) {
      // clear previous selection so user can pick
      setFormData((prev) => ({ ...prev, appointment_type: "" }));
    }
  }, [appointmentTypes, isTypesLoading, isTypesError]);

  const loadPatientInsurances = useCallback(() => {
    if (patient?.id) {
      fetchPatientInsurances({ patientId: patient.id, activeOnly: true })
        .unwrap()
        .then((insurances) => {
          setPatientInsurances(insurances || []);
        })
        .catch((err) => {
          console.error("Failed to fetch patient insurances:", err);
          setPatientInsurances([]);
        });
    }
  }, [patient?.id, fetchPatientInsurances]);

  // Fetch patient insurances when component mounts
  useEffect(() => {
    if (patient?.id) {
      loadPatientInsurances();
    }
  }, [patient?.id, loadPatientInsurances]);

  const handleInsuranceAdded = (newInsurance) => {
    // Refresh insurance list
    loadPatientInsurances();
    // Auto-select the newly added insurance
    setFormData((prev) => ({ ...prev, insurance: newInsurance.id }));
    showToast("Insurance added and selected!", "success");
  };


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

    if (!formData.appointment_type || formData.appointment_type === "") {
      showToast("Please select an appointment type.", "error");
      return;
    }

    if (!formData.appointment_date) {
      showToast("Please select an appointment date.", "error");
      return;
    }

    // Validate insurance selection when payment mode is Health Insurance
    if (formData.mode_of_payment === "Health Insurance") {
      if (!formData.insurance) {
        showToast("Please select an insurance when using Health Insurance payment mode.", "error");
        return;
      }
    }

    const payload = {
      patient: patient.id,
      appointment_date: formData.appointment_date,
      appointment_type: formData.appointment_type,
      status: formData.status,
      notes: formData.notes,
      mode_of_payment: formData.mode_of_payment,
    };

    // Add insurance only if payment mode is Health Insurance
    if (formData.mode_of_payment === "Health Insurance" && formData.insurance) {
      payload.insurance = formData.insurance;
    }

    // console.log("Form Data:", formData);
    // console.log("Payload being sent:", payload);

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

      // ✅ Redirect after short delay (so user sees toast)
      setTimeout(() => {
        navigate("/"); // <-- adjust path if your dashboard route differs
      }, 1000);

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

              {/* Appointment Category */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-medium text-base">Appointment Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
                >
                  <option value="General">General</option>
                  <option value="Special">Special</option>
                </select>
              </div>

              {/* Appointment Type */}
              {appointmentTypes.length > 1 ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor="appointment_type" className="font-medium text-base">
                    Appointment Type
                  </label>
                  <select
                    name="appointment_type"
                    id="appointment_type"
                    className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
                    value={formData.appointment_type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        appointment_type: e.target.value,
                      }))
                    }
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

                    {appointmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                appointmentTypes.length === 1 && (
                  <div className="text-sm text-gray-600">
                    Auto-selected: <strong>{appointmentTypes[0].label}</strong>
                  </div>
                )
              )}

              {/* Payment Mode */}
              <div className="flex flex-col gap-2">
                <label htmlFor="mode_of_payment" className="font-medium text-base">
                  Payment Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="mode_of_payment"
                  id="mode_of_payment"
                  className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
                  value={formData.mode_of_payment}
                  onChange={handleChange}
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Health Insurance">Health Insurance</option>
                </select>
              </div>

              {/* Insurance Selection - Only show if Health Insurance is selected */}
              {formData.mode_of_payment === "Health Insurance" && (
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="insurance" className="font-medium text-base">
                      Select Insurance <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsInsuranceModalOpen(true)}
                      className="text-sm text-[#2f3192] hover:underline font-medium"
                    >
                      + Add New Insurance
                    </button>
                  </div>
                  <select
                    name="insurance"
                    id="insurance"
                    className="p-4 border border-[#d0d5dd] h-14 rounded-lg"
                    value={formData.insurance}
                    onChange={handleChange}
                    required
                    disabled={isLoadingInsurances}
                  >
                    <option value="">
                      {isLoadingInsurances
                        ? "Loading insurances..."
                        : patientInsurances.length === 0
                        ? "No active insurance found"
                        : "Select Insurance"}
                    </option>
                    {patientInsurances.map((ins) => (
                      <option key={ins.id} value={ins.id}>
                        {ins.insurance_provider} - {ins.insurance_number}
                        {ins.is_primary ? " (Primary)" : ""}
                      </option>
                    ))}
                  </select>
                  {patientInsurances.length === 0 && !isLoadingInsurances && (
                    <p className="text-sm text-amber-600">
                      No active insurance found. Click "Add New Insurance" to add one.
                    </p>
                  )}
                </div>
              )}

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

      {/* Add Insurance Modal */}
      <AddInsuranceModal
        isOpen={isInsuranceModalOpen}
        onClose={() => setIsInsuranceModalOpen(false)}
        patientId={patient?.id}
        onInsuranceAdded={handleInsuranceAdded}
      />
    </div>
  );
};

export default CreateAppointment;
