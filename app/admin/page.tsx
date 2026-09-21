"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"

type Tab = "drivers" | "trips" | "parcels" | "bookings"

export default function AdminDashboard(){
  const [drivers,setDrivers]=useState<any[]>([])
  const [trips,setTrips]=useState<any[]>([])
  const [parcels,setParcels]=useState<any[]>([])
  const [bookings,setBookings]=useState<any[]>([])
  const [tab,setTab]=useState<Tab>("drivers") // start on drivers
  const [filter,setFilter]=useState<"all"|"pending"|"verified">("all")
  const [deleteTarget,setDeleteTarget]=useState<{id:string, type:string} | null>(null)
  const [msg,setMsg]=useState("")

  const isVerified = (d:any) => d.is_verified === true || d.verified === true || d.status === 'verified'

  const load = async ()=>{
    const {data: fromDrivers} = await supabase.from('drivers').select('*').order('created_at',{ascending:false})
    setDrivers(fromDrivers || [])

    const {data: t} = await supabase.from('trips').select('*').order('created_at',{ascending:false})
    if(t) setTrips(t)
    const {data: p} = await supabase.from('parcels').select('*').order('created_at',{ascending:false})
    if(p) setParcels(p)

    const {data: b} = await supabase.from('bookings').select('*').order('created_at',{ascending:false})
    if(b) setBookings(b)
  }

  useEffect(()=>{load()},[])

  const approveDriver = async (id:string)=>{
    // Update ALL possible column names so homepage + login works
    await supabase.from('drivers').update({
      is_verified: true,
      status: 'verified',
      verified: true
    }).eq('id',id);

    setDrivers(prev => prev.map(d => d.id === id? {...d, is_verified: true, status: 'verified', verified: true } : d))
    setMsg("✅ Driver approved — now live on homepage!")
    setTimeout(()=>setMsg(""),3000)
  }

  const rejectDriver = async (id:string)=>{
    await supabase.from('drivers').update({is_verified:false, status:'pending', verified:false}).eq('id',id);
    setDrivers(prev => prev.map(d => d.id === id? {...d, is_verified: false, status: 'pending', verified: false } : d))
    await load()
  }

  const handleDelete = async ()=>{
    if(!deleteTarget) return
    if(deleteTarget.type==='driver') await supabase.from('drivers').delete().eq('id',deleteTarget.id)
    if(deleteTarget.type==='trip') await supabase.from('trips').delete().eq('id',deleteTarget.id)
    if(deleteTarget.type==='parcel') await supabase.from('parcels').delete().eq('id',deleteTarget.id)
    if(deleteTarget.type==='booking') await supabase.from('bookings').delete().eq('id',deleteTarget.id)
    setDeleteTarget(null); load()
  }

  const filteredDrivers = drivers.filter(d=> filter==="all"? true : filter==="pending"?!isVerified(d) : isVerified(d))
  const pendingCount = drivers.filter(d=>!isVerified(d)).length

  return(
    <div className="min-h-screen bg-[#0f1115] text-white flex">
      <div className="hidden md:flex w-[260px] bg-[#171a21] border-r border-white/10 flex-col p-6">
        <div className="flex items-center gap-3"><div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-black">T</div><span className="font-black text-[18px]">Tumani Admin</span></div>
        <div className="mt-8 space-y-1">
          <button onClick={()=>setTab("drivers")} className={`w-full text-left rounded-xl px-4 py-3 font-black text-[13px] ${tab==="drivers"?"bg-white text-black":"text-white/40"}`}>● Drivers {pendingCount>0&&`(${pendingCount} pending)`}</button>
          <button onClick={()=>setTab("trips")} className={`w-full text-left rounded-xl px-4 py-3 font-black text-[13px] ${tab==="trips"?"bg-white text-black":"text-white/40"}`}>Trips ({trips.length})</button>
          <button onClick={()=>setTab("bookings")} className={`w-full text-left rounded-xl px-4 py-3 font-black text-[13px] ${tab==="bookings"?"bg-white text-black":"text-white/40"}`}>Bookings ({bookings.length})</button>
          <button onClick={()=>setTab("parcels")} className={`w-full text-left rounded-xl px-4 py-3 font-black text-[13px] ${tab==="parcels"?"bg-white text-black":"text-white/40"}`}>📦 Parcels ({parcels.length})</button>
        </div>
        <div className="mt-auto pt-6 border-t border-white/10">
          <p className="text-[11px] text-white/30">Prod: 1 verified</p>
          <p className="font-bold text-green-400">{drivers.filter(isVerified).length} LIVE</p>
        </div>
      </div>

      <div className="flex-1">
        {msg && <div className="bg-green-500 text-black font-black text-center py-2 text-[13px]">{msg}</div>}

        {tab==="drivers" && (
          <>
            <div className="h-[64px] bg-[#171a21] border-b border-white/10 flex items-center justify-between px-6">
              <h1 className="font-black text-[18px]">Drivers • {filteredDrivers.length} • {drivers.filter(isVerified).length} LIVE</h1>
              <div className="flex gap-2">
                <button onClick={()=>setFilter("all")} className={`px-4 py-2 rounded-full text-[12px] font-black ${filter==="all"?"bg-white text-black":"bg-white/10"}`}>All</button>
                <button onClick={()=>setFilter("pending")} className={`px-4 py-2 rounded-full text-[12px] font-black ${filter==="pending"?"bg-amber-400 text-black":"bg-white/10"}`}>Pending {pendingCount}</button>
                <button onClick={()=>setFilter("verified")} className={`px-4 py-2 rounded-full text-[12px] font-black ${filter==="verified"?"bg-green-400 text-black":"bg-white/10"}`}>Verified</button>
                <button onClick={load} className="px-4 py-2 rounded-full bg-white/10 text-[12px] font-black">Refresh</button>
              </div>
            </div>
            <div className="px-6 py-6 space-y-3">
              {filteredDrivers.length===0 && <p className="text-white/40">No drivers — you are the only one! Clean prod.</p>}
              {filteredDrivers.map((d:any)=>(
                <div key={d.id} className="bg-[#1c202a] border border-white/10 rounded-2xl p-5 flex justify-between items-center">
                  <div>
                    <p className="font-black">{d.full_name} • {d.vehicle_type || d.route || 'Lilongwe'}</p>
                    <p className="text-[13px] text-white/50">{d.phone} • {d.status} • {d.id.slice(0,8)}</p>
                    {!isVerified(d)?<span className="mt-2 inline-block bg-amber-400 text-black px-2.5 py-1 rounded-full text-[10px] font-black">PENDING</span>:<span className="mt-2 inline-block bg-green-400 text-black px-2.5 py-1 rounded-full text-[10px] font-black">VERIFIED LIVE</span>}
                  </div>
                  <div className="flex gap-2">
                    {!isVerified(d) && <button onClick={()=>approveDriver(d.id)} className="bg-green-500 text-black font-black px-6 py-2.5 rounded-full text-[12px]">Approve → Make Live</button>}
                    {isVerified(d) && <button onClick={()=>rejectDriver(d.id)} className="bg-amber-500/20 text-amber-300 px-4 py-2.5 rounded-full text-[12px] font-black">Unverify</button>}
                    <button onClick={()=>setDeleteTarget({id:d.id,type:'driver'})} className="bg-white/10 px-4 py-2.5 rounded-full text-[12px] font-black">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* trips/bookings/parcels same as before */}
        {tab==="trips" && <div className="px-6 py-6"><h1 className="font-black mb-4">Trips {trips.length}</h1>{trips.map((t:any)=><div key={t.id} className="bg-[#1c202a] border border-white/10 rounded-xl p-4 flex justify-between text-[13px]">{t.from_city||t.route} → {t.to_city} • MK {t.price}<button onClick={()=>setDeleteTarget({id:t.id,type:'trip'})} className="bg-white/10 px-3 py-1 rounded-full text-[12px]">Delete</button></div>)}</div>}
        {tab==="bookings" && <div className="px-6 py-6"><h1 className="font-black mb-4">Bookings {bookings.length}</h1>{bookings.map((b:any)=><div key={b.id} className="bg-[#1c202a] border border-white/10 rounded-xl p-4 flex justify-between text-[13px]">{b.customer_name} • {b.customer_phone}<button onClick={()=>setDeleteTarget({id:b.id,type:'booking'})} className="bg-white/10 px-3 py-1 rounded-full text-[12px]">Delete</button></div>)}</div>}
        {tab==="parcels" && <div className="px-6 py-6"><h1 className="font-black mb-4">Parcels {parcels.length}</h1>{parcels.map((p:any)=><div key={p.id} className="bg-[#1c202a] border border-white/10 rounded-xl p-4 flex justify-between text-[13px]">{p.description||p.title} • {p.status}<button onClick={()=>setDeleteTarget({id:p.id,type:'parcel'})} className="bg-white/10 px-3 py-1 rounded-full text-[12px]">Delete</button></div>)}</div>}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-6">
          <div className="bg-[#1c202a] border border-white/10 rounded-[24px] p-7 max-w-[380px] w-full text-center">
            <h3 className="font-black text-[18px]">Delete this {deleteTarget.type}?</h3>
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