import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, checkSession, logout } from '../services/apiService';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to indicate session check
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  const useCheckSession = (setUser) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Run session check only if user is not already set (i.e., not logged in yet)
      if (!user) {
        const fetchSession = async () => {
          try {
            const res = await checkSession();
            if (res && res.user) {
              setUser(res.user);
            } else {
              navigate("/login");
            }
          } catch (err) {
            console.error("Session check failed", err);
            navigate("/login");
          } finally {
            setLoading(false); // Set loading to false once session check is complete
          }
        };
        fetchSession();
      } else {
        setLoading(false); // No session check needed if user is already set
      }
    }, [user, navigate, setUser]);
  
    return loading;
  };
  

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
    <AuthContext.Provider value={{ user, loginAction, logOut, loading }}>
      {!loading && children} {/* Render children only when loading is false */}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
