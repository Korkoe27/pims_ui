import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useLazyGetUserQuery,
} from "../redux/api/features/authApi";
import { setUser } from "../redux/slices/authSlice";
import Logo from "../components/Logo";
import { showToast } from "../components/ToasterHelper";

// Test user accounts for system testing
const testUsers = [
  {
    username: "frontdesk",
    password: "TestP@$$",
    role: "Frontdesk",
    description: "Handles patient registration and appointment scheduling",
    color: "bg-orange-500 hover:bg-orange-600",
    icon: "🛎️",
  },
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
  const [login] = useLoginMutation();
  const [getUser] = useLazyGetUserQuery();

  const handleTestLogin = async (testUser) => {
    try {
      showToast(`Logging in as ${testUser.role}...`, "loading");

      const { accessToken, refreshToken } = await login({
        username: testUser.username,
        password: testUser.password,
      }).unwrap();

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      const { user } = await getUser().unwrap();
      dispatch(setUser({ user }));

      showToast(`Logged in successfully as ${testUser.role}!`, "success");
      navigate("/");
    } catch (err) {
      console.error("Test login error:", err);
      const formatted = formatErrorMessage(err?.data);
      showToast(formatted.detail || `Failed to login as ${testUser.role}`, "error");
    }
  };

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

        {/* Testing Interface Panel */}
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              🧪 System Testing Access
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select your role to access the system with appropriate permissions
            </p>
          </div>

          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {testUsers.map((user, index) => (
              <div
                key={index}
                className="bg-white/70 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{user.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {user.role}
                      </h4>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTestLogin(user)}
                    className={`px-4 py-2 text-white font-medium rounded-lg transition-all duration-200 ${user.color}`}
                  >
                    Access System
                  </button>
                </div>
                <p className="text-sm text-gray-600">{user.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
