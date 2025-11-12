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
        final_diagnoses_info: appointmentDiagnosis.final_diagnoses_info || [],
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
        <h4 className="font-semibold text-gray-700 mb-2">Diagnoses:</h4>
        {diagnosisData.final_diagnoses_info.length === 0 ? (
          <p className="text-gray-600">None recorded.</p>
        ) : (
          <div className="space-y-3">
            {diagnosisData.final_diagnoses_info.map((d) => (
              <div
                key={d.id}
                className={`p-3 border rounded space-y-1 ${
                  d.is_query ? 'bg-yellow-50 border-yellow-300' : 'bg-green-50 border-green-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p>
                    <strong>{d.code?.diagnosis || d.name}</strong>
                    {d.code?.icd_code && (
                      <span className="text-sm text-gray-600 ml-2">
                        ({d.code.icd_code})
                      </span>
                    )}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    d.is_query 
                      ? 'bg-yellow-200 text-yellow-800' 
                      : 'bg-green-200 text-green-800'
                  }`}>
                    {d.is_query ? 'Query' : 'Final'}
                  </span>
                </div>
                {d.affected_eye && (
                  <p className="text-sm text-gray-700">Eye: {d.affected_eye}</p>
                )}
                {d.management_plan && (
                  <p className="text-sm text-gray-700">
                    Management: {d.management_plan}
                  </p>
                )}
                {d.notes && (
                  <p className="text-sm text-gray-600">Notes: {d.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisView;
