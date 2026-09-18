"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Tab = 'jobs' | 'rides'

export default function MarketplacePage(){
  const [trips,setTrips]=useState<any[]>([])
  const [jobs,setJobs]=useState<any[]>([])
  const [search,setSearch]=useState("")
  const [tab,setTab]=useState<Tab>('rides')
  const [user,setUser]=useState<any>(null)
  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=> setUser(data.user))

    // FIXED: status=active, not verified=true + join drivers to get name/phone
    supabase.from('trips').select('*, drivers(full_name, phone)').eq('status','active').order('created_at',{ascending:false}).then(({data})=>{
      console.log("TRIPS:", data)
      if(data) setTrips(data)
    })

    supabase.from('parcels').select('*').eq('status','ready_for_pickup').order('created_at',{ascending:false}).then(({data})=>data&&setJobs(data))

    const channel = supabase.channel('parcels-live')
  .on('postgres_changes',{event:'INSERT', schema:'public', table:'parcels'}, payload=>{
        if(payload.new.status==='ready_for_pickup') setJobs(prev=>[payload.new,...prev])
      })
  .on('postgres_changes',{event:'UPDATE', schema:'public', table:'parcels'}, payload=>{
        if(payload.new.status!=='ready_for_pickup') setJobs(prev=>prev.filter(j=>j.id!==payload.new.id))
      })
  .subscribe()
    return ()=>{ supabase.removeChannel(channel) }
  },[])

  const filteredTrips = trips.filter((t:any)=> `${t.from_city} ${t.to_city} ${t.drivers?.full_name}`.toLowerCase().includes(search.toLowerCase()))
  const filteredJobs = jobs.filter((j:any)=> `${j.delivery_address} ${j.pickup_address} ${j.description} ${j.tracking_id}`.toLowerCase().includes(search.toLowerCase()))

  const claimJob = async (id:string)=>{
    const {data:{user: currentUser}} = await supabase.auth.getUser()
    if(!currentUser){
      router.push("/auth")
      return
    }
    const {error} = await supabase.from('parcels').update({status:'claimed', claimed_by: currentUser.id, claimed_at: new Date().toISOString()}).eq('id',id)
    if(!error) setJobs(prev=>prev.filter(j=>j.id!==id))
    else alert(error.message)
  }

  const handleLogout = async ()=>{
    await supabase.auth.signOut()
    setUser(null)
    router.push("/auth")
  }

  const badge = (type:string)=>{
    if(type==='parcel') return 'bg-[#e8f0fe] text-[#1a73e8] border-[#1a73e8]/20'
    if(type==='errand') return 'bg-[#f5f3ff] text-[#7c3aed] border-[#7c3aed]/20'
    return 'bg-black text-white border-black'
  }

  return(
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto p-4 md:p-8 bg-white">
        <div className="flex justify-between items-center">
          <h1 className="text-[32px] font-black text-black leading-none tracking-tight">Find your ride across Malawi</h1>
          {user && <button onClick={handleLogout} className="px-5 py-2.5 bg-black text-white rounded-full font-black text-[12px]">Logout</button>}
        </div>
        <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Lilongwe, Blantyre, Mzuzu..." className="w-full max-w-[420px] h-[52px] bg-white border-2 border-black/10 rounded-full px-6 text-[14px] font-bold text-black placeholder:text-black/40 outline-none focus:border-[#7c3aed]/30 focus:ring-2 focus:ring-[#7c3aed]/10"/>
          <div className="flex gap-2 bg-[#f6f7f9] p-1 rounded-full w-fit">
            <button onClick={()=>setTab('jobs')} className={`px-6 py-2.5 rounded-full font-black text-[13px] ${tab==='jobs'?'bg-black text-white':'text-black/60'}`}>Jobs <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-[#7c3aed] text-white">{jobs.length}</span></button>
            <button onClick={()=>setTab('rides')} className={`px-6 py-2.5 rounded-full font-black text-[13px] ${tab==='rides'?'bg-black text-white':'text-black/60'}`}>Rides <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-black text-white">{trips.length}</span></button>
          </div>
        </div>

        {tab==='jobs' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((j:any)=>(
              <div key={j.id} className="bg-white rounded-[20px] p-5 border-2 border-black/10 shadow-sm">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${badge(j.job_type)}`}>{j.job_type}</span>
                  <span className="font-mono text-[11px] font-bold text-[#7c3aed] bg-[#f5f3ff] px-2 py-1 rounded-full">{j.tracking_id}</span>
                </div>
                <p className="font-black text-[18px] text-black mt-3 leading-tight">{j.pickup_address? `${j.pickup_address} → ${j.delivery_address}` : `→ ${j.delivery_address}`}</p>
                <p className="text-[13px] font-medium text-black/60 mt-1">{j.description}</p>
                <p className="font-black text-[22px] text-black mt-3">MK {Number(j.fee).toLocaleString()}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={()=>claimJob(j.id)} className="flex-1 bg-[#1a73e8] hover:bg-black text-white font-black py-3 rounded-full text-[14px] transition-colors">
                    {user? "Claim Job" : "Login to Claim"}
                  </button>
                  <a href={`https://wa.me/${j.recipient_phone?.replace(/[^0-9]/g,'')}`} target="_blank" className="px-5 bg-[#22c55e] text-white font-black py-3 rounded-full text-[14px]">WA</a>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==='rides' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.length===0 && <div className="col-span-2 text-center py-20 font-black text-black/30">No active trips yet — post one from /drive</div>}
            {filteredTrips.map((t:any)=>(
              <div key={t.id} className="bg-white rounded-[20px] p-5 border-2 border-black/10 shadow-sm">
                <Link href={`/trip/${t.id}`} className="block">
                  <p className="font-black text-[13px] text-black">{t.drivers?.full_name || 'Driver'} <span className="ml-2 bg-green-500 text-white text-[10px] px-3 py-1 rounded-full">✓ Verified</span></p>
                  <p className="font-black text-[22px] text-black mt-2">{t.from_city} → {t.to_city}</p>
                  <p className="text-[12px] font-bold text-black/50 mt-1">{t.date} • {t.time} • {t.seats} seats</p>
                  <p className="font-black text-[24px] text-black mt-3">MK {Number(t.price).toLocaleString()}</p>
                </Link>
                <a href={`https://wa.me/${(t.drivers?.phone || '').replace(/[^0-9]/g,'')}`} target="_blank" className="mt-4 w-full bg-[#22c55e] text-white font-black py-4 rounded-full flex justify-center">WhatsApp Driver</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}