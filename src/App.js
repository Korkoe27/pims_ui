import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import "./App.css";

import {
  CaseHistory,
  PersonalInfo,
  VisualAcuity,
  Internals,
  Externals,
  Refraction,
  ExtraTests,
  Diagnosis,
  Management,
  CreateAppointment,
} from "./components";

import {
  Consultation,
  Dashboard,
  Appointments,
  GeneralAppointments,
  SpecialAppointments,
  Pharmacy,
  Inventory,
  Patients,
  PatientDetails,
  Login,
  PatientSearchResults,
  AbsentRequest,
  MyPortal,
  CaseReviews,
  ClinicSchedule,
  PendingReviews,
  Reports,
  MyCases,
  MyScores,
  PharmacyOrder,
} from "./pages";

import Layout from "./pages/Layout";
import ProtectedRoute from "./hooks/ProtectedRoute";
import LoginLoader from "./components/LoginLoader";

// Import the actual Case Management Guide page component
import CaseManagementGuide from "./components/CaseManagementGuide";

// Page wrapper to read :appointmentId from the URL and pass to the component
const CaseManagementGuidePage = () => {
  const { appointmentId } = useParams();
  return (
    <CaseManagementGuide
      appointmentId={appointmentId}
      role={window?.__APP_ROLE__ || "student"}
      // Optionally wire these if you want in-page navigation to other consultation tabs:
      // setActiveTab={(tab) => navigate(`/consultation/${appointmentId}/${tab}`)}
      // setTabCompletionStatus={() => {}}
    />
  );
};

// Optional redirect to keep old /appointments/:id/case-guide links working
const CaseGuideRedirect = () => {
  const { appointmentId } = useParams();
  return <Navigate to={`/consultation/${appointmentId}/case-guide`} replace />;
};

const App = () => {
  const { loading } = useSelector((state) => state.auth);

  if (loading) return <LoginLoader />;

  return (
    <div className="bg-[#f9fafb]">
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Core pages */}
            <Route path="my-patients" element={<Patients />} />
            <Route path="patients-details" element={<PatientDetails />} />
            <Route path="register-patient" element={<PersonalInfo />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="general-appointments" element={<GeneralAppointments />} />
            <Route path="special-appointments" element={<SpecialAppointments />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="pharmacy" element={<Pharmacy />}>
              <Route path="order/:orderId" element={<PharmacyOrder />} />
            </Route>

            {/* Direct single-step routes */}
            <Route path="case-history/:appointmentId" element={<CaseHistory />} />
            <Route path="visual-acuity/:appointmentId" element={<VisualAcuity />} />
            <Route path="externals/:appointmentId" element={<Externals />} />
            <Route path="internals/:appointmentId" element={<Internals />} />
            <Route path="refraction/:appointmentId" element={<Refraction />} />
            <Route path="extra-tests/:appointmentId" element={<ExtraTests />} />
            <Route path="diagnosis" element={<Diagnosis />} />
            <Route path="management" element={<Management />} />
            <Route path="createAppointment" element={<CreateAppointment />} />

            {/* Consultation flow with nested routes */}
            <Route path="consultation/:appointmentId" element={<Consultation />}>
              <Route index element={<Navigate to="management" replace />} />
              <Route path="management" element={<Management />} />
              {/* NEW: Case Management Guide as a standalone page under consultation */}
              <Route path="case-guide" element={<CaseManagementGuidePage />} />
              {/* You can add more nested routes later:
                  <Route path="submit" element={<Submit />} />
                  <Route path="logs" element={<Logs />} />
                  <Route path="complete" element={<Complete />} />
              */}
            </Route>

            {/* Optional redirect to support old /appointments/:id/case-guide links */}
            <Route
              path="appointments/:appointmentId/case-guide"
              element={<CaseGuideRedirect />}
            />

            {/* Other pages */}
            <Route path="patients/search" element={<PatientSearchResults />} />
            <Route path="absent-request" element={<AbsentRequest />} />
            <Route path="my-portal" element={<MyPortal />} />
            <Route path="case-reviews" element={<CaseReviews />} />
            <Route path="clinic-schedule" element={<ClinicSchedule />} />
            <Route path="pending-reviews" element={<PendingReviews />} />
            <Route path="reports" element={<Reports />} />
            <Route path="my-cases" element={<MyCases />} />
            <Route path="my-scores" element={<MyScores />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
