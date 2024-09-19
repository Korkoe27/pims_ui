import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { CaseHistory, PersonalInfo, ConsultationTab} from './components';
import {Dashboard, Appointments, Dispensary, Inventory, Patients,Login} from './pages';
import Layout from './pages/Layout';

const App = () => {
  return (
    <div>
      
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route index element={<Dashboard/>} />
            <Route path='/my-patients' element={<Patients/>}/>
            <Route path='/appointments' element={<Appointments/>}/>
            <Route path='/inventory' element={<Inventory/>}/>
            <Route path='/dispensary' element={<Dispensary/>}/>
            <Route path='/register-patient' element={<PersonalInfo/>}/>
          </Route>
          <Route path='/login' element={<Login/>}/>
        </Routes>
       
      
      </BrowserRouter>
      
    </div>
  )
}

export default App
