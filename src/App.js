import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
            <Route path="inventory" element={<Inventory />} />
            <Route path="pharmacy" element={<Pharmacy />}>
              <Route path="order/:orderId" element={<PharmacyOrder />} />
            </Route>

            {/* Direct single-step routes (kept as-is) */}
            <Route path="case-history/:appointmentId" element={<CaseHistory />} />
            <Route path="visual-acuity/:appointmentId" element={<VisualAcuity />} />
            <Route path="externals/:appointmentId" element={<Externals />} />
            <Route path="internals/:appointmentId" element={<Internals />} />
            <Route path="refraction/:appointmentId" element={<Refraction />} />
            <Route path="extra-tests/:appointmentId" element={<ExtraTests />} />
            <Route path="diagnosis" element={<Diagnosis />} />
            <Route path="management" element={<Management />} />
            <Route path="createAppointment" element={<CreateAppointment />} />

            {/* ✅ Consultation flow with nested child routes */}
            <Route path="consultation/:appointmentId" element={<Consultation />}>
              {/* default to management */}
              <Route index element={<Navigate to="management" replace />} />
              <Route path="management" element={<Management />} />
              {/* When you’re ready, you can add real routes for sub-tabs:
                  <Route path="case-guide" element={<CaseManagementGuide />} />
                  <Route path="submit" element={<Submit />} />
                  <Route path="logs" element={<Logs />} />
                  <Route path="complete" element={<Complete />} />
              */}
            </Route>

            {/* Others */}
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
