export default function Inputs({label, type, placeholder, name}){
  return(
    <div className="flex flex-col gap-1">
        <label htmlFor="" className="text-[#101928] text-base font-medium">{label}</label>
        <input type={type} className="h-14 rounded-md border border-[#d0d5dd] p-4 w-[375px]" placeholder={placeholder} name={name} />
    </div>
  )
}
