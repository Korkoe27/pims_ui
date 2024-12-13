import apiClient from "../apiService";
import { baseURL } from "../baseurl"
import { createCaseHistory } from "../endpoints"

export const    createCaseHistory  =   async   ()  =>   {
    const   url = `${baseURL}${createCaseHistory}`;
    return  await apiClient(url,  {method:    'POST'});
}

export const    updateCaseHistory  =   async   ()  =>   {
    const   url = `${baseURL}${createCaseHistory}`;
    return  await apiClient(url,  {method:    'PATCH'});
}

export const    viewCaseHistory  =   async   ()  =>   {
    const   url = `${baseURL}${createCaseHistory}`;
    return  await apiClient(url,  {method:    'GET'});
}