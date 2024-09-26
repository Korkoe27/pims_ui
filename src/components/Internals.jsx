import React from 'react'
import Header from './Header'
import ProgressBar from './ProgressBar'
import NavMenu from './NavMenu'

const Internals = () => {
  return (
    <main className='ml-72 my-8 px-8 w-fit flex flex-col gap-12'>
    <Header/>
    <ProgressBar />
    <NavMenu/>
      
    </main>
  )
}

export default Internals

