import { useEffect, useMemo, useState, Fragment } from "react";
import usePersonalHistoryData from "../hooks/usePersonalHistoryData";
import useFetchConditionsData from "../hooks/useFetchConditionsData";
import GradingSelect from "./GradingSelect";
import NotesTextArea from "./NotesTextArea"; // kept (used before; not used now for general notes)
import DeleteButton from "./DeleteButton";
import { showToast } from "../components/ToasterHelper";
import { hasFormChanged } from "../utils/deepCompare";
import GeneralNotesTextArea from "./GeneralNotesTextArea";
import TextInput from "./TextInput";
import ConditionsDropdown from "./ConditionsDropdown";
import ConditionPicker from "./ConditionPicker";
import NavigationButtons from "../components/NavigationButtons";

// Toggle debug logs in console
const DEBUG_HISTORY = false;

/* -------------------------------------------------------------------------- */
/* Helpers / Small Components                                                 */
/* -------------------------------------------------------------------------- */

function RequiredAsterisk({ show }) {
  if (!show) return null;
  return <span className="text-red-500">*</span>;
}

function SectionCard({ title, required, children }) {
  return (
    <div className="space-y-2">
      <label className="block font-medium mb-1">
        {title} <RequiredAsterisk show={required} />
      </label>
      {children}
    </div>
  );
}

