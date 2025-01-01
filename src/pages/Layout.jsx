import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar  from "../components/Sidebar"
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <div className='flex bg-[#f9fafb] h-full'>
      <Sidebar/>
      <Outlet/>
    </div>
  )
}

export default Layout
