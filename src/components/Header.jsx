import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const Header = ({ patientId }) => {
  const [patientDetails, setPatientDetails] = useState(null);

  useEffect(() => {
    // TODO: Move API handling logic to a separate service file for better code organization

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

  return (
    <div>
      {patientDetails ? (
        <>
          <h1 className="text-base font-normal">{patientDetails.name}</h1>
          <h1 className="text-2xl font-semibold">{patientDetails.id}</h1>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default Header;
