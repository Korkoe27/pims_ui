// import apiClient from "../apiService";
import { baseURL } from "../baseurl";
import { listAllPatientsUrl } from "../endpoints";
import {apiClient}  from "../apiService";


export const showPatients   =   async   ()  =>  {
    const   url =   `${baseURL}${listAllPatientsUrl}`;
    return await    apiClient(url,  {method:    'GET'});
}