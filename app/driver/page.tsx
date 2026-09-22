"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const DISTRICTS = [
"Lilongwe","Blantyre","Mzuzu","Zomba",
"Balaka","Blantyre","Chikwawa","Chiradzulu","Chitipa","Dedza","Dowa","Karonga","Kasungu",
"Likoma","Machinga","Mangochi","Mchinji","Mulanje","Mwanza","Mzimba","Neno",
"Nkhata Bay","Nkhotakota","Nsanje","Ntcheu","Ntchisi","Phalombe","Rumphi","Salima","Thyolo","Zomba",
"Karonga","Salima","Dedza","Kasungu"
]

const UNIQUE_DISTRICTS = Array.from(new Set(DISTRICTS)).sort()

export default function DriverDashboard(){
  const router = useRouter()
  const [driver,setDriver]=useState<any>(null)
  const [trips,setTrips]=useState<any[]>([])
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
    })()
  },[router])

  const postTrip = async ()=>{
    if(!form.date) return alert("Pick date")
    if(form.from===form.to) return alert("From and To cannot be same district")
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
    alert(`Trip posted: ${form.from} → ${form.to}`)
    location.reload()
  }

  if(!driver) return <div className="min-h-screen grid place-items-center">Loading...</div>

  return(
    <main className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[640px] mx-auto p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0a84ff] text-white rounded-full grid place-items-center font-black">V</div>
            <div><div className="font-black text-[15px]">{driver.full_name} <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">VERIFIED ✓</span></div><div className="text-[12px] opacity-60">{driver.phone}</div></div>
          </div>
          <button onClick={()=>{localStorage.clear(); router.push('/')}} className="text-[11px] font-bold border px-3 py-1.5 rounded-full">Logout</button>
        </div>

        <div className="mt-6 bg-white border rounded-[20px] p-5">
          <h2 className="font-black">Post new trip</h2>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <select value={form.from} onChange={e=>setForm({...form,from:e.target.value})} className="h-[48px] border rounded-[12px] px-3 text-[14px] bg-white">
              {UNIQUE_DISTRICTS.map(d=><option key={"f"+d} value={d}>{d}</option>)}
            </select>
            <select value={form.to} onChange={e=>setForm({...form,to:e.target.value})} className="h-[48px] border rounded-[12px] px-3 text-[14px] bg-white">
              {UNIQUE_DISTRICTS.map(d=><option key={"t"+d} value={d}>{d}</option>)}
            </select>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="h-[48px] border rounded-[12px] px-3 text-[14px]"/>
            <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="h-[48px] border rounded-[12px] px-3 text-[14px]"/>
            <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price MK" className="h-[48px] border rounded-[12px] px-3 text-[14px]"/>
            <input type="number" value={form.seats} onChange={e=>setForm({...form,seats:e.target.value})} placeholder="Seats" className="h-[48px] border rounded-[12px] px-3 text-[14px]"/>
          </div>
          <button onClick={postTrip} disabled={loading} className="mt-4 w-full h-[52px] bg-[#0a84ff] text-white rounded-full font-black text-[15px]">{loading?"Posting...":"Post Trip →"}</button>
        </div>

        <div className="mt-6"><h3 className="font-black">My Trips ({trips.length})</h3></div>
      </div>
    </main>
  )
}