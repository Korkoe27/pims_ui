import apiClient from "../apiService";

import { baseURL } from "../baseurl"

// export const   createCaseHistory  =   async   ()  =>   {
//     const   url = `${baseURL}${createCaseHistory}`;
//     return  await apiClient(url,  {method:    'POST'});
// }

export const    updateCaseHistory  =   async   ()  =>   {
    const   url = `${baseURL}${createCaseHistory}`;
    return  await apiClient(url,  {method:    'PATCH'});
}

export const    viewCaseHistory  =   async   ()  =>   {
    const   url = `${baseURL}${createCaseHistory}`;
    return  await apiClient(url,  {method:    'GET'});
}

export const    createPatient  =    async  (payload)  =>   {
    const   url = `${baseURL}${listPatients}`;
    return   await apiClient(url,     {method:    'POST',data:payload});

}

