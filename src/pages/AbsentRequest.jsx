import React, { useState } from "react";
import { Tabs, Tab } from "../components/ui/tabs";
import Card from "../components/ui/card";
import PageContainer from "../components/PageContainer";
import {
  useGetAbsentRequestsQuery,
  useCreateAbsentRequestMutation,
} from "../redux/api/features/absentRequestApi";

const AbsentRequest = () => {
  const [showModal, setShowModal] = useState(false);
  const { data: requests = [] } = useGetAbsentRequestsQuery();
  const [createAbsentRequest] = useCreateAbsentRequestMutation();

  const handleCreateRequest = (data) => {
    createAbsentRequest(data).then(() => setShowModal(false));
  };

  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");
  const rejected = requests.filter((r) => r.status === "rejected");

  return (
    <PageContainer>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Absent Requests</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Make Request
        </button>
      </div>

      <Tabs>
        <Tab title="Pending Requests">
          <Card className="p-4 mt-4">
            {pending.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((req) => (
                    <tr key={req.id}>
                      <td>{req.from_date}</td>
                      <td>{req.to_date}</td>
                      <td>{req.reason}</td>
                      <td>
                        <button className="text-green-600">Approve</button>
                        <button className="text-red-600 ml-2">Decline</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </Tab>
        <Tab title="Approved Requests">
          <Card className="p-4 mt-4">
            {approved.length === 0 ? (
              <p>No approved requests.</p>
            ) : (
              <ul>
                {approved.map((req) => (
                  <li key={req.id}>
                    {req.reason} ({req.from_date} - {req.to_date})
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </Tab>
        <Tab title="Rejected Requests">
          <Card className="p-4 mt-4">
            {rejected.length === 0 ? (
              <p>No rejected requests.</p>
            ) : (
              <ul>
                {rejected.map((req) => (
                  <li key={req.id}>
                    {req.reason} ({req.from_date} - {req.to_date})
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </Tab>
      </Tabs>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Absent Request</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const data = {
                  from_date: form.from_date.value,
                  to_date: form.to_date.value,
                  reason: form.reason.value,
                };
                handleCreateRequest(data);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="from_date" className="block font-medium mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  name="from_date"
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                />
              </div>

              <div>
                <label htmlFor="to_date" className="block font-medium mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  name="to_date"
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                />
              </div>

              <div>
                <label htmlFor="reason" className="block font-medium mb-1">
                  Reason
                </label>
                <textarea
                  name="reason"
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded h-24 resize-none"
                ></textarea>
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AbsentRequest;
