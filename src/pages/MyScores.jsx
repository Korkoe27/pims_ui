import React from "react";
import PageContainer from "../components/PageContainer";

const MyScores = () => {
  // TODO: replace with API data (e.g., /tests/api/my-scores/)
  const summary = {
    overall: "85%",
    totalCases: 10,
    gradedCases: 8,
    pendingReviews: 2,
  };

  const sectionScores = [
    { section: "Consultation", score: "80%" },
    { section: "Diagnosis", score: "90%" },
    { section: "Management", score: "85%" },
    { section: "Case Management Guide", score: "82%" },
    { section: "Logs", score: "88%" },
  ];

  const recent = [
    { caseId: "CASE-001", patient: "John D.", score: "86%", status: "Graded" },
    { caseId: "CASE-002", patient: "Ama K.", score: "—",   status: "Pending Review" },
  ];

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-6">My Scores</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h2 className="text-sm font-semibold text-gray-600">Overall</h2>
          <p className="text-3xl font-bold text-green-600">{summary.overall}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h2 className="text-sm font-semibold text-gray-600">Total Cases</h2>
          <p className="text-3xl font-bold text-blue-600">{summary.totalCases}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h2 className="text-sm font-semibold text-gray-600">Graded</h2>
          <p className="text-3xl font-bold text-indigo-600">{summary.gradedCases}</p>
        </div>
        <div className="p-6 bg-white shadow rounded-lg text-center">
          <h2 className="text-sm font-semibold text-gray-600">Pending Reviews</h2>
          <p className="text-3xl font-bold text-red-600">{summary.pendingReviews}</p>
        </div>
      </div>

      {/* Section breakdown */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Section Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionScores.map((s) => (
            <div key={s.section} className="flex items-center justify-between border rounded-lg p-3">
              <span className="font-medium">{s.section}</span>
              <span className="text-gray-700 font-semibold">{s.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent cases */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Cases</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 pr-4">Case ID</th>
                <th className="py-2 pr-4">Patient</th>
                <th className="py-2 pr-4">Score</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.caseId} className="border-b">
                  <td className="py-2 pr-4">{r.caseId}</td>
                  <td className="py-2 pr-4">{r.patient}</td>
                  <td className="py-2 pr-4">{r.score}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 text-xs rounded bg-gray-100">{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default MyScores;
