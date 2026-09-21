"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function SendParcel(){
  const [form,setForm]=useState({sender_name:"",sender_phone:"",receiver_name:"",receiver_phone:"",from_city:"Lilongwe",to_city:"Blantyre",description:"",weight:"1"})
  const [loading,setLoading]=useState(false)
  const price = Number(form.weight)*5000 + 5000 // MK 5000 base + 5000 per kg

  const submit = async()=>{
    if(!form.sender_phone ||!form.receiver_phone) return alert("Add phone numbers")
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
      <p className="text-[13px] text-gray-500">Lilongwe → Blantyre via verified drivers</p>

      <div className="mt-6 space-y-3 bg-white p-5 rounded-[20px] border">
        <input placeholder="Your Name" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.sender_name} onChange={e=>setForm({...form,sender_name:e.target.value})}/>
        <input placeholder="Your Phone e.g 0994961447" className="w-full h-[48px] border rounded-full px-4 text-[14px] font-bold" value={form.sender_phone} onChange={e=>setForm({...form,sender_phone:e.target.value})}/>
        <div className="flex gap-2">
          <select className="flex-1 h-[48px] border rounded-full px-4" value={form.from_city} onChange={e=>setForm({...form,from_city:e.target.value})}><option>Lilongwe</option><option>Blantyre</option><option>Mzuzu</option><option>Zomba</option></select>
          <select className="flex-1 h-[48px] border rounded-full px-4" value={form.to_city} onChange={e=>setForm({...form,to_city:e.target.value})}><option>Blantyre</option><option>Lilongwe</option><option>Mzuzu</option><option>Zomba</option></select>
        </div>
        <input placeholder="Receiver Name" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.receiver_name} onChange={e=>setForm({...form,receiver_name:e.target.value})}/>
        <input placeholder="Receiver Phone" className="w-full h-[48px] border rounded-full px-4 text-[14px] font-bold" value={form.receiver_phone} onChange={e=>setForm({...form,receiver_phone:e.target.value})}/>
        <input placeholder="What is inside? e.g Documents, Clothes" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <input placeholder="Weight KG" type="number" className="w-full h-[48px] border rounded-full px-4 text-[14px]" value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})}/>
        <div className="bg-black text-white rounded-full h-[48px] flex items-center justify-between px-6 font-black"><span>Price</span><span>MK {price.toLocaleString()}</span></div>
        <button onClick={submit} disabled={loading} className="w-full h-[52px] bg-blue-600 text-white rounded-full font-black">{loading?"Booking...":"Book Parcel - Pay on Delivery"}</button>
      </div>
    </div>
  )
}