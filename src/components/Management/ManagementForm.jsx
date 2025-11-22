import React, { useEffect } from "react";
import RefractiveCorrectionSection from "../RefractiveCorrectionSection";
import MedicationForm from "../MedicationForm";
import SupervisorGradingButton from "../ui/buttons/SupervisorGradingButton";

const ManagementForm = ({
  appointmentId,
  section,
  sectionLabel,
  checkboxes,
  setCheckboxes,
  prescription,
  setPrescription,
  details,
  setDetails,
  selectedMedications,
  setSelectedMedications,
  selectedRefractiveCorrectionTypes,
  setSelectedRefractiveCorrectionTypes,
  selectedLensTypes,
  setSelectedLensTypes,
  medsList,
  medicationTypes,
  selectedTypeId,
  setSelectedTypeId,
  isLoadingMeds,
  isCreatingManagementPlan,
  onSaveDraftAndNext,
  saveButtonLabel = "Save & Next",
  setFlowStep,
  managementPlan, // ✅ newly passed for hydration
}) => {
  // ✅ Hydrate existing management plan data
  useEffect(() => {
    if (managementPlan) {
      setCheckboxes({
        refractiveCorrection: managementPlan.refractive_correction || false,
        medications: managementPlan.medications || false,
        counselling: managementPlan.counselling || false,
        lowVisionAid: managementPlan.low_vision_aid || false,
        therapy: managementPlan.therapy || false,
        surgery: managementPlan.surgery || false,
        referral: managementPlan.referral || false,
      });

      setPrescription({
        od_sph: managementPlan.od_sph || "",
        od_cyl: managementPlan.od_cyl || "",
        od_axis: managementPlan.od_axis || "",
        od_add: managementPlan.od_add || "",
        os_sph: managementPlan.os_sph || "",
        os_cyl: managementPlan.os_cyl || "",
        os_axis: managementPlan.os_axis || "",
        os_add: managementPlan.os_add || "",
        type_of_lens: managementPlan.type_of_lens?.name || "",
        pd: managementPlan.pd || "",
        segment_height: managementPlan.segment_height || "",
        fitting_cross_height: managementPlan.fitting_cross_height || "",
      });

      // ✅ Hydrate selected refractive correction types
      if (managementPlan.refractive_correction_types) {
        setSelectedRefractiveCorrectionTypes(
          managementPlan.refractive_correction_types.map((type) => type.id)
        );
      }

      // ✅ Hydrate selected lens types
      if (managementPlan.lens_types) {
        setSelectedLensTypes(
          managementPlan.lens_types.map((type) => type.id)
        );
      }

      setDetails({
        counselling_details: managementPlan.counselling_details || "",
        low_vision_aid_details: managementPlan.low_vision_aid_details || "",
        therapy_details: managementPlan.therapy_details || "",
        surgery_details: managementPlan.surgery_details || "",
        referral_details: managementPlan.referral_details || "",
      });
    }
  }, [managementPlan, setCheckboxes, setPrescription, setDetails, setSelectedRefractiveCorrectionTypes, setSelectedLensTypes]);

  return (
    <div className="bg-white rounded-md shadow p-4 w-full">
      {/* Header with Grading Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#101928]">Management</h1>
        <SupervisorGradingButton
          appointmentId={appointmentId}
          section={section}
          sectionLabel={sectionLabel || "Grading: Management"}
        />
      </div>

      <form className="flex flex-col gap-5 w-fit">
        <main className="flex gap-40">
          <section className="flex flex-col gap-12 w-fit">
            {/* ✅ Checkboxes */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-base">
                Treatment / Management Option(s)
              </label>
            <div className="grid grid-cols-2 gap-5">
              {Object.keys(checkboxes).map((key) => (
                <label key={key} className="flex items-center gap-1 capitalize">
                  <input
                    type="checkbox"
                    name={key}
                    checked={checkboxes[key]}
                    onChange={(e) =>
                      setCheckboxes((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.checked,
                      }))
                    }
                    className="h-5 w-5"
                  />
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
              ))}
            </div>
          </div>

          {/* ✅ Refractive Correction Section */}
          {checkboxes.refractiveCorrection && (
            <RefractiveCorrectionSection
              prescription={prescription}
              handleInputChange={(e) =>
                setPrescription((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              selectedTypes={selectedRefractiveCorrectionTypes}
              setSelectedTypes={setSelectedRefractiveCorrectionTypes}
              selectedLensTypes={selectedLensTypes}
              setSelectedLensTypes={setSelectedLensTypes}
            />
          )}

          {/* ✅ Medication Section */}
          {checkboxes.medications && (
            <MedicationForm
              selectedMedications={selectedMedications}
              setSelectedMedications={setSelectedMedications}
              medications={medsList}
              medicationTypes={medicationTypes}
              selectedTypeId={selectedTypeId}
              setSelectedTypeId={setSelectedTypeId}
              isLoadingMeds={isLoadingMeds}
            />
          )}

          {/* ✅ Dynamic details textareas */}
          {[
            "surgery",
            "referral",
            "counselling",
            "therapy",
            "low_vision_aid",
          ].map((field) => {
            if (!checkboxes[field] && !(field === "low_vision_aid" && checkboxes.lowVisionAid))
              return null;
            const label = `${field.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase())} Details`;
            const name = `${field}_details`;
            return (
              <div key={field} className="flex flex-col gap-2">
                <label className="font-medium">{label}</label>
                <textarea
                  name={name}
                  value={details[name] || ""}
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder={
                    field === "therapy"
                      ? "Type of therapy or exercises..."
                      : "Enter details..."
                  }
                />
              </div>
            );
          })}
        </section>
      </main>

      {/* ✅ Footer Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setFlowStep?.("diagnosis")}
          className="text-[#2f3192] border border-[#2f3192] hover:bg-[#2f3192] hover:text-white px-4 py-2 rounded-md transition font-medium"
        >
          ← Back to Diagnosis
        </button>

        <button
          type="button"
          onClick={onSaveDraftAndNext}
          className="px-4 py-2 rounded-md bg-[#2f3192] text-white disabled:opacity-60"
          disabled={isCreatingManagementPlan}
        >
          {saveButtonLabel}
        </button>
      </div>
    </form>
    </div>
  );
};

export default ManagementForm;
