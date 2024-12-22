/**
 * Examination Mutations
 * 
 * Contains mutations for managing examinations like case history, visual acuity, etc.
 * 
 * Author: Solomon Edziah
 * Date: 2024-12-22
 */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../baseurl";
import {
  createCaseHistoryUrl,
  updateCaseHistoryUrl,
  fetchCaseHistoryUrl,
} from "../endpoints";

export const examinationApi = createApi({
  reducerPath: "examinationApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL, credentials: "include" }),
  endpoints: (builder) => ({
    createCaseHistory: builder.mutation({
      query: (caseHistoryData) => ({
        url: createCaseHistoryUrl,
        method: "POST",
        body: caseHistoryData,
      }),
    }),
    updateCaseHistory: builder.mutation({
      query: ({ appointmentId, caseHistoryData }) => ({
        url: updateCaseHistoryUrl(appointmentId),
        method: "PUT",
        body: caseHistoryData,
      }),
    }),
    fetchCaseHistory: builder.query({
      query: (appointmentId) => ({
        url: fetchCaseHistoryUrl(appointmentId),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCaseHistoryMutation,
  useUpdateCaseHistoryMutation,
  useFetchCaseHistoryQuery,
} = examinationApi;
