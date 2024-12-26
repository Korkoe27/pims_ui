import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCheckSessionQuery } from "./redux/api/authApi";
import { useSelector, useDispatch } from "react-redux";
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
  Dashboard,
  Appointments,
  Dispensary,
  Inventory,
  Patients,
  Login,
} from "./pages";
import Layout from "./pages/Layout";
import ProtectedRoute from "./hooks/ProtectedRoute";
import LoginLoader from "./components/LoginLoader";
import { setUser } from "./redux/slices/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useCheckSessionQuery();
  const { loading } = useSelector((state) => state.auth);

  // Update Redux state with user info if authenticated
  React.useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data, dispatch]);

  if (isLoading) {
    // Display spinner while session is being checked
    return <LoginLoader />;
  }

  if (loading) {
    // Display spinner while checking session
    return <LoginLoader />;
  }

  return (
    <div className="bg-[#f9fafb]">
      <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-patients" element={<Patients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/dispensary" element={<Dispensary />} />
              <Route path="/register-patient" element={<PersonalInfo />} />
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
              <Route
                path="/createAppointment"
                element={<CreateAppointment />}
              />
            </Route>
          </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
