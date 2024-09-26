import React from 'react'
import ExtraTestModal from './ExtraTestModal'

const ExtraTestsButtons = ({title, name}) => {

  return (


    // <div>
      <button className="w-48 py-12 text-wrap border border-[#2f3192] rounded-xl text-center" dangerouslySetInnerHTML={{__html:title}} name={name}></button>
      
    // </div>
  )
}

export default ExtraTestsButtons
