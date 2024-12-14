import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const Header = ({ patientId }) => {
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        console.log("Fetching details for Patient ID:", patientId);

        // Call the `getPatientDetails` function with dynamic URL
        // const response = await getPatientDetails;
        // console.log("API Response:", response.data); // Log the full API response

        // setPatientDetails(response.data);
      } catch (error) {
        console.error("Error fetching patient details:", error.response || error.message);
      }
    };

    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  return (
    <div>
      <h1>Patient ID: {patientId}</h1>
      {patientDetails ? (
        <>
          <h1 className="text-base font-normal">Name: {patientDetails.name}</h1>
          <h1 className="text-2xl font-semibold">ID: {patientDetails.id}</h1>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default Header;
