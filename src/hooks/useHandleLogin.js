import { useDispatch } from "react-redux";
import { useLoginMutation, useLazyGetUserQuery } from "../redux/api/features/authApi";
import { setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom"; // For navigation

const useHandleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [getUser] = useLazyGetUserQuery(); // Lazy query to fetch user data on demand

  const handleLogin = async (credentials) => {
    try {
      // Step 1: Call the login API
      const { accessToken, refreshToken } = await login(credentials).unwrap();

      // Step 2: Store tokens locally
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Step 3: Fetch user data using the lazy query
      const user = await getUser().unwrap();

      // Step 4: Dispatch user data to Redux store
      dispatch(setUser(user));

      console.log("Login successful!");

      // Step 5: Navigate to the home route
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);

      // Clear tokens on failure
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      throw err; // Optionally rethrow for component-level handling
    }
  };

  return { handleLogin, isLoginLoading, loginError };
};

export default useHandleLogin;
