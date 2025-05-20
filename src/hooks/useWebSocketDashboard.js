import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { dashboardApi } from "../redux/api/features/dashboardApi";

const useWebSocketDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/appointments/");

    socket.onopen = () => {
      console.log("✅ Connected to Dashboard WebSocket");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Appointment Event Received:", data);

      // 🔁 Refetch dashboard data
      dispatch(dashboardApi.util.invalidateTags(["Dashboard"]));
    };

    socket.onclose = () => {
      console.log("❌ Dashboard WebSocket closed");
    };

    socket.onerror = (err) => {
      console.error("🚫 WebSocket error:", err.message);
    };

    return () => socket.close();
  }, [dispatch]);
};

export default useWebSocketDashboard;
