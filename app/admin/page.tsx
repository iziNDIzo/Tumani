"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient" // use your lib

type Tab = "drivers" | "trips" | "parcels"

export default function AdminDashboard(){
  const [drivers,setDrivers]=useState<any[]>([])
  const [trips,setTrips]=useState<any[]>([])
  const [parcels,setParcels]=useState<any[]>([])
  const [tab,setTab]=useState<Tab>("drivers")
  const [filter,setFilter]=useState<"all"|"pending"|"verified">("all")
  const [selected,setSelected]=useState<any>(null)
  const [viewImg,setViewImg]=useState<string|null>(null)
  const [deleteTarget,setDeleteTarget]=useState<{id:string, type:string} | null>(null) // no more confirm()
  const [msg,setMsg]=useState("")

  const load = async ()=>{
    const {data: d} = await supabase.from('drivers').select('*').order('created_at',{ascending:false})
    if(d) setDrivers(d)
    const {data: t} = await supabase.from('trips').select('*').order('created_at',{ascending:false})
    if(t) setTrips(t)
    const {data: p} = await supabase.from('parcels').select('*').order('created_at',{ascending:false})
    if(p) setParcels(p)
  }
  useEffect(()=>{load()},[])

  const approveDriver = async (id:string)=>{
    const { error } = await supabase.from('drivers').update({verified:true}).eq('id',id);
    if(error){ setMsg("❌ "+error.message); return }
    
    // Update UI instantly - no more PENDING stuck
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, verified: true } : d))
    setMsg("✅ Driver approved — now live!"); 
    setSelected(null)
    setTimeout(()=>setMsg(""),3000)
    await load() // reload from DB to be sure
  }
  const rejectDriver = async (id:string)=>{
    await supabase.from('drivers').update({verified:false}).eq('id',id);
    setDrivers(prev => prev.map(d => d.id === id ? { ...d, verified: false } : d))
    setSelected(null)
    await load()
  }
  const handleDelete = async ()=>{
    if(!deleteTarget) return
    if(deleteTarget.type==='driver') await supabase.from('drivers').delete().eq('id',deleteTarget.id)
    if(deleteTarget.type==='trip') await supabase.from('trips').delete().eq('id',deleteTarget.id)
    if(deleteTarget.type==='parcel') await supabase.from('parcels').delete().eq('id',deleteTarget.id)
    setDeleteTarget(null); load()
  }

  const filteredDrivers = drivers.filter(d=> filter==="all"? true : filter==="pending"?!d.verified : d.verified)
  const pendingCount = drivers.filter(d=>!d.verified).length

  return(
    <div className="min-h-screen bg-[#0f1115] text-white flex">
      <div className="hidden md:flex w-[260px] bg-[#171a21] border-r border-white/10 flex-col p-6">
        <div className="flex items-center gap-3"><div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-black">T</div><span className="font-black text-[18px]">Tumani Admin</span></div>
        <div className="mt-8 space-y-1">
          <button onClick={()=>setTab("drivers")} className={`w-full text-left rounded-xl px-4 py-3 font-black text-[13px] ${tab==="drivers"?"bg-white text-black":"text-white/40"}`}>● Drivers {pendingCount>0&&`(${pendingCount} pending)`}</button>
          <button onClick={()=>setTab("trips")} className={`w-full text-left rounded-xl px-4 py-3 font-black text-[13px] ${tab==="trips"?"bg-white text-black":"text-white/40"}`}>Trips ({trips.length})</button>
          <button onClick={()=>setTab("parcels")} className={`w-full text-left rounded-xl px-4 py-3 font-black text-[13px] ${tab==="parcels"?"bg-white text-black":"text-white/40"}`}>📦 Parcels ({parcels.length})</button>
        </div>
      </div>

      <div className="flex-1">
        {msg && <div className="bg-green-500 text-black font-black text-center py-2 text-[13px]">{msg}</div>}

        {tab==="drivers" && (
          <>
            <div className="h-[64px] bg-[#171a21] border-b border-white/10 flex items-center justify-between px-6">
              <h1 className="font-black text-[18px]">Driver Verifications • {filteredDrivers.length}</h1>
              <div className="flex gap-2">
                <button onClick={()=>setFilter("all")} className={`px-4 py-2 rounded-full text-[12px] font-black ${filter==="all"?"bg-white text-black":"bg-white/10"}`}>All</button>
                <button onClick={()=>setFilter("pending")} className={`px-4 py-2 rounded-full text-[12px] font-black ${filter==="pending"?"bg-amber-400 text-black":"bg-white/10"}`}>Pending {pendingCount}</button>
                <button onClick={()=>setFilter("verified")} className={`px-4 py-2 rounded-full text-[12px] font-black ${filter==="verified"?"bg-green-400 text-black":"bg-white/10"}`}>Verified</button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-3">
              {filteredDrivers.map((d:any)=>(
                <div key={d.id} className="bg-[#1c202a] border border-white/10 rounded-2xl p-5 flex justify-between items-center">
                  <div>
                    <p className="font-black">{d.full_name} • {d.vehicle_type}</p>
                    <p className="text-[13px] text-white/50">{d.email} • {d.phone} • {d.registration_number}</p>
                    {!d.verified?<span className="mt-2 inline-block bg-amber-400 text-black px-2.5 py-1 rounded-full text-[10px] font-black">PENDING - as in your screenshot</span>:<span className="mt-2 inline-block bg-green-400 text-black px-2.5 py-1 rounded-full text-[10px] font-black">VERIFIED</span>}
                  </div>
                  <div className="flex gap-2">
                    {!d.verified && <button onClick={()=>approveDriver(d.id)} className="bg-green-500 text-black font-black px-6 py-2.5 rounded-full text-[12px]">Approve → Make Live</button>}
                    <button onClick={()=>setDeleteTarget({id:d.id,type:'driver'})} className="bg-white/10 px-4 py-2.5 rounded-full text-[12px] font-black">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* keep your trips/parcels tabs same but change confirm to setDeleteTarget */}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-6">
          <div className="bg-[#1c202a] border border-white/10 rounded-[24px] p-7 max-w-[380px] w-full text-center">
            <h3 className="font-black text-[18px]">Delete this {deleteTarget.type}?</h3>
            <p className="text-white/50 text-[13px] mt-2">This action cannot be undone. It will be removed from Supabase permanently.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setDeleteTarget(null)} className="flex-1 h-[48px] bg-white/10 rounded-full font-black">Cancel</button>
              <button onClick={handleDelete} className="flex-1 h-[48px] bg-red-500 text-white rounded-full font-black">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}