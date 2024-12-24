// /**
//  * Patient Mutations
//  * 
//  * This file contains mutation hooks for managing patients in the application.
//  * 
//  */

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { baseURL } from "../client/baseurl"; // Dynamic base URL
// import {
//   listAllPatientsUrl,
//   updatePatientDetailsUrl,
//   creatNewPatientUrl,
// } from "../client/endpoints"

// export const patientApi = createApi({
//   reducerPath: "patientApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: baseURL,
//     credentials: "include", // Include cookies
//   }),
//   endpoints: (builder) => ({
//     // Mutation to create a new patient
//     createPatient: builder.mutation({
//       query: (patientData) => ({
//         url: creatNewPatientUrl, // Pre-defined endpoint
//         method: "POST",
//         body: patientData,
//       }),
//     }),
//     // Mutation to update patient details
//     updatePatient: builder.mutation({
//       query: ({ patientId, patientData }) => ({
//         url: updatePatientDetailsUrl(patientId), // Dynamic endpoint
//         method: "PUT",
//         body: patientData,
//       }),
//     }),
//     // Fetch all patients (if needed as a mutation)
//     listPatients: builder.query({
//       query: () => ({
//         url: listAllPatientsUrl,
//         method: "GET",
//       }),
//     }),
//   }),
// });

// // Export hooks for functional components
// export const {
//   useCreatePatientMutation,
//   useUpdatePatientMutation,
//   useListPatientsQuery,
// } = patientApi;
