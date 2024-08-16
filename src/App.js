import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { Sidebar} from './components';
import {Dashboard, Appointments, Dispensary, Inventory, Patients} from './pages';

const App = () => {
  return (
    <div className='overflow-hidden flex'>
      <BrowserRouter>
      <div className='flex flex-row  h-full'>
        <div className=' bg-white dark:bg-secondary-dark-bg'>
          <Sidebar />
        </div>

</div>
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/patients' element={<Patients/>}/>
          <Route path='/appointments' element={<Appointments/>}/>
          <Route path='/inventory' element={<Inventory/>}/>
          <Route path='/dispensory' element={<Dispensary/>}/>
        </Routes>
      
      </BrowserRouter>
      
    </div>
  )
}

export default App
