export default function ProgressBar({step}) {
    return(
        <div className="flex bg-white">
            <div className="w-64">
                <div className="flex justify-end items-center">
                <span className={`border border-[#2f3192] w-6 h-6 bg-white  rounded-full ${step > 1 ? 'bg-[#2F3192]' : ''}`}></span>
                    <span className="border bg-[#2f3192] border-[#2f3192] h-[2px] w-28 justify-self-end"></span> 
                </div>
            
                <h1 className="text-center font-medium text-base">Consultation</h1>

            </div>

            <div className="">
                <div className="flex items-center  justify-end">
                <span className="border  bg-[#2f3192] border-[#2f3192] h-[2px] w-28 justify-self-end"></span> 

                <span className={`border border-[#2f3192] h-6 w-6  bg-white rounded-full ${step < 2 && 'bg-green-400'} ${step === 2 ? 'bg-[#2F3192]' : ''} ${step > 2 ? 'bg-white' : "" }`}></span>

                <span className="border  bg-[#2f3192] border-[#2f3192] h-[2px] w-28 justify-self-end"></span>  
                </div>
                
                <h1 className="text-center font-medium">Diagnosis and Plan</h1>

            </div>
            <div className=" w-64">
                <div className="flex items-center justify-start">

                <span className="border  bg-[#2f3192] border-[#2f3192] h-[2px] w-28 justify-self-end"></span>  

                <span className={`border border-[#2f3192] bg-white h-6 w-6 rounded-full ${step < 3 && 'bg-green-400'} ${step === 3 ? 'bg-[#2F3192]' : ''} ${step > 3 ? 'bg-white' : "" }`}></span>
                {/* <span className="border border-[#2f3192] h-[2px] w-60 justify-self-end"></span>  */}
                </div>
                
                <h1 className="text-center font-medium">Management</h1>

            </div>
        </div>
    )
}
