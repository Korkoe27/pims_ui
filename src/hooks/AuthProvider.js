import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, checkSession } from '../services/apiService'; // Import login and checkSession from your service

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await checkSession();
        if (res && res.user) {  // Ensure the session check returns user data
          setUser(res.user);
        } else {
          navigate("/login"); // Redirect to login if no session is found
        }
      } catch (err) {
        console.error("Session check failed", err);
        navigate("/login");
      }
    };

    fetchSession();
  }, [navigate]);

  const loginAction = async (data) => {
    try {
      const res = await login(data.username, data.password);
      if (res.user) {
        setUser(res.user);
        navigate("/"); // Redirect to home after successful login
        return;
      }
      throw new Error(res.message || "Login failed. Please try again.");
    } catch (err) {
      console.error("Login Error:", err.message || err);
    }
  };

  const logOut = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
