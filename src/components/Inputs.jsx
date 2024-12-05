export default function Inputs({label, type,  value, placeholder, name, onChange}){
  return(
    <div className="flex flex-col gap-1">
        <label htmlFor="" className="text-[#101928] text-base font-medium">{label}</label>
        <input type={type} value={value} className="h-14 rounded-md border border-[#d0d5dd] p-4 w-[375px]" placeholder={placeholder} onChange={onChange} name={name} />
    </div>
  )
}
