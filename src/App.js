import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import "./App.css";

import {
  PersonalInfo,
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

// Wrapper for case guide route
const CaseManagementGuidePage = () => {
  const { appointmentId } = useParams();
  return <CaseManagementGuide appointmentId={appointmentId} role={window?.__APP_ROLE__ || "student"} />;
};

// Redirect legacy routes
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
          {/* 🟢 Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* 🧍 Patients */}
            <Route
              path="my-patients"
              element={
                <ProtectedRoute accessKeys={["canViewPatients"]}>
                  <Patients />
                </ProtectedRoute>
              }
            />
            <Route
              path="register-patient"
              element={
                <ProtectedRoute accessKeys={["canAddPatient"]}>
                  <PersonalInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="patients-details"
              element={
                <ProtectedRoute accessKeys={["canViewPatients"]}>
                  <PatientDetails />
                </ProtectedRoute>
              }
            />

            {/* 📅 Appointments */}
            <Route
              path="appointments"
              element={
                <ProtectedRoute accessKeys={["canViewAppointments"]}>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="createAppointment"
              element={
                <ProtectedRoute accessKeys={["canCreateAppointment"]}>
                  <CreateAppointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="general-appointments"
              element={
                <ProtectedRoute accessKeys={["canViewAppointments"]}>
                  <GeneralAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="special-appointments"
              element={
                <ProtectedRoute accessKeys={["canViewAppointments"]}>
                  <SpecialAppointments />
                </ProtectedRoute>
              }
            />

            {/* 🧾 Reports */}
            <Route
              path="reports"
              element={
                <ProtectedRoute accessKeys={["canViewReports"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* 🏫 Clinic Schedule */}
            <Route
              path="clinic-schedule"
              element={
                <ProtectedRoute accessKeys={["canViewClinicSchedule"]}>
                  <ClinicSchedule />
                </ProtectedRoute>
              }
            />

            {/* 🎓 Grading */}
            <Route
              path="my-scores"
              element={
                <ProtectedRoute accessKeys={["canViewGrades"]}>
                  <MyScores />
                </ProtectedRoute>
              }
            />
            <Route
              path="case-reviews"
              element={
                <ProtectedRoute accessKeys={["canGradeStudents"]}>
                  <CaseReviews />
                </ProtectedRoute>
              }
            />

            {/* 📋 Pending Reviews */}
            <Route
              path="pending-reviews"
              element={
                <ProtectedRoute accessKeys={["canViewConsultations"]}>
                  <PendingReviews />
                </ProtectedRoute>
              }
            />

            {/* 💊 Pharmacy */}
            <Route
              path="pharmacy"
              element={
                <ProtectedRoute accessKeys={["canViewConsultations"]}>
                  <Pharmacy />
                </ProtectedRoute>
              }
            >
              <Route path="order/:orderId" element={<PharmacyOrder />} />
            </Route>

            {/* 🧠 Consultation */}
            <Route
              path="consultation/:appointmentId"
              element={
                <ProtectedRoute accessKeys={["canStartConsultation"]}>
                  <Consultation />
                </ProtectedRoute>
              }
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

            {/* ⚙️ Other Pages */}
            <Route path="absent-request" element={<AbsentRequest />} />
            <Route path="my-portal" element={<MyPortal />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="my-cases" element={<MyCases />} />
            <Route path="patients/search" element={<PatientSearchResults />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
