import { useQuery } from "@tanstack/react-query";
import { showPatients } from "../client/api-handlers/patients-handler";


export const useShowPatients    =   ()  =>  {
    const   result  =   useQuery({queryKey:['patients'],queryFn:()=>showPatients()});

    return result;
}