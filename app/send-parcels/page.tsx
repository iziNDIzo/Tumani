"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"

const MALAWI_DISTRICTS = [
"Balaka","Blantyre","Chikwawa","Chiradzulu","Chitipa","Dedza","Dowa",
"Karonga","Kasungu","Likoma","Lilongwe","Machinga","Mangochi","Mchinji",
"Mulanje","Mwanza","Mzimba","Neno","Nkhata Bay","Nkhotakota","Nsanje",
"Ntcheu","Ntchisi","Phalombe","Rumphi","Salima","Thyolo","Zomba"
].sort()

function DistrictSelect({value, onChange, placeholder}:{value:string,onChange:(v:string)=>void,placeholder:string}){
  const [open,setOpen]=useState(false)
  const [query,setQuery]=useState("")
  const filtered = MALAWI_DISTRICTS.filter(d=> d.toLowerCase().includes(query.toLowerCase()) || d.toLowerCase().includes(value.toLowerCase()))

  return(
    <div className="relative flex-1">
      <div onClick={()=>setOpen(!open)} className="h-[48px] border rounded-full px-4 flex items-center justify-between cursor-pointer bg-white text-[14px] font-medium">
        <span>{value || placeholder}</span><span className="text-[12px]">▼</span>
      </div>
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-[16px] shadow-xl max-h-[220px] overflow-hidden">
          <input autoFocus placeholder="Search district..." className="w-full h-[44px] px-4 border-b text-[14px] outline-none" value={query} onChange={e=>setQuery(e.target.value)}/>
          <div className="overflow-y-auto max-h-[170px]">
            {filtered.map(d=>(
              <div key={d} onClick={()=>{onChange(d); setOpen(false); setQuery("")}} className={`px-4 py-2.5 text-[14px] hover:bg-black hover:text-white cursor-pointer ${value===d?"bg-black text-white":""}`}>{d}</div>
            ))}
            {filtered.length===0 && <div className="px-4 py-3 text-[13px] text-gray-400">No district found</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SendParcel(){
  const [form,setForm]=useState({sender_name:"",sender_phone:"",receiver_name:"",receiver_phone:"",from_city:"Lilongwe",to_city:"Blantyre",description:"",weight:"1"})
  const [loading,setLoading]=useState(false)
  const price = Number(form.weight)*5000 + 5000

  const submit = async()=>{
    if(!form.sender_phone ||!form.receiver_phone) return alert("Add phone numbers")
    if(form.from_city===form.to_city) return alert("From and To cannot be same district")
    setLoading(true)
    const {error} = await supabase.from('parcels').insert([{
      sender_name: form.sender_name,
      sender_phone: form.sender_phone,
      receiver_name: form.receiver_name,
      receiver_phone: form.receiver_phone,
      from_city: form.from_city,
      to_city: form.to_city,
      description: form.description,
      weight: form.weight,
      price: price,
      status: 'pending'
    }])
    setLoading(false)
    if(error) alert(error.message)
    else {
      localStorage.setItem("tumani_last_phone", form.sender_phone)
      alert(`✅ Parcel booked! MK ${price} - Track with ${form.sender_phone}`)
      window.location.href=`/my-parcels?phone=${form.sender_phone}`
    }
  }

  return(
    <div className="max-w-[600px] mx-auto p-4 pb-20">
      <a href="/" className="text-[14px] font-bold opacity-60">← Back</a>
      <h1 className="text-[24px] font-black mt-3">Send a Parcel 📦</h1>
      <p className="text-[13px] text-gray-500">{form.from_city} → {form.to_city} via verified drivers • All 28 districts</p>

      <div className="mt-6 space-y-3 bg-white p-5 rounded-[20px] border">
        <input placeholder="Your Name" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.sender_name} onChange={e=>setForm({...form,sender_name:e.target.value})}/>
        <input placeholder="Your Phone e.g 0994961447" className="w-full h-[48px] border rounded-full px-4 text-[14px] font-bold" value={form.sender_phone} onChange={e=>setForm({...form,sender_phone:e.target.value})}/>

        <div className="flex gap-2">
          <DistrictSelect value={form.from_city} onChange={v=>setForm({...form,from_city:v})} placeholder="From District"/>
          <DistrictSelect value={form.to_city} onChange={v=>setForm({...form,to_city:v})} placeholder="To District"/>
        </div>

        <input placeholder="Receiver Name" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.receiver_name} onChange={e=>setForm({...form,receiver_name:e.target.value})}/>
        <input placeholder="Receiver Phone" className="w-full h-[48px] border rounded-full px-4 text-[14px] font-bold" value={form.receiver_phone} onChange={e=>setForm({...form,receiver_phone:e.target.value})}/>
        <input placeholder="What is inside? e.g Documents, Clothes" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <input placeholder="Weight KG" type="number" min="0.5" step="0.5" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})}/>
        <div className="bg-black text-white rounded-full h-[48px] flex items-center justify-between px-6 font-black"><span>Price</span><span>MK {price.toLocaleString()}</span></div>
        <button onClick={submit} disabled={loading} className="w-full h-[52px] bg-blue-600 text-white rounded-full font-black">{loading?"Booking...":"Book Parcel - Pay on Delivery"}</button>
      </div>
    </div>
  )
}