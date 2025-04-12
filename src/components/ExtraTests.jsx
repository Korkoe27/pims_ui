import React, { useState } from "react";
import ExtraTestModal from "./ExtraTestModal"; // 👈 import modal
import { showToast } from "../components/ToasterHelper";

const ExtraTestsButtons = ({ name, title, onClick }) => (
  <button
    type="button"
    name={name}
    onClick={() => onClick(name)}
    className="w-48 py-12 border text-[#2f3192] border-dashed border-[#2f3192] rounded-xl text-center"
  >
    <span dangerouslySetInnerHTML={{ __html: title }}></span>
  </button>
);

const ExtraTests = ({ appointmentId, setFlowStep, setActiveTab }) => {
  const proceedToDiagnosis = () => {
    showToast("Extra tests submitted!", "success");
    setFlowStep("diagnosis");
  };

  const [testData, setTestData] = useState({});
  const [activeTest, setActiveTest] = useState(null); // Which test we're editing
  const [showModal, setShowModal] = useState(false);

  const handleSaveTest = (data) => {
    setTestData((prev) => ({
      ...prev,
      [activeTest]: data,
    }));
    showToast(`Saved ${activeTest} test ✅`, "success");
  };

  const handleOpenModal = (testName) => {
    setActiveTest(testName);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setActiveTest(null);
  };

  const tests = [
    { name: "aoa", title: "Amplitude of Accommodation <br> (AOA)" },
    { name: "npc", title: "Near Point of Convergence <br> (NPC)" },
    { name: "coverTest", title: "Cover Test" },
    {
      name: "confrontationalVisualFieldTest",
      title: "Confrontational <br> Visual Field Test",
    },
    { name: "vonGraefeTest", title: "Von Graefe Test" },
    {
      name: "positiveRelativeAccommodation",
      title: "Positive Relative <br> Accommodation",
    },
    {
      name: "negativeRelativeAccommodation",
      title: "Negative Relative <br> Accommodation",
    },
    {
      name: "perimetry_visualFieldTest",
      title: "Perimetry <br> (Visual Field Test)",
    },
    { name: "oct", title: "Optical Coherence Tomography <br> (OCT)" },
    { name: "cornealTopography", title: "Corneal <br> Topography" },
    { name: "pachymetry", title: "Pachymetry" },
    { name: "colorVisionTesting", title: "Color Vision <br> Testing" },
    { name: "gonioscopy", title: "Gonioscopy" },
    { name: "keratometry", title: "Keratometry" },
    { name: "abScan", title: "A-Scan <br> or <br> B-Scan" },
    { name: "fluoresceinAngiography", title: "Fluorescein <br> Angiography" },
    { name: "oct_a", title: "OCT-A" },
  ];

  return (
    <div className="my-8 px-8 flex flex-col gap-12">
      <h1 className="text-2xl font-bold text-center">Extra Tests</h1>
      <form className="flex flex-col gap-20">
        <section className="grid grid-cols-5 gap-11">
          <button
            className="w-48 py-12 text-wrap border text-[#2f3192] border-dashed border-[#2f3192] rounded-xl text-center"
            type="button"
          >
            <span className="text-xl">+</span> Add a Test
          </button>
          {tests.map((test) => (
            <ExtraTestsButtons
              key={test.name}
              name={test.name}
              title={test.title}
              onClick={handleOpenModal}
            />
          ))}
        </section>

        <div className="mt-8 flex gap-6 justify-center">
          <button
            type="button"
            onClick={() => setActiveTab("refraction")}
            className="w-56 h-14 p-4 rounded-lg border border-[#2f3192] text-[#2f3192] bg-white hover:bg-indigo-50 transition"
          >
            ← Back to Refraction
          </button>

          <button
            type="button"
            onClick={proceedToDiagnosis}
            className="w-56 h-14 p-4 rounded-lg bg-[#2f3192] text-white hover:bg-[#1e217a] transition"
          >
            Proceed to Diagnosis
          </button>
        </div>
      </form>

      {/* Modal */}
      <ExtraTestModal
        isOpen={showModal}
        onClose={handleCloseModal}
        testName={activeTest}
        initialData={testData[activeTest]}
        onSave={handleSaveTest}
      />
    </div>
  );
};

export default ExtraTests;
