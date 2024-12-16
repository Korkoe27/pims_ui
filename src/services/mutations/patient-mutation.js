import { useMutation } from "@tanstack/react-query"
import { createPatient } from "../client/api-handlers/examinations-handler"

export const    useCreatePatient    =   ()  =>{
    return  useMutation({
        mutationFn:createPatient,
        onMutate:()=>{},
        onSuccess:(data,variable,context)=>{
            console.log(data)
        },
        onError:()=>{}
    })
}