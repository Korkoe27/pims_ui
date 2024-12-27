import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ExtraTestsButtons = ({ name, title }) => (
  <button
    type="button"
    name={name}
    className="w-48 py-12 border text-[#2f3192] border-dashed border-[#2f3192] rounded-xl text-center"
  >
    <span dangerouslySetInnerHTML={{ __html: title }}></span>
  </button>
);

const ExtraTests = () => {
  const location = useLocation(); // Access state passed with navigate
  const { patient } = location.state || {}; // Extract patient if needed
  const navigate = useNavigate();

  const proceedToDiagnosis = () => {
    navigate("/diagnosis");
  };

  const tests = [
    { name: "aoa", title: "Amplitude of Accommodation <br> (AOA)" },
    { name: "npc", title: "Near Point of Convergence <br> (NPC)" },
    { name: "coverTest", title: "Cover Test" },
    { name: "confrontationalVisualFieldTest", title: "Confrontational <br> Visual Field Test" },
    { name: "vonGraefeTest", title: "Von Graefe Test" },
    { name: "positiveRelativeAccommodation", title: "Positive Relative <br> Accommodation" },
    { name: "negativeRelativeAccommodation", title: "Negative Relative <br> Accommodation" },
    { name: "perimetry_visualFieldTest", title: "Perimetry <br> (Visual Field Test)" },
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
            <ExtraTestsButtons key={test.name} name={test.name} title={test.title} />
          ))}
        </section>
        <button
          className="w-56 h-14 p-4 rounded-lg bg-[#2f3192] text-white mx-auto"
          onClick={proceedToDiagnosis}
          type="button"
        >
          Proceed to Diagnosis
        </button>
      </form>
    </div>
  );
};

export default ExtraTests;
