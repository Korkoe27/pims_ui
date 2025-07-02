import React, { useState } from "react";
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
import { ROLES } from "../constants/roles";

const ClinicSchedule = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("14:00");
  const { data: scheduleData = [], isLoading: scheduleLoading } =
    useGetClinicSchedulesQuery();

  const { data: staff = [] } = useGetScheduleStaffQuery();
  const [createSchedule] = useCreateClinicScheduleMutation();

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
      await createSchedule(schedules).unwrap();
      toast.success("Clinic schedule created successfully.");
      setShowModal(false);
      setSelectedDate("");
      setSelectedStaff([]);
    } catch (err) {
      toast.error("Failed to create schedule.");
    }
  };

  return (
    <PageContainer>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Clinic Schedule</h1>
        <CanAccess allowedRoles={[ROLES.COORDINATOR]}>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Schedule
          </button>
        </CanAccess>
      </div>

      <Card className="p-4">
        <ClinicScheduleCalendar />
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Create Clinic Schedule
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <label className="block mb-2 font-medium">Select Staff</label>
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {staff.map((person) => (
                    <label key={person.id} className="block">
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(person.id)}
                        onChange={() => handleCheckboxChange(person.id)}
                        className="mr-2"
                      />
                      {person.name}
                    </label>
                  ))}
                </div>
              </div>

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
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Schedule
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
