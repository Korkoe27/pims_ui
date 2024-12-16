import {  createContext, useContext, useState } from "react";

const ClinicContext =   createContext();

export  const   ClinicProvider  =   ({children})    =>{


    const [selectedClinic,setSelectedClinic]    =   useState(null);

    return  (

        <ClinicContext.Provider value={{ selectedClinic,setSelectedClinic }}>

            {children}
        </ClinicContext.Provider>
    )
}

export const useClinic  =   ()  =>useContext(ClinicContext);
