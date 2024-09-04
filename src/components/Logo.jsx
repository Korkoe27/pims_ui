import React from 'react';
import PropTypes from 'prop-types'
// import styles from '../Logo.css';

const Logo = ({displayType}) => {
  const containerClass = displayType === 'block' ? 'flex flex-col justify-center items-center text-center' : 'font-normal flex gap-3 items-center justify-evenly mx-2';
  const imageClass = displayType === 'block' ? ' w-30 h-32' : 'w-20 h-20';
  const headerClass = displayType === 'flex' ? 'text-base text-black' : 'text-2xl';


  return (
    <div className={containerClass}>
      <img src="logo.png" alt="UCC LOGO" className={imageClass}/>
      <h5 className={headerClass}>Department of Optometry  & Vision Science</h5>
    </div>
  )
}

Logo.propTypes = {
  displayType: PropTypes.oneOf(['block', 'flex']).isRequired,
};

export default Logo


