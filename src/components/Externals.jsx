import React from 'react'
import ProgressBar from './ProgressBar'
import Header from './Header'
import NavMenu from './NavMenu'

const Externals = () => {
  return (
    <div className='ml-72 my-8 px-8 flex flex-col gap-12'>
        <Header/>
      <ProgressBar />
      <NavMenu/>
    </div>
  )
}

export default Externals
