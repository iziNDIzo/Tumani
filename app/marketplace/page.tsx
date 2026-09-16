"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

export default function MarketplacePage(){
  const [trips,setTrips]=useState<any[]>([])
  const [search,setSearch]=useState("")
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  useEffect(()=>{ supabase.from('trips').select('*').eq('verified',true).order('created_at',{ascending:false}).then(({data})=>data&&setTrips(data)) },[])
  const filtered = trips.filter((t:any)=> `${t.from_city} ${t.to_city} ${t.driver_name}`.toLowerCase().includes(search.toLowerCase()))

  return(
    <div className="bg-white min-h-screen">
      <div className="max-w-300 mx-auto p-4 md:p-8 bg-white">
        <h1 className="text-[32px] font-black text-black leading-none">Find your ride across Malawi</h1>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Lilongwe, Blantyre, Mzuzu..." className="mt-6 w-full max-w-[420px] h-[52px] bg-white border-2 border-black/10 rounded-full px-6 text-[14px] font-black text-black placeholder:text-black/40 outline-none focus:border-black"/>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((t:any)=>(
            <div key={t.id} className="bg-white rounded-[20px] p-5 border-2 border-black/10 shadow-sm">
              <Link href={`/trip/${t.id}`} className="block">
                <p className="font-black text-[13px] text-black">{t.driver_name} <span className="ml-2 bg-green-500 text-white text-[10px] px-3 py-1 rounded-full">✓ Verified</span></p>
                <p className="font-black text-[22px] text-black mt-2">{t.from_city} → {t.to_city}</p>
                <p className="text-[12px] font-bold text-black/60 mt-1">{t.date} • {t.time} • Hilux • {t.plate}</p>
                <p className="font-black text-[24px] text-black mt-3">MK {Number(t.seat_price).toLocaleString()}</p>
                <div className="mt-4 h-60 rounded-[14px] overflow-hidden bg-gray-50 border border-black/5"><img src={t.vehicle_url} className="w-full h-full object-cover"/></div>
              </Link>
              <a href={`https://wa.me/${t.whatsapp?.replace(/[^0-9]/g,'')}`} target="_blank" className="mt-4 w-full bg-[#22c55e] text-white font-black py-4 rounded-full flex justify-center">WhatsApp {t.driver_name?.split(' ')[0]}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}