import React, {useState, useEffect} from 'react'
import axios from 'axios';



const Header = (patientId ) => {

  const [patientDetails, setPatientDetails] = useState(null);
  // const [patientId, setPatientId] = useState('');

  // const generatePatientId = () => {
  //   const year =  new Date().getFullYear().toString().slice(-2);
  //   const randomNumber = Math.floor(100 + Math.random() * 900);
  //   return `PH/PHA/${year}/${randomNumber}`;
  // }

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`/clients/api/patients/${patientId}`);
        setPatientDetails(response.data);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);
  
  // useEffect(() => {
  //   const id = generatePatientId();
  //   setPatientId(id);
  // }, []); 

  return (
    <div>
        {patientDetails ? (
        <>
          <h1 className="text-base font-normal">{patientDetails.name}</h1>
          <h1 className="text-2xl font-semibold">{patientDetails.id}</h1>
        </>
      ) : (
        <h1 className="text-2xl font-semibold">Loading patient details...</h1>
      )}
      
    </div>
  )
}

export default Header
