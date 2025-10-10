// import { setupApiStore } from "../../store/setupApiStore"; // Path to setupApiStore
// import { dashboardApi } from "../../../redux/api/features/dashboardApi";
// import fetchMock from "jest-fetch-mock";

// describe("Dashboard API", () => {
//   let storeRef;

//   beforeEach(() => {
//     fetchMock.resetMocks(); // Reset fetch mocks before each test
//     storeRef = setupApiStore(dashboardApi); // Initialize the test store
//   });

//   it("fetches dashboard data successfully", async () => {
//     const mockDashboardData = {
//       total_patients: 102,
//       pending_appointments: 3,
//       completed_appointments: 5,
//       today_appointments: {
//         count: 2,
//         data: [
//           {
//             id: "1",
//             appointment_date: "2024-12-26",
//             patient: {
//               first_name: "John",
//               last_name: "Doe",
//             },
//           },
//         ],
//       },
//     };

//     fetchMock.mockResponseOnce(JSON.stringify(mockDashboardData)); // Mock the API response

//     const result = await storeRef.store.dispatch(
//       dashboardApi.endpoints.getDashboardData.initiate()
//     );

//     // Expectations
//     expect(result.data).toEqual(mockDashboardData);
//     expect(fetchMock).toHaveBeenCalledTimes(1);
//   });

//   it("handles API errors gracefully", async () => {
//     fetchMock.mockRejectOnce(new Error("Internal Server Error")); // Mock an API error

//     const result = await storeRef.store.dispatch(
//       dashboardApi.endpoints.getDashboardData.initiate()
//     );

//     // Expectations
//     expect(result.error).toBeDefined();
//     expect(result.error.message).toBe("Internal Server Error");
//   });
// });