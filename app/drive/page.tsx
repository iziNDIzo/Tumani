"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function DrivePage(){
  const [driver,setDriver]=useState<any>(null)
  const [from,setFrom]=useState("")
  const [to,setTo]=useState("")
  const [date,setDate]=useState("")
  const [price,setPrice]=useState("")
  const [loading,setLoading]=useState(false)
  const [msg,setMsg]=useState("")

  useEffect(()=>{
    (async()=>{
      const { data: {user} } = await supabase.auth.getUser()
      if(!user) return
      const { data } = await supabase.from('drivers').select('*').eq('user_id', user.id).single()
      setDriver(data)
    })()
  },[])

  const postTrip = async()=>{
    if(!from ||!to ||!price){ setMsg("Please fill From, To and Price"); return }
    setLoading(true)
    setMsg("")
    const { error } = await supabase.from('trips').insert({
      driver_id: driver.user_id,
      from_location: from,
      to_location: to,
      departure_date: date || new Date().toISOString(),
      price: Number(price),
      driver_name: driver.full_name,
      vehicle_type: driver.vehicle_type,
      registration_number: driver.registration_number,
      phone: driver.phone,
      whatsapp: driver.whatsapp || driver.phone,
      status: 'active'
    })
    if(error) setMsg("❌ "+error.message)
    else {
      setMsg("✅ Trip posted! Go check Find Trips")
      setFrom(""); setTo(""); setPrice(""); setDate("")
    }
    setLoading(false)
    setTimeout(()=>setMsg(""),5000)
  }

  if(!driver) return <div className="p-10 font-black">Loading...</div>

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-4 md:p-8">
      <div className="max-w-[720px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-black text-[24px] md:text-[28px]">My Drive — ✅ Verified</h1>
          <span className="text-[13px] font-bold text-black/60">Welcome, {driver.full_name}</span>
        </div>

        <div className="bg-white rounded-[32px] border border-black/10 p-6 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <h2 className="font-black text-[20px]">Post New Trip</h2>
          <p className="text-[13px] text-black/50 font-medium mt-1">This trip will be visible to passengers on Find Trips</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="From e.g. Mchinji" className="h-[56px] px-6 rounded-full border-2 border-black font-bold outline-none" />
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="To e.g. Lilongwe" className="h-[56px] px-6 rounded-full border-2 border-black font-bold outline-none" />
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-[56px] px-6 rounded-full border-2 border-black font-bold outline-none" />
            <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price e.g. 15000" type="number" className="h-[56px] px-6 rounded-full border-2 border-black font-bold outline-none" />
          </div>

          <div className="mt-4 bg-black/5 rounded-2xl px-4 py-3 text-[11px] font-black text-black/50 tracking-wide">
            POSTING AS: {driver.full_name} • {driver.registration_number} • {driver.phone}
          </div>

          {msg && <div className="mt-4 font-bold text-[13px] p-4 rounded-2xl bg-black text-white text-center">{msg}</div>}

          {/* THIS IS THE BUTTON YOU WERE MISSING */}
          <button
            onClick={postTrip}
            disabled={loading}
            className="mt-8 w-full h-[64px] bg-[#1a73e8] hover:bg-black text-white rounded-full font-black text-[17px] disabled:opacity-50 transition-colors"
          >
            {loading? "Posting..." : "Post Trip →"}
          </button>

          <p className="text-center text-[11px] text-black/40 font-bold mt-4">Trip appears instantly on Find Trips</p>
        </div>
      </div>
    </div>
  )
}