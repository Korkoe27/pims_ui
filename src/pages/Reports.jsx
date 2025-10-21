import React, { useState } from "react";
import PageContainer from "../components/PageContainer";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  useGetPatientReportsQuery,
  useGetAppointmentReportsQuery,
  useGetGradingReportsQuery,
  useGetDiagnosisReportsQuery,
  useGetInventoryReportsQuery,
} from "../redux/api/features/reportsApi";
import { downloadReport } from "../utils/downloadReport";

// ✅ Safe & Flexible Download Button
const DownloadButton = ({ dataset = [], file, fetchFullData }) => {
  const handleDownload = async () => {
    let exportData = Array.isArray(dataset) ? dataset : [];

    // Fetch full filtered data if provided
    if ((!exportData || exportData.length === 0) && fetchFullData) {
      const json = await fetchFullData();
      exportData = json.results || json.data || [];
    }

    if (!Array.isArray(exportData) || exportData.length === 0) {
      alert("No data available to download.");
      return;
    }

    // Normalize keys for clean Excel headers
    const normalizedData = exportData.map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([key, val]) => [key.replace(/_/g, " "), val])
      )
    );

    downloadReport(normalizedData, file);
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download Excel
    </button>
  );
};

// =============================================================
// ✅ Main Reports Page
// =============================================================
const Reports = () => {
  const [activeTab, setActiveTab] = useState("appointments"); // default to appointments
  const [filters, setFilters] = useState({ start_date: "", end_date: "" });
  const [page, setPage] = useState(1);

  // 🔹 Queries (no aggregate anymore — we want full raw data)
  const { data: patientData, isLoading: loadingPatients } =
    useGetPatientReportsQuery({ page, page_size: 10 }, { skip: activeTab !== "patients" });

  const { data: appointmentData, isLoading: loadingAppointments } =
    useGetAppointmentReportsQuery(
      { ...filters, page, page_size: 10 },
      { skip: activeTab !== "appointments" }
    );

  const { data: gradingData, isLoading: loadingGradings } =
    useGetGradingReportsQuery({ page, page_size: 10 }, { skip: activeTab !== "gradings" });

  const { data: diagnosisData, isLoading: loadingDiagnosis } =
    useGetDiagnosisReportsQuery({ page, page_size: 10 }, { skip: activeTab !== "diagnosis" });

  const { data: inventoryData, isLoading: loadingInventory } =
    useGetInventoryReportsQuery({ page, page_size: 10 }, { skip: activeTab !== "inventory" });

  const renderTable = (rows) => {
    if (!rows || rows.length === 0)
      return (
        <p className="text-gray-500 text-center mt-6">No data available.</p>
      );

    const headers = Object.keys(rows[0] || {});

    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((h) => (
                <th key={h} className="text-left px-3 py-2 border-b">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {headers.map((key) => (
                  <td key={key} className="px-3 py-2 border-b">
                    {row[key] ?? "--"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ==========================================================
  // 🔹 RENDER ACTIVE REPORT TAB
  // ==========================================================
  const renderReport = () => {
    // -------------------- APPOINTMENTS --------------------
    if (activeTab === "appointments") {
      if (loadingAppointments) return <LoadingSpinner />;

      const rows =
        appointmentData?.results?.map((a) => ({
          "Appointment Date": a.appointment_date,
          Status: a.status,
          Type: a.appointment_type,
          Patient: a.patient_name,
          "Submitted By": a.submitted_by_role ?? "--",
          "Lecturer ID": a.assigned_lecturer_id ?? "--",
        })) || [];

      const total = appointmentData?.count ?? 0;

      return (
        <>
          <h2 className="font-semibold text-lg mb-2">Appointments Report</h2>

          {/* 🔹 Date Filters */}
          <div className="flex gap-3 mb-4">
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) =>
                setFilters({ ...filters, start_date: e.target.value })
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) =>
                setFilters({ ...filters, end_date: e.target.value })
              }
              className="border px-2 py-1 rounded"
            />
            <button
              onClick={() => setPage(1)}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Filter
            </button>
          </div>

          {/* 🔹 Table */}
          {renderTable(rows)}

          {/* 🔹 Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={!appointmentData?.previous}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-sm text-gray-600">
              Page {page} of {Math.ceil(total / 10) || 1}
            </p>
            <button
              disabled={!appointmentData?.next}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* 🔹 Download */}
          <DownloadButton
            dataset={rows}
            file="appointments_report.xlsx"
            fetchFullData={async () => {
              const params = new URLSearchParams({
                start_date: filters.start_date || "",
                end_date: filters.end_date || "",
              });
              const res = await fetch(`/api/reports/appointments/?${params}`);
              return res.json();
            }}
          />
        </>
      );
    }

    // -------------------- PATIENTS --------------------
    if (activeTab === "patients") {
      if (loadingPatients) return <LoadingSpinner />;
      const rows = patientData?.results || patientData?.data || [];
      return (
        <>
          <h2 className="font-semibold text-lg mb-2">Patients Report</h2>
          {renderTable(rows)}
          <DownloadButton dataset={rows} file="patients_report.xlsx" />
        </>
      );
    }

    // -------------------- GRADINGS --------------------
    if (activeTab === "gradings") {
      if (loadingGradings) return <LoadingSpinner />;
      const rows = gradingData?.results || gradingData?.data || [];
      return (
        <>
          <h2 className="font-semibold text-lg mb-2">Gradings Report</h2>
          {renderTable(rows)}
          <DownloadButton dataset={rows} file="gradings_report.xlsx" />
        </>
      );
    }

    // -------------------- DIAGNOSIS --------------------
    if (activeTab === "diagnosis") {
      if (loadingDiagnosis) return <LoadingSpinner />;
      const rows = diagnosisData?.results || diagnosisData?.data || [];
      return (
        <>
          <h2 className="font-semibold text-lg mb-2">Diagnosis Report</h2>
          {renderTable(rows)}
          <DownloadButton dataset={rows} file="diagnosis_report.xlsx" />
        </>
      );
    }

    // -------------------- INVENTORY --------------------
    if (activeTab === "inventory") {
      if (loadingInventory) return <LoadingSpinner />;
      const rows = inventoryData?.results || inventoryData?.data || [];
      return (
        <>
          <h2 className="font-semibold text-lg mb-2">Inventory Report</h2>
          {renderTable(rows)}
          <DownloadButton dataset={rows} file="inventory_report.xlsx" />
        </>
      );
    }
  };

  const tabs = [
    { id: "appointments", label: "Appointments" },
    { id: "patients", label: "Patients" },
    { id: "gradings", label: "Gradings" },
    { id: "diagnosis", label: "Diagnosis" },
    { id: "inventory", label: "Inventory" },
  ];

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      <div className="flex space-x-4 border-b border-gray-300 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setPage(1);
            }}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderReport()}
    </PageContainer>
  );
};

export default Reports;
