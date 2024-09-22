export default function Radios({label,name}){
    return(
        <div className="flex flex-col gap-2">
            
            <label htmlFor="" className="font-medium text-[14px] text-[#101928]">{label}</label>
            <div className="flex gap-4">
               <label htmlFor="" className="flex gap-2">
                <input type="radio" name={name} className="" id="" />
                Yes
            </label>
            <label htmlFor="" className="flex gap-2">
                <input type="radio" name={name} id="" />
                No
            </label> 
            </div>
            
        </div>
    )
}