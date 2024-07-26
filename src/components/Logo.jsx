import React from 'react';
import PropTypes from 'prop-types'
// import styles from '../Logo.css';

const Logo = ({displayType}) => {
  const containerClass = displayType === 'block' ? 'block text-center' : 'font-normal flex gap-3 items-center justify-evenly mx-2';
  const imageClass = displayType === 'block' ? 'w-30 h-32' : 'w-20 h-20';


  return (
    <div className={containerClass}>
      <img src="logo.png" alt="UCC LOGO" className={imageClass}/>
      <h5>Department of Optometry  & Vision Science</h5>
    </div>
  )
}

Logo.propTypes = {
  displayType: PropTypes.oneOf(['block', 'flex']).isRequired,
};

export default Logo


