"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function MyDrivePage(){
  const [driver, setDriver] = useState<any>(null)
  const [form, setForm] = useState({ from: "", to: "", date: "", price: "", seats: "4" })
  const [posting, setPosting] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(()=>{
    const init = async()=>{
      const { data: {user} } = await supabase.auth.getUser()
      const { data } = await supabase.from('drivers').select('*').eq('user_id', user?.id).single()
      setDriver(data)
    }
    init()
  },[])

  const postTrip = async()=>{
    if(!form.from ||!form.to ||!form.price){ setMsg("Fill From, To, Price"); return }
    setPosting(true)
    const { error } = await supabase.from('trips').insert({
      driver_id: driver.user_id,
      driver_name: driver.full_name,
      from_location: form.from,
      to_location: form.to,
      departure_date: form.date || new Date().toISOString().split('T')[0],
      price: parseInt(form.price),
      seats_available: parseInt(form.seats),
      vehicle_type: driver.vehicle_type,
      registration_number: driver.registration_number,
      whatsapp: driver.whatsapp || driver.phone,
      status: 'active'
    })
    if(error){ setMsg(error.message); setPosting(false); return }
    setMsg("✅ Trip posted! Passengers can now find you on Find Trips")
    setForm({ from: "", to: "", date: "", price: "", seats: "4" })
    setPosting(false)
    setTimeout(()=> setMsg(""), 4000)
  }

  if(!driver) return <div className="p-10 font-black">Loading...</div>

  return (
    <div className="max-w-[760px] mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-black text-[28px]">My Drive — ✅ Verified</h1>
        <span className="text-sm font-bold text-black/60">Welcome, {driver.full_name}</span>
      </div>

      <div className="bg-white rounded-[32px] border border-black/10 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        <h2 className="font-black text-[20px]">Post New Trip</h2>
        <p className="text-[14px] text-black/50 font-medium mt-1">This trip will be visible to passengers on Find Trips</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <input value={form.from} onChange={e=>setForm({...form, from:e.target.value})} placeholder="From e.g. Salima" className="h-[56px] px-6 rounded-full border-2 border-black font-bold outline-none" />
          <input value={form.to} onChange={e=>setForm({...form, to:e.target.value})} placeholder="To e.g. Lilongwe" className="h-[56px] px-6 rounded-full border-2 border-black font-bold outline-none" />
          <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="h-[56px] px-6 rounded-full border-2 border-black font-bold outline-none" />
          <input value={form.price} onChange={e=>setForm({...form, price:e.target.value})} placeholder="Price e.g. 15000" type="number" className="h-[56px] px-6 rounded-full border-2 border-black font-bold outline-none" />
          <select value={form.seats} onChange={e=>setForm({...form, seats:e.target.value})} className="h-[56px] px-6 rounded-full border-2 border-black font-bold outline-none md:col-span-2">
            <option value="4">4 seats</option>
            <option value="7">7 seats - Sienta</option>
            <option value="15">15 seats - Minibus</option>
          </select>
        </div>

        <div className="mt-4 bg-black/5 rounded-2xl p-4 text-[12px] font-bold text-black/60">
          Posting as: {driver.full_name} • {driver.registration_number} • {driver.vehicle_type} • {driver.phone}
        </div>

        {msg && <div className="mt-4 text-[13px] font-bold p-3 rounded-xl bg-green-50 border border-green-200 text-green-700">{msg}</div>}

        <button onClick={postTrip} disabled={posting} className="mt-6 w-full h-[60px] bg-[#1a73e8] text-white rounded-full font-black text-[16px] disabled:opacity-50">
          {posting? "Posting..." : "Post Trip →"}
        </button>
      </div>

      <p className="text-center text-[12px] text-black/40 mt-6 font-bold">Your trip appears instantly on Find Trips page</p>
    </div>
  )
}