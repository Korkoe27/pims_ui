import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar  from "../components/Sidebar"
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Layout = () => {
  return (
    <div className='flex bg-[#f9fafb] h-full'>
      <Sidebar/>
      <Outlet/>
      {/* <Footer /> */}
    </div>
  )
}

export default Layout
