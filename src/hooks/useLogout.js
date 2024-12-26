/**
 * useLogout Hook
 *
 * Provides a reusable function to handle user logout across the application.
 */

import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../redux/api/features/authApi";
import { useDispatch } from "react-redux";
import { resetAuth } from "../redux/slices/authSlice";

const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      console.log("Initiating logout...");
      await logout().unwrap(); // Call the logout mutation
      dispatch(resetAuth()); // Reset Redux auth state
      console.log("Logout successful");
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Logout failed:", error); // Handle any errors
      alert("Failed to log out. Please try again.");
    }
  };

  return { handleLogout, isLoading };
};

export default useLogout;
