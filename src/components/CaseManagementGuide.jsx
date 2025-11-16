import React, { useEffect, useState } from "react";
import { showToast } from "../components/ToasterHelper";
import {
  useGetCaseManagementGuideQuery,
  useUpdateCaseManagementGuideMutation,
} from "../redux/api/features/managementApi";
import useConsultationContext from "../hooks/useConsultationContext";

const CaseManagementGuide = ({ appointmentId, setActiveTab }) => {
  const [rows, setRows] = useState([
    { diagnosis: "", management_plan: "", comments: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const { versionId } = useConsultationContext();

  // ✅ Fetch existing guide
  const { data: guideData, isLoading } = useGetCaseManagementGuideQuery({ appointmentId, versionId });
  const [updateCaseGuide] = useUpdateCaseManagementGuideMutation();

  // ✅ Hydrate from backend if existing data present
  useEffect(() => {
    if (guideData?.table_rows?.length > 0) {
      setRows(
        guideData.table_rows.map((r) => ({
          id: r.id,
          diagnosis: r.diagnosis || "",
          management_plan: r.management_plan || "",
          comments: r.comments || "",
        }))
      );
    }
  }, [guideData]);

  /* ---------------------------------------------------------------------
     Handlers
  --------------------------------------------------------------------- */
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { diagnosis: "", management_plan: "", comments: "" }]);
  };

  const removeRow = (index) => {
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateCaseGuide({
        appointmentId,
        versionId,
        data: { table_rows: rows },
      }).unwrap();

      showToast("Case Management Guide saved successfully.", "success");
      setActiveTab("submit"); // ✅ Move to Submit tab after saving
    } catch (err) {
      console.error(err);
      showToast("Failed to save Case Management Guide.", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------------------------------
     Render
  --------------------------------------------------------------------- */
  if (isLoading) {
    return <p className="text-center text-gray-500">Loading guide...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md shadow border">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#101928]">
          Case Management Guide
        </h1>
      </header>

      <section className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="border p-2 text-left w-1/3">Diagnosis</th>
              <th className="border p-2 text-left w-1/3">Management Plan</th>
              <th className="border p-2 text-left w-1/3">Comments</th>
              <th className="border p-2 text-center w-20">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="odd:bg-white even:bg-gray-50">
                <td className="border p-2">
                  <textarea
                    value={row.diagnosis}
                    onChange={(e) =>
                      handleChange(idx, "diagnosis", e.target.value)
                    }
                    placeholder="Enter diagnosis..."
                    rows={2}
                    className="w-full border-gray-300 rounded-md text-sm p-2 focus:ring-[#2f3192] focus:border-[#2f3192]"
                  />
                </td>
                <td className="border p-2">
                  <textarea
                    value={row.management_plan}
                    onChange={(e) =>
                      handleChange(idx, "management_plan", e.target.value)
                    }
                    placeholder="Enter management plan..."
                    rows={2}
                    className="w-full border-gray-300 rounded-md text-sm p-2 focus:ring-[#2f3192] focus:border-[#2f3192]"
                  />
                </td>
                <td className="border p-2">
                  <textarea
                    value={row.comments}
                    onChange={(e) =>
                      handleChange(idx, "comments", e.target.value)
                    }
                    placeholder="Enter comments..."
                    rows={2}
                    className="w-full border-gray-300 rounded-md text-sm p-2 focus:ring-[#2f3192] focus:border-[#2f3192]"
                  />
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => removeRow(idx)}
                    className="text-red-500 hover:text-red-700"
                    disabled={rows.length === 1}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={addRow}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
        >
          + Add Row
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("management")}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ← Back to Management
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-md text-white ${
              saving
                ? "bg-[#2f3192]/60 cursor-not-allowed"
                : "bg-[#2f3192] hover:opacity-90"
            }`}
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaseManagementGuide;
