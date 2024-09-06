import React from 'react';
import Logo from '../components/Logo';
import { CiLock } from "react-icons/ci";
import { PiUserCircle } from "react-icons/pi";
import { VscEye } from "react-icons/vsc";

const Login = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen bg-white'>
      <Logo displayType='block' />
      <h1 className='font-bold mb-3'>Patient Information Management System</h1>
      <div className='flex flex-col justify-center items-center bg-white border border-[#D0D5DD] rounded-lg py-[2rem] px-[3rem] my-4'>
        
        <h1 className='text-3xl font-extrabold'>Log in</h1>
        <div>
          <div className='w-full'>
          <label htmlFor="username" className='block text-base font-medium text-gray-700 mb-1'>Username</label>
          <div className='flex border border-gray-300 rounded-lg w-full items-center px-3 py-2'>
            <PiUserCircle className='text-[#667185] h-[20px] w-[20px' />
            <input type="text" placeholder='Username' name="username" id="username" className='w-full h-[50px] outline-none' />
          </div>
        </div>
        <div class="my-4">
          <label htmlFor="password" className='block text-base font-medium text-gray-700 mb-1'>Password</label>
          <div className='flex border border-gray-300 rounded-lg w-full items-center px-3 py-2'>
            <CiLock className='text-[#667185] h-[20px] font-extrabold w-[20px]' />
            <input type="password" placeholder='Password' name="password" id="password" className='w-full h-[50px] outline-none' />
            <VscEye className='cursor-pointer text-[#667185] ml-2 font-extrabold h-[20px] w-[20px]' />
          </div>
        </div>
        </div>
        
        <button className='bg-[#2F3192] text-white px-4 rounded-lg h-[56px]  w-full'>Log into your account</button>
      </div>
    </div>
  );
}

export default Login;
