import React, { useState } from "react";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import Card from "../components/ui/card";
import ClinicScheduleCalendar from "../components/ClinicScheduleCalendar";
import {
  useGetAvailableStaffQuery,
  useCreateClinicScheduleMutation,
  useGetClinicSchedulesQuery,
} from "../redux/api/features/clinicScheduleApi";
import { toast } from "react-hot-toast";
import CanAccess from "../components/auth/CanAccess";
import EditClinicScheduleButton from "../components/ui/buttons/EditClinicScheduleButton";
import DeleteClinicScheduleButton from "../components/ui/buttons/DeleteClinicScheduleButton";

const ClinicSchedule = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("14:00");

  const { data: scheduleData = [], isLoading: scheduleLoading } =
    useGetClinicSchedulesQuery();
  
  // 🔹 Fetch AVAILABLE staff for the selected date (excludes staff on approved absence)
  const { data: staffResponse = [], isLoading: staffLoading } =
    useGetAvailableStaffQuery(selectedDate || null);
  
  // 🔹 Extract staff array and handle response structure
  const staff = Array.isArray(staffResponse) ? staffResponse : staffResponse.results || [];
  
  const [createSchedule, { isLoading: creating }] =
    useCreateClinicScheduleMutation();

  const { user } = useSelector((state) => state.auth || {});
  const access = user?.access || {};

  // ✅ Helper: determine if Action column should show
  const hasActionAccess =
    access.canUpdateClinicSchedule || access.canDeleteClinicSchedule;

  const handleCheckboxChange = (staffId) => {
    setSelectedStaff((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedStaff([]); // Reset selected staff when date changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || selectedStaff.length === 0) {
      toast.error("Please select a date and at least one staff member.");
      return;
    }

    const schedules = selectedStaff.map((id) => ({
      staff_id: id,
      date: selectedDate,
      start_time: startTime,
      end_time: endTime,
    }));

    try {
      toast.loading("Creating schedule...");
      await createSchedule(schedules).unwrap();
      toast.dismiss();
      toast.success("Clinic schedule created successfully.");
      setShowModal(false);
      setSelectedDate("");
      setSelectedStaff([]);
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to create schedule.");
    }
  };

  const handleEdit = (schedule) => {
    toast(`Editing schedule for ${schedule.date}`, { icon: "📝" });
    // Future: open edit modal prefilled with schedule data
  };

  const handleDelete = (scheduleId) => {
    toast(`Deleting schedule ${scheduleId}...`, { icon: "🗑️" });
    // Future: trigger delete mutation with confirmation modal
  };

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold">Clinic Schedule</h1>

        <CanAccess accessKeys={["canCreateClinicSchedule"]}>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Schedule
          </button>
        </CanAccess>
      </div>

      {/* Calendar View */}
      <div className="mt-8">
        <Card className="p-4">
          <ClinicScheduleCalendar
            schedules={scheduleData}
            isLoading={scheduleLoading}
          />
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Create Clinic Schedule
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date */}
              <div>
                <label className="block mb-1 font-medium">Date *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
                {selectedDate && !staffLoading && staff.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ℹ️ No staff available for this date (all on absence)
                  </p>
                )}
              </div>

              {/* Time range */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>

              {/* Staff list - Now shows AVAILABLE staff only */}
              <div>
                <label className="block mb-2 font-medium">
                  Select Staff {selectedDate && <span className="text-xs text-gray-500">(Available for {selectedDate})</span>}
                </label>
                <div className="max-h-48 overflow-y-auto border rounded p-2">
                  {staffLoading ? (
                    <p className="text-gray-500 text-sm px-2 py-1">
                      Loading available staff...
                    </p>
                  ) : staff.length > 0 ? (
                    staff.map((person) => {
                      // Staff response has first_name, last_name, username as fallback
                      const displayName = 
                        (person.first_name && person.last_name) 
                          ? `${person.first_name} ${person.last_name}`
                          : person.username || person.email || `Staff #${person.id}`;
                      return (
                        <label key={person.id} className="block cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={selectedStaff.includes(person.id)}
                            onChange={() => handleCheckboxChange(person.id)}
                            className="mr-2"
                          />
                          <span>{displayName}</span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm px-2 py-1">
                      {selectedDate ? "No staff available for this date." : "Select a date to see available staff."}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className={`px-4 py-2 rounded text-white ${
                    creating
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {creating ? "Saving..." : "Save Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default ClinicSchedule;
