import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useHandleLogin from "../hooks/useHandleLogin";
import Logo from "../components/Logo";
import { CiLock } from "react-icons/ci";
import { PiUserCircle } from "react-icons/pi";
import { VscEye } from "react-icons/vsc";
import { FiEyeOff } from "react-icons/fi";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { handleLogin, isLoginLoading, loginError } = useHandleLogin(); // Use the custom hook
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin({ username, password });
      // Navigate to the dashboard after successful login
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  if (isLoginLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-10 justify-center items-center h-screen w-screen">
      <div className="flex flex-col text-center">
        <Logo displayType="block" />
        <h1 className="text-xl font-bold">Patient Information Management System</h1>
      </div>
      <div className="flex flex-col justify-center items-center rounded-lg p-12 border border-[#d0d5dd]">
        <h1 className="font-bold text-3xl">Log in</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 p-9 justify-center items-center"
        >
          {/* Username Input */}
          <div className="flex flex-col w-96 gap-1">
            <label htmlFor="username" className="text-[#101928] text-base">
              Username
            </label>
            <div className="flex justify-between items-start gap-3 rounded-lg border p-3 border-[#d0d5dd] bg-white w-full">
              <PiUserCircle className="w-8 h-8 object-contain text-[#667185]" />
              <input
                type="text"
                className="w-full outline-none h-full p-0 bg-white"
                placeholder="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="w-96 flex flex-col gap-1">
            <label htmlFor="password" className="text-[#101928] text-base">
              Password
            </label>
            <div className="flex justify-between items-start gap-3 rounded-lg border p-3 border-[#d0d5dd] bg-white w-full">
              <CiLock className="w-8 h-8 object-contain text-[#667185]" />
              <input
                type={passwordVisible ? "text" : "password"}
                className="w-full outline-none h-full p-0 bg-white"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordVisible ? (
                <FiEyeOff
                  className="w-8 h-8 object-contain cursor-pointer p-0 hover:text-[#000] text-[#667185]"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <VscEye
                  className="w-8 h-8 object-contain cursor-pointer p-0 hover:text-[#000] text-[#667185]"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>

          {/* Error Message */}
          {loginError && (
            <p className="text-red-500 font-bold text-center mt-4">
              {loginError.data?.message || "Login failed. Please try again."}
            </p>
          )}

          {/* Submit Button */}
          <button
            className="bg-[#2f3192] text-white p-5 w-96 rounded-lg"
            type="submit"
            disabled={isLoginLoading}
          >
            {isLoginLoading ? "Logging in..." : "Log into your account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
