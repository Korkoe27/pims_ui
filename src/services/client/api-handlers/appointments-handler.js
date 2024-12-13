import apiClient from "../apiService";
import { baseURL } from "../baseurl"
import { getDashboardStat } from "../endpoints"

export const    handleAppointments  =   async   ()  =>   {
    const   url = `${baseURL}${getDashboardStat}`;
    return  await apiClient(url,  {method:    'GET'});
}

export const    createAppointments  =   async   ()  =>   {
    const   url = `${baseURL}${getDashboardStat}`;
    return  await apiClient(url,  {method:    'GET'});
}