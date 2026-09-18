"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

export default function MarketplacePage(){
  const [trips,setTrips]=useState<any[]>([])
  const [err,setErr]=useState("")
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(()=>{
    (async()=>{
      const { data, error } = await supabase.from('trips').select('*').order('created_at',{ascending:false})
      console.log("TRIPS RAW:", data, error)
      if(error) setErr(error.message)
      if(data) setTrips(data)
    })()
  },[])

  return(
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-[24px] font-black">Find your ride across Malawi — {trips.length} rides {err && `— ERR: ${err}`}</h1>

        {trips.length===0 &&!err && <p className="mt-10 font-bold text-black/40">Loading... check console F12</p>}
        {err && <p className="mt-4 bg-red-100 p-4 rounded-xl font-bold text-red-600">{err}</p>}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.map(t=>(
            <div key={t.id} className="border-2 border-black/10 rounded-[20px] p-5">
              <p className="font-black text-[20px]">{t.from_city} → {t.to_city}</p>
              <p className="text-[12px] font-bold mt-1">{t.date} • {t.seats} seats • {t.status}</p>
              <p className="font-black text-[22px] mt-2">MK {Number(t.price).toLocaleString()}</p>
              <div className="text-[10px] text-gray-400 mt-2">{t.id.slice(0,8)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}