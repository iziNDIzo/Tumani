"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export default function MarketplacePage(){
  const [trips,setTrips]=useState<any[]>([])
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(()=>{
    supabase.from('trips').select('*, drivers(full_name, phone)').order('created_at',{ascending:false}).then(({data})=>{
      if(data) setTrips(data)
    })
  },[])

  return(
    <div className="min-h-screen bg-[#fafaf9] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-[26px] font-black tracking-tight">Find your ride across Malawi — {trips.length} rides</h1>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(t=>(
            <div key={t.id} className="bg-white border-2 border-black/10 rounded-[24px] p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <p className="font-black text-[12px]">{t.drivers?.full_name || 'Verified Driver'} ✓</p>
                <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-1 rounded-full">ACTIVE</span>
              </div>
              <p className="font-black text-[20px] mt-3">{t.from_city} → {t.to_city}</p>
              <p className="text-[13px] font-bold mt-2 opacity-70">{t.date} • {t.seats || 4} seats • {t.time || 'Anytime'}</p>
              <p className="font-black text-[24px] mt-3">MK {Number(t.price).toLocaleString()}</p>
              <a href={`https://wa.me/${(t.drivers?.phone||'265').replace(/[^0-9]/g,'')}?text=Hi, I want to book ${t.from_city} to ${t.to_city} on ${t.date}`} target="_blank" className="mt-5 block bg-[#22c55e] hover:bg-[#16a34a] text-white text-center font-black py-3 rounded-full">WhatsApp Driver</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}