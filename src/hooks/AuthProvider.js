// import { useContext, createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { checkSession, login, logout } from "../services/client/apiService";

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Check session on app initialization
//   useEffect(() => {
//     const initializeSession = async () => {
//       try {
//         const res = await checkSession();
//         setUser(res.user || null);
//       } catch (err) {
//         console.error("Session check failed:", err);
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeSession();
//   }, [navigate]);

//   const loginAction = async (credentials) => {
//     try {
//       const res = await login(credentials.username, credentials.password);
//       setUser(res.user);
//       navigate("/");
//     } catch (err) {
//       console.error("Login Error:", err);
//       throw new Error("Login failed");
//     }
//   };

//   const logOut = async () => {
//     try {
//       await logout();
//       setUser(null);
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout Error:", err);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loginAction, logOut, loading }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

// export const useAuth = () => useContext(AuthContext);
