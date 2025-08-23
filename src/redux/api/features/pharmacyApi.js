// redux/api/features/pharmacyApi.js
import api from "../../apiClient";
import { getPharmacyOrderUrl, upsertPharmacyOrderUrl } from "../../../api/endpoints";

export const pharmacyApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPharmacyOrder: build.query({
      query: (appointmentId) => getPharmacyOrderUrl(appointmentId),
    }),
    upsertPharmacyOrder: build.mutation({
      query: ({ appointmentId, data }) => ({
        url: upsertPharmacyOrderUrl(appointmentId),
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPharmacyOrderQuery,
  useUpsertPharmacyOrderMutation,
} = pharmacyApi;
