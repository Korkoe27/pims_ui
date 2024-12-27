// /**
//  * Authentication Mutations
//  * 
//  * Contains mutations for login, logout, and session management.
//  * 
//  */

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { baseURL } from "../client/baseurl";
// import { loginUrl, logoutUrl } from "../client/endpoints";

// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery: fetchBaseQuery({ baseUrl: baseURL, credentials: "include" }),
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: loginUrl,
//         method: "POST",
//         body: credentials,
//       }),
//     }),
//     logout: builder.mutation({
//       query: () => ({
//         url: logoutUrl,
//         method: "POST",
//       }),
//     }),
//   }),
// });

// export const { useLoginMutation, useLogoutMutation } = authApi;
