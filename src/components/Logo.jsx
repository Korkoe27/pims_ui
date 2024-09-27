import React from 'react';
import PropTypes from 'prop-types'
// import styles from '../Logo.css';

const Logo = ({displayType}) => {
  const containerClass = displayType === 'block' ? 'flex flex-col justify-center items-center gap-4' : 'font-normal flex gap-3 items-center justify-evenly mx-2';
  const imageClass = displayType === 'block' ? ' w-24 h-24' : 'w-12 h-12';
  const headerClass = displayType === 'flex' ? 'text-base text-black' : 'text-xl font-normal';


  return (
    <div className={containerClass}>
      <img src="logo.png" alt="UCC LOGO" className={imageClass}/>
      <h5 className={headerClass}>School of Optometry  & Vision Science</h5>
    </div>
  )
}

Logo.propTypes = {
  displayType: PropTypes.oneOf(['block', 'flex']).isRequired,
};

export default Logo


