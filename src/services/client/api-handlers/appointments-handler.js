import apiClient from "../apiService";
import { baseURL } from "../baseurl"
import { getAppointmentsUrl } from "../endpoints"

export const    handleAppointments  =   async   ()  =>   {
    const   url = `${baseURL}${getAppointmentsUrl}`;
    return  apiClient(url,  {method:    'GET'});
}