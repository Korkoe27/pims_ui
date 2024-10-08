import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, checkSession, logout } from '../services/apiService'; // Import logout function

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  // useEffect(() => {
  //   const fetchSession = async () => {
  //     try {
  //       const res = await checkSession();
  //       if (res && res.user) {
  //         setUser(res.user);
  //       } else {
  //         navigate("/login");
  //       }
  //     } catch (err) {
  //       console.error("Session check failed", err);
  //       navigate("/login");
  //     }
  //   };
  //   fetchSession();
  // }, [navigate]);

  const loginAction = async (data) => {
    try {
      const res = await login(data.username, data.password);
      if (res.user) {
        setUser(res.user);
        navigate("/");
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
    <AuthContext.Provider value={{ user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
