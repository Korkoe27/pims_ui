import React, { useState } from "react";
import {
  useGetPharmacyBillsQuery,
  useGetBillPaymentSummaryQuery,
  useCreatePaymentMutation,
} from "../redux/api/features/billingApi";
import PageContainer from "../components/PageContainer";
import Card from "../components/ui/card";
import { showToast } from "../components/ToasterHelper";
import { FaDollarSign, FaCheckCircle } from "react-icons/fa";

export default function Finance() {
  const [selectedBill, setSelectedBill] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filter, setFilter] = useState("pending"); // all, pending, paid
  const [page, setPage] = useState(1);

  // Fetch bills based on filter
  const { data: billsData, isLoading } = useGetPharmacyBillsQuery({
    page,
    page_size: 10,
    status: filter === "all" ? undefined : filter,
  });

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
  };

  const handleMakePayment = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedBill(null);
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Finance</h1>
            <p className="text-gray-600 mt-1">Manage bills and payments</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded transition ${
                filter === "all"
                  ? "bg-[#2f3192] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Bills
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded transition ${
                filter === "pending"
                  ? "bg-[#2f3192] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-4 py-2 rounded transition ${
                filter === "paid"
                  ? "bg-[#2f3192] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Paid
            </button>
          </div>
        </div>

        {/* Bills List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bills List Column */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Bills</h2>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f3192]"></div>
                  </div>
                ) : billsData?.results?.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No bills found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {billsData?.results?.map((bill) => (
                      <BillCard
                        key={bill.id}
                        bill={bill}
                        isSelected={selectedBill?.id === bill.id}
                        onView={() => handleViewBill(bill)}
                        onMakePayment={() => handleMakePayment(bill)}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {billsData && billsData.count > 10 && (
                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!billsData.previous}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                      Previous
                    </button>
                    <span className="text-gray-600">
                      Page {page} of {Math.ceil(billsData.count / 10)}
                    </span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!billsData.next}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Bill Details Column */}
          <div className="lg:col-span-1">
            {selectedBill ? (
              <BillDetails bill={selectedBill} />
            ) : (
              <Card>
                <div className="p-6 text-center text-gray-500">
                  <p>Select a bill to view details</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <PaymentModal bill={selectedBill} onClose={handleClosePaymentModal} />
      )}
    </PageContainer>
  );
}

// Bill Card Component
function BillCard({ bill, isSelected, onView, onMakePayment }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partially_paid":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
        isSelected ? "border-[#2f3192] bg-blue-50" : "border-gray-200 bg-white"
      }`}
      onClick={onView}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-800">{bill.bill_number}</h3>
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                bill.status
              )}`}
            >
              {bill.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
          <div className="text-sm space-y-1">
            <p className="text-gray-600">
              <span className="font-medium">Patient:</span> {bill.patient_name} ({bill.patient_id})
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Total:</span> GHS {parseFloat(bill.total_amount).toFixed(2)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Balance:</span> GHS {parseFloat(bill.balance).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        {bill.status !== "paid" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMakePayment();
            }}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2 text-sm"
          >
            <FaDollarSign /> Pay
          </button>
        )}
      </div>
    </div>
  );
}

// Bill Details Component
function BillDetails({ bill }) {
  const { data: paymentSummary, isLoading } = useGetBillPaymentSummaryQuery(bill.id);

  if (isLoading) {
    return (
      <Card>
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2f3192]"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Bill Details</h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bill Number:</span>
            <span className="font-medium">{bill.bill_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Patient:</span>
            <span className="font-medium">{bill.patient_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Generated:</span>
            <span className="font-medium">
              {new Date(paymentSummary?.generated_at || bill.generated_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Payment Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-gray-800">
                GHS {parseFloat(paymentSummary?.total_amount || bill.total_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium text-green-600">
                GHS {parseFloat(paymentSummary?.amount_paid || bill.amount_paid).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Balance:</span>
              <span className="font-bold text-red-600">
                GHS {parseFloat(paymentSummary?.balance || bill.balance).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {paymentSummary?.payments && paymentSummary.payments.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-3">
              Payment History ({paymentSummary.payment_count})
            </h4>
            <div className="space-y-2">
              {paymentSummary.payments.map((payment) => (
                <div key={payment.id} className="bg-gray-50 p-3 rounded text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">GHS {parseFloat(payment.amount).toFixed(2)}</span>
                    <span className="text-gray-600">{payment.payment_method}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(payment.payment_date).toLocaleString()}
                  </p>
                  {payment.reference_number && (
                    <p className="text-xs text-gray-500">Ref: {payment.reference_number}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Payment Modal Component
function PaymentModal({ bill, onClose }) {
  const [paymentData, setPaymentData] = useState({
    amount: parseFloat(bill.balance),
    payment_method: "cash",
    reference_number: "",
    notes: "",
  });

  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentData.amount <= 0) {
      showToast("Payment amount must be greater than 0", "error");
      return;
    }

    if (paymentData.amount > parseFloat(bill.balance)) {
      showToast("Payment amount exceeds bill balance", "error");
      return;
    }

    try {
      await createPayment({
        bill: bill.id,
        ...paymentData,
      }).unwrap();

      showToast("✅ Payment recorded successfully!", "success");
      onClose();
    } catch (error) {
      console.error("Error recording payment:", error);
      const errorMessage =
        error?.data?.amount?.[0] ||
        error?.data?.detail ||
        "Failed to record payment";
      showToast(`❌ ${errorMessage}`, "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Record Payment</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-600">Bill: {bill.bill_number}</p>
              <p className="text-sm text-gray-600">Patient: {bill.patient_name}</p>
              <p className="text-lg font-bold text-gray-800 mt-2">
                Balance: GHS {parseFloat(bill.balance).toFixed(2)}
              </p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Amount (GHS) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={parseFloat(bill.balance)}
                value={paymentData.amount}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                required
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentData.payment_method}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, payment_method: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                required
              >
                <option value="cash">Cash</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Reference Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                value={paymentData.reference_number}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, reference_number: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                placeholder="Transaction reference (optional)"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={paymentData.notes}
                onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f3192]"
                placeholder="Additional notes (optional)"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaCheckCircle /> Record Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
