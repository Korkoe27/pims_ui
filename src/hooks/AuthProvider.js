import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, checkSession, logout } from "../services/client/apiService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await checkSession();
        if (res && res.user) {
          setUser(res.user); // Set user if session is active
        } else {
          navigate("/login"); // Redirect to login if no session
        }
      } catch (err) {
        console.error("Session check failed", err);
        navigate("/login");
      } finally {
        setLoading(false); // Stop loading spinner once session check is complete
      }
    };

    fetchSession(); // Check session on app initialization
  }, [navigate]);

  const loginAction = async (data) => {
  try {
    // Check if a session already exists
    try {
      const sessionCheck = await checkSession();
      if (sessionCheck && sessionCheck.user) {
        setUser(sessionCheck.user); // User is already logged in
        navigate("/"); // Redirect to dashboard
        return; // Exit early since the user is already authenticated
      }
    } catch (sessionError) {
      // Handle session check failure (e.g., 403 Forbidden)
      if (sessionError.response && sessionError.response.status === 403) {
        console.warn("No active session found. Proceeding with login...");
      } else {
        console.error("Session check error:", sessionError);
        throw sessionError; // Re-throw if it's an unexpected error
      }
    }

    // If no session exists, proceed with login
    const res = await login(data.username, data.password);
    if (res.user) {
      setUser(res.user);
      navigate("/"); // Redirect to dashboard
      return;
    }

    throw new Error(res.message || "Login failed. Please try again.");
  } catch (err) {
    console.error("Login Error:", err.message || err);
  }
};


  const logOut = async () => {
    try {
      await logout(); // Call logout API to clear session on backend
      setUser(null); // Clear user state
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginAction, logOut, loading }}>
      {!loading && children} {/* Render children only when loading is complete */}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
