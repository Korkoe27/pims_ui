import apiClient from "../apiService";
import { createCaseHistory, updateCaseHistory, fetchCaseHistory, listPatients } from '../endpoints';
import { baseURL } from "../baseurl"

// Create CaseHistory
export const createCaseHistoryHandler = async (data) => {
const url = createCaseHistory; // Use static endpoint for creation
return await apiClient.post(url, data);
};

// Update CaseHistory
export const updateCaseHistoryHandler = async (appointmentId, data) => {
const url = updateCaseHistory(appointmentId); // Use dynamic endpoint
return await apiClient.put(url, data);
};

// Fetch CaseHistory by appointmentId
export const fetchCaseHistoryHandler = async (appointmentId) => {
const url = fetchCaseHistory(appointmentId); // Use dynamic endpoint
return await apiClient.get(url);
};

export const    createPatient  =    async  (payload)  =>   {
  const   url = `${baseURL}${listPatients}`;
  return   await apiClient(url,     {method:    'POST',data:payload});

}

export const testCreateCaseHistoryHandler = async () => {
    const staticData = {
      appointment: "931199f1-79e4-427a-a240-2b980698ad26",
      chief_complaint: "Blurry vision and headaches",
      last_eye_examination: "2023-12-01",
      burning_sensation: true,
      itching: false,
      tearing: true,
    };
  
    const url = '/tests/api/case-history/';
    console.log("Sending static data to API:", JSON.stringify(staticData, null, 2));
  
    try {
      const response = await apiClient.post(url, staticData);
      console.log("Static data response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error with static data request:", error.response || error.message);
      throw error;
    }
  };
  
