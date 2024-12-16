import React from 'react';
import { Provider } from "react-redux";
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CaseHistory, PersonalInfo, VisualAcuity, Internals, Externals, Refraction, ExtraTests, Diagnosis, Management, CreateAppointment } from './components';
import { Dashboard, Appointments, Dispensary, Inventory, Patients, Login } from './pages';
import Layout from './pages/Layout';
import AuthProvider from './hooks/AuthProvider';
import PrivateRoute from './hooks/PrivateRoute';
import { ClinicProvider } from './contexts/ClinicProvider';
import store from "./redux/store";


const App = () => {
  return (
    <div className='bg-[#f9fafb]'>
      <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <ClinicProvider>
          <Routes>
            <Route path='/login' element={<Login />} />
            
            {/* Protect all routes under Layout using PrivateRoute */}
            <Route path='/' element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path='/my-patients' element={<Patients />} />
              <Route path='/appointments' element={<Appointments />} />
              <Route path='/inventory' element={<Inventory />} />
              <Route path='/dispensary' element={<Dispensary />} />
              <Route path='/register-patient' element={<PersonalInfo />} />
              <Route path="/case-history/:appointmentId" element={<CaseHistory />} />
              <Route path='/visual-acuity/:appointmentId' element={<VisualAcuity />} />
              <Route path='/externals/:appointmentId' element={<Externals />} />
              <Route path='/internals/:appointmentId' element={<Internals />} />
              <Route path='/refraction/:appointmentId' element={<Refraction />} />
              <Route path='/extra-tests/:appointmentId' element={<ExtraTests />} />
              <Route path='/diagnosis' element={<Diagnosis />} />
              <Route path='/management' element={<Management />} />
              <Route path='/createAppointment' element={<CreateAppointment />} />
            </Route>
          </Routes>
          </ClinicProvider>
        </AuthProvider>
      </BrowserRouter>
      </Provider>
    </div>
  );
};

export default App;
