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

// ✅ Color palette for different time slots
const COLORS = [
  { bg: "#2563eb", border: "#1e40af" },      // Blue
  { bg: "#7c3aed", border: "#6d28d9" },      // Violet
  { bg: "#059669", border: "#047857" },      // Green
  { bg: "#dc2626", border: "#991b1b" },      // Red
  { bg: "#ea580c", border: "#c2410c" },      // Orange
  { bg: "#0891b2", border: "#0e7490" },      // Cyan
  { bg: "#d946ef", border: "#c026d3" },      // Magenta
  { bg: "#f59e0b", border: "#d97706" },      // Amber
];

// ✅ Custom rendering: remove time from top of block
const CustomEvent = ({ event }) => {
  return <span className="whitespace-pre-wrap text-sm font-semibold">{event.title}</span>;
};

const ClinicScheduleCalendar = () => {
  const { data: scheduleData = [], isLoading } = useGetClinicSchedulesQuery();

  // Group schedules by date and time, combining staff with same time
  const groupedSchedules = scheduleData.reduce((acc, item) => {
    const key = `${item.date}T${item.start_time}T${item.end_time}`;
    
    if (!acc[key]) {
      acc[key] = {
        date: item.date,
        start_time: item.start_time,
        end_time: item.end_time,
        staffNames: [],
      };
    }
    
    // Add staff name to the list
    if (item.staff?.first_name && item.staff?.last_name) {
      acc[key].staffNames.push(`${item.staff.first_name} ${item.staff.last_name}`);
    } else if (item.staff?.username) {
      acc[key].staffNames.push(item.staff.username);
    }
    
    return acc;
  }, {});

  // Group by date to detect overlapping slots
  const schedulesByDate = {};
  Object.values(groupedSchedules).forEach((schedule) => {
    if (!schedulesByDate[schedule.date]) {
      schedulesByDate[schedule.date] = [];
    }
    schedulesByDate[schedule.date].push(schedule);
  });

  // Assign colors based on time slot overlap
  const timeSlotColors = {};
  Object.entries(schedulesByDate).forEach(([date, daySchedules]) => {
    // Sort by start time
    const sorted = daySchedules.sort((a, b) => a.start_time.localeCompare(b.start_time));
    
    sorted.forEach((schedule, index) => {
      const key = `${schedule.date}T${schedule.start_time}T${schedule.end_time}`;
      timeSlotColors[key] = COLORS[index % COLORS.length];
    });
  });

  const events = Object.values(groupedSchedules).map((item) => {
    // Join all staff names with line breaks for better display
    const staffDisplay = item.staffNames.length > 0 
      ? item.staffNames.join("\n") 
      : "Staff";

    const key = `${item.date}T${item.start_time}T${item.end_time}`;

    return {
      title: staffDisplay,
      start: new Date(`${item.date}T${item.start_time}`),
      end: new Date(`${item.date}T${item.end_time}`),
      colorKey: key,
    };
  });

  const eventStyleGetter = (event) => {
    const color = timeSlotColors[event.colorKey] || COLORS[0];
    return {
      style: {
        backgroundColor: color.bg,
        borderLeft: `4px solid ${color.border}`,
        borderRadius: "6px",
        padding: "6px 8px",
        color: "#fff",
        border: "none",
        fontWeight: 600,
        fontSize: "0.85rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
