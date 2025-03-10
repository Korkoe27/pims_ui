// import React, { useState, useEffect, useRef } from "react";
// import PropTypes from "prop-types";
// import { Trash2, ChevronDown } from "lucide-react";

// // ✅ Manually Define Affected Eye Options (Since They're Missing from Backend)
// const DEFAULT_AFFECTED_EYE_OPTIONS = [
//   { value: "OD", label: "Right Eye" },
//   { value: "OS", label: "Left Eye" },
//   { value: "OU", label: "Both Eyes" },
// ];

// const SearchableSelect = ({ label, name, options = [], value = [], onChange }) => {
//   const [search, setSearch] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedSymptoms, setSelectedSymptoms] = useState(value);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     setSelectedSymptoms(value || []);
//   }, [value]);

//   // ✅ Handles Selecting a Symptom
//   const handleSelect = (selectedOption) => {
//     if (!selectedSymptoms.some((s) => s.symptom === selectedOption.id)) {
//       const newSymptoms = [
//         ...selectedSymptoms,
//         {
//           symptom: selectedOption.id,
//           affected_eye: selectedOption.requires_affected_eye ? "OU" : null, // Default to "Both Eyes"
//           grading: selectedOption.requires_grading ? 1 : null,
//           notes: selectedOption.requires_notes ? "" : null,
//         },
//       ];
//       setSelectedSymptoms(newSymptoms);
//       onChange(newSymptoms); // ✅ Pass updated symptoms back to `CaseHistory`
//     }
//     setIsOpen(false);
//     setSearch("");
//   };

//   // ✅ Handles Updating `affected_eye`
//   const handleAffectedEyeChange = (symptomId, affectedEye) => {
//     const updatedSymptoms = selectedSymptoms.map((s) =>
//       s.symptom === symptomId ? { ...s, affected_eye: affectedEye } : s
//     );
//     setSelectedSymptoms(updatedSymptoms);
//     onChange(updatedSymptoms); // ✅ Ensure `affected_eye` updates in `CaseHistory`
//   };

//   // ✅ Handles Removing a Selected Symptom
//   const handleDelete = (symptomId) => {
//     const updatedSymptoms = selectedSymptoms.filter((s) => s.symptom !== symptomId);
//     setSelectedSymptoms(updatedSymptoms);
//     onChange(updatedSymptoms);
//   };

//   // ✅ Debugging: Log Data Being Fetched
//   useEffect(() => {
//     console.log(`🔍 [SearchableSelect] Fetched Options (${name}):`, options);
//     console.log(`📝 [SearchableSelect] Current Selected Symptoms (${name}):`, selectedSymptoms);
//   }, [options, selectedSymptoms]);

//   return (
//     <div className="relative w-full" ref={dropdownRef}>
//       <h1 className="text-base font-medium">{label}</h1>

//       {/* Dropdown Input Field */}
//       <div
//         className="flex items-center border p-3 rounded-md cursor-pointer bg-white relative"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="flex-1">
//           {selectedSymptoms.length > 0
//             ? selectedSymptoms.map((s) => options.find((o) => o.id === s.symptom)?.name).join(", ")
//             : "Select any that apply"}
//         </span>
//         <ChevronDown className="text-gray-500 absolute right-3" size={18} />
//       </div>

//       {/* Dropdown Menu */}
//       {isOpen && (
//         <div className="absolute w-full bg-white border rounded-md shadow-md mt-1 z-10">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full p-2 border-b"
//           />
//           <div className="max-h-40 overflow-y-auto">
//             {options
//               .filter(
//                 (option) =>
//                   !selectedSymptoms.some((s) => s.symptom === option.id) &&
//                   option.name.toLowerCase().includes(search.toLowerCase())
//               )
//               .map((option) => (
//                 <div key={option.id} className="p-2 cursor-pointer hover:bg-gray-100" onClick={() => handleSelect(option)}>
//                   {option.name}
//                 </div>
//               ))}
//           </div>
//         </div>
//       )}

//       {/* Selected Symptoms List */}
//       {selectedSymptoms.length > 0 && (
//         <div className="mt-2 space-y-2">
//           {selectedSymptoms.map((selected) => {
//             const selectedOption = options.find((opt) => opt.id === selected.symptom);
//             if (!selectedOption) return null;

//             return (
//               <div key={selected.symptom} className="flex flex-col p-3 border rounded-md bg-gray-50">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-sm font-medium">{selectedOption.name}</h2>
//                   <button onClick={() => handleDelete(selected.symptom)} className="text-red-500 hover:text-red-700">
//                     <Trash2 size={18} strokeWidth={2} color="red" />
//                   </button>
//                 </div>

//                 {/* ✅ Provide Affected Eye Options Manually */}
//                 {selectedOption.requires_affected_eye && (
//                   <div className="mt-2">
//                     <label className="text-sm font-medium">Affected Eye</label>
//                     <select
//                       value={selected.affected_eye || "OU"}
//                       onChange={(e) => handleAffectedEyeChange(selected.symptom, e.target.value)}
//                       className="p-2 border rounded-md"
//                     >
//                       {DEFAULT_AFFECTED_EYE_OPTIONS.map((eye) => (
//                         <option key={eye.value} value={eye.value}>
//                           {eye.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {/* ✅ Conditionally Show Grading Field */}
//                 {selectedOption.requires_grading && (
//                   <div className="mt-2">
//                     <label className="text-sm font-medium">Grading</label>
//                     <input
//                       type="number"
//                       min="1"
//                       max="5"
//                       value={selected.grading || 1}
//                       onChange={(e) => {
//                         const newGrading = e.target.value;
//                         const updatedSymptoms = selectedSymptoms.map((s) =>
//                           s.symptom === selected.symptom ? { ...s, grading: newGrading } : s
//                         );
//                         setSelectedSymptoms(updatedSymptoms);
//                         onChange(updatedSymptoms);
//                       }}
//                       className="p-2 border rounded-md"
//                     />
//                   </div>
//                 )}

//                 {/* ✅ Conditionally Show Notes Field */}
//                 {selectedOption.requires_notes && (
//                   <div className="mt-2">
//                     <label className="text-sm font-medium">Notes</label>
//                     <textarea
//                       value={selected.notes || ""}
//                       onChange={(e) => {
//                         const newNotes = e.target.value;
//                         const updatedSymptoms = selectedSymptoms.map((s) =>
//                           s.symptom === selected.symptom ? { ...s, notes: newNotes } : s
//                         );
//                         setSelectedSymptoms(updatedSymptoms);
//                         onChange(updatedSymptoms);
//                       }}
//                       placeholder="Enter notes..."
//                       className="p-3 border border-gray-300 rounded-md w-full h-20"
//                     ></textarea>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// SearchableSelect.propTypes = {
//   label: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   options: PropTypes.array.isRequired,
//   value: PropTypes.array,
//   onChange: PropTypes.func.isRequired,
// };

// SearchableSelect.defaultProps = {
//   value: [],
// };

// export default SearchableSelect;
