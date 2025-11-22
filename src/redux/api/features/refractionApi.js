import { apiClient } from "../api_client/apiClient";
import {
  createRefractionUrl,
  fetchRefractionUrl,
  fetchRefractionByVersionUrl,
} from "../end_points/endpoints";

export const refractionApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    /** ✅ Fetch Refraction for an Appointment (with optional version) **/
    fetchRefraction: builder.query({
      query: ({ appointmentId, versionId } = {}) => {
        // ✅ Both appointmentId and versionId for version-aware queries
        if (versionId && appointmentId) {
          return {
            url: fetchRefractionByVersionUrl(appointmentId, versionId),
          };
        }
        // Fallback to appointmentId only
        if (appointmentId) {
          return {
            url: fetchRefractionUrl(appointmentId),
          };
        }
        return { url: "" };
      },
      skip: ({ appointmentId } = {}) => !appointmentId,
      providesTags: ["Refraction"],
    }),

    /** ✅ Create Refraction for an Appointment **/
    createRefraction: builder.mutation({
      query: ({ appointmentId, consultation_version, ...body }) => {
        const payload = {
          ...body,
          appointment: appointmentId,
          consultation_version,
        };
        // console.log("🔹 refractionApi mutation body:", payload);
        return {
          url: createRefractionUrl(appointmentId),
          method: "POST",
          body: payload,
        };
      },
      invalidatesTags: ["Refraction"],
    }),
  }),
});

export const {
  useFetchRefractionQuery,
  useCreateRefractionMutation,
} = refractionApi;
