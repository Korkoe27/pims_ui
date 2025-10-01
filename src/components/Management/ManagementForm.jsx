import React from "react";
import RefractiveCorrectionSection from "../RefractiveCorrectionSection";
import MedicationForm from "../MedicationForm";

const ManagementForm = ({
  checkboxes,
  setCheckboxes,
  prescription,
  setPrescription,
  details,
  setDetails,
  selectedMedications,
  setSelectedMedications,
  medsList,
  medicationTypes,
  selectedTypeId,
  setSelectedTypeId,
  isLoadingMeds,
  isCreatingManagementPlan,
  onSaveDraftAndNext,
  setFlowStep,
}) => {
  return (
    <form className="flex flex-col gap-5 w-fit">
      <main className="flex gap-40">
        <section className="flex flex-col gap-12 w-fit">
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

          {checkboxes.refractiveCorrection && (
            <RefractiveCorrectionSection
              prescription={prescription}
              handleInputChange={(e) =>
                setPrescription((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
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
              isLoadingMeds={isLoadingMeds}
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
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      [e.target.name]: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder={
                    field === "therapy" ? "Type of therapy or exercises..." : ""
                  }
                />
              </div>
            );
          })}
        </section>
      </main>

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
          Save Draft & Continue
        </button>
      </div>
    </form>
  );
};

export default ManagementForm;
