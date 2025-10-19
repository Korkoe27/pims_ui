import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import "../App.css";

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
} from "../components";

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
} from "../pages";

import Layout from "../pages/Layout";
import ProtectedRoute from "../hooks/ProtectedRoute";
import LoginLoader from "../components/LoginLoader";
import CaseManagementGuide from "../components/CaseManagementGuide";

// ------------------------------------------------------
// 🔹 Wrapper to handle case-guide route param
// ------------------------------------------------------
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

// ------------------------------------------------------
// 🔹 Main App Routing
// ------------------------------------------------------
const App = () => {
  const { loading } = useSelector((state) => state.auth);
  if (loading) return <LoginLoader />;

  return (
    <div className="bg-[#f9fafb]">
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* Public Routes */}
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
            {/* Dashboard (no restriction beyond login) */}
            <Route index element={<Dashboard />} />

            {/* ------------------------------------------------------ */}
            {/* 🧩 Core Patient & Appointment Routes */}
            {/* ------------------------------------------------------ */}
            <Route
              path="my-patients"
              element={
                <ProtectedRoute accessProp="canViewPatients">
                  <Patients />
                </ProtectedRoute>
              }
            />
            <Route
              path="register-patient"
              element={
                <ProtectedRoute accessProp="canAddPatient">
                  <PersonalInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="appointments"
              element={
                <ProtectedRoute accessProp="canViewAppointments">
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="createAppointment"
              element={
                <ProtectedRoute accessProp="canCreateAppointment">
                  <CreateAppointment />
                </ProtectedRoute>
              }
            />

            {/* ------------------------------------------------------ */}
            {/* 🩺 Consultation & Case Management */}
            {/* ------------------------------------------------------ */}
            <Route
              path="consultation/:appointmentId"
              element={
                <ProtectedRoute accessProp="canViewConsultations">
                  <Consultation />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="management" replace />} />
              <Route path="management" element={<Management />} />
              <Route path="case-guide" element={<CaseManagementGuidePage />} />
            </Route>

            {/* Redirect for old case-guide links */}
            <Route
              path="appointments/:appointmentId/case-guide"
              element={<CaseGuideRedirect />}
            />

            {/* ------------------------------------------------------ */}
            {/* 🧾 Reviews, Grading, Reports */}
            {/* ------------------------------------------------------ */}
            <Route
              path="case-reviews"
              element={
                <ProtectedRoute accessProp="canGradeStudents">
                  <CaseReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-scores"
              element={
                <ProtectedRoute accessProp="canViewGrades">
                  <MyScores />
                </ProtectedRoute>
              }
            />
            <Route
              path="reports"
              element={
                <ProtectedRoute accessProp="canViewReports">
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* ------------------------------------------------------ */}
            {/* 🧰 Other Routes */}
            {/* ------------------------------------------------------ */}
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
            <Route path="my-cases" element={<MyCases />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
