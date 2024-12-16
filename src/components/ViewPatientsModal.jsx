import React from 'react'

const ViewPatientsModal = () => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-[2px]'>
        <dialog className="flex lg:flex-row flex-col gap-4 p-12 w-full h-full mx-auto modal-overlay">
            <aside className="flex flex-col gap-4 w-1/3">
                <h1 className="font-xl text-xl">Patient Profile</h1>
                <p className="flex flex-col gap-2">
                    <span className="font-normal">Patient ID</span>
                    <span className="font-normal">Full Name</span>
                    <span className="font-normal">Patient Type</span>
                    <span className="font-normal">Date of Birth</span>
                    <span className="font-normal">Gender</span>
                    <span className="font-normal"></span>
                    <span className="font-normal">Patient ID</span>
                    <span className="font-normal">Patient ID</span>
                    <span className="font-normal">Patient ID</span>
                    <span className="font-normal">Patient ID</span>
                    <span className="font-normal">Patient ID</span>
                </p>

            </aside>
        </dialog>
      
    </div>
  )
}

export default ViewPatientsModal



// id
// generated_id_number
// patient_id
// patient_type
// id_type
// id_number
// first_name
// last_name
// other_names
// dob
// gender
// clinic
// occupation_category
// occupation
// address
// landmark
// hometown
// region
// primary_phone
// alternate_phone
// emergency_contact_name
// emergency_contact_number
// email
// insurance_type
// insurance_provider
// insurance_number
// date_of_first_visit
// registration_date
// created_by
// last_modified_by
// deleted
// deleted_by
// deleted_at