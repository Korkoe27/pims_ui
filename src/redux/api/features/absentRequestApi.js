import { apiClient } from "../api_client/apiClient";
import { absentRequestsUrl, updateAbsentRequestUrl } from "../end_points/endpoints";

export const absentRequestApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getAbsentRequests: builder.query({
      query: () => ({
        url: absentRequestsUrl,
        method: "GET",
      }),
      providesTags: ["AbsentRequests"],
    }),
    createAbsentRequest: builder.mutation({
      query: (data) => ({
        url: absentRequestsUrl,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AbsentRequests"],
    }),
    updateAbsentRequest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: updateAbsentRequestUrl(id),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AbsentRequests"],
    }),
  }),
});

export const {
  useGetAbsentRequestsQuery,
  useCreateAbsentRequestMutation,
  useUpdateAbsentRequestMutation,
} = absentRequestApi;
