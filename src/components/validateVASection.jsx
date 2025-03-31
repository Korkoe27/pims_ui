// validateVASection.js

export const isValidSnellen = (value) => /^\d{1,2}\/\d{1,2}$/.test(value.trim());

export const isValidLogMAR = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= -0.02 && num <= 3.5;
};

const validateVASection = (sectionData, chartType) => {
  const validator = chartType === "SNELLEN" ? isValidSnellen : isValidLogMAR;

  return Object.values(sectionData).every((eye) =>
    Object.values(eye).every((val) => !val || validator(val))
  );
};

export default validateVASection;
