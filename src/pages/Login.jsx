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

const formatErrorMessage = (data) => {
  if (!data) return { detail: "An unexpected error occurred." };
  if (typeof data.detail === "string") return { detail: data.detail };

  if (typeof data === "object") {
    const messages = Object.entries(data)
      .map(([key, value]) => {
        const label = key.replace(/_/g, " ").toUpperCase();
        let msg;
        if (typeof value === "object") {
          msg = JSON.stringify(value);
        } else {
          msg = Array.isArray(value) ? value.join(", ") : value;
        }
        return `${label}: ${msg}`;
      })
      .join("\n");

    return { detail: messages };
  }

  return { detail: "An unexpected error occurred." };
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [getUser] = useLazyGetUserQuery();

  const togglePasswordVisibility = () => setPasswordVisible((visible) => !visible);

  const handleSubmit = async (event) => {
    event.preventDefault();

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

      const { user } = await getUser().unwrap();
      dispatch(setUser({ user }));

      showToast("Login successful!", "success");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const formatted = formatErrorMessage(err?.data);
      showToast(formatted.detail || "An error occurred during login.", "error");
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0" />

      <div className="z-10 w-full max-w-md backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl shadow-xl p-8 md:p-10 flex flex-col gap-6 text-gray-800">
        <div className="text-center">
          <Logo displayType="block" />
          <h2 className="text-lg md:text-xl font-bold mt-3 text-gray-800">
            Patient Information Management System
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-gray-700">
              Username
            </label>
            <div className="flex items-center gap-2 bg-white/70 p-3 rounded-lg border border-gray-200">
              <PiUserCircle className="text-gray-500 text-xl" />
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                placeholder="Enter your username"
                className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-gray-700">
              Password
            </label>
            <div className="flex items-center gap-2 bg-white/70 p-3 rounded-lg border border-gray-200">
              <CiLock className="text-gray-500 text-xl" />
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Enter your password"
                className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-400"
              />
              {passwordVisible ? (
                <FiEyeOff
                  className="text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              ) : (
                <VscEye
                  className="text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
