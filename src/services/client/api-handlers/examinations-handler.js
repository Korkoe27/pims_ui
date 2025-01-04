/**
 * Examination Handler
 *
 * This file contains functions to handle API requests related to examinations.
 * It includes handlers for creating, updating, and fetching case histories and 
 * other examination-related data.
 */

import { apiClient } from "../apiService";
import {
  createCaseHistoryUrl,
  updateCaseHistoryUrl,
  fetchCaseHistoryUrl,
  listAllPatientsUrl
} from '../endpoints';
import { baseURL } from "../baseurl";

// Create CaseHistory
export const createCaseHistoryHandler = async (data) => {
  const url = createCaseHistoryUrl; // Use static endpoint for creation
  return await apiClient.post(url, data);
};

// Update CaseHistory
export const updateCaseHistoryHandler = async (appointmentId, data) => {
  const url = updateCaseHistoryUrl(appointmentId); // Use dynamic endpoint
  return await apiClient.put(url, data);
};

// Fetch CaseHistory by appointmentId
export const fetchCaseHistoryHandler = async (appointmentId) => {
  const url = fetchCaseHistoryUrl(appointmentId); // Use dynamic endpoint
  return await apiClient.get(url);
};

// Create Patient
export const createPatient = async (payload) => {
  const url = `${baseURL}${listAllPatientsUrl}`;
  return await apiClient(url, { method: 'POST', data: payload });
};

