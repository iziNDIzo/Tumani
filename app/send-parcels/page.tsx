"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"

const DISTRICTS = ["Balaka","Blantyre","Chikwawa","Chiradzulu","Chitipa","Dedza","Dowa","Karonga","Kasungu","Likoma","Lilongwe","Machinga","Mangochi","Mchinji","Mulanje","Mwanza","Mzimba","Neno","Nkhata Bay","Nkhotakota","Nsanje","Ntcheu","Ntchisi","Phalombe","Rumphi","Salima","Thyolo","Zomba"].sort()

function DistrictSelect({label,value,onChange}:{label:string,value:string,onChange:(v:string)=>void}){
  const [open,setOpen]=useState(false)
  const [q,setQ]=useState("")
  const list = DISTRICTS.filter(d=>d.toLowerCase().includes(q.toLowerCase()))
  return(
    <div className="relative flex-1">
      <label className="text-[11px] font-black opacity-60">{label}</label>
      <div onClick={()=>setOpen(!open)} className="h-[48px] border-2 rounded-full px-4 flex items-center justify-between cursor-pointer bg-white font-bold text-[14px] mt-1">
        <span>{value || `Select ${label}`}</span><span>▼</span>
      </div>
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border-2 rounded-[16px] shadow-2xl overflow-hidden">
          <input autoFocus placeholder="Type to search..." className="w-full h-[44px] px-4 border-b text-[14px] outline-none" value={q} onChange={e=>setQ(e.target.value)}/>
          <div className="max-h-[180px] overflow-y-auto">
            {list.map(d=>(
              <div key={d} onClick={()=>{onChange(d); setOpen(false); setQ("")}} className={`px-4 py-3 text-[14px] cursor-pointer hover:bg-black hover:text-white ${value===d?'bg-black text-white':''}`}>{d}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SendParcel(){
  const [form,setForm]=useState({sender_name:"",sender_phone:"",receiver_name:"",receiver_phone:"",from:"Lilongwe",to:"Blantyre",desc:"",weight:"1"})
  const [loading,setLoading]=useState(false)
  const price = Number(form.weight)*5000+5000

  const submit = async()=>{
    if(!form.sender_phone ||!form.receiver_phone) return alert("Add phones")
    if(form.from===form.to) return alert("From and To cannot be same!")
    setLoading(true)
    const track = `TUM-${Math.random().toString(36).substring(2,6).toUpperCase()}-${Math.floor(100+Math.random()*900)}`

    const {error} = await supabase.from('parcels').insert([{
      tracking_id: track,
      tracking_number: track,
      sender_name: form.sender_name,
      sender_phone: form.sender_phone,
      recipient_name: form.receiver_name,
      recipient_phone: form.receiver_phone,
      receiver_name: form.receiver_name,
      receiver_phone: form.receiver_phone,
      from_city: form.from,
      to_city: form.to,
      from_district: form.from,
      to_district: form.to,
      pickup_address: form.from + ", Malawi",
      delivery_address: form.to + ", Malawi",
      description: form.desc,
      weight: form.weight,
      fee: price,
      price: price,
      status: 'pending',
      job_type: 'parcel'
    }])
    setLoading(false)
    if(error) alert("Error: "+error.message)
    else {
      localStorage.setItem("tumani_last_phone", form.sender_phone)
      alert(`✅ Booked! ${track} - MK ${price}`)
      window.location.href=`/my-parcels?phone=${form.sender_phone}`
    }
  }

  return(
    <div className="max-w-[600px] mx-auto p-4 pb-24">
      <a href="/" className="text-[13px] font-black opacity-60">← Home</a>
      <h1 className="text-[26px] font-black mt-2">Send Parcel 📦</h1>
      <p className="text-[13px] text-gray-500">{form.from} → {form.to} • Real-time districts</p>

      <div className="mt-5 bg-white p-5 rounded-[24px] border-2 space-y-3">
        <input placeholder="Your Name" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.sender_name} onChange={e=>setForm({...form,sender_name:e.target.value})}/>
        <input placeholder="Your Phone 0994961447" className="w-full h-[48px] border-2 rounded-full px-4 text-[14px] font-black" value={form.sender_phone} onChange={e=>setForm({...form,sender_phone:e.target.value})}/>

        <div className="flex gap-3">
          <DistrictSelect label="FROM" value={form.from} onChange={v=>setForm({...form,from:v})}/>
          <DistrictSelect label="TO" value={form.to} onChange={v=>setForm({...form,to:v})}/>
        </div>

        <input placeholder="Receiver Name" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.receiver_name} onChange={e=>setForm({...form,receiver_name:e.target.value})}/>
        <input placeholder="Receiver Phone" className="w-full h-[48px] border-2 rounded-full px-4 text-[14px] font-black" value={form.receiver_phone} onChange={e=>setForm({...form,receiver_phone:e.target.value})}/>
        <input placeholder="What's inside? Documents, Clothes" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})}/>
        <input type="number" min="0.5" step="0.5" placeholder="Weight KG" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})}/>

        <div className="bg-black text-white rounded-full h-[50px] flex items-center justify-between px-6 font-black"><span>Total</span><span>MK {price.toLocaleString()}</span></div>
        <button onClick={submit} disabled={loading} className="w-full h-[54px] bg-[#0a84ff] text-white rounded-full font-black text-[15px]">{loading?"Booking...":"Book Parcel - Pay on Delivery"}</button>
        <p className="text-[11px] text-center text-gray-400">Searchable dropdown: type "chi" to see Chitipa, Chiradzulu instantly</p>
      </div>
    </div>
  )
}