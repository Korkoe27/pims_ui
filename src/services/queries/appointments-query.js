import { useQuery } from "@tanstack/react-query"
import { handleAppointments } from "../client/api-handlers/appointments-handler";

export  const   useAppointments =   ()  =>  {
    const   result  =   useQuery({queryKey:['appointments'],queryFn:()=>    handleAppointments()});

    return result;
}
// export  const   useAllAppointments =   ()  =>  {
//     const   result  =   useQuery({queryKey:['appointments'],queryFn:()=>    handleAppointments()});

//     return result;
// }