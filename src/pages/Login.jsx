import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { CiLock } from "react-icons/ci";
import { PiUserCircle } from "react-icons/pi";
import { VscEye } from "react-icons/vsc";
import { FiEyeOff } from "react-icons/fi";
import { useAuth } from '../hooks/AuthProvider'; // Use the AuthProvider
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // For handling login errors
  const { user, loginAction } = useAuth(); // Get user and loginAction from AuthProvider
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if the user is already authenticated
    if (user) {
      navigate('/'); // Redirect to dashboard
    }
  }, [user, navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = { username, password };
      await loginAction(data); // Use loginAction from AuthProvider
      // On successful login, navigation happens within loginAction
    } catch (err) {
      console.error('Login failed:', err);
      if (err.response && err.response.status === 400) {
        setError('Login Error: Invalid username or password.'); // Specific error message for 400 status
      } else {
        setError('An unexpected error occurred. Please try again later.'); // General error message
      }
    }
  };

  return (
    <div className='flex flex-col gap-10 justify-center items-center h-screen w-screen'>
      <div className='flex flex-col text-center'>
        <Logo displayType='block' />
        <h1 className='text-xl font-bold'>Patient Information Management System</h1>
      </div>
      <div className="flex flex-col justify-center items-center rounded-lg p-12 border border-[#d0d5dd]">
        <h1 className='font-bold text-3xl'>Log in</h1>
        <form onSubmit={handleLogin} className='flex flex-col gap-8 p-9 justify-center items-center'>
          <div className="flex flex-col w-96 gap-1">
            <label htmlFor="username" className='text-[#101928] text-base'>Username</label>
            <div className="flex justify-between items-start gap-3 rounded-lg border p-3 border-[#d0d5dd] bg-white w-full">
              <PiUserCircle className='w-8 h-8 object-contain text-[#667185]'/>
              <input 
                type="text"
                className="w-full outline-none  h-full p-0 bg-white" 
                placeholder='Username'
                name='username'
                value={username} // Bind the username state
                onChange={(e) => setUsername(e.target.value)} // Update state on change
              />
            </div>
          </div>
          <div className="w-96 flex flex-col gap-1">
            <label htmlFor="password" className='text-[#101928] text-base'>Password</label>
            <div className="flex justify-between items-start gap-3 rounded-lg border p-3 border-[#d0d5dd] bg-white w-full">
              <CiLock className='w-8 h-8 object-contain text-[#667185]'/>
              <input 
                type={passwordVisible ? "text" : "password"} 
                className="w-full outline-none h-full p-0 bg-white" 
                placeholder='Password'
                name='password'
                value={password} // Bind the password state
                onChange={(e) => setPassword(e.target.value)} // Update state on change
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
          {error && (
            <p className="text-red-500 font-bold text-center mt-4">
              {error}
            </p>
          )} {/* Display error message with enhanced styling */}
          <button className="bg-[#2f3192] text-white p-5 w-96 rounded-lg" type='submit'>Log into your account</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
