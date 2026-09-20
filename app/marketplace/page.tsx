"use client"
import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import Link from "next/link"

export default function Marketplace(){
  const [trips, setTrips] = useState<any[]>([])
  useEffect(()=>{
    async function load(){
      const { data, error } = await supabase.from('driver_trips').select('*')
      console.log("TRIPS DATA:", data, "ERROR:", error)
      if(data) setTrips(data)
    }
    load()
  },[])
  return (
    <main className="max-w-[720px] mx-auto p-4">
      <h1 className="font-black text-[24px]">Tumani Marketplace</h1>
      <p className="text-[13px] opacity-60">{trips.length} trips • Kasungu ↔ Zomba • Verified drivers only</p>
      <div className="mt-6 space-y-4">
        {trips.map(t=>(
          <div key={t.id} className="bg-white border rounded-[20px] p-4 flex justify-between">
            <div>
              <div className="flex gap-2 items-center"><div className="w-8 h-8 bg-blue-600 text-white rounded-full grid place-items-center font-black text-[12px]">{t.from_city?.[0]}</div><span className="font-black text-[14px]">Verified ✓</span><span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black">⭐ 5.0</span></div>
              <div className="mt-2 font-black">{t.from_city} → {t.to_city}</div>
              <div className="text-[12px] opacity-60">{String(t.date).slice(0,10)} • MK {t.price}</div>
            </div>
            <Link href={`/driver/${t.driver_id}`} className="bg-blue-600 text-white px-5 py-2 rounded-full text-[12px] font-black h-fit self-center">View</Link>
          </div>
        ))}
        {trips.length===0 && <p className="mt-10 font-black opacity-60">Still 0 — check console (F12) → TRIPS DATA</p>}
      </div>
    </main>
  )
}