import { apiClient } from "../api_client/apiClient";
import {
  fetchCaseHistoryUrl,
  createCaseHistoryUrl,
  updateCaseHistoryUrl,
  fetchVisualAcuityUrl,
  createVisualAcuityUrl,
  updateVisualAcuityUrl,
  fetchExternalsUrl,
  createExternalsUrl,
  updateExternalsUrl,
  fetchInternalsUrl,
  createInternalsUrl,
  updateInternalsUrl,
  fetchRefractionUrl,
  createRefractionUrl,
  updateRefractionUrl,
  fetchExtraTestsUrl,
  createExtraTestsUrl,
  updateExtraTestsUrl,
} from "../end_points/endpoints";

export const consultationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Case History Endpoints
    fetchCaseHistory: builder.query({
      query: (appointmentId) => ({
        url: fetchCaseHistoryUrl(appointmentId),
        method: "GET",
      }),
    }),
    createCaseHistory: builder.mutation({
      query: (caseHistoryData) => ({
        url: createCaseHistoryUrl,
        method: "POST",
        body: caseHistoryData,
      }),
    }),
    updateCaseHistory: builder.mutation({
      query: ({ appointmentId, ...caseHistoryData }) => ({
        url: updateCaseHistoryUrl(appointmentId),
        method: "PUT",
        body: caseHistoryData,
      }),
    }),

    // Visual Acuity Endpoints
    fetchVisualAcuity: builder.query({
      query: (appointmentId) => ({
        url: fetchVisualAcuityUrl(appointmentId),
        method: "GET",
      }),
    }),
    createVisualAcuity: builder.mutation({
      query: (visualAcuityData) => ({
        url: createVisualAcuityUrl,
        method: "POST",
        body: visualAcuityData,
      }),
    }),
    updateVisualAcuity: builder.mutation({
      query: ({ appointmentId, ...visualAcuityData }) => ({
        url: updateVisualAcuityUrl(appointmentId),
        method: "PUT",
        body: visualAcuityData,
      }),
    }),

    // Externals Endpoints
    fetchExternals: builder.query({
      query: (appointmentId) => ({
        url: fetchExternalsUrl(appointmentId),
        method: "GET",
      }),
    }),
    createExternals: builder.mutation({
      query: (externalsData) => ({
        url: createExternalsUrl,
        method: "POST",
        body: externalsData,
      }),
    }),
    updateExternals: builder.mutation({
      query: ({ appointmentId, ...externalsData }) => ({
        url: updateExternalsUrl(appointmentId),
        method: "PUT",
        body: externalsData,
      }),
    }),

    // Internals Endpoints
    fetchInternals: builder.query({
      query: (appointmentId) => ({
        url: fetchInternalsUrl(appointmentId),
        method: "GET",
      }),
    }),
    createInternals: builder.mutation({
      query: (internalsData) => ({
        url: createInternalsUrl,
        method: "POST",
        body: internalsData,
      }),
    }),
    updateInternals: builder.mutation({
      query: ({ appointmentId, ...internalsData }) => ({
        url: updateInternalsUrl(appointmentId),
        method: "PUT",
        body: internalsData,
      }),
    }),

    // Refraction Endpoints
    fetchRefraction: builder.query({
      query: (appointmentId) => ({
        url: fetchRefractionUrl(appointmentId),
        method: "GET",
      }),
    }),
    createRefraction: builder.mutation({
      query: (refractionData) => ({
        url: createRefractionUrl,
        method: "POST",
        body: refractionData,
      }),
    }),
    updateRefraction: builder.mutation({
      query: ({ appointmentId, ...refractionData }) => ({
        url: updateRefractionUrl(appointmentId),
        method: "PUT",
        body: refractionData,
      }),
    }),

    // Extra Tests Endpoints
    fetchExtraTests: builder.query({
      query: (appointmentId) => ({
        url: fetchExtraTestsUrl(appointmentId),
        method: "GET",
      }),
    }),
    createExtraTests: builder.mutation({
      query: (extraTestsData) => ({
        url: createExtraTestsUrl,
        method: "POST",
        body: extraTestsData,
      }),
    }),
    updateExtraTests: builder.mutation({
      query: ({ appointmentId, ...extraTestsData }) => ({
        url: updateExtraTestsUrl(appointmentId),
        method: "PUT",
        body: extraTestsData,
      }),
    }),
  }),
});

// Export hooks for components to use
export const {
  useFetchCaseHistoryQuery,
  useCreateCaseHistoryMutation,
  useUpdateCaseHistoryMutation,
  useFetchVisualAcuityQuery,
  useCreateVisualAcuityMutation,
  useUpdateVisualAcuityMutation,
  useFetchExternalsQuery,
  useCreateExternalsMutation,
  useUpdateExternalsMutation,
  useFetchInternalsQuery,
  useCreateInternalsMutation,
  useUpdateInternalsMutation,
  useFetchRefractionQuery,
  useCreateRefractionMutation,
  useUpdateRefractionMutation,
  useFetchExtraTestsQuery,
  useCreateExtraTestsMutation,
  useUpdateExtraTestsMutation,
} = consultationApi;
