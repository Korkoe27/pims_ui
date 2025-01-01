import { useDispatch } from "react-redux";
import { useLoginMutation, useLazyGetUserQuery } from "../redux/api/features/authApi";
import { setUser } from "../redux/slices/authSlice";

const useHandleLogin = () => {
  const dispatch = useDispatch();
  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [getUser] = useLazyGetUserQuery(); // Lazy query to fetch user data on demand

  const handleLogin = async (credentials) => {
    try {
      // Call the login API
      const { accessToken, refreshToken } = await login(credentials).unwrap();

      // Store tokens locally
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Fetch user data using the lazy query
      const user = await getUser().unwrap();

      // Dispatch user data to Redux store
      dispatch(setUser(user));

      console.log("Login successful!");
    } catch (err) {
      console.error("Login failed:", err);
      throw err; // Optionally rethrow for component-level handling
    }
  };

  return { handleLogin, isLoginLoading, loginError };
};

export default useHandleLogin;
