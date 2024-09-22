import React from 'react';
import { FaPen } from "react-icons/fa6";
import { GrAdd } from 'react-icons/gr';
import { FaChartSimple } from "react-icons/fa6";
import PropTypes from 'prop-types';

const CallToActionButtons = ({displayButton, button1, button2}) => {
const showButton = displayButton === 'hidden' ? 'hidden' : 'border-0 text-[#2f3192] w-full flex text-[14px] gap-7 justify-left items-center';

return (
    <div className='w-full my-1 gap-2 flex flex-col'>
        <div className='flex w-full gap-7  justify-stretch'>
            <button className='border-0 text-[#2f3192] w-1/2 text-[14px] flex items-center  justify-start gap-4 '>
        <FaPen/>
        {button1}
        </button>
        <button className='border-0 text-[#2f3192] w-1/2 text-[14px] flex justify-stretch items-center gap-4 '>
        <GrAdd className='font-medium'/>
        {button2}
        </button>
        </div>
        <button className={showButton}>
        <FaChartSimple className='w-5 h-5'/>
        Specify grading of symptoms
        </button>
    </div>
)
};

CallToActionButtons.propTypes = {
    displayButton:  PropTypes.oneOf(['hidden','flex']).isRequired,
};

export default CallToActionButtons
