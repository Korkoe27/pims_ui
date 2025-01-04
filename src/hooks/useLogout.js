import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetAuth } from "../redux/slices/authSlice";

const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    try {
      console.log("Initiating frontend logout...");

      // Reset Redux auth state
      dispatch(resetAuth());

      // Clear persisted user data
      localStorage.removeItem("persist:auth");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Clear cookies (if any cookies are used for authentication)
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      });

      console.log("Frontend logout successful");

      // Redirect to the login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  return { handleLogout };
};

export default useLogout;
