import React, { useState } from 'react';
import Logo from '../components/Logo';
import { CiLock } from "react-icons/ci";
import { PiUserCircle } from "react-icons/pi";
import { VscEye } from "react-icons/vsc";
import { FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className='flex flex-col gap-10 justify-center items-center h-screen w-screen'>
      <div className='flex flex-col text-center'>
        <Logo displayType='block' />
        <h1 className='text-xl font-bold'>Patient Information Management System</h1>
      </div>
      <div className="flex flex-col justify-center items-center rounded-lg p-12 border border-[#d0d5dd]">
        <h1 className='font-bold text-3xl'>Log in</h1>
        <form action="" className='flex flex-col gap-8 p-9 justify-center items-center'>
          <div className="flex flex-col w-96 gap-1">
            <label htmlFor="username" className='text-[#101928] text-base'>Username</label>
            <div className="flex justify-between items-start gap-3 rounded-lg border p-3 border-[#d0d5dd] w-full">
              <PiUserCircle className='w-8 h-8 object-contain text-[#667185]'/>
              <input type="text" className="w-full outline-none" placeholder='Username'/>
              
            </div>
          </div>
          <div className="w-96 gap-1">
            <label htmlFor="password" className='text-[#101928] text-base'>Password</label>
            <div className="flex justify-between border rounded-lg p-3 gap-3 border-[#d0d5dd] items-start">
              <CiLock className='w-8 h-8 object-contain text-[#667185]'/>
              <input 
                type={passwordVisible ? "text" : "password"} 
                className="w-full outline-none" placeholder='Password'
              />
              {passwordVisible ? (
                <FiEyeOff 
                  className='w-8 h-8 object-contain cursor-pointer p-0 hover:text-[#000] text-[#667185]'
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <VscEye 
                  className='w-8 h-8 object-contain cursor-pointer p-0 hover:text-[#000] text-[#667185]'
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>
          <button className="bg-[#2f3192] text-white p-5 w-96 rounded-lg">Log into your account</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
