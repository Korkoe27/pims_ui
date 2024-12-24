import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";
import { CiLock } from "react-icons/ci";
import { PiUserCircle } from "react-icons/pi";
import { VscEye } from "react-icons/vsc";
import { FiEyeOff } from "react-icons/fi";
import { useLoginMutation } from "../services/client/apiService"; // RTK Query hook for login
import { useNavigate } from "react-router-dom";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="loader"></div>
    <style>{`
      .loader {
        border: 8px solid #f3f3f3;
        border-top: 8px solid #2f3192;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Use RTK Query login mutation hook
  const [login, { isLoading, isError, error }] = useLoginMutation();

  useEffect(() => {
    // Redirect if already logged in
    if (localStorage.getItem("user")) {
      navigate("/"); // Redirect to dashboard
    }
  }, [navigate]);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleLogin = async (e) => {
    e.preventDefault();
    const credentials = { username, password };

    try {
      await login(credentials).unwrap(); // Call the login mutation
      navigate("/"); // Redirect to dashboard on successful login
    } catch (err) {
      console.error("Login failed:", err); // Handle login error
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-10 justify-center items-center h-screen w-screen">
      <div className="flex flex-col text-center">
        <Logo displayType="block" />
        <h1 className="text-xl font-bold">
          Patient Information Management System
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center rounded-lg p-12 border border-[#d0d5dd]">
        <h1 className="font-bold text-3xl">Log in</h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-8 p-9 justify-center items-center"
        >
          <div className="flex flex-col w-96 gap-1">
            <label htmlFor="username" className="text-[#101928] text-base">
              Username
            </label>
            <div className="flex justify-between items-start gap-3 rounded-lg border p-3 border-[#d0d5dd] bg-white w-full">
              <PiUserCircle className="w-8 h-8 object-contain text-[#667185]" />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full border-none outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col w-96 gap-1">
            <label htmlFor="password" className="text-[#101928] text-base">
              Password
            </label>
            <div className="flex justify-between items-start gap-3 rounded-lg border p-3 border-[#d0d5dd] bg-white w-full">
              <CiLock className="w-8 h-8 object-contain text-[#667185]" />
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border-none outline-none"
              />
              <div onClick={togglePasswordVisibility} className="cursor-pointer">
                {passwordVisible ? <VscEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
              </div>
            </div>
          </div>

          {isError && <p className="text-red-500">{error?.data || "Login failed. Please try again."}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-md w-full"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
