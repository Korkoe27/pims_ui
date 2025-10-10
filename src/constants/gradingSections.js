// Constants for grading sections matching Django backend
export const GRADING_SECTIONS = {
  CASE_HISTORY: {
    value: "case_history",
    label: "Case History",
    gradingLabel: "Grading: Case History",
  },
  VISUAL_ACUITY: {
    value: "visual_acuity",
    label: "Visual Acuity",
    gradingLabel: "Grading: Visual Acuity",
  },
  INTERNAL_OBSERVATION: {
    value: "internal_observation",
    label: "Internal Observation",
    gradingLabel: "Grading: Internal Observation",
  },
  EXTERNAL_OBSERVATION: {
    value: "external_observation",
    label: "External Observation",
    gradingLabel: "Grading: External Observation",
  },
  REFRACTION: {
    value: "refraction",
    label: "Refraction",
    gradingLabel: "Grading: Refraction",
  },
  EXTRA_TEST: {
    value: "extra_test",
    label: "Extra Test",
    gradingLabel: "Grading: Extra Test",
  },
  DIAGNOSIS: {
    value: "diagnosis",
    label: "Diagnosis",
    gradingLabel: "Grading: Diagnosis",
  },
  MANAGEMENT: {
    value: "management",
    label: "Management",
    gradingLabel: "Grading: Management",
  },
  MANAGEMENT_GUIDE: {
    value: "management_guide",
    label: "Management Guide",
    gradingLabel: "Grading: Management Guide",
  },
  LOGS: {
    value: "logs",
    label: "Logs",
    gradingLabel: "Grading: Logs",
  },
};

// Helper function to get section config by value
export const getSectionConfig = (sectionValue) => {
  return Object.values(GRADING_SECTIONS).find(
    (section) => section.value === sectionValue
  );
};

// Helper function to get section config by key
export const getSectionConfigByKey = (sectionKey) => {
  return GRADING_SECTIONS[sectionKey];
};
