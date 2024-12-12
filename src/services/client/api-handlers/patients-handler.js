import apiClient from "../apiService";
import { baseURL } from "../baseurl";
import { listPatients } from "../endpoints";


export const showPatients   =   async   ()  =>  {
    const   url =   `${baseURL}${listPatients}`;
    return await    apiClient(url,  {method:    'GET'});
}