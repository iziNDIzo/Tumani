"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function DriverDashboard(){
  const router = useRouter()
  const [driver,setDriver]=useState<any>(null)
  const [trips,setTrips]=useState<any[]>([])
  const [bookings,setBookings]=useState<any[]>([])
  const [loading,setLoading]=useState(false)
  const [form,setForm]=useState({from:"Lilongwe",to:"Blantyre",date:"",time:"06:00",price:"35000",seats:"4"})

  useEffect(()=>{
    const id = localStorage.getItem('tumani_driver_id')
    const phone = localStorage.getItem('tumani_driver_phone')
    if(!id ||!phone){ router.push('/login'); return }
    ;(async()=>{
      const {data:d} = await supabase.from('drivers').select('*').eq('id',id).single()
      if(d) setDriver(d)
      const {data:t} = await supabase.from('trips').select('*').eq('driver_id',id).order('created_at',{ascending:false})
      if(t) setTrips(t)
      const tripIds = t?.map(x=>x.id) || []
      if(tripIds.length){
        const {data:b} = await supabase.from('bookings').select('*').in('trip_id',tripIds).order('created_at',{ascending:false})
        if(b) setBookings(b)
      }
    })()
  },[router])

  const postTrip = async ()=>{
    if(!form.date) return alert("Pick date")
    setLoading(true)
    const id = localStorage.getItem('tumani_driver_id')
    const iso = `${form.date}T${form.time}:00`
    const {error} = await supabase.from('trips').insert({
      driver_id: id,
      from_city: form.from,
      to_city: form.to,
      date: iso,
      departure_date: form.date,
      price: Number(form.price),
      seats_available: Number(form.seats),
      seats: Number(form.seats),
      status: 'active'
    })
    if(error){ alert(error.message); setLoading(false); return }
    alert("Trip posted! Live on marketplace.")
    location.reload()
  }

  if(!driver) return <div className="min-h-screen grid place-items-center text-[13px] font-bold opacity-50">Loading...</div>

  return(
    <main className="min-h-screen bg-[#fafafa] text-[#010d19]">
      <div className="max-w-[640px] mx-auto p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0a84ff] text-white rounded-full grid place-items-center font-black">{driver.full_name?.charAt(0)}</div>
            <div><div className="font-black text-[15px]">{driver.full_name} <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">VERIFIED ✓</span></div><div className="text-[12px] opacity-60">{driver.phone}</div></div>
          </div>
          <button onClick={()=>{localStorage.clear(); router.push('/')}} className="text-[11px] font-bold border border-black/10 px-3 py-1.5 rounded-full">Logout</button>
        </div>
        <div className="mt-6 bg-white border border-black/5 rounded-[20px] p-5">
          <h2 className="font-black text-[16px]">Post new trip</h2>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <select value={form.from} onChange={e=>setForm({...form,from:e.target.value})} className="h-[44px] border rounded-[12px] px-3 text-[13px]"><option>Lilongwe</option><option>Blantyre</option><option>Mzuzu</option></select>
            <select value={form.to} onChange={e=>setForm({...form,to:e.target.value})} className="h-[44px] border rounded-[12px] px-3 text-[13px]"><option>Blantyre</option><option>Lilongwe</option><option>Mzuzu</option></select>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="h-[44px] border rounded-[12px] px-3 text-[13px]"/>
            <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="h-[44px] border rounded-[12px] px-3 text-[13px]"/>
            <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="h-[44px] border rounded-[12px] px-3 text-[13px]"/>
            <input type="number" value={form.seats} onChange={e=>setForm({...form,seats:e.target.value})} className="h-[44px] border rounded-[12px] px-3 text-[13px]"/>
          </div>
          <button onClick={postTrip} disabled={loading} className="mt-4 w-full h-[48px] bg-[#0a84ff] text-white rounded-full font-black text-[14px]">{loading?"Posting...":"Post Trip →"}</button>
        </div>
        <div className="mt-6"><h3 className="font-black text-[14px]">My Trips ({trips.length})</h3><div className="mt-3 space-y-2">{trips.map(t=><div key={t.id} className="bg-white border rounded-[16px] p-4 flex justify-between"><div><div className="font-bold text-[13px]">{t.from_city} → {t.to_city}</div><div className="text-[11px] opacity-60">{String(t.date).slice(0,16)} • MK {t.price}</div></div><div className="text-[10px] bg-black text-white px-2 py-1 rounded-full h-fit">{t.status}</div></div>)}</div></div>
      </div>
    </main>
  )
}