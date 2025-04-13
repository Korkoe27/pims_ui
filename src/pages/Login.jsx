import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useLazyGetUserQuery,
} from "../redux/api/features/authApi";
import { setUser } from "../redux/slices/authSlice";
import Logo from "../components/Logo";
import { CiLock } from "react-icons/ci";
import { PiUserCircle } from "react-icons/pi";
import { VscEye } from "react-icons/vsc";
import { FiEyeOff } from "react-icons/fi";
import { showToast } from "../components/ToasterHelper";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [getUser] = useLazyGetUserQuery();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showToast("Username and password are required.", "error");
      return;
    }

    try {
      showToast("Logging in...", "loading");

      const { accessToken, refreshToken } = await login({
        username,
        password,
      }).unwrap();

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      const user = await getUser().unwrap();
      dispatch(setUser(user));

      showToast("Login successful!", "success");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      showToast(
        err?.data?.message || "An error occurred during login.",
        "error"
      );
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: "url('/your-background.jpg')", // Update your path here
      }}
    >
      <div className="absolute inset-0 bg-black/70 z-0" />

      <div className="z-10 w-full max-w-md backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl p-8 md:p-10 flex flex-col gap-6 text-white">
        <div className="text-center">
          <Logo displayType="block" />
          <h2 className="text-lg md:text-xl font-bold mt-3">
            Patient Information Management System
          </h2>
        </div>

        <h1 className="text-2xl font-bold text-center">Log in</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-white">
              Username
            </label>
            <div className="flex items-center gap-2 bg-white/20 p-3 rounded-lg border border-white/30">
              <PiUserCircle className="text-white text-xl" />
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="bg-transparent w-full outline-none text-white placeholder-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-white">
              Password
            </label>
            <div className="flex items-center gap-2 bg-white/20 p-3 rounded-lg border border-white/30">
              <CiLock className="text-white text-xl" />
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="bg-transparent w-full outline-none text-white placeholder-white"
              />
              {passwordVisible ? (
                <FiEyeOff
                  className="text-white cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <VscEye
                  className="text-white cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-white text-indigo-700 font-bold py-3 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
