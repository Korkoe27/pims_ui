import React, { useState } from 'react';
import { IoPhonePortraitOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useClinic } from '../contexts/ClinicProvider';
import { useCreatePatientMutation } from '../services/mutations/patient-mutation';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { selectedClinic } = useClinic();
  
  const [createPatient] = useCreatePatientMutation();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    clinic: selectedClinic,
    address: '',
    primary_phone: '',
    confirm_save: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the mutation with form data
      const response = await createPatient(formData).unwrap(); 
      console.log(response); // Handle the response here (e.g., show success)
      // Optionally, redirect to another page on success
      navigate('/patients'); // Example: redirect to a patient list or dashboard
    } catch (error) {
      console.error('Patient registration failed:', error); // Handle error here
    }
  };

  const attendToPatient = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const createAppointment = () => {
    navigate(`/createAppointment`);
  };

  return (
    <div className='px-72 bg-[#f9fafb] h-full w-full'>
      <div className="flex flex-col gap-4 px-8 my-6">
        <h1 className='text-2xl font-semibold'>New Patient</h1>
        <p className="text-base">Fill out the following details of your new patient</p>
      </div>

      <form onSubmit={handleSubmit} className='px-8 w-fit'>
        <section className="flex gap-24 pb-16 justify-between">
          <aside className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="last_name" className='text-[#101928]'>
                Surname <span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                name='last_name'
                value={formData.last_name}
                onChange={handleChange}
                required
                className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg"
                placeholder='Enter the last name of the patient'
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="first_name" className='text-[#101928]'>
                First Name <span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                name='first_name'
                value={formData.first_name}
                onChange={handleChange}
                required
                className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg"
                placeholder='Enter the first name of the patient'
              />
            </div>
            
            {/* Add more fields as needed */}
          </aside>

          <aside className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="primary_phone" className='text-[#101928]'>
                Phone Number <span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                name='primary_phone'
                value={formData.primary_phone}
                onChange={handleChange}
                required
                className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg"
                placeholder='Enter the phone number of the patient'
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="dob" className='text-[#101928]'>
                Date of Birth <span className='text-red-500'>*</span>
              </label>
              <input
                type="date"
                name='dob'
                value={formData.dob}
                onChange={handleChange}
                required
                className="p-4 w-[375px] border border-[#d0d5dd] h-14 rounded-lg"
                placeholder='Enter the date of birth'
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                className="bg-blue-600 text-white w-40 p-3 rounded-lg"
              >
                Register Patient
              </button>
              <button
                type="button"
                onClick={createAppointment}
                className="bg-gray-300 text-black w-40 p-3 rounded-lg"
              >
                Create Appointment
              </button>
            </div>
          </aside>
        </section>
      </form>
    </div>
  );
};

export default PersonalInfo;
