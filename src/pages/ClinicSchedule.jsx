import React, { useState } from "react";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import Card from "../components/ui/card";
import ClinicScheduleCalendar from "../components/ClinicScheduleCalendar";
import {
  useGetScheduleStaffQuery,
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
  const { data: staff = [], isLoading: staffLoading } =
    useGetScheduleStaffQuery();
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

      {/* Schedule Table */}
      <Card className="p-4">
        {scheduleLoading ? (
          <p>Loading schedules...</p>
        ) : scheduleData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-500 border">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Staff</th>
                  <th className="px-6 py-3 font-semibold">Start Time</th>
                  <th className="px-6 py-3 font-semibold">End Time</th>
                  {hasActionAccess && (
                    <th className="px-6 py-3 font-semibold text-center">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((schedule) => (
                  <tr key={schedule.id} className="bg-white border-b">
                    <td className="px-6 py-4">{schedule.date}</td>
                    <td className="px-6 py-4">
                      {schedule.staff_names?.join(", ") || "—"}
                    </td>
                    <td className="px-6 py-4">{schedule.start_time}</td>
                    <td className="px-6 py-4">{schedule.end_time}</td>

                    {hasActionAccess && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <EditClinicScheduleButton
                            onClick={() => handleEdit(schedule)}
                          />
                          <DeleteClinicScheduleButton
                            onClick={() => handleDelete(schedule.id)}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">
            No schedules available.
          </p>
        )}
      </Card>

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
                <label className="block mb-1 font-medium">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
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

              {/* Staff list */}
              <div>
                <label className="block mb-2 font-medium">Select Staff</label>
                <div className="max-h-48 overflow-y-auto border rounded p-2">
                  {staffLoading ? (
                    <p className="text-gray-500 text-sm px-2 py-1">
                      Loading staff...
                    </p>
                  ) : staff.length > 0 ? (
                    staff.map((person) => (
                      <label key={person.id} className="block">
                        <input
                          type="checkbox"
                          checked={selectedStaff.includes(person.id)}
                          onChange={() => handleCheckboxChange(person.id)}
                          className="mr-2"
                        />
                        {person.name}
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm px-2 py-1">
                      No staff available.
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
