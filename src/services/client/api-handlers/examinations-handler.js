import apiClient from "../apiService";
import { baseURL } from "../baseurl"
import { createCaseHistory, updateCaseHistory, fetchCaseHistory } from '../endpoints';

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
