import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import PatientModal from "./SelectClinicModal";
// import useManagementData from "../hooks/useManagementData"; // not used in UI-only
// import useMarkAppointmentCompleted from "../hooks/useMarkAppointmentCompleted";
import { showToast } from "../components/ToasterHelper";
import RefractiveCorrectionSection from "./RefractiveCorrectionSection";
import MedicationForm from "./MedicationForm";
import SupervisorGradingButton from "./SupervisorGradingButton";

const Management = ({ setFlowStep, appointmentId }) => {
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);         // currently unused after redirect
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [selectedTypeId] = useState(null);
  const [selectedMedications, setSelectedMedications] = useState([]);

  // UI-only: no fetching medications; pass empty array
  const medications = [];

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

  const validateBeforeConfirm = () => {
    const isValidSPH = (val) => /^[+-][0-9]+(\.25|\.50|\.75|\.00)?$/.test(val.trim());
    const isValidCYL = (val) => /^-[0-9]+(\.25|\.50|\.75|\.00)?$/.test(val.trim());
    const isValidAXIS = (val) => {
      const num = Number(val.trim());
      return Number.isInteger(num) && num >= 0 && num <= 180;
    };
    const isValidADD = (val) => /^\+[0-9]+(\.25|\.50|\.75|\.00)?$/.test(val.trim());

    const atLeastOneSelected = Object.values(checkboxes).some((val) => val);
    if (!atLeastOneSelected) {
      showToast("Please select at least one management option.", "error");
      return false;
    }

    if (checkboxes.refractiveCorrection) {
      if (!prescription.type_of_refractive_correction) {
        showToast("Please select a type of refractive correction.", "error");
        return false;
      }
      if (!isValidSPH(prescription.od_sph) || !isValidSPH(prescription.os_sph)) {
        showToast("SPH is required and must be valid for both eyes.", "error");
        return false;
      }
      if (
        (prescription.od_cyl && !isValidCYL(prescription.od_cyl)) ||
        (prescription.os_cyl && !isValidCYL(prescription.os_cyl))
      ) {
        showToast("CYL must be negative and valid (e.g., -0.75).", "error");
        return false;
      }
      if (
        (prescription.od_cyl && !isValidAXIS(prescription.od_axis)) ||
        (prescription.os_cyl && !isValidAXIS(prescription.os_axis))
      ) {
        showToast("AXIS is required and must be 0–180 if CYL is provided.", "error");
        return false;
      }
      if (
        (prescription.od_add && !isValidADD(prescription.od_add)) ||
        (prescription.os_add && !isValidADD(prescription.os_add))
      ) {
        showToast("ADD must start with '+' and be valid (e.g., +1.00).", "error");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    // UI-only mock: save, toast, then redirect to Dashboard
    showToast("Saving management plan...", "info");
    setTimeout(() => {
      showToast("Management plan saved. Consultation completed.", "success");
      navigate("/"); // ← redirect to Dashboard
      // If you ever want the success modal instead of instant redirect:
      // setModal(true);
    }, 600);
  };

  return (
    <div className="ml-72 py-8 px-8 w-fit flex flex-col gap-12">
      <SupervisorGradingButton
        sectionLabel="Grading: Management"
        onSubmit={(grading) => {
          console.log("Management grading submitted:", grading);
        }}
      />

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
              Are you sure you want to save this treatment record? This action cannot be undone.
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

      {/* Success modal (currently unused due to direct redirect) */}
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
                <label className="font-medium text-base">Treatment / Management Option(s)</label>
                <div className="grid grid-cols-2 gap-5">
                  {Object.keys(checkboxes).map((key) => (
                    <label key={key} className="flex items-center gap-1 capitalize">
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
                  selectedMedications={selectedMedications}
                  setSelectedMedications={setSelectedMedications}
                  medications={medications}
                />
              )}

              {["surgery", "referral", "counselling", "therapy", "lowVisionAid"].map((field) => {
                if (!checkboxes[field]) return null;
                const label = `${field.replace(/([A-Z])/g, " $1")} Details`.replace(
                  /^./,
                  (s) => s.toUpperCase()
                );
                const name = `${field}_details`;
                return (
                  <div key={field} className="flex flex-col gap-2">
                    <label className="font-medium">{label}</label>
                    <textarea
                      name={name}
                      value={details[name]}
                      onChange={handleDetailsChange}
                      className="w-full p-2 border rounded-md"
                      placeholder={field === "therapy" ? "Type of therapy or exercises..." : ""}
                    />
                  </div>
                );
              })}
            </section>
          </main>

          <div className="flex justify-start gap-4">
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
                const atLeastOneSelected = Object.values(checkboxes).some((val) => val);
                if (!atLeastOneSelected) {
                  showToast("Please select at least one management option.", "error");
                  return;
                }
                if (checkboxes.refractiveCorrection && !prescription.type_of_refractive_correction) {
                  showToast("Please select a type of refractive correction.", "error");
                  return;
                }
                if (validateBeforeConfirm()) setConfirmSave(true);
              }}
              className="w-44 h-14 p-4 rounded-lg bg-[#2f3192] text-white"
            >
              Save & Finish
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Management;
