/**
 * Appointments Handler
 *
 * This file contains functions to handle API requests related to appointments.
 * It includes handlers for fetching dashboard statistics, fetching appointment details, 
 * and creating new appointments.
 */

import { apiClient } from "../apiService";
import { baseURL } from "../baseurl";
import { getDashboardStatUrl, fetchAppointmentsUrl } from "../endpoints";

export const handleAppointments = async () => {
  const url = `${baseURL}${getDashboardStatUrl}`;
  return await apiClient(url, { method: 'GET' });
};

export const fetchAppointmentsDetails = async () => {
  const url = `${baseURL}${fetchAppointmentsUrl}`;
  return await apiClient(url, { method: 'GET' });
};

export const createAppointments = async () => {
  const url = `${baseURL}${getDashboardStatUrl}`;
  return await apiClient(url, { method: 'GET' });
};
