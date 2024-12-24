import React, {useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
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
import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./hooks/PrivateRoute";
import { ClinicProvider } from "./contexts/ClinicProvider";
import { store } from "./redux/store";
// import { checkUserSession } from "./redux/slices/authSlice";
import LoadingSpinner from "./components/LoadingSpinner";

const App = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  // useEffect(() => {
  //   // Run session check on app load
  //   dispatch(checkUserSession());
  // }, [dispatch]);

  if (loading) {
    // Display spinner while checking session
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-[#f9fafb]">
      <Provider store={store}>
        <BrowserRouter>
          <ClinicProvider>
            <Routes>
              <Route path="/login" element={<Login />} />

              {/* Protect all routes under Layout using PrivateRoute */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Dashboard />} />
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
                <Route
                  path="/externals/:appointmentId"
                  element={<Externals />}
                />
                <Route
                  path="/internals/:appointmentId"
                  element={<Internals />}
                />
                <Route
                  path="/refraction/:appointmentId"
                  element={<Refraction />}
                />
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
          </ClinicProvider>
        </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
