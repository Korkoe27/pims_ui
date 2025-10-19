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
import CaseManagementGuide from "./components/CaseManagementGuide";

// ---------- Utility wrappers ----------
const CaseManagementGuidePage = () => {
  const { appointmentId } = useParams();
  return (
    <CaseManagementGuide
      appointmentId={appointmentId}
      role={window?.__APP_ROLE__ || "student"}
    />
  );
};

const CaseGuideRedirect = () => {
  const { appointmentId } = useParams();
  return <Navigate to={`/consultation/${appointmentId}/case-guide`} replace />;
};

// ---------- Main App ----------
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

          {/* Protected Shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Core Pages */}
            <Route
              path="my-patients"
              element={
                <ProtectedRoute requiredPermission="patients.view">
                  <Patients />
                </ProtectedRoute>
              }
            />
            <Route
              path="register-patient"
              element={
                <ProtectedRoute
                  requiredPermission="patients.create"
                  allowedRoles={["Lecturer", "Administrator", "Secretary"]}
                >
                  <PersonalInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="appointments"
              element={
                <ProtectedRoute requiredPermission="appointments.view">
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="createAppointment"
              element={
                <ProtectedRoute
                  requiredPermission="appointments.create"
                  allowedRoles={["Lecturer", "Intern"]}
                >
                  <CreateAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="case-reviews"
              element={
                <ProtectedRoute
                  requiredPermission="appointments.review"
                  allowedRoles={["Lecturer", "Supervisor"]}
                >
                  <CaseReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-scores"
              element={
                <ProtectedRoute
                  requiredPermission="appointments.view_grading"
                  allowedRoles={["Lecturer", "Supervisor"]}
                >
                  <MyScores />
                </ProtectedRoute>
              }
            />

            {/* Consultation Flow */}
            <Route
              path="consultation/:appointmentId"
              element={<Consultation />}
            >
              <Route index element={<Navigate to="management" replace />} />
              <Route path="management" element={<Management />} />
              <Route path="case-guide" element={<CaseManagementGuidePage />} />
            </Route>

            {/* Legacy redirect */}
            <Route
              path="appointments/:appointmentId/case-guide"
              element={<CaseGuideRedirect />}
            />

            {/* Other pages (general auth only) */}
            <Route path="patients-details" element={<PatientDetails />} />
            <Route path="general-appointments" element={<GeneralAppointments />} />
            <Route path="special-appointments" element={<SpecialAppointments />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="pharmacy" element={<Pharmacy />}>
              <Route path="order/:orderId" element={<PharmacyOrder />} />
            </Route>
            <Route path="case-history/:appointmentId" element={<CaseHistory />} />
            <Route path="visual-acuity/:appointmentId" element={<VisualAcuity />} />
            <Route path="externals/:appointmentId" element={<Externals />} />
            <Route path="internals/:appointmentId" element={<Internals />} />
            <Route path="refraction/:appointmentId" element={<Refraction />} />
            <Route path="extra-tests/:appointmentId" element={<ExtraTests />} />
            <Route path="diagnosis" element={<Diagnosis />} />
            <Route path="management" element={<Management />} />
            <Route path="patients/search" element={<PatientSearchResults />} />
            <Route path="absent-request" element={<AbsentRequest />} />
            <Route path="my-portal" element={<MyPortal />} />
            <Route path="clinic-schedule" element={<ClinicSchedule />} />
            <Route path="pending-reviews" element={<PendingReviews />} />
            <Route path="reports" element={<Reports />} />
            <Route path="my-cases" element={<MyCases />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
