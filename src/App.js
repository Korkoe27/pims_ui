import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  Dispensary,
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
  Reports
} from "./pages";
import Layout from "./pages/Layout";
import ProtectedRoute from "./hooks/ProtectedRoute";
import LoginLoader from "./components/LoginLoader";

const App = () => {
  const { loading } = useSelector((state) => state.auth); // Check if authentication is loading

  if (loading) {
    // Display spinner while authentication state is being determined
    return <LoginLoader />;
  }

  return (
    <div className="bg-[#f9fafb]">
      <BrowserRouter>
        {/* ✅ Global toast handler */}
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* Public route for login */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes for authenticated users */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/my-patients" element={<Patients />} />
            <Route path="/patients-details" element={<PatientDetails />} />
            <Route path="/register-patient" element={<PersonalInfo />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/dispensary" element={<Dispensary />} />
            <Route
              path="/case-history/:appointmentId"
              element={<CaseHistory />}
            />
            <Route
              path="/visual-acuity/:appointmentId"
              element={<VisualAcuity />}
            />
            <Route path="/externals/:appointmentId" element={<Externals />} />
            <Route path="/internals/:appointmentId" element={<Internals />} />
            <Route path="/refraction/:appointmentId" element={<Refraction />} />
            <Route
              path="/extra-tests/:appointmentId"
              element={<ExtraTests />}
            />
            <Route path="/diagnosis" element={<Diagnosis />} />
            <Route path="/management" element={<Management />} />
            <Route path="/createAppointment" element={<CreateAppointment />} />
            <Route
              path="/consultation/:appointmentId"
              element={<Consultation />}
            />
            <Route path="/patients/search" element={<PatientSearchResults />} />
            <Route path="/absent-request" element={<AbsentRequest />} />
            <Route path="/my-portal" element={<MyPortal />} />
            <Route path="/case-reviews" element={<CaseReviews />} />
            <Route path="/clinic-schedule" element={<ClinicSchedule />} />
            <Route path="/pending-reviews" element={<PendingReviews />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
