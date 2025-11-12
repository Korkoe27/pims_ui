import { apiClient } from "../api_client/apiClient";
import {
  pharmacyBillsUrl,
  pharmacyBillDetailUrl,
  appointmentBillsUrl,
  pendingBillsUrl,
  paymentsUrl,
  paymentDetailUrl,
  billPaymentsUrl,
  billPaymentSummaryUrl,
} from "../end_points/endpoints";

export const billingApi = apiClient.injectEndpoints({
  tagTypes: ["PharmacyBills", "Payments"],

  endpoints: (builder) => ({
    // ======================
    // Pharmacy Bills
    // ======================

    // Get all pharmacy bills
    getPharmacyBills: builder.query({
      query: ({ page = 1, page_size = 10, status, search } = {}) => ({
        url: pharmacyBillsUrl,
        method: "GET",
        params: { page, page_size, status, search },
      }),
      providesTags: ["PharmacyBills"],
    }),

    // Get single pharmacy bill
    getPharmacyBill: builder.query({
      query: (billId) => ({
        url: pharmacyBillDetailUrl(billId),
        method: "GET",
      }),
      providesTags: (result, error, billId) => [{ type: "PharmacyBills", id: billId }],
    }),

    // Create pharmacy bill
    createPharmacyBill: builder.mutation({
      query: (billData) => ({
        url: pharmacyBillsUrl,
        method: "POST",
        body: billData,
      }),
      invalidatesTags: ["PharmacyBills"],
    }),

    // Update pharmacy bill
    updatePharmacyBill: builder.mutation({
      query: ({ billId, ...billData }) => ({
        url: pharmacyBillDetailUrl(billId),
        method: "PUT",
        body: billData,
      }),
      invalidatesTags: (result, error, { billId }) => [
        { type: "PharmacyBills", id: billId },
        "PharmacyBills",
      ],
    }),

    // Delete pharmacy bill
    deletePharmacyBill: builder.mutation({
      query: (billId) => ({
        url: pharmacyBillDetailUrl(billId),
        method: "DELETE",
      }),
      invalidatesTags: ["PharmacyBills"],
    }),

    // Get bills for specific appointment
    getAppointmentBills: builder.query({
      query: (appointmentId) => ({
        url: appointmentBillsUrl(appointmentId),
        method: "GET",
      }),
      providesTags: (result, error, appointmentId) => [
        { type: "PharmacyBills", id: `appointment-${appointmentId}` },
      ],
    }),

    // Get pending bills
    getPendingBills: builder.query({
      query: ({ page = 1, page_size = 10 } = {}) => ({
        url: pendingBillsUrl,
        method: "GET",
        params: { page, page_size },
      }),
      providesTags: ["PharmacyBills"],
    }),

    // ======================
    // Payments
    // ======================

    // Get all payments
    getPayments: builder.query({
      query: ({ page = 1, page_size = 10, bill, payment_method } = {}) => ({
        url: paymentsUrl,
        method: "GET",
        params: { page, page_size, bill, payment_method },
      }),
      providesTags: ["Payments"],
    }),

    // Get single payment
    getPayment: builder.query({
      query: (paymentId) => ({
        url: paymentDetailUrl(paymentId),
        method: "GET",
      }),
      providesTags: (result, error, paymentId) => [{ type: "Payments", id: paymentId }],
    }),

    // Create payment
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: paymentsUrl,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payments", "PharmacyBills"],
    }),

    // Update payment
    updatePayment: builder.mutation({
      query: ({ paymentId, ...paymentData }) => ({
        url: paymentDetailUrl(paymentId),
        method: "PUT",
        body: paymentData,
      }),
      invalidatesTags: (result, error, { paymentId }) => [
        { type: "Payments", id: paymentId },
        "Payments",
        "PharmacyBills",
      ],
    }),

    // Delete payment
    deletePayment: builder.mutation({
      query: (paymentId) => ({
        url: paymentDetailUrl(paymentId),
        method: "DELETE",
      }),
      invalidatesTags: ["Payments", "PharmacyBills"],
    }),

    // Get payments for specific bill
    getBillPayments: builder.query({
      query: (billId) => ({
        url: billPaymentsUrl(billId),
        method: "GET",
      }),
      providesTags: (result, error, billId) => [{ type: "Payments", id: `bill-${billId}` }],
    }),

    // Get bill payment summary
    getBillPaymentSummary: builder.query({
      query: (billId) => ({
        url: billPaymentSummaryUrl(billId),
        method: "GET",
      }),
      providesTags: (result, error, billId) => [
        { type: "Payments", id: `bill-${billId}` },
        { type: "PharmacyBills", id: billId },
      ],
    }),
  }),
});

export const {
  // Pharmacy Bills
  useGetPharmacyBillsQuery,
  useGetPharmacyBillQuery,
  useCreatePharmacyBillMutation,
  useUpdatePharmacyBillMutation,
  useDeletePharmacyBillMutation,
  useGetAppointmentBillsQuery,
  useGetPendingBillsQuery,
  
  // Payments
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
  useGetBillPaymentsQuery,
  useGetBillPaymentSummaryQuery,
} = billingApi;