/** NEW: per-eye notes input (two textareas) */
function PerEyeNotesTextArea({ valueOD, valueOS, onChangeOD, onChangeOS }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium mb-1">OD Notes</label>
        <textarea
          value={valueOD || ""}
          onChange={(e) => onChangeOD(e.target.value)}
          className="w-full border p-2 rounded min-h-[80px]"
          placeholder="Enter OD notes..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">OS Notes</label>
        <textarea
          value={valueOS || ""}
          onChange={(e) => onChangeOS(e.target.value)}
          className="w-full border p-2 rounded min-h-[80px]"
          placeholder="Enter OS notes..."
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const lastEyeExamOptions = [
  { value: "Never", label: "Never" },
  { value: "<1 week", label: "Less than 1 week" },
  { value: "<3 months", label: "Less than 3 months" },
  { value: "6 months - 1 year", label: "6 months - 1 year" },
  { value: "1 - 3 years", label: "1 - 3 years" },
  { value: ">3 years", label: "More than 3 years" },
  { value: "Cannot remember", label: "Cannot remember" },
];

/* -------------------------------------------------------------------------- */
/* Condition Card                                                             */
/* -------------------------------------------------------------------------- */

function ConditionCard({
  item,
  invalid,
  onDelete,
  onChangeText,
  onChangeDropdown,
  onChangeGrading,
  onChangeGeneralNotes, // (neutral notes)
  onChangeEyeNotes, // (per-eye notes)
}) {
  const showGeneralNotes =
    !!item.has_general_notes || !!item.has_notes; // backward compat
  const showPerEyeNotes = !!item.has_text_per_eye;

  return (
    <div
      className={`p-4 bg-gray-50 border rounded space-y-4 ${
        invalid ? "border-red-400" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">{item.name}</h4>
        <DeleteButton onClick={() => onDelete(item.id)} />
      </div>

      {item.has_text && (
        <TextInput
          valueOD={item?.OD?.text || ""}
          valueOS={item?.OS?.text || ""}
          onChangeOD={(val) => onChangeText(item.id, "OD", val)}
          onChangeOS={(val) => onChangeText(item.id, "OS", val)}
        />
      )}

      {item.has_dropdown && (
        <ConditionsDropdown
          valueOD={item?.OD?.dropdown || ""}
          valueOS={item?.OS?.dropdown || ""}
          options={item.dropdown_options || []}
          onChangeOD={(val) => onChangeDropdown(item.id, "OD", val)}
          onChangeOS={(val) => onChangeDropdown(item.id, "OS", val)}
        />
      )}

      {item.has_grading && (
        <GradingSelect
          valueOD={item?.OD?.grading || ""}
          valueOS={item?.OS?.grading || ""}
          onChangeOD={(val) => onChangeGrading(item.id, "OD", val)}
          onChangeOS={(val) => onChangeGrading(item.id, "OS", val)}
        />
      )}

      {/* NEW: Per-eye notes */}
      {showPerEyeNotes && (
        <PerEyeNotesTextArea
          valueOD={item?.OD?.notes || ""}
          valueOS={item?.OS?.notes || ""}
          onChangeOD={(val) => onChangeEyeNotes(item.id, "OD", val)}
          onChangeOS={(val) => onChangeEyeNotes(item.id, "OS", val)}
        />
      )}

      {/* NEW: General (neutral) notes */}
      {showGeneralNotes && (
        <GeneralNotesTextArea
          value={item?.notes || ""}
          onChange={(val) => onChangeGeneralNotes(item.id, val)}
          placeholder="Enter general notes (optional)..."
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable list-state hook for conditions                                    */
/* -------------------------------------------------------------------------- */

function useConditionList() {
  const [list, setList] = useState([]);

  const exists = (id) => list.some((x) => x.id === id);
  const formatOptions = (arr = []) =>
    arr.map((c) => ({ value: c.id, label: c.name, ...c }));

  const add = (option) => {
    const id = option.id ?? option.value;
    if (exists(id)) {
      showToast("This condition is already selected.", "error");
      return;
    }
    // Normalize/accept both naming styles from backend
    const newItem = {
      id,
      name: option.name ?? option.label,
      has_text: !!option.has_text,
      has_dropdown: !!option.has_dropdown,
      has_grading: !!option.has_grading,
      has_notes: !!(option.has_notes || option.has_general_notes), // compat
      has_general_notes: !!option.has_general_notes,
      has_text_per_eye: !!option.has_text_per_eye,
      has_checkbox: !!option.has_checkbox,
      dropdown_options: option.dropdown_options || [],
      OD: {}, // per-eye fields live here (text, dropdown, grading, checkbox, notes)
      OS: {},
      notes: "", // neutral notes
    };
    if (DEBUG_HISTORY) console.log("[COND:add]", newItem);
    setList((prev) => [...prev, newItem]);
  };

  const remove = (id) => {
    if (DEBUG_HISTORY) console.log("[COND:remove]", id);
    setList((prev) => prev.filter((x) => x.id !== id));
  };

  const setNotes = (id, val) => {
    // neutral (general) notes
    if (DEBUG_HISTORY) console.log("[COND:notes:general]", { id, val });
    setList((prev) => prev.map((x) => (x.id === id ? { ...x, notes: val } : x)));
  };

  const setEyeNotes = (id, eye, val) => {
    if (DEBUG_HISTORY) console.log("[COND:notes:eye]", { id, eye, val });
    setList((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, [eye]: { ...(x[eye] || {}), notes: val } } : x
      )
    );
  };

  const setField = (id, eye, fieldType, val) => {
    if (DEBUG_HISTORY) console.log("[COND:setField]", { id, eye, fieldType, val });
    setList((prev) =>
      prev.map((x) =>
        x.id === id ? { ...x, [eye]: { ...(x[eye] || {}), [fieldType]: val } } : x
      )
    );
  };

  // Hydrate from server entries (including per-eye notes and general notes)
  const hydrate = (entries = [], allConditions = []) => {
    const byId = {};
    const metaById = Object.fromEntries((allConditions || []).map((c) => [c.id, c]));
    if (DEBUG_HISTORY) console.log("[COND:hydrate:in]", entries);

    (entries || []).forEach((entry) => {
      const cId = entry.condition;
      const meta = metaById[cId] || {};
      if (!byId[cId]) {
        byId[cId] = {
          id: cId,
          name: entry.condition_name || meta.name || "Unknown",
          has_text: !!meta.has_text,
          has_dropdown: !!meta.has_dropdown,
          has_grading: !!meta.has_grading,
          has_notes: !!(meta.has_notes || meta.has_general_notes), // compat
          has_general_notes: !!meta.has_general_notes,
          has_text_per_eye: !!meta.has_text_per_eye,
          has_checkbox: !!meta.has_checkbox,
          dropdown_options: meta.dropdown_options || [],
          OD: {},
          OS: {},
          notes: "",
        };
      }

      if (entry.affected_eye === "OD" || entry.affected_eye === "OS") {
        // per-eye fields (including per-eye 'notes')
        byId[cId][entry.affected_eye] = {
          ...(byId[cId][entry.affected_eye] || {}),
          ...(entry.field_type ? { [entry.field_type]: entry.value } : {}),
          ...(entry.value && !entry.field_type ? { value: entry.value } : {}), // legacy fallback
        };
      } else {
        // neutral row (e.g., general notes)
        if (!entry.field_type || entry.field_type === "notes") {
          byId[cId].notes = entry.value ?? "";
        }
      }
    });

    const hydrated = Object.values(byId);
    if (DEBUG_HISTORY) console.log("[COND:hydrate:out]", hydrated);
    setList(hydrated);
  };

  // Build outgoing entries (including per-eye notes + general notes)
  const buildDetails = () => {
    const out = [];
    const deduceFieldType = (item) => {
      if (item.has_text) return "text";
      if (item.has_dropdown) return "dropdown";
      if (item.has_grading) return "grading";
      if (item.has_checkbox) return "checkbox";
      if (item.has_notes || item.has_general_notes) return "notes";
      return "text";
    };

    if (DEBUG_HISTORY) console.log("[COND:buildDetails:list]", list);

    list.forEach((item) => {
      // General (neutral) notes
      if (item.notes?.toString().trim()) {
        out.push({
          condition: item.id,
          affected_eye: null,
          field_type: "notes",
          value: item.notes,
        });
      }

      // Per-eye values (including per-eye notes)
      ["OD", "OS"].forEach((eye) => {
        const data = item[eye] || {};
        // Include 'notes' explicitly for per-eye notes if present
        ["text", "dropdown", "grading", "checkbox", "notes", "value"].forEach((ft) => {
          const v = data[ft];
          const hasValue = typeof v === "boolean" ? true : v?.toString?.().trim?.();
          if (hasValue) {
            const field_type = ft === "value" ? deduceFieldType(item) : ft;
            out.push({
              condition: item.id,
              affected_eye: eye,
              field_type,
              value: v,
            });
          }
        });
      });
    });

    if (DEBUG_HISTORY) console.log("[COND:buildDetails:out]", out);
    return out;
  };

  return {
    list,
    setList,
    formatOptions,
    add,
    remove,
    setNotes, // general
    setEyeNotes, // per-eye
    setField,
    hydrate,
    buildDetails,
  };
}

/* -------------------------------------------------------------------------- */
/* ConditionSection: selector + rendered list                                 */
/* -------------------------------------------------------------------------- */

function ConditionSection({
  title,
  required = false,
  options = [],
  values = [],
  onSelect,
  onDelete,
  onChangeText,
  onChangeDropdown,
  onChangeGrading,
  onChangeGeneralNotes,
  onChangeEyeNotes,
  invalidSet,
}) {
  return (
    <div>
      <ConditionPicker
        label={
          <span>
            {title} <RequiredAsterisk show={required} />
          </span>
        }
        options={options}
        selectedValues={values.map((c) => ({ id: c.id, name: c.name }))}
        onSelect={onSelect}
        conditionKey="id"
        conditionNameKey="name"
      />

      {values.length > 0 && (
        <div className="mt-4 space-y-4">
          {values.map((item) => (
            <ConditionCard
              key={item.id}
              item={item}
              invalid={invalidSet?.has(item.id)}
              onDelete={onDelete}
              onChangeText={(id, eye, val) => onChangeText(id, eye, val)}
              onChangeDropdown={(id, eye, val) => onChangeDropdown(id, eye, val)}
              onChangeGrading={(id, eye, val) => onChangeGrading(id, eye, val)}
              onChangeGeneralNotes={(id, val) => onChangeGeneralNotes(id, val)}
              onChangeEyeNotes={(id, eye, val) => onChangeEyeNotes(id, eye, val)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Validation Utilities                                                       */
/* -------------------------------------------------------------------------- */

const _hasUserValue = (v) =>
  typeof v === "boolean" || typeof v === "number" || v?.toString?.().trim?.();

const _hasAnyPerEyeInput = (cond) => {
  const checkEye = (eye) =>
    ["text", "dropdown", "grading", "checkbox", "value", "notes"].some(
      (ft) => _hasUserValue(cond?.[eye]?.[ft])
    );
  return checkEye("OD") || checkEye("OS");
};

function useSelectedConditionsValidator() {
  const [invalidConditionIds, setInvalidConditionIds] = useState(new Set());

  const validateSelectedConditions = (sections) => {
    const empties = [];
    const badIds = new Set();

    sections.forEach(({ name, list }) => {
      list.forEach((cond) => {
        if (!_hasAnyPerEyeInput(cond)) {
          empties.push(`${name} → ${cond.name}`);
          badIds.add(cond.id);
        }
      });
    });

    setInvalidConditionIds(badIds);

    if (empties.length) {
      showToast(
        `Please enter at least one OD/OS value for:\n• ${empties.join("\n• ")}`,
        "error"
      );
      return false;
    }
    return true;
  };

  const clearInvalidIfFilled = (list, id) => {
    const cond = list.find((c) => c.id === id);
    if (cond && _hasAnyPerEyeInput(cond)) {
      setInvalidConditionIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return {
    invalidConditionIds,
    validateSelectedConditions,
    clearInvalidIfFilled,
  };
}

/* -------------------------------------------------------------------------- */
/* Compact field-with-notes (Drug/Allergy/Social)                             */
/* -------------------------------------------------------------------------- */

function FieldWithNotes({
  label,
  required,
  value,
  onChange,
  notes,
  onChangeNotes,
  placeholder,
  notesPlaceholder,
}) {
  return (
    <SectionCard title={label} required={required}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder={placeholder}
      />
      <GeneralNotesTextArea
        value={notes}
        onChange={onChangeNotes}
        placeholder={notesPlaceholder}
      />
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function PersonalHistory({
  patientId,
  appointmentId,
  setActiveTab,
  setTabCompletionStatus,
}) {
  const {
    personalHistory,
    isLoading: loadingPersonalHistory,
    createPatientHistory,
    createPatientHistoryStatus,
  } = usePersonalHistoryData(patientId, appointmentId);

  const { medicalConditions, ocularConditions } = useFetchConditionsData();
  const isSaving = createPatientHistoryStatus.isLoading;
  const isFirstVisit = !personalHistory;

  // Baseline fields
  const [lastEyeExam, setLastEyeExam] = useState("");
  const [drugHistory, setDrugHistory] = useState("");
  const [drugNotes, setDrugNotes] = useState("");
  const [allergyHistory, setAllergyHistory] = useState("");
  const [allergyNotes, setAllergyNotes] = useState("");
  const [socialHistory, setSocialHistory] = useState("");
  const [socialNotes, setSocialNotes] = useState("");

  // Four independent condition lists
  const med = useConditionList();
  const ocu = useConditionList();
  const famMed = useConditionList();
  const famOcu = useConditionList();

  const [initialPayload, setInitialPayload] = useState(null);

  // Validator & invalid-id set for red borders
  const {
    invalidConditionIds,
    validateSelectedConditions,
    clearInvalidIfFilled,
  } = useSelectedConditionsValidator();

  // Derived loading state
  const isLoadingData = loadingPersonalHistory;
  const isLoadingOptions =
    !Array.isArray(medicalConditions) ||
    !Array.isArray(ocularConditions) ||
    medicalConditions.length === 0 ||
    ocularConditions.length === 0;

  const isLoading =
    (!isFirstVisit && !personalHistory) || isLoadingOptions;

  // Hydrate from server once available
  useEffect(() => {
    if (!personalHistory) return;

    setLastEyeExam(personalHistory.last_eye_examination || "");
    setDrugHistory(personalHistory.drug_history || "");
    setDrugNotes(personalHistory.drug_notes || "");
    setAllergyHistory(personalHistory.allergies || "");
    setAllergyNotes(personalHistory.allergy_notes || "");
    setSocialHistory(personalHistory.social_history || "");
    setSocialNotes(personalHistory.social_notes || "");

    med.hydrate(personalHistory.medical_history, medicalConditions);
    ocu.hydrate(personalHistory.ocular_history, ocularConditions);
    famMed.hydrate(personalHistory.family_medical_history, medicalConditions);
    famOcu.hydrate(personalHistory.family_ocular_history, ocularConditions);

    const snapshot = {
      patient: patientId,
      appointment: appointmentId,
      last_eye_examination: personalHistory.last_eye_examination || "",
      drug_entries: [
        { name: personalHistory.drug_history || "", notes: personalHistory.drug_notes || "" },
      ],
      allergy_entries: [
        { name: personalHistory.allergies || "", notes: personalHistory.allergy_notes || "" },
      ],
      social_entries: [
        { name: personalHistory.social_history || "", notes: personalHistory.social_notes || "" },
      ],
      medical_history: (personalHistory.medical_history || []).map((e) => ({
        condition: e.condition,
        affected_eye: e.affected_eye,
        field_type: e.field_type,
        value: e.value,
      })),
      ocular_history: (personalHistory.ocular_history || []).map((e) => ({
        condition: e.condition,
        affected_eye: e.affected_eye,
        field_type: e.field_type,
        value: e.value,
      })),
      family_medical_history: (personalHistory.family_medical_history || []).map((e) => ({
        condition: e.condition,
        affected_eye: e.affected_eye,
        field_type: e.field_type,
        value: e.value,
      })),
      family_ocular_history: (personalHistory.family_ocular_history || []).map((e) => ({
        condition: e.condition,
        affected_eye: e.affected_eye,
        field_type: e.field_type,
        value: e.value,
      })),
    };

    setInitialPayload(snapshot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalHistory, patientId, appointmentId, medicalConditions, ocularConditions]);

  // Required fields for first-time visits (notes remain optional)
  const validateRequiredFields = () => {
    if (!isFirstVisit) return true;
    const errors = [];
    if (!lastEyeExam) errors.push("Last eye examination is required.");
    if (!drugHistory) errors.push("Drug history is required.");
    if (!allergyHistory) errors.push("Allergy history is required.");
    if (!socialHistory) errors.push("Social history is required.");
    if (med.list.length === 0) errors.push("At least one medical condition is required.");
    if (ocu.list.length === 0) errors.push("At least one ocular condition is required.");
    if (famMed.list.length === 0) errors.push("Family medical history is required.");
    if (famOcu.list.length === 0) errors.push("Family ocular history is required.");
    if (errors.length) {
      showToast(errors.join(" "), "error");
      return false;
    }
    return true;
  };

  const buildPayload = () => ({
    patient: patientId,
    appointment: appointmentId,
    last_eye_examination: lastEyeExam,
    drug_entries: [{ name: drugHistory, notes: drugNotes }],
    allergy_entries: [{ name: allergyHistory, notes: allergyNotes }],
    social_entries: [{ name: socialHistory, notes: socialNotes }],
    medical_history: med.buildDetails(),
    ocular_history: ocu.buildDetails(),
    family_medical_history: famMed.buildDetails(),
    family_ocular_history: famOcu.buildDetails(),
  });

  const handleSave = async () => {
    if (!validateRequiredFields()) return;

    // Ensure each selected condition has at least one OD/OS input (notes may be empty)
    const ok = validateSelectedConditions([
      { name: "Medical History", list: med.list },
      { name: "Ocular History", list: ocu.list },
      { name: "Family Medical History", list: famMed.list },
      { name: "Family Ocular History", list: famOcu.list },
    ]);
    if (!ok) return;

    if (DEBUG_HISTORY) {
      console.log("[UI STATE] med.list", med.list);
      console.log("[UI STATE] famMed.list", famMed.list);
    }

    const payload = buildPayload();

    if (DEBUG_HISTORY) {
      console.log("[PAYLOAD] medical_history", payload.medical_history);
      console.log("[PAYLOAD] family_medical_history", payload.family_medical_history);
      console.log("[PAYLOAD] ocular_history", payload.ocular_history);
      console.log("[PAYLOAD] family_ocular_history", payload.family_ocular_history);
    }

    if (initialPayload && !hasFormChanged(initialPayload, payload)) {
      showToast("No changes detected", "info");
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        "Oculo-Medical History": true,
      }));
      setActiveTab("visual acuity");
      return;
    }

    try {
      showToast("Saving Oculo-Medical history...", "loading");
      await createPatientHistory(payload).unwrap();
      setTabCompletionStatus?.((prev) => ({
        ...prev,
        "Oculo-Medical History": true,
      }));
      showToast("Oculo-Medical history saved successfully!", "success");
      setActiveTab("visual acuity");
    } catch (err) {
      console.error("❌ Error saving Oculo-Medical history:", err);
      const detail = formatErrorMessage(err?.data);
      showToast(detail, "error");
    }
  };

  // Hook up invalid clearing as users type/select
  const onMedChangeField = (id, eye, ft, val) => {
    med.setField(id, eye, ft, val);
    clearInvalidIfFilled(med.list, id);
  };
  const onOcuChangeField = (id, eye, ft, val) => {
    ocu.setField(id, eye, ft, val);
    clearInvalidIfFilled(ocu.list, id);
  };
  const onFamMedChangeField = (id, eye, ft, val) => {
    famMed.setField(id, eye, ft, val);
    clearInvalidIfFilled(famMed.list, id);
  };
  const onFamOcuChangeField = (id, eye, ft, val) => {
    famOcu.setField(id, eye, ft, val);
    clearInvalidIfFilled(famOcu.list, id);
  };

  // NEW: handlers for notes (general + per-eye)
  const onChangeGeneralNotes = (listHook) => (id, val) => listHook.setNotes(id, val);
  const onChangeEyeNotes = (listHook) => (id, eye, val) => listHook.setEyeNotes(id, eye, val);

  // Memoized options
  const medicalOptions = useMemo(() => med.formatOptions(medicalConditions), [medicalConditions]);
  const ocularOptions = useMemo(() => ocu.formatOptions(ocularConditions), [ocularConditions]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Oculo-Medical History</h1>

      {isLoadingData ? (
        <p>Loading data. Please wait..</p>
      ) : (
        <Fragment>
          <div className="flex flex-col md:flex-row md:items-start gap-10">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              {/* Last Eye Exam */}
              <SectionCard title="Last Eye Examination" required={isFirstVisit}>
                <select
                  value={lastEyeExam}
                  onChange={(e) => setLastEyeExam(e.target.value)}
                  className="w-full border p-2 rounded"
                >
                  <option value="">-- Select --</option>
                  {lastEyeExamOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </SectionCard>

              {/* Drug */}
              <FieldWithNotes
                label="Drug History"
                required={isFirstVisit}
                value={drugHistory}
                onChange={setDrugHistory}
                notes={drugNotes}
                onChangeNotes={setDrugNotes}
                placeholder="E.g., Paracetamol"
                notesPlaceholder="Additional notes about the drug history..."
              />

              {/* Allergy */}
              <FieldWithNotes
                label="Allergies"
                required={isFirstVisit}
                value={allergyHistory}
                onChange={setAllergyHistory}
                notes={allergyNotes}
                onChangeNotes={setAllergyNotes}
                placeholder="E.g., Penicillin"
                notesPlaceholder="Enter notes about patient's allergies"
              />

              {/* Social */}
              <FieldWithNotes
                label="Social History"
                required={isFirstVisit}
                value={socialHistory}
                onChange={setSocialHistory}
                notes={socialNotes}
                onChangeNotes={setSocialNotes}
                placeholder="E.g., Smoker, Driver"
                notesPlaceholder="Enter notes about patient's social history"
              />

              {/* Medical History */}
              <ConditionSection
                title="Medical History"
                required={isFirstVisit}
                options={medicalOptions}
                values={med.list}
                onSelect={med.add}
                onDelete={med.remove}
                onChangeText={(id, eye, val) => onMedChangeField(id, eye, "text", val)}
                onChangeDropdown={(id, eye, val) => onMedChangeField(id, eye, "dropdown", val)}
                onChangeGrading={(id, eye, val) => onMedChangeField(id, eye, "grading", val)}
                onChangeGeneralNotes={onChangeGeneralNotes(med)}
                onChangeEyeNotes={onChangeEyeNotes(med)}
                invalidSet={invalidConditionIds}
              />
            </div>

            {/* Right Column */}
            <div className="flex-1 space-y-6">
              {/* Ocular History */}
              <ConditionSection
                title="Ocular History"
                required={isFirstVisit}
                options={ocularOptions}
                values={ocu.list}
                onSelect={ocu.add}
                onDelete={ocu.remove}
                onChangeText={(id, eye, val) => onOcuChangeField(id, eye, "text", val)}
                onChangeDropdown={(id, eye, val) => onOcuChangeField(id, eye, "dropdown", val)}
                onChangeGrading={(id, eye, val) => onOcuChangeField(id, eye, "grading", val)}
                onChangeGeneralNotes={onChangeGeneralNotes(ocu)}
                onChangeEyeNotes={onChangeEyeNotes(ocu)}
                invalidSet={invalidConditionIds}
              />

              {/* Family Medical History */}
              <ConditionSection
                title="Family Medical History"
                required={isFirstVisit}
                options={medicalOptions}
                values={famMed.list}
                onSelect={famMed.add}
                onDelete={famMed.remove}
                onChangeText={(id, eye, val) => onFamMedChangeField(id, eye, "text", val)}
                onChangeDropdown={(id, eye, val) => onFamMedChangeField(id, eye, "dropdown", val)}
                onChangeGrading={(id, eye, val) => onFamMedChangeField(id, eye, "grading", val)}
                onChangeGeneralNotes={onChangeGeneralNotes(famMed)}
                onChangeEyeNotes={onChangeEyeNotes(famMed)}
                invalidSet={invalidConditionIds}
              />

              {/* Family Ocular History */}
              <ConditionSection
                title="Family Ocular History"
                required={isFirstVisit}
                options={ocularOptions}
                values={famOcu.list}
                onSelect={famOcu.add}
                onDelete={famOcu.remove}
                onChangeText={(id, eye, val) => onFamOcuChangeField(id, eye, "text", val)}
                onChangeDropdown={(id, eye, val) => onFamOcuChangeField(id, eye, "dropdown", val)}
                onChangeGrading={(id, eye, val) => onFamOcuChangeField(id, eye, "grading", val)}
                onChangeGeneralNotes={onChangeGeneralNotes(famOcu)}
                onChangeEyeNotes={onChangeEyeNotes(famOcu)}
                invalidSet={invalidConditionIds}
              />
            </div>
          </div>
        </Fragment>
      )}

      <div className="mt-8">
        <NavigationButtons
          backLabel="← Back to Case History"
          backTo="case history"
          onBack={setActiveTab}
          onSave={handleSave}
          saving={isSaving}
          saveLabel="Save and Proceed"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error formatting (unchanged)                                               */
/* -------------------------------------------------------------------------- */

function formatErrorMessage(data) {
  if (!data) return "An unexpected error occurred.";
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data)) return data.join("\n");
  if (typeof data === "object") {
    const messages = [];
    for (const [key, value] of Object.entries(data)) {
      const label = key.replace(/_/g, " ").toUpperCase();
      if (Array.isArray(value)) {
        const formattedArray = value.map((item) => {
          if (typeof item === "string") return item;
          if (typeof item === "object") {
            return Object.entries(item)
              .map(
                ([subKey, subValue]) =>
                  `${subKey}: ${
                    Array.isArray(subValue) ? subValue.join(", ") : subValue
                  }`
              )
              .join("; ");
          }
          return item;
        });
        messages.push(`${label}: ${formattedArray.join("; ")}`);
      } else {
        messages.push(`${label}: ${value}`);
      }
    }
    return messages.join("\n");
  }
  return "An unexpected error occurred.";
}
