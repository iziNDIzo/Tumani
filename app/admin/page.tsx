"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

type Tab = "trips" | "parcels"

export default function AdminDashboard(){
  const [trips,setTrips]=useState<any[]>([])
  const [parcels,setParcels]=useState<any[]>([])
  const [tab,setTab]=useState<Tab>("trips")
  const [selected,setSelected]=useState<any>(null)
  const [viewImg,setViewImg]=useState<string|null>(null)
  const [filter,setFilter]=useState<"all"|"pending"|"verified">("all")
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const load = async ()=>{
    const {data: t} = await supabase.from('trips').select('*').order('created_at',{ascending:false})
    if(t) setTrips(t)
    const {data: p} = await supabase.from('parcels').select('*').order('created_at',{ascending:false})
    if(p) setParcels(p)
  }
  useEffect(()=>{load()},[])

  const approve = async (id:string)=>{ await supabase.from('trips').update({verified:true}).eq('id',id); load(); setSelected(null) }
  const reject = async (id:string)=>{ await supabase.from('trips').update({verified:false}).eq('id',id); load(); setSelected(null) }
  const delTrip = async (id:string)=>{ if(confirm("Permanently delete?")){ await supabase.from('trips').delete().eq('id',id); load(); setSelected(null) } }
  const delParcel = async (id:string)=>{ if(confirm("Delete parcel job?")){ await supabase.from('parcels').delete().eq('id',id); load() } }

  const filteredTrips = trips.filter(t=> filter==="all"? true : filter==="pending"?!t.verified : t.verified)
  const pendingCount = trips.filter(t=>!t.verified).length
  const verifiedCount = trips.filter(t=>t.verified).length

  return(
    <div className="min-h-screen bg-[#0f1115] text-white flex">
      <div className="hidden md:flex w-[260px] bg-[#171a21] border-r border-white/10 flex-col p-6">
        <div className="flex items-center gap-3"><div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-black">T</div><span className="font-black text-[18px]">Tumani Admin</span></div>
        <div className="mt-8 space-y-1">
          <button onClick={()=>setTab("trips")} className={`w-full text-left rounded-xl px-4 py-3 font-black text-[13px] ${tab==="trips"?"bg-white text-black":"text-white/40"}`}>● Verifications {pendingCount>0&&`(${pendingCount})`}</button>
          <button onClick={()=>setTab("parcels")} className={`w-full text-left rounded-xl px-4 py-3 font-black text-[13px] ${tab==="parcels"?"bg-white text-black":"text-white/40"}`}>📦 Parcel Jobs ({parcels.length})</button>
        </div>
        <div className="mt-auto text-[11px] text-white/30 font-bold">Admin Mode • Lilongwe</div>
      </div>

      <div className="flex-1">
        {tab==="trips"? (
          <>
            <div className="h-[64px] bg-[#171a21] border-b border-white/10 flex items-center justify-between px-6">
              <h1 className="font-black text-[18px]">Driver Verification Queue</h1>
              <div className="flex gap-2">
                <button onClick={()=>setFilter("all")} className={`px-4 py-2 rounded-full text-[12px] font-black ${filter==="all"?"bg-white text-black":"bg-white/10 text-white/60"}`}>All {trips.length}</button>
                <button onClick={()=>setFilter("pending")} className={`px-4 py-2 rounded-full text-[12px] font-black ${filter==="pending"?"bg-amber-400 text-black":"bg-white/10 text-white/60"}`}>Pending {pendingCount}</button>
                <button onClick={()=>setFilter("verified")} className={`px-4 py-2 rounded-full text-[12px] font-black ${filter==="verified"?"bg-green-400 text-black":"bg-white/10 text-white/60"}`}>Verified {verifiedCount}</button>
                <button onClick={load} className="ml-2 px-4 py-2 rounded-full bg-white/10 text-[12px] font-black">Refresh</button>
              </div>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4">
              <div className="bg-[#1c202a] border border-white/10 rounded-2xl p-5"><p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Total Submissions</p><p className="text-[32px] font-black mt-2">{trips.length}</p></div>
              <div className="bg-[#1c202a] border border-amber-500/20 rounded-2xl p-5"><p className="text-[11px] font-bold text-amber-300/60 uppercase tracking-widest">Needs Review</p><p className="text-[32px] font-black mt-2 text-amber-400">{pendingCount}</p></div>
              <div className="bg-[#1c202a] border border-green-500/20 rounded-2xl p-5"><p className="text-[11px] font-bold text-green-300/60 uppercase tracking-widest">Live in Marketplace</p><p className="text-[32px] font-black mt-2 text-green-400">{verifiedCount}</p></div>
            </div>
            <div className="px-6 pb-20">
              <div className="bg-[#1c202a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 text-[11px] font-black text-white/30 uppercase tracking-widest px-6 py-4 border-b border-white/10"><div className="col-span-4">Driver & Route</div><div className="col-span-2">Price / Vehicle</div><div className="col-span-3">Documents</div><div className="col-span-3">Action</div></div>
                {filteredTrips.map((t:any)=>(
                  <div key={t.id} onClick={()=>setSelected(t)} className="grid grid-cols-12 px-6 py-5 border-b border-white/5 hover:bg-white/[0.04] cursor-pointer items-center">
                    <div className="col-span-4"><p className="font-black text-[14px]">{t.driver_name}</p><p className="text-[13px] font-bold text-white/60 mt-1">{t.from_city} → {t.to_city}</p><p className="text-[11px] text-white/30 mt-1 font-mono">{t.id.slice(0,8)} • {t.date}</p>{!t.verified?<span className="mt-2 inline-block bg-amber-400 text-black px-2.5 py-1 rounded-full text-[10px] font-black">PENDING</span>:<span className="mt-2 inline-block bg-green-400 text-black px-2.5 py-1 rounded-full text-[10px] font-black">VERIFIED</span>}</div>
                    <div className="col-span-2"><p className="font-black text-[14px]">MK {Number(t.seat_price).toLocaleString()}</p><p className="text-[12px] font-bold text-white/50 mt-1">{t.vehicle || 'Sedan'} • {t.plate}</p><p className="text-[11px] text-white/30 mt-1">{t.whatsapp}</p></div>
                    <div className="col-span-3 flex gap-2">{[{u:t.selfie_id_url||t.selfie_url},{u:t.license_url},{u:t.vehicle_url}].map((d,i)=><div key={i} className={`w-[52px] h-[52px] rounded-xl border overflow-hidden bg-black ${d.u?"border-white/20":"border-red-500/30"}`}>{d.u?<img src={d.u} className="w-full h-full object-cover"/>:<div className="w-full h-full flex items-center justify-center text-[9px] font-black text-red-400">MISSING</div>}</div>)}</div>
                    <div className="col-span-3 flex gap-2" onClick={e=>e.stopPropagation()}>{!t.verified && <button onClick={()=>approve(t.id)} className="bg-green-500 text-black font-black px-5 py-2.5 rounded-full text-[12px]">Approve</button>}<button onClick={()=>delTrip(t.id)} className="bg-white/10 text-white/60 font-black px-4 py-2.5 rounded-full text-[12px]">Delete</button></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="p-6">
            <h1 className="font-black text-[18px] mb-6">Parcel Jobs • {parcels.length}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parcels.map((j:any)=>(
                <div key={j.id} className="bg-[#1c202a] border border-white/10 rounded-2xl p-5">
                  <div className="flex justify-between"><span className="text-[10px] font-black uppercase bg-white/10 px-2 py-1 rounded-full">{j.status}</span><span className="font-mono text-[11px] text-violet-400">{j.tracking_id}</span></div>
                  <p className="font-black mt-3">{j.pickup_address || 'Pickup'} → {j.delivery_address}</p>
                  <p className="text-[13px] text-white/50 mt-1">{j.description}</p>
                  <p className="font-black text-[18px] mt-2">MK {Number(j.fee).toLocaleString()} • {j.claimed_by?`Claimed by ${j.claimed_by.slice(0,6)}`:'Unclaimed'}</p>
                  <button onClick={()=>delParcel(j.id)} className="mt-4 bg-white/10 px-4 py-2 rounded-full text-[12px] font-black">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end" onClick={()=>setSelected(null)}>
          <div className="w-full max-w-[520px] bg-[#171a21] h-full border-l border-white/10 p-7 overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between"><h2 className="text-[22px] font-black">{selected.driver_name}</h2><button onClick={()=>setSelected(null)} className="w-9 h-9 bg-white/10 rounded-full font-black">×</button></div>
            <div className="mt-7 space-y-5">{[{label:"Selfie holding ID",url:selected.selfie_id_url||selected.selfie_url},{label:"Driver License",url:selected.license_url},{label:"Vehicle Photo",url:selected.vehicle_url}].map((doc,i)=>(<div key={i} className="bg-[#1c202a] rounded-2xl border border-white/10 p-4"><div className="flex justify-between"><p className="font-black text-[13px]">{doc.label}</p><button onClick={()=>doc.url && setViewImg(doc.url)} className="text-blue-400 font-black text-[11px] underline">View Full</button></div><div className="mt-3 h-[220px] bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">{doc.url? <img src={doc.url} className="w-full h-full object-contain" onClick={()=>setViewImg(doc.url)}/> : <p className="text-red-400 font-black text-[12px]">NO IMAGE</p>}</div></div>))}</div>
            <div className="mt-8 flex gap-3">{!selected.verified? <><button onClick={()=>approve(selected.id)} className="flex-1 bg-green-500 text-black font-black py-4 rounded-full text-[14px]">✓ Approve & Make Live</button><button onClick={()=>delTrip(selected.id)} className="flex-1 bg-white/10 text-white font-black py-4 rounded-full text-[14px]">Reject & Delete</button></> : <><button onClick={()=>reject(selected.id)} className="flex-1 bg-amber-400 text-black font-black py-4 rounded-full">Unverify</button><button onClick={()=>delTrip(selected.id)} className="flex-1 bg-red-500/20 text-red-300 font-black py-4 rounded-full">Delete</button></>}</div>
          </div>
        </div>
      )}
      {viewImg && <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-6" onClick={()=>setViewImg(null)}><img src={viewImg} className="max-w-full max-h-full rounded-2xl"/><button className="absolute top-6 right-6 w-10 h-10 bg-white text-black rounded-full font-black">×</button></div>}
    </div>
  )
}