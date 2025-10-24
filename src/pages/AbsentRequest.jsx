import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Tabs, Tab } from "../components/ui/tabs";
import Card from "../components/ui/card";
import PageContainer from "../components/PageContainer";
import ConfirmationModal from "../components/ConfirmationModal";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  useGetAbsentRequestsQuery,
  useCreateAbsentRequestMutation,
  useUpdateAbsentRequestMutation,
} from "../redux/api/features/absentRequestApi";
import { toast } from "react-hot-toast";

// ✅ Access-aware buttons
import MakeAbsentRequestButton from "../components/ui/buttons/MakeAbsentRequestButton";
import ApproveRequestButton from "../components/ui/buttons/ApproveRequestButton";
import DeclineRequestButton from "../components/ui/buttons/DeclineRequestButton";

const AbsentRequest = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    open: false,
    id: null,
    status: "",
    action: "",
  });

  // 🔹 Auth + Access
  const { user } = useSelector((state) => state.auth || {});
  const access = user?.access || {};
  const currentUserId = user?.id;

  // 🔹 Fetch data (skip query if no view access)
  const canView = access.canViewAbsentRequests;
  const { data: allRequests = [], isLoading } = useGetAbsentRequestsQuery(
    undefined,
    { skip: !canView }
  );

  const [createAbsentRequest] = useCreateAbsentRequestMutation();
  const [updateAbsentRequest] = useUpdateAbsentRequestMutation();

  // 🔹 Filter for current user (if non-admin)
  const requests = allRequests.filter(
    (req) => req.user === currentUserId || req.user_id === currentUserId
  );

  // 🔹 Handlers
  const handleCreateRequest = async (data) => {
    try {
      await createAbsentRequest(data).unwrap();
      toast.success("Absent request submitted successfully");
      setShowModal(false);
    } catch {
      toast.error("Failed to submit request");
    }
  };

  const handleStatusChange = (id, status) => {
    const action = status === "approved" ? "Approve" : "Decline";
    setModalData({ open: true, id, status, action });
  };

  const confirmStatusChange = async () => {
    const { id, status, action } = modalData;
    try {
      await updateAbsentRequest({ id, status }).unwrap();
      toast.success(`Request ${action.toLowerCase()}d successfully`);
      setModalData({ ...modalData, open: false });
    } catch {
      toast.error(`Failed to ${action.toLowerCase()} request`);
    }
  };

  // 🔹 Categorize requests
  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");
  const rejected = requests.filter((r) => r.status === "rejected");

  // 🔹 Access gate
  if (!canView) {
    return (
      <PageContainer>
        <div className="p-6 bg-red-50 border border-red-200 rounded-md text-red-700 font-medium">
          You do not have permission to view Absent Requests.
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-10">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  // ✅ Header visibility logic (only show Actions column if any button will render)
  const showActionHeader =
    ApproveRequestButton.shouldShow(access) ||
    DeclineRequestButton.shouldShow(access);

  return (
    <PageContainer>
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Absent Requests</h1>
        <MakeAbsentRequestButton onClick={() => setShowModal(true)} />
      </div>

      {/* ===== Tabs ===== */}
      <Tabs>
        {/* PENDING REQUESTS */}
        <Tab title="Pending Requests">
          <Card className="p-4 mt-4 overflow-x-auto">
            {pending.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-500">
                  <thead className="text-sm text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 font-bold">From</th>
                      <th className="px-6 py-3 font-bold">To</th>
                      <th className="px-6 py-3 font-bold">Reason</th>
                      {showActionHeader && (
                        <th className="px-6 py-3 font-bold text-center">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {pending.map((req) => (
                      <tr key={req.id} className="border-b bg-white">
                        <td className="px-6 py-4">{req.from_date}</td>
                        <td className="px-6 py-4">{req.to_date}</td>
                        <td className="px-6 py-4">{req.reason}</td>
                        {showActionHeader && (
                          <td className="px-6 py-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <ApproveRequestButton
                                onClick={() =>
                                  handleStatusChange(req.id, "approved")
                                }
                              />
                              <DeclineRequestButton
                                onClick={() =>
                                  handleStatusChange(req.id, "rejected")
                                }
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </Tab>

        {/* APPROVED REQUESTS */}
        <Tab title="Approved Requests">
          <Card className="p-4 mt-4 overflow-x-auto">
            {approved.length === 0 ? (
              <p>No approved requests.</p>
            ) : (
              <table className="min-w-full text-sm text-left text-gray-500">
                <thead className="text-sm text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-bold">From</th>
                    <th className="px-6 py-3 font-bold">To</th>
                    <th className="px-6 py-3 font-bold">Reason</th>
                    <th className="px-6 py-3 font-bold">Approved At</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((req) => (
                    <tr key={req.id} className="border-b bg-white">
                      <td className="px-6 py-4">{req.from_date}</td>
                      <td className="px-6 py-4">{req.to_date}</td>
                      <td className="px-6 py-4">{req.reason}</td>
                      <td className="px-6 py-4">
                        {req.actioned_at
                          ? new Date(req.actioned_at).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </Tab>

        {/* REJECTED REQUESTS */}
        <Tab title="Rejected Requests">
          <Card className="p-4 mt-4 overflow-x-auto">
            {rejected.length === 0 ? (
              <p>No rejected requests.</p>
            ) : (
              <table className="min-w-full text-sm text-left text-gray-500">
                <thead className="text-sm text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-bold">From</th>
                    <th className="px-6 py-3 font-bold">To</th>
                    <th className="px-6 py-3 font-bold">Reason</th>
                    <th className="px-6 py-3 font-bold">Actioned By</th>
                    <th className="px-6 py-3 font-bold">Actioned At</th>
                  </tr>
                </thead>
                <tbody>
                  {rejected.map((req) => (
                    <tr key={req.id} className="border-b bg-white">
                      <td className="px-6 py-4">{req.from_date}</td>
                      <td className="px-6 py-4">{req.to_date}</td>
                      <td className="px-6 py-4">{req.reason}</td>
                      <td className="px-6 py-4">{req.actioned_by || "—"}</td>
                      <td className="px-6 py-4">
                        {req.actioned_at
                          ? new Date(req.actioned_at).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </Tab>
      </Tabs>

      {/* ===== CREATE REQUEST MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Absent Request</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                handleCreateRequest({
                  from_date: form.from_date.value,
                  to_date: form.to_date.value,
                  reason: form.reason.value,
                });
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

      {/* ===== CONFIRMATION MODAL ===== */}
      <ConfirmationModal
        isOpen={modalData.open}
        title={`${modalData.action} Request`}
        message={`Are you sure you want to ${modalData.action.toLowerCase()} this request?`}
        onConfirm={confirmStatusChange}
        onClose={() => setModalData({ ...modalData, open: false })}
      />
    </PageContainer>
  );
};

export default AbsentRequest;
