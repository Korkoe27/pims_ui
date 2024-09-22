import React, {useState, useEffect} from 'react'

const Header = () => {
  
  const [patientId, setPatientId] = useState('');

  const generatePatientId = () => {

    const year =  new Date().getFullYear().toString().slice(-2);
    const randomNumber = Math.floor(100 + Math.random() * 900);
    return `PH/PHA/${year}/${randomNumber}`;
  }
  
  useEffect(() => {
    const id = generatePatientId();
    setPatientId(id);
  }, []); 

  return (
    <div>
        <h1 className='text-base font-normal'>Anthony Korkoe</h1>
        <h1 className='text-2xl font-semibold'>{patientId}</h1>
      
    </div>
  )
}

export default Header
