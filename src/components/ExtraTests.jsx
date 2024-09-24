import React from 'react'
import Header from './Header'
import ProgressBar from './ProgressBar'
import NavMenu from './NavMenu'

const ExtraTests = () => {
    return (
        <div className='ml-72 my-8 px-8 flex flex-col gap-12'>
            <Header/>
          <ProgressBar />
          <NavMenu/>
        </div>
      )
    }

export default ExtraTests
