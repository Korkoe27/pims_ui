import { useEffect, useState } from "react";

export default function useAppointmentSocket() {
  const [newAppointment, setNewAppointment] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/appointments/");

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket: Appointments");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "appointment_created") {
        console.log("📥 New appointment received:", data.appointment);
        setNewAppointment(data.appointment); // Expose the appointment
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.warn("🔌 WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  return { newAppointment };
}
