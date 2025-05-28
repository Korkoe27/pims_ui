import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import PatientModal from "./SelectClinicModal";
import useManagementData from "../hooks/useManagementData";
import useMarkAppointmentCompleted from "../hooks/useMarkAppointmentCompleted";
import { showToast } from "../components/ToasterHelper";
import RefractiveCorrectionSection from "./RefractiveCorrectionSection";
import MedicationForm from "./MedicationForm";

const Management = ({ setFlowStep, appointmentId }) => {
  const navigate = useNavigate();
  const { markAppointmentCompletedHandler } = useMarkAppointmentCompleted();

  const [modal, setModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState(null);

  const {
    medications,
    medicationTypes,
    filteredMedications,
    managementPlan,
    createManagementPlan,
    isManagementPlanLoading,
    isCreatingManagementPlan,
  } = useManagementData(appointmentId, selectedTypeId);

  const [medicationEntry, setMedicationEntry] = useState({
    medication_eye: "",
    medication_name: "",
    medication_type: "",
    medication_dosage: "",
  });

  const [checkboxes, setCheckboxes] = useState({
    refractiveCorrection: false,
    medications: false,
    counselling: false,
    lowVisionAid: false,
    therapy: false,
    surgery: false,
    referral: false,
  });

  const [prescription, setPrescription] = useState({
    type_of_refractive_correction: "",
    od_sph: "",
    od_cyl: "",
    od_axis: "",
    od_add: "",
    os_sph: "",
    os_cyl: "",
    os_axis: "",
    os_add: "",
    type_of_lens: "",
    pd: "",
    segment_height: "",
    fitting_cross_height: "",
  });

  const [details, setDetails] = useState({
    surgery_details: "",
    referral_details: "",
    counselling_details: "",
    low_vision_aid_details: "",
    therapy_details: "",
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckboxes((prev) => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // ✅ Validate refractive correction type if selected
    if (
      checkboxes.refractiveCorrection &&
      !prescription.type_of_refractive_correction
    ) {
      showToast("Please select a type of refractive correction.", "error");
      return;
    }

    const processedPrescription = {
      ...prescription,
      od_sph: parseFloat(prescription.od_sph) || null,
      od_cyl: parseFloat(prescription.od_cyl) || null,
      od_axis: parseInt(prescription.od_axis) || null,
      od_add: parseFloat(prescription.od_add) || null,
      os_sph: parseFloat(prescription.os_sph) || null,
      os_cyl: parseFloat(prescription.os_cyl) || null,
      os_axis: parseInt(prescription.os_axis) || null,
      os_add: parseFloat(prescription.os_add) || null,
      pd: parseFloat(prescription.pd) || null,
      segment_height: parseFloat(prescription.segment_height) || null,
      fitting_cross_height:
        parseFloat(prescription.fitting_cross_height) || null,
    };

    const payload = {
      ...prescription,
      ...processedPrescription,
      ...details,
      refractive_correction: checkboxes.refractiveCorrection,
      medications: checkboxes.medications,
      counselling: checkboxes.counselling,
      low_vision_aid: checkboxes.lowVisionAid,
      therapy: checkboxes.therapy,
      surgery: checkboxes.surgery,
      referral: checkboxes.referral,
    };

    try {
      showToast("Saving management plan...", "info");
      await createManagementPlan({ appointmentId, payload }).unwrap();
      showToast("Management plan saved successfully!", "success");

      await markAppointmentCompletedHandler(appointmentId);
      showToast("Appointment marked as completed!", "success");

      setModal(true);
    } catch (error) {
      const message = Object.entries(error?.data || {})
        .map(
          ([field, messages]) =>
            `${field.toUpperCase()}: ${messages.join(", ")}`
        )
        .join("\n");
      showToast(message || "Something went wrong while saving.", "error");
    }
  };

  useEffect(() => {
    if (managementPlan) {
      setCheckboxes({
        refractiveCorrection: managementPlan.refractive_correction,
        medications: managementPlan.medications,
        counselling: managementPlan.counselling,
        lowVisionAid: managementPlan.low_vision_aid,
        therapy: managementPlan.therapy,
        surgery: managementPlan.surgery,
        referral: managementPlan.referral,
      });

      setPrescription((prev) => ({
        ...prev,
        ...managementPlan,
      }));

      setDetails({
        surgery_details: managementPlan.surgery_details || "",
        referral_details: managementPlan.referral_details || "",
        counselling_details: managementPlan.counselling_details || "",
        low_vision_aid_details: managementPlan.low_vision_aid_details || "",
        therapy_details: managementPlan.therapy_details || "",
      });
    }
  }, [managementPlan]);

  if (isManagementPlanLoading) {
    return (
      <div className="ml-72 py-8 px-8">Loading latest management plan...</div>
    );
  }

  return (
    <div className="ml-72 py-8 px-8 w-fit flex flex-col gap-12">
      {isModalOpen && <PatientModal setIsModalOpen={setIsModalOpen} />}

      {confirmSave && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-sm z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmSave(false);
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
            <h2 className="text-lg font-bold mb-2">Confirm Save</h2>
            <p className="mb-4">
              Are you sure you want to save this treatment record? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmSave(false)}
                className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmSave(false);
                  handleSubmit();
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-15 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(false);
          }}
        >
          <div className="relative mt-20 bg-white p-6 rounded-lg border border-l-4 border-[#0F973D] w-fit">
            <button
              className="absolute top-4 right-3 text-xl font-semibold cursor-pointer"
              onClick={() => setModal(false)}
              aria-label="Close"
            >
              <IoClose size={20} />
            </button>
            <div className="flex items-start gap-6 pr-8">
              <span className="w-10 h-10 rounded-lg justify-center items-center p-1.5 bg-green-100">
                <IoIosCheckmarkCircle size={20} color="#0f973d" />
              </span>
              <div className="flex flex-col items-start gap-2 pr-6 border-l border-gray-300 pl-4">
                <h3 className="text-base font-bold">Success!</h3>
                <p className="text-base font-medium">
                  You have finished attending to your patient.
                </p>
                <div className="flex justify-between gap-4 mt-4">
                  <button
                    onClick={() => {
                      setModal(false);
                      navigate("/appointments");
                    }}
                    className="bg-[#0F973D] text-white px-4 py-2 rounded-lg"
                  >
                    Attend to next patient
                  </button>
                  <button
                    onClick={() => {
                      setModal(false);
                      navigate("/");
                    }}
                    className="border border-gray-600 px-4 py-2 rounded-lg"
                  >
                    Go to dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!modal && (
        <form className="flex flex-col gap-5 w-fit">
          <main className="flex gap-40">
            <section className="flex flex-col gap-12 w-fit">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-base">
                  Treatment / Management Option(s)
                </label>
                <div className="grid grid-cols-2 gap-5">
                  {Object.keys(checkboxes).map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-1 capitalize"
                    >
                      <input
                        type="checkbox"
                        name={key}
                        checked={checkboxes[key]}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5"
                      />
                      {key.replace(/([A-Z])/g, " $1")}
                    </label>
                  ))}
                </div>
              </div>

              {checkboxes.refractiveCorrection && (
                <RefractiveCorrectionSection
                  prescription={prescription}
                  handleInputChange={handleInputChange}
                />
              )}

              {checkboxes.medications && (
                <MedicationForm
                  medicationEntry={medicationEntry}
                  setMedicationEntry={setMedicationEntry}
                  medicationTypes={medicationTypes}
                  medications={medications}
                  filteredMedications={filteredMedications}
                  setSelectedTypeId={setSelectedTypeId}
                />
              )}

              {[
                "surgery",
                "referral",
                "counselling",
                "therapy",
                "lowVisionAid",
              ].map((field) => {
                if (!checkboxes[field]) return null;
                const label = `${field.replace(
                  /([A-Z])/g,
                  " $1"
                )} Details`.replace(/^./, (s) => s.toUpperCase());
                const name = `${field}_details`;
                return (
                  <div key={field} className="flex flex-col gap-2">
                    <label className="font-medium">{label}</label>
                    <textarea
                      name={name}
                      value={details[name]}
                      onChange={handleDetailsChange}
                      className="w-full p-2 border rounded-md"
                      placeholder={
                        field === "therapy"
                          ? "Type of therapy or exercises..."
                          : ""
                      }
                    />
                  </div>
                );
              })}
            </section>
          </main>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setFlowStep("diagnosis")}
              className="text-[#2f3192] border border-[#2f3192] hover:bg-[#2f3192] hover:text-white px-4 py-2 rounded-md transition font-medium"
            >
              ← Back to Diagnosis
            </button>

            <button
              type="button"
              onClick={() => {
                const atLeastOneSelected = Object.values(checkboxes).some(
                  (val) => val
                );
                if (!atLeastOneSelected) {
                  showToast(
                    "Please select at least one management option.",
                    "error"
                  );
                  return;
                }

                if (
                  checkboxes.refractiveCorrection &&
                  !prescription.type_of_refractive_correction
                ) {
                  showToast(
                    "Please select a type of refractive correction.",
                    "error"
                  );
                  return;
                }

                setConfirmSave(true);
              }}
              className="w-24 h-14 mx-auto mr-0 p-4 rounded-lg bg-[#2f3192] text-white"
            >
              {isCreatingManagementPlan ? "Saving..." : "Finish"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Management;
