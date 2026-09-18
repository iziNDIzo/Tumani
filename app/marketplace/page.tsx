"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

export default function MarketplacePage(){
  const [trips,setTrips]=useState<any[]>([])
  const [search,setSearch]=useState("")
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(()=>{
    // NO FILTERS - show everything newest first
    supabase.from('trips').select('*, drivers(full_name, phone)').order('created_at',{ascending:false}).then(({data,error})=>{
      console.log("ALL TRIPS:", data, error)
      if(data) setTrips(data)
    })
  },[])

  const filtered = trips.filter(t => `${t.from_city} ${t.to_city}`.toLowerCase().includes(search.toLowerCase()))

  return(
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-[28px] font-black">Find your ride across Malawi — {trips.length} rides</h1>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="mt-4 w-full max-w-[400px] h-[48px] border-2 border-black/10 rounded-full px-6 font-bold" />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map(t=>(
            <div key={t.id} className="border-2 border-black/10 rounded-[20px] p-5">
              <p className="font-black text-[12px]">{t.drivers?.full_name || t.driver_name || 'Victor'} ✓ Verified</p>
              <p className="font-black text-[20px] mt-2">{t.from_city} → {t.to_city}</p>
              <p className="text-[12px] text-black/60 font-bold mt-1">{t.date} • {t.seats} seats</p>
              <p className="font-black text-[22px] mt-2">MK {Number(t.price).toLocaleString()}</p>
              <div className="text-[10px] text-gray-400 mt-1">{t.status} • {new Date(t.created_at).toLocaleDateString()}</div>
              <a href={`https://wa.me/${(t.drivers?.phone||'').replace(/[^0-9]/g,'')}`} target="_blank" className="mt-4 block bg-[#22c55e] text-white text-center font-black py-3 rounded-full">WhatsApp</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}