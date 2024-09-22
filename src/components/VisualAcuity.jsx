import React from 'react'
import  Header  from "./Header";
import ProgressBar from './ProgressBar';
import NavMenu from './NavMenu';

const VisualAcuity = () => {
  return (
    <div className='ml-72 my-8 px-4 flex flex-col gap-12'>
      <Header/>
      <ProgressBar />
      <NavMenu/>
    </div>
  )
}

export default VisualAcuity
