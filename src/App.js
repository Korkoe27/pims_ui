import React , {useState} from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { CaseHistory, PersonalInfo, VisualAcuity, Externals, Refraction} from './components';
import {Dashboard, Appointments, Dispensary, Inventory, Patients,Login} from './pages';
import Layout from './pages/Layout';
import AuthProvider from './hooks/AuthProvider';

const App = () => {

 
  return (
    <div>
      
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/' element={<Layout/>}>
            <Route index element={<Dashboard/>} />
            <Route path='/my-patients' element={<Patients/>}/>
            <Route path='/appointments' element={<Appointments/>}/>
            <Route path='/inventory' element={<Inventory/>}/>
            <Route path='/dispensary' element={<Dispensary/>}/>
            <Route path='/register-patient' element={<PersonalInfo/>}/>
            <Route path='/case-history' element={<CaseHistory/>}/>
            <Route path='/visual-acuity' element={<VisualAcuity/>}/>
            <Route path='/externals' element={<Externals/>}/>
            <Route path='/refraction' element={<Refraction/>}/>
          </Route>
          
        </Routes>
       
      </AuthProvider>
      </BrowserRouter>
      
    </div>
  )
}

export default App
