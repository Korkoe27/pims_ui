import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useGetClinicSchedulesQuery } from "../redux/api/features/clinicScheduleApi";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Localization config
const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// ✅ Custom rendering: remove time from top of block
const CustomEvent = ({ event }) => {
  return <span className="whitespace-pre-wrap">{event.title}</span>;
};

const ClinicScheduleCalendar = () => {
  const { data: scheduleData = [], isLoading } = useGetClinicSchedulesQuery();

  const events = scheduleData.map((item) => ({
    title: item.staff?.name || "Staff",
    start: new Date(`${item.date}T${item.start_time}`),
    end: new Date(`${item.date}T${item.end_time}`),
  }));

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "#2563eb", // Tailwind blue-600
        borderRadius: "6px",
        padding: "4px 8px",
        color: "#fff",
        border: "none",
        display: "flex",
        alignItems: "center",
        fontWeight: 600,
        fontSize: "0.85rem",
      },
    };
  };

  return (
    <div className="h-[700px]">
      {isLoading ? (
        <p className="text-center text-gray-500 mt-4">Loading schedule...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={["week", "day", "agenda"]}
          step={30}
          timeslots={2}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent,
          }}
          style={{ height: 650 }}
        />
      )}
    </div>
  );
};

export default ClinicScheduleCalendar;
