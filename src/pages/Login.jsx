import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useLazyGetUserQuery,
} from "../redux/api/features/authApi";
import { setUser } from "../redux/slices/authSlice";
import Logo from "../components/Logo";
import { showToast } from "../components/ToasterHelper";

// Dev-only convenience accounts (kept for local testing).
// These are NOT rendered in production builds.
const DEV_TEST_USERS = [
  {
    username: "student",
    password: "TestP@$$",
    role: "Student",
    description: "Can perform examinations and assessments",
    color: "bg-blue-500 hover:bg-blue-600",
    icon: "👨‍🎓",
  },
  {
    username: "clinician",
    password: "TestP@$$",
    role: "Clinician",
    description: "Clinical staff with examination access",
    color: "bg-green-500 hover:bg-green-600",
    icon: "👩‍⚕️",
  },
  {
    username: "supervisor",
    password: "TestP@$$",
    role: "Supervisor",
    description: "Senior staff with supervisory access",
    color: "bg-purple-500 hover:bg-purple-600",
    icon: "👨‍💼",
  },
];

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login] = useLoginMutation();
  const [getUser] = useLazyGetUserQuery();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    const from = location?.state?.from;
    return typeof from?.pathname === "string" ? from.pathname : "/";
  }, [location]);

  const handleLogin = async ({ username: u, password: p }) => {
    try {
      setIsSubmitting(true);
      showToast("Logging in...", "loading");

      const { accessToken, refreshToken } = await login({
        username: u,
        password: p,
      }).unwrap();

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      const session = await getUser().unwrap();
      if (!session?.authenticated || !session?.user) {
        showToast("Login succeeded but session check failed.", "error");
        return;
      }

      dispatch(setUser({ user: session.user }));

      showToast("Logged in successfully!", "success");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      const formatted = formatErrorMessage(err?.data);
      showToast(formatted.detail || "Failed to login", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const u = username.trim();
    if (!u || !password) {
      showToast("Enter your username and password.", "error");
      return;
    }
    await handleLogin({ username: u, password });
  };

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm z-0" />

      <div className="z-10 w-full max-w-md backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col gap-6 text-gray-800">
        {/* Header */}
        <div className="text-center">
          <Logo displayType="block" />
          <h2 className="text-lg md:text-xl font-bold mt-3 text-gray-800">
            Patient Information Management System
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Login</h3>
            <p className="text-sm text-gray-600">
              Sign in to access the Patient Information Management System
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your username"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg bg-blue-600 text-white font-semibold py-2.5 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              If you don’t have an account, contact an administrator.
            </p>
          </div>

          {/* Dev-only: quick test logins */}
          {isDev && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                🧪 System Testing Access
              </summary>

              <p className="text-sm text-gray-600 mt-2">
                Quick login shortcuts for local testing.
              </p>

              <div className="grid gap-3 mt-3 max-h-72 overflow-y-auto">
                {DEV_TEST_USERS.map((user, index) => (
                  <div
                    key={index}
                    className="bg-white/70 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{user.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-800">{user.role}</h4>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLogin({ username: user.username, password: user.password })}
                        className={`px-4 py-2 text-white font-medium rounded-lg transition-all duration-200 ${user.color}`}
                      >
                        Access System
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{user.description}</p>
                  </div>
                ))}
              </div>
            </details>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
