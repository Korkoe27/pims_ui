import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { appointmentsApi } from "../redux/api/features/appointmentsApi";
import { dashboardApi } from "../redux/api/features/dashboardApi";

const useWebSocketAppointments = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // TECH DEBT: Using hardcoded production WebSocket URL
    const socket = new WebSocket(
      "wss://optometryclinic-production.up.railway.app/ws/appointments/"
    );

    socket.onopen = () => {
      console.log("✅ Connected to appointments WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 New appointment event:", data);

        // 🔁 Invalidate cache to trigger RTK Query re-fetch
        dispatch(appointmentsApi.util.invalidateTags(["Appointments"]));
        dispatch(dashboardApi.util.invalidateTags(["Dashboard"]));
      } catch (error) {
        console.error("❌ Failed to parse WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("🚫 WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("❌ Disconnected from appointments WebSocket");
    };

    return () => socket.close();
  }, [dispatch]);
};

export default useWebSocketAppointments;
