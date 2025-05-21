import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { appointmentsApi } from "../redux/api/features/appointmentsApi";
import { dashboardApi } from "../redux/api/features/dashboardApi";

const useWebSocketAppointments = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    //const socket = new WebSocket("ws://localhost:8000/ws/appointments/");
    // TECH DEBT: Using current location to infer WebSocket host; refactor into helper later.
    const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(
      `${wsProtocol}://${window.location.host}/ws/appointments/`
    );

    socket.onopen = () => {
      console.log("✅ Connected to appointments WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 New appointment event:", data);

        // 🔁 Invalidate tags to trigger RTK Query auto-refresh
        dispatch(appointmentsApi.util.invalidateTags(["Appointments"]));
        dispatch(dashboardApi.util.invalidateTags(["Dashboard"]));

        // Optional: force-fetch (if invalidateTags is not enough)
        // dispatch(dashboardApi.endpoints.getDashboardData.initiate());
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
