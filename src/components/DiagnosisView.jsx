import React, { useEffect, useState } from "react";
import useDiagnosisData from "../hooks/useDiagnosisData";

const DiagnosisView = ({ appointmentId }) => {
  const { appointmentDiagnosis, isDiagnosisLoading, isDiagnosisError } =
    useDiagnosisData(appointmentId);

  const [diagnosisData, setDiagnosisData] = useState(null);

  useEffect(() => {
    if (appointmentDiagnosis) {
      setDiagnosisData({
        differential_diagnosis:
          appointmentDiagnosis.differential_diagnosis || "",
        management_plan: appointmentDiagnosis.management_plan || "",
        final_diagnoses_info: appointmentDiagnosis.final_diagnoses_info || [],
        queries: appointmentDiagnosis.queries || [],
      });
    }
  }, [appointmentDiagnosis]);

  if (isDiagnosisLoading)
    return <p className="text-gray-500">Loading diagnosis...</p>;
  if (isDiagnosisError || !diagnosisData)
    return <p className="text-red-500">No diagnosis found.</p>;

  return (
    <div className="bg-white p-6 rounded shadow-md max-h-[80vh] overflow-y-auto space-y-6">
      <h1 className="text-2xl font-bold text-[#2f3192]">Diagnosis</h1>

      <div>
        <h4 className="font-semibold text-gray-700">Differential Diagnosis:</h4>
        <p className="text-gray-600 whitespace-pre-wrap">
          {diagnosisData.differential_diagnosis || "N/A"}
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Final Diagnoses:</h4>
        {diagnosisData.final_diagnoses_info.length === 0 ? (
          <p className="text-gray-600">None recorded.</p>
        ) : (
          <div className="space-y-3">
            {diagnosisData.final_diagnoses_info.map((d) => (
              <div
                key={d.id}
                className="bg-gray-50 p-3 border rounded space-y-1"
              >
                <p>
                  <strong>{d.name}</strong>
                </p>
                {d.affected_eye && (
                  <p className="text-sm">Eye: {d.affected_eye}</p>
                )}
                {d.notes && <p className="text-sm">Notes: {d.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Queries:</h4>
        {diagnosisData.queries.length === 0 ? (
          <p className="text-gray-600">None recorded.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {diagnosisData.queries.map((q, idx) => (
              <li key={idx}>{q.query}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-gray-700">Management Plan:</h4>
        <p className="text-gray-600 whitespace-pre-wrap">
          {diagnosisData.management_plan || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default DiagnosisView;
