import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { IoIosCheckmarkCircle } from "react-icons/io";
import PatientModal from "./SelectClinicModal";
import { showToast } from "../components/ToasterHelper";
import RefractiveCorrectionSection from "./RefractiveCorrectionSection";
import MedicationForm from "./MedicationForm";
import SupervisorGradingButton from "./SupervisorGradingButton";

// RTK Query
import useManagementData from "../hooks/useManagementData";
// import useMarkAppointmentCompleted from "../hooks/useMarkAppointmentCompleted";

const Management = ({ setFlowStep, appointmentId }) => {
  const navigate = useNavigate();

  // ---------------- RTK QUERY ----------------
  const [selectedTypeId, setSelectedTypeId] = useState(null);

  const {
    // data
    medications,
    medicationTypes,
    filteredMedications,
    managementPlan,

    // states
    isMedicationsLoading,
    isMedicationTypesLoading,
    isFilteringMedications,
    isManagementPlanLoading,

    // mutation
    createManagementPlan,
    isCreatingManagementPlan,
  } = useManagementData(appointmentId, selectedTypeId);

  // const { markCompleted, isMarkingCompleted } = useMarkAppointmentCompleted();

  // ---------------- UI STATE ----------------
  const [modal, setModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);

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

  const [selectedMedications, setSelectedMedications] = useState([]);

  // Use filtered list if a type is selected; else all meds
  const medsList = useMemo(
    () => (selectedTypeId ? filteredMedications : medications) ?? [],
    [selectedTypeId, filteredMedications, medications]
  );

  // ---------------- PREFILL FROM BACKEND (if exists) ----------------
  useEffect(() => {
    if (!managementPlan) return;
    // Adjust mapping based on your API response
    const {
      options,
      refractive_prescription,
      medications: backendMeds = [],
      extra_details = {},
    } = managementPlan;

    if (options) {
      setCheckboxes((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(prev).map(([k]) => [k, Boolean(options[k])])
        ),
      }));
    }

    if (refractive_prescription) {
      setPrescription({
        type_of_refractive_correction: refractive_prescription.type_of_refractive_correction ?? "",
        od_sph: refractive_prescription.od?.sph ?? "",
        od_cyl: refractive_prescription.od?.cyl ?? "",
        od_axis: refractive_prescription.od?.axis ?? "",
        od_add: refractive_prescription.od?.add ?? "",
        os_sph: refractive_prescription.os?.sph ?? "",
        os_cyl: refractive_prescription.os?.cyl ?? "",
        os_axis: refractive_prescription.os?.axis ?? "",
        os_add: refractive_prescription.os?.add ?? "",
        type_of_lens: refractive_prescription.type_of_lens ?? "",
        pd: refractive_prescription.pd ?? "",
        segment_height: refractive_prescription.segment_height ?? "",
        fitting_cross_height: refractive_prescription.fitting_cross_height ?? "",
      });
    }

    setDetails({
      surgery_details: extra_details.surgery_details ?? "",
      referral_details: extra_details.referral_details ?? "",
      counselling_details: extra_details.counselling_details ?? "",
      low_vision_aid_details: extra_details.low_vision_aid_details ?? "",
      therapy_details: extra_details.therapy_details ?? "",
    });

    setSelectedMedications(
      backendMeds.map((m) => ({
        medication_id: m.medication_id ?? m.id ?? m.value,
        dosage: m.dosage ?? "",
        frequency: m.frequency ?? "",
        duration: m.duration ?? "",
        notes: m.notes ?? "",
        name: m.name, // if provided by API
      }))
    );
  }, [managementPlan]);

  // ---------------- HANDLERS ----------------
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

  // ---------------- VALIDATION ----------------
  const validateBeforeConfirm = () => {
    const isValidSPH = (val) => /^[+-][0-9]+(\.25|\.50|\.75|\.00)?$/.test(val.trim());
    const isValidCYL = (val) => /^-[0-9]+(\.25|\.50|\.75|\.00)?$/.test(val.trim());
    const isValidAXIS = (val) => {
      const num = Number(val.trim());
      return Number.isInteger(num) && num >= 0 && num <= 180;
    };
    const isValidADD = (val) => /^\+[0-9]+(\.25|\.50|\.75|\.00)?$/.test(val.trim());

    const atLeastOneSelected = Object.values(checkboxes).some(Boolean);
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

  // ---------------- PAYLOAD BUILDER ----------------
  const buildPayload = () => {
    const options = Object.fromEntries(
      Object.entries(checkboxes).map(([k, v]) => [k, !!v])
    );

    const refractive_prescription = checkboxes.refractiveCorrection
      ? {
          type_of_refractive_correction: prescription.type_of_refractive_correction || null,
          od: {
            sph: prescription.od_sph || null,
            cyl: prescription.od_cyl || null,
            axis: prescription.od_axis || null,
            add: prescription.od_add || null,
          },
          os: {
            sph: prescription.os_sph || null,
            cyl: prescription.os_cyl || null,
            axis: prescription.os_axis || null,
            add: prescription.os_add || null,
          },
          type_of_lens: prescription.type_of_lens || null,
          pd: prescription.pd || null,
          segment_height: prescription.segment_height || null,
          fitting_cross_height: prescription.fitting_cross_height || null,
        }
      : null;

    const meds = checkboxes.medications
      ? selectedMedications.map((m) => ({
          medication_id: m.medication_id ?? m.id ?? m.value,
          dosage: m.dosage ?? null,
          frequency: m.frequency ?? null,
          duration: m.duration ?? null,
          notes: m.notes ?? null,
        }))
      : [];

    const extra_details = {
      surgery_details: checkboxes.surgery ? details.surgery_details || null : null,
      referral_details: checkboxes.referral ? details.referral_details || null : null,
      counselling_details: checkboxes.counselling ? details.counselling_details || null : null,
      therapy_details: checkboxes.therapy ? details.therapy_details || null : null,
      low_vision_aid_details: checkboxes.lowVisionAid ? details.low_vision_aid_details || null : null,
    };

    return {
      appointment: appointmentId,
      options,
      refractive_prescription,
      medications: meds,
      extra_details,
      // status_override: "pending_pharmacy", // if your API needs it
    };
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    try {
      if (!validateBeforeConfirm()) return;
      setConfirmSave(false);

      const payload = buildPayload();
      showToast("Saving management plan...", "info");

      // RTK Query mutation
      await createManagementPlan({ appointmentId, data: payload }).unwrap();

      // Optional: mark clinical side complete (if available)
      // await markCompleted({ appointmentId }).unwrap();

      showToast("Management saved. Consultation completed.", "success");
      navigate("/"); // Dashboard
    } catch (err) {
      console.error(err);
      const msg =
        err?.data?.detail ||
        err?.data?.message ||
        err?.error ||
        err?.message ||
        "Failed to save management.";
      showToast(msg, "error");
    }
  };

  // ---------------- RENDER ----------------
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
                onClick={handleSubmit}
                disabled={isCreatingManagementPlan}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
              >
                {isCreatingManagementPlan ? "Saving..." : "Yes, Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optional success modal (not used since we redirect immediately) */}
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
                <p className="text-base font-medium">You have finished attending to your patient.</p>
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
                medications={medsList}
                medicationTypes={medicationTypes}
                selectedTypeId={selectedTypeId}
                setSelectedTypeId={setSelectedTypeId}
                isLoadingMeds={
                  isMedicationsLoading || isMedicationTypesLoading || isFilteringMedications
                }
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
              if (validateBeforeConfirm()) setConfirmSave(true);
            }}
            className="w-44 h-14 p-4 rounded-lg bg-[#2f3192] text-white disabled:opacity-60"
            disabled={isCreatingManagementPlan || isManagementPlanLoading}
          >
            Save & Finish
          </button>
        </div>
      </form>
    </div>
  );
};

export default Management;
