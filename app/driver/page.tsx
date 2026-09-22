"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

const ALL_DISTRICTS = ["Balaka","Blantyre","Chikwawa","Chiradzulu","Chitipa","Dedza","Dowa","Karonga","Kasungu","Likoma","Lilongwe","Machinga","Mangochi","Mchinji","Mulanje","Mwanza","Mzimba","Mzuzu","Neno","Nkhata Bay","Nkhotakota","Nsanje","Ntcheu","Ntchisi","Phalombe","Rumphi","Salima","Thyolo","Zomba"].sort()

function SearchSelect({value,onChange,placeholder}:{value:string,onChange:(v:string)=>void,placeholder:string}){
  const [open,setOpen]=useState(false)
  const [q,setQ]=useState(value)
  useEffect(()=>setQ(value),[value])
  const filtered = ALL_DISTRICTS.filter(d=> d.toLowerCase().includes(q.toLowerCase()))
  return(
    <div className="relative">
      <input value={q} onChange={e=>{setQ(e.target.value); setOpen(true)}} onFocus={()=>setOpen(true)} placeholder={placeholder} className="w-full h-[48px] border border-black/15 rounded-[12px] px-3 text-[14px] bg-white outline-none focus:border-[#0a84ff] focus:ring-2 focus:ring-[#0a84ff]/20"/>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-[220px] overflow-auto bg-white border border-black/10 rounded-[12px] shadow-xl">
          {filtered.length? filtered.map(d=>(
            <div key={d} onClick={()=>{onChange(d); setQ(d); setOpen(false)}} className={`px-3 py-2.5 text-[13px] cursor-pointer hover:bg-black/[0.04] ${value===d?'bg-[#0a84ff] text-white font-bold':''}`}>{d}</div>
          )) : <div className="px-3 py-3 text-[12px] opacity-50">No district found</div>}
        </div>
      )}
      {open && <div className="fixed inset-0 z-40" onClick={()=>setOpen(false)}/>}
    </div>
  )
}

export default function DriverDashboard(){
  const router=useRouter()
  const [driver,setDriver]=useState<any>(null)
  const [trips,setTrips]=useState<any[]>([])
  const [loading,setLoading]=useState(false)
  const [form,setForm]=useState({from:"Lilongwe",to:"Blantyre",date:"",time:"06:00",price:"35000",seats:"4"})

  useEffect(()=>{
    const id=localStorage.getItem('tumani_driver_id')
    if(!id){router.push('/login'); return}
    ;(async()=>{
      const {data:d}=await supabase.from('drivers').select('*').eq('id',id).single()
      if(d) setDriver(d)
      const {data:t}=await supabase.from('trips').select('*').eq('driver_id',id).order('created_at',{ascending:false})
      if(t) setTrips(t)
    })()
  },[router])

  const postTrip=async()=>{
    if(!form.date) return alert("Pick date")
    if(form.from===form.to) return alert("From and To same")
    setLoading(true)
    const id=localStorage.getItem('tumani_driver_id')
    const iso=`${form.date}T${form.time}:00`
    // FIXED: only 'seats' not 'seats_available'
    const {error}=await supabase.from('trips').insert({
      driver_id:id,
      from_city:form.from,
      to_city:form.to,
      date:iso,
      price:Number(form.price),
      seats:Number(form.seats),
      status:'active'
    })
    if(error){alert(error.message); setLoading(false); return}
    alert(`Posted: ${form.from} → ${form.to}`)
    location.reload()
  }

  if(!driver) return <div className="min-h-screen grid place-items-center">Loading...</div>

  return(
    <main className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[640px] mx-auto p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-[#0a84ff] text-white rounded-full grid place-items-center font-black">V</div><div><div className="font-black text-[15px]">{driver.full_name}</div><div className="text-[12px] opacity-60">{driver.phone}</div></div></div>
          <button onClick={()=>{localStorage.clear(); router.push('/')}} className="text-[11px] font-bold border px-3 py-1.5 rounded-full">Logout</button>
        </div>
        <div className="mt-6 bg-white border rounded-[20px] p-5 shadow-sm">
          <h2 className="font-black text-[16px]">Post new trip</h2>
          <p className="text-[11px] opacity-50 mt-1">Type to search: e.g. "Sa" → Salima</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <SearchSelect value={form.from} onChange={v=>setForm({...form,from:v})} placeholder="From"/>
            <SearchSelect value={form.to} onChange={v=>setForm({...form,to:v})} placeholder="To"/>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="h-[48px] border rounded-[12px] px-3 text-[14px]"/>
            <input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="h-[48px] border rounded-[12px] px-3 text-[14px]"/>
            <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price MK" className="h-[48px] border rounded-[12px] px-3 text-[14px]"/>
            <input type="number" value={form.seats} onChange={e=>setForm({...form,seats:e.target.value})} placeholder="Seats" className="h-[48px] border rounded-[12px] px-3 text-[14px]"/>
          </div>
          <button onClick={postTrip} disabled={loading} className="mt-4 w-full h-[52px] bg-[#0a84ff] text-white rounded-full font-black text-[15px]">{loading?"Posting...":"Post Trip →"}</button>
        </div>
        <div className="mt-6"><h3 className="font-black text-[14px]">My Trips ({trips.length})</h3></div>
      </div>
    </main>
  )
}